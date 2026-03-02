(function () {
  var ACTIVE_MS = 1900;
  var MIN_COOLDOWN = 6000;
  var MAX_COOLDOWN = 8000;

  function clampCooldown(value) {
    var n = Number.parseInt(value, 10);
    if (Number.isFinite(n)) {
      return Math.min(MAX_COOLDOWN, Math.max(MIN_COOLDOWN, n));
    }
    return 7000;
  }

  function decoratePortal(portal) {
    if (portal.dataset.portalInit === "1") {
      return;
    }

    var media = document.createElement("div");
    media.className = "material-portal__media";
    media.style.backgroundImage = "url('" + (portal.dataset.img || "") + "')";

    var glass = document.createElement("div");
    glass.className = "material-portal__glass";

    var hud = document.createElement("div");
    hud.className = "material-portal__hud";
    hud.setAttribute("aria-hidden", "true");

    var scan = document.createElement("div");
    scan.className = "material-portal__scan";
    scan.setAttribute("aria-hidden", "true");

    var lens = document.createElement("div");
    lens.className = "material-portal__lens";
    lens.setAttribute("aria-hidden", "true");

    var readout = document.createElement("p");
    readout.className = "material-portal__readout";
    readout.setAttribute("aria-hidden", "true");
    readout.textContent = portal.dataset.readout || "MATERIAL LOCK";

    portal.appendChild(media);
    portal.appendChild(glass);
    portal.appendChild(hud);
    portal.appendChild(scan);
    portal.appendChild(lens);
    portal.appendChild(readout);

    portal.dataset.cooldownMs = String(clampCooldown(portal.dataset.cooldown));
    portal.dataset.readyAt = "0";
    portal.dataset.portalInit = "1";
  }

  function initMaterialPortals(root) {
    var scope = root || document;
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var sections = Array.prototype.slice.call(scope.querySelectorAll(".section.layout-left, .section.layout-right"));
    var state = {
      activePortal: null,
      timers: new Map(),
      observer: null,
    };

    function clearTimer(portal) {
      var t = state.timers.get(portal);
      if (t) {
        clearTimeout(t);
        state.timers.delete(portal);
      }
    }

    function deactivate(portal) {
      if (!portal) {
        return;
      }
      clearTimer(portal);
      portal.classList.remove("is-active");
      if (state.activePortal === portal) {
        state.activePortal = null;
      }
    }

    function activate(portal) {
      var now = performance.now();
      var readyAt = Number(portal.dataset.readyAt || "0");
      var cooldown = Number(portal.dataset.cooldownMs || "7000");

      if (now < readyAt) {
        return;
      }

      if (state.activePortal && state.activePortal !== portal) {
        deactivate(state.activePortal);
      }

      clearTimer(portal);
      portal.classList.remove("is-active");
      void portal.offsetWidth;
      portal.classList.add("is-active");
      state.activePortal = portal;
      portal.dataset.readyAt = String(now + cooldown);

      var ttl = reducedMotion ? 200 : ACTIVE_MS;
      var timer = window.setTimeout(function () {
        deactivate(portal);
      }, ttl);
      state.timers.set(portal, timer);
    }

    sections.forEach(function (section) {
      var card = section.querySelector(".card");
      var portal = section.querySelector(".material-portal");
      if (!card || !portal) {
        return;
      }

      decoratePortal(portal);

      card.setAttribute("tabindex", card.getAttribute("tabindex") || "0");
      card.addEventListener("mouseenter", function () {
        activate(portal);
      });
      card.addEventListener("focusin", function () {
        activate(portal);
      });
    });

    state.observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var section = entry.target;
          var portal = section.querySelector(".material-portal");
          if (!portal) {
            return;
          }

          var inView = section.dataset.portalInView === "1";
          if (entry.isIntersecting && !inView) {
            section.dataset.portalInView = "1";
            activate(portal);
          }

          if (!entry.isIntersecting) {
            section.dataset.portalInView = "0";
          }
        });
      },
      {
        threshold: 0.52,
      }
    );

    sections.forEach(function (section) {
      section.dataset.portalInView = "0";
      if (section.querySelector(".material-portal")) {
        state.observer.observe(section);
      }
    });

    return {
      destroy: function () {
        if (state.observer) {
          state.observer.disconnect();
        }
        state.timers.forEach(function (timer) {
          clearTimeout(timer);
        });
        state.timers.clear();
        state.activePortal = null;
      },
    };
  }

  window.initMaterialPortals = initMaterialPortals;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initMaterialPortals(document);
    });
  } else {
    initMaterialPortals(document);
  }
})();
