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
  // ✅ Nuevo (limpio): cualquier sección que tenga data-bg="hero|quantum|semi|..."
  const dataSections = Array.from(document.querySelectorAll("[data-bg]"));
  if (dataSections.length) return dataSections;

  // Compat: tu estructura antigua por ids
  const legacyIds = [
    "sec-quantum",
    "sec-semi",
    "sec-extreme",
    "sec-medical",
    "sec-implantes",
    "sec-value",
  ];
  return legacyIds
    .map((id) => document.getElementById(id))
    .filter(Boolean)
    .map((el) => {
      // mapeo a estados del three
      const map = {
        "sec-quantum": "quantum",
        "sec-semi": "semi",
        "sec-extreme": "extreme",
        "sec-medical": "medical",
        "sec-implantes": "implantes",
        "sec-value": "value",
      };
      el.dataset.bg = map[el.id] || "hero";
      return el;
    });
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

  // Si no hay secciones con data-bg, al menos mantenemos hero
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

        const state = best?.dataset?.bg || "hero";
        setThreeState(state);
      },
      { passive: true }
    );

    return;
  }

  // IntersectionObserver PRO: elige la más visible
  let currentBg = "hero";

  const bgObserver = new IntersectionObserver(
    (entries) => {
      // elegimos el entry con más intersectionRatio
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const state = visible.target?.dataset?.bg || "hero";
      if (state && state !== currentBg) {
        currentBg = state;
        setThreeState(state);
      }
    },
    {
      // Punto de lectura: el centro de pantalla aproximadamente
      threshold: [0.2, 0.35, 0.5, 0.65],
      rootMargin: "-20% 0px -55% 0px",
    }
  );

  bgSections.forEach((el) => bgObserver.observe(el));
});
