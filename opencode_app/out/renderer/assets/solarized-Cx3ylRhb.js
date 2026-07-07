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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "dd427878-e52e-4d7f-9137-cce0d1ff29e6", e._sentryDebugIdIdentifier = "sentry-dbid-dd427878-e52e-4d7f-9137-cce0d1ff29e6");
    })();
  } catch (e) {
  }
}
;
const $schema = "https://opencode.ai/desktop-theme.json";
const name = "Solarized";
const id = "solarized";
const light = { "palette": { "neutral": "#fdf6e3", "ink": "#586e75", "primary": "#268bd2", "accent": "#d33682", "success": "#859900", "warning": "#b58900", "error": "#dc322f", "info": "#2aa198", "diffAdd": "#c6dc7a", "diffDelete": "#f2a1a1" }, "overrides": { "syntax-comment": "#657b83", "syntax-keyword": "#728600", "syntax-string": "#1f8f88", "syntax-primitive": "#268bd2", "syntax-property": "#268bd2", "syntax-constant": "#d33682" } };
const dark = { "palette": { "neutral": "#002b36", "ink": "#93a1a1", "primary": "#6c71c4", "accent": "#d33682", "success": "#859900", "warning": "#b58900", "error": "#dc322f", "info": "#2aa198", "diffAdd": "#4c7654", "diffDelete": "#c34b4b" }, "overrides": { "syntax-comment": "#586e75", "syntax-keyword": "#859900", "syntax-string": "#2aa198", "syntax-primitive": "#268bd2", "syntax-property": "#268bd2", "syntax-constant": "#d33682" } };
const solarized = {
  $schema,
  name,
  id,
  light,
  dark
};
export {
  $schema,
  dark,
  solarized as default,
  id,
  light,
  name
};
//# sourceMappingURL=solarized-Cx3ylRhb.js.map
