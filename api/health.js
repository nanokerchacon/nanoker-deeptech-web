"use strict";

const {
  getHealthFlags,
  handleOptions,
  json,
  logInfo,
  methodNotAllowed,
} = require("./_lib/mail");

module.exports = async function handler(req, res) {
  const endpoint = "/api/health";
  const method = req.method || "GET";

  if (method === "OPTIONS") {
    return handleOptions(req, res);
  }

  if (method !== "GET") {
    return methodNotAllowed(req, res, ["GET", "OPTIONS"]);
  }

  logInfo(endpoint, method, "Health check requested");

  return json(req, res, 200, {
    ok: true,
    ...getHealthFlags(),
  });
};
