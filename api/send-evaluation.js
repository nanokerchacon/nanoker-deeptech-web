"use strict";

const {
  buildHtmlEmail,
  buildMeta,
  buildTextEmail,
  cleanupUploadedFiles,
  collectAttachments,
  enforceRateLimit,
  extractFirst,
  handleOptions,
  json,
  logError,
  logInfo,
  methodNotAllowed,
  normalizeToArray,
  parseMultipartForm,
  requireField,
  sanitizeEmail,
  sanitizeMultilineText,
  sanitizeText,
  sendMail,
} = require("./_lib/mail");

function resolveOtherValue(selectedValue, otherValue, fallbackLabel) {
  if (selectedValue === "other") {
    requireField(otherValue, fallbackLabel, `Please specify the field: ${fallbackLabel}.`);
    return `other: ${otherValue}`;
  }

  return selectedValue;
}

async function parseRequest(req) {
  const { fields, files } = await parseMultipartForm(req);
  const attachments = collectAttachments(files.attachment);

  const payload = {
    website: sanitizeText(extractFirst(fields.website), 200),
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
    email: sanitizeEmail(extractFirst(fields.email)),
    phone: sanitizeText(extractFirst(fields.phone), 80),
    country: sanitizeText(extractFirst(fields.country), 120),
    projectDescription: sanitizeMultilineText(
      extractFirst(fields.projectDescription),
      10000
    ),
  };

  return {
    payload,
    attachments,
    filesToCleanup: files.attachment,
  };
}

module.exports = async function handler(req, res) {
  const endpoint = "/api/send-evaluation";
  const method = req.method || "GET";

  if (method === "OPTIONS") {
    return handleOptions(req, res);
  }

  if (method !== "POST") {
    return methodNotAllowed(req, res, ["POST", "OPTIONS"]);
  }

  logInfo(endpoint, method, "Request received");

  let filesToCleanup = null;

  try {
    enforceRateLimit(req, "evaluation");

    const { payload, attachments, filesToCleanup: pendingFiles } = await parseRequest(req);
    filesToCleanup = pendingFiles;

    if (payload.website) {
      logInfo(endpoint, method, "Honeypot triggered");
      await cleanupUploadedFiles(filesToCleanup);
      return json(req, res, 200, { ok: true, message: "sent" });
    }

    requireField(payload.requestType, "requestType", "Request type is required.");
    requireField(payload.currentInfo, "currentInfo", "Current situation is required.");
    requireField(payload.projectPhase, "projectPhase", "Project phase is required.");
    requireField(payload.estimatedVolume, "estimatedVolume", "Estimated volume is required.");
    requireField(payload.dimensionsRange, "dimensionsRange", "Dimensions range is required.");
    requireField(payload.applicationType, "applicationType", "Application type is required.");
    requireField(payload.industrySector, "industrySector", "Industry sector is required.");
    requireField(payload.temperatureRange, "temperatureRange", "Temperature range is required.");
    requireField(payload.functionMain.length, "functionMain", "Select at least one main function.");
    requireField(payload.materialConsidered, "materialConsidered", "Material considered is required.");
    requireField(payload.name, "name", "Name is required.");
    requireField(payload.company, "company", "Company is required.");
    requireField(payload.email, "email", "Email is required.");
    requireField(payload.country, "country", "Country is required.");
    requireField(
      payload.projectDescription,
      "projectDescription",
      "Project description is required."
    );

    if (payload.projectDescription.length < 20) {
      requireField("", "projectDescription", "Project description must be at least 20 characters long.");
    }

    const applicationValue = resolveOtherValue(
      payload.applicationType,
      payload.applicationOther,
      "applicationOther"
    );
    const sectorValue = resolveOtherValue(
      payload.industrySector,
      payload.industrySectorOther,
      "industrySectorOther"
    );
    const materialValue = resolveOtherValue(
      payload.materialConsidered,
      payload.materialOther,
      "materialOther"
    );
    const functionValues = payload.functionMain.map((value) =>
      value === "other"
        ? resolveOtherValue(value, payload.functionMainOther, "functionMainOther")
        : value
    );

    logInfo(endpoint, method, "Validation OK", {
      attachmentCount: attachments.length,
    });

    const subject = "Nueva evaluación técnica - Nanoker";
    const intro =
      "Se ha recibido una nueva solicitud desde el formulario de evaluación técnica de Nanoker.";
    const fields = [
      { label: "Tipo de solicitud", value: payload.requestType },
      { label: "Situación actual", value: payload.currentInfo },
      { label: "Fase del proyecto", value: payload.projectPhase },
      { label: "Cantidad estimada", value: payload.estimatedVolume },
      { label: "Rango dimensional", value: payload.dimensionsRange },
      { label: "Dimensiones exactas", value: payload.exactDimensions || "-" },
      { label: "Aplicación / entorno", value: applicationValue },
      { label: "Sector industrial", value: sectorValue },
      { label: "Temperatura de operación", value: payload.temperatureRange },
      { label: "Función principal", value: functionValues.join(", ") },
      { label: "Material considerado", value: materialValue },
      { label: "Nombre", value: payload.name },
      { label: "Empresa", value: payload.company },
      { label: "Cargo", value: payload.role || "-" },
      { label: "Email", value: payload.email },
      { label: "Teléfono", value: payload.phone || "-" },
      { label: "País", value: payload.country },
      { label: "Descripción del proyecto", value: payload.projectDescription },
      {
        label: "Adjuntos",
        value: attachments.map((attachment) => attachment.filename).join(", ") || "-",
      },
    ];
    const meta = buildMeta(req, "evaluacion-tecnica");

    await sendMail({
      endpoint,
      method,
      subject,
      replyTo: payload.email,
      html: buildHtmlEmail({ title: subject, intro, fields, meta }),
      text: buildTextEmail({ title: subject, intro, fields, meta }),
      attachments,
    });

    await cleanupUploadedFiles(filesToCleanup);

    return json(req, res, 200, { ok: true, message: "sent" });
  } catch (error) {
    if (filesToCleanup) {
      await cleanupUploadedFiles(filesToCleanup);
    }

    logError(endpoint, method, error);

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

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
