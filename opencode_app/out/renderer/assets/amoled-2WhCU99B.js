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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "1672874a-ebf8-4423-92f2-883c45b61a1d", e._sentryDebugIdIdentifier = "sentry-dbid-1672874a-ebf8-4423-92f2-883c45b61a1d");
    })();
  } catch (e) {
  }
}
;
const $schema = "https://opencode.ai/desktop-theme.json";
const name = "AMOLED";
const id = "amoled";
const light = { "palette": { "neutral": "#f0f0f0", "ink": "#0a0a0a", "primary": "#6200ff", "accent": "#ff0080", "success": "#00e676", "warning": "#ffab00", "error": "#ff1744", "info": "#00b0ff", "diffAdd": "#00e676", "diffDelete": "#ff1744" }, "overrides": { "syntax-comment": "#757575", "syntax-keyword": "#d500f9", "syntax-string": "#00e676", "syntax-primitive": "#00b0ff", "syntax-property": "#ff9100", "syntax-constant": "#6200ff" } };
const dark = { "palette": { "neutral": "#000000", "ink": "#ffffff", "primary": "#b388ff", "accent": "#ff4081", "success": "#00ff88", "warning": "#ffea00", "error": "#ff1744", "info": "#18ffff", "diffAdd": "#00ff88", "diffDelete": "#ff1744" }, "overrides": { "syntax-comment": "#555555", "syntax-keyword": "#ff00ff", "syntax-string": "#00ff88", "syntax-primitive": "#18ffff", "syntax-property": "#ffea00", "syntax-constant": "#b388ff" } };
const amoled = {
  $schema,
  name,
  id,
  light,
  dark
};
export {
  $schema,
  dark,
  amoled as default,
  id,
  light,
  name
};
//# sourceMappingURL=amoled-2WhCU99B.js.map
