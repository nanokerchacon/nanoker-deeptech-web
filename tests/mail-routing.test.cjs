"use strict";

const assert = require("node:assert/strict");
const { createServer } = require("node:http");
const { once } = require("node:events");
const { test } = require("node:test");
const nodemailer = require("nodemailer");

// Never open an SMTP connection: capture the messages locally.
const messages = [];
nodemailer.createTransport = () => ({
  sendMail: async (message) => { messages.push(message); },
});
Object.assign(process.env, {
  SMTP_HOST: "smtp.example.invalid", SMTP_PORT: "587",
  SMTP_USER: "sender@example.invalid", SMTP_PASS: "test-only",
});
const contact = require("../api/send-contact");
const evaluation = require("../api/send-evaluation");

const contactFields = {
  tipo_consulta: ["Solicitud de presupuesto (RFQ)"], sector: ["Industria"],
  nombre: "Routing test", empresa: "Test", email: "reply@example.invalid", pais: "ES",
};
const evaluationFields = {
  requestType: "general", currentInfo: "idea", projectPhase: "concept",
  estimatedVolume: "undefined", dimensionsRange: "undefined",
  applicationType: "research", industrySector: "research", temperatureRange: "unknown",
  functionMain: "hardness", materialConsidered: "unsure", name: "Routing test",
  company: "Test", email: "reply@example.invalid", country: "ES",
  projectDescription: "Local routing test without sending any real email.",
};

test("both real handlers route to info regardless of legacy MAIL_TO", async () => {
  const server = createServer((req, res) => {
    const handler = req.url === "/contact" ? contact : evaluation;
    handler(req, res).catch((error) => { res.statusCode = 500; res.end(error.message); });
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = "http://127.0.0.1:" + server.address().port;
  try {
    for (const legacyRecipient of ["legacy@example.invalid", undefined]) {
      if (legacyRecipient) process.env.MAIL_TO = legacyRecipient;
      else delete process.env.MAIL_TO;
      const jsonResponse = await fetch(base + "/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactFields),
      });
      assert.equal(jsonResponse.status, 200);
      assert.equal((await jsonResponse.json()).ok, true);
      assert.equal(messages.at(-1).to, "info@nanoker.com");
      assert.equal(messages.at(-1).replyTo, "reply@example.invalid");

      const form = new FormData();
      for (const [key, value] of Object.entries(evaluationFields)) form.set(key, value);
      const multipartResponse = await fetch(base + "/evaluation", { method: "POST", body: form });
      assert.equal(multipartResponse.status, 200);
      assert.equal((await multipartResponse.json()).ok, true);
      assert.equal(messages.at(-1).to, "info@nanoker.com");
      assert.equal(messages.at(-1).replyTo, "reply@example.invalid");
    }
    assert.equal(messages.length, 4);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
