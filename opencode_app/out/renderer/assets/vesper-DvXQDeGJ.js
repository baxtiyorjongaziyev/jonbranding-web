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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "1fe5dbf1-776e-4f75-8e98-1cad951593f4", e._sentryDebugIdIdentifier = "sentry-dbid-1fe5dbf1-776e-4f75-8e98-1cad951593f4");
    })();
  } catch (e) {
  }
}
;
const $schema = "https://opencode.ai/desktop-theme.json";
const name = "Vesper";
const id = "vesper";
const light = { "palette": { "neutral": "#F0F0F0", "ink": "#101010", "primary": "#FFC799", "accent": "#B30000", "success": "#99FFE4", "warning": "#FFC799", "error": "#FF8080", "info": "#FFC799", "diffAdd": "#99FFE4", "diffDelete": "#FF8080" }, "overrides": { "syntax-comment": "#7a7a7a", "syntax-keyword": "#6e6e6e", "syntax-string": "#117e69", "syntax-primitive": "#8d541c", "syntax-property": "#101010", "syntax-type": "#8d541c", "syntax-constant": "#8d541c" } };
const dark = { "palette": { "neutral": "#101010", "ink": "#FFF", "primary": "#FFC799", "accent": "#FF8080", "success": "#99FFE4", "warning": "#FFC799", "error": "#FF8080", "info": "#FFC799", "diffAdd": "#99FFE4", "diffDelete": "#FF8080" }, "overrides": { "syntax-comment": "#8b8b8b", "syntax-keyword": "#a0a0a0", "syntax-string": "#99ffe4", "syntax-primitive": "#ffc799", "syntax-property": "#ffffff", "syntax-type": "#ffc799", "syntax-constant": "#ffc799" } };
const vesper = {
  $schema,
  name,
  id,
  light,
  dark
};
export {
  $schema,
  dark,
  vesper as default,
  id,
  light,
  name
};
//# sourceMappingURL=vesper-DvXQDeGJ.js.map
