"use strict";

const {
  buildHtmlEmail,
  buildMeta,
  buildTextEmail,
  cleanupUploadedFiles,
  collectAttachments,
  enforceRateLimit,
  extractFirst,
  json,
  normalizeToArray,
  parseMultipartForm,
  requireField,
  sanitizeEmail,
  sanitizeMultilineText,
  sanitizeText,
  sendMail,
} = require("./_lib/mail");

async function extractPayload(req) {
  const { fields, files } = await parseMultipartForm(req);
  const attachments = collectAttachments(files.attachment);
  const website = sanitizeText(extractFirst(fields.website), 200);

  const payload = {
    requestType: sanitizeText(extractFirst(fields.requestType), 180),
    currentInfo: sanitizeText(extractFirst(fields.currentInfo), 180),
    projectPhase: sanitizeText(extractFirst(fields.projectPhase), 180),
    estimatedVolume: sanitizeText(extractFirst(fields.estimatedVolume), 180),
    dimensionsRange: sanitizeText(extractFirst(fields.dimensionsRange), 180),
    exactDimensions: sanitizeText(extractFirst(fields.exactDimensions), 180),
    applicationType: sanitizeText(extractFirst(fields.applicationType), 200),
    applicationOther: sanitizeText(extractFirst(fields.applicationOther), 200),
    industrySector: sanitizeText(extractFirst(fields.industrySector), 200),
    industrySectorOther: sanitizeText(extractFirst(fields.industrySectorOther), 200),
    temperatureRange: sanitizeText(extractFirst(fields.temperatureRange), 180),
    functionMain: normalizeToArray(fields.functionMain),
    functionMainOther: sanitizeText(extractFirst(fields.functionMainOther), 200),
    materialConsidered: sanitizeText(extractFirst(fields.materialConsidered), 200),
    materialOther: sanitizeText(extractFirst(fields.materialOther), 200),
    name: sanitizeText(extractFirst(fields.name), 160),
    company: sanitizeText(extractFirst(fields.company), 200),
    role: sanitizeText(extractFirst(fields.role), 160),
    email: sanitizeText(extractFirst(fields.email), 320),
    phone: sanitizeText(extractFirst(fields.phone), 80),
    country: sanitizeText(extractFirst(fields.country), 120),
    projectDescription: sanitizeMultilineText(extractFirst(fields.projectDescription), 10000),
    website,
  };

  return { payload, attachments, filesToCleanup: files.attachment };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { ok: false, error: "Method not allowed." });
  }

  let cleanupTarget = null;

  try {
    enforceRateLimit(req, "evaluation");

    const { payload, attachments, filesToCleanup } = await extractPayload(req);
    cleanupTarget = filesToCleanup;

    if (payload.website) {
      await cleanupUploadedFiles(cleanupTarget);
      return json(res, 200, { ok: true });
    }

    payload.email = sanitizeEmail(payload.email);

    requireField(payload.requestType, "requestType");
    requireField(payload.currentInfo, "currentInfo");
    requireField(payload.projectPhase, "projectPhase");
    requireField(payload.estimatedVolume, "estimatedVolume");
    requireField(payload.dimensionsRange, "dimensionsRange");
    requireField(payload.applicationType, "applicationType");
    requireField(payload.industrySector, "industrySector");
    requireField(payload.temperatureRange, "temperatureRange");
    requireField(payload.functionMain.length, "functionMain");
    requireField(payload.materialConsidered, "materialConsidered");
    requireField(payload.name, "name");
    requireField(payload.company, "company");
    requireField(payload.country, "country");
    requireField(payload.projectDescription, "projectDescription");
    if (payload.projectDescription.length < 20) {
      const error = new Error("Project description is too short.");
      error.statusCode = 400;
      throw error;
    }

    const fields = [
      { label: "Tipo de solicitud", value: payload.requestType },
      { label: "Situación actual", value: payload.currentInfo },
      { label: "Fase del proyecto", value: payload.projectPhase },
      { label: "Cantidad estimada", value: payload.estimatedVolume },
      { label: "Rango dimensional", value: payload.dimensionsRange },
      { label: "Dimensiones exactas", value: payload.exactDimensions || "-" },
      { label: "Aplicación", value: payload.applicationType },
      { label: "Aplicación (otro)", value: payload.applicationOther || "-" },
      { label: "Sector industrial", value: payload.industrySector },
      { label: "Sector (otro)", value: payload.industrySectorOther || "-" },
      { label: "Temperatura de operación", value: payload.temperatureRange },
      { label: "Función principal", value: payload.functionMain.join(", ") },
      { label: "Función principal (otra)", value: payload.functionMainOther || "-" },
      { label: "Material considerado", value: payload.materialConsidered },
      { label: "Material (otro)", value: payload.materialOther || "-" },
      { label: "Nombre", value: payload.name },
      { label: "Empresa", value: payload.company },
      { label: "Cargo", value: payload.role || "-" },
      { label: "Email", value: payload.email },
      { label: "Teléfono", value: payload.phone || "-" },
      { label: "País", value: payload.country },
      { label: "Descripción del proyecto", value: payload.projectDescription },
      { label: "Adjuntos", value: attachments.map((item) => item.filename).join(", ") || "-" },
    ];

    const meta = buildMeta(req, [{ label: "Form type", value: "Technical evaluation" }]);
    const subject = "Nueva evaluación técnica - Nanoker";

    await sendMail({
      subject,
      replyTo: payload.email,
      html: buildHtmlEmail({
        title: subject,
        intro: "Se ha recibido una nueva solicitud desde el formulario de evaluación técnica.",
        fields,
        meta,
      }),
      text: buildTextEmail({ title: subject, fields, meta }),
      attachments,
    });

    await cleanupUploadedFiles(cleanupTarget);
    return json(res, 200, { ok: true });
  } catch (error) {
    if (cleanupTarget) {
      await cleanupUploadedFiles(cleanupTarget);
    }

    const statusCode = error.statusCode || error.httpCode || 500;
    return json(res, statusCode, {
      ok: false,
      error: statusCode >= 500 ? "Mail delivery failed." : error.message,
    });
  }
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
