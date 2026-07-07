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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "83fe63e4-a135-4763-a936-49a3d6618c03", e._sentryDebugIdIdentifier = "sentry-dbid-83fe63e4-a135-4763-a936-49a3d6618c03");
    })();
  } catch (e) {
  }
}
;
const $schema = "https://opencode.ai/desktop-theme.json";
const name = "Everforest";
const id = "everforest";
const light = { "palette": { "neutral": "#fdf6e3", "ink": "#5c6a72", "primary": "#8da101", "accent": "#df69ba", "success": "#8da101", "warning": "#f57d26", "error": "#f85552", "info": "#35a77c", "diffAdd": "#4db380", "diffDelete": "#f52a65" }, "overrides": { "text-weak": "#a6b0a0", "syntax-comment": "#a6b0a0", "syntax-keyword": "#df69ba", "syntax-string": "#8da101", "syntax-primitive": "#8da101", "syntax-variable": "#f85552", "syntax-property": "#35a77c", "syntax-type": "#dfa000", "syntax-constant": "#f57d26", "syntax-operator": "#35a77c", "syntax-punctuation": "#5c6a72", "syntax-object": "#f85552", "markdown-heading": "#df69ba", "markdown-text": "#5c6a72", "markdown-link": "#8da101", "markdown-link-text": "#35a77c", "markdown-code": "#8da101", "markdown-block-quote": "#dfa000", "markdown-emph": "#dfa000", "markdown-strong": "#f57d26", "markdown-horizontal-rule": "#a6b0a0", "markdown-list-item": "#8da101", "markdown-list-enumeration": "#35a77c", "markdown-image": "#8da101", "markdown-image-text": "#35a77c", "markdown-code-block": "#5c6a72" } };
const dark = { "palette": { "neutral": "#2d353b", "ink": "#d3c6aa", "primary": "#a7c080", "accent": "#d699b6", "success": "#a7c080", "warning": "#e69875", "error": "#e67e80", "info": "#83c092", "diffAdd": "#b8db87", "diffDelete": "#e26a75" }, "overrides": { "text-weak": "#7a8478", "syntax-comment": "#7a8478", "syntax-keyword": "#d699b6", "syntax-string": "#a7c080", "syntax-primitive": "#a7c080", "syntax-variable": "#e67e80", "syntax-property": "#83c092", "syntax-type": "#dbbc7f", "syntax-constant": "#e69875", "syntax-operator": "#83c092", "syntax-punctuation": "#d3c6aa", "syntax-object": "#e67e80", "markdown-heading": "#d699b6", "markdown-text": "#d3c6aa", "markdown-link": "#a7c080", "markdown-link-text": "#83c092", "markdown-code": "#a7c080", "markdown-block-quote": "#dbbc7f", "markdown-emph": "#dbbc7f", "markdown-strong": "#e69875", "markdown-horizontal-rule": "#7a8478", "markdown-list-item": "#a7c080", "markdown-list-enumeration": "#83c092", "markdown-image": "#a7c080", "markdown-image-text": "#83c092", "markdown-code-block": "#d3c6aa" } };
const everforest = {
  $schema,
  name,
  id,
  light,
  dark
};
export {
  $schema,
  dark,
  everforest as default,
  id,
  light,
  name
};
//# sourceMappingURL=everforest-DuxQ1GWd.js.map
