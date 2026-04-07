(() => {
  const STORAGE_KEY = "nanoker-lang";
  const SUPPORTED_LANGS = new Set(["es", "en", "fr", "de"]);

  function normalizeLang(raw) {
    const base = String(raw || "")
      .toLowerCase()
      .split("-")[0];
    return SUPPORTED_LANGS.has(base) ? base : "en";
  }

  let lang = "en";

  try {
    const queryLang = new URLSearchParams(window.location.search).get("lang");
    const raw = queryLang || localStorage.getItem(STORAGE_KEY) || navigator.language || "en";
    lang = normalizeLang(raw);
  } catch (_error) {
    lang = normalizeLang(navigator.language || "en");
  }

  document.documentElement.lang = lang;
  document.documentElement.setAttribute("data-lang", lang);
})();
