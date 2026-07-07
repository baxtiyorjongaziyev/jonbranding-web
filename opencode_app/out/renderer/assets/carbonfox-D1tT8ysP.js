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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "2894f044-7b4e-4c89-a044-f86e0658398a", e._sentryDebugIdIdentifier = "sentry-dbid-2894f044-7b4e-4c89-a044-f86e0658398a");
    })();
  } catch (e) {
  }
}
;
const $schema = "https://opencode.ai/desktop-theme.json";
const name = "Carbonfox";
const id = "carbonfox";
const light = { "palette": { "neutral": "#8e8e8e", "ink": "#161616", "primary": "#0072c3", "accent": "#da1e28", "success": "#198038", "warning": "#f1c21b", "error": "#da1e28", "info": "#0043ce", "interactive": "#0f62fe", "diffAdd": "#198038", "diffDelete": "#da1e28" }, "overrides": { "syntax-comment": "#6f6f6f", "syntax-keyword": "#8a3ffc", "syntax-string": "#198038", "syntax-primitive": "#0f62fe", "syntax-property": "#0043ce", "syntax-type": "#8a5f00", "syntax-constant": "#da1e28" } };
const dark = { "palette": { "neutral": "#393939", "ink": "#f2f4f8", "primary": "#33b1ff", "accent": "#ff8389", "success": "#42be65", "warning": "#f1c21b", "error": "#ff8389", "info": "#78a9ff", "interactive": "#4589ff", "diffAdd": "#42be65", "diffDelete": "#ff8389" }, "overrides": { "syntax-comment": "#6f6f6f", "syntax-keyword": "#be95ff", "syntax-string": "#42be65", "syntax-primitive": "#33b1ff", "syntax-property": "#78a9ff", "syntax-type": "#f1c21b", "syntax-constant": "#ff8389" } };
const carbonfox = {
  $schema,
  name,
  id,
  light,
  dark
};
export {
  $schema,
  dark,
  carbonfox as default,
  id,
  light,
  name
};
//# sourceMappingURL=carbonfox-D1tT8ysP.js.map
