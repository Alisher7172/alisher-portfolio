/**
 * editor.js - Editor rendering and file switching functionality
 * Handles switching between files, managing tabs, and rendering editor content
 */

let currentFile = "home";
let openTabs = ["home"];

/**
 * Renders editor content for a specific file
 * @param {string} key - File identifier from FILES object
 */
function renderEditor(key) {
  const f = FILES[key];
  if (!f) return;

  const ln = document.getElementById("line-numbers");
  const ec = document.getElementById("editor-content");

  if (key === "projects") {
    // Special handling for projects with card grid
    ln.innerHTML = f.lines
      .map((_, i) => `<div style="line-height:1.65">${i + 1}</div>`)
      .join("");
    ec.innerHTML = buildProjectsView();
  } else {
    // Standard code rendering
    ln.innerHTML = f.lines
      .map((_, i) => `<div style="line-height:1.65">${i + 1}</div>`)
      .join("");
    ec.innerHTML = f.lines
      .map((l, i) => `<div class="cl" data-ln="${i + 1}">${l}</div>`)
      .join("");
  }

  // Update breadcrumbs and language indicator
  document.getElementById("bc-file").textContent = f.name;
  document.getElementById("lang-si").textContent = f.lang;

  // Show/hide home overlay
  document.getElementById("home-overlay").style.display =
    key === "home" ? "flex" : "none";

  // Reset scroll position
  ec.scrollTop = 0;
  ln.scrollTop = 0;

  // Sync line number scroll with editor scroll
  ec.onscroll = () => {
    ln.scrollTop = ec.scrollTop;
  };

  drawMinimap(f.lines);
}

/**
 * Switches to a different file and manages tabs
 * @param {string} key - File identifier
 */
function switchFile(key) {
  if (!FILES[key]) return;

  currentFile = key;

  // Update active file in sidebar
  document
    .querySelectorAll(".fi")
    .forEach((el) => el.classList.toggle("active", el.dataset.file === key));

  // Add tab if not already open
  if (!openTabs.includes(key)) {
    openTabs.push(key);
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.dataset.file = key;
    tab.innerHTML = `${FICONS[key]} ${FILES[key].name} <span class="tc">×</span>`;

    // Close button handler
    tab.querySelector(".tc").addEventListener("click", (e) => {
      e.stopPropagation();
      closeTab(key, tab);
    });

    // Click to switch handler
    tab.addEventListener("click", () => switchFile(key));

    document.getElementById("tabs").appendChild(tab);
  }

  // Update active tab
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.toggle("active", t.dataset.file === key));

  renderEditor(key);
}

/**
 * Closes a tab and switches to another file if necessary
 * @param {string} key - File identifier
 * @param {HTMLElement} tabEl - Tab element to remove
 */
function closeTab(key, tabEl) {
  openTabs = openTabs.filter((k) => k !== key);
  tabEl.remove();

  // If closed tab was active, switch to last open tab
  if (currentFile === key) switchFile(openTabs[openTabs.length - 1] || "home");
}

/**
 * Builds the projects view with cards and code
 * @returns {string} HTML for projects view
 */
function buildProjectsView() {
  const cards = PROJECTS.map((p) => {
    const tags = p.stack.map((t) => `<span class="tag">${t}</span>`).join("");
    const gh = `<a class="pl-btn gh" href="${p.github}" target="_blank">GitHub ↗</a>`;
    const demo = p.demo
      ? `<a class="pl-btn" href="${p.demo}" target="_blank">Live ↗</a>`
      : "";
    return `<div class="proj-card"><h3>${FICONS.projects} ${p.name}</h3><p>${p.desc}</p><div class="tags">${tags}</div><div class="proj-links">${gh}${demo}</div></div>`;
  }).join("");

  const code = FILES.projects.lines
    .map((l, i) => `<div class="cl" data-ln="${i + 1}">${l}</div>`)
    .join("");

  return `<div style="padding:10px 0 6px;font-size:10px;color:#555;text-transform:uppercase;letter-spacing:.1em">Featured Projects</div>
<div class="proj-grid">${cards}</div>
<div style="height:16px;border-bottom:1px solid #2a2a2a;margin-bottom:16px"></div>${code}`;
}

/**
 * Draws minimap on canvas
 * @param {array} lines - Array of line content
 */
function drawMinimap(lines) {
  const canvas = document.getElementById("mm-canvas");
  const ctr = document.getElementById("minimap");
  const W = ctr.offsetWidth,
    H = ctr.offsetHeight;

  canvas.width = W * devicePixelRatio;
  canvas.height = H * devicePixelRatio;
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";

  const ctx = canvas.getContext("2d");
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, W, H);

  // Color palette for minimap
  const pal = [
    "#569cd6",
    "#ce9178",
    "#dcdcaa",
    "#4ec9b0",
    "#6a9955",
    "#808080",
    "#c586c0",
    "#9cdcfe",
  ];

  lines.forEach((l, i) => {
    const txt = l.replace(/<[^>]+>/g, "").trim();
    const len = Math.min(W - 8, txt.length * 0.85);
    if (len > 2) {
      ctx.fillStyle = pal[i % pal.length];
      ctx.globalAlpha = 0.35;
      ctx.fillRect(4, i * 3 + 1, len, 1.5);
    }
  });

  ctx.globalAlpha = 1;
}

/**
 * Initialize editor event listeners
 */
function initEditorEvents() {
  // Sidebar file click handlers
  document
    .querySelectorAll(".fi")
    .forEach((el) =>
      el.addEventListener("click", () => switchFile(el.dataset.file)),
    );

  // Tab close buttons
  document.querySelectorAll(".tab").forEach((tab) => {
    const closeBtn = tab.querySelector(".tc");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeTab(tab.dataset.file, tab);
      });
    }
    tab.addEventListener("click", () => switchFile(tab.dataset.file));
  });

  // Folder header toggle
  document.getElementById("folder-hdr").addEventListener("click", function () {
    this.classList.toggle("open");
    document.getElementById("file-list").style.display =
      this.classList.contains("open") ? "" : "none";
  });
}
