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
    function normalizePath(pathname) {
      const clean = (pathname || "").replace(/\\/g, "/");
      const noIndex = clean.replace(/\/index\.html?$/i, "/");
      const noTrailing = noIndex.replace(/\/+$/, "");
      return noTrailing || "/";
    }

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

    let menuHeader = menu.querySelector("[data-mobile-menu-header]");
    if (!menuHeader) {
      const navLogo = nav.querySelector(".nav-logo");
      const navLogoImg = navLogo ? navLogo.querySelector("img") : null;
      const logoHref = navLogo ? navLogo.getAttribute("href") : "./index.html";
      const logoSrc = navLogoImg ? navLogoImg.getAttribute("src") : "";
      const logoAlt = navLogoImg ? navLogoImg.getAttribute("alt") : "Nanoker";

      menuHeader = document.createElement("div");
      menuHeader.className = "mobile-menu-header";
      menuHeader.setAttribute("data-mobile-menu-header", "");

      const logoLink = document.createElement("a");
      logoLink.className = "mobile-menu-logo";
      logoLink.setAttribute("href", logoHref || "./index.html");
      logoLink.setAttribute("aria-label", "Nanoker Home");
      if (logoSrc) {
        const logoImage = document.createElement("img");
        logoImage.setAttribute("src", logoSrc);
        logoImage.setAttribute("alt", logoAlt || "Nanoker");
        logoLink.appendChild(logoImage);
      } else {
        logoLink.textContent = "Nanoker";
      }

      const closeBtn = document.createElement("button");
      closeBtn.className = "mobile-menu-close";
      closeBtn.setAttribute("type", "button");
      closeBtn.setAttribute("aria-label", "Close menu");
      closeBtn.textContent = "✕";

      menuHeader.appendChild(logoLink);
      menuHeader.appendChild(closeBtn);
      menu.prepend(menuHeader);
    }

    let divider = menu.querySelector(".mobile-menu-divider");
    if (!divider) {
      divider = document.createElement("div");
      divider.className = "mobile-menu-divider";
      divider.setAttribute("aria-hidden", "true");
      menuHeader.insertAdjacentElement("afterend", divider);
    }

    if (menu.firstElementChild !== menuHeader) {
      menu.prepend(menuHeader);
    }
    if (menuHeader.nextElementSibling !== divider) {
      menuHeader.insertAdjacentElement("afterend", divider);
    }

    const menuCloseBtn = menu.querySelector(".mobile-menu-close");
    const menuLinks = Array.from(menu.querySelectorAll("a.nav-link")).filter((a) => !!a.getAttribute("href"));
    menuLinks.forEach((link, index) => {
      link.classList.add("mobile-menu-link");
      link.style.setProperty("--menu-link-delay", `${60 + index * 30}ms`);
    });

    const currentPath = normalizePath(window.location.pathname);
    const activeFromMarkup = menuLinks.find(
      (link) => link.classList.contains("is-active") || link.getAttribute("aria-current") === "page"
    );
    const activeFromUrl = menuLinks.find((link) => {
      try {
        const href = link.getAttribute("href");
        if (!href) return false;
        const linkPath = normalizePath(new URL(href, window.location.href).pathname);
        return linkPath === currentPath;
      } catch (_error) {
        return false;
      }
    });
    const activeLink = activeFromMarkup || activeFromUrl || null;
    menuLinks.forEach((link) => link.classList.remove("menu-item-active"));
    if (activeLink) activeLink.classList.add("menu-item-active");

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

    if (menuCloseBtn) {
      menuCloseBtn.addEventListener("click", () => {
        toggleBtn.click();
      });
    }

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
