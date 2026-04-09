const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

function readInput() {
  try {
    const raw = fs.readFileSync(0, "utf8").trim();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function normalizeDir(dir) {
  if (!dir) return "";
  if (/^[A-Za-z]:[\\/]/.test(dir)) return dir;

  const msysMatch = dir.match(/^\/([A-Za-z])\/(.*)$/);
  if (msysMatch) {
    return `${msysMatch[1].toUpperCase()}:/${msysMatch[2]}`;
  }

  return dir;
}

function getBranch(cwd) {
  if (!cwd) return "-";

  try {
    const branch = cp
      .execSync("git branch --show-current", {
        cwd,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      })
      .trim();

    return branch || "detached";
  } catch {
    return "-";
  }
}

function fg(r, g, b) {
  return `\x1b[38;2;${r};${g};${b}m`;
}

function bg(r, g, b) {
  return `\x1b[48;2;${r};${g};${b}m`;
}

function style(text, ...codes) {
  return `${codes.join("")}${text}${RESET}`;
}

function badge(icon, text, colors) {
  const frame = style("▎", fg(...colors.accent), DIM);
  const body = style(` ${icon} ${text} `, fg(...colors.fg), bg(...colors.bg), BOLD);
  return `${frame}${body}`;
}

function separator() {
  return style("•", fg(110, 118, 140), DIM);
}

function formatTokens(value) {
  if (!Number.isFinite(value)) return "--";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1).replace(/\.0$/, "")}m`;
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(Math.round(value));
}

function getContextTokens(contextWindow) {
  const usage = contextWindow?.current_usage;
  if (!usage) return null;

  const total =
    (usage.input_tokens || 0) +
    (usage.cache_creation_input_tokens || 0) +
    (usage.cache_read_input_tokens || 0);

  return Number.isFinite(total) ? total : null;
}

function formatContextLabel(contextWindow) {
  const used = contextWindow?.used_percentage;
  const usedTokens = getContextTokens(contextWindow);

  if (!Number.isFinite(used) && !Number.isFinite(usedTokens)) {
    return "ctx --";
  }

  if (Number.isFinite(usedTokens) && Number.isFinite(used)) {
    return `ctx ${formatTokens(usedTokens)} · ${used.toFixed(1)}%`;
  }
  if (Number.isFinite(usedTokens)) {
    return `ctx ${formatTokens(usedTokens)}`;
  }
  return `ctx ${used.toFixed(1)}%`;
}

const input = readInput();
const projectDir = normalizeDir(
  input.workspace?.project_dir ||
    input.workspace?.current_dir ||
    input.cwd ||
    ""
);
const model = input.model?.display_name || input.model?.id || "unknown";
const projectName = projectDir ? path.basename(projectDir) : "-";
const branch = getBranch(projectDir);
const used = input.context_window?.used_percentage;
const ctx = formatContextLabel(input.context_window);

const modelBadge = badge("🤖", model, {
  fg: [244, 214, 255],
  bg: [49, 37, 68],
  accent: [201, 160, 255],
});
const projectBadge = badge("📁", projectName, {
  fg: [196, 221, 255],
  bg: [34, 50, 78],
  accent: [122, 162, 247],
});
const branchBadge = badge("🌿", branch, {
  fg: [220, 245, 198],
  bg: [32, 61, 43],
  accent: [158, 206, 106],
});

let ctxColors = {
  fg: [225, 232, 255],
  bg: [47, 74, 132],
  accent: [125, 168, 255],
};
if (Number.isFinite(used) && used >= 70) {
  ctxColors = {
    fg: [255, 225, 188],
    bg: [108, 45, 45],
    accent: [255, 158, 100],
  };
} else if (Number.isFinite(used) && used >= 40) {
  ctxColors = {
    fg: [255, 228, 163],
    bg: [97, 75, 24],
    accent: [255, 203, 107],
  };
}
const ctxBadge = badge("⚡", ctx, ctxColors);

const dirLabel = style("↳", fg(122, 162, 247), DIM);
const dirText = style(projectDir || "-", fg(160, 174, 208), DIM);

process.stdout.write(
  `${modelBadge} ${separator()} ${projectBadge} ${separator()} ${branchBadge} ${separator()} ${ctxBadge}\n${dirLabel} ${dirText}`
);
