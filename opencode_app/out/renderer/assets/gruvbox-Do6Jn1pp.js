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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "d887ede5-3043-4054-b4bb-f5aa68aa2f62", e._sentryDebugIdIdentifier = "sentry-dbid-d887ede5-3043-4054-b4bb-f5aa68aa2f62");
    })();
  } catch (e) {
  }
}
;
const $schema = "https://opencode.ai/desktop-theme.json";
const name = "Gruvbox";
const id = "gruvbox";
const light = { "palette": { "neutral": "#fbf1c7", "ink": "#3c3836", "primary": "#076678", "accent": "#9d0006", "success": "#79740e", "warning": "#b57614", "error": "#9d0006", "info": "#8f3f71", "diffAdd": "#79740e", "diffDelete": "#9d0006" }, "overrides": { "syntax-comment": "#928374", "syntax-keyword": "#9d0006", "syntax-primitive": "#076678", "syntax-constant": "#8f3f71" } };
const dark = { "palette": { "neutral": "#282828", "ink": "#ebdbb2", "primary": "#83a598", "accent": "#fb4934", "success": "#b8bb26", "warning": "#fabd2f", "error": "#fb4934", "info": "#d3869b", "diffAdd": "#b8bb26", "diffDelete": "#fb4934" }, "overrides": { "syntax-comment": "#928374", "syntax-keyword": "#fb4934", "syntax-primitive": "#83a598", "syntax-constant": "#d3869b" } };
const gruvbox = {
  $schema,
  name,
  id,
  light,
  dark
};
export {
  $schema,
  dark,
  gruvbox as default,
  id,
  light,
  name
};
//# sourceMappingURL=gruvbox-Do6Jn1pp.js.map
