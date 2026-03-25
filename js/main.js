import { initThreeBackground } from "./three-bg.js?v=13";
import { initLanguageSwitcher, t } from "./lang.js?v=11";

let three = null;
let bgSections = [];
let unbindScrollDrivenBackground = null;
let appBootstrapped = false;
let threeStartScheduled = false;
let revealObserver = null;
let langChangeBound = false;
let revealMotionBound = false;

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

const REVEAL_ROOT_SELECTOR = ".section, .hero-bridge, .footer";
const REVEAL_MOBILE = window.matchMedia("(max-width: 820px)");

function logMaterialsCanvasState(state) {
  if (!DEV_BG_DEBUG || !MOBILE_BG_DEBUG || state !== "materials") return;
  const canvas = document.querySelector("canvas.three-bg-canvas");
  const opacity = canvas ? getComputedStyle(canvas).opacity : "missing";
  console.warn("[three][materials] no-three:", document.body.classList.contains("no-three"));
  console.warn("[three][materials] canvas opacity:", opacity);
}

function getNavbarEl() {
  const byData = document.querySelector("[data-nav]");
  if (byData) return byData;
  return document.getElementById("navbar");
}

function getBgSections() {
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

  return observed.length ? observed : [document.body];
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

function getVisibleBgState(sections = bgSections) {
  if (!sections.length) return "hero";
  const best = getClosestSectionToViewportMid(sections);
  return resolveBgState(best) || "hero";
}

function setThreeState(state) {
  if (!three) return;
  three.setTargetState(state || "hero");
}

function syncCurrentBgState() {
  setThreeState(getVisibleBgState());
}

function bindScrollDrivenBackground(sections) {
  if (!sections.length) {
    setThreeState("hero");
    return () => {};
  }

  let currentBg = "";
  let ticking = false;

  const update = () => {
    ticking = false;
    const nextState = getVisibleBgState(sections);
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

function startThreeNow() {
  threeStartScheduled = false;

  if (SHOULD_LIMIT_HEAVY_WORK || document.body.classList.contains("no-three")) return;

  try {
    three = initThreeBackground();
    three.refresh?.();
    syncCurrentBgState();

    if (!unbindScrollDrivenBackground) {
      unbindScrollDrivenBackground = bindScrollDrivenBackground(bgSections);
    }
  } catch (error) {
    console.warn("Three no pudo inicializarse en este dispositivo:", error);
    document.body.classList.add("no-three");
  }
}

function ensureThreeStarted() {
  if (SHOULD_LIMIT_HEAVY_WORK) {
    document.body.classList.add("no-three");
    return;
  }

  if (three?.isDisposed?.()) {
    three = null;
  }

  if (three) {
    three.resume?.();
    three.refresh?.();
    syncCurrentBgState();
    return;
  }

  if (threeStartScheduled) return;
  threeStartScheduled = true;

  const deferThreeInit = MOBILE_BG_DEBUG || window.matchMedia("(max-width: 900px)").matches;
  if (deferThreeInit) {
    scheduleNonCriticalWork(startThreeNow, { timeout: 1800 });
  } else {
    requestAnimationFrame(() => requestAnimationFrame(startThreeNow));
  }
}

function setRevealDelay(el, step) {
  if (!el) return;

  const baseDelay = REVEAL_MOBILE.matches ? 55 : 90;
  const maxDelay = REVEAL_MOBILE.matches ? 260 : 520;
  const delay = Math.min(step * baseDelay, maxDelay);
  el.style.setProperty("--reveal-delay", `${delay}ms`);
}

function bindRevealElement(el, step, options = {}) {
  if (!el || el.dataset.revealBound === "true") return;

  el.dataset.revealBound = "true";
  el.classList.add(options.shell ? "reveal-shell" : "reveal-item");

  if (options.offset) {
    el.style.setProperty("--reveal-offset", options.offset);
  }

  if (options.blur) {
    el.style.setProperty("--reveal-blur", options.blur);
  }

  setRevealDelay(el, step);
}

function bindRevealSequence(scope, selectors, startStep, options = {}) {
  if (!scope) return startStep;

  let step = startStep;
  const items = Array.from(scope.querySelectorAll(selectors.join(",")));

  items.forEach((item) => {
    if (item.closest(".material-portal")) return;
    const nestedReveal = item.parentElement?.closest(".reveal-item");
    if (nestedReveal && scope.contains(nestedReveal)) return;
    bindRevealElement(item, step, options);
    step += 1;
  });

  return step;
}

function prepareRevealTargets() {
  const roots = Array.from(document.querySelectorAll(REVEAL_ROOT_SELECTOR));
  if (!roots.length) return roots;

  document.documentElement.classList.add("js-motion");

  roots.forEach((root) => {
    if (root.dataset.revealPrepared === "true") return;

    root.dataset.revealPrepared = "true";

    if (root.matches(".section")) {
      let step = 0;
      const shell =
        root.querySelector(":scope > .card, :scope > .cta-panel, :scope > .value-content, :scope > .partners");

      if (shell) {
        bindRevealElement(shell, step, {
          shell: true,
          offset: REVEAL_MOBILE.matches ? "18px" : "28px",
          blur: "10px",
        });
        step += 1;
      }

      step = bindRevealSequence(
        shell || root,
        [
          ".card-tag",
          ".value-eyebrow",
          ".cta-kicker",
          "h2",
          ".section-title",
          ".section-subtitle",
          ".section-intro",
          ".lead",
          "p",
          ".spec-item",
          ".mini-tile",
          ".detail-card",
          ".trust-item",
          ".value-card",
          ".metric-card",
          ".feature-card",
          ".feature-grid > *",
          ".value-grid > *",
          ".cta-actions",
          ".card-cta",
        ],
        step
      );

      return;
    }

    if (root.matches(".hero-bridge")) {
      let step = 0;
      const panel = root.querySelector(".hero-bridge-panel");
      bindRevealElement(panel, step, {
        shell: true,
        offset: REVEAL_MOBILE.matches ? "16px" : "24px",
        blur: "10px",
      });
      step += 1;
      bindRevealSequence(
        root,
        [".hero-bridge-eyebrow", ".hero-bridge-text", ".hero-bridge-actions", ".hero-bridge-actions .btn"],
        step
      );
      return;
    }

    if (root.matches(".footer")) {
      let step = 0;
      root.querySelectorAll(".f-brand, .f-col").forEach((column) => {
        bindRevealElement(column, step, {
          shell: true,
          offset: REVEAL_MOBILE.matches ? "18px" : "26px",
          blur: "8px",
        });
        step += 1;
      });
      bindRevealSequence(root, [".system-status", ".legal-footer"], step);
    }
  });

  return roots;
}

function activateRevealRoot(root) {
  if (!root) return;

  root.classList.add("is-inview");
  if (root.matches(".section")) {
    root.classList.add("active");
  }
}

function initRevealObserver() {
  const revealRoots = prepareRevealTargets();
  if (!revealRoots.length) return;

  if (PREFERS_REDUCED_MOTION.matches || !("IntersectionObserver" in window)) {
    revealObserver?.disconnect();
    revealRoots.forEach((root) => activateRevealRoot(root));
    return;
  }

  if (revealObserver) {
    revealObserver.disconnect();
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        activateRevealRoot(entry.target);
        revealObserver?.unobserve(entry.target);
      });
    },
    {
      threshold: REVEAL_MOBILE.matches ? 0.14 : 0.18,
      rootMargin: REVEAL_MOBILE.matches ? "0px 0px -10% 0px" : "0px 0px -12% 0px",
    }
  );

  revealRoots.forEach((root) => revealObserver.observe(root));
}

function bindRevealMotionPreferences() {
  if (revealMotionBound || typeof PREFERS_REDUCED_MOTION.addEventListener !== "function") return;

  const refreshRevealState = () => initRevealObserver();
  PREFERS_REDUCED_MOTION.addEventListener("change", refreshRevealState);
  REVEAL_MOBILE.addEventListener?.("change", refreshRevealState);
  revealMotionBound = true;
}

function bootstrapApp() {
  const currentPage = window.location.pathname.split("/").pop();

  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) link.classList.add("is-active");
  });

  initLanguageSwitcher({ observeDOM: true });
  syncHeroI18nCopy();

  if (!langChangeBound) {
    window.addEventListener("lang:change", syncHeroI18nCopy);
    langChangeBound = true;
  }

  updateNavScrolled();
  initRevealObserver();
  bindRevealMotionPreferences();

  bgSections = getBgSections();
  ensureThreeStarted();

  if (!bgSections.length) {
    setThreeState("hero");
    return;
  }

  syncCurrentBgState();
}

function handlePageShow(event) {
  if (!appBootstrapped) return;
  if (SHOULD_LIMIT_HEAVY_WORK) return;

  bgSections = getBgSections();
  ensureThreeStarted();
}

function handlePageHide() {
  if (!three) return;
  three.pause?.();
}

function handleVisibilityResume() {
  if (document.hidden || !three) return;
  three.resume?.();
  three.refresh?.();
  syncCurrentBgState();
}

function init() {
  if (appBootstrapped) return;
  appBootstrapped = true;

  bootstrapApp();

  window.addEventListener("pageshow", handlePageShow);
  window.addEventListener("pagehide", handlePageHide);
  document.addEventListener("visibilitychange", handleVisibilityResume);
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
