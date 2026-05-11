(function () {
  const API_BASE_URL = "https://nanoker-deeptech-web.vercel.app";
  const STORAGE_KEY = "nanoker_contact_wizard_v1";
  const TOTAL_STEPS = 6;
  const REQUEST_TIMEOUT_MS = 25000;

  function normalizeLang(raw) {
    const base = String(raw || "").toLowerCase().split("-")[0];
    return ["es", "en", "fr", "de"].includes(base) ? base : "en";
  }

  const initialLang = normalizeLang(
    document.documentElement.getAttribute("data-lang") ||
      document.documentElement.lang ||
      "en"
  );

  let runtimeLang = initialLang;
  let translate = (_key, fallback) => fallback;

  function formatTemplate(value, params) {
    if (typeof value !== "string" || !params) return value;
    return value.replace(/\{(\w+)\}/g, (match, key) => {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        return String(params[key]);
      }
      return match;
    });
  }

  function tr(key, fallback, params) {
    return formatTemplate(translate(key, fallback), params);
  }

  function trFallback(enText, esText) {
    return runtimeLang === "es" ? esText : enText;
  }

  const form = document.getElementById("contact-tech-form");
  const steps = Array.from(document.querySelectorAll(".wizard-step"));
  const stepButtons = Array.from(document.querySelectorAll(".wizard-stepBtn"));
  const progressFill = document.getElementById("wizard-progress-fill");
  const progressText = document.getElementById("wizard-progress-text");
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const step3NextBtn = document.getElementById("step3-next-btn");
  const techInfo = document.getElementById("tech-info");
  const step4NextBtn = document.getElementById("step4-next-btn");
  const step5NextBtn = document.getElementById("step5-next-btn");
  const startBtn = document.querySelector("[data-start-request]");
  const emailInput = document.getElementById("email");
  const honeypotInput = document.getElementById("contact-website");

  if (!form || !steps.length || !statusEl || !submitBtn || !emailInput || !honeypotInput) return;

  let activeStep = 1;
  let unlockedStep = 1;
  let advanceTimer = null;
  let statusScrollTimer = null;
  let step3Confirmed = false;
  let step4Confirmed = false;
  let statusState = "idle";
  let isSubmitting = false;

  const stepGroups = {
    1: () => Array.from(form.querySelectorAll('input[name="tipo_consulta"]')),
    2: () => Array.from(form.querySelectorAll('input[name="sector"]')),
    3: () => Array.from(form.querySelectorAll('input[name="material"]')),
    5: () => Array.from(form.querySelectorAll("#nombre, #empresa, #email, #pais")),
  };

  const STATUS_COPY = {
    requiredFields: {
      key: "contact.form.status.requiredFields",
      fallback: () =>
        trFallback(
          "Complete required fields to continue.",
          "Completa los campos obligatorios para continuar."
        ),
    },
    completePrevious: {
      key: "contact.form.status.completePrevious",
      fallback: () =>
        trFallback(
          "Complete previous steps before submitting.",
          "Completa los pasos previos antes de enviar."
        ),
    },
    reviewRequired: {
      key: "contact.form.status.reviewRequired",
      fallback: () =>
        trFallback(
          "Review the required fields before submitting.",
          "Revisa los campos obligatorios antes de enviar."
        ),
    },
    invalidEmail: {
      key: "contact.form.status.invalidEmail",
      fallback: () =>
        trFallback(
          "Enter a valid email so we can reply.",
          "Introduce un email válido para poder responder."
        ),
    },
    sending: {
      key: "contact.form.status.sending",
      fallback: () =>
        trFallback(
          "Sending...",
          "Enviando..."
        ),
    },
    received: {
      key: "contact.form.status.received",
      fallback: () =>
        trFallback(
          "Contact request sent successfully. Thank you for contacting Nanoker. Our team will review your inquiry and respond as soon as possible.",
          "Solicitud enviada correctamente. Gracias por contactar con Nanoker. Nuestro equipo revisará tu consulta y te responderá lo antes posible."
        ),
      html: false,
    },
    error: {
      key: "contact.form.status.error",
      fallback: () =>
        trFallback(
          'We could not send your request right now. Please try again or email <a href="mailto:web@nanoker.com">web@nanoker.com</a>.',
          'No hemos podido enviar la solicitud en este momento. Por favor, inténtalo de nuevo o escribe a <a href="mailto:web@nanoker.com">web@nanoker.com</a>.'
        ),
      html: true,
    },
  };

  function hasChecked(inputs) {
    return inputs.some((input) => input.checked);
  }

  function isStepComplete(step) {
    if (step === 1) return hasChecked(stepGroups[1]());
    if (step === 2) return hasChecked(stepGroups[2]());
    if (step === 3) return step3Confirmed;
    if (step === 4) return step4Confirmed;
    if (step === 5) {
      return stepGroups[5]().every((input) => input.value.trim() !== "" && input.checkValidity());
    }
    return false;
  }

  function getSequentialUnlockedStep() {
    let unlocked = 1;
    for (let step = 1; step <= 5; step += 1) {
      if (!isStepComplete(step)) break;
      unlocked = step + 1;
    }
    return unlocked;
  }

  function updateProgress() {
    const percent = Math.round(((activeStep - 1) / (TOTAL_STEPS - 1)) * 100);
    progressFill.style.width = `${percent}%`;
    progressText.textContent = tr(
      "contact.wizard.progressTemplate",
      trFallback("Step {current} of {total}", "Paso {current} de {total}"),
      {
        current: activeStep,
        total: TOTAL_STEPS,
      }
    );
  }

  function setStatus(state) {
    statusState = state;
    if (state === "idle") {
      statusEl.textContent = "";
    } else {
      const copy = STATUS_COPY[state];
      if (copy) {
        const message = tr(copy.key, copy.fallback());
        if (copy.html) {
          statusEl.innerHTML = message;
        } else {
          statusEl.textContent = message;
        }
      }
    }

    statusEl.classList.toggle("is-sending", state === "sending");
    statusEl.classList.toggle("is-error", ["requiredFields", "completePrevious", "reviewRequired", "invalidEmail", "error"].includes(state));
    statusEl.classList.toggle("is-success", state === "received");
    statusEl.classList.toggle("is-visible", state !== "idle");
  }

  function isStatusVisible() {
    const rect = statusEl.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top >= 0 && rect.bottom <= viewportHeight;
  }

  function revealStatus() {
    if (statusScrollTimer) {
      window.clearTimeout(statusScrollTimer);
    }

    statusScrollTimer = window.setTimeout(() => {
      if (!statusEl.textContent.trim() && !statusEl.innerHTML.trim()) return;
      if (!isStatusVisible()) {
        statusEl.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }, 40);
  }

  function updateSubmitText() {
    if (isSubmitting) {
      submitBtn.textContent = tr(
        "contact.form.step6.sending",
        trFallback("Sending...", "Enviando...")
      );
      submitBtn.classList.add("is-loading");
      return;
    }

    submitBtn.textContent = tr(
      "contact.form.step6.submit",
      trFallback("Send technical request", "Enviar solicitud técnica")
    );
    submitBtn.classList.remove("is-loading");
  }

  function syncI18nRuntimeText() {
    stepButtons.forEach((btn) => {
      const step = Number(btn.dataset.stepJump);
      if (!Number.isInteger(step) || step < 1 || step > TOTAL_STEPS) return;
      btn.textContent = tr(`contact.wizard.steps.step${step}`, btn.textContent);
    });
    updateProgress();
    updateSubmitText();
    if (statusState !== "idle") setStatus(statusState);
  }

  function renderWizard() {
    steps.forEach((stepEl) => {
      const step = Number(stepEl.dataset.step);
      const isActive = step === activeStep;
      stepEl.classList.toggle("is-active", isActive);
      stepEl.setAttribute("aria-hidden", isActive ? "false" : "true");
    });

    stepButtons.forEach((btn) => {
      const step = Number(btn.dataset.stepJump);
      const complete = step < activeStep ? isStepComplete(step) : false;
      const isCurrent = step === activeStep;
      const canOpen = step <= unlockedStep;

      btn.disabled = !canOpen;
      btn.classList.toggle("is-current", isCurrent);
      btn.classList.toggle("is-complete", complete);
      btn.setAttribute("aria-selected", isCurrent ? "true" : "false");
    });

    updateProgress();
  }

  function persistState() {
    const saved = {
      activeStep,
      unlockedStep,
      step3Confirmed,
      step4Confirmed,
      checks: {},
      values: {},
    };

    form.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      saved.checks[input.id] = input.checked;
    });

    form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea').forEach((field) => {
      saved.values[field.id] = field.value;
    });

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }

  function restoreState() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const saved = JSON.parse(raw);

      if (saved && typeof saved === "object") {
        step3Confirmed = Boolean(saved.step3Confirmed);
        step4Confirmed = Boolean(saved.step4Confirmed);

        if (saved.checks) {
          Object.entries(saved.checks).forEach(([id, checked]) => {
            const node = document.getElementById(id);
            if (node && node.type === "checkbox") node.checked = Boolean(checked);
          });
        }

        if (saved.values) {
          Object.entries(saved.values).forEach(([id, value]) => {
            const node = document.getElementById(id);
            if (node) node.value = typeof value === "string" ? value : "";
          });
        }

        unlockedStep = getSequentialUnlockedStep();
        const storedStep = Number(saved.activeStep || 1);
        activeStep = Math.min(Math.max(1, storedStep), unlockedStep);
      }
    } catch (_error) {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  function focusStepFirstField(step) {
    const stepEl = steps.find((el) => Number(el.dataset.step) === step);
    if (!stepEl) return;
    const first = stepEl.querySelector("input, textarea, button, label");
    if (first && first.focus) first.focus({ preventScroll: true });
  }

  function goToStep(targetStep, fromAutoAdvance = false) {
    const safeStep = Math.min(Math.max(1, targetStep), unlockedStep);
    if (safeStep === activeStep) return;

    activeStep = safeStep;
    renderWizard();
    persistState();

    if (!fromAutoAdvance) focusStepFirstField(activeStep);
  }

  function queueAutoAdvance(step) {
    if (advanceTimer) window.clearTimeout(advanceTimer);

    advanceTimer = window.setTimeout(() => {
      unlockedStep = getSequentialUnlockedStep();
      if (activeStep === step && step < TOTAL_STEPS && isStepComplete(step)) {
        goToStep(step + 1, true);
      } else {
        renderWizard();
      }
      persistState();
    }, 180);
  }

  function refreshAfterInput(stepThatChanged) {
    unlockedStep = getSequentialUnlockedStep();
    const canAutoAdvance = stepThatChanged >= 1 && stepThatChanged <= 2;
    if (canAutoAdvance && stepThatChanged === activeStep && isStepComplete(stepThatChanged) && stepThatChanged < TOTAL_STEPS) {
      queueAutoAdvance(stepThatChanged);
    } else {
      renderWizard();
      persistState();
    }
  }

  function clearInvalidState(input) {
    input.classList.remove("is-invalid-field");
  }

  function resetWizard(options = {}) {
    const preserveStatus = Boolean(options.preserveStatus);
    form.reset();
    form.querySelectorAll(".is-invalid-field").forEach((input) => input.classList.remove("is-invalid-field"));
    step3Confirmed = false;
    step4Confirmed = false;
    activeStep = 1;
    unlockedStep = 1;
    isSubmitting = false;
    submitBtn.disabled = false;
    updateSubmitText();
    sessionStorage.removeItem(STORAGE_KEY);
    renderWizard();
    if (!preserveStatus) {
      setStatus("idle");
    }
  }

  async function submitForm() {
    const payload = {
      tipo_consulta: Array.from(form.querySelectorAll('input[name="tipo_consulta"]:checked')).map((input) => input.value),
      sector: Array.from(form.querySelectorAll('input[name="sector"]:checked')).map((input) => input.value),
      material: Array.from(form.querySelectorAll('input[name="material"]:checked')).map((input) => input.value),
      informacion_tecnica: techInfo?.value.trim() || "",
      nombre: document.getElementById("nombre")?.value.trim() || "",
      empresa: document.getElementById("empresa")?.value.trim() || "",
      cargo: document.getElementById("cargo")?.value.trim() || "",
      email: emailInput.value.trim(),
      pais: document.getElementById("pais")?.value.trim() || "",
      telefono: document.getElementById("telefono")?.value.trim() || "",
      website: honeypotInput.value.trim(),
    };

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response;
    try {
      response = await fetch(`${API_BASE_URL}/api/send-contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } finally {
      window.clearTimeout(timeoutId);
    }

    let payloadResponse = null;
    try {
      payloadResponse = await response.json();
    } catch (_error) {
      payloadResponse = null;
    }

    if (!response.ok || !payloadResponse?.ok) {
      throw new Error(payloadResponse?.message || "mail_delivery_failed");
    }
  }

  stepButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = Number(btn.dataset.stepJump);
      if (target <= unlockedStep) goToStep(target);
    });
  });

  form.querySelectorAll('input[name="tipo_consulta"]').forEach((input) => {
    input.addEventListener("change", () => refreshAfterInput(1));
  });

  form.querySelectorAll('input[name="sector"]').forEach((input) => {
    input.addEventListener("change", () => refreshAfterInput(2));
  });

  form.querySelectorAll('input[name="material"]').forEach((input) => {
    input.addEventListener("change", () => {
      refreshAfterInput(3);
    });
  });

  if (step3NextBtn) {
    step3NextBtn.addEventListener("click", () => {
      step3Confirmed = true;
      unlockedStep = getSequentialUnlockedStep();
      persistState();
      goToStep(4);
    });
  }

  if (techInfo) {
    techInfo.addEventListener("input", () => {
      persistState();
      if (statusState !== "idle") setStatus("idle");
    });
  }

  if (step4NextBtn) {
    step4NextBtn.addEventListener("click", () => {
      step4Confirmed = true;
      unlockedStep = getSequentialUnlockedStep();
      persistState();
      goToStep(5);
    });
  }

  function validateStep5() {
    const requiredFields = stepGroups[5]();
    let firstInvalid = null;

    requiredFields.forEach((input) => {
      const valid = input.value.trim() !== "" && input.checkValidity();
      input.classList.toggle("is-invalid-field", !valid);
      if (!valid && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      setStatus(firstInvalid.type === "email" ? "invalidEmail" : "requiredFields");
      firstInvalid.focus({ preventScroll: true });
      return false;
    }

    if (!emailInput.checkValidity()) {
      emailInput.classList.add("is-invalid-field");
      setStatus("invalidEmail");
      emailInput.focus({ preventScroll: true });
      return false;
    }

    if (activeStep === 5) setStatus("idle");
    return true;
  }

  stepGroups[5]().forEach((input) => {
    input.addEventListener("input", () => {
      const valid = input.value.trim() !== "" && input.checkValidity();
      input.classList.toggle("is-invalid-field", !valid);
      if (statusState !== "idle") setStatus("idle");
      persistState();
    });
  });

  if (step5NextBtn) {
    step5NextBtn.addEventListener("click", () => {
      if (!validateStep5()) return;
      unlockedStep = getSequentialUnlockedStep();
      persistState();
      goToStep(6);
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    unlockedStep = getSequentialUnlockedStep();
    if (unlockedStep < 6) {
      const firstPending = Math.min(unlockedStep, 5);
      goToStep(firstPending);
      setStatus("completePrevious");
      return;
    }

    if (!validateStep5()) return;

    if (!form.checkValidity()) {
      setStatus("reviewRequired");
      return;
    }

    isSubmitting = true;
    submitBtn.disabled = true;
    updateSubmitText();
    setStatus("sending");

    try {
      await submitForm();
      setStatus("received");
      revealStatus();
      resetWizard({ preserveStatus: true });
    } catch (_error) {
      isSubmitting = false;
      submitBtn.disabled = false;
      updateSubmitText();
      setStatus("error");
      revealStatus();
    }
  });

  if (startBtn) {
    startBtn.addEventListener("click", (event) => {
      event.preventDefault();
      document.getElementById("wizard-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      goToStep(1);
    });
  }

  restoreState();
  unlockedStep = getSequentialUnlockedStep();
  if (activeStep > unlockedStep) activeStep = unlockedStep;
  renderWizard();
  updateSubmitText();
  persistState();

  window.addEventListener("lang:change", (event) => {
    runtimeLang = normalizeLang(event.detail?.lang || runtimeLang);
    import("./lang.js?v=11")
      .then((mod) => {
        if (typeof mod.applyTranslations === "function") {
          mod.applyTranslations(document.getElementById("wizard-form") || document);
        }
        syncI18nRuntimeText();
      })
      .catch(() => {
        syncI18nRuntimeText();
      });
  });

  import("./lang.js?v=11")
    .then((mod) => {
      if (typeof mod.t === "function") {
        translate = mod.t;
        if (typeof mod.getLang === "function") {
          runtimeLang = normalizeLang(mod.getLang());
        }
        syncI18nRuntimeText();
      }
    })
    .catch(() => {
      // Keep fallbacks if lang module is unavailable.
    });
})();
