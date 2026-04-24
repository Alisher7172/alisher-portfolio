/**
 * utils.js - Utility functions shared across modules
 */

/**
 * Shows a notification message
 * @param {string} msg - Message to display
 * @param {number} dur - Duration in milliseconds (default: 3500)
 */
function notify(msg, dur = 3500) {
  const n = document.createElement("div");
  n.className = "notif";
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), dur);
}

/**
 * Opens a link in a new tab
 * @param {string} url - URL to open
 */
function openLink(url) {
  window.open(url, "_blank");
}
