(function () {
  const STORAGE_KEY = "NK_EVAL_WIZARD_V1";
  const TOTAL_STEPS = 5;

  function normalizeLang(raw) {
    const base = String(raw || "").toLowerCase().split("-")[0];
    return base === "es" ? "es" : "en";
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

  if (!form || !steps.length || !statusEl || !submitBtn) return;

  let activeStep = 1;
  let unlockedStep = 1;
  let statusState = "idle";
  let isSubmitting = false;

  const selectorsByStep = {
    1: 'input[name="technology"]',
    2: 'input[name="phase"]',
    3: "#eval-challenge",
    4: 'input[name="needs"]',
    5: "#eval-name, #eval-email, #eval-company, #eval-role, #eval-start",
  };

  const STATUS_COPY = {
    requiredFields: {
      key: "evaluation.form.status.requiredFields",
      fallback: () =>
        trFallback(
          "Complete required fields to continue.",
          "Completa los campos obligatorios para continuar."
        ),
    },
    completePrevious: {
      key: "evaluation.form.status.completePrevious",
      fallback: () =>
        trFallback(
          "Complete previous steps before submitting.",
          "Completa los pasos previos antes de enviar."
        ),
    },
    sending: {
      key: "evaluation.form.status.sending",
      fallback: () => trFallback("Sending evaluation request...", "Enviando solicitud de evaluacion..."),
    },
    success: {
      key: "evaluation.form.status.success",
      fallback: () =>
        trFallback(
          "Request received. Our engineering team will contact you shortly.",
          "Solicitud recibida. Nuestro equipo de ingenieria te contactara en breve."
        ),
    },
    error: {
      key: "evaluation.form.status.error",
      fallback: () =>
        trFallback(
          "We could not process your request. Please try again.",
          "No pudimos procesar tu solicitud. Intentalo de nuevo."
        ),
    },
    challengeTooShort: {
      key: "evaluation.form.status.challengeTooShort",
      fallback: () =>
        trFallback(
          "Please provide at least 30 characters in the technical challenge.",
          "Describe el desafio tecnico con al menos 30 caracteres."
        ),
    },
  };

  function getStepInputs(step) {
    const selector = selectorsByStep[step];
    if (!selector) return [];
    return Array.from(form.querySelectorAll(selector));
  }

  function setStatus(state) {
    statusState = state;
    statusEl.classList.remove("is-error", "is-success");

    if (state === "idle") {
      statusEl.textContent = "";
      return;
    }

    const copy = STATUS_COPY[state];
    if (!copy) return;

    statusEl.textContent = tr(copy.key, copy.fallback());

    if (state === "error" || state === "requiredFields" || state === "completePrevious") {
      statusEl.classList.add("is-error");
    }

    if (state === "success") {
      statusEl.classList.add("is-success");
    }
  }

  function updateSubmitText() {
    submitBtn.textContent = isSubmitting
      ? tr(
          "evaluation.form.step5.sending",
          trFallback("Sending...", "Enviando...")
        )
      : tr(
          "evaluation.form.step5.submit",
          trFallback("Request technical evaluation", "Solicitar evaluacion tecnica")
        );
  }

  function updateProgress() {
    const percent = Math.round(((activeStep - 1) / (TOTAL_STEPS - 1)) * 100);
    progressFill.style.width = `${percent}%`;
    progressText.textContent = tr(
      "evaluation.wizard.progressTemplate",
      trFallback("STEP {current} OF {total}", "PASO {current} DE {total}"),
      { current: activeStep, total: TOTAL_STEPS }
    );
  }

  function isGroupChecked(name) {
    return getStepInputs(name).some((input) => input.checked);
  }

  function getStepElement(step) {
    return form.querySelector(`.wizard-step[data-step="${step}"]`);
  }

  function clearStepInvalid(step) {
    const stepEl = getStepElement(step);
    stepEl?.classList.remove("is-invalid-field");

    if (step === 3) {
      form.querySelector("#eval-challenge")?.classList.remove("is-invalid-field");
      return;
    }

    if (step === 5) {
      getStepInputs(5).forEach((field) => field.classList.remove("is-invalid-field"));
    }
  }

  function markStepInvalid(step) {
    const stepEl = getStepElement(step);
    stepEl?.classList.add("is-invalid-field");
  }

  function isStepComplete(step) {
    if (step === 1) {
      return isGroupChecked(1);
    }

    if (step === 2) {
      return isGroupChecked(2);
    }

    if (step === 3) {
      const field = form.querySelector("#eval-challenge");
      if (!field) return false;
      return field.value.trim().length >= 30;
    }

    if (step === 4) {
      return isGroupChecked(4);
    }

    if (step === 5) {
      return getStepInputs(5).every((field) => field.value.trim() !== "" && field.checkValidity());
    }

    return true;
  }

  function validateStep(step, focusInvalid = false, applyErrors = false) {
    const valid = isStepComplete(step);
    if (!applyErrors) return valid;

    if (valid) {
      clearStepInvalid(step);
      return true;
    }

    if (step === 1 || step === 2 || step === 4) {
      markStepInvalid(step);
      if (focusInvalid) getStepInputs(step)[0]?.focus({ preventScroll: true });
      return false;
    }

    if (step === 3) {
      const field = form.querySelector("#eval-challenge");
      markStepInvalid(step);
      field?.classList.add("is-invalid-field");
      if (focusInvalid) field?.focus({ preventScroll: true });
      return false;
    }

    if (step === 5) {
      clearStepInvalid(5);
      const fields = getStepInputs(5);
      let firstInvalid = null;

      fields.forEach((field) => {
        const fieldValid = field.value.trim() !== "" && field.checkValidity();
        field.classList.toggle("is-invalid-field", !fieldValid);
        if (!fieldValid && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid && focusInvalid) firstInvalid.focus({ preventScroll: true });
      return !firstInvalid;
    }

    return true;
  }

  function getSequentialUnlockedStep() {
    let unlocked = 1;
    for (let step = 1; step <= TOTAL_STEPS; step += 1) {
      if (!isStepComplete(step)) break;
      unlocked = step + 1;
    }
    return Math.min(unlocked, TOTAL_STEPS);
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
      const isComplete = step < activeStep && isStepComplete(step);

      btn.disabled = !canOpen;
      btn.classList.toggle("is-current", isCurrent);
      btn.classList.toggle("is-complete", isComplete);
      btn.setAttribute("aria-selected", isCurrent ? "true" : "false");
    });

    updateProgress();
  }

  function persistState() {
    const checks = {};
    form.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      checks[input.id] = input.checked;
    });

    const values = {};
    form.querySelectorAll("input[type='text'], input[type='email'], textarea, select").forEach((field) => {
      values[field.id] = field.value;
    });

    const payload = {
      activeStep,
      unlockedStep,
      checks,
      values,
    };

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
          if (input && input.type === "checkbox") input.checked = Boolean(checked);
        });
      }

      if (payload.values) {
        Object.entries(payload.values).forEach(([id, value]) => {
          const field = document.getElementById(id);
          if (field) field.value = typeof value === "string" ? value : "";
        });
      }

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

  function focusStepFirstField(step) {
    const stepEl = steps.find((el) => Number(el.dataset.step) === step);
    if (!stepEl) return;
    const first = stepEl.querySelector("input, textarea, select, button");
    first?.focus?.({ preventScroll: true });
  }

  function handleNext(step) {
    const valid = validateStep(step, true, true);
    if (!valid) {
      setStatus(step === 3 ? "challengeTooShort" : "requiredFields");
      return;
    }

    if (statusState === "requiredFields" || statusState === "challengeTooShort") {
      setStatus("idle");
    }

    unlockedStep = Math.max(unlockedStep, Math.min(step + 1, TOTAL_STEPS));
    goToStep(Math.min(step + 1, TOTAL_STEPS));
    focusStepFirstField(activeStep);
  }

  function bindSinglePreferredPhase() {
    const phaseInputs = getStepInputs(2);
    phaseInputs.forEach((input) => {
      input.addEventListener("change", () => {
        if (input.checked) {
          phaseInputs.forEach((other) => {
            if (other !== input) other.checked = false;
          });
        }
        clearStepInvalid(2);
        unlockedStep = getSequentialUnlockedStep();
        renderWizard();
        persistState();
      });
    });
  }

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

  form.querySelectorAll('input[name="technology"]').forEach((input) => {
    input.addEventListener("change", () => {
      clearStepInvalid(1);
      unlockedStep = getSequentialUnlockedStep();
      renderWizard();
      persistState();
    });
  });

  form.querySelectorAll('input[name="needs"]').forEach((input) => {
    input.addEventListener("change", () => {
      clearStepInvalid(4);
      unlockedStep = getSequentialUnlockedStep();
      renderWizard();
      persistState();
    });
  });

  const challengeField = form.querySelector("#eval-challenge");
  if (challengeField) {
    challengeField.addEventListener("input", () => {
      if (challengeField.classList.contains("is-invalid-field") && challengeField.value.trim().length >= 30) {
        challengeField.classList.remove("is-invalid-field");
        clearStepInvalid(3);
      }
      unlockedStep = getSequentialUnlockedStep();
      renderWizard();
      persistState();
    });
  }

  getStepInputs(5).forEach((field) => {
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid-field")) {
        const fieldValid = field.value.trim() !== "" && field.checkValidity();
        field.classList.toggle("is-invalid-field", !fieldValid);
      }
      if (isStepComplete(5)) clearStepInvalid(5);
      unlockedStep = getSequentialUnlockedStep();
      renderWizard();
      persistState();
    });

    field.addEventListener("change", () => {
      if (field.classList.contains("is-invalid-field")) {
        const fieldValid = field.value.trim() !== "" && field.checkValidity();
        field.classList.toggle("is-invalid-field", !fieldValid);
      }
      if (isStepComplete(5)) clearStepInvalid(5);
      unlockedStep = getSequentialUnlockedStep();
      renderWizard();
      persistState();
    });
  });

  form.addEventListener("submit", (event) => {
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

    const valid = validateStep(5, true, true);
    if (!valid) {
      setStatus("requiredFields");
      return;
    }

    isSubmitting = true;
    submitBtn.disabled = true;
    updateSubmitText();
    setStatus("sending");

    window.setTimeout(() => {
      try {
        form.reset();
        form.querySelectorAll(".is-invalid-field").forEach((el) => el.classList.remove("is-invalid-field"));
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
    }, 1100);
  });

  function syncI18nRuntimeText() {
    stepButtons.forEach((btn) => {
      const step = Number(btn.dataset.stepJump);
      if (!Number.isInteger(step) || step < 1 || step > TOTAL_STEPS) return;
      btn.textContent = tr(`evaluation.wizard.steps.step${step}`, btn.textContent);
    });

    updateProgress();
    updateSubmitText();

    if (statusState !== "idle") {
      setStatus(statusState);
    }
  }

  restoreState();
  bindSinglePreferredPhase();
  clearStepInvalid(1);
  clearStepInvalid(2);
  clearStepInvalid(3);
  clearStepInvalid(4);
  clearStepInvalid(5);
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
          mod.applyTranslations(document.getElementById("eval-wizard") || document);
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
      // Keep local fallbacks.
    });
})();
