function isMobile() {
  return window.innerWidth <= 600;
}

function initSidebarEvents() {
  const backdrop = document.getElementById("mobile-backdrop");

  function closeSidebar() {
    document.getElementById("sidebar").classList.add("collapsed");
    document.querySelectorAll(".ai").forEach((i) => i.classList.remove("active"));
    if (backdrop) backdrop.classList.remove("visible");
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeSidebar);
  }

  document.querySelectorAll(".ai[data-panel]").forEach((icon) => {
    icon.addEventListener("click", () => {
      const sb = document.getElementById("sidebar");
      if (icon.classList.contains("active")) {
        closeSidebar();
      } else {
        document.querySelectorAll(".ai").forEach((i) => i.classList.remove("active"));
        icon.classList.add("active");
        sb.classList.remove("collapsed");
        if (isMobile() && backdrop) backdrop.classList.add("visible");
      }
    });
  });

  document.getElementById("sb-close").addEventListener("click", closeSidebar);
}

function initApp() {
  initEditorEvents();
  initTerminalEvents();
  initPaletteEvents();
  initGlobalShortcuts();
  initSidebarEvents();

  renderEditor("home");

  if (isMobile()) {
    document.getElementById("sidebar").classList.add("collapsed");
    document.querySelectorAll(".ai").forEach((i) => i.classList.remove("active"));
  }

  setTimeout(() => {
    notify(
      "Welcome to Alisher's Portfolio! Press Ctrl+P to open command palette",
    );
  }, 500);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
