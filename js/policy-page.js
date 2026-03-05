import {
  ENABLE_QUALITY_FORM_EMBED,
  FORM_URL,
  POLICIES,
  getPolicyById,
} from "./policies-data.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function relatedPolicies(currentPolicy) {
  if (currentPolicy.category === "policy") {
    return POLICIES.filter(
      (item) => item.category === "policy" && item.id !== currentPolicy.id
    );
  }

  return POLICIES.filter((item) => item.category === "policy");
}

function createMetaDescription(policy) {
  return policy.description || `Información sobre ${policy.titleFull} en NANOKER.`;
}

function policyTitle(policy) {
  return `${policy.titleFull} | Nanoker`;
}

function policyCanonical(policy) {
  return `https://nanoker.com/politicas/${policy.slug}/`;
}

function renderIntro(introParagraphs) {
  return introParagraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("\n");
}

function renderPolicyHeading(policy) {
  if (policy.category === "policy" && policy.titlePrefix && policy.titleHighlight) {
    return `${escapeHtml(policy.titlePrefix)} <span class="policy-highlight">${escapeHtml(
      policy.titleHighlight
    )}</span>`;
  }

  return escapeHtml(policy.titleFull);
}

function renderDownloadSection(policy) {
  if (policy.category === "certifications") {
    const links = (policy.files || [])
      .map(
        (file) =>
          `<li>
            <div class="policy-download-copy">
              <strong>${escapeHtml(file.label)}</strong>
              <p>${escapeHtml(file.description || "")}</p>
            </div>
            <a class="footer-action" href="${file.path}" target="_blank" rel="noopener noreferrer">Ver certificado (PDF)</a>
          </li>`
      )
      .join("\n");

    return `
      <section class="policy-card" aria-labelledby="descargas-certificaciones">
        <h2 id="descargas-certificaciones">Certificados disponibles</h2>
        <ul class="policy-download-list">
          ${links}
        </ul>
      </section>
    `;
  }

  return `
    <section class="policy-card" aria-labelledby="descargar-pdf">
      <h2 id="descargar-pdf">Documento oficial</h2>
      <a
        class="footer-action"
        href="#"
        data-policy-preview="${policy.pdfPath}"
        data-policy-title="${escapeHtml(policy.titleFull)}"
      >
        Ver documento
      </a>
    </section>
  `;
}

function renderCommitments(policy) {
  if (policy.category !== "policy" || !Array.isArray(policy.commitments)) return "";

  const items = policy.commitments
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("\n");

  return `
    <section class="policy-card" aria-labelledby="nuestro-compromiso">
      <h2 id="nuestro-compromiso">Nuestro compromiso</h2>
      <ul class="policy-commitments">
        ${items}
      </ul>
    </section>
  `;
}

function renderScope(policy) {
  if (policy.category !== "policy" || !policy.scope) return "";

  return `
    <section class="policy-card" aria-labelledby="alcance-politica">
      <h2 id="alcance-politica">Alcance</h2>
      <p class="policy-scope">${escapeHtml(policy.scope)}</p>
    </section>
  `;
}

function renderQualityForm(policy) {
  if (policy.id !== "calidad") return "";

  const embedMarkup = ENABLE_QUALITY_FORM_EMBED
    ? `
      <iframe
        src="${FORM_URL}"
        title="NANOKER Customer Satisfaction Survey"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        style="width: 100%; min-height: 640px; border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 12px;"
      ></iframe>
    `
    : `
      <!--
      Embed opcional (activable con ENABLE_QUALITY_FORM_EMBED=true):
      <iframe
        src="${FORM_URL}"
        title="NANOKER Customer Satisfaction Survey"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        style="width: 100%; min-height: 640px; border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 12px;"
      ></iframe>
      -->
    `;

  return `
    <section class="policy-card" aria-labelledby="customer-survey">
      <h2 id="customer-survey">NANOKER Customer Satisfaction Survey</h2>
      <p>Comparte tu experiencia para ayudarnos a mejorar continuamente nuestros procesos y soporte técnico.</p>
      <a class="footer-action" href="${FORM_URL}" target="_blank" rel="noopener noreferrer">Rellenar formulario</a>
      ${embedMarkup}
    </section>
  `;
}

function renderRelated(policy) {
  const cards = relatedPolicies(policy)
    .map(
      (item) => `
        <li>
          <a href="../${item.slug}/">
            <strong>${escapeHtml(item.titleShort)}</strong>
            <span>${escapeHtml(item.titleFull)}</span>
          </a>
        </li>
      `
    )
    .join("\n");

  return `
    <section class="policy-card" aria-labelledby="tambien-interesa">
      <h2 id="tambien-interesa">También te puede interesar</h2>
      <ul class="policy-related-list">
        ${cards}
      </ul>
    </section>
  `;
}

function renderPolicyModal() {
  return `
    <div class="policy-modal" id="policyModal" aria-hidden="true">
      <div class="policy-modal-backdrop" data-policy-close></div>
      <div class="policy-modal-panel" role="dialog" aria-modal="true" aria-labelledby="policyModalTitle" tabindex="-1">
        <div class="policy-modal-header">
          <h3 id="policyModalTitle"></h3>
          <button type="button" class="policy-modal-close" data-policy-close aria-label="Cerrar">✕</button>
        </div>
        <div class="policy-modal-body">
          <iframe id="policyModalFrame" title="Vista previa PDF" loading="lazy"></iframe>
        </div>
        <div class="policy-modal-footer">
          <a
            id="policyModalOpen"
            class="policy-modal-open"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir en pestaña
          </a>
          <a
            id="policyModalDownload"
            class="policy-modal-download"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            Descargar PDF
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderPolicyMarkup(policy) {
  return `
    <main class="policy-main" id="top">
      <header class="policy-hero">
        <p class="policy-kicker">POLÍTICAS</p>
        <h1>${renderPolicyHeading(policy)}</h1>
        <p class="policy-lead">${escapeHtml(policy.description)}</p>
      </header>

      <section class="policy-content" aria-labelledby="introduccion-politica">
        <article class="policy-card">
          <h2 id="introduccion-politica">Introducción</h2>
          <div class="policy-intro">
            ${renderIntro(policy.intro || [])}
          </div>
        </article>

        ${renderCommitments(policy)}
        ${renderScope(policy)}
        ${renderDownloadSection(policy)}
        ${renderQualityForm(policy)}
        ${renderRelated(policy)}
      </section>
    </main>
    ${renderPolicyModal()}
  `;
}

function initPolicyPreviewModal(root) {
  const modal = root.querySelector("#policyModal");
  if (!modal || modal.dataset.initialized === "true") return;

  const panel = modal.querySelector(".policy-modal-panel");
  const title = modal.querySelector("#policyModalTitle");
  const frame = modal.querySelector("#policyModalFrame");
  const openLink = modal.querySelector("#policyModalOpen");
  const downloadLink = modal.querySelector("#policyModalDownload");
  const closeTargets = modal.querySelectorAll("[data-policy-close]");
  let lastTrigger = null;

  function getFocusableElements() {
    return Array.from(
      modal.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.hasAttribute("disabled") && !element.getAttribute("aria-hidden"));
  }

  function handleTabTrap(event) {
    if (event.key !== "Tab") return;

    const focusable = getFocusableElements();
    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function onModalKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    handleTabTrap(event);
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", onModalKeydown);
    frame.setAttribute("src", "about:blank");
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
  }

  function openModal({ pdf, policyTitle }, trigger) {
    lastTrigger = trigger;
    title.textContent = policyTitle;
    frame.setAttribute("src", pdf);
    openLink.setAttribute("href", pdf);
    downloadLink.setAttribute("href", pdf);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", onModalKeydown);
    panel.focus();
  }

  root.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-policy-preview]");
    if (!trigger || !root.contains(trigger)) return;

    event.preventDefault();
    const pdf = trigger.getAttribute("data-policy-preview");
    const policyTitle = trigger.getAttribute("data-policy-title") || "Documento";
    if (!pdf) return;
    openModal({ pdf, policyTitle }, trigger);
  });

  closeTargets.forEach((element) => {
    element.addEventListener("click", () => closeModal());
  });

  modal.dataset.initialized = "true";
}

function setSeo(policy) {
  document.title = policyTitle(policy);

  const description = createMetaDescription(policy);
  const canonicalUrl = policyCanonical(policy);

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute("content", description);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", policyTitle(policy));

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute("content", description);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute("content", canonicalUrl);

  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute("content", policyTitle(policy));

  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescription) twitterDescription.setAttribute("content", description);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", canonicalUrl);
}

export function initPolicyPage(policyId) {
  const policy = getPolicyById(policyId);
  const mount = document.querySelector("[data-policy-page]");

  if (!policy || !mount) return;

  setSeo(policy);
  mount.innerHTML = renderPolicyMarkup(policy);
  initPolicyPreviewModal(mount);
}
