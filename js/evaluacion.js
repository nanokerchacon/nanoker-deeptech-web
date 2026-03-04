(function () {
  const STORAGE_KEY = "NK_EVAL_WIZARD_V2";
  const TOTAL_STEPS = 11;

  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-center .nav-link");

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const form = document.getElementById("evaluation-form");
  const steps = Array.from(document.querySelectorAll(".wizard-step"));
  const stepButtons = Array.from(document.querySelectorAll(".wizard-stepBtn"));
  const progressFill = document.getElementById("eval-progress-fill");
  const progressText = document.getElementById("eval-progress-text");
  const statusEl = document.getElementById("eval-form-status");
  const submitBtn = document.getElementById("eval-submit-btn");

  if (!form || !steps.length || !progressFill || !progressText || !statusEl || !submitBtn) return;

  const stepRules = {
    1: { type: "radio", name: "requestType" },
    2: { type: "radio", name: "currentInfo" },
    3: { type: "radio", name: "projectPhase" },
    4: { type: "radio", name: "estimatedVolume" },
    5: { type: "radio", name: "dimensionsRange" },
    6: { type: "radio", name: "applicationType", otherField: "eval-application-other" },
    7: { type: "radio", name: "industrySector", otherField: "eval-sector-other" },
    8: { type: "radio", name: "temperatureRange" },
    9: { type: "checkbox", name: "functionMain", min: 1, otherField: "eval-function-other" },
    10: { type: "radio", name: "materialConsidered", otherField: "eval-material-other" },
    11: {
      type: "contact",
      requiredFields: ["eval-name", "eval-company", "eval-email", "eval-country", "eval-project-description"],
      descriptionField: "eval-project-description",
      minLength: 20,
    },
  };

  const statusCopy = {
    idle: "",
    required: "Completa los campos obligatorios para continuar.",
    completePrevious: "Completa los pasos previos antes de enviar.",
    otherRequired: "Si seleccionas 'Otro', especifica el detalle.",
    descriptionShort: "La descripción del proyecto debe tener al menos 20 caracteres.",
    sending: "Enviando solicitud de evaluación técnica...",
    success: "Gracias. Hemos recibido tu solicitud y te contactaremos en breve.",
    error: "No pudimos procesar tu solicitud. Inténtalo de nuevo.",
  };

  let activeStep = 1;
  let unlockedStep = 1;
  let isSubmitting = false;

  function setStatus(state) {
    statusEl.classList.remove("is-error", "is-success");
    statusEl.textContent = statusCopy[state] || "";

    if (state === "success") {
      statusEl.classList.add("is-success");
    } else if (state !== "idle") {
      statusEl.classList.add("is-error");
    }
  }

  function updateSubmitText() {
    submitBtn.textContent = isSubmitting ? "Enviando..." : "Enviar evaluación técnica";
  }

  function getInputs(name) {
    return Array.from(form.querySelectorAll(`input[name="${name}"]`));
  }

  function getChecked(name) {
    const inputs = getInputs(name);
    return inputs.filter((input) => input.checked);
  }

  function isOtherSelected(name) {
    return getChecked(name).some((input) => input.value === "other");
  }

  function getStepElement(step) {
    return form.querySelector(`.wizard-step[data-step="${step}"]`);
  }

  function clearInvalidStyles(step) {
    const stepEl = getStepElement(step);
    stepEl?.classList.remove("is-invalid-field");
    stepEl?.querySelectorAll(".is-invalid-field").forEach((el) => el.classList.remove("is-invalid-field"));
  }

  function markInvalid(step) {
    getStepElement(step)?.classList.add("is-invalid-field");
  }

  function setConditionalVisibility(groupName, targetId) {
    const wrapper = form.querySelector(`[data-conditional-wrapper="${targetId}"]`);
    const field = document.getElementById(targetId);
    if (!wrapper || !field) return;

    const shouldShow = isOtherSelected(groupName);
    wrapper.classList.toggle("is-hidden", !shouldShow);
    field.required = shouldShow;

    if (!shouldShow) {
      field.value = "";
      field.classList.remove("is-invalid-field");
    }
  }

  function validateRadioStep(step, rule, applyErrors = false) {
    const checked = getChecked(rule.name);
    let valid = checked.length === 1;

    if (valid && rule.otherField && isOtherSelected(rule.name)) {
      const otherField = document.getElementById(rule.otherField);
      valid = Boolean(otherField && otherField.value.trim());
      if (!valid && applyErrors && otherField) {
        otherField.classList.add("is-invalid-field");
      }
    }

    if (!valid && applyErrors) {
      markInvalid(step);
      const first = getInputs(rule.name)[0];
      first?.focus({ preventScroll: true });
    }

    return valid;
  }

  function validateCheckboxStep(step, rule, applyErrors = false) {
    const checked = getChecked(rule.name);
    let valid = checked.length >= (rule.min || 1);

    if (valid && rule.otherField && isOtherSelected(rule.name)) {
      const otherField = document.getElementById(rule.otherField);
      valid = Boolean(otherField && otherField.value.trim());
      if (!valid && applyErrors && otherField) {
        otherField.classList.add("is-invalid-field");
      }
    }

    if (!valid && applyErrors) {
      markInvalid(step);
      const first = getInputs(rule.name)[0];
      first?.focus({ preventScroll: true });
    }

    return valid;
  }

  function validateContactStep(step, rule, applyErrors = false) {
    let valid = true;
    let firstInvalid = null;

    rule.requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (!field) {
        valid = false;
        return;
      }

      const value = field.value.trim();
      const fieldValid = value !== "" && field.checkValidity();

      if (!fieldValid) {
        valid = false;
        if (!firstInvalid) firstInvalid = field;
      }

      if (applyErrors) {
        field.classList.toggle("is-invalid-field", !fieldValid);
      }
    });

    const descriptionField = document.getElementById(rule.descriptionField);
    if (descriptionField) {
      const lengthValid = descriptionField.value.trim().length >= (rule.minLength || 20);
      if (!lengthValid) {
        valid = false;
        if (!firstInvalid) firstInvalid = descriptionField;
      }
      if (applyErrors) {
        descriptionField.classList.toggle("is-invalid-field", !lengthValid);
      }
    }

    if (!valid && applyErrors) {
      markInvalid(step);
      firstInvalid?.focus({ preventScroll: true });
    }

    return valid;
  }

  function isStepComplete(step, applyErrors = false) {
    const rule = stepRules[step];
    if (!rule) return true;

    if (!applyErrors) clearInvalidStyles(step);

    if (rule.type === "radio") return validateRadioStep(step, rule, applyErrors);
    if (rule.type === "checkbox") return validateCheckboxStep(step, rule, applyErrors);
    if (rule.type === "contact") return validateContactStep(step, rule, applyErrors);

    return true;
  }

  function getSequentialUnlockedStep() {
    let unlocked = 1;
    for (let step = 1; step <= TOTAL_STEPS; step += 1) {
      if (!isStepComplete(step, false)) break;
      unlocked = step + 1;
    }
    return Math.min(unlocked, TOTAL_STEPS);
  }

  function updateProgress() {
    const percent = Math.round(((activeStep - 1) / (TOTAL_STEPS - 1)) * 100);
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `PASO ${activeStep} DE ${TOTAL_STEPS}`;
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
      const canOpen = step <= unlockedStep;
      const isCurrent = step === activeStep;
      const isComplete = step < activeStep && isStepComplete(step, false);

      btn.disabled = !canOpen;
      btn.classList.toggle("is-current", isCurrent);
      btn.classList.toggle("is-complete", isComplete);
      btn.setAttribute("aria-selected", isCurrent ? "true" : "false");
      btn.textContent = `PASO ${step}`;
    });

    updateProgress();
  }

  function focusStepFirstField(step) {
    const stepEl = getStepElement(step);
    if (!stepEl) return;
    const first = stepEl.querySelector("input, textarea, select, button");
    first?.focus?.({ preventScroll: true });
  }

  function persistState() {
    const checks = {};
    form.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((input) => {
      checks[input.id] = input.checked;
    });

    const values = {};
    form.querySelectorAll("input[type='text'], input[type='email'], textarea, select").forEach((field) => {
      values[field.id] = field.value;
    });

    const payload = { activeStep, unlockedStep, checks, values };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function restoreState() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const payload = JSON.parse(raw);
      if (!payload || typeof payload !== "object") return;

      if (payload.checks) {
        Object.entries(payload.checks).forEach(([id, checked]) => {
          const input = document.getElementById(id);
          if (input && (input.type === "checkbox" || input.type === "radio")) {
            input.checked = Boolean(checked);
          }
        });
      }

      if (payload.values) {
        Object.entries(payload.values).forEach(([id, value]) => {
          const field = document.getElementById(id);
          if (field) field.value = typeof value === "string" ? value : "";
        });
      }

      [
        ["applicationType", "eval-application-other"],
        ["industrySector", "eval-sector-other"],
        ["functionMain", "eval-function-other"],
        ["materialConsidered", "eval-material-other"],
      ].forEach(([name, target]) => setConditionalVisibility(name, target));

      unlockedStep = getSequentialUnlockedStep();
      const storedStep = Number(payload.activeStep || 1);
      activeStep = Math.min(Math.max(1, storedStep), unlockedStep);
    } catch (_error) {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  function goToStep(targetStep) {
    const nextStep = Math.min(Math.max(1, targetStep), unlockedStep);
    activeStep = nextStep;
    renderWizard();
    persistState();
  }

  function handleNext(step) {
    const rule = stepRules[step];
    const valid = isStepComplete(step, true);

    if (!valid) {
      if (rule?.otherField && isOtherSelected(rule.name)) {
        setStatus("otherRequired");
      } else if (step === 11) {
        const description = document.getElementById("eval-project-description")?.value.trim() || "";
        if (description.length > 0 && description.length < 20) {
          setStatus("descriptionShort");
        } else {
          setStatus("required");
        }
      } else {
        setStatus("required");
      }
      return;
    }

    setStatus("idle");
    unlockedStep = Math.max(unlockedStep, Math.min(step + 1, TOTAL_STEPS));
    goToStep(Math.min(step + 1, TOTAL_STEPS));
    focusStepFirstField(activeStep);
  }

  function getFormPayload() {
    const payload = {
      timestamp: new Date().toISOString(),
      requestType: getChecked("requestType")[0]?.value || "",
      currentInfo: getChecked("currentInfo")[0]?.value || "",
      projectPhase: getChecked("projectPhase")[0]?.value || "",
      estimatedVolume: getChecked("estimatedVolume")[0]?.value || "",
      dimensionsRange: getChecked("dimensionsRange")[0]?.value || "",
      exactDimensions: (document.getElementById("eval-exact-dimensions")?.value || "").trim(),
      applicationType: getChecked("applicationType")[0]?.value || "",
      applicationOther: (document.getElementById("eval-application-other")?.value || "").trim(),
      industrySector: getChecked("industrySector")[0]?.value || "",
      industrySectorOther: (document.getElementById("eval-sector-other")?.value || "").trim(),
      temperatureRange: getChecked("temperatureRange")[0]?.value || "",
      functionMain: getChecked("functionMain").map((item) => item.value),
      functionMainOther: (document.getElementById("eval-function-other")?.value || "").trim(),
      materialConsidered: getChecked("materialConsidered")[0]?.value || "",
      materialOther: (document.getElementById("eval-material-other")?.value || "").trim(),
      contact: {
        name: (document.getElementById("eval-name")?.value || "").trim(),
        company: (document.getElementById("eval-company")?.value || "").trim(),
        role: (document.getElementById("eval-role")?.value || "").trim(),
        email: (document.getElementById("eval-email")?.value || "").trim(),
        phone: (document.getElementById("eval-phone")?.value || "").trim(),
        country: (document.getElementById("eval-country")?.value || "").trim(),
      },
      projectDescription: (document.getElementById("eval-project-description")?.value || "").trim(),
      files: Array.from(document.getElementById("eval-files")?.files || []).map((file) => file.name),
    };

    return payload;
  }

  async function sendForm(payload) {
    // Stub de envío hasta conectar endpoint real.
    console.log("[Nanoker] Evaluation payload", payload);
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    return { ok: true };
  }

  function bindStepEvents() {
    stepButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = Number(btn.dataset.stepJump);
        if (target <= unlockedStep) {
          goToStep(target);
          focusStepFirstField(target);
        }
      });
    });

    form.querySelectorAll("[data-next-step]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const step = Number(btn.dataset.nextStep);
        handleNext(step);
      });
    });

    form.querySelectorAll("[data-prev-step]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const step = Number(btn.dataset.prevStep);
        activeStep = Math.max(1, step);
        renderWizard();
        persistState();
        focusStepFirstField(activeStep);
      });
    });

    form.querySelectorAll('input[type="radio"], input[type="checkbox"], input[type="text"], input[type="email"], textarea, select').forEach((field) => {
      const eventName = field.tagName === "SELECT" ? "change" : "input";
      field.addEventListener(eventName, () => {
        field.classList.remove("is-invalid-field");

        setConditionalVisibility("applicationType", "eval-application-other");
        setConditionalVisibility("industrySector", "eval-sector-other");
        setConditionalVisibility("functionMain", "eval-function-other");
        setConditionalVisibility("materialConsidered", "eval-material-other");

        unlockedStep = getSequentialUnlockedStep();
        if (activeStep > unlockedStep) activeStep = unlockedStep;
        renderWizard();
        persistState();

        if (statusEl.textContent) setStatus("idle");
      });

      field.addEventListener("change", () => {
        field.classList.remove("is-invalid-field");

        setConditionalVisibility("applicationType", "eval-application-other");
        setConditionalVisibility("industrySector", "eval-sector-other");
        setConditionalVisibility("functionMain", "eval-function-other");
        setConditionalVisibility("materialConsidered", "eval-material-other");

        unlockedStep = getSequentialUnlockedStep();
        if (activeStep > unlockedStep) activeStep = unlockedStep;
        renderWizard();
        persistState();
      });
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const unlocked = getSequentialUnlockedStep();
    if (unlocked < TOTAL_STEPS || activeStep < TOTAL_STEPS) {
      setStatus("completePrevious");
      activeStep = unlocked;
      renderWizard();
      focusStepFirstField(activeStep);
      persistState();
      return;
    }

    const valid = isStepComplete(11, true);
    if (!valid) {
      const description = document.getElementById("eval-project-description")?.value.trim() || "";
      if (description.length > 0 && description.length < 20) {
        setStatus("descriptionShort");
      } else {
        setStatus("required");
      }
      return;
    }

    isSubmitting = true;
    submitBtn.disabled = true;
    updateSubmitText();
    setStatus("sending");

    try {
      const payload = getFormPayload();
      await sendForm(payload);

      form.reset();
      form.querySelectorAll(".is-invalid-field").forEach((el) => el.classList.remove("is-invalid-field"));
      [
        ["applicationType", "eval-application-other"],
        ["industrySector", "eval-sector-other"],
        ["functionMain", "eval-function-other"],
        ["materialConsidered", "eval-material-other"],
      ].forEach(([name, target]) => setConditionalVisibility(name, target));

      activeStep = 1;
      unlockedStep = 1;
      sessionStorage.removeItem(STORAGE_KEY);
      renderWizard();
      setStatus("success");
    } catch (_error) {
      setStatus("error");
    } finally {
      isSubmitting = false;
      submitBtn.disabled = false;
      updateSubmitText();
    }
  });

  restoreState();
  bindStepEvents();
  unlockedStep = getSequentialUnlockedStep();
  if (activeStep > unlockedStep) activeStep = unlockedStep;
  renderWizard();
  updateSubmitText();
  persistState();
})();
