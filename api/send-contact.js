"use strict";

const {
  buildHtmlEmail,
  buildMeta,
  buildTextEmail,
  enforceRateLimit,
  json,
  normalizeToArray,
  readJsonBody,
  requireField,
  sanitizeEmail,
  sanitizeMultilineText,
  sanitizeText,
  sendMail,
} = require("./_lib/mail");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { ok: false, error: "Method not allowed." });
  }

  try {
    enforceRateLimit(req, "contact");

    const body = await readJsonBody(req);
    const honeypot = sanitizeText(body.website || "", 200);
    if (honeypot) {
      return json(res, 200, { ok: true });
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

    requireField(payload.inquiryTypes.length, "tipo_consulta");
    requireField(payload.sectors.length, "sector");
    requireField(payload.name, "nombre");
    requireField(payload.company, "empresa");
    requireField(payload.country, "pais");

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

    const meta = buildMeta(req, [{ label: "Form type", value: "Contact" }]);
    const subject = "Nuevo contacto web - Nanoker";

    await sendMail({
      subject,
      replyTo: payload.email,
      html: buildHtmlEmail({
        title: subject,
        intro: "Se ha recibido una nueva solicitud desde el formulario de contacto de la web corporativa.",
        fields,
        meta,
      }),
      text: buildTextEmail({ title: subject, fields, meta }),
    });

    return json(res, 200, { ok: true });
  } catch (error) {
    const statusCode = error.statusCode || error.httpCode || 500;
    return json(res, statusCode, {
      ok: false,
      error: statusCode >= 500 ? "Mail delivery failed." : error.message,
    });
  }
};
