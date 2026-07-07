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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "4133eb97-55d8-41e4-9e83-65ca72eb4a43", e._sentryDebugIdIdentifier = "sentry-dbid-4133eb97-55d8-41e4-9e83-65ca72eb4a43");
    })();
  } catch (e) {
  }
}
;
const $schema = "https://opencode.ai/desktop-theme.json";
const name = "Nord";
const id = "nord";
const light = { "palette": { "neutral": "#eceff4", "ink": "#2e3440", "primary": "#5e81ac", "accent": "#bf616a", "success": "#8fbcbb", "warning": "#d08770", "error": "#bf616a", "info": "#81a1c1", "diffAdd": "#a3be8c", "diffDelete": "#bf616a" }, "overrides": { "syntax-comment": "#6b7282", "syntax-keyword": "#5e81ac", "syntax-string": "#6f8758", "syntax-primitive": "#5e81ac", "syntax-constant": "#8d6886" } };
const dark = { "palette": { "neutral": "#2e3440", "ink": "#e5e9f0", "primary": "#88c0d0", "accent": "#d57780", "success": "#a3be8c", "warning": "#d08770", "error": "#bf616a", "info": "#81a1c1", "diffAdd": "#81a1c1", "diffDelete": "#bf616a" }, "overrides": { "syntax-comment": "#616e88", "syntax-keyword": "#81a1c1", "syntax-primitive": "#88c0d0", "syntax-constant": "#b48ead" } };
const nord = {
  $schema,
  name,
  id,
  light,
  dark
};
export {
  $schema,
  dark,
  nord as default,
  id,
  light,
  name
};
//# sourceMappingURL=nord-D9Z6qRMm.js.map
