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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "eec1ea82-c154-42f5-a938-b548a7f71832", e._sentryDebugIdIdentifier = "sentry-dbid-eec1ea82-c154-42f5-a938-b548a7f71832");
    })();
  } catch (e) {
  }
}
;
import { c1 as useSync, bI as useLanguage, bM as useMutation, bo as showToast } from "./main-Do1GNfcH.js";
function useMcpToggle() {
  const sync = useSync();
  const language = useLanguage();
  return useMutation(() => ({
    mutationFn: sync().mcp.toggle,
    onError: (error) => showToast({
      variant: "error",
      title: language.t("common.requestFailed"),
      description: error instanceof Error ? error.message : String(error)
    })
  }));
}
export {
  useMcpToggle as u
};
//# sourceMappingURL=mcp-qaCAPBPc.js.map
