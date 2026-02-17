// js/main.js
import { initThreeBackground } from "./three-bg.js";
import { initLanguageSwitcher } from "./lang.js";

let three = null;

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

function setThreeState(state) {
  if (!three) return;
  three.setTargetState(state || "hero");
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

window.addEventListener("scroll", updateNavScrolled, { passive: true });

/* ==========================
   INIT
========================== */
window.addEventListener("DOMContentLoaded", () => {
  // 1) Idioma
  initLanguageSwitcher({ observeDOM: true });

  // 2) Three background
  try {
    three = initThreeBackground();
  } catch (e) {
    console.warn("Three no pudo inicializarse en este dispositivo:", e);
    document.body.classList.add("no-three");
  }

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

  // Si no hay elementos observables, mantenemos hero.
  if (!bgSections.length) {
    setThreeState("hero");
    return;
  }

  // Estado inicial
  setThreeState("hero");

  if (!("IntersectionObserver" in window)) {
    // Fallback simple sin IO
    window.addEventListener(
      "scroll",
      () => {
        // elegimos la sección más cercana al centro
        const mid = window.innerHeight * 0.55;
        let best = null;
        let bestDist = Infinity;

        bgSections.forEach((el) => {
          const r = el.getBoundingClientRect();
          const center = r.top + r.height / 2;
          const dist = Math.abs(center - mid);
          if (dist < bestDist) {
            bestDist = dist;
            best = el;
          }
        });

        const state = resolveBgState(best);
        setThreeState(state);
      },
      { passive: true }
    );

    return;
  }

  // IntersectionObserver PRO: elige la más visible
  let currentBg = "hero";
  let lastState = "hero";
  let lastChangeTime = performance.now();
  let bgStateTimer = null;

  const visibility = new Map(bgSections.map((el) => [el, 0]));

  const bgObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      let bestEl = null;
      let bestRatio = 0;
      visibility.forEach((ratio, el) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestEl = el;
        }
      });

      const state = resolveBgState(bestEl);
      if (!state) return;

      if (state === currentBg) {
        if (bgStateTimer) {
          clearTimeout(bgStateTimer);
          bgStateTimer = null;
        }
        lastState = state;
        return;
      }

      const now = performance.now();
      if (state !== lastState) {
        lastState = state;
        lastChangeTime = now;
      }

      const elapsed = now - lastChangeTime;
      if (elapsed < 200) {
        if (bgStateTimer) clearTimeout(bgStateTimer);
        bgStateTimer = setTimeout(() => {
          if (lastState !== currentBg) {
            currentBg = lastState;
            setThreeState(lastState);
          }
          bgStateTimer = null;
        }, 200 - elapsed);
        return;
      }

      currentBg = state;
      setThreeState(state);
    },
    {
      // Punto de lectura: el centro de pantalla aproximadamente
      threshold: [0.2, 0.35, 0.5, 0.65],
      rootMargin: "-20% 0px -55% 0px",
    }
  );

  bgSections.forEach((el) => bgObserver.observe(el));
});
