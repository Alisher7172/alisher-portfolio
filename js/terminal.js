/**
 * terminal.js - Terminal emulator functionality
 * Handles terminal display, commands, and history
 */

const termCtr = document.getElementById("terminal-container");
const termBody = document.getElementById("term-body");
const termInput = document.getElementById("term-input");
let termHistory = [];
let histIdx = -1;

/**
 * Toggles terminal visibility
 */
function toggleTerminal() {
  termCtr.classList.toggle("open");
  if (termCtr.classList.contains("open")) {
    if (termBody.children.length === 0) initTerm();
    setTimeout(() => termInput.focus(), 150);
  }
}

/**
 * Initializes terminal with welcome message
 */
function initTerm() {
  termPrint(
    `<span style="color:#4ec9b0">Alisher's Portfolio Terminal</span> v1.0.0`,
    false,
  );
  termPrint(
    `<span style="color:#858585">Type <span style="color:#dcdcaa">help</span> for commands.</span>`,
    false,
  );
  termPrint("", false);
}

/**
 * Prints output to terminal
 * @param {string} html - HTML content to print
 * @param {boolean} withPrompt - Whether to show command prompt
 * @param {string} cmd - Command that was executed
 */
function termPrint(html, withPrompt = true, cmd = "") {
  if (withPrompt) {
    const row = document.createElement("div");
    row.className = "tl-row";
    row.innerHTML = `<span class="tp">alisher@portfolio</span><span class="tpath">:~/portfolio</span><span class="tdol">$</span>&nbsp;<span class="tcmd">${cmd}</span>`;
    termBody.appendChild(row);
  }
  const out = document.createElement("div");
  out.className = "tout";
  out.innerHTML = html;
  termBody.appendChild(out);
  termBody.scrollTop = termBody.scrollHeight;
}

/**
 * Terminal commands
 */
const CMDS = {
  help: () =>
    `<span style="color:#dcdcaa">ls · whoami · skills · projects · contact · social · leetcode · hackerrank · open &lt;name&gt; · clear</span>`,

  whoami: () =>
    `<span style="color:#4ec9b0">Alisher Sobitaliev</span> — Software Engineer · Riga, Latvia 🇱🇻<br>EKA University of Applied Sciences, 2024–2028`,

  ls: () =>
    `<span style="color:#61dafb">home.jsx</span>  <span style="color:#e34c26">about.html</span>  <span style="color:#264de4">skills.css</span>  <span style="color:#f7df1e">projects.js</span>  <span style="color:#f89820">contact.json</span>  <span style="color:#519aba">README.md</span>`,

  skills: () =>
    `<span style="color:#dcdcaa">Primary:</span>  Java, Spring Boot, JavaScript, HTML, CSS, Bootstrap
<span style="color:#4ec9b0">DB:</span>       PostgreSQL, MySQL
<span style="color:#569cd6">Tools:</span>    Git, Docker, Postman, python-telegram-bot
<span style="color:#c586c0">Learning:</span> React, Python (adv), C++`,

  projects: () => {
    switchFile("projects");
    return `<span style="color:#4ec9b0">Opened projects.js ↗</span>`;
  },

  contact: () =>
    `<span style="color:#dcdcaa">Email:</span>     xxx.alisher.uz@gmail.com
<span style="color:#dcdcaa">GitHub:</span>    github.com/Alisher7172
<span style="color:#dcdcaa">Telegram:</span>  @Alisher_2002_12_12
<span style="color:#dcdcaa">Location:</span>  Riga, Latvia (Europe/Riga)`,

  social: () =>
    `<span style="color:#569cd6">GitHub:</span>    Alisher7172
<span style="color:#0077b5">LinkedIn:</span>  alisher-sobitaliyev
<span style="color:#26a5e4">Telegram:</span>  @Alisher_2002_12_12
<span style="color:#25d366">WhatsApp:</span>  wa.me/qr/GTQSCGIT5UZWP1
<span style="color:#e1306c">Instagram:</span> alisher_12_12_2002
<span style="color:#1da1f2">Twitter:</span>   @Alishersila
<span style="color:#5865f2">Discord:</span>   alisher_dis`,

  leetcode: () => {
    openLink(ME.leetcode);
    return `<span style="color:#ffa116">Opening LeetCode profile ↗</span>`;
  },

  hackerrank: () => {
    openLink(ME.hackerrank);
    return `<span style="color:#00ea64">Opening HackerRank profile ↗</span>`;
  },

  clear: () => {
    termBody.innerHTML = "";
    return null;
  },

  open: (args) => {
    const t = args.join(" ").toLowerCase();
    if (t.includes("dota")) {
      switchFile("projects");
      return `<span style="color:#4ec9b0">Opening Dota2 Market Parser...</span>`;
    }
    if (t.includes("canteen") || t.includes("cafeteria")) {
      switchFile("projects");
      return `<span style="color:#4ec9b0">Opening School Cafeteria System...</span>`;
    }
    if (t.includes("halal") || t.includes("bot")) {
      switchFile("projects");
      return `<span style="color:#4ec9b0">Opening Halal Connect Bot...</span>`;
    }
    return `<span style="color:#f44747">Unknown project. Try: dota2 | cafeteria | halal</span>`;
  },
};

/**
 * Initialize terminal event listeners
 */
function initTerminalEvents() {
  termInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const raw = termInput.value.trim();
      termInput.value = "";
      histIdx = -1;

      if (raw) termHistory.unshift(raw);

      const [cmd, ...args] = raw.split(" ");
      termPrint("", true, raw);

      if (!cmd) return;

      const h = CMDS[cmd.toLowerCase()];
      if (h) {
        const o = h(args);
        if (o !== null && o !== undefined) termPrint(o, false);
      } else {
        termPrint(
          `<span style="color:#f44747">not found: ${cmd}</span> — try <span style="color:#dcdcaa">help</span>`,
          false,
        );
      }
      termPrint("", false);
    }

    // Arrow up - previous command
    if (e.key === "ArrowUp") {
      histIdx = Math.min(histIdx + 1, termHistory.length - 1);
      termInput.value = termHistory[histIdx] || "";
      e.preventDefault();
    }

    // Arrow down - next command
    if (e.key === "ArrowDown") {
      histIdx = Math.max(histIdx - 1, -1);
      termInput.value = histIdx >= 0 ? termHistory[histIdx] : "";
      e.preventDefault();
    }
  });

  // Toggle terminal button
  document
    .getElementById("toggle-term-btn")
    .addEventListener("click", toggleTerminal);

  // Terminal close button
  const termCloseBtn = document.getElementById("term-close");
  if (termCloseBtn) {
    termCloseBtn.addEventListener("click", () =>
      termCtr.classList.remove("open"),
    );
  }

  // Menu bar terminal option
  document
    .getElementById("m-terminal")
    .addEventListener("click", toggleTerminal);
}
