// js/lang.js
import { I18N } from "./i18n.js";

const KEY = "nanoker-lang";

// Normaliza: "es-ES" -> "es"
function normalizeLang(raw) {
  const base = String(raw || "").toLowerCase().split("-")[0];
  return base === "es" ? "es" : "en";
}

let current = normalizeLang(localStorage.getItem(KEY) || navigator.language);
if (!I18N[current]) current = "en";

let domObserver = null;

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

function setHtmlLang(lang) {
  document.documentElement.lang = lang;
}

function updateToggleLabels(root = document) {
  // ✅ Nuevo: toggle(s) por data-attr (sin ids)
  const toggles = root.querySelectorAll?.("[data-lang-toggle]") || [];

  // ✅ Compat legacy: el id solo puede existir a nivel document
  const legacy = document.getElementById("langToggle");

  const label = I18N[current]?.nav?.lang || current.toUpperCase();

  toggles.forEach((btn) => {
    btn.textContent = label;
    if (!btn.getAttribute("aria-label")) btn.setAttribute("aria-label", "Language");
  });

  if (legacy && !legacy.hasAttribute("data-lang-toggle")) {
    legacy.textContent = label;
    if (!legacy.getAttribute("aria-label")) legacy.setAttribute("aria-label", "Language");
  }
}

export function applyTranslations(root = document) {
  // data-i18n => textContent
  root.querySelectorAll?.("[data-i18n]")?.forEach((el) => {
    const key = el.dataset.i18n;
    const fallback = el.textContent;
    const val = t(key, fallback);
    if (typeof val === "string") el.textContent = val;
  });

  // data-i18n-html => innerHTML
  root.querySelectorAll?.("[data-i18n-html]")?.forEach((el) => {
    const key = el.dataset.i18nHtml;
    const fallback = el.innerHTML;
    const val = t(key, fallback);
    if (typeof val === "string") el.innerHTML = val;
  });

  // data-i18n-placeholder => placeholder
  root.querySelectorAll?.("[data-i18n-placeholder]")?.forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    const fallback = el.getAttribute("placeholder") || "";
    const val = t(key, fallback);
    if (typeof val === "string") el.setAttribute("placeholder", val);
  });

  // ✅ refresca labels del toggle en este root
  updateToggleLabels(root);
}

export function setLang(lang) {
  const next = normalizeLang(lang);
  if (!I18N[next]) return;

  current = next;
  localStorage.setItem(KEY, next);
  setHtmlLang(next);

  applyTranslations();

  window.dispatchEvent(new CustomEvent("lang:change", { detail: { lang: next } }));
}

export function initLanguageSwitcher(options = {}) {
  // idioma inicial en <html>
  setHtmlLang(current);

  // traducción inicial
  applyTranslations();

  // ✅ Nuevo: binds por data-lang-toggle
  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLang(current === "en" ? "es" : "en");
    });
  });

  // ✅ Compat legacy id="langToggle"
  const legacy = document.getElementById("langToggle");
  if (legacy && !legacy.hasAttribute("data-lang-toggle")) {
    legacy.addEventListener("click", () => {
      setLang(current === "en" ? "es" : "en");
    });
  }

  // ✅ Opcional: observar DOM inyectado
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
}
