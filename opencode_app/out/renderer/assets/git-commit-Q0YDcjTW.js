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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "bf2423a8-ab59-4f27-85ad-6c84f3f15607", e._sentryDebugIdIdentifier = "sentry-dbid-bf2423a8-ab59-4f27-85ad-6c84f3f15607");
    })();
  } catch (e) {
  }
}
;
import diff from "./diff-DVZBL-8O.js";
const lang = Object.freeze(JSON.parse('{"displayName":"Git Commit Message","name":"git-commit","patterns":[{"begin":"(?=^diff --git)","contentName":"source.diff","end":"\\\\z","name":"meta.embedded.diff.git-commit","patterns":[{"include":"source.diff"}]},{"begin":"^(?!#)","end":"^(?=#)","name":"meta.scope.message.git-commit","patterns":[{"captures":{"1":{"name":"invalid.deprecated.line-too-long.git-commit"},"2":{"name":"invalid.illegal.line-too-long.git-commit"}},"match":"\\\\G.{0,50}(.{0,22}(.*))$","name":"meta.scope.subject.git-commit"}]},{"begin":"^(?=#)","contentName":"comment.line.number-sign.git-commit","end":"^(?!#)","name":"meta.scope.metadata.git-commit","patterns":[{"captures":{"1":{"name":"markup.changed.git-commit"}},"match":"^#\\\\t((modified|renamed):.*)$"},{"captures":{"1":{"name":"markup.inserted.git-commit"}},"match":"^#\\\\t(new file:.*)$"},{"captures":{"1":{"name":"markup.deleted.git-commit"}},"match":"^#\\\\t(deleted.*)$"},{"captures":{"1":{"name":"keyword.other.file-type.git-commit"},"2":{"name":"string.unquoted.filename.git-commit"}},"match":"^#\\\\t([^:]+): *(.*)$"}]}],"scopeName":"text.git-commit","embeddedLangs":["diff"]}'));
const gitCommit = [
  ...diff,
  lang
];
export {
  gitCommit as default
};
//# sourceMappingURL=git-commit-Q0YDcjTW.js.map
