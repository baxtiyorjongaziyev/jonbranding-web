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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "0cfa5f14-a69f-4970-8428-0cb093715687", e._sentryDebugIdIdentifier = "sentry-dbid-0cfa5f14-a69f-4970-8428-0cb093715687");
    })();
  } catch (e) {
  }
}
;
const $schema = "https://opencode.ai/desktop-theme.json";
const name = "Shades of Purple";
const id = "shadesofpurple";
const light = { "palette": { "neutral": "#f7ebff", "ink": "#3b2c59", "primary": "#7a5af8", "accent": "#ff6bd5", "success": "#3dd598", "warning": "#f7c948", "error": "#ff6bd5", "info": "#62d4ff", "diffAdd": "#c8f8da", "diffDelete": "#ffc3ef" }, "overrides": { "syntax-comment": "#8e4be3", "syntax-keyword": "#c45f00", "syntax-string": "#2f8b32", "syntax-primitive": "#a13bd6", "syntax-property": "#008fb8", "syntax-type": "#9d7a00", "syntax-constant": "#e04d7a" } };
const dark = { "palette": { "neutral": "#1a102b", "ink": "#f5f0ff", "primary": "#c792ff", "accent": "#ff7ac6", "success": "#7be0b0", "warning": "#ffd580", "error": "#ff7ac6", "info": "#7dd4ff", "diffAdd": "#53c39f", "diffDelete": "#d85aa0" }, "overrides": { "syntax-comment": "#b362ff", "syntax-keyword": "#ff9d00", "syntax-string": "#a5ff90", "syntax-primitive": "#fb94ff", "syntax-property": "#9effff", "syntax-type": "#fad000", "syntax-constant": "#ff628c" } };
const shadesofpurple = {
  $schema,
  name,
  id,
  light,
  dark
};
export {
  $schema,
  dark,
  shadesofpurple as default,
  id,
  light,
  name
};
//# sourceMappingURL=shadesofpurple-BXurR7Iv.js.map
