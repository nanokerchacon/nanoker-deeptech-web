"use strict";

const fs = require("node:fs/promises");
const nodemailer = require("nodemailer");
const { IncomingForm } = require("formidable");

const rateLimitStore = new Map();
let cachedTransporter = null;

const ALLOWED_ATTACHMENT_EXTENSIONS = new Set(["pdf", "dwg", "step", "stp", "png", "jpg", "jpeg"]);
const MAX_TOTAL_ATTACHMENT_SIZE = 5 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

function getEnvConfig() {
  return {
    SMTP_HOST: process.env.SMTP_HOST || "smtp.office365.com",
    SMTP_PORT: Number(process.env.SMTP_PORT || 587),
    SMTP_USER: process.env.SMTP_USER || "",
    SMTP_PASS: process.env.SMTP_PASS || "",
    MAIL_TO: process.env.MAIL_TO || "",
  };
}

function assertEnvConfig() {
  const env = getEnvConfig();
  const missing = Object.entries(env)
    .filter(([, value]) => value === "" || Number.isNaN(value))
    .map(([key]) => key);

  if (missing.length) {
    const error = new Error(`Missing required environment variables: ${missing.join(", ")}`);
    error.statusCode = 500;
    throw error;
  }

  return env;
}

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  const env = assertEnvConfig();

  cachedTransporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  return cachedTransporter;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeText(value, maxLength = 4000) {
  return String(value || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizeMultilineText(value, maxLength = 12000) {
  return String(value || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim()
    .slice(0, maxLength);
}

function sanitizeEmail(value) {
  const email = sanitizeText(value, 320).toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    const error = new Error("Invalid email address.");
    error.statusCode = 400;
    throw error;
  }
  return email;
}

function normalizeToArray(value) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item || "").split(","))
      .map((item) => sanitizeText(item, 300))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => sanitizeText(item, 300))
      .filter(Boolean);
  }

  return [];
}

function requireField(value, label) {
  if (!value) {
    const error = new Error(`Missing required field: ${label}.`);
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || "unknown";
}

function enforceRateLimit(req, scope) {
  const ip = getClientIp(req);
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const attempts = rateLimitStore.get(key) || [];
  const recentAttempts = attempts.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recentAttempts.length >= RATE_LIMIT_MAX_REQUESTS) {
    const error = new Error("Too many requests. Please try again later.");
    error.statusCode = 429;
    throw error;
  }

  recentAttempts.push(now);
  rateLimitStore.set(key, recentAttempts);
}

function buildHtmlEmail({ title, intro, fields, meta }) {
  const rows = fields
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding:12px 14px;border:1px solid #d7dde7;background:#f4f7fb;font-weight:600;width:34%;">${escapeHtml(label)}</td>
          <td style="padding:12px 14px;border:1px solid #d7dde7;background:#ffffff;">${escapeHtml(value || "-")}</td>
        </tr>`
    )
    .join("");

  const metaRows = meta
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding:10px 14px;border:1px solid #d7dde7;background:#fbfcfe;font-weight:600;">${escapeHtml(label)}</td>
          <td style="padding:10px 14px;border:1px solid #d7dde7;background:#ffffff;">${escapeHtml(value || "-")}</td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#eef2f7;font-family:Arial,sans-serif;color:#0f172a;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:860px;margin:0 auto;background:#ffffff;border:1px solid #d7dde7;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:28px 32px;background:#0b1220;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:0.14em;text-transform:uppercase;opacity:0.74;">Nanoker Web Intake</div>
          <h1 style="margin:12px 0 0;font-size:28px;line-height:1.1;">${escapeHtml(title)}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px 12px;">
          <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#334155;">${escapeHtml(intro)}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-spacing:0;">
            ${rows}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 32px 32px;">
          <h2 style="margin:0 0 12px;font-size:16px;color:#0f172a;">Metadata</h2>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-spacing:0;">
            ${metaRows}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildTextEmail({ title, fields, meta }) {
  const lines = [title, ""];
  fields.forEach(({ label, value }) => {
    lines.push(`${label}: ${value || "-"}`);
  });
  lines.push("", "Metadata:");
  meta.forEach(({ label, value }) => {
    lines.push(`${label}: ${value || "-"}`);
  });
  return lines.join("\n");
}

async function sendMail({ subject, replyTo, html, text, attachments }) {
  const env = assertEnvConfig();
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Nanoker Web" <${env.SMTP_USER}>`,
    to: env.MAIL_TO,
    replyTo,
    subject,
    html,
    text,
    attachments,
  });
}

function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function parseMultipartForm(req) {
  const form = new IncomingForm({
    multiples: true,
    keepExtensions: true,
    maxFileSize: MAX_TOTAL_ATTACHMENT_SIZE,
    maxTotalFileSize: MAX_TOTAL_ATTACHMENT_SIZE,
    allowEmptyFiles: false,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({ fields, files });
    });
  });
}

function extractFirst(value) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function buildMeta(req, extraMeta = []) {
  return [
    { label: "Received at", value: new Date().toISOString() },
    { label: "Client IP", value: getClientIp(req) },
    { label: "User-Agent", value: sanitizeText(req.headers["user-agent"] || "", 500) || "-" },
    ...extraMeta,
  ];
}

function collectAttachments(filesInput) {
  const files = Array.isArray(filesInput)
    ? filesInput
    : filesInput
      ? [filesInput]
      : [];

  let totalSize = 0;
  const attachments = files.map((file) => {
    const originalFilename = sanitizeText(file.originalFilename || "attachment", 255);
    const extension = originalFilename.includes(".")
      ? originalFilename.split(".").pop().toLowerCase()
      : "";

    if (!ALLOWED_ATTACHMENT_EXTENSIONS.has(extension)) {
      const error = new Error("One or more attachments use an unsupported file type.");
      error.statusCode = 400;
      throw error;
    }

    totalSize += Number(file.size || 0);
    return {
      filename: originalFilename,
      path: file.filepath,
      contentType: file.mimetype || undefined,
    };
  });

  if (totalSize > MAX_TOTAL_ATTACHMENT_SIZE) {
    const error = new Error("Attachments exceed the allowed total size.");
    error.statusCode = 400;
    throw error;
  }

  return attachments;
}

async function cleanupUploadedFiles(filesInput) {
  const files = Array.isArray(filesInput)
    ? filesInput
    : filesInput
      ? [filesInput]
      : [];

  await Promise.all(
    files.map((file) => fs.unlink(file.filepath).catch(() => undefined))
  );
}

module.exports = {
  ALLOWED_ATTACHMENT_EXTENSIONS,
  MAX_TOTAL_ATTACHMENT_SIZE,
  buildHtmlEmail,
  buildMeta,
  buildTextEmail,
  cleanupUploadedFiles,
  collectAttachments,
  enforceRateLimit,
  escapeHtml,
  extractFirst,
  json,
  normalizeToArray,
  parseMultipartForm,
  readJsonBody,
  requireField,
  sanitizeEmail,
  sanitizeMultilineText,
  sanitizeText,
  sendMail,
};
