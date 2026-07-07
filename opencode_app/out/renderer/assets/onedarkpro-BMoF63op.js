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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "29d47df5-959a-4f67-ae64-c8bcb214a4ba", e._sentryDebugIdIdentifier = "sentry-dbid-29d47df5-959a-4f67-ae64-c8bcb214a4ba");
    })();
  } catch (e) {
  }
}
;
const $schema = "https://opencode.ai/desktop-theme.json";
const name = "One Dark Pro";
const id = "onedarkpro";
const light = { "palette": { "neutral": "#f5f6f8", "ink": "#2b303b", "primary": "#528bff", "accent": "#d85462", "success": "#4fa66d", "warning": "#d19a66", "error": "#e06c75", "info": "#61afef", "diffAdd": "#c2ebcf", "diffDelete": "#f7c1c5" }, "overrides": { "syntax-comment": "#6a717d", "syntax-keyword": "#a626a4", "syntax-primitive": "#4078f2", "syntax-constant": "#986801" } };
const dark = { "palette": { "neutral": "#1e222a", "ink": "#abb2bf", "primary": "#61afef", "accent": "#e06c75", "success": "#98c379", "warning": "#e5c07b", "error": "#e06c75", "info": "#56b6c2", "diffAdd": "#4b815a", "diffDelete": "#b2555f" }, "overrides": { "syntax-comment": "#5c6370", "syntax-keyword": "#c678dd", "syntax-primitive": "#61afef", "syntax-constant": "#d19a66" } };
const onedarkpro = {
  $schema,
  name,
  id,
  light,
  dark
};
export {
  $schema,
  dark,
  onedarkpro as default,
  id,
  light,
  name
};
//# sourceMappingURL=onedarkpro-BMoF63op.js.map
