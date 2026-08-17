(function () {
  "use strict";

  function applyChoice(choice) {
    if (choice === "light" || choice === "dark") {
      document.documentElement.setAttribute("data-theme", choice);
      try {
        localStorage.setItem("theme", choice);
      } catch (e) {}
    } else {
      document.documentElement.removeAttribute("data-theme");
      try {
        localStorage.removeItem("theme");
      } catch (e) {}
    }
    updateButtons(choice);
  }

  function updateButtons(choice) {
    var buttons = document.querySelectorAll(".theme-switch__btn");
    buttons.forEach(function (btn) {
      var isActive = btn.getAttribute("data-theme-choice") === choice;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function init() {
    var stored = null;
    try {
      stored = localStorage.getItem("theme");
    } catch (e) {}
    updateButtons(stored || "auto");

    var buttons = document.querySelectorAll(".theme-switch__btn");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyChoice(btn.getAttribute("data-theme-choice"));
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
