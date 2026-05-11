"use strict";

const fs = require("node:fs/promises");
const nodemailer = require("nodemailer");
const { IncomingForm } = require("formidable");

const ALLOWED_ORIGINS = new Set([
  "https://nanoker.com",
  "https://www.nanoker.com",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
]);

const ALLOWED_ATTACHMENT_EXTENSIONS = new Set([
  "pdf",
  "dwg",
  "step",
  "stp",
  "png",
  "jpg",
  "jpeg",
]);

const MAX_TOTAL_ATTACHMENT_SIZE = 5 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;

const rateLimitStore = new Map();
let cachedTransporter = null;

function createError(statusCode, code, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

function getEnvConfig() {
  return {
    SMTP_HOST: String(process.env.SMTP_HOST || "").trim(),
    SMTP_PORT: Number(process.env.SMTP_PORT || 0),
    SMTP_USER: String(process.env.SMTP_USER || "").trim(),
    SMTP_PASS: String(process.env.SMTP_PASS || ""),
    MAIL_TO: String(process.env.MAIL_TO || "").trim(),
  };
}

function getHealthFlags() {
  const env = getEnvConfig();
  return {
    smtpHostConfigured: Boolean(env.SMTP_HOST),
    smtpUserConfigured: Boolean(env.SMTP_USER),
    mailToConfigured: Boolean(env.MAIL_TO),
  };
}

function assertEnvConfig() {
  const env = getEnvConfig();
  const missing = [];

  if (!env.SMTP_HOST) missing.push("SMTP_HOST");
  if (!env.SMTP_PORT || Number.isNaN(env.SMTP_PORT)) missing.push("SMTP_PORT");
  if (!env.SMTP_USER) missing.push("SMTP_USER");
  if (!env.SMTP_PASS) missing.push("SMTP_PASS");
  if (!env.MAIL_TO) missing.push("MAIL_TO");

  if (missing.length > 0) {
    throw createError(
      500,
      "ENV_ERROR",
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  return env;
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
}

function json(req, res, statusCode, payload) {
  setCorsHeaders(req, res);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function handleOptions(req, res) {
  setCorsHeaders(req, res);
  res.statusCode = 204;
  res.end();
}

function methodNotAllowed(req, res, allowedMethods) {
  res.setHeader("Allow", allowedMethods.join(", "));
  return json(req, res, 405, {
    ok: false,
    code: "METHOD_NOT_ALLOWED",
  });
}

function logInfo(endpoint, method, message, extra = {}) {
  console.info(
    JSON.stringify({
      scope: "nanoker-forms",
      level: "info",
      endpoint,
      method,
      message,
      ...extra,
      timestamp: new Date().toISOString(),
    })
  );
}

function logError(endpoint, method, error, extra = {}) {
  console.error(
    JSON.stringify({
      scope: "nanoker-forms",
      level: "error",
      endpoint,
      method,
      message: error?.message || "Unexpected error",
      code: error?.code || "UNEXPECTED_ERROR",
      statusCode: error?.statusCode || 500,
      ...extra,
      timestamp: new Date().toISOString(),
    })
  );
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || "unknown";
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
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

function sanitizeEmail(value) {
  const email = sanitizeText(value, 320).toLowerCase();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!pattern.test(email)) {
    throw createError(400, "VALIDATION_ERROR", "Email address is invalid.");
  }

  return email;
}

function normalizeToArray(value) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item || "").split(","))
      .map((item) => sanitizeText(item, 250))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => sanitizeText(item, 250))
      .filter(Boolean);
  }

  return [];
}

function extractFirst(value) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function requireField(value, fieldName, message) {
  if (!value) {
    throw createError(
      400,
      "VALIDATION_ERROR",
      message || `Missing required field: ${fieldName}.`
    );
  }
}

function enforceRateLimit(req, scope) {
  const key = `${scope}:${getClientIp(req)}`;
  const now = Date.now();
  const attempts = rateLimitStore.get(key) || [];
  const recentAttempts = attempts.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recentAttempts.length >= RATE_LIMIT_MAX_REQUESTS) {
    throw createError(
      429,
      "RATE_LIMITED",
      "Too many requests. Please try again later."
    );
  }

  recentAttempts.push(now);
  rateLimitStore.set(key, recentAttempts);
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch (_error) {
    throw createError(400, "VALIDATION_ERROR", "Request body must be valid JSON.");
  }
}

async function parseMultipartForm(req) {
  const form = new IncomingForm({
    multiples: true,
    keepExtensions: true,
    allowEmptyFiles: false,
    maxFileSize: MAX_TOTAL_ATTACHMENT_SIZE,
    maxTotalFileSize: MAX_TOTAL_ATTACHMENT_SIZE,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) {
        const rawMessage = String(error.message || "");
        const sizeExceeded =
          rawMessage.includes("maxTotalFileSize") ||
          rawMessage.includes("maxFileSize") ||
          rawMessage.includes("options.maxTotalFileSize") ||
          rawMessage.includes("options.maxFileSize");

        reject(
          createError(
            400,
            "VALIDATION_ERROR",
            sizeExceeded
              ? "Attachments exceed the 5 MB total size limit."
              : "Could not process the uploaded files."
          )
        );
        return;
      }

      resolve({ fields, files });
    });
  });
}

function collectAttachments(filesInput) {
  const files = Array.isArray(filesInput)
    ? filesInput
    : filesInput
      ? [filesInput]
      : [];

  let totalSize = 0;

  const attachments = files.map((file) => {
    const filename = sanitizeText(file.originalFilename || "attachment", 255);
    const extension = filename.includes(".")
      ? filename.split(".").pop().toLowerCase()
      : "";

    if (!ALLOWED_ATTACHMENT_EXTENSIONS.has(extension)) {
      throw createError(
        400,
        "VALIDATION_ERROR",
        "One or more attachments use an unsupported file type."
      );
    }

    totalSize += Number(file.size || 0);

    return {
      filename,
      path: file.filepath,
      contentType: file.mimetype || undefined,
    };
  });

  if (totalSize > MAX_TOTAL_ATTACHMENT_SIZE) {
    throw createError(
      400,
      "VALIDATION_ERROR",
      "Attachments exceed the 5 MB total size limit."
    );
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

function buildTimestampMeta() {
  const now = new Date();
  return [
    { label: "Fecha (ISO)", value: now.toISOString() },
    {
      label: "Fecha (Europe/Madrid)",
      value: now.toLocaleString("es-ES", {
        dateStyle: "full",
        timeStyle: "long",
        timeZone: "Europe/Madrid",
      }),
    },
  ];
}

function buildMeta(req, source) {
  return [
    { label: "Origen", value: source },
    ...buildTimestampMeta(),
    { label: "IP cliente", value: getClientIp(req) },
    {
      label: "User-Agent",
      value: sanitizeText(req.headers["user-agent"] || "", 500) || "-",
    },
    {
      label: "Origin header",
      value: sanitizeText(req.headers.origin || "", 250) || "-",
    },
  ];
}

function buildFieldRows(fields) {
  return fields
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding:12px 14px;border:1px solid #d8dee8;background:#f5f7fb;font-weight:600;width:34%;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:12px 14px;border:1px solid #d8dee8;background:#ffffff;white-space:pre-wrap;">${escapeHtml(value || "-")}</td>
        </tr>`
    )
    .join("");
}

function buildHtmlEmail({ title, intro, fields, meta }) {
  return `<!DOCTYPE html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#eef2f7;font-family:Arial,sans-serif;color:#0f172a;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:860px;margin:0 auto;background:#ffffff;border:1px solid #d8dee8;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="padding:28px 32px;background:#0c1624;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.72;">Nanoker Web Lead Intake</div>
          <h1 style="margin:10px 0 0;font-size:28px;line-height:1.15;">${escapeHtml(title)}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px 18px;">
          <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#334155;">${escapeHtml(intro)}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-spacing:0;">
            ${buildFieldRows(fields)}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 32px 32px;">
          <h2 style="margin:0 0 12px;font-size:16px;color:#0f172a;">Metadatos</h2>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-spacing:0;">
            ${buildFieldRows(meta)}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildTextEmail({ title, intro, fields, meta }) {
  const lines = [title, "", intro, ""];

  fields.forEach(({ label, value }) => {
    lines.push(`${label}: ${value || "-"}`);
  });

  lines.push("", "Metadatos:");

  meta.forEach(({ label, value }) => {
    lines.push(`${label}: ${value || "-"}`);
  });

  return lines.join("\n");
}

async function sendMail({ endpoint, method, subject, replyTo, html, text, attachments }) {
  const env = assertEnvConfig();
  const transporter = getTransporter();

  logInfo(endpoint, method, "SMTP initiated", {
    hasReplyTo: Boolean(replyTo),
    attachmentCount: Array.isArray(attachments) ? attachments.length : 0,
  });

  try {
    await transporter.sendMail({
      from: env.SMTP_USER,
      to: env.MAIL_TO,
      replyTo,
      subject,
      html,
      text,
      attachments,
    });

    logInfo(endpoint, method, "SMTP sent OK");
  } catch (_error) {
    throw createError(
      502,
      "SMTP_ERROR",
      "The SMTP service could not deliver the message."
    );
  }
}

module.exports = {
  ALLOWED_ATTACHMENT_EXTENSIONS,
  ALLOWED_ORIGINS,
  MAX_TOTAL_ATTACHMENT_SIZE,
  buildHtmlEmail,
  buildMeta,
  buildTextEmail,
  cleanupUploadedFiles,
  collectAttachments,
  createError,
  enforceRateLimit,
  extractFirst,
  getEnvConfig,
  getHealthFlags,
  handleOptions,
  json,
  logError,
  logInfo,
  methodNotAllowed,
  normalizeToArray,
  parseMultipartForm,
  readJsonBody,
  requireField,
  sanitizeEmail,
  sanitizeMultilineText,
  sanitizeText,
  sendMail,
  setCorsHeaders,
};
