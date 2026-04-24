/**
 * palette.js - Command palette functionality
 * Provides quick access to files and actions via Ctrl+P
 */

const cmdOverlay = document.getElementById("cmd-overlay");
const cmdInput = document.getElementById("cmd-input");
const cmdResults = document.getElementById("cmd-results");

/**
 * Command palette items with categories
 */
const CMD_ITEMS = [
  {
    cat: "Files",
    label: "home.jsx",
    desc: "Open home",
    action: () => switchFile("home"),
  },
  {
    cat: "Files",
    label: "about.html",
    desc: "Open about",
    action: () => switchFile("about"),
  },
  {
    cat: "Files",
    label: "skills.css",
    desc: "Open skills",
    action: () => switchFile("skills"),
  },
  {
    cat: "Files",
    label: "projects.js",
    desc: "Open projects",
    action: () => switchFile("projects"),
  },
  {
    cat: "Files",
    label: "contact.json",
    desc: "Open contact",
    action: () => switchFile("contact"),
  },
  {
    cat: "Files",
    label: "README.md",
    desc: "Open readme",
    action: () => switchFile("readme"),
  },
  {
    cat: "Actions",
    label: "Toggle Terminal",
    desc: "Ctrl+`",
    action: toggleTerminal,
  },
  {
    cat: "Links",
    label: "GitHub",
    desc: "Alisher7172",
    action: () => openLink(ME.github),
  },
  {
    cat: "Links",
    label: "LinkedIn",
    desc: "alisher-sobitaliyev",
    action: () => openLink(ME.linkedin),
  },
  {
    cat: "Links",
    label: "Telegram",
    desc: "@Alisher_2002_12_12",
    action: () => openLink(ME.telegram),
  },
  {
    cat: "Links",
    label: "LeetCode",
    desc: "alisher7172",
    action: () => openLink(ME.leetcode),
  },
  {
    cat: "Links",
    label: "HackerRank",
    desc: "alisher20021212",
    action: () => openLink(ME.hackerrank),
  },
  {
    cat: "Links",
    label: "Email",
    desc: "xxx.alisher.uz@gmail.com",
    action: () => openLink("mailto:" + ME.email),
  },
];

/**
 * Opens the command palette
 */
function openCmdPalette() {
  cmdOverlay.classList.add("open");
  cmdInput.value = "";
  renderCmdResults("");
  setTimeout(() => cmdInput.focus(), 50);
}

/**
 * Closes the command palette
 */
function closeCmdPalette() {
  cmdOverlay.classList.remove("open");
}

/**
 * Renders filtered command results
 * @param {string} q - Search query
 */
function renderCmdResults(q) {
  q = q.toLowerCase();
  const filtered = CMD_ITEMS.filter(
    (i) =>
      i.label.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q),
  );

  let html = "";
  let lastCat = "";

  filtered.forEach((item, idx) => {
    if (item.cat !== lastCat) {
      html += `<div class="cr-cat">${item.cat}</div>`;
      lastCat = item.cat;
    }
    html += `<div class="cr ${idx === 0 ? "sel" : ""}" data-idx="${idx}">${item.label}<span class="cr-desc">${item.desc}</span></div>`;
  });

  cmdResults.innerHTML =
    html || `<div class="cr" style="color:#555">No results</div>`;

  // Attach click handlers to results
  cmdResults.querySelectorAll(".cr[data-idx]").forEach((el, i) => {
    el.addEventListener("click", () => {
      filtered[i].action();
      closeCmdPalette();
    });
  });
}

/**
 * Initialize command palette event listeners
 */
function initPaletteEvents() {
  // Input search
  cmdInput.addEventListener("input", () => renderCmdResults(cmdInput.value));

  // Keyboard navigation
  cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCmdPalette();
      return;
    }

    const items = cmdResults.querySelectorAll(".cr[data-idx]");
    let cur = [...items].findIndex((el) => el.classList.contains("sel"));

    if (e.key === "Enter" && items[cur]) {
      items[cur].click();
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      items[cur]?.classList.remove("sel");
      cur =
        e.key === "ArrowDown"
          ? Math.min(cur + 1, items.length - 1)
          : Math.max(cur - 1, 0);
      items[cur]?.classList.add("sel");
      e.preventDefault();
    }
  });

  // Overlay click to close
  cmdOverlay.addEventListener("click", (e) => {
    if (e.target === cmdOverlay) closeCmdPalette();
  });

  // Command palette button
  document
    .getElementById("cmd-open-btn")
    .addEventListener("click", openCmdPalette);
}

/**
 * Initialize global keyboard shortcuts
 */
function initGlobalShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + P - open command palette
    if ((e.ctrlKey || e.metaKey) && e.key === "p") {
      e.preventDefault();
      openCmdPalette();
    }

    // Ctrl/Cmd + ` - toggle terminal
    if ((e.ctrlKey || e.metaKey) && e.key === "`") {
      e.preventDefault();
      toggleTerminal();
    }

    // Escape - close command palette
    if (e.key === "Escape" && cmdOverlay.classList.contains("open"))
      closeCmdPalette();
  });
}
