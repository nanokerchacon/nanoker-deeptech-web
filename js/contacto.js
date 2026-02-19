(function () {
  const STORAGE_KEY = "nanoker_contact_wizard_v1";
  const TOTAL_STEPS = 6;

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

  if (!form || !steps.length || !statusEl || !submitBtn) return;

  let activeStep = 1;
  let unlockedStep = 1;
  let advanceTimer = null;
  let step3Confirmed = false;
  let step4Confirmed = false;

  const stepGroups = {
    1: () => Array.from(form.querySelectorAll('input[name="tipo_consulta"]')),
    2: () => Array.from(form.querySelectorAll('input[name="sector"]')),
    3: () => Array.from(form.querySelectorAll('input[name="material"]')),
    5: () => Array.from(form.querySelectorAll("#nombre, #empresa, #email, #pais")),
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
    progressText.textContent = `Paso ${activeStep} de ${TOTAL_STEPS}`;
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
      statusEl.textContent = "Completa los campos obligatorios para continuar.";
      statusEl.classList.add("is-error");
      firstInvalid.focus({ preventScroll: true });
      return false;
    }

    statusEl.classList.remove("is-error");
    if (activeStep === 5) statusEl.textContent = "";
    return true;
  }

  stepGroups[5]().forEach((input) => {
    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid-field")) {
        const valid = input.value.trim() !== "" && input.checkValidity();
        input.classList.toggle("is-invalid-field", !valid);
      }
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    statusEl.classList.remove("is-error");

    unlockedStep = getSequentialUnlockedStep();
    if (unlockedStep < 6) {
      const firstPending = Math.min(unlockedStep, 5);
      goToStep(firstPending);
      statusEl.textContent = "Completa los pasos anteriores antes de enviar.";
      statusEl.classList.add("is-error");
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      statusEl.textContent = "Revisa los campos obligatorios antes de enviar.";
      statusEl.classList.add("is-error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";
    statusEl.textContent = "Enviando…";

    // TODO: Reemplazar este timeout por una petición POST al endpoint real de contacto técnico.
    window.setTimeout(() => {
      statusEl.textContent = "Recibido. Te responderemos en 3–5 días laborables.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar solicitud técnica";

      form.reset();
      stepGroups[5]().forEach((input) => input.classList.remove("is-invalid-field"));
      step3Confirmed = false;
      step4Confirmed = false;
      activeStep = 1;
      unlockedStep = 1;
      sessionStorage.removeItem(STORAGE_KEY);
      renderWizard();
    }, 1100);
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
  persistState();
})();
