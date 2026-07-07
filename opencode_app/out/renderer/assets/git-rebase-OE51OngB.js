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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "e9affeed-4f32-4f00-8b5a-c1212c71ece2", e._sentryDebugIdIdentifier = "sentry-dbid-e9affeed-4f32-4f00-8b5a-c1212c71ece2");
    })();
  } catch (e) {
  }
}
;
import shellscript from "./shellscript-Cg3AHEjA.js";
const lang = Object.freeze(JSON.parse('{"displayName":"Git Rebase Message","name":"git-rebase","patterns":[{"captures":{"1":{"name":"punctuation.definition.comment.git-rebase"}},"match":"^\\\\s*(#).*$\\\\n?","name":"comment.line.number-sign.git-rebase"},{"captures":{"1":{"name":"support.function.git-rebase"},"2":{"name":"constant.sha.git-rebase"},"3":{"name":"meta.commit-message.git-rebase"}},"match":"^\\\\s*(pick|p|reword|r|edit|e|squash|s|fixup|f|drop|d)\\\\s+([0-9a-f]+)\\\\s+(.*)$","name":"meta.commit-command.git-rebase"},{"captures":{"1":{"name":"support.function.git-rebase"},"2":{"patterns":[{"include":"source.shell"}]}},"match":"^\\\\s*(exec|x)\\\\s+(.*)$","name":"meta.commit-command.git-rebase"},{"captures":{"1":{"name":"support.function.git-rebase"}},"match":"^\\\\s*(b(?:reak|))\\\\s*$","name":"meta.commit-command.git-rebase"}],"scopeName":"text.git-rebase","embeddedLangs":["shellscript"]}'));
const gitRebase = [
  ...shellscript,
  lang
];
export {
  gitRebase as default
};
//# sourceMappingURL=git-rebase-OE51OngB.js.map
