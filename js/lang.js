// js/lang.js
import { I18N } from "./i18n.js";

const KEY = "nanoker-lang";

// Normaliza: "es-ES" -> "es"
function normalizeLang(raw) {
  const base = String(raw || "").toLowerCase().split("-")[0];
  return base === "es" ? "es" : "en";
}

function safeGetStoredLang() {
  try {
    return localStorage.getItem(KEY);
  } catch (_error) {
    return null;
  }
}

function safeSetStoredLang(lang) {
  try {
    localStorage.setItem(KEY, lang);
  } catch (_error) {
    // Ignore storage write errors (private mode / disabled storage).
  }
}

const initialDocLang =
  document.documentElement.getAttribute("data-lang") ||
  document.documentElement.lang;

let current = normalizeLang(safeGetStoredLang() || initialDocLang || navigator.language);
if (!I18N[current]) current = "en";

let domObserver = null;
let hasBoundNoopHashGuard = false;
let hasInitializedCookieBanner = false;

const COOKIE_CONSENT_KEY = "cookieConsent";
const COOKIE_CONSENT_VALUES = new Set(["accepted", "rejected"]);

export function getLang() {
  return current;
}

// t() con fallback: si no existe la key, devuelve fallback
export function t(path, fallback) {
  const value = String(path || "")
    .split(".")
    .reduce((o, k) => (o && typeof o === "object" ? o[k] : undefined), I18N[current]);

  if (typeof value === "string" && value.trim() !== "") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function formatWithArgs(template, args) {
  if (typeof template !== "string" || !Array.isArray(args) || !args.length) return template;
  return template.replace(/\{(\d+)\}/g, (match, idx) => {
    const i = Number(idx);
    return Number.isInteger(i) && i >= 0 && i < args.length ? args[i] : match;
  });
}

function parseArgs(rawArgs) {
  if (typeof rawArgs !== "string") return [];
  return rawArgs
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "");
}

function setHtmlLang(lang) {
  document.documentElement.lang = lang;
  document.documentElement.setAttribute("data-lang", lang);
}

function updateToggleLabels(root = document) {
  const toggles = root.querySelectorAll?.("[data-lang-toggle]") || [];

  const legacy = document.getElementById("langToggle");

  const render = (btn) => {
    const isES = current === "es";
    btn.setAttribute(
      "aria-label",
      isES ? "Cambiar idioma a inglés" : "Switch language to Spanish"
    );
    btn.setAttribute("aria-pressed", isES ? "true" : "false");
  };

  toggles.forEach((btn) => {
    render(btn);
  });

  if (legacy && !legacy.hasAttribute("data-lang-toggle")) {
    render(legacy);
  }
}

function bindNoopHashGuard() {
  if (hasBoundNoopHashGuard) return;
  hasBoundNoopHashGuard = true;

  document.addEventListener(
    "click",
    (event) => {
      const anchor = event.target?.closest?.("a[href]");
      if (!anchor || anchor.hasAttribute("data-allow-empty-hash")) return;

      const href = anchor.getAttribute("href");
      const normalized = String(href || "").trim();
      const isNoopHref =
        normalized === "#" ||
        normalized === "" ||
        normalized === "." ||
        normalized === "./";

      if (!isNoopHref) return;
      event.preventDefault();
    },
    true
  );
}

function safeGetCookieConsent() {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch (_error) {
    return null;
  }
}

function safeSetCookieConsent(value) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch (_error) {
    // Ignore storage write errors (private mode / disabled storage).
  }
}

function resolveCookiesPolicyHref() {
  const pathname = String(window.location.pathname || "").replace(/\\/g, "/");
  return pathname.includes("/politicas/") ? "../../cookies.html" : "./cookies.html";
}

function removeCookieBanner(banner) {
  if (!banner || !banner.parentNode) return;
  banner.parentNode.removeChild(banner);
}

function dismissCookieBanner(banner, value) {
  if (!banner || banner.dataset.closing === "1") return;
  banner.dataset.closing = "1";
  safeSetCookieConsent(value);
  banner.classList.remove("is-visible");
  banner.classList.add("is-hiding");

  let removed = false;
  const finalize = () => {
    if (removed) return;
    removed = true;
    removeCookieBanner(banner);
  };

  banner.addEventListener("animationend", finalize, { once: true });
  window.setTimeout(finalize, 420);
}

function createCookieBanner() {
  if (!document.body || document.querySelector("[data-cookie-consent]")) return;

  const banner = document.createElement("aside");
  banner.className = "cookie-consent";
  banner.setAttribute("data-cookie-consent", "");
  banner.setAttribute("aria-labelledby", "cookie-consent-title");
  banner.setAttribute("aria-describedby", "cookie-consent-description");

  const panel = document.createElement("div");
  panel.className = "cookie-consent__panel";

  const content = document.createElement("div");
  content.className = "cookie-consent__content";

  const title = document.createElement("h2");
  title.id = "cookie-consent-title";
  title.className = "cookie-consent__title";
  title.setAttribute("data-i18n", "cookieBanner.title");
  title.textContent = "Cookies";

  const description = document.createElement("p");
  description.id = "cookie-consent-description";
  description.className = "cookie-consent__description";
  description.setAttribute("data-i18n", "cookieBanner.description");
  description.textContent = "We use cookies to improve your experience and analyze website usage.";

  const link = document.createElement("a");
  link.className = "cookie-consent__link";
  link.href = resolveCookiesPolicyHref();
  link.setAttribute("data-i18n", "cookieBanner.learnMore");
  link.textContent = "Learn more";

  content.append(title, description, link);

  const actions = document.createElement("div");
  actions.className = "cookie-consent__actions";

  const rejectButton = document.createElement("button");
  rejectButton.type = "button";
  rejectButton.className = "cookie-consent__button cookie-consent__button--ghost";
  rejectButton.setAttribute("data-cookie-action", "rejected");
  rejectButton.setAttribute("data-i18n", "cookieBanner.reject");
  rejectButton.textContent = "Reject";

  const acceptButton = document.createElement("button");
  acceptButton.type = "button";
  acceptButton.className = "cookie-consent__button cookie-consent__button--primary";
  acceptButton.setAttribute("data-cookie-action", "accepted");
  acceptButton.setAttribute("data-i18n", "cookieBanner.accept");
  acceptButton.textContent = "Accept";

  actions.append(rejectButton, acceptButton);
  panel.append(content, actions);
  banner.append(panel);

  banner.addEventListener("click", (event) => {
    const actionButton = event.target?.closest?.("[data-cookie-action]");
    if (!actionButton) return;

    const value = actionButton.getAttribute("data-cookie-action");
    if (!COOKIE_CONSENT_VALUES.has(value)) return;
    dismissCookieBanner(banner, value);
  });

  document.body.appendChild(banner);
  applyTranslations(banner);

  window.requestAnimationFrame(() => {
    banner.classList.add("is-visible");
  });
}

function initCookieBanner() {
  if (hasInitializedCookieBanner) return;
  hasInitializedCookieBanner = true;

  if (COOKIE_CONSENT_VALUES.has(safeGetCookieConsent())) return;
  createCookieBanner();
}

export function applyTranslations(root = document) {
  // data-i18n => textContent
  root.querySelectorAll?.("[data-i18n]")?.forEach((el) => {
    const key = el.dataset.i18n;
    const fallback = el.textContent;
    const args = parseArgs(el.dataset.i18nArgs);
    const val = formatWithArgs(t(key, fallback), args);
    if (typeof val === "string" && val.trim() !== "") el.textContent = val;
  });

  // data-i18n-html => innerHTML
  root.querySelectorAll?.("[data-i18n-html]")?.forEach((el) => {
    const key = el.dataset.i18nHtml;
    const fallback = el.innerHTML;
    const val = t(key, fallback);
    if (typeof val === "string" && val.trim() !== "") el.innerHTML = val;
  });

  // data-i18n-placeholder => placeholder
  root.querySelectorAll?.("[data-i18n-placeholder]")?.forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    const fallback = el.getAttribute("placeholder") || "";
    const val = t(key, fallback);
    if (typeof val === "string" && val.trim() !== "") el.setAttribute("placeholder", val);
  });

  // ✅ refresca labels del toggle en este root
  updateToggleLabels(root);
}

export function setLang(lang) {
  const next = normalizeLang(lang);
  if (!I18N[next] || next === current) return;

  current = next;
  safeSetStoredLang(next);
  setHtmlLang(next);

  applyTranslations();

  window.dispatchEvent(new CustomEvent("lang:change", { detail: { lang: next } }));
}

export function initLanguageSwitcher(options = {}) {
  setHtmlLang(current);
  applyTranslations();
  initCookieBanner();
  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    if (btn.dataset.langBound === "1") return;
    btn.dataset.langBound = "1";
    btn.addEventListener("click", () => {
      setLang(current === "en" ? "es" : "en");
    });
  });

  const legacy = document.getElementById("langToggle");
  if (legacy && !legacy.hasAttribute("data-lang-toggle")) {
    if (legacy.dataset.langBound !== "1") {
      legacy.dataset.langBound = "1";
      legacy.addEventListener("click", () => {
        setLang(current === "en" ? "es" : "en");
      });
    }
  }

  if (options.observeDOM) {
    if (domObserver) domObserver.disconnect();

    domObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes?.forEach((n) => {
          if (n && n.nodeType === 1) applyTranslations(n);
        });
      }
    });

    domObserver.observe(document.body, { childList: true, subtree: true });
  }

  bindNoopHashGuard();
  document.documentElement.setAttribute("data-i18n-ready", "1");
}
