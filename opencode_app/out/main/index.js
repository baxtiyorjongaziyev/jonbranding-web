import { randomUUID } from "node:crypto";
import { mkdirSync, readdirSync, statSync, rmSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import * as http from "node:http";
import { createServer } from "node:net";
import { homedir, userInfo, tmpdir } from "node:os";
import { extname, dirname, join, resolve, relative, isAbsolute, basename } from "node:path";
import { setDefaultCACertificates, getCACertificates } from "node:tls";
import electron, { app, crashReporter, netLog, shell, protocol, BrowserWindow, net, nativeImage, nativeTheme, dialog, ipcMain, clipboard, Notification, Menu, utilityProcess } from "electron";
import { Effect, Deferred, Fiber } from "effect";
import contextMenu from "electron-context-menu";
import { execFile, spawnSync, spawn } from "node:child_process";
import { readdir, readFile, access, stat, rm, open } from "node:fs/promises";
import util from "node:util";
import windowState from "electron-window-state";
import { fileURLToPath, pathToFileURL } from "node:url";
import log from "electron-log/main.js";
import { ZipWriter, BlobWriter, BlobReader } from "@zip.js/zip.js";
import Store from "electron-store";
import { marked } from "marked";
import pkg from "electron-updater";
import * as pty from "@lydell/node-pty-win32-x64";
const execFilePromise = util.promisify(execFile);
const exists = (path) => access(path).then(() => true).catch(() => false);
function checkAppExists(appName) {
  if (process.platform === "win32") return true;
  if (process.platform === "linux") return true;
  return checkMacosApp(appName);
}
function resolveAppPath(appName) {
  if (process.platform !== "win32") return appName;
  return resolveWindowsAppPath(appName);
}
async function checkMacosApp(appName) {
  const locations = [`/Applications/${appName}.app`, `/System/Applications/${appName}.app`];
  const home = process.env.HOME;
  if (home) locations.push(`${home}/Applications/${appName}.app`);
  for (const location of locations) {
    if (await exists(location)) return true;
  }
  return execFilePromise("which", [appName]).then(() => true).catch(() => false);
}
async function resolveWindowsAppPath(appName) {
  let output;
  try {
    output = await execFilePromise("where", [appName]).then((r) => r.stdout.toString());
  } catch {
    return null;
  }
  const paths = output.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0);
  const hasExt = (path, ext) => extname(path).toLowerCase() === `.${ext}`;
  const exe = paths.find((path) => hasExt(path, "exe"));
  if (exe) return exe;
  const resolveCmd = async (path) => {
    const content = await readFile(path, "utf8");
    for (const token of content.split('"').map((value) => value.trim())) {
      const lower = token.toLowerCase();
      if (!lower.includes(".exe")) continue;
      const index = lower.indexOf("%~dp0");
      if (index >= 0) {
        const base = dirname(path);
        const suffix = token.slice(index + 5);
        const resolved = suffix.replace(/\//g, "\\").split("\\").filter((part) => part && part !== ".").reduce((current, part) => {
          if (part === "..") return dirname(current);
          return join(current, part);
        }, base);
        if (await exists(resolved)) return resolved;
      }
      if (await exists(token)) return token;
    }
    return null;
  };
  for (const path of paths) {
    if (hasExt(path, "cmd") || hasExt(path, "bat")) {
      const resolved = await resolveCmd(path);
      if (resolved) return resolved;
    }
    if (!extname(path)) {
      const cmd = `${path}.cmd`;
      if (await exists(cmd)) {
        const resolved = await resolveCmd(cmd);
        if (resolved) return resolved;
      }
      const bat = `${path}.bat`;
      if (await exists(bat)) {
        const resolved = await resolveCmd(bat);
        if (resolved) return resolved;
      }
    }
  }
  const key2 = appName.split("").filter((value) => /[a-z0-9]/i.test(value)).map((value) => value.toLowerCase()).join("");
  if (key2) {
    for (const path of paths) {
      const dirs = [dirname(path), dirname(dirname(path)), dirname(dirname(dirname(path)))];
      for (const dir of dirs) {
        try {
          for (const entry of await readdir(dir)) {
            const candidate = join(dir, entry);
            if (!hasExt(candidate, "exe")) continue;
            const stem = entry.replace(/\.exe$/i, "");
            const name = stem.split("").filter((value) => /[a-z0-9]/i.test(value)).map((value) => value.toLowerCase()).join("");
            if (name.includes(key2) || key2.includes(name)) return candidate;
          }
        } catch {
          continue;
        }
      }
    }
  }
  return paths[0] ?? null;
}
const raw = "prod";
const CHANNEL = raw;
const UPDATER_ENABLED = app.isPackaged && CHANNEL !== "dev";
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function hue(v) {
  return (v % 360 + 360) % 360;
}
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 || h.length === 4 ? h.split("").map((c) => c + c).join("") : h;
  const rgb = full.length === 8 ? full.slice(0, 6) : full;
  const num = parseInt(rgb, 16);
  return {
    r: (num >> 16 & 255) / 255,
    g: (num >> 8 & 255) / 255,
    b: (num & 255) / 255
  };
}
function rgbToHex(r, g, b) {
  const toHex = (v) => {
    const clamped = clamp(v, 0, 1);
    const int = Math.round(clamped * 255);
    return int.toString(16).padStart(2, "0");
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function linearToSrgb(c) {
  if (c <= 31308e-7) return c * 12.92;
  return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}
function srgbToLinear(c) {
  if (c <= 0.04045) return c / 12.92;
  return Math.pow((c + 0.055) / 1.055, 2.4);
}
function rgbToOklch(r, g, b) {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l = Math.cbrt(l_);
  const m = Math.cbrt(m_);
  const s = Math.cbrt(s_);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bOk = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.sqrt(a * a + bOk * bOk);
  let H = Math.atan2(bOk, a) * (180 / Math.PI);
  if (H < 0) H += 360;
  return { l: L, c: C, h: H };
}
function oklchToRgb(oklch) {
  const { l: L, c: C, h: H } = oklch;
  const a = C * Math.cos(H * Math.PI / 180);
  const b = C * Math.sin(H * Math.PI / 180);
  const l = L + 0.3963377774 * a + 0.2158037573 * b;
  const m = L - 0.1055613458 * a - 0.0638541728 * b;
  const s = L - 0.0894841775 * a - 1.291485548 * b;
  const l3 = l * l * l;
  const m3 = m * m * m;
  const s3 = s * s * s;
  const lr = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const lg = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const lb = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;
  return {
    r: linearToSrgb(lr),
    g: linearToSrgb(lg),
    b: linearToSrgb(lb)
  };
}
function hexToOklch(hex) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToOklch(r, g, b);
}
function fitOklch(oklch) {
  const base = {
    l: clamp(oklch.l, 0, 1),
    c: Math.max(0, oklch.c),
    h: hue(oklch.h)
  };
  const rgb = oklchToRgb(base);
  if (rgb.r >= 0 && rgb.r <= 1 && rgb.g >= 0 && rgb.g <= 1 && rgb.b >= 0 && rgb.b <= 1) {
    return base;
  }
  let c = base.c;
  for (let i = 0; i < 24; i++) {
    c *= 0.9;
    const next = { ...base, c };
    const out = oklchToRgb(next);
    if (out.r >= 0 && out.r <= 1 && out.g >= 0 && out.g <= 1 && out.b >= 0 && out.b <= 1) {
      return next;
    }
  }
  return { ...base, c: 0 };
}
function oklchToHex(oklch) {
  const { r, g, b } = oklchToRgb(fitOklch(oklch));
  return rgbToHex(r, g, b);
}
function generateScale(seed, isDark) {
  const base = hexToOklch(seed);
  const scale = [];
  const lightSteps = isDark ? [
    0.118,
    0.138,
    0.167,
    0.202,
    0.246,
    0.304,
    0.378,
    0.468,
    clamp(base.l * 0.825, 0.53, 0.705),
    clamp(base.l * 0.89, 0.61, 0.79),
    clamp(base.l + 0.033, 0.868, 0.943),
    0.984
  ] : [0.993, 0.983, 0.962, 0.936, 0.906, 0.866, 0.811, 0.74, base.l, Math.max(0, base.l - 0.036), 0.49, 0.27];
  const chromaMultipliers = isDark ? [0.52, 0.68, 0.86, 1.02, 1.14, 1.24, 1.36, 1.48, 1.56, 1.64, 1.62, 1.15] : [0.12, 0.24, 0.46, 0.68, 0.84, 0.98, 1.08, 1.16, 1.22, 1.26, 1.18, 0.98];
  for (let i = 0; i < 12; i++) {
    scale.push(
      oklchToHex({
        l: lightSteps[i],
        c: base.c * chromaMultipliers[i],
        h: base.h
      })
    );
  }
  return scale;
}
function generateNeutralScale(seed, isDark, ink) {
  if (ink) {
    const base2 = hexToOklch(seed);
    const lift = (tone2) => oklchToHex({
      l: base2.l + (1 - base2.l) * tone2,
      c: base2.c * Math.max(0, 1 - tone2),
      h: base2.h
    });
    const sink = (tone2) => oklchToHex({
      l: base2.l * (1 - tone2),
      c: base2.c * Math.max(0, 1 - tone2 * (isDark ? 0.12 : 0.3)),
      h: base2.h
    });
    const bg = isDark ? sink(clamp(0.19 + Math.max(0, base2.l - 0.12) * 0.33 + base2.c * 1.95, 0.17, 0.27)) : base2.l < 0.82 ? lift(0.86) : lift(clamp(0.1 + base2.c * 3.2 + Math.max(0, 0.95 - base2.l) * 0.35, 0.1, 0.28));
    const steps = isDark ? [0, 0.018, 0.039, 0.064, 0.097, 0.143, 0.212, 0.31, 0.46, 0.649, 0.845, 0.984] : [0, 0.022, 0.042, 0.068, 0.102, 0.146, 0.208, 0.296, 0.432, 0.61, 0.81, 0.965];
    return steps.map((step) => mixColors(bg, ink, step));
  }
  const base = hexToOklch(seed);
  const scale = [];
  const neutralChroma = Math.min(base.c, isDark ? 0.068 : 0.04);
  const lightSteps = isDark ? [0.138, 0.156, 0.178, 0.202, 0.232, 0.272, 0.326, 0.404, clamp(base.l * 0.83, 0.43, 0.55), 0.596, 0.719, 0.956] : [0.991, 0.979, 0.964, 0.946, 0.931, 0.913, 0.891, 0.83, base.l, 0.617, 0.542, 0.205];
  for (let i = 0; i < 12; i++) {
    scale.push(
      oklchToHex({
        l: lightSteps[i],
        c: neutralChroma,
        h: base.h
      })
    );
  }
  return scale;
}
function mixColors(color1, color2, amount) {
  const c1 = hexToOklch(color1);
  const c2 = hexToOklch(color2);
  const delta = ((c2.h - c1.h) % 360 + 540) % 360 - 180;
  return oklchToHex({
    l: c1.l + (c2.l - c1.l) * amount,
    c: c1.c + (c2.c - c1.c) * amount,
    h: c1.h + delta * amount
  });
}
function shift(color, value) {
  const base = hexToOklch(color);
  return oklchToHex({
    l: base.l + (value.l ?? 0),
    c: base.c * (value.c ?? 1),
    h: base.h + (value.h ?? 0)
  });
}
function blend(color, background, alpha) {
  const fg = hexToRgb(color);
  const bg = hexToRgb(background);
  return rgbToHex(
    fg.r * alpha + bg.r * (1 - alpha),
    fg.g * alpha + bg.g * (1 - alpha),
    fg.b * alpha + bg.b * (1 - alpha)
  );
}
function withAlpha(color, alpha) {
  const { r, g, b } = hexToRgb(color);
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
}
function resolveThemeVariant(variant, isDark) {
  const colors = getColors(variant);
  const { overrides = {} } = variant;
  const neutral = generateNeutralScale(colors.neutral, isDark, colors.ink);
  const primary = generateScale(colors.primary, isDark);
  const accent = generateScale(colors.accent, isDark);
  const success = generateScale(colors.success, isDark);
  const warning = generateScale(colors.warning, isDark);
  const error = generateScale(colors.error, isDark);
  const info = generateScale(colors.info, isDark);
  const interactive = generateScale(colors.interactive, isDark);
  const amber = generateScale(
    shift(colors.warning, isDark ? { h: -16, l: -0.058, c: 1.14 } : { h: -22, l: -0.082, c: 0.94 }),
    isDark
  );
  const blue = generateScale(shift(colors.interactive, { h: -12, l: 0.128, c: 1.12 }), isDark);
  const diffAdd = generateScale(
    colors.diffAdd ?? shift(colors.success, { c: isDark ? 0.7 : 0.55, l: isDark ? -0.18 : 0.14 }),
    isDark
  );
  const diffDelete = generateScale(
    colors.diffDelete ?? shift(colors.error, { c: isDark ? 0.82 : 0.7, l: isDark ? -0.08 : 0.08 }),
    isDark
  );
  const ink = colors.ink ?? colors.neutral;
  const tint = colors.compact ? hexToOklch(ink) : void 0;
  const body = tint ? shift(ink, {
    l: isDark ? Math.max(0, 0.88 - tint.l) * 0.4 : -Math.max(0, tint.l - 0.18) * 0.24,
    c: isDark ? 1.04 : 1.02
  }) : void 0;
  const backgroundOverride = overrides["background-base"];
  const backgroundHex = getHex(backgroundOverride);
  const overlay2 = Boolean(backgroundOverride) && !backgroundHex;
  const content = (seed, scale) => {
    const base = hexToOklch(seed);
    const value = isDark ? base.l > 0.84 ? shift(seed, { c: 1.18 }) : scale[10] : scale[10];
    return shift(value, { l: isDark ? 0.034 : -0.024, c: isDark ? 1.3 : 1.18 });
  };
  const modified = () => {
    if (!colors.compact) return isDark ? "#ffba92" : "#FF8C00";
    const warningHue = hexToOklch(colors.warning).h;
    const deleteHue = hexToOklch(colors.diffDelete ?? colors.error).h;
    const delta = Math.abs(((deleteHue - warningHue) % 360 + 540) % 360 - 180);
    if (delta < 48) return isDark ? "#ffba92" : "#FF8C00";
    return content(colors.warning, warning);
  };
  const surface = (seed, alpha) => {
    const base = alphaTone(seed, alpha.base);
    return {
      base,
      weak: alphaTone(seed, alpha.weak),
      weaker: alphaTone(seed, alpha.weaker),
      strong: alphaTone(seed, alpha.strong),
      stronger: alphaTone(seed, alpha.stronger)
    };
  };
  const background = backgroundHex ?? neutral[0];
  const alphaTone = (color, alpha) => overlay2 ? withAlpha(color, alpha) : blend(color, background, alpha);
  const borderTone = (light2, dark2) => alphaTone(ink, isDark ? Math.min(1, dark2 + 0.024 + (colors.compact ? 0.08 : 0)) : Math.min(1, light2 + 0.024));
  const diffHiddenSurface = surface(
    isDark ? shift(colors.interactive, { c: 0.55, l: 0 }) : shift(colors.interactive, { c: 0.45, l: 0.08 }),
    isDark ? { base: 0.14, weak: 0.08, weaker: 0.18, strong: 0.26, stronger: 0.42 } : { base: 0.12, weak: 0.08, weaker: 0.16, strong: 0.24, stronger: 0.36 }
  );
  const neutralAlpha = generateNeutralAlphaScale(neutral, isDark);
  const brandb = primary[8];
  const brandh = primary[9];
  const interb = interactive[isDark ? 6 : 4];
  const interh = interactive[isDark ? 7 : 5];
  const interw = interactive[isDark ? 5 : 3];
  const succb = success[isDark ? 6 : 4];
  const succw = success[isDark ? 5 : 3];
  const succs = success[10];
  const warnb = warning[isDark ? 6 : 4];
  const warnw = warning[isDark ? 5 : 3];
  const warns = warning[10];
  const critb = error[isDark ? 6 : 4];
  const critw = error[isDark ? 5 : 3];
  const crits = error[10];
  const infob = info[isDark ? 6 : 4];
  const infow = info[isDark ? 5 : 3];
  const infos = info[10];
  const lum = (hex) => {
    const rgb = hexToRgb(hex);
    const lift = (v) => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    return 0.2126 * lift(rgb.r) + 0.7152 * lift(rgb.g) + 0.0722 * lift(rgb.b);
  };
  const hit = (a, b) => {
    const x = lum(a);
    const y = lum(b);
    const light2 = Math.max(x, y);
    const dark2 = Math.min(x, y);
    return (light2 + 0.05) / (dark2 + 0.05);
  };
  const on = (fill) => {
    const light2 = "#ffffff";
    const dark2 = "#000000";
    return hit(light2, fill) > hit(dark2, fill) ? light2 : dark2;
  };
  const tokens = {};
  tokens["background-base"] = neutral[0];
  tokens["background-weak"] = neutral[2];
  tokens["background-strong"] = neutral[0];
  tokens["background-stronger"] = isDark ? neutral[1] : "#fcfcfc";
  tokens["surface-base"] = neutralAlpha[1];
  tokens["base"] = neutralAlpha[1];
  tokens["surface-base-hover"] = neutralAlpha[2];
  tokens["surface-base-active"] = neutralAlpha[2];
  tokens["surface-base-interactive-active"] = withAlpha(interactive[2], 0.3);
  tokens["base2"] = neutralAlpha[1];
  tokens["base3"] = neutralAlpha[1];
  tokens["surface-inset-base"] = neutralAlpha[1];
  tokens["surface-inset-base-hover"] = neutralAlpha[2];
  tokens["surface-inset-strong"] = isDark ? withAlpha(neutral[0], 0.5) : withAlpha(neutral[3], 0.09);
  tokens["surface-inset-strong-hover"] = tokens["surface-inset-strong"];
  tokens["surface-raised-base"] = neutralAlpha[0];
  tokens["surface-float-base"] = isDark ? neutral[1] : neutral[11];
  tokens["surface-float-base-hover"] = isDark ? neutral[2] : neutral[10];
  tokens["surface-raised-base-hover"] = neutralAlpha[1];
  tokens["surface-raised-base-active"] = neutralAlpha[2];
  tokens["surface-raised-strong"] = isDark ? neutralAlpha[3] : neutral[0];
  tokens["surface-raised-strong-hover"] = isDark ? neutralAlpha[5] : "#ffffff";
  tokens["surface-raised-stronger"] = isDark ? neutralAlpha[5] : "#ffffff";
  tokens["surface-raised-stronger-hover"] = isDark ? neutralAlpha[6] : "#ffffff";
  tokens["surface-weak"] = neutralAlpha[2];
  tokens["surface-weaker"] = neutralAlpha[3];
  tokens["surface-strong"] = isDark ? neutralAlpha[6] : "#ffffff";
  tokens["surface-raised-stronger-non-alpha"] = isDark ? neutral[2] : "#ffffff";
  tokens["surface-brand-base"] = brandb;
  tokens["surface-brand-hover"] = brandh;
  tokens["surface-interactive-base"] = interb;
  tokens["surface-interactive-hover"] = interh;
  tokens["surface-interactive-weak"] = interw;
  tokens["surface-interactive-weak-hover"] = interb;
  tokens["surface-success-base"] = succb;
  tokens["surface-success-weak"] = succw;
  tokens["surface-success-strong"] = succs;
  tokens["surface-warning-base"] = warnb;
  tokens["surface-warning-weak"] = warnw;
  tokens["surface-warning-strong"] = warns;
  tokens["surface-critical-base"] = critb;
  tokens["surface-critical-weak"] = critw;
  tokens["surface-critical-strong"] = crits;
  tokens["surface-info-base"] = infob;
  tokens["surface-info-weak"] = infow;
  tokens["surface-info-strong"] = infos;
  tokens["surface-diff-unchanged-base"] = isDark ? neutral[0] : "#ffffff00";
  tokens["surface-diff-skip-base"] = isDark ? neutralAlpha[0] : neutral[1];
  tokens["surface-diff-hidden-base"] = diffHiddenSurface.base;
  tokens["surface-diff-hidden-weak"] = diffHiddenSurface.weak;
  tokens["surface-diff-hidden-weaker"] = diffHiddenSurface.weaker;
  tokens["surface-diff-hidden-strong"] = diffHiddenSurface.strong;
  tokens["surface-diff-hidden-stronger"] = diffHiddenSurface.stronger;
  tokens["surface-diff-add-base"] = diffAdd[2];
  tokens["surface-diff-add-weak"] = diffAdd[isDark ? 3 : 1];
  tokens["surface-diff-add-weaker"] = diffAdd[isDark ? 2 : 0];
  tokens["surface-diff-add-strong"] = diffAdd[4];
  tokens["surface-diff-add-stronger"] = diffAdd[isDark ? 10 : 8];
  tokens["surface-diff-delete-base"] = diffDelete[2];
  tokens["surface-diff-delete-weak"] = diffDelete[isDark ? 3 : 1];
  tokens["surface-diff-delete-weaker"] = diffDelete[isDark ? 2 : 0];
  tokens["surface-diff-delete-strong"] = diffDelete[isDark ? 4 : 5];
  tokens["surface-diff-delete-stronger"] = diffDelete[isDark ? 10 : 8];
  tokens["input-base"] = isDark ? neutral[1] : neutral[0];
  tokens["input-hover"] = isDark ? neutral[2] : neutral[1];
  tokens["input-active"] = isDark ? interactive[6] : interactive[0];
  tokens["input-selected"] = isDark ? interactive[7] : interactive[3];
  tokens["input-focus"] = isDark ? interactive[6] : interactive[0];
  tokens["input-disabled"] = neutral[3];
  tokens["text-base"] = colors.compact ? body : neutral[10];
  tokens["text-weak"] = colors.compact ? shift(body, { l: isDark ? -0.11 : 0.11, c: 0.9 }) : neutral[8];
  tokens["text-weaker"] = colors.compact ? shift(body, { l: isDark ? -0.2 : 0.21, c: isDark ? 0.78 : 0.72 }) : neutral[7];
  tokens["text-strong"] = colors.compact ? isDark ? blend("#ffffff", body, 0.9) : shift(body, { l: -0.07, c: 1.04 }) : neutral[11];
  tokens["text-invert-base"] = isDark ? neutral[10] : neutral[1];
  tokens["text-invert-weak"] = isDark ? neutral[8] : neutral[2];
  tokens["text-invert-weaker"] = isDark ? neutral[7] : neutral[3];
  tokens["text-invert-strong"] = isDark ? neutral[11] : neutral[0];
  tokens["text-interactive-base"] = interactive[isDark ? 10 : 9];
  tokens["text-on-brand-base"] = on(brandb);
  tokens["text-on-interactive-base"] = on(interb);
  tokens["text-on-interactive-weak"] = on(interb);
  tokens["text-on-success-base"] = on(succb);
  tokens["text-on-critical-base"] = on(critb);
  tokens["text-on-critical-weak"] = on(critb);
  tokens["text-on-critical-strong"] = on(crits);
  tokens["text-on-warning-base"] = on(warnb);
  tokens["text-on-info-base"] = on(infob);
  tokens["text-diff-add-base"] = diffAdd[10];
  tokens["text-diff-delete-base"] = diffDelete[9];
  tokens["text-diff-delete-strong"] = diffDelete[11];
  tokens["text-diff-add-strong"] = diffAdd[isDark ? 7 : 11];
  tokens["text-on-info-weak"] = on(infob);
  tokens["text-on-info-strong"] = on(infos);
  tokens["text-on-warning-weak"] = on(warnb);
  tokens["text-on-warning-strong"] = on(warns);
  tokens["text-on-success-weak"] = on(succb);
  tokens["text-on-success-strong"] = on(succs);
  tokens["text-on-brand-weak"] = on(brandb);
  tokens["text-on-brand-weaker"] = on(brandb);
  tokens["text-on-brand-strong"] = on(brandh);
  tokens["button-primary-base"] = neutral[11];
  tokens["button-secondary-base"] = isDark ? neutral[2] : neutral[0];
  tokens["button-secondary-hover"] = isDark ? neutral[3] : neutral[1];
  tokens["button-ghost-hover"] = neutralAlpha[1];
  tokens["button-ghost-hover2"] = neutralAlpha[2];
  tokens["border-base"] = colors.compact ? borderTone(0.22, 0.16) : neutralAlpha[6];
  tokens["border-hover"] = colors.compact ? borderTone(0.28, 0.2) : neutralAlpha[7];
  tokens["border-active"] = colors.compact ? borderTone(0.34, 0.24) : neutralAlpha[8];
  tokens["border-selected"] = withAlpha(interactive[8], isDark ? 0.9 : 0.99);
  tokens["border-disabled"] = colors.compact ? borderTone(0.18, 0.12) : neutralAlpha[7];
  tokens["border-focus"] = colors.compact ? borderTone(0.34, 0.24) : neutralAlpha[8];
  tokens["border-weak-base"] = colors.compact ? borderTone(0.1, 0.08) : neutralAlpha[isDark ? 5 : 4];
  tokens["border-strong-base"] = colors.compact ? borderTone(0.34, 0.24) : neutralAlpha[isDark ? 7 : 6];
  tokens["border-strong-hover"] = colors.compact ? borderTone(0.4, 0.28) : neutralAlpha[7];
  tokens["border-strong-active"] = colors.compact ? borderTone(0.46, 0.32) : neutralAlpha[isDark ? 7 : 6];
  tokens["border-strong-selected"] = withAlpha(interactive[5], 0.6);
  tokens["border-strong-disabled"] = colors.compact ? borderTone(0.14, 0.1) : neutralAlpha[5];
  tokens["border-strong-focus"] = colors.compact ? borderTone(0.46, 0.32) : neutralAlpha[isDark ? 7 : 6];
  tokens["border-weak-hover"] = colors.compact ? borderTone(0.16, 0.12) : neutralAlpha[isDark ? 6 : 5];
  tokens["border-weak-active"] = colors.compact ? borderTone(0.22, 0.16) : neutralAlpha[isDark ? 7 : 6];
  tokens["border-weak-selected"] = withAlpha(interactive[4], isDark ? 0.6 : 0.5);
  tokens["border-weak-disabled"] = colors.compact ? borderTone(0.08, 0.06) : neutralAlpha[5];
  tokens["border-weak-focus"] = colors.compact ? borderTone(0.22, 0.16) : neutralAlpha[isDark ? 7 : 6];
  tokens["border-weaker-base"] = colors.compact ? borderTone(0.06, 0.04) : neutralAlpha[2];
  tokens["border-interactive-base"] = interactive[6];
  tokens["border-interactive-hover"] = interactive[7];
  tokens["border-interactive-active"] = interactive[8];
  tokens["border-interactive-selected"] = interactive[8];
  tokens["border-interactive-disabled"] = neutral[7];
  tokens["border-interactive-focus"] = interactive[8];
  tokens["border-success-base"] = success[isDark ? 6 : 6];
  tokens["border-success-hover"] = success[isDark ? 7 : 7];
  tokens["border-success-selected"] = success[8];
  tokens["border-warning-base"] = warning[isDark ? 6 : 6];
  tokens["border-warning-hover"] = warning[isDark ? 7 : 7];
  tokens["border-warning-selected"] = warning[8];
  tokens["border-critical-base"] = error[isDark ? 6 : 6];
  tokens["border-critical-hover"] = error[isDark ? 7 : 7];
  tokens["border-critical-selected"] = error[8];
  tokens["border-info-base"] = info[isDark ? 6 : 6];
  tokens["border-info-hover"] = info[isDark ? 7 : 7];
  tokens["border-info-selected"] = info[8];
  tokens["border-color"] = "#ffffff";
  tokens["icon-base"] = colors.compact && !isDark ? tokens["text-weak"] : neutral[isDark ? 9 : 8];
  tokens["icon-hover"] = colors.compact && !isDark ? tokens["text-base"] : neutral[10];
  tokens["icon-active"] = colors.compact && !isDark ? tokens["text-strong"] : neutral[11];
  tokens["icon-selected"] = colors.compact && !isDark ? tokens["text-strong"] : neutral[11];
  tokens["icon-disabled"] = neutral[isDark ? 6 : 7];
  tokens["icon-focus"] = colors.compact && !isDark ? tokens["text-strong"] : neutral[11];
  tokens["icon-invert-base"] = isDark ? neutral[0] : "#ffffff";
  tokens["icon-weak-base"] = neutral[isDark ? 5 : 6];
  tokens["icon-weak-hover"] = neutral[isDark ? 11 : 7];
  tokens["icon-weak-active"] = neutral[8];
  tokens["icon-weak-selected"] = neutral[isDark ? 8 : 9];
  tokens["icon-weak-disabled"] = neutral[isDark ? 3 : 5];
  tokens["icon-weak-focus"] = neutral[8];
  tokens["icon-strong-base"] = neutral[11];
  tokens["icon-strong-hover"] = isDark ? "#f6f3f3" : "#151313";
  tokens["icon-strong-active"] = isDark ? "#fcfcfc" : "#020202";
  tokens["icon-strong-selected"] = isDark ? "#fdfcfc" : "#020202";
  tokens["icon-strong-disabled"] = neutral[7];
  tokens["icon-strong-focus"] = isDark ? "#fdfcfc" : "#020202";
  tokens["icon-brand-base"] = isDark ? "#ffffff" : neutral[11];
  tokens["icon-interactive-base"] = interactive[8];
  tokens["icon-success-base"] = success[isDark ? 8 : 6];
  tokens["icon-success-hover"] = success[9];
  tokens["icon-success-active"] = success[10];
  tokens["icon-warning-base"] = amber[isDark ? 8 : 6];
  tokens["icon-warning-hover"] = amber[9];
  tokens["icon-warning-active"] = amber[10];
  tokens["icon-critical-base"] = error[isDark ? 8 : 9];
  tokens["icon-critical-hover"] = error[9];
  tokens["icon-critical-active"] = error[10];
  tokens["icon-info-base"] = info[isDark ? 8 : 6];
  tokens["icon-info-hover"] = info[isDark ? 9 : 7];
  tokens["icon-info-active"] = info[10];
  tokens["icon-on-brand-base"] = on(brandb);
  tokens["icon-on-brand-hover"] = on(brandh);
  tokens["icon-on-brand-selected"] = on(brandh);
  tokens["icon-on-interactive-base"] = on(interb);
  tokens["icon-agent-plan-base"] = info[8];
  tokens["icon-agent-docs-base"] = amber[8];
  tokens["icon-agent-ask-base"] = blue[8];
  tokens["icon-agent-build-base"] = interactive[isDark ? 10 : 8];
  tokens["icon-on-success-base"] = on(succb);
  tokens["icon-on-success-hover"] = on(succs);
  tokens["icon-on-success-selected"] = on(succs);
  tokens["icon-on-warning-base"] = on(warnb);
  tokens["icon-on-warning-hover"] = on(warns);
  tokens["icon-on-warning-selected"] = on(warns);
  tokens["icon-on-critical-base"] = on(critb);
  tokens["icon-on-critical-hover"] = on(crits);
  tokens["icon-on-critical-selected"] = on(crits);
  tokens["icon-on-info-base"] = on(infob);
  tokens["icon-on-info-hover"] = on(infos);
  tokens["icon-on-info-selected"] = on(infos);
  tokens["icon-diff-add-base"] = diffAdd[10];
  tokens["icon-diff-add-hover"] = diffAdd[isDark ? 9 : 11];
  tokens["icon-diff-add-active"] = diffAdd[isDark ? 10 : 11];
  tokens["icon-diff-delete-base"] = diffDelete[9];
  tokens["icon-diff-delete-hover"] = diffDelete[isDark ? 10 : 10];
  tokens["icon-diff-modified-base"] = modified();
  if (colors.compact) {
    tokens["syntax-comment"] = "var(--text-weak)";
    tokens["syntax-regexp"] = "var(--text-base)";
    tokens["syntax-string"] = content(colors.success, success);
    tokens["syntax-keyword"] = content(colors.accent, accent);
    tokens["syntax-primitive"] = content(colors.primary, primary);
    tokens["syntax-operator"] = isDark ? "var(--text-weak)" : "var(--text-base)";
    tokens["syntax-variable"] = "var(--text-strong)";
    tokens["syntax-property"] = content(colors.info, info);
    tokens["syntax-type"] = content(colors.warning, warning);
    tokens["syntax-constant"] = content(colors.accent, accent);
    tokens["syntax-punctuation"] = isDark ? "var(--text-weak)" : "var(--text-base)";
    tokens["syntax-object"] = "var(--text-strong)";
    tokens["syntax-success"] = success[10];
    tokens["syntax-warning"] = amber[10];
    tokens["syntax-critical"] = error[10];
    tokens["syntax-info"] = content(colors.info, info);
    tokens["syntax-diff-add"] = diffAdd[10];
    tokens["syntax-diff-delete"] = diffDelete[10];
    tokens["syntax-diff-unknown"] = "#ff0000";
    tokens["markdown-heading"] = content(colors.primary, primary);
    tokens["markdown-text"] = tokens["text-base"];
    tokens["markdown-link"] = content(colors.interactive, interactive);
    tokens["markdown-link-text"] = content(colors.info, info);
    tokens["markdown-code"] = content(colors.success, success);
    tokens["markdown-block-quote"] = content(colors.warning, warning);
    tokens["markdown-emph"] = content(colors.warning, warning);
    tokens["markdown-strong"] = content(colors.accent, accent);
    tokens["markdown-horizontal-rule"] = tokens["border-base"];
    tokens["markdown-list-item"] = content(colors.interactive, interactive);
    tokens["markdown-list-enumeration"] = content(colors.info, info);
    tokens["markdown-image"] = content(colors.interactive, interactive);
    tokens["markdown-image-text"] = content(colors.info, info);
    tokens["markdown-code-block"] = tokens["text-base"];
  }
  if (!colors.compact) {
    tokens["syntax-comment"] = "var(--text-weak)";
    tokens["syntax-regexp"] = "var(--text-base)";
    tokens["syntax-string"] = isDark ? "#00ceb9" : "#006656";
    tokens["syntax-keyword"] = "var(--text-weak)";
    tokens["syntax-primitive"] = isDark ? "#ffba92" : "#fb4804";
    tokens["syntax-operator"] = isDark ? "var(--text-weak)" : "var(--text-base)";
    tokens["syntax-variable"] = "var(--text-strong)";
    tokens["syntax-property"] = isDark ? "#ff9ae2" : "#ed6dc8";
    tokens["syntax-type"] = isDark ? "#ecf58c" : "#596600";
    tokens["syntax-constant"] = isDark ? "#93e9f6" : "#007b80";
    tokens["syntax-punctuation"] = isDark ? "var(--text-weak)" : "var(--text-base)";
    tokens["syntax-object"] = "var(--text-strong)";
    tokens["syntax-success"] = success[10];
    tokens["syntax-warning"] = amber[10];
    tokens["syntax-critical"] = error[10];
    tokens["syntax-info"] = isDark ? "#93e9f6" : "#0092a8";
    tokens["syntax-diff-add"] = diffAdd[10];
    tokens["syntax-diff-delete"] = diffDelete[10];
    tokens["syntax-diff-unknown"] = "#ff0000";
    tokens["markdown-heading"] = isDark ? "#9d7cd8" : "#d68c27";
    tokens["markdown-text"] = isDark ? "#eeeeee" : "#1a1a1a";
    tokens["markdown-link"] = isDark ? "#fab283" : "#3b7dd8";
    tokens["markdown-link-text"] = isDark ? "#56b6c2" : "#318795";
    tokens["markdown-code"] = isDark ? "#7fd88f" : "#3d9a57";
    tokens["markdown-block-quote"] = isDark ? "#e5c07b" : "#b0851f";
    tokens["markdown-emph"] = isDark ? "#e5c07b" : "#b0851f";
    tokens["markdown-strong"] = isDark ? "#f5a742" : "#d68c27";
    tokens["markdown-horizontal-rule"] = isDark ? "#808080" : "#8a8a8a";
    tokens["markdown-list-item"] = isDark ? "#fab283" : "#3b7dd8";
    tokens["markdown-list-enumeration"] = isDark ? "#56b6c2" : "#318795";
    tokens["markdown-image"] = isDark ? "#fab283" : "#3b7dd8";
    tokens["markdown-image-text"] = isDark ? "#56b6c2" : "#318795";
    tokens["markdown-code-block"] = isDark ? "#eeeeee" : "#1a1a1a";
  }
  tokens["avatar-background-pink"] = isDark ? "#501b3f" : "#feeef8";
  tokens["avatar-background-mint"] = isDark ? "#033a34" : "#e1fbf4";
  tokens["avatar-background-orange"] = isDark ? "#5f2a06" : "#fff1e7";
  tokens["avatar-background-purple"] = isDark ? "#432155" : "#f9f1fe";
  tokens["avatar-background-cyan"] = isDark ? "#0f3058" : "#e7f9fb";
  tokens["avatar-background-lime"] = isDark ? "#2b3711" : "#eefadc";
  tokens["avatar-text-pink"] = isDark ? "#e34ba9" : "#cd1d8d";
  tokens["avatar-text-mint"] = isDark ? "#95f3d9" : "#147d6f";
  tokens["avatar-text-orange"] = isDark ? "#ff802b" : "#ed5f00";
  tokens["avatar-text-purple"] = isDark ? "#9d5bd2" : "#8445bc";
  tokens["avatar-text-cyan"] = isDark ? "#369eff" : "#0894b3";
  tokens["avatar-text-lime"] = isDark ? "#c4f042" : "#5d770d";
  for (const [key2, value] of Object.entries(overrides)) {
    tokens[key2] = value;
  }
  if (colors.compact && "text-weak" in overrides && !("text-weaker" in overrides)) {
    const weak = tokens["text-weak"];
    if (weak.startsWith("#")) {
      tokens["text-weaker"] = shift(weak, { l: isDark ? -0.12 : 0.12, c: 0.75 });
    } else {
      tokens["text-weaker"] = weak;
    }
  }
  if (colors.compact) {
    if (!("markdown-text" in overrides)) {
      tokens["markdown-text"] = tokens["text-base"];
    }
    if (!("markdown-code-block" in overrides)) {
      tokens["markdown-code-block"] = tokens["text-base"];
    }
  }
  if (!("text-stronger" in overrides)) {
    tokens["text-stronger"] = tokens["text-strong"];
  }
  return tokens;
}
function getColors(variant) {
  const input = variant;
  if (input.palette && input.seeds) {
    throw new Error("Theme variant cannot define both `palette` and `seeds`");
  }
  if (variant.palette) {
    return {
      compact: true,
      neutral: variant.palette.neutral,
      ink: variant.palette.ink,
      primary: variant.palette.primary,
      accent: variant.palette.accent ?? variant.palette.info,
      success: variant.palette.success,
      warning: variant.palette.warning,
      error: variant.palette.error,
      info: variant.palette.info,
      interactive: variant.palette.interactive ?? variant.palette.primary,
      diffAdd: variant.palette.diffAdd,
      diffDelete: variant.palette.diffDelete
    };
  }
  if (variant.seeds) {
    return {
      compact: false,
      neutral: variant.seeds.neutral,
      ink: void 0,
      primary: variant.seeds.primary,
      accent: variant.seeds.info,
      success: variant.seeds.success,
      warning: variant.seeds.warning,
      error: variant.seeds.error,
      info: variant.seeds.info,
      interactive: variant.seeds.interactive,
      diffAdd: variant.seeds.diffAdd,
      diffDelete: variant.seeds.diffDelete
    };
  }
  throw new Error("Theme variant requires `palette` or `seeds`");
}
function generateNeutralAlphaScale(neutralScale, isDark) {
  const alphas = isDark ? [0.038, 0.066, 0.1, 0.142, 0.19, 0.252, 0.334, 0.446, 0.58, 0.718, 0.854, 0.985] : [0.03, 0.06, 0.1, 0.145, 0.2, 0.265, 0.35, 0.47, 0.61, 0.74, 0.86, 0.97];
  return alphas.map((alpha) => blend(neutralScale[11], neutralScale[0], alpha));
}
function getHex(value) {
  if (!value?.startsWith("#")) return;
  return value;
}
const light = { "palette": { "neutral": "#f7f7f7", "ink": "#171311", "primary": "#dcde8d", "success": "#12c905", "warning": "#ffdc17", "error": "#fc533a", "info": "#a753ae", "interactive": "#034cff", "diffAdd": "#9ff29a", "diffDelete": "#fc533a" }, "overrides": { "text-strong": "#171717", "text-base": "#6F6F6F", "text-weak": "#8F8F8F", "text-weaker": "#C7C7C7", "text-diff-add-base": "var(--v2-state-fg-success)", "text-diff-delete-base": "var(--v2-state-fg-danger)", "border-weak-base": "#DBDBDB", "border-weaker-base": "#E8E8E8", "icon-base": "#8F8F8F", "icon-weak-base": "C7C7C7", "surface-raised-base": "#F3F3F3", "surface-raised-base-hover": "#EDEDED", "surface-base": "#F8F8F8", "surface-base-hover": "#0000000A", "surface-interactive-weak": "#F5FAFF", "icon-success-base": "#0ABE00", "surface-success-base": "#E6FFE5", "syntax-comment": "var(--v2-text-text-muted)", "syntax-keyword": "var(--v2-pink-800)", "syntax-string": "var(--v2-green-800)", "syntax-primitive": "var(--v2-pink-800)", "syntax-property": "var(--v2-orange-800)", "syntax-type": "var(--v2-purple-800)", "syntax-constant": "#007b80", "syntax-critical": "var(--v2-red-800)", "syntax-diff-delete": "#ff8c00", "syntax-diff-unknown": "#a753ae", "surface-critical-base": "#FFF2F0" } };
const dark = { "palette": { "neutral": "#1f1f1f", "ink": "#f1ece8", "primary": "#fab283", "success": "#12c905", "warning": "#fcd53a", "error": "#fc533a", "info": "#edb2f1", "interactive": "#034cff", "diffAdd": "#c8ffc4", "diffDelete": "#fc533a" }, "overrides": { "text-strong": "#EDEDED", "text-base": "#A0A0A0", "text-weak": "#707070", "text-weaker": "#505050", "text-diff-add-base": "var(--v2-state-fg-success)", "text-diff-delete-base": "var(--v2-state-fg-danger)", "border-weak-base": "#282828", "border-weaker-base": "#232323", "icon-base": "#7E7E7E", "icon-weak-base": "#343434", "surface-raised-base": "#232323", "surface-raised-base-hover": "#282828", "surface-base": "#1C1C1C", "surface-base-hover": "#FFFFFF0D", "surface-interactive-weak": "#0D172B", "surface-success-base": "#022B00", "syntax-comment": "var(--v2-text-text-muted)", "syntax-keyword": "var(--v2-pink-400)", "syntax-string": "var(--v2-green-400)", "syntax-primitive": "var(--v2-pink-400)", "syntax-property": "var(--v2-orange-400)", "syntax-type": "var(--v2-purple-400)", "syntax-constant": "#93e9f6", "syntax-critical": "var(--v2-red-400)", "syntax-diff-delete": "#fab283", "syntax-diff-unknown": "#edb2f1", "surface-critical-base": "#1F0603" } };
const oc2ThemeJson = {
  light,
  dark
};
const MAX_LOG_AGE_DAYS = 7;
const EXPORT_WINDOW = 24 * 60 * 60 * 1e3;
const MAX_EXPORT_FILE_SIZE = 50 * 1024 * 1024;
const NET_LOG_SIZE = 20 * 1024 * 1024;
let root$1 = "";
let run = "";
let netLogPath;
let logger$1;
const getLogger = () => logger$1;
function initLogging() {
  initRunDirectory();
  log.transports.file.maxSize = 5 * 1024 * 1024;
  log.transports.file.resolvePathFn = (_vars, message) => join(
    run,
    `${safeLogName(message?.scope ?? (message?.variables?.processType === "renderer" ? "renderer" : "main"))}.log`
  );
  log.initialize({ preload: false, spyRendererConsole: true });
  initConsoleTransport();
  cleanup();
  return logger$1 = log;
}
function initCrashReporter() {
  const dir = join(app.getPath("userData"), "Crashpad");
  mkdirSync(dir, { recursive: true });
  app.setPath("crashDumps", dir);
  crashReporter.start({ uploadToServer: false, compress: true });
  write("crash", "crash reporter started", { path: dir });
}
async function startNetLog() {
  if (netLog.currentlyLogging) return;
  netLogPath = join(run, "network.netlog");
  await netLog.startLogging(netLogPath, { captureMode: "default", maxFileSize: NET_LOG_SIZE });
  write("network", "net log started", { path: netLogPath });
}
async function exportDebugLogs() {
  const restartNetLog = netLog.currentlyLogging;
  if (restartNetLog) {
    await netLog.stopLogging().catch((error) => write("network", "failed to stop net log", { error }));
  }
  const output = join(app.getPath("downloads"), `opencode-debug-${stamp()}.zip`);
  try {
    write("main", "exporting debug logs", { output });
    await writeZip(output, [
      { name: "manifest.json", data: Buffer.from(JSON.stringify(manifest(), null, 2)) },
      ...collect(root$1, "desktop"),
      ...serverLogRoots().flatMap((dir, i) => collect(dir, `server-${i + 1}`)),
      ...collect(app.getPath("crashDumps"), "crashpad")
    ]);
    shell.showItemInFolder(output);
    return output;
  } finally {
    if (restartNetLog) {
      await startNetLog().catch((error) => write("network", "failed to restart net log", { error }));
    }
  }
}
function write(name, message, extra, level = "info") {
  if (!run) return;
  const scoped = log.scope(safeLogName(name));
  if (extra !== void 0) {
    scoped[level](message, extra);
    return;
  }
  scoped[level](message);
}
function initRunDirectory() {
  root$1 = join(app.getPath("userData"), "logs");
  run = join(root$1, stamp());
  mkdirSync(run, { recursive: true });
}
function stamp() {
  return (/* @__PURE__ */ new Date()).toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "");
}
function safeLogName(name) {
  return name.replace(/[^a-z0-9_.-]/gi, "_") || "main";
}
function cleanup() {
  const dir = root$1 || dirname(log.transports.file.getFile().path);
  const cutoff = Date.now() - MAX_LOG_AGE_DAYS * 24 * 60 * 60 * 1e3;
  for (const entry of readdirSync(dir)) {
    const file = join(dir, entry);
    try {
      const info = statSync(file);
      if (info.mtimeMs < cutoff) rmSync(file, { recursive: true, force: true });
    } catch {
      continue;
    }
  }
}
function manifest() {
  return {
    generated: (/* @__PURE__ */ new Date()).toISOString(),
    version: app.getVersion(),
    name: app.getName(),
    packaged: app.isPackaged,
    platform: process.platform,
    arch: process.arch,
    versions: process.versions,
    uptime: process.uptime(),
    userData: app.getPath("userData"),
    logs: root$1,
    currentRun: run,
    crashDumps: app.getPath("crashDumps"),
    serverLogs: serverLogRoots(),
    netLog: netLogPath
  };
}
function serverLogRoots() {
  const xdgData = process.env.XDG_DATA_HOME || join(homedir(), ".local", "share");
  return [.../* @__PURE__ */ new Set([join(xdgData, "opencode", "log"), join(app.getPath("userData"), "opencode", "log")])];
}
function collect(dir, prefix) {
  if (!existsSync(dir)) return [];
  const cutoff = Date.now() - EXPORT_WINDOW;
  const result = [];
  const walk = (current) => {
    for (const entry of readdirSync(current)) {
      const file = join(current, entry);
      const info = statSync(file);
      if (info.isDirectory()) {
        walk(file);
        continue;
      }
      if (info.mtimeMs < cutoff) continue;
      if (info.size > MAX_EXPORT_FILE_SIZE) continue;
      if (file.endsWith(".heapsnapshot")) continue;
      result.push({ name: join(prefix, file.slice(dir.length + 1)).replace(/\\/g, "/"), path: file });
    }
  };
  walk(dir);
  return result;
}
async function writeZip(output, entries) {
  const writer = new ZipWriter(new BlobWriter("application/zip"));
  for (const entry of entries) {
    const data = entry.data ?? readFileSync(entry.path);
    await writer.add(entry.name, new BlobReader(new Blob([new Uint8Array(data)])));
  }
  const zip = await writer.close();
  writeFileSync(output, Buffer.from(await zip.arrayBuffer()));
}
function initConsoleTransport() {
  const write2 = log.transports.console.writeFn.bind(log.transports.console);
  log.transports.console.writeFn = (options) => {
    try {
      write2(options);
    } catch (err) {
      if (!isBrokenPipe(err)) throw err;
      log.transports.console.level = false;
    }
  };
}
function isBrokenPipe(err) {
  return typeof err === "object" && err !== null && "code" in err && err.code === "EPIPE";
}
const SETTINGS_STORE = "opencode.settings";
const DEFAULT_SERVER_URL_KEY = "defaultServerUrl";
const WSL_SERVERS_KEY = "wslServers";
const PINCH_ZOOM_ENABLED_KEY = "pinchZoomEnabled";
const WINDOW_IDS_KEY = "windowIds";
const EMPTY_STORE_MAX_BYTES = 128;
const DRAFT_RETENTION_MS = 30 * 24 * 60 * 60 * 1e3;
const DRAFT_KEEP_RECENT = 100;
async function cleanupStoreFiles(userDataPath, now = Date.now()) {
  const entries = await readdir(userDataPath, { withFileTypes: true }).catch(() => []);
  const candidates = (await Promise.all(
    entries.filter((entry) => entry.isFile()).map(async (entry) => {
      const kind = storeKind(entry.name);
      if (!kind) return;
      const file = join(userDataPath, entry.name);
      const stats = await stat(file).catch(() => void 0);
      if (!stats?.isFile()) return;
      return {
        name: entry.name,
        path: file,
        kind,
        modified: stats.mtimeMs,
        empty: await isEmptyStore(file, stats.size)
      };
    })
  )).filter((candidate) => !!candidate);
  const stale = /* @__PURE__ */ new Set();
  for (const candidate of candidates) {
    if (candidate.empty) stale.add(candidate);
    if (candidate.kind === "draft" && now - candidate.modified > DRAFT_RETENTION_MS) stale.add(candidate);
  }
  candidates.filter((candidate) => candidate.kind === "draft" && !candidate.empty).sort((a, b) => b.modified - a.modified).slice(DRAFT_KEEP_RECENT).forEach((candidate) => stale.add(candidate));
  const deleted = await Promise.all(
    [...stale].map(async (candidate) => {
      await rm(candidate.path, { force: true });
      return candidate.name;
    })
  );
  return { scanned: candidates.length, deleted };
}
async function deleteStoreFileIfEmpty(userDataPath, name) {
  if (!storeKind(name)) return false;
  const file = join(userDataPath, name);
  const stats = await stat(file).catch(() => void 0);
  if (!stats?.isFile()) return false;
  if (!await isEmptyStore(file, stats.size)) return false;
  await rm(file, { force: true });
  return true;
}
function storeKind(name) {
  if (/^opencode\.draft\..+\.dat$/.test(name)) return "draft";
  if (/^opencode\.workspace\..+\.dat$/.test(name)) return "workspace";
}
async function isEmptyStore(file, size) {
  if (size > EMPTY_STORE_MAX_BYTES) return false;
  const raw2 = await readFile(file, "utf8").catch(() => void 0);
  if (raw2 === void 0) return false;
  if (raw2.trim() === "") return true;
  try {
    const parsed = JSON.parse(raw2);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) && Object.keys(parsed).length === 0;
  } catch {
    return false;
  }
}
const cache = /* @__PURE__ */ new Map();
function getStore(name = SETTINGS_STORE) {
  const cached = cache.get(name);
  if (cached) return cached;
  const next = new Store({
    name,
    cwd: electron.app.getPath("userData"),
    fileExtension: "",
    accessPropertiesByDotNotation: false
  });
  cache.set(name, next);
  return next;
}
async function removeStoreFileIfEmpty(name) {
  if (await deleteStoreFileIfEmpty(electron.app.getPath("userData"), name)) cache.delete(name);
}
const sampleInterval = 1e3;
const samplePeriod = 15e3;
function createUnresponsiveSampler(win, name) {
  let sampleTimer;
  let stopTimer;
  let sampling = false;
  const samples = /* @__PURE__ */ new Map();
  const active = () => sampling && !win.isDestroyed() && !win.webContents.isDestroyed();
  const clearTimers = () => {
    if (sampleTimer) clearTimeout(sampleTimer);
    if (stopTimer) clearTimeout(stopTimer);
    sampleTimer = void 0;
    stopTimer = void 0;
  };
  const schedule = () => {
    sampleTimer = setTimeout(() => {
      void collect2();
    }, sampleInterval);
  };
  const collect2 = async () => {
    if (!active()) return;
    const stack = await win.webContents.mainFrame.collectJavaScriptCallStack().catch((error) => {
      write("window", "failed to collect unresponsive sample", { window: name, error }, "error");
      return void 0;
    });
    if (!active()) return;
    if (stack) samples.set(stack, (samples.get(stack) ?? 0) + 1);
    schedule();
  };
  const stopAndFlush = () => {
    const wasSampling = sampling;
    sampling = false;
    clearTimers();
    if (samples.size === 0) return wasSampling;
    const entries = [...samples.entries()].sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((sum, entry) => sum + entry[1], 0);
    const message = [
      "renderer unresponsive samples",
      `Window: ${name}`,
      `URL: ${win.isDestroyed() ? "<destroyed>" : win.webContents.getURL()}`,
      ...entries.map((entry) => `<${entry[1]}> ${entry[0]}`),
      `Total Samples: ${total}`
    ].join("\n");
    write("window", message, void 0, "error");
    samples.clear();
    return wasSampling;
  };
  const start = () => {
    if (sampling || win.isDestroyed() || win.webContents.isDestroyed() || win.webContents.isDevToolsOpened()) return;
    sampling = true;
    samples.clear();
    schedule();
    stopTimer = setTimeout(stopAndFlush, samplePeriod);
  };
  win.on("closed", stopAndFlush);
  return { start, stopAndFlush };
}
const root = dirname(fileURLToPath(import.meta.url));
const rendererRoot = join(root, "../renderer");
const rendererProtocol = "oc";
const rendererHost = "renderer";
const clipboardWritePermission = "clipboard-sanitized-write";
const notificationPermission = "notifications";
const rendererPermissions = /* @__PURE__ */ new Set([clipboardWritePermission, notificationPermission]);
const oc2Theme = oc2ThemeJson;
const oc2Background = {
  light: resolveThemeVariant(oc2Theme.light, false)["background-base"],
  dark: resolveThemeVariant(oc2Theme.dark, true)["background-base"]
};
const documentPolicyHeader = "Document-Policy";
const jsCallStacksDocumentPolicy = "include-js-call-stacks-in-crash-reports";
protocol.registerSchemesAsPrivileged([
  {
    scheme: rendererProtocol,
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true
    }
  }
]);
let backgroundColor;
let relaunchHandler = () => {
  app.relaunch();
  app.exit(0);
};
let appQuitting = false;
let lastFocusedWindowID;
const titlebarThemes = /* @__PURE__ */ new WeakMap();
const pinchZoomEnabled = /* @__PURE__ */ new WeakMap();
const windowIDs = /* @__PURE__ */ new WeakMap();
const windowsByID = /* @__PURE__ */ new Map();
const titlebarHeight = 40;
const maxZoomLevel = 10;
const minZoomLevel = 0.2;
function setRelaunchHandler(handler) {
  relaunchHandler = handler;
}
function setAppQuitting() {
  appQuitting = true;
}
function setBackgroundColor(color) {
  backgroundColor = color;
  BrowserWindow.getAllWindows().forEach((win) => win.setBackgroundColor(color));
}
function iconsDir() {
  return app.isPackaged ? join(process.resourcesPath, "icons") : join(root, "../../resources/icons");
}
function iconPath() {
  const ext = process.platform === "win32" ? "ico" : "png";
  return join(iconsDir(), `icon.${ext}`);
}
function tone() {
  return nativeTheme.shouldUseDarkColors ? "dark" : "light";
}
function defaultBackgroundColor() {
  return oc2Background[tone()];
}
function overlay(theme = {}, zoom = 1) {
  const mode = theme.mode ?? tone();
  return {
    color: "#00000000",
    symbolColor: mode === "dark" ? "white" : "black",
    height: Math.max(titlebarHeight, Math.round(titlebarHeight * zoom))
  };
}
function setTitlebar(win, theme = {}) {
  titlebarThemes.set(win, theme);
  updateTitlebar(win);
}
function updateTitlebar(win) {
  if (process.platform !== "win32") return;
  win.setTitleBarOverlay(overlay(titlebarThemes.get(win), win.webContents.getZoomFactor()));
}
function setPinchZoomEnabled(enabled) {
  getStore().set(PINCH_ZOOM_ENABLED_KEY, enabled);
  for (const win of BrowserWindow.getAllWindows()) {
    pinchZoomEnabled.set(win, enabled);
    win.webContents.send("pinch-zoom-enabled-changed", enabled);
    if (!enabled && win.webContents.getZoomFactor() !== 1) win.webContents.setZoomFactor(1);
    updateZoom(win);
  }
}
function getPinchZoomEnabled() {
  return getStore().get(PINCH_ZOOM_ENABLED_KEY) === true;
}
function getWindowID(win) {
  return windowIDs.get(win);
}
function getLastFocusedWindow() {
  const focused = BrowserWindow.getFocusedWindow();
  if (focused) return focused;
  if (!lastFocusedWindowID) return null;
  const win = windowsByID.get(lastFocusedWindowID);
  if (!win || win.isDestroyed()) return null;
  return win;
}
function restoreMainWindows() {
  const ids = readWindowIDs();
  return (ids.length ? ids : [randomUUID()]).map((id) => createMainWindow(id));
}
function setDockIcon() {
  if (process.platform !== "darwin") return;
  const icon = nativeImage.createFromPath(join(iconsDir(), "dock.png"));
  if (!icon.isEmpty()) app.dock?.setIcon(icon);
}
function createMainWindow(id = randomUUID()) {
  const state = windowState({
    file: windowStateFile(id),
    defaultWidth: 1280,
    defaultHeight: 800
  });
  const mode = tone();
  const win = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    show: false,
    autoHideMenuBar: true,
    title: "OpenCode",
    icon: iconPath(),
    backgroundColor: backgroundColor ?? defaultBackgroundColor(),
    ...process.platform === "darwin" ? {
      titleBarStyle: "hidden",
      trafficLightPosition: { x: 12, y: 14 }
    } : {},
    ...process.platform === "win32" ? {
      frame: false,
      titleBarStyle: "hidden",
      titleBarOverlay: overlay({ mode })
    } : {},
    webPreferences: {
      preload: join(root, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  allowRendererPermissions(win);
  wireWindowRecovery(win, id);
  win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    const { requestHeaders } = details;
    upsertKeyValue(requestHeaders, "Access-Control-Allow-Origin", ["*"]);
    callback({ requestHeaders });
  });
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const { responseHeaders = {} } = details;
    addRendererHeaders(details.url, responseHeaders);
    callback({ responseHeaders });
  });
  state.manage(win);
  registerWindow(win, id);
  loadWindow(win, "index.html");
  wireZoom(win);
  win.once("ready-to-show", () => {
    win.show();
  });
  return win;
}
function registerWindow(win, id) {
  windowIDs.set(win, id);
  windowsByID.set(id, win);
  persistWindowID(id);
  win.on("focus", () => {
    lastFocusedWindowID = id;
  });
  win.on("closed", () => {
    windowsByID.delete(id);
    if (lastFocusedWindowID === id) lastFocusedWindowID = windowsByID.keys().next().value;
    if (!appQuitting) removeWindowID(id);
  });
}
function readWindowIDs() {
  const value = getStore().get(WINDOW_IDS_KEY);
  if (!Array.isArray(value)) return [];
  return value.filter((id) => typeof id === "string" && id.length > 0);
}
function writeWindowIDs(ids) {
  getStore().set(WINDOW_IDS_KEY, [...new Set(ids)]);
}
function persistWindowID(id) {
  const ids = readWindowIDs();
  if (ids.includes(id)) return;
  writeWindowIDs([...ids, id]);
}
function removeWindowID(id) {
  writeWindowIDs(readWindowIDs().filter((item) => item !== id));
  rmSync(join(app.getPath("userData"), windowStateFile(id)), { force: true });
}
function windowStateFile(id) {
  return `window-state-${id.replace(/[^a-zA-Z0-9._-]/g, "-")}.json`;
}
function registerRendererProtocol() {
  if (protocol.isProtocolHandled(rendererProtocol)) return;
  protocol.handle(rendererProtocol, async (request) => {
    const url = new URL(request.url);
    if (url.host !== rendererHost) {
      write("protocol", "rejected host", { url: request.url }, "warn");
      return new Response("Not found", { status: 404 });
    }
    const file = resolve(rendererRoot, `.${decodeURIComponent(url.pathname)}`);
    const rel = relative(rendererRoot, file);
    if (rel.startsWith("..") || isAbsolute(rel)) {
      write("protocol", "rejected path", { url: request.url, file }, "warn");
      return new Response("Not found", { status: 404 });
    }
    try {
      const response = await net.fetch(pathToFileURL(file).toString());
      if (response.status >= 400) {
        write(
          "protocol",
          "fetch failed",
          {
            url: request.url,
            file,
            status: response.status,
            statusText: response.statusText
          },
          "error"
        );
      }
      return addDocumentPolicy(response, file);
    } catch (error) {
      write("protocol", "fetch error", { url: request.url, file, error }, "error");
      return new Response("Not found", { status: 404 });
    }
  });
}
function loadWindow(win, html) {
  const devUrl = process.env.ELECTRON_RENDERER_URL;
  if (devUrl) {
    const url = new URL(html, devUrl);
    void win.loadURL(url.toString());
    return;
  }
  void win.loadURL(`${rendererProtocol}://${rendererHost}/${html}`);
}
function wireWindowRecovery(win, name) {
  let showing = false;
  const sampler = createUnresponsiveSampler(win, name);
  const handle = async (button, wait) => {
    if (button === "Export Logs") {
      const sampling = sampler.stopAndFlush();
      await exportDebugLogs().catch((error) => write("main", "failed to export debug logs", { error }, "error"));
      if (wait && sampling) sampler.start();
      return true;
    }
    if (button === "Relaunch") {
      sampler.stopAndFlush();
      relaunchHandler();
      return false;
    }
    if (button === "Quit") {
      sampler.stopAndFlush();
      app.quit();
    }
    return false;
  };
  const show = async (message, detail, wait) => {
    if (showing || win.isDestroyed()) return;
    showing = true;
    try {
      while (!win.isDestroyed()) {
        const buttons = wait ? ["Relaunch", "Export Logs", "Keep Waiting"] : ["Relaunch", "Export Logs", "Quit"];
        const result = await dialog.showMessageBox(win, {
          type: "warning",
          buttons,
          defaultId: 0,
          cancelId: 2,
          message,
          detail
        });
        if (await handle(buttons[result.response], wait)) continue;
        return;
      }
    } finally {
      showing = false;
    }
  };
  const failed = (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    write(
      "window",
      "renderer load failed",
      {
        window: name,
        event,
        errorCode,
        errorDescription,
        validatedURL,
        currentURL: win.webContents.getURL(),
        isMainFrame
      },
      "error"
    );
    if (!isMainFrame || errorCode === -3) return;
    void show(
      "OpenCode failed to load",
      [`Window: ${name}`, `URL: ${validatedURL}`, `Error: ${errorCode} ${errorDescription}`].join("\n"),
      false
    );
  };
  win.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    failed("did-fail-load", errorCode, errorDescription, validatedURL, isMainFrame);
  });
  win.webContents.on("did-fail-provisional-load", (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    failed("did-fail-provisional-load", errorCode, errorDescription, validatedURL, isMainFrame);
  });
  win.webContents.on("render-process-gone", (_event, details) => {
    sampler.stopAndFlush();
    write(
      "window",
      "renderer process gone",
      { window: name, currentURL: win.webContents.getURL(), details },
      "error"
    );
    void show(
      "OpenCode window terminated unexpectedly",
      [`Window: ${name}`, `Reason: ${details.reason}`, `Code: ${details.exitCode ?? "<unknown>"}`].join("\n"),
      false
    );
  });
  win.on("unresponsive", () => {
    write("window", "renderer unresponsive", { window: name, currentURL: win.webContents.getURL() }, "error");
    sampler.start();
    void show("OpenCode is not responding", "You can relaunch the app, open the logs, or keep waiting.", true);
  });
  win.on("responsive", () => {
    write("window", "renderer responsive", { window: name, currentURL: win.webContents.getURL() }, "error");
    sampler.stopAndFlush();
  });
  win.webContents.on("console-message", (_event, level, message, line, sourceId) => {
    if (message.toLowerCase().includes("terminal") || sourceId.toLowerCase().includes("terminal")) {
      write("pty", "console", { window: name, level, message, line, sourceId });
    }
  });
  win.webContents.on("preload-error", (_event, preloadPath, error) => {
    write("preload", "preload error", { window: name, preloadPath, error }, "error");
  });
}
function addDocumentPolicy(response, file) {
  if (!file.toLowerCase().endsWith(".html")) return response;
  const headers = new Headers(response.headers);
  headers.set(documentPolicyHeader, jsCallStacksDocumentPolicy);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
function allowRendererPermissions(win) {
  const webContentsId = win.webContents.id;
  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback, details) => {
    callback(
      rendererPermissions.has(permission) && isTrustedRendererUrl(details.requestingUrl) && webContents.id === webContentsId
    );
  });
  win.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (!rendererPermissions.has(permission)) return false;
    if (webContents && webContents.id !== webContentsId) return false;
    return isTrustedRendererUrl(details.requestingUrl) || isTrustedRendererUrl(requestingOrigin);
  });
}
function isTrustedRendererUrl(value) {
  return isRendererUrl(value);
}
function addRendererHeaders(value, headers) {
  upsertKeyValue(headers, "Access-Control-Allow-Origin", ["*"]);
  upsertKeyValue(headers, "Access-Control-Allow-Headers", ["*"]);
  if (isRendererUrl(value, true)) upsertKeyValue(headers, documentPolicyHeader, [jsCallStacksDocumentPolicy]);
}
function isRendererUrl(value, html = false) {
  if (!value || !URL.canParse(value)) return false;
  const url = new URL(value);
  if (html && !url.pathname.endsWith(".html")) return false;
  if (url.protocol === `${rendererProtocol}:` && url.host === rendererHost) return true;
  const devUrl = process.env.ELECTRON_RENDERER_URL;
  if (!devUrl || !URL.canParse(devUrl)) return false;
  return url.origin === new URL(devUrl).origin;
}
function wireZoom(win) {
  pinchZoomEnabled.set(win, getPinchZoomEnabled());
  win.webContents.setZoomFactor(1);
  win.webContents.on("zoom-changed", (event, zoomDirection) => {
    event.preventDefault();
    if (pinchZoomEnabled.get(win)) {
      win.webContents.setZoomFactor(clampZoom(win.webContents.getZoomFactor() + (zoomDirection === "in" ? 0.2 : -0.2)));
      updateZoom(win);
      return;
    }
    if (win.webContents.getZoomFactor() !== 1) win.webContents.setZoomFactor(1);
    updateZoom(win);
  });
}
function clampZoom(value) {
  return Math.min(Math.max(value, minZoomLevel), maxZoomLevel);
}
function updateZoom(win) {
  updateTitlebar(win);
  win.webContents.send("zoom-factor-changed", win.webContents.getZoomFactor());
}
function upsertKeyValue(obj, keyToChange, value) {
  const keyToChangeLower = keyToChange.toLowerCase();
  for (const key2 of Object.keys(obj)) {
    if (key2.toLowerCase() === keyToChangeLower) {
      obj[key2] = value;
      return;
    }
  }
  obj[keyToChange] = value;
}
function runDesktopMenuAction(win, action, handlers = {}) {
  switch (action) {
    case "app.checkForUpdates":
      handlers.checkForUpdates?.();
      return;
    case "app.relaunch":
      handlers.relaunch?.();
      return;
    case "window.new":
      createMainWindow();
      return;
    case "window.close":
      win?.close();
      return;
    case "window.minimize":
      win?.minimize();
      return;
    case "window.toggleMaximize":
      if (win?.isMaximized()) {
        win.unmaximize();
        return;
      }
      win?.maximize();
      return;
    case "view.reload":
      win?.reload();
      return;
    case "view.toggleDevTools":
      win?.webContents.toggleDevTools();
      return;
    case "view.resetZoom":
      setZoom(win, 1);
      return;
    case "view.zoomIn":
      setZoom(win, (win?.webContents.getZoomFactor() ?? 1) + 0.2);
      return;
    case "view.zoomOut":
      setZoom(win, (win?.webContents.getZoomFactor() ?? 1) - 0.2);
      return;
    case "view.toggleFullscreen":
      win?.setFullScreen(!win.isFullScreen());
      return;
    case "edit.undo":
      win?.webContents.undo();
      return;
    case "edit.redo":
      win?.webContents.redo();
      return;
    case "edit.cut":
      win?.webContents.cut();
      return;
    case "edit.copy":
      win?.webContents.copy();
      return;
    case "edit.paste":
      win?.webContents.paste();
      return;
    case "edit.delete":
      win?.webContents.delete();
      return;
    case "edit.selectAll":
      win?.webContents.selectAll();
      return;
  }
}
function setZoom(win, value) {
  if (!win) return;
  win.webContents.setZoomFactor(Math.min(Math.max(value, 0.2), 10));
  updateTitlebar(win);
}
const MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024;
function createPickedFileAuthorizations(read = readAttachment, budget = MAX_ATTACHMENT_BYTES) {
  const selections = /* @__PURE__ */ new Map();
  return {
    add(sender, paths) {
      const token = randomUUID();
      selections.set(token, { sender, paths: new Set(paths), remaining: budget });
      return token;
    },
    async read(sender, token, path) {
      const selection = selections.get(token);
      if (selection?.sender !== sender || !selection.paths.delete(path))
        throw new Error("File was not selected by the picker");
      const bytes = await read(path, selection.remaining);
      selection.remaining -= bytes.byteLength;
      if (selection.paths.size === 0) selections.delete(token);
      return bytes;
    },
    release(sender, token) {
      if (selections.get(token)?.sender === sender) selections.delete(token);
    }
  };
}
function assertAttachmentBudget(files) {
  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (total <= MAX_ATTACHMENT_BYTES) return;
  throw new Error(`Selected attachments exceed the ${MAX_ATTACHMENT_BYTES / 1024 / 1024} MB limit`);
}
async function readAttachment(filePath, maxBytes = MAX_ATTACHMENT_BYTES) {
  const file = await open(filePath, "r");
  try {
    const info = await file.stat();
    if (info.size > maxBytes)
      throw new Error(`Selected attachments exceed the ${MAX_ATTACHMENT_BYTES / 1024 / 1024} MB limit`);
    const bytes = Buffer.allocUnsafe(info.size);
    let offset = 0;
    while (offset < info.size) {
      const result = await file.read(bytes, offset, info.size - offset, offset);
      if (result.bytesRead === 0) break;
      offset += result.bytesRead;
    }
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + offset);
  } finally {
    await file.close();
  }
}
function createUpdaterSubscriptions() {
  const subscriptions = /* @__PURE__ */ new Map();
  const remove = (id) => {
    subscriptions.get(id)?.();
    subscriptions.delete(id);
  };
  return {
    set(id, unsubscribe) {
      remove(id);
      subscriptions.set(id, unsubscribe);
    },
    delete: remove,
    clear() {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      subscriptions.clear();
    }
  };
}
const pickerFilters = (ext) => {
  if (!ext || ext.length === 0) return void 0;
  return [{ name: "Files", extensions: ext }];
};
const pickedFiles = createPickedFileAuthorizations();
function registerIpcHandlers(deps) {
  const updaterSubscriptions = createUpdaterSubscriptions();
  app.once("will-quit", updaterSubscriptions.clear);
  ipcMain.handle("kill-sidecar", () => deps.killSidecar());
  ipcMain.handle("await-initialization", () => deps.awaitInitialization());
  ipcMain.handle("consume-initial-deep-links", () => deps.consumeInitialDeepLinks());
  ipcMain.handle("get-default-server-url", () => deps.getDefaultServerUrl());
  ipcMain.handle(
    "set-default-server-url",
    (_event, url) => deps.setDefaultServerUrl(url)
  );
  ipcMain.handle("get-display-backend", () => deps.getDisplayBackend());
  ipcMain.handle(
    "set-display-backend",
    (_event, backend) => deps.setDisplayBackend(backend)
  );
  ipcMain.handle("parse-markdown", (_event, markdown) => deps.parseMarkdown(markdown));
  ipcMain.handle("check-app-exists", (_event, appName) => deps.checkAppExists(appName));
  ipcMain.handle("resolve-app-path", (_event, appName) => deps.resolveAppPath(appName));
  ipcMain.handle("updater-subscribe", (event) => {
    const id = event.sender.id;
    updaterSubscriptions.set(
      id,
      deps.updater.subscribe((state) => {
        if (event.sender.isDestroyed()) return updaterSubscriptions.delete(id);
        event.sender.send("updater-state", state);
      })
    );
    event.sender.once("destroyed", () => updaterSubscriptions.delete(id));
  });
  ipcMain.handle("updater-unsubscribe", (event) => updaterSubscriptions.delete(event.sender.id));
  ipcMain.handle("updater-check", () => deps.updater.check());
  ipcMain.handle("updater-install", () => deps.updater.install());
  ipcMain.handle("set-background-color", (_event, color) => deps.setBackgroundColor(color));
  ipcMain.handle("export-debug-logs", () => deps.exportDebugLogs());
  ipcMain.handle(
    "record-fatal-renderer-error",
    (_event, error) => deps.recordFatalRendererError(error)
  );
  ipcMain.handle("store-get", (_event, name, key2) => {
    try {
      const store = getStore(name);
      const value = store.get(key2);
      if (value === void 0 || value === null) return null;
      return typeof value === "string" ? value : JSON.stringify(value);
    } catch {
      return null;
    }
  });
  ipcMain.handle("store-set", (_event, name, key2, value) => {
    getStore(name).set(key2, value);
  });
  ipcMain.handle("store-delete", (_event, name, key2) => {
    getStore(name).delete(key2);
    void removeStoreFileIfEmpty(name);
  });
  ipcMain.handle("store-clear", (_event, name) => {
    getStore(name).clear();
    void removeStoreFileIfEmpty(name);
  });
  ipcMain.handle("store-keys", (_event, name) => {
    const store = getStore(name);
    return Object.keys(store.store);
  });
  ipcMain.handle("store-length", (_event, name) => {
    const store = getStore(name);
    return Object.keys(store.store).length;
  });
  ipcMain.handle(
    "open-directory-picker",
    async (_event, opts) => {
      const result = await dialog.showOpenDialog({
        properties: ["openDirectory", ...opts?.multiple ? ["multiSelections"] : [], "createDirectory"],
        title: opts?.title ?? "Choose a folder",
        defaultPath: opts?.defaultPath
      });
      if (result.canceled) return null;
      return opts?.multiple ? result.filePaths : result.filePaths[0];
    }
  );
  ipcMain.handle(
    "open-file-picker",
    async (event, opts) => {
      const result = await dialog.showOpenDialog({
        properties: ["openFile", ...opts?.multiple ? ["multiSelections"] : []],
        title: opts?.title ?? "Choose a file",
        defaultPath: opts?.defaultPath,
        filters: pickerFilters(opts?.extensions)
      });
      if (result.canceled) return null;
      const files = await Promise.all(
        result.filePaths.map(async (filePath) => ({
          path: filePath,
          name: basename(filePath),
          size: (await stat(filePath)).size
        }))
      );
      assertAttachmentBudget(files);
      const token = pickedFiles.add(event.sender.id, result.filePaths);
      return { token, files };
    }
  );
  ipcMain.handle("read-picked-file", async (event, token, filePath) => {
    return pickedFiles.read(event.sender.id, token, filePath);
  });
  ipcMain.handle("release-picked-files", (event, token) => {
    pickedFiles.release(event.sender.id, token);
  });
  ipcMain.handle(
    "save-file-picker",
    async (_event, opts) => {
      const result = await dialog.showSaveDialog({
        title: opts?.title ?? "Save file",
        defaultPath: opts?.defaultPath
      });
      if (result.canceled) return null;
      return result.filePath ?? null;
    }
  );
  ipcMain.on("open-link", (_event, url) => {
    void shell.openExternal(url);
  });
  ipcMain.handle("open-path", async (_event, path, app2) => {
    if (!app2) return shell.openPath(path);
    await new Promise((resolve2, reject) => {
      const [cmd, args] = process.platform === "darwin" ? ["open", ["-a", app2, path]] : [app2, [path]];
      execFile(cmd, args, (err) => err ? reject(err) : resolve2());
    });
  });
  ipcMain.handle("read-clipboard-image", () => {
    const image = clipboard.readImage();
    if (image.isEmpty()) return null;
    const buffer = image.toPNG().buffer;
    const size = image.getSize();
    return { buffer, width: size.width, height: size.height };
  });
  ipcMain.on("show-notification", (_event, title, body) => {
    new Notification({ title, body }).show();
  });
  ipcMain.handle("get-window-count", () => BrowserWindow.getAllWindows().length);
  ipcMain.handle("get-window-id", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) throw new Error("Window not found");
    const id = getWindowID(win);
    if (!id) throw new Error("Window ID not found");
    return id;
  });
  ipcMain.handle("get-window-focused", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    return win?.isFocused() ?? false;
  });
  ipcMain.handle("set-window-focus", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.focus();
  });
  ipcMain.handle("show-window", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.show();
  });
  ipcMain.on("relaunch", () => {
    deps.relaunch();
  });
  ipcMain.handle("get-zoom-factor", (event) => event.sender.getZoomFactor());
  ipcMain.handle("set-zoom-factor", (event, factor) => {
    event.sender.setZoomFactor(factor);
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return;
    updateTitlebar(win);
  });
  ipcMain.handle("get-pinch-zoom-enabled", () => getPinchZoomEnabled());
  ipcMain.handle("set-pinch-zoom-enabled", (_event, enabled) => {
    setPinchZoomEnabled(enabled);
  });
  ipcMain.handle("set-titlebar", (event, theme) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return;
    setTitlebar(win, theme);
  });
  ipcMain.handle("run-desktop-menu-action", (event, action) => {
    runDesktopMenuAction(BrowserWindow.fromWebContents(event.sender), action, {
      checkForUpdates: () => void deps.showUpdater(),
      relaunch: deps.relaunch
    });
  });
}
function sendMenuCommand(win, id) {
  win.webContents.send("menu-command", id);
}
function sendDeepLinks(win, urls) {
  win.webContents.send("deep-link", urls);
}
function forwardInitializationFailure(initialization) {
  return (effect) => effect.pipe(Effect.tapCause((cause) => Deferred.failCause(initialization, cause)));
}
const renderer = new marked.Renderer();
renderer.link = ({ href, title, text }) => {
  const titleAttr = title ? ` title="${title}"` : "";
  return `<a href="${href}"${titleAttr} class="external-link" target="_blank" rel="noopener noreferrer">${text}</a>`;
};
function parseMarkdown(input) {
  return marked(input, {
    renderer,
    breaks: false,
    gfm: true
  });
}
const DESKTOP_MENU = [
  {
    id: "app",
    label: "OpenCode",
    platforms: ["macos"],
    items: [
      { type: "item", role: "about" },
      { type: "item", label: "Check for Updates...", action: "app.checkForUpdates", enabled: "updater" },
      { type: "item", label: "Settings", command: "settings.open", accelerator: { macos: "Cmd+," } },
      { type: "item", label: "Reload Webview", action: "view.reload" },
      { type: "item", label: "Restart", action: "app.relaunch" },
      { type: "item", label: "Export Logs...", command: "logs.export" },
      { type: "separator" },
      { type: "item", role: "hide" },
      { type: "item", role: "hideOthers" },
      { type: "item", role: "unhide" },
      { type: "separator" },
      { type: "item", role: "quit" }
    ]
  },
  {
    id: "file",
    label: "File",
    items: [
      {
        type: "item",
        label: "New Session",
        command: "session.new",
        accelerator: { macos: "Shift+Cmd+S" }
      },
      { type: "item", label: "Open Project...", command: "project.open", accelerator: { macos: "Cmd+O" } },
      {
        type: "item",
        label: "Settings",
        command: "settings.open",
        accelerator: { windows: "Ctrl+," },
        platforms: ["windows"]
      },
      {
        type: "item",
        label: "New Window",
        action: "window.new",
        accelerator: { macos: "Cmd+Shift+N", windows: "Ctrl+Shift+N" }
      },
      { type: "separator" },
      { type: "item", label: "Close Window", action: "window.close", role: "close" }
    ]
  },
  {
    id: "edit",
    label: "Edit",
    items: [
      { type: "item", label: "Undo", action: "edit.undo", role: "undo", accelerator: { windows: "Ctrl+Z" } },
      { type: "item", label: "Redo", action: "edit.redo", role: "redo", accelerator: { windows: "Ctrl+Y" } },
      { type: "separator" },
      { type: "item", label: "Cut", action: "edit.cut", role: "cut", accelerator: { windows: "Ctrl+X" } },
      { type: "item", label: "Copy", action: "edit.copy", role: "copy", accelerator: { windows: "Ctrl+C" } },
      { type: "item", label: "Paste", action: "edit.paste", role: "paste", accelerator: { windows: "Ctrl+V" } },
      { type: "item", label: "Delete", action: "edit.delete" },
      {
        type: "item",
        label: "Select All",
        action: "edit.selectAll",
        role: "selectAll",
        accelerator: { windows: "Ctrl+A" }
      }
    ]
  },
  {
    id: "view",
    label: "View",
    items: [
      { type: "item", label: "Toggle Sidebar", command: "sidebar.toggle" },
      { type: "item", label: "Toggle Terminal", command: "terminal.toggle", accelerator: { macos: "Ctrl+`" } },
      { type: "item", label: "Toggle File Tree", command: "fileTree.toggle" },
      { type: "separator" },
      { type: "item", label: "Reload", action: "view.reload", role: "reload" },
      { type: "item", label: "Toggle Developer Tools", action: "view.toggleDevTools", role: "toggleDevTools" },
      { type: "separator" },
      {
        type: "item",
        label: "Actual Size",
        action: "view.resetZoom",
        role: "resetZoom",
        accelerator: { windows: "Ctrl+0" }
      },
      { type: "item", label: "Zoom In", action: "view.zoomIn", role: "zoomIn", accelerator: { windows: "Ctrl++" } },
      { type: "item", label: "Zoom Out", action: "view.zoomOut", role: "zoomOut", accelerator: { windows: "Ctrl+-" } },
      { type: "separator" },
      { type: "item", label: "Toggle Full Screen", action: "view.toggleFullscreen", role: "togglefullscreen" }
    ]
  },
  {
    id: "go",
    label: "Go",
    items: [
      { type: "item", label: "Back", command: "common.goBack", accelerator: { macos: "Cmd+[" } },
      { type: "item", label: "Forward", command: "common.goForward", accelerator: { macos: "Cmd+]" } },
      { type: "separator" },
      { type: "item", label: "Previous Session", command: "session.previous", accelerator: { macos: "Option+Up" } },
      { type: "item", label: "Next Session", command: "session.next", accelerator: { macos: "Option+Down" } },
      { type: "separator" },
      {
        type: "item",
        label: "Previous Project",
        command: "project.previous",
        accelerator: { macos: "Cmd+Option+Up" }
      },
      {
        type: "item",
        label: "Next Project",
        command: "project.next",
        accelerator: { macos: "Cmd+Option+Down" }
      }
    ]
  },
  {
    id: "window",
    label: "Window",
    role: "windowMenu",
    items: [
      { type: "item", label: "Minimize", action: "window.minimize" },
      { type: "item", label: "Maximize", action: "window.toggleMaximize" },
      { type: "separator" },
      { type: "item", label: "Close Window", action: "window.close" }
    ]
  },
  {
    id: "help",
    label: "Help",
    items: [
      { type: "item", label: "OpenCode Documentation", href: "https://opencode.ai/docs" },
      { type: "item", label: "Support Forum", href: "https://discord.com/invite/opencode" },
      { type: "item", label: "Export Logs...", command: "logs.export" },
      { type: "separator" },
      {
        type: "item",
        label: "Share Feedback",
        href: "https://github.com/anomalyco/opencode/issues/new?template=feature_request.yml"
      },
      {
        type: "item",
        label: "Report a Bug",
        href: "https://github.com/anomalyco/opencode/issues/new?template=bug_report.yml"
      }
    ]
  }
];
function desktopMenuVisible(item, platform) {
  return !item.platforms || item.platforms.includes(platform);
}
function createMenu(deps) {
  if (process.platform !== "darwin") return;
  const template = DESKTOP_MENU.filter((menu) => desktopMenuVisible(menu, "macos")).map((menu) => {
    if (menu.role) return { role: nativeRole(menu.role) };
    return {
      label: menu.label,
      submenu: menu.items?.filter((entry) => desktopMenuVisible(entry, "macos")).map((entry) => nativeItem(entry, deps))
    };
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
function nativeItem(entry, deps) {
  if (entry.type === "separator") return { type: "separator" };
  if (entry.role) return { role: nativeRole(entry.role) };
  const item = {
    label: entry.label,
    accelerator: entry.accelerator?.macos,
    enabled: entry.enabled === "updater" ? UPDATER_ENABLED : void 0
  };
  if (entry.command) {
    const command = entry.command;
    item.click = () => deps.trigger(command);
  }
  if (entry.action) {
    const action = entry.action;
    item.click = () => runDesktopMenuAction(BrowserWindow.getFocusedWindow(), action, {
      checkForUpdates: deps.checkForUpdates,
      relaunch: deps.relaunch
    });
  }
  if (entry.href) {
    const href = entry.href;
    item.click = () => shell.openExternal(href);
  }
  return item;
}
function nativeRole(role) {
  return role;
}
const TIMEOUT = 5e3;
function resolveUserShell(envShell, loginShell) {
  const resolvedLoginShell = loginShell && loginShell !== "unknown" ? loginShell : void 0;
  return envShell || resolvedLoginShell || "/bin/sh";
}
function getUserShell() {
  try {
    return resolveUserShell(process.env.SHELL, userInfo().shell);
  } catch {
    return resolveUserShell(process.env.SHELL, void 0);
  }
}
function parseShellEnv(out) {
  const env = {};
  for (const line of out.toString("utf8").split("\0")) {
    if (!line) continue;
    const ix = line.indexOf("=");
    if (ix <= 0) continue;
    env[line.slice(0, ix)] = line.slice(ix + 1);
  }
  return env;
}
function probe(shell2, mode) {
  const out = spawnSync(shell2, [mode, "-c", "env -0"], {
    stdio: ["ignore", "pipe", "ignore"],
    timeout: TIMEOUT,
    windowsHide: true
  });
  const err = out.error;
  if (err) {
    if (err.code === "ETIMEDOUT") return { type: "Timeout" };
    console.log(`[server] Shell env probe failed for ${shell2} ${mode}: ${err.message}`);
    return { type: "Unavailable" };
  }
  if (out.status !== 0) {
    console.log(`[server] Shell env probe exited with non-zero status for ${shell2} ${mode}`);
    return { type: "Unavailable" };
  }
  const env = parseShellEnv(out.stdout);
  if (Object.keys(env).length === 0) {
    console.log(`[server] Shell env probe returned empty env for ${shell2} ${mode}`);
    return { type: "Unavailable" };
  }
  return { type: "Loaded", value: env };
}
function isNushell(shell2) {
  const name = basename(shell2).toLowerCase();
  const raw2 = shell2.toLowerCase();
  return name === "nu" || name === "nu.exe" || raw2.endsWith("\\nu.exe");
}
function loadShellEnv(shell2, logger2) {
  if (isNushell(shell2)) {
    logger2.log(`[server] Skipping shell env probe for nushell: ${shell2}`);
    return null;
  }
  const interactive = probe(shell2, "-il");
  if (interactive.type === "Loaded") {
    logger2.log(`[server] Loaded shell environment with -il (${Object.keys(interactive.value).length} vars)`);
    return interactive.value;
  }
  if (interactive.type === "Timeout") {
    logger2.log(`[server] Interactive shell env probe timed out: ${shell2}`);
    return null;
  }
  const login = probe(shell2, "-l");
  if (login.type === "Loaded") {
    logger2.log(`[server] Loaded shell environment with -l (${Object.keys(login.value).length} vars)`);
    return login.value;
  }
  logger2.log(`[server] Falling back to app environment: ${shell2}`);
  return null;
}
const SIDECAR_SERVICE_NAME = "opencode server";
const SIDECAR_START_STALL_TIMEOUT = 6e4;
const SIDECAR_STOP_TIMEOUT = 6e3;
function getDefaultServerUrl() {
  const value = getStore().get(DEFAULT_SERVER_URL_KEY);
  return typeof value === "string" ? value : null;
}
function setDefaultServerUrl(url) {
  if (url) {
    getStore().set(DEFAULT_SERVER_URL_KEY, url);
    return;
  }
  getStore().delete(DEFAULT_SERVER_URL_KEY);
}
function preferAppEnv(userDataPath) {
  const shell2 = process.platform === "win32" ? null : getUserShell();
  Object.assign(process.env, {
    ...shell2 ? loadShellEnv(shell2, getLogger()) : null,
    OPENCODE_EXPERIMENTAL_ICON_DISCOVERY: "true",
    OPENCODE_EXPERIMENTAL_FILEWATCHER: "true",
    OPENCODE_CLIENT: "desktop",
    XDG_STATE_HOME: process.env.XDG_STATE_HOME ?? userDataPath
  });
}
async function spawnLocalServer(hostname, port, password, options) {
  const sidecar = join(dirname(fileURLToPath(import.meta.url)), "sidecar.js");
  const child = utilityProcess.fork(sidecar, [], {
    cwd: process.cwd(),
    env: createSidecarEnv(),
    serviceName: SIDECAR_SERVICE_NAME,
    stdio: "pipe"
  });
  let exited = false;
  const exit = defer();
  const onProcessGone = (_event, details) => {
    if (details.type !== "Utility" || details.name !== SIDECAR_SERVICE_NAME) return;
    options.onStderr?.(`utility process gone reason=${details.reason} exitCode=${details.exitCode}`);
  };
  app.on("child-process-gone", onProcessGone);
  child.once("exit", (code) => {
    exited = true;
    app.off("child-process-gone", onProcessGone);
    options.onExit?.(code);
    exit.resolve(code);
  });
  child.on("error", (error) => options.onStderr?.(`utility process error: ${serializeError(error).message}`));
  child.stdout?.on("data", (chunk) => options.onStdout?.(chunk.toString("utf8").trimEnd()));
  child.stderr?.on("data", (chunk) => options.onStderr?.(chunk.toString("utf8").trimEnd()));
  await new Promise((resolve2, reject) => {
    let done = false;
    let timeout;
    const fail = (error) => {
      if (done) return;
      done = true;
      cleanup2();
      reject(error);
    };
    const refreshTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fail(new Error(`Sidecar did not become ready within ${SIDECAR_START_STALL_TIMEOUT}ms: ${sidecar}`));
      }, SIDECAR_START_STALL_TIMEOUT);
    };
    const onMessage = (message) => {
      if (message.type === "ready") {
        if (done) return;
        done = true;
        cleanup2();
        resolve2();
        return;
      }
      if (message.type === "error") {
        fail(Object.assign(new Error(message.error.message), { stack: message.error.stack }));
      }
    };
    const onExit = (code) => {
      fail(new Error(`Sidecar exited before ready with code ${code}`));
    };
    const cleanup2 = () => {
      clearTimeout(timeout);
      child.off("message", onMessage);
      child.off("exit", onExit);
    };
    child.on("message", onMessage);
    child.on("exit", onExit);
    refreshTimeout();
    child.postMessage({
      type: "start",
      hostname,
      port,
      password,
      userDataPath: options.userDataPath
    });
  }).catch((error) => {
    if (!exited) child.kill();
    throw error;
  });
  const wait = (async () => {
    const url = `http://${hostname}:${port}`;
    let healthy = false;
    const gone = exit.promise.then((code) => {
      if (healthy) return;
      throw new Error(`Sidecar exited before health check passed with code ${code}`);
    });
    const ready = async () => {
      while (true) {
        await new Promise((resolve2) => setTimeout(resolve2, 100));
        if (await checkHealth(url, password)) {
          healthy = true;
          return;
        }
      }
    };
    await Promise.race([ready(), gone]);
  })();
  let stopping;
  return {
    listener: {
      stop: () => {
        if (stopping) return stopping;
        if (exited) return Promise.resolve();
        child.postMessage({ type: "stop" });
        stopping = Promise.race([
          exit.promise.then(() => void 0),
          delay(SIDECAR_STOP_TIMEOUT).then(() => {
            if (!exited) child.kill();
          })
        ]);
        return stopping;
      }
    },
    health: { wait }
  };
}
async function checkHealth(url, password) {
  let healthUrl;
  try {
    healthUrl = new URL("/global/health", url);
  } catch {
    return false;
  }
  const headers = new Headers();
  if (password) {
    const auth = Buffer.from(`opencode:${password}`).toString("base64");
    headers.set("authorization", `Basic ${auth}`);
  }
  try {
    const res = await fetch(healthUrl, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(3e3)
    });
    return res.ok;
  } catch {
    return false;
  }
}
function createSidecarEnv() {
  const env = Object.fromEntries(
    Object.entries(process.env).flatMap(([key2, value]) => value === void 0 ? [] : [[key2, String(value)]])
  );
  delete env.DEBUG;
  if (process.platform === "linux") delete env.LD_PRELOAD;
  if (!app.isPackaged) env.OPENCODE_DISABLE_CHANNEL_DB = "1";
  return env;
}
function delay(ms) {
  return new Promise((resolve2) => setTimeout(resolve2, ms));
}
function serializeError(error) {
  if (error instanceof Error) return { message: error.message, stack: error.stack };
  return { message: String(error) };
}
function defer() {
  let resolve2;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve2 = res;
    reject = rej;
  });
  return { promise, resolve: resolve2, reject };
}
function createUpdaterController(input) {
  let state = input.enabled ? { status: "idle" } : { status: "disabled" };
  let pending;
  const listeners = /* @__PURE__ */ new Set();
  const transition = (next) => {
    input.log?.("updater state changed", { from: state.status, to: next.status });
    state = next;
    listeners.forEach((listener) => listener(state));
    return state;
  };
  const check = () => {
    if (!input.enabled) return Promise.resolve(state);
    if (state.status === "ready") return Promise.resolve(state);
    if (pending) return pending;
    pending = (async () => {
      transition({ status: "checking" });
      const result = await input.backend.checkForUpdates();
      const version = result?.updateInfo?.version;
      if (!result?.isUpdateAvailable || !version || version === input.currentVersion) {
        await input.persistence.clear();
        return transition({ status: "up-to-date" });
      }
      transition({ status: "downloading", version });
      await input.backend.downloadUpdate();
      await input.persistence.set({ version });
      return transition({ status: "ready", version });
    })().catch(
      (error) => transition({ status: "error", message: error instanceof Error ? error.message : String(error) })
    ).finally(() => {
      pending = void 0;
    });
    return pending;
  };
  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
    async start() {
      const ready = await input.persistence.get();
      if (ready?.version === input.currentVersion) await input.persistence.clear();
      return check();
    },
    check,
    async install() {
      if (state.status !== "ready") throw new Error("Update is not ready to install");
      const version = state.version;
      transition({ status: "installing", version });
      await input.stop().then(() => {
        input.backend.quitAndInstall();
        transition({ status: "ready", version });
      }).catch((error) => {
        transition({ status: "ready", version });
        throw error;
      });
    }
  };
}
const { autoUpdater } = pkg;
const key = "ready";
function setupAutoUpdater(stop) {
  const logger2 = getLogger();
  autoUpdater.logger = logger2;
  autoUpdater.channel = "latest";
  autoUpdater.allowPrerelease = false;
  autoUpdater.allowDowngrade = true;
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;
  logger2.log("auto updater configured", {
    channel: autoUpdater.channel,
    allowPrerelease: autoUpdater.allowPrerelease,
    allowDowngrade: autoUpdater.allowDowngrade,
    currentVersion: app.getVersion()
  });
  const store = getStore("opencode.updater");
  return createUpdaterController({
    enabled: UPDATER_ENABLED,
    currentVersion: app.getVersion(),
    backend: autoUpdater,
    persistence: {
      get() {
        const value = store.get(key);
        if (!value || typeof value !== "object" || !("version" in value) || typeof value.version !== "string") return;
        return { version: value.version };
      },
      set: (value) => store.set(key, value),
      clear: () => store.delete(key)
    },
    stop,
    log: (message, data) => logger2.log(message, data)
  });
}
async function showUpdaterDialog(controller, alertOnFail) {
  const state = await controller.check();
  if (state.status === "error") {
    await dialog.showMessageBox({ type: "error", message: "Update check failed.", title: "Update Error" });
    return;
  }
  if (state.status === "up-to-date") {
    await dialog.showMessageBox({ type: "info", message: "You're up to date.", title: "No Updates" });
    return;
  }
  if (state.status !== "ready") return;
  const response = await dialog.showMessageBox({
    type: "info",
    message: `Update ${state.version} downloaded. Restart now?`,
    title: "Update Ready",
    buttons: ["Restart", "Later"],
    defaultId: 0,
    cancelId: 1
  });
  if (response.response === 0) await controller.install();
}
function wslServerIdsToStartOnInitialize(servers) {
  return servers.map((server2) => server2.id);
}
function expectOpencodeVersion(installed, expected, distro = "Debian") {
  if (installed === expected) return;
  throw new Error(
    `OpenCode update finished but ${distro} still reports ${installed ?? "no version"}; expected ${expected}`
  );
}
const pendingRestartAfterWslInstall = (runtime) => !runtime.available;
async function pollWslHealth(check, signal, interval = 100) {
  while (!signal.aborted) {
    if (await check()) return;
    await abortableDelay(interval, signal);
  }
}
function abortableDelay(duration, signal) {
  return new Promise((resolve2) => {
    const done = () => {
      clearTimeout(timeout);
      signal.removeEventListener("abort", done);
      resolve2();
    };
    const timeout = setTimeout(done, duration);
    signal.addEventListener("abort", done, { once: true });
  });
}
function wslServerIdToRestart(servers, distro) {
  return servers.find((item) => item.config.distro === distro)?.config.id;
}
function clearWslDistroState(distroProbes, opencodeChecks, distro) {
  const nextDistroProbes = { ...distroProbes };
  const nextOpencodeChecks = { ...opencodeChecks };
  delete nextDistroProbes[distro];
  delete nextOpencodeChecks[distro];
  return { distroProbes: nextDistroProbes, opencodeChecks: nextOpencodeChecks };
}
function wslTerminalArgs(distro) {
  return ["/c", "start", "", "wsl", ...distro ? ["-d", distro] : []];
}
function requireWslIpcString(name, value) {
  if (typeof value === "string" && value.length > 0) return value;
  throw new Error(`Invalid ${name}`);
}
function requireWslIpcStrings(name, value) {
  if (!Array.isArray(value)) throw new Error(`Invalid ${name}`);
  const values = value.map((item) => requireWslIpcString(name, item));
  if (values.length > 0) return values;
  throw new Error(`Invalid ${name}`);
}
const DEFAULT_WSL_TIMEOUT_MS = 2e4;
const DEFAULT_WSL_INSTALL_TIMEOUT_MS = 15 * 6e4;
function wslArgs(args, distro, user) {
  return [...distro ? ["-d", distro] : [], ...[], "--", ...args];
}
function runWsl(args, opts = {}) {
  return runCommand("wsl", args, opts);
}
function runPowerShell(command, opts = {}) {
  return runCommand(
    "powershell.exe",
    ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", command],
    opts
  );
}
function runCommand(command, args, opts = {}) {
  return new Promise((resolve2, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
      signal: opts.signal
    });
    const timeoutMs = opts.timeoutMs ?? DEFAULT_WSL_TIMEOUT_MS;
    const timeoutId = setTimeout(() => {
      try {
        child.kill();
      } catch {
      }
      reject(new Error(`${command} ${args.join(" ")} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    let stdout = "";
    let stderr = "";
    const stdoutDecoder = createOutputDecoder();
    const stderrDecoder = createOutputDecoder();
    const append = (stream, chunk) => {
      if (!chunk) return;
      if (stream === "stdout") {
        stdout += chunk;
        return;
      }
      stderr += chunk;
    };
    child.stdout.on("data", (chunk) => {
      append("stdout", stdoutDecoder.decode(chunk));
    });
    child.stdout.on("end", () => {
      append("stdout", stdoutDecoder.flush());
    });
    child.stderr.on("data", (chunk) => {
      append("stderr", stderrDecoder.decode(chunk));
    });
    child.stderr.on("end", () => {
      append("stderr", stderrDecoder.flush());
    });
    child.once("error", (error) => {
      clearTimeout(timeoutId);
      reject(error);
    });
    child.once("close", (code, signal) => {
      clearTimeout(timeoutId);
      resolve2({ code, signal, stdout, stderr });
    });
  });
}
function runInteractiveCommand(command, args, opts = {}, defaultTimeoutMs) {
  return new Promise((resolve2, reject) => {
    const child = pty.spawn(command, args, {
      name: "xterm-color",
      cols: 80,
      rows: 24,
      cwd: process.cwd(),
      env: process.env,
      useConpty: true
    });
    let settled = false;
    let stdout = "";
    const cleanup2 = () => {
      clearTimeout(timeoutId);
      abortCleanup?.();
    };
    const timeoutMs = opts.timeoutMs ?? defaultTimeoutMs;
    const timeoutId = setTimeout(() => {
      try {
        child.kill();
      } catch {
      }
      if (settled) return;
      settled = true;
      cleanup2();
      reject(new Error(`${command} ${args.join(" ")} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    const abortHandler = () => {
      try {
        child.kill();
      } catch {
      }
      if (settled) return;
      settled = true;
      cleanup2();
      reject(new DOMException("Aborted", "AbortError"));
    };
    const abortCleanup = opts.signal ? (() => {
      opts.signal?.addEventListener("abort", abortHandler, { once: true });
      return () => opts.signal?.removeEventListener("abort", abortHandler);
    })() : void 0;
    child.onData((data) => {
      stdout += data;
    });
    child.onExit((event) => {
      if (settled) return;
      settled = true;
      cleanup2();
      resolve2({ code: event.exitCode, signal: null, stdout, stderr: "" });
    });
  });
}
function createOutputDecoder() {
  let decoder;
  return {
    decode(chunk) {
      decoder ??= new TextDecoder(detectOutputEncoding(chunk));
      return decoder.decode(chunk, { stream: true });
    },
    flush() {
      return decoder?.decode() ?? "";
    }
  };
}
function detectOutputEncoding(chunk) {
  if (chunk[0] === 255 && chunk[1] === 254) return "utf-16le";
  const pairs = Math.floor(chunk.length / 2);
  if (pairs < 2) return "utf-8";
  const oddZeroes = Array.from({ length: pairs }).filter((_, index) => chunk[index * 2 + 1] === 0).length;
  const evenZeroes = Array.from({ length: pairs }).filter((_, index) => chunk[index * 2] === 0).length;
  return oddZeroes >= Math.ceil(pairs / 3) && evenZeroes * 2 <= oddZeroes ? "utf-16le" : "utf-8";
}
function runWslInDistro(args, distro, opts) {
  return runWsl(wslArgs(args, distro), opts);
}
function runWslSh(script, distro, opts) {
  return runWslInDistro(["sh", "-lc", script], distro, opts);
}
async function probeWslRuntime(opts) {
  const version = await runWsl(["--version"], opts).catch((error) => ({
    code: 1,
    signal: null,
    stdout: "",
    stderr: error instanceof Error ? error.message : String(error)
  }));
  if (version.code !== 0) {
    return {
      available: false,
      version: null,
      error: summarize(version.stderr || version.stdout) || "WSL is unavailable"
    };
  }
  return {
    available: true,
    version: firstLine(version.stdout),
    error: null
  };
}
async function listInstalledWslDistros(opts) {
  const result = await runWsl(["--list", "--verbose"], opts);
  if (result.code !== 0) {
    throw new Error(summarize(result.stderr || result.stdout) || "Failed to list installed WSL distros");
  }
  return parseInstalledDistros(result.stdout);
}
async function listOnlineWslDistros(opts) {
  const result = await runWsl(["--list", "--online"], opts);
  if (result.code !== 0) {
    throw new Error(summarize(result.stderr || result.stdout) || "Failed to list online WSL distros");
  }
  return parseOnlineDistros(result.stdout);
}
async function installWslRuntimeElevated(opts) {
  const script = [
    "$ErrorActionPreference = 'Stop'",
    "$process = Start-Process -FilePath 'wsl.exe' -Verb RunAs -ArgumentList @('--install','--no-distribution') -Wait -PassThru",
    "if ($null -ne $process.ExitCode) { exit $process.ExitCode }"
  ].join("; ");
  return runPowerShell(script, withTimeout(opts, DEFAULT_WSL_INSTALL_TIMEOUT_MS));
}
async function installWslDistro(name, opts) {
  return runInteractiveCommand(
    resolveSystem32Command("wsl.exe"),
    ["--install", "-d", name, "--web-download", "--no-launch"],
    withTimeout(opts, DEFAULT_WSL_INSTALL_TIMEOUT_MS),
    DEFAULT_WSL_INSTALL_TIMEOUT_MS
  );
}
async function installWslOpencode(version, distro, opts) {
  return runInteractiveCommand(
    resolveSystem32Command("wsl.exe"),
    wslArgs(
      ["bash", "-lc", `curl -fsSL https://opencode.ai/install | bash -s -- --version ${shellEscape(version)}`],
      distro
    ),
    withTimeout(opts, DEFAULT_WSL_INSTALL_TIMEOUT_MS),
    DEFAULT_WSL_INSTALL_TIMEOUT_MS
  );
}
async function probeWslDistro(name, opts) {
  const executable = await runWslInDistro(["/bin/true"], name, opts).catch((error) => ({
    code: 1,
    signal: null,
    stdout: "",
    stderr: error instanceof Error ? error.message : String(error)
  }));
  if (executable.code !== 0) {
    return {
      name,
      canExecute: false,
      hasBash: false,
      hasCurl: false,
      error: summarize(executable.stderr || executable.stdout) || "Cannot execute commands in distro"
    };
  }
  const [bash, curl] = await Promise.all([
    runWslSh("command -v bash >/dev/null && printf yes || printf no", name, opts),
    runWslSh("command -v curl >/dev/null && printf yes || printf no", name, opts)
  ]);
  return {
    name,
    canExecute: true,
    hasBash: bash.code === 0 && summarize(bash.stdout) === "yes",
    hasCurl: curl.code === 0 && summarize(curl.stdout) === "yes",
    error: null
  };
}
async function resolveWslOpencode(distro, opts) {
  return firstLine(
    (await runWslSh(
      'if [ -x "$HOME/.opencode/bin/opencode" ]; then printf "%s\\n" "$HOME/.opencode/bin/opencode"; fi',
      distro,
      opts
    )).stdout
  );
}
async function readWslCommandVersion(command, distro, opts) {
  const result = await runWslSh(`${shellEscape(command)} --version 2>/dev/null || true`, distro, opts);
  return firstLine(result.stdout);
}
function openWslTerminal(distro) {
  return new Promise((resolve2, reject) => {
    const child = spawn("cmd.exe", wslTerminalArgs(distro), {
      detached: true,
      stdio: "ignore",
      windowsHide: true
    });
    child.once("error", reject);
    child.once("spawn", () => {
      child.unref();
      resolve2();
    });
  });
}
function parseInstalledDistros(output) {
  return output.split(/\r?\n/g).flatMap((line) => {
    const trimmed = line.trim();
    if (!trimmed) return [];
    const match = line.match(/^\s*(\*)?\s*(.*?)\s{2,}\S+\s+(\d+)\s*$/);
    if (!match) return [];
    const [, marker, name, version] = match;
    if (!name || /^name$/i.test(name)) return [];
    return [
      {
        name: name.trim(),
        version: Number.isNaN(Number.parseInt(version, 10)) ? null : Number.parseInt(version, 10),
        isDefault: marker === "*"
      }
    ];
  });
}
function parseOnlineDistros(output) {
  return output.split(/\r?\n/g).flatMap((line) => {
    const trimmed = line.trim();
    if (!trimmed) return [];
    const match = trimmed.match(/^([A-Za-z0-9._-]+)\s{2,}(.+)$/);
    if (!match) return [];
    const [, name, label] = match;
    if (/^name$/i.test(name)) return [];
    return [{ name, label: label.trim() }];
  });
}
function firstLine(value) {
  return value.split(/\r?\n/g).map((line) => line.trim()).find(Boolean) ?? null;
}
function summarize(value) {
  return value.split(/\r?\n/g).map((line) => line.trim()).filter(Boolean).join("\n");
}
function shellEscape(value) {
  return `'${value.replace(/'/g, `'"'"'`)}'`;
}
function resolveSystem32Command(command) {
  const root2 = process.env.SystemRoot ?? process.env.windir;
  if (!root2) return command;
  const resolved = join(root2, "System32", command);
  return existsSync(resolved) ? resolved : command;
}
function withTimeout(opts, timeoutMs) {
  return {
    ...opts,
    timeoutMs: opts?.timeoutMs ?? timeoutMs
  };
}
function wslServerIdForDistro(distro) {
  return `wsl:${distro}`;
}
function createWslServersController(appVersion, spawnSidecar, options) {
  let state = initialState();
  const listeners = /* @__PURE__ */ new Set();
  const sidecars = /* @__PURE__ */ new Map();
  const startAttempts = /* @__PURE__ */ new Map();
  let jobAbort;
  const logger2 = options?.logger;
  const readServers = options?.readServers ?? readPersistedServers;
  const writeServers = options?.writeServers ?? writePersistedServers;
  const probeDistro = options?.probeDistro ?? probeWslDistro;
  const emit = () => {
    for (const listener of listeners) listener({ type: "state", state });
  };
  const setState = (next) => {
    state = { ...state, ...next };
    emit();
  };
  const persistServers = (servers) => {
    writeServers(servers);
  };
  const updateServer = (id, update) => {
    const next = state.servers.map((item) => item.config.id === id ? update(item) : item);
    setState({ servers: next });
  };
  const beginJob = (job) => {
    jobAbort?.abort();
    const abort = new AbortController();
    jobAbort = abort;
    setState({ job });
    return abort;
  };
  const endJob = (abort) => {
    if (jobAbort !== abort) return;
    jobAbort = void 0;
    setState({ job: null });
  };
  const refreshFromStore = () => {
    const persisted = readServers();
    const items = persisted.map((config) => {
      const existing = state.servers.find((item) => item.config.id === config.id);
      return {
        config,
        runtime: existing?.runtime ?? { kind: "stopped" }
      };
    });
    setState({ servers: items });
  };
  const setRuntime = (id, runtime) => {
    updateServer(id, (item) => ({ ...item, runtime }));
  };
  const setOpencodeCheck = (distro, check) => {
    setState({
      opencodeChecks: {
        ...state.opencodeChecks,
        [distro]: check
      }
    });
  };
  const checkOpencode = async (distro, opts) => {
    const resolved = await (options?.resolveOpencode ?? resolveWslOpencode)(distro, opts);
    const version = resolved ? await (options?.readCommandVersion ?? readWslCommandVersion)(resolved, distro, opts) : null;
    return opencodeCheck(distro, resolved, version, appVersion);
  };
  const refreshOpencodeCheck = async (distro, opts) => {
    setOpencodeCheck(distro, await checkOpencode(distro, opts));
  };
  const probeAddableDistros = async (distros, opts) => {
    const unique = [...new Set(distros)];
    const distroProbes = await Promise.all(
      unique.filter((distro) => !state.distroProbes[distro]).map(async (distro) => [distro, await probeDistro(distro, opts)])
    );
    if (distroProbes.length) {
      setState({ distroProbes: { ...state.distroProbes, ...Object.fromEntries(distroProbes) } });
    }
    const opencodeChecks = await Promise.all(
      unique.filter((distro) => distroProbeReady(state.distroProbes[distro])).filter((distro) => !state.opencodeChecks[distro]).map(async (distro) => [distro, await checkOpencode(distro, opts)])
    );
    if (opencodeChecks.length) {
      setState({ opencodeChecks: { ...state.opencodeChecks, ...Object.fromEntries(opencodeChecks) } });
    }
  };
  const hasServer = (id, distro) => {
    return state.servers.some((item) => item.config.id === id && item.config.distro === distro);
  };
  const refreshOpencodeCheckBackground = (id, distro) => {
    void checkOpencode(distro).then((check) => {
      if (!hasServer(id, distro)) return;
      setOpencodeCheck(distro, check);
    }).catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      logger2?.error("wsl opencode check failed", { id, distro, message });
    });
  };
  const refreshOpencodeChecks = async () => {
    await Promise.all(
      state.servers.map(
        (item) => checkOpencode(item.config.distro).then((check) => {
          if (!hasServer(item.config.id, item.config.distro)) return;
          setOpencodeCheck(item.config.distro, check);
        }).catch((error) => {
          const message = error instanceof Error ? error.message : String(error);
          logger2?.error("wsl opencode check failed", {
            id: item.config.id,
            distro: item.config.distro,
            message
          });
        })
      )
    );
  };
  const refreshDistroLists = async (opts) => {
    const [installed, online] = await Promise.all([listInstalledWslDistros(opts), listOnlineWslDistros(opts)]);
    return { installed, online };
  };
  const nextStartAttempt = (id) => {
    const next = (startAttempts.get(id) ?? 0) + 1;
    startAttempts.set(id, next);
    return next;
  };
  const invalidateStartAttempt = (id) => {
    startAttempts.set(id, (startAttempts.get(id) ?? 0) + 1);
  };
  const isCurrentStartAttempt = (id, attempt) => {
    return startAttempts.get(id) === attempt && state.servers.some((item) => item.config.id === id);
  };
  const startServer = async (id) => {
    const item = state.servers.find((x) => x.config.id === id);
    if (!item) return;
    const attempt = nextStartAttempt(id);
    await stopServerInternal(id);
    if (!isCurrentStartAttempt(id, attempt)) return;
    setRuntime(id, { kind: "starting" });
    logger2?.log("wsl sidecar starting", { id, distro: item.config.distro });
    try {
      const sidecar = await spawnSidecar(item.config.distro);
      if (!isCurrentStartAttempt(id, attempt)) {
        try {
          sidecar.listener.stop();
        } catch {
        }
        return;
      }
      sidecars.set(id, sidecar);
      setRuntime(id, {
        kind: "ready",
        url: sidecar.url,
        username: sidecar.username,
        password: sidecar.password
      });
      sidecar.listener.onExit((code, signal) => {
        if (sidecars.get(id) !== sidecar) return;
        sidecars.delete(id);
        const message = startupFailure$1(code, signal);
        setRuntime(id, { kind: "failed", message });
        logger2?.error("wsl sidecar exited", { id, distro: item.config.distro, code, signal });
      });
      refreshOpencodeCheckBackground(id, item.config.distro);
      logger2?.log("wsl sidecar ready", { id, distro: item.config.distro, url: sidecar.url });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!isCurrentStartAttempt(id, attempt)) return;
      setRuntime(id, { kind: "failed", message });
      logger2?.error("wsl sidecar failed to start", { id, distro: item.config.distro, message });
    }
  };
  const stopServerInternal = async (id) => {
    const existing = sidecars.get(id);
    if (!existing) return;
    sidecars.delete(id);
    try {
      existing.listener.stop();
    } catch {
    }
  };
  const runJob = async (job, runner) => {
    const abort = beginJob(job);
    try {
      const value = await runner(abort);
      endJob(abort);
      return value;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        endJob(abort);
        return void 0;
      }
      const err = error instanceof Error ? error : new Error(String(error));
      endJob(abort);
      throw err;
    }
  };
  return {
    getState() {
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    async initialize() {
      refreshFromStore();
      void refreshOpencodeChecks();
      for (const id of wslServerIdsToStartOnInitialize(state.servers.map((item) => item.config))) void startServer(id);
    },
    async probeRuntime() {
      await runJob({ kind: "runtime", startedAt: Date.now() }, async (abort) => {
        const runtime = await probeWslRuntime({ signal: abort.signal });
        setState({
          runtime,
          pendingRestart: state.pendingRestart && !runtime.available ? state.pendingRestart : false
        });
      });
    },
    async refreshDistros() {
      await runJob({ kind: "distros", startedAt: Date.now() }, async (abort) => {
        setState(await refreshDistroLists({ signal: abort.signal }));
      });
    },
    async installWsl() {
      await runJob({ kind: "install-wsl", startedAt: Date.now() }, async (abort) => {
        const result = await installWslRuntimeElevated({ signal: abort.signal });
        if (result.code !== 0) {
          const message = summarize(result.stderr || result.stdout) || "WSL installation failed";
          throw new Error(message);
        }
        const runtime = await probeWslRuntime({ signal: abort.signal });
        setState({ runtime, pendingRestart: pendingRestartAfterWslInstall(runtime) });
      });
    },
    async installDistro(name) {
      await runJob({ kind: "install-distro", distro: name, startedAt: Date.now() }, async (abort) => {
        const result = await installWslDistro(name, { signal: abort.signal });
        if (result.code !== 0) {
          const message = summarize(result.stderr || result.stdout) || `Failed to install distro: ${name}`;
          throw new Error(message);
        }
        const distros = await refreshDistroLists({ signal: abort.signal });
        const probe2 = await probeDistro(name, { signal: abort.signal });
        setState({
          ...distros,
          distroProbes: { ...state.distroProbes, [name]: probe2 }
        });
      });
    },
    async probeAddable(distros) {
      if (!distros.length) return;
      await runJob({ kind: "probe-addable", distros, startedAt: Date.now() }, async (abort) => {
        await probeAddableDistros(distros, { signal: abort.signal });
      });
    },
    async installOpencode(name) {
      await runJob({ kind: "install-opencode", distro: name, startedAt: Date.now() }, async (abort) => {
        const result = await installWslOpencode(appVersion, name, { signal: abort.signal });
        if (result.code !== 0) {
          throw new Error(summarize(result.stderr || result.stdout) || "OpenCode installation failed");
        }
        await refreshOpencodeCheck(name, { signal: abort.signal });
        expectOpencodeVersion(state.opencodeChecks[name]?.version ?? null, appVersion, name);
        const id = wslServerIdToRestart(state.servers, name);
        if (id) await startServer(id);
      });
    },
    async openTerminal(name) {
      await openWslTerminal(name);
    },
    async addServer(distro) {
      const id = wslServerIdForDistro(distro);
      if (state.servers.some((item) => item.config.id === id)) {
        throw new Error(`${distro} is already added`);
      }
      const config = {
        id,
        distro
      };
      persistServers([...readServers(), config]);
      setState({
        servers: [...state.servers, { config, runtime: { kind: "starting" } }]
      });
      void startServer(id);
      return config;
    },
    async removeServer(id) {
      const distro = state.servers.find((item) => item.config.id === id)?.config.distro;
      invalidateStartAttempt(id);
      await stopServerInternal(id);
      const remaining = readServers().filter((item) => item.id !== id);
      persistServers(remaining);
      setState({
        servers: state.servers.filter((item) => item.config.id !== id),
        ...distro ? clearWslDistroState(state.distroProbes, state.opencodeChecks, distro) : {}
      });
    },
    startServer,
    stopAll() {
      for (const item of state.servers) invalidateStartAttempt(item.config.id);
      for (const existing of sidecars.values()) {
        try {
          existing.listener.stop();
        } catch {
        }
      }
      sidecars.clear();
    }
  };
}
function initialState() {
  return {
    runtime: null,
    installed: [],
    online: [],
    distroProbes: {},
    opencodeChecks: {},
    pendingRestart: false,
    servers: [],
    job: null
  };
}
function readPersistedServers() {
  const store = getStore();
  const existing = store.get(WSL_SERVERS_KEY);
  if (existing && typeof existing === "object") {
    const record = existing;
    const list = Array.isArray(record.servers) ? record.servers : [];
    return list.flatMap(normalizePersistedServer);
  }
  return [];
}
function writePersistedServers(servers) {
  getStore().set(WSL_SERVERS_KEY, { servers });
}
function normalizePersistedServer(value) {
  if (!value || typeof value !== "object") return [];
  const record = value;
  const distro = typeof record.distro === "string" && record.distro.length > 0 ? record.distro : null;
  if (!distro) return [];
  const id = typeof record.id === "string" && record.id.length > 0 ? record.id : wslServerIdForDistro(distro);
  return [
    {
      id,
      distro
    }
  ];
}
function opencodeCheck(distro, resolvedPath, version, expectedVersion) {
  if (!resolvedPath) {
    return {
      distro,
      resolvedPath: null,
      version: null,
      expectedVersion,
      matchesDesktop: null,
      error: "opencode is not installed in this distro"
    };
  }
  if (!version) {
    return {
      distro,
      resolvedPath,
      version: null,
      expectedVersion,
      matchesDesktop: null,
      error: "opencode is installed but could not run"
    };
  }
  return {
    distro,
    resolvedPath,
    version,
    expectedVersion,
    matchesDesktop: version === expectedVersion,
    error: null
  };
}
function distroProbeReady(probe2) {
  return !!probe2?.canExecute && probe2.hasBash && probe2.hasCurl;
}
function startupFailure$1(code, signal) {
  return `WSL server exited after startup (code=${code ?? "null"} signal=${signal ?? "null"})`;
}
function registerWslIpcHandlers(controller) {
  if (process.platform !== "win32") {
    registerUnavailableWslIpcHandlers();
    return;
  }
  const subscriptions = /* @__PURE__ */ new Map();
  const unsubscribe = (id) => {
    const off = subscriptions.get(id);
    if (!off) return;
    off();
    subscriptions.delete(id);
  };
  app.once("will-quit", () => {
    subscriptions.forEach((off) => off());
    subscriptions.clear();
  });
  ipcMain.handle("wsl-servers-subscribe", (event) => {
    const id = event.sender.id;
    if (subscriptions.has(id)) return;
    subscriptions.set(
      id,
      controller.subscribe((payload) => {
        if (event.sender.isDestroyed()) {
          unsubscribe(id);
          return;
        }
        event.sender.send("wsl-servers-event", payload);
      })
    );
    event.sender.once("destroyed", () => unsubscribe(id));
  });
  ipcMain.handle("wsl-servers-unsubscribe", (event) => unsubscribe(event.sender.id));
  ipcMain.handle("wsl-servers-get-state", () => controller.getState());
  ipcMain.handle("wsl-servers-probe-runtime", () => controller.probeRuntime());
  ipcMain.handle("wsl-servers-refresh-distros", () => controller.refreshDistros());
  ipcMain.handle("wsl-servers-install-wsl", () => controller.installWsl());
  ipcMain.handle(
    "wsl-servers-install-distro",
    (_event, name) => controller.installDistro(requireWslIpcString("distro", name))
  );
  ipcMain.handle(
    "wsl-servers-probe-addable",
    (_event, distros) => controller.probeAddable(requireWslIpcStrings("distro", distros))
  );
  ipcMain.handle(
    "wsl-servers-install-opencode",
    (_event, name) => controller.installOpencode(requireWslIpcString("distro", name))
  );
  ipcMain.handle(
    "wsl-servers-open-terminal",
    (_event, name) => controller.openTerminal(requireWslIpcString("distro", name))
  );
  ipcMain.handle(
    "wsl-servers-add",
    (_event, distro) => controller.addServer(requireWslIpcString("distro", distro))
  );
  ipcMain.handle(
    "wsl-servers-remove",
    (_event, id) => controller.removeServer(requireWslIpcString("server id", id))
  );
  ipcMain.handle(
    "wsl-servers-start",
    (_event, id) => controller.startServer(requireWslIpcString("server id", id))
  );
}
function registerUnavailableWslIpcHandlers() {
  const unavailable = () => {
    throw new Error("WSL is only available on Windows");
  };
  const state = () => ({
    runtime: {
      available: false,
      version: null,
      error: "WSL is only available on Windows"
    },
    installed: [],
    online: [],
    distroProbes: {},
    opencodeChecks: {},
    pendingRestart: false,
    servers: [],
    job: null
  });
  ipcMain.handle("wsl-servers-subscribe", (event) => {
    event.sender.send("wsl-servers-event", { type: "state", state: state() });
  });
  ipcMain.handle("wsl-servers-unsubscribe", () => void 0);
  ipcMain.handle("wsl-servers-get-state", () => state());
  ipcMain.handle("wsl-servers-probe-runtime", unavailable);
  ipcMain.handle("wsl-servers-refresh-distros", unavailable);
  ipcMain.handle("wsl-servers-install-wsl", unavailable);
  ipcMain.handle("wsl-servers-install-distro", unavailable);
  ipcMain.handle("wsl-servers-probe-addable", unavailable);
  ipcMain.handle("wsl-servers-install-opencode", unavailable);
  ipcMain.handle("wsl-servers-open-terminal", unavailable);
  ipcMain.handle("wsl-servers-add", unavailable);
  ipcMain.handle("wsl-servers-remove", unavailable);
  ipcMain.handle("wsl-servers-start", unavailable);
}
async function spawnWslSidecar(distro, opts = {}) {
  const opencode = await resolveWslOpencode(distro);
  if (!opencode) throw new Error(`OpenCode is not installed in ${distro}`);
  const port = await allocatePort();
  const password = randomUUID();
  const username = "opencode";
  const script = [
    "set -euo pipefail",
    'cd "$HOME" || cd /',
    `PATH=$(awk -v RS=: -v ORS=: '$0 !~ /^\\/mnt\\//' <<<"$PATH" | sed "s/:$//")`,
    "export PATH",
    "export WSLENV=",
    "export OPENCODE_EXPERIMENTAL_DISABLE_FILEWATCHER=true",
    "export OPENCODE_CLIENT=desktop",
    `export OPENCODE_SERVER_USERNAME=${shellEscape(username)}`,
    `export OPENCODE_SERVER_PASSWORD=${shellEscape(password)}`,
    'export XDG_STATE_HOME="$HOME/.local/state"',
    `exec ${shellEscape(opencode)} --print-logs --log-level ${app.isPackaged ? "WARN" : "INFO"} serve --hostname 0.0.0.0 --port ${port}`
  ].join("\n");
  const child = spawn("wsl", wslArgs(["bash", "-se"], distro), {
    stdio: ["pipe", "pipe", "pipe"],
    windowsHide: true
  });
  child.stdin.end(script);
  const recentOutput = [];
  const emit = (line) => {
    if (!line.text.trim()) return;
    recentOutput.push(`[${line.stream}] ${line.text}`);
    if (recentOutput.length > 12) recentOutput.shift();
    opts.onLine?.(line);
  };
  forwardLines(child.stdout, "stdout", emit);
  forwardLines(child.stderr, "stderr", emit);
  const exit = new Promise((_, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => reject(new Error(startupFailure(code, signal, recentOutput))));
  });
  const url = `http://127.0.0.1:${port}`;
  const startup = new AbortController();
  const health = pollWslHealth(() => checkHealth(url, password), startup.signal);
  const timeoutMs = opts.healthTimeoutMs ?? 3e4;
  let timeout;
  const timedOut = new Promise(
    (_, reject) => timeout = setTimeout(
      () => reject(new Error(`Sidecar for ${distro} health check timed out after ${timeoutMs}ms`)),
      timeoutMs
    )
  );
  await Promise.race([health, exit, timedOut]).catch((error) => {
    child.kill();
    throw error;
  }).finally(() => {
    clearTimeout(timeout);
    startup.abort();
  });
  return {
    listener: {
      stop: () => child.kill(),
      onExit: (cb) => child.once("exit", cb)
    },
    url,
    username,
    password
  };
}
function allocatePort() {
  return new Promise((resolve2, reject) => {
    const server2 = createServer();
    server2.on("error", reject);
    server2.listen(0, "127.0.0.1", () => {
      const address = server2.address();
      if (typeof address !== "object" || !address) {
        server2.close();
        reject(new Error("Failed to get port"));
        return;
      }
      server2.close(() => resolve2(address.port));
    });
  });
}
function forwardLines(stream, source, onLine) {
  let pending = "";
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    pending += chunk;
    const lines = pending.split(/\r?\n/g);
    pending = lines.pop() ?? "";
    lines.forEach((text) => onLine({ stream: source, text }));
  });
  stream.on("end", () => {
    if (pending) onLine({ stream: source, text: pending });
  });
}
function startupFailure(code, signal, recentOutput) {
  const suffix = recentOutput.length ? `
${recentOutput.join("\n")}` : "";
  return `WSL server exited before becoming healthy (code=${code ?? "null"} signal=${signal ?? "null"})${suffix}`;
}
const TAURI_MIGRATED_KEY = "tauriMigrated";
function tauriDir(id) {
  switch (process.platform) {
    case "darwin":
      return join(homedir(), "Library", "Application Support", id);
    case "win32":
      return join(process.env.APPDATA ?? join(homedir(), "AppData", "Roaming"), id);
    default:
      return join(process.env.XDG_DATA_HOME ?? join(homedir(), ".local", "share"), id);
  }
}
const TAURI_APP_IDS = {
  dev: "ai.opencode.desktop.dev",
  beta: "ai.opencode.desktop.beta",
  prod: "ai.opencode.desktop"
};
function tauriAppId() {
  return app.isPackaged ? TAURI_APP_IDS[CHANNEL] : "ai.opencode.desktop.dev";
}
function migrateFile(datPath, filename) {
  let data;
  try {
    data = JSON.parse(readFileSync(datPath, "utf-8"));
  } catch (err) {
    log.warn("tauri migration: failed to parse", filename, err);
    return;
  }
  const storeName = filename === "opencode.settings.dat" ? "opencode.settings" : filename;
  const target = getStore(storeName);
  const migrated = [];
  const skipped = [];
  for (const [key2, value] of Object.entries(data)) {
    if (target.has(key2)) {
      skipped.push(key2);
      continue;
    }
    target.set(key2, value);
    migrated.push(key2);
  }
  log.log("tauri migration: migrated", filename, "→", storeName, { migrated, skipped });
}
function migrate() {
  if (getStore().get(TAURI_MIGRATED_KEY)) {
    log.log("tauri migration: already done, skipping");
    return;
  }
  const dir = tauriDir(tauriAppId());
  log.log("tauri migration: starting", { dir });
  if (!existsSync(dir)) {
    log.log("tauri migration: no tauri data directory found, nothing to migrate");
    getStore().set(TAURI_MIGRATED_KEY, true);
    return;
  }
  for (const filename of readdirSync(dir)) {
    if (!filename.endsWith(".dat")) continue;
    migrateFile(join(dir, filename), filename);
  }
  log.log("tauri migration: complete");
  getStore().set(TAURI_MIGRATED_KEY, true);
}
const APP_NAMES = {
  dev: "OpenCode Dev",
  beta: "OpenCode Beta",
  prod: "OpenCode"
};
const APP_IDS = {
  dev: "ai.opencode.desktop.dev",
  beta: "ai.opencode.desktop.beta",
  prod: "ai.opencode.desktop"
};
const TEST_ONBOARDING = process.env.OPENCODE_TEST_ONBOARDING === "1";
const jsCallStackFeature = "DocumentPolicyIncludeJSCallStacksInCrashReports";
let logger;
let server = null;
const pendingDeepLinks = [];
function useEnvProxy() {
  try {
    ;
    http.setGlobalProxyFromEnv();
  } catch (error) {
    logger.warn("failed to load proxy environment", error);
  }
}
function emitDeepLinks(urls) {
  if (urls.length === 0) return;
  pendingDeepLinks.push(...urls);
  const win = getLastFocusedWindow();
  if (win) sendDeepLinks(win, urls);
}
async function killSidecar() {
  if (!server) return;
  const current = server;
  server = null;
  await current.stop();
}
function ensureLoopbackNoProxy() {
  const loopback = ["127.0.0.1", "localhost", "::1"];
  const upsert = (key2) => {
    const items = (process.env[key2] ?? "").split(",").map((value) => value.trim()).filter((value) => Boolean(value));
    for (const host of loopback) {
      if (items.some((value) => value.toLowerCase() === host)) continue;
      items.push(host);
    }
    process.env[key2] = items.join(",");
  };
  upsert("NO_PROXY");
  upsert("no_proxy");
}
const main = Effect.gen(function* () {
  contextMenu({ showSaveImageAs: true, showLookUpSelection: false, showSearchWithGoogle: false });
  try {
    process.chdir(homedir());
  } catch {
  }
  process.env.OPENCODE_DISABLE_EMBEDDED_WEB_UI = "true";
  const appId = app.isPackaged ? APP_IDS[CHANNEL] : "ai.opencode.desktop.dev";
  const onboardingTestRoot = (() => {
    if (!TEST_ONBOARDING) return;
    const root2 = join(tmpdir(), `opencode-onboarding-${randomUUID()}`);
    rmSync(root2, { recursive: true, force: true });
    ["data", "config", "cache", "state", "desktop", "session"].forEach(
      (dir) => mkdirSync(join(root2, dir), { recursive: true })
    );
    process.env.OPENCODE_DB = ":memory:";
    process.env.XDG_DATA_HOME = join(root2, "data");
    process.env.XDG_CONFIG_HOME = join(root2, "config");
    process.env.XDG_CACHE_HOME = join(root2, "cache");
    process.env.XDG_STATE_HOME = join(root2, "state");
    return root2;
  })();
  app.setName(app.isPackaged ? APP_NAMES[CHANNEL] : "OpenCode Dev");
  app.setAppUserModelId(appId);
  app.setPath(
    "userData",
    onboardingTestRoot ? join(onboardingTestRoot, "desktop") : join(app.getPath("appData"), appId)
  );
  if (onboardingTestRoot) app.setPath("sessionData", join(onboardingTestRoot, "session"));
  logger = initLogging();
  initCrashReporter();
  const wslServers = createWslServersController(
    app.getVersion(),
    async (distro) => {
      logger.log("spawning wsl sidecar", { distro });
      return spawnWslSidecar(distro, {
        onLine: (line) => logger.log("wsl sidecar", { distro, stream: line.stream, text: line.text })
      });
    },
    {
      logger: {
        log: (message, meta) => logger.log(message, meta),
        error: (message, meta) => logger.error(message, meta)
      }
    }
  );
  const stopSidecars = async () => {
    await killSidecar();
    wslServers.stopAll();
  };
  const relaunch = () => {
    void stopSidecars().finally(() => {
      app.relaunch();
      app.exit(0);
    });
  };
  try {
    setDefaultCACertificates([.../* @__PURE__ */ new Set([...getCACertificates("default"), ...getCACertificates("system")])]);
  } catch (error) {
    logger.warn("failed to load system certificates", error);
  }
  logger.log("app starting", {
    version: app.getVersion(),
    packaged: app.isPackaged,
    onboardingTest: Boolean(onboardingTestRoot)
  });
  ensureLoopbackNoProxy();
  useEnvProxy();
  app.commandLine.appendSwitch("proxy-bypass-list", "<-loopback>");
  const features = app.commandLine.getSwitchValue("enable-features");
  app.commandLine.appendSwitch("enable-features", features ? `${jsCallStackFeature},${features}` : jsCallStackFeature);
  if (!app.isPackaged) app.commandLine.appendSwitch("remote-debugging-port", "9222");
  if (!app.requestSingleInstanceLock()) {
    app.quit();
    return;
  }
  preferAppEnv(app.getPath("userData"));
  app.on("second-instance", (_event, argv) => {
    const urls = argv.filter((arg) => arg.startsWith("opencode://"));
    if (urls.length) {
      logger.log("deep link received via second-instance", { urls });
      emitDeepLinks(urls);
    }
    const win = getLastFocusedWindow();
    if (win) {
      win.show();
      win.focus();
    }
  });
  app.on("open-url", (event, url2) => {
    event.preventDefault();
    logger.log("deep link received via open-url", { url: url2 });
    emitDeepLinks([url2]);
  });
  app.on("before-quit", () => {
    setAppQuitting();
    void stopSidecars();
  });
  app.on("will-quit", () => {
    setAppQuitting();
    void stopSidecars();
  });
  app.on("child-process-gone", (_event, details) => {
    write("utility", "child process gone", { details }, "error");
  });
  app.on("render-process-gone", (_event, webContents, details) => {
    write("window", "app render process gone", { url: webContents.getURL(), details }, "error");
  });
  setRelaunchHandler(() => {
    relaunch();
  });
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      void stopSidecars().finally(() => app.exit(0));
    });
  }
  const serverReady = Deferred.makeUnsafe();
  yield* Effect.promise(() => app.whenReady());
  if (!TEST_ONBOARDING) migrate();
  yield* Effect.promise(() => cleanupStoreFiles(app.getPath("userData"))).pipe(
    Effect.tap(
      (result) => Effect.sync(() => {
        if (result.deleted.length === 0) return;
        logger.log("cleaned scoped store files", { count: result.deleted.length, scanned: result.scanned });
      })
    ),
    Effect.catch(
      (error) => Effect.sync(() => {
        logger.warn("failed to clean scoped store files", error);
      })
    )
  );
  app.setAsDefaultProtocolClient("opencode");
  registerRendererProtocol();
  setDockIcon();
  const updater = setupAutoUpdater(stopSidecars);
  registerIpcHandlers({
    killSidecar: () => killSidecar(),
    relaunch,
    awaitInitialization: Effect.fnUntraced(
      function* () {
        logger.log("awaiting server ready");
        const res = yield* Deferred.await(serverReady);
        logger.log("server ready", { url: res.url });
        return res;
      },
      (e) => Effect.runPromise(e)
    ),
    consumeInitialDeepLinks: () => pendingDeepLinks.splice(0),
    getDefaultServerUrl: () => getDefaultServerUrl(),
    setDefaultServerUrl: (url2) => setDefaultServerUrl(url2),
    getDisplayBackend: async () => null,
    setDisplayBackend: async () => void 0,
    parseMarkdown: async (markdown) => parseMarkdown(markdown),
    checkAppExists: (appName) => checkAppExists(appName),
    resolveAppPath: async (appName) => resolveAppPath(appName),
    updater,
    showUpdater: () => showUpdaterDialog(updater),
    setBackgroundColor: (color) => setBackgroundColor(color),
    exportDebugLogs: () => exportDebugLogs(),
    recordFatalRendererError: (error) => write("renderer", "fatal renderer error", { ...error }, "error")
  });
  registerWslIpcHandlers(wslServers);
  void updater.start();
  const updateTimer = setInterval(() => void updater.check(), 10 * 60 * 1e3);
  updateTimer.unref();
  app.once("will-quit", () => clearInterval(updateTimer));
  yield* Effect.promise(() => startNetLog()).pipe(
    Effect.catch(
      (error) => Effect.sync(() => {
        logger.warn("failed to start net log", error);
      })
    )
  );
  const port = yield* Effect.gen(function* () {
    const fromEnv = process.env.OPENCODE_PORT;
    if (fromEnv) {
      const parsed = Number.parseInt(fromEnv, 10);
      if (!Number.isNaN(parsed)) return parsed;
    }
    const res = yield* Deferred.make();
    const server2 = createServer();
    server2.on("error", (e) => Deferred.failSync(res, () => e));
    server2.listen(0, "127.0.0.1", () => {
      const address = server2.address();
      if (typeof address !== "object" || !address) {
        server2.close();
        Deferred.failSync(res, () => new Error("Failed to get port"));
        return;
      }
      const port2 = address.port;
      server2.close(() => Effect.runSync(Deferred.succeed(res, port2)));
    });
    return yield* Deferred.await(res);
  });
  const hostname = "127.0.0.1";
  const url = `http://${hostname}:${port}`;
  const password = randomUUID();
  const loadingTask = yield* Effect.gen(function* () {
    logger.log("sidecar connection started", { url });
    ensureLoopbackNoProxy();
    useEnvProxy();
    logger.log("spawning sidecar", { url });
    const { listener, health } = yield* Effect.promise(
      () => spawnLocalServer(hostname, port, password, {
        userDataPath: app.getPath("userData"),
        onStdout: (message) => write("server", "stdout", { message }),
        onStderr: (message) => write("server", "stderr", { message }, "warn"),
        onExit: (code) => write("utility", "sidecar exited", { code }, "warn")
      })
    );
    server = listener;
    yield* Deferred.succeed(serverReady, {
      url,
      username: "opencode",
      password
    });
    if (process.platform === "win32") {
      void wslServers.initialize().catch((error) => logger.error("wsl server initialization failed", error));
    }
    yield* Effect.promise(() => health.wait).pipe(
      Effect.timeout("30 seconds"),
      Effect.catch(
        (e) => Effect.sync(() => {
          logger.error("sidecar health check failed", e.toString());
        })
      )
    );
    logger.log("loading task finished");
  }).pipe(forwardInitializationFailure(serverReady), Effect.forkChild);
  yield* Fiber.await(loadingTask);
  const windows = restoreMainWindows();
  if (windows.length) {
    createMenu({
      trigger: (id) => {
        const win = getLastFocusedWindow();
        if (win) sendMenuCommand(win, id);
      },
      checkForUpdates: () => {
        void showUpdaterDialog(updater);
      },
      relaunch: () => {
        relaunch();
      }
    });
  }
});
Effect.runFork(main);
