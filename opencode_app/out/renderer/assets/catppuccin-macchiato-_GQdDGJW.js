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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "c9fc9698-a86e-43ac-92ec-f1d0eeef65bc", e._sentryDebugIdIdentifier = "sentry-dbid-c9fc9698-a86e-43ac-92ec-f1d0eeef65bc");
    })();
  } catch (e) {
  }
}
;
const $schema = "https://opencode.ai/desktop-theme.json";
const name = "Catppuccin Macchiato";
const id = "catppuccin-macchiato";
const light = { "palette": { "neutral": "#24273a", "ink": "#cad3f5", "primary": "#8aadf4", "accent": "#f5bde6", "success": "#a6da95", "warning": "#eed49f", "error": "#ed8796", "info": "#8bd5ca" }, "overrides": { "text-weak": "#b8c0e0", "syntax-comment": "#939ab7", "syntax-keyword": "#c6a0f6", "syntax-string": "#a6da95", "syntax-primitive": "#8aadf4", "syntax-variable": "#ed8796", "syntax-property": "#91d7e3", "syntax-type": "#eed49f", "syntax-constant": "#f5a97f", "syntax-operator": "#91d7e3", "syntax-punctuation": "#cad3f5", "syntax-object": "#ed8796", "markdown-heading": "#c6a0f6", "markdown-text": "#cad3f5", "markdown-link": "#8aadf4", "markdown-link-text": "#91d7e3", "markdown-code": "#a6da95", "markdown-block-quote": "#eed49f", "markdown-emph": "#eed49f", "markdown-strong": "#f5a97f", "markdown-horizontal-rule": "#a5adcb", "markdown-list-item": "#8aadf4", "markdown-list-enumeration": "#91d7e3", "markdown-image": "#8aadf4", "markdown-image-text": "#91d7e3", "markdown-code-block": "#cad3f5" } };
const dark = { "palette": { "neutral": "#24273a", "ink": "#cad3f5", "primary": "#8aadf4", "accent": "#f5bde6", "success": "#a6da95", "warning": "#eed49f", "error": "#ed8796", "info": "#8bd5ca" }, "overrides": { "text-weak": "#b8c0e0", "syntax-comment": "#939ab7", "syntax-keyword": "#c6a0f6", "syntax-string": "#a6da95", "syntax-primitive": "#8aadf4", "syntax-variable": "#ed8796", "syntax-property": "#91d7e3", "syntax-type": "#eed49f", "syntax-constant": "#f5a97f", "syntax-operator": "#91d7e3", "syntax-punctuation": "#cad3f5", "syntax-object": "#ed8796", "markdown-heading": "#c6a0f6", "markdown-text": "#cad3f5", "markdown-link": "#8aadf4", "markdown-link-text": "#91d7e3", "markdown-code": "#a6da95", "markdown-block-quote": "#eed49f", "markdown-emph": "#eed49f", "markdown-strong": "#f5a97f", "markdown-horizontal-rule": "#a5adcb", "markdown-list-item": "#8aadf4", "markdown-list-enumeration": "#91d7e3", "markdown-image": "#8aadf4", "markdown-image-text": "#91d7e3", "markdown-code-block": "#cad3f5" } };
const catppuccinMacchiato = {
  $schema,
  name,
  id,
  light,
  dark
};
export {
  $schema,
  dark,
  catppuccinMacchiato as default,
  id,
  light,
  name
};
//# sourceMappingURL=catppuccin-macchiato-_GQdDGJW.js.map
