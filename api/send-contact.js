"use strict";

const {
  buildHtmlEmail,
  buildMeta,
  buildTextEmail,
  enforceRateLimit,
  handleOptions,
  json,
  logError,
  logInfo,
  methodNotAllowed,
  normalizeToArray,
  readJsonBody,
  requireField,
  sanitizeEmail,
  sanitizeMultilineText,
  sanitizeText,
  sendMail,
} = require("./_lib/mail");

module.exports = async function handler(req, res) {
  const endpoint = "/api/send-contact";
  const method = req.method || "GET";

  if (method === "OPTIONS") {
    return handleOptions(req, res);
  }

  if (method !== "POST") {
    return methodNotAllowed(req, res, ["POST", "OPTIONS"]);
  }

  logInfo(endpoint, method, "Request received");

  try {
    enforceRateLimit(req, "contact");

    const body = await readJsonBody(req);
    const honeypot = sanitizeText(body.website, 200);

    if (honeypot) {
      logInfo(endpoint, method, "Honeypot triggered");
      return json(req, res, 200, { ok: true, message: "sent" });
    }

    const payload = {
      inquiryTypes: normalizeToArray(body.tipo_consulta),
      sectors: normalizeToArray(body.sector),
      materials: normalizeToArray(body.material),
      technicalInfo: sanitizeMultilineText(body.informacion_tecnica, 8000),
      name: sanitizeText(body.nombre, 160),
      company: sanitizeText(body.empresa, 200),
      role: sanitizeText(body.cargo, 160),
      email: sanitizeEmail(body.email),
      country: sanitizeText(body.pais, 120),
      phone: sanitizeText(body.telefono, 80),
    };

    requireField(payload.inquiryTypes.length, "tipo_consulta", "Select at least one inquiry type.");
    requireField(payload.sectors.length, "sector", "Select at least one sector.");
    requireField(payload.name, "nombre", "Name is required.");
    requireField(payload.company, "empresa", "Company is required.");
    requireField(payload.email, "email", "Email is required.");
    requireField(payload.country, "pais", "Country is required.");

    logInfo(endpoint, method, "Validation OK");

    const subject = "Nuevo contacto web - Nanoker";
    const intro =
      "Se ha recibido una nueva solicitud desde el formulario de contacto de Nanoker.";
    const fields = [
      { label: "Tipo de consulta", value: payload.inquiryTypes.join(", ") },
      { label: "Sector", value: payload.sectors.join(", ") },
      { label: "Material de interés", value: payload.materials.join(", ") || "-" },
      { label: "Información técnica", value: payload.technicalInfo || "-" },
      { label: "Nombre", value: payload.name },
      { label: "Empresa", value: payload.company },
      { label: "Cargo", value: payload.role || "-" },
      { label: "Email", value: payload.email },
      { label: "País", value: payload.country },
      { label: "Teléfono", value: payload.phone || "-" },
    ];
    const meta = buildMeta(req, "contacto");

    await sendMail({
      endpoint,
      method,
      subject,
      replyTo: payload.email,
      html: buildHtmlEmail({ title: subject, intro, fields, meta }),
      text: buildTextEmail({ title: subject, intro, fields, meta }),
    });

    return json(req, res, 200, { ok: true, message: "sent" });
  } catch (error) {
    logError(endpoint, method, error, {
      validationFailed: error.code === "VALIDATION_ERROR",
    });

    return json(req, res, error.statusCode || 500, {
      ok: false,
      code: error.code || "UNEXPECTED_ERROR",
      message:
        error.code === "SMTP_ERROR"
          ? "No se pudo entregar el correo en este momento."
          : error.message || "Unexpected error.",
    });
  }
};
