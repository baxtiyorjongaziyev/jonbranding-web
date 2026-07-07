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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "73add10f-d018-43d2-8a7e-1f0cf4b18b38", e._sentryDebugIdIdentifier = "sentry-dbid-73add10f-d018-43d2-8a7e-1f0cf4b18b38");
    })();
  } catch (e) {
  }
}
;
const $schema = "https://opencode.ai/desktop-theme.json";
const name = "Dracula";
const id = "dracula";
const light = { "palette": { "neutral": "#f8f8f2", "ink": "#1f1f2f", "primary": "#7c6bf5", "accent": "#d16090", "success": "#2fbf71", "warning": "#f7a14d", "error": "#d9536f", "info": "#1d7fc5", "diffAdd": "#9fe3b3", "diffDelete": "#f8a1b8" }, "overrides": { "syntax-comment": "#7d7f97", "syntax-keyword": "#d16090", "syntax-string": "#596600", "syntax-primitive": "#2f8f57", "syntax-property": "#1d7fc5", "syntax-constant": "#7c6bf5" } };
const dark = { "palette": { "neutral": "#1d1e28", "ink": "#f8f8f2", "primary": "#bd93f9", "accent": "#ff79c6", "success": "#50fa7b", "warning": "#ffb86c", "error": "#ff5555", "info": "#8be9fd", "diffAdd": "#2fb27d", "diffDelete": "#ff6b81" }, "overrides": { "syntax-comment": "#6272a4", "syntax-keyword": "#ff79c6", "syntax-string": "#f1fa8c", "syntax-primitive": "#50fa7b", "syntax-property": "#8be9fd", "syntax-constant": "#bd93f9" } };
const dracula = {
  $schema,
  name,
  id,
  light,
  dark
};
export {
  $schema,
  dark,
  dracula as default,
  id,
  light,
  name
};
//# sourceMappingURL=dracula-BNCypNQT.js.map
