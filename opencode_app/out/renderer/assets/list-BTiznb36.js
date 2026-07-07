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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "4d13b509-2835-4f31-a8b7-403c093c958e", e._sentryDebugIdIdentifier = "sentry-dbid-4d13b509-2835-4f31-a8b7-403c093c958e");
    })();
  } catch (e) {
  }
}
;
import { aV as insert, bs as template } from "./main-Do1GNfcH.js";
var _tmpl$ = /* @__PURE__ */ template(`<div data-component=settings-v2-list>`);
const SettingsListV2 = (props) => {
  return (() => {
    var _el$ = _tmpl$();
    insert(_el$, () => props.children);
    return _el$;
  })();
};
export {
  SettingsListV2
};
//# sourceMappingURL=list-BTiznb36.js.map
