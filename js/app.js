/**
 * app.js - Main application initialization
 * Initializes all modules and sets up the UI
 */

/**
 * Initialize sidebar and activity bar functionality
 */
function initSidebarEvents() {
  // Activity bar panel toggles
  document.querySelectorAll(".ai[data-panel]").forEach((icon) => {
    icon.addEventListener("click", () => {
      const sb = document.getElementById("sidebar");
      if (icon.classList.contains("active")) {
        // Collapse sidebar
        icon.classList.remove("active");
        sb.classList.add("collapsed");
      } else {
        // Expand sidebar
        document
          .querySelectorAll(".ai")
          .forEach((i) => i.classList.remove("active"));
        icon.classList.add("active");
        sb.classList.remove("collapsed");
      }
    });
  });

  // Sidebar close button
  document.getElementById("sb-close").addEventListener("click", () => {
    document.getElementById("sidebar").classList.add("collapsed");
    document
      .querySelectorAll(".ai")
      .forEach((i) => i.classList.remove("active"));
  });
}

/**
 * Main initialization function
 * Called when DOM is fully loaded
 */
function initApp() {
  // Initialize all event listeners
  initEditorEvents();
  initTerminalEvents();
  initPaletteEvents();
  initGlobalShortcuts();
  initSidebarEvents();

  // Render initial editor state
  renderEditor("home");

  // Show welcome notification
  setTimeout(() => {
    notify(
      "Welcome to Alisher's Portfolio! Press Ctrl+P to open command palette",
    );
  }, 500);
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", initApp);

// Alternative initialization if DOM is already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
