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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "65bd4e3e-0e04-4fb4-a73b-bc1eacfb60f8", e._sentryDebugIdIdentifier = "sentry-dbid-65bd4e3e-0e04-4fb4-a73b-bc1eacfb60f8");
    })();
  } catch (e) {
  }
}
;
import { S as Switch$1 } from "./LROKH5N7-Bao07a_E.js";
import { bq as splitProps, al as createComponent, a$ as mergeProps, X as Show, aV as insert, bs as template } from "./main-Do1GNfcH.js";
function Switch(props) {
  const [local, others] = splitProps(props, ["children", "class", "hideLabel"]);
  return createComponent(Switch$1, mergeProps(others, {
    get ["class"]() {
      return local.class;
    },
    "data-component": "switch",
    get children() {
      return [createComponent(Switch$1.Input, {
        "data-slot": "switch-input"
      }), createComponent(Show, {
        get when() {
          return local.children;
        },
        children: (label) => createComponent(Switch$1.Label, {
          "data-slot": "switch-label",
          get classList() {
            return {
              "sr-only": local.hideLabel
            };
          },
          get children() {
            return label();
          }
        })
      }), createComponent(Switch$1.Control, {
        "data-slot": "switch-control",
        get children() {
          return createComponent(Switch$1.Thumb, {
            "data-slot": "switch-thumb"
          });
        }
      }), createComponent(Switch$1.ErrorMessage, {
        "data-slot": "switch-error"
      })];
    }
  }));
}
var _tmpl$ = /* @__PURE__ */ template(`<div data-component=settings-v2-row><div data-slot=settings-v2-row-copy><div data-slot=settings-v2-row-title></div><div data-slot=settings-v2-row-description></div></div><div data-slot=settings-v2-row-control>`);
const SettingsRowV2 = (props) => {
  return (() => {
    var _el$ = _tmpl$(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$2.nextSibling;
    insert(_el$3, () => props.title);
    insert(_el$4, () => props.description);
    insert(_el$5, () => props.children);
    return _el$;
  })();
};
export {
  SettingsRowV2 as S,
  Switch as a
};
//# sourceMappingURL=row-4AB8wTZz.js.map
