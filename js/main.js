// js/main.js
import { initThreeBackground } from "./three-bg.js?v=13";
import { initLanguageSwitcher, t } from "./lang.js?v=11";

let three = null;
const DEV_BG_DEBUG =
  /localhost|127\.0\.0\.1/.test(window.location.hostname) ||
  window.location.search.includes("bgdebug=1");
const MOBILE_BG_DEBUG = window.matchMedia("(max-width: 820px)").matches;
const PREFERS_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");
const CONNECTION =
  navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
const SHOULD_LIMIT_HEAVY_WORK =
  PREFERS_REDUCED_MOTION.matches ||
  Boolean(CONNECTION?.saveData) ||
  /(?:^|slow-)2g$/.test(String(CONNECTION?.effectiveType || ""));

function logMaterialsCanvasState(state) {
  if (!DEV_BG_DEBUG || !MOBILE_BG_DEBUG || state !== "materials") return;
  const canvas = document.querySelector("canvas.three-bg-canvas");
  const opacity = canvas ? getComputedStyle(canvas).opacity : "missing";
  console.warn("[three][materials] no-three:", document.body.classList.contains("no-three"));
  console.warn("[three][materials] canvas opacity:", opacity);
}

/* ==========================
   HELPERS
========================== */
function getNavbarEl() {
  // ✅ Nuevo (limpio): <nav data-nav>
  const byData = document.querySelector("[data-nav]");
  if (byData) return byData;

  // Compat: si aún existe id="navbar"
  return document.getElementById("navbar");
}

function getBgSections() {
  // Incluye hero explícitamente + secciones con y sin data-bg para evitar huecos.
  const heroEl =
    document.querySelector(".nk-hero") ||
    document.getElementById("top") ||
    document.querySelector("header[data-bg='hero']");
  const sections = Array.from(document.querySelectorAll(".section"));
  const dataSections = Array.from(document.querySelectorAll("[data-bg]"));

  const observed = [];
  const seen = new Set();
  [heroEl, ...sections, ...dataSections].filter(Boolean).forEach((el) => {
    if (seen.has(el)) return;
    seen.add(el);
    observed.push(el);
  });

  if (observed.length) return observed;

  // Compat extrema si no hay estructura moderna.
  return [document.body];
}

function resolveBgState(el) {
  if (!el) return "base";
  if (el.dataset?.bg) return el.dataset.bg;

  const ancestor = el.closest("[data-bg]");
  if (ancestor?.dataset?.bg) return ancestor.dataset.bg;

  if (el.id === "top" || el.classList?.contains("nk-hero")) return "hero";
  return "base";
}

function getClosestSectionToViewportMid(elements) {
  const mid = window.innerHeight * 0.55;
  let best = null;
  let bestDist = Infinity;

  elements.forEach((el) => {
    const r = el.getBoundingClientRect();
    const center = r.top + r.height / 2;
    const dist = Math.abs(center - mid);
    if (dist < bestDist) {
      bestDist = dist;
      best = el;
    }
  });

  return best;
}

function setThreeState(state) {
  if (!three) return;
  three.setTargetState(state || "hero");
}

function bindScrollDrivenBackground(bgSections) {
  if (!bgSections.length) {
    setThreeState("hero");
    return () => {};
  }

  let currentBg = "";
  let ticking = false;

  const update = () => {
    ticking = false;
    const nextState = getVisibleBgState(bgSections);
    if (!nextState || nextState === currentBg) return;
    currentBg = nextState;
    setThreeState(nextState);
    logMaterialsCanvasState(nextState);
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  window.addEventListener("orientationchange", requestUpdate, { passive: true });

  return () => {
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
    window.removeEventListener("orientationchange", requestUpdate);
  };
}

function syncHeroI18nCopy() {
  const tagline = document.querySelector(".nk-hero__tagline[data-i18n='hero.headline']");
  if (tagline) {
    tagline.textContent = t("hero.headline", tagline.textContent);
  }

  const lead = document.querySelector(".nk-hero__lead[data-i18n='hero.lead']");
  if (lead) {
    lead.textContent = t("hero.lead", lead.textContent);
  }

  const scrollText = document.querySelector(".nk-hero__scrollText[data-i18n='hero.scroll']");
  if (scrollText) {
    scrollText.textContent = t("hero.scroll", scrollText.textContent);
  }
}

/* ==========================
   NAV SCROLLED STATE
========================== */
function updateNavScrolled() {
  const nav = getNavbarEl();
  if (!nav) return;

  if (window.scrollY > 50) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
}

let navScrollTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (navScrollTicking) return;
    navScrollTicking = true;
    requestAnimationFrame(() => {
      navScrollTicking = false;
      updateNavScrolled();
    });
  },
  { passive: true }
);

function getVisibleBgState(bgSections) {
  if (!bgSections.length) return "hero";
  const best = getClosestSectionToViewportMid(bgSections);
  return resolveBgState(best) || "hero";
}

function scheduleNonCriticalWork(task, options = {}) {
  const timeout = Number.isFinite(options.timeout) ? options.timeout : 1200;

  if (document.hidden) {
    const onVisible = () => {
      if (document.hidden) return;
      document.removeEventListener("visibilitychange", onVisible);
      scheduleNonCriticalWork(task, options);
    };
    document.addEventListener("visibilitychange", onVisible);
    return;
  }

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(task, { timeout });
    return;
  }

  window.setTimeout(task, Math.min(timeout, 350));
}

/* ==========================
   INIT
========================== */
window.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();

  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("is-active");
    }
  });

  // 1) Idioma
  initLanguageSwitcher({ observeDOM: true });
  syncHeroI18nCopy();
  window.addEventListener("lang:change", syncHeroI18nCopy);

  // 3) Navbar scrolled init
  updateNavScrolled();

  // 4) Section reveal (.section.active)
  const sectionsForReveal = Array.from(document.querySelectorAll(".section"));
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.1 }
    );
    sectionsForReveal.forEach((s) => revealObserver.observe(s));
  } else {
    sectionsForReveal.forEach((s) => s.classList.add("active"));
  }

  // 5) Background state by visible section (data-bg)
  const bgSections = getBgSections();
  const syncCurrentBgState = () => {
    setThreeState(getVisibleBgState(bgSections));
  };

  if (SHOULD_LIMIT_HEAVY_WORK) {
    document.body.classList.add("no-three");
  } else {
    const startThree = () => {
      if (three || document.body.classList.contains("no-three")) return;

      try {
        three = initThreeBackground();
        syncCurrentBgState();
        bindScrollDrivenBackground(bgSections);
      } catch (e) {
        console.warn("Three no pudo inicializarse en este dispositivo:", e);
        document.body.classList.add("no-three");
      }
    };

    const deferThreeInit = MOBILE_BG_DEBUG || window.matchMedia("(max-width: 900px)").matches;
    if (deferThreeInit) scheduleNonCriticalWork(startThree, { timeout: 1800 });
    else requestAnimationFrame(() => requestAnimationFrame(startThree));
  }

  // Si no hay elementos observables, mantenemos hero.
  if (!bgSections.length) {
    setThreeState("hero");
    return;
  }

  // Estado inicial
  syncCurrentBgState();
});
