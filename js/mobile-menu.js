(function () {
  if (window.__nanokerMobileMenuInitialized) return;
  window.__nanokerMobileMenuInitialized = true;

  function getFocusableElements(container) {
    if (!container) return [];
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true");
  }

  function initMobileMenu() {
    const nav = document.querySelector("[data-nav]");
    const toggleBtn = nav ? nav.querySelector(".nav-toggle") : document.querySelector(".nav-toggle");
    const menu = nav
      ? nav.querySelector("[data-mobile-menu], #mobileMenu, .nav-center")
      : document.querySelector("[data-mobile-menu], #mobileMenu, .nav-center");

    if (!nav || !toggleBtn || !menu) return;
    if (nav.dataset.mobileMenuBound === "true") return;
    nav.dataset.mobileMenuBound = "true";

    menu.classList.add("mobile-menu");
    if (!menu.id) menu.id = "mobileMenu";
    menu.setAttribute("data-mobile-menu", "");
    menu.setAttribute("role", "dialog");
    menu.setAttribute("aria-modal", "true");

    toggleBtn.setAttribute("aria-controls", menu.id);
    toggleBtn.setAttribute("aria-expanded", "false");

    const menuLinks = Array.from(menu.querySelectorAll("a.nav-link, a")).filter((a) => !!a.getAttribute("href"));
    menuLinks.forEach((link) => link.classList.add("mobile-menu-link"));

    let backdrop = nav.querySelector("[data-mobile-backdrop]");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "mobile-menu-backdrop";
      backdrop.setAttribute("data-mobile-backdrop", "");
      menu.insertAdjacentElement("afterend", backdrop);
    }

    let lastFocusedElement = null;

    function closeMenu() {
      if (!document.body.classList.contains("menu-open")) return;
      document.body.classList.remove("menu-open");
      nav.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      } else {
        toggleBtn.focus();
      }
    }

    function openMenu() {
      if (document.body.classList.contains("menu-open")) return;
      lastFocusedElement = document.activeElement;
      document.body.classList.add("menu-open");
      nav.classList.add("is-open");
      toggleBtn.setAttribute("aria-expanded", "true");

      const firstLink = menuLinks[0];
      if (firstLink) {
        requestAnimationFrame(() => firstLink.focus());
      }
    }

    function toggleMenu() {
      if (document.body.classList.contains("menu-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    toggleBtn.addEventListener("click", toggleMenu);

    backdrop.addEventListener("click", () => {
      closeMenu();
    });

    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (!document.body.classList.contains("menu-open")) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusableElements(menu);
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!menu.contains(active)) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 901px)").matches) {
        closeMenu();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileMenu, { once: true });
  } else {
    initMobileMenu();
  }
})();
