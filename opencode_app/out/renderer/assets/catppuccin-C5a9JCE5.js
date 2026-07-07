!(function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : {};
    e.SENTRY_RELEASE = { id: "desktop@1.17.13" };
  } catch (e2) {
  }
})();
;
{
  try {
    (function() {
      var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : {}, n = new e.Error().stack;
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "f2a89bb9-9098-4477-9fa3-44a7da4c741f", e._sentryDebugIdIdentifier = "sentry-dbid-f2a89bb9-9098-4477-9fa3-44a7da4c741f");
    })();
  } catch (e) {
  }
}
;
const $schema = "https://opencode.ai/desktop-theme.json";
const name = "Catppuccin";
const id = "catppuccin";
const light = { "palette": { "neutral": "#f5e0dc", "ink": "#4c4f69", "primary": "#7287fd", "accent": "#d20f39", "success": "#40a02b", "warning": "#df8e1d", "error": "#d20f39", "info": "#04a5e5", "diffAdd": "#a6d189", "diffDelete": "#e78284" }, "overrides": { "syntax-comment": "#6c7086", "syntax-keyword": "#8839ef", "syntax-primitive": "#1e66f5", "syntax-constant": "#ca6702" } };
const dark = { "palette": { "neutral": "#1e1e2e", "ink": "#cdd6f4", "primary": "#b4befe", "accent": "#f38ba8", "success": "#a6d189", "warning": "#f4b8e4", "error": "#f38ba8", "info": "#89dceb", "diffAdd": "#94e2d5", "diffDelete": "#f38ba8" }, "overrides": { "syntax-comment": "#6c7086", "syntax-keyword": "#cba6f7", "syntax-primitive": "#89b4fa", "syntax-constant": "#fab387" } };
const catppuccin = {
  $schema,
  name,
  id,
  light,
  dark
};
export {
  $schema,
  dark,
  catppuccin as default,
  id,
  light,
  name
};
//# sourceMappingURL=catppuccin-C5a9JCE5.js.map
