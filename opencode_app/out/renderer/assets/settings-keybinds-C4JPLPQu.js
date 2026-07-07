const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./main-Do1GNfcH.js","./main-DetviuuX.css","./list-BTiznb36.js"])))=>i.map(i=>d[i]);
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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "94f31d5e-258e-4551-83fd-591346f176bb", e._sentryDebugIdIdentifier = "sentry-dbid-94f31d5e-258e-4551-83fd-591346f176bb");
    })();
  } catch (e) {
  }
}
;
import { bQ as usePlatform, bI as useLanguage, au as createMemo, bo as showToast, aV as insert, bs as template, bz as useCommand, b$ as useSettings, aC as createStore, b6 as onCleanup, al as createComponent, X as Show, ay as createRenderEffect, ah as classList, aZ as memo, m as For, bn as setAttribute, B as Button, I as Icon, a2 as TextField, s as IconButton, aN as fuzzysort, b8 as parseKeybind, b7 as onMount, aY as makeEventListener, aM as formatKeybind, aX as lazy, a6 as __vitePreload, aH as delegateEvents } from "./main-Do1GNfcH.js";
function updaterAction(state) {
  if (!state) return { label: "settings.updates.action.checkNow" };
  switch (state.status) {
    case "checking":
      return { label: "settings.updates.action.checking" };
    case "downloading":
      return { label: "settings.updates.action.downloading" };
    case "ready":
      return { label: "toast.update.action.installRestart", run: "install" };
    case "installing":
      return { label: "settings.updates.action.installing" };
    case "disabled":
      return { label: "settings.updates.action.checkNow" };
    default:
      return { label: "settings.updates.action.checkNow", run: "check" };
  }
}
function useUpdaterAction() {
  const platform = usePlatform();
  const language = useLanguage();
  const action = createMemo(() => updaterAction(platform.updater?.state()));
  return {
    action,
    async run() {
      const run = action().run;
      if (run === "install") return platform.updater?.install();
      if (run !== "check") return;
      const state = await platform.updater?.check();
      if (state?.status === "up-to-date") {
        showToast({
          variant: "success",
          icon: "circle-check",
          title: language.t("settings.updates.toast.latest.title"),
          description: language.t("settings.updates.toast.latest.description", { version: platform.version ?? "" })
        });
      }
      if (state?.status === "error") {
        showToast({ title: language.t("common.requestFailed"), description: state.message });
      }
    }
  };
}
var _tmpl$$1 = /* @__PURE__ */ template(`<div class="bg-surface-base px-4 rounded-lg">`);
const SettingsList = (props) => {
  return (() => {
    var _el$ = _tmpl$$1();
    insert(_el$, () => props.children);
    return _el$;
  })();
};
var _tmpl$ = /* @__PURE__ */ template(`<span>&quot;<!>&quot;`), _tmpl$2 = /* @__PURE__ */ template(`<div><span>`), _tmpl$3 = /* @__PURE__ */ template(`<div>`), _tmpl$4 = /* @__PURE__ */ template(`<div><h3>`), _tmpl$5 = /* @__PURE__ */ template(`<div class="flex items-center justify-between gap-4 py-3 border-b border-border-weak-base last:border-none"><span></span><button type=button>`), _tmpl$6 = /* @__PURE__ */ template(`<div class="settings-v2-tab-header settings-v2-tab-header--stacked"><div class=settings-v2-tab-header-row><h2 class=settings-v2-tab-title></h2></div><div class=settings-v2-tab-search>`), _tmpl$7 = /* @__PURE__ */ template(`<div class=settings-v2-tab-body>`), _tmpl$8 = /* @__PURE__ */ template(`<div class="flex flex-col h-full overflow-y-auto no-scrollbar px-4 pb-10 sm:px-10 sm:pb-10"><div class="sticky top-0 z-10 bg-[linear-gradient(to_bottom,var(--surface-stronger-non-alpha)_calc(100%_-_24px),transparent)]"><div class="flex flex-col gap-4 pt-6 pb-6 max-w-[720px]"><div class="flex items-center justify-between gap-4"><h2 class="text-16-medium text-text-strong"></h2></div><div class="flex items-center gap-2 px-3 h-9 rounded-lg bg-surface-base">`);
const ButtonV2 = lazy(() => __vitePreload(() => import("./main-Do1GNfcH.js").then((n) => n.ae), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url).then((module) => ({
  default: module.ButtonV2
})));
const IconV2 = lazy(() => __vitePreload(() => import("./main-Do1GNfcH.js").then((n) => n.aT), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url).then((module) => ({
  default: module.Icon
})));
const IconButtonV2 = lazy(() => __vitePreload(() => import("./main-Do1GNfcH.js").then((n) => n.aU), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url).then((module) => ({
  default: module.IconButtonV2
})));
const TextInputV2 = lazy(() => __vitePreload(() => import("./main-Do1GNfcH.js").then((n) => n.bw), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url).then((module) => ({
  default: module.TextInputV2
})));
const SettingsListV2 = lazy(() => __vitePreload(() => import("./list-BTiznb36.js"), true ? __vite__mapDeps([2,0,1]) : void 0, import.meta.url).then((module) => ({
  default: module.SettingsListV2
})));
const IS_MAC = typeof navigator === "object" && /(Mac|iPod|iPhone|iPad)/.test(navigator.platform);
const PALETTE_ID = "command.palette";
const DEFAULT_PALETTE_KEYBIND = "mod+shift+p";
const GROUPS = ["General", "Session", "Navigation", "Model and agent", "Terminal", "Prompt"];
const groupKey = {
  General: "settings.shortcuts.group.general",
  Session: "settings.shortcuts.group.session",
  Navigation: "settings.shortcuts.group.navigation",
  "Model and agent": "settings.shortcuts.group.modelAndAgent",
  Terminal: "settings.shortcuts.group.terminal",
  Prompt: "settings.shortcuts.group.prompt"
};
function groupFor(id) {
  if (id === PALETTE_ID) return "General";
  if (id.startsWith("terminal.")) return "Terminal";
  if (id.startsWith("model.") || id.startsWith("agent.") || id.startsWith("mcp.")) return "Model and agent";
  if (id.startsWith("file.") || id.startsWith("fileTree.")) return "Navigation";
  if (id.startsWith("prompt.")) return "Prompt";
  if (id.startsWith("session.") || id.startsWith("message.") || id.startsWith("permissions.") || id.startsWith("steps.") || id.startsWith("review.")) return "Session";
  return "General";
}
function isModifier(key) {
  return key === "Shift" || key === "Control" || key === "Alt" || key === "Meta";
}
function normalizeKey(key) {
  if (key === ",") return "comma";
  if (key === "+") return "plus";
  if (key === " ") return "space";
  return key.toLowerCase();
}
function recordKeybind(event) {
  if (isModifier(event.key)) return;
  const parts = [];
  const mod = IS_MAC ? event.metaKey : event.ctrlKey;
  if (mod) parts.push("mod");
  if (IS_MAC && event.ctrlKey) parts.push("ctrl");
  if (!IS_MAC && event.metaKey) parts.push("meta");
  if (event.altKey) parts.push("alt");
  if (event.shiftKey) parts.push("shift");
  const key = normalizeKey(event.key);
  if (!key) return;
  parts.push(key);
  return parts.join("+");
}
function signatures(config) {
  if (!config) return [];
  const sigs = [];
  for (const kb of parseKeybind(config)) {
    const parts = [];
    if (kb.ctrl) parts.push("ctrl");
    if (kb.alt) parts.push("alt");
    if (kb.shift) parts.push("shift");
    if (kb.meta) parts.push("meta");
    if (kb.key) parts.push(kb.key);
    if (parts.length === 0) continue;
    sigs.push(parts.join("+"));
  }
  return sigs;
}
function keybinds(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}
function listFor(command, map, palette) {
  const out = /* @__PURE__ */ new Map();
  out.set(PALETTE_ID, {
    title: palette,
    group: "General"
  });
  for (const opt of command.catalog) {
    if (opt.id.startsWith("suggested.")) continue;
    if (opt.hidden) continue;
    out.set(opt.id, {
      title: opt.title,
      group: groupFor(opt.id)
    });
  }
  for (const opt of command.options) {
    if (opt.id.startsWith("suggested.")) continue;
    if (opt.hidden) continue;
    out.set(opt.id, {
      title: opt.title,
      group: groupFor(opt.id)
    });
  }
  for (const [id, value] of Object.entries(map)) {
    if (typeof value !== "string") continue;
    if (out.has(id)) continue;
    out.set(id, {
      title: id,
      group: groupFor(id)
    });
  }
  return out;
}
function groupedFor(list) {
  const out = /* @__PURE__ */ new Map();
  for (const group of GROUPS) out.set(group, []);
  for (const [id, item] of list) {
    const ids = out.get(item.group);
    if (!ids) continue;
    ids.push(id);
  }
  for (const group of GROUPS) {
    const ids = out.get(group);
    if (!ids) continue;
    ids.sort((a, b) => (list.get(a)?.title ?? "").localeCompare(list.get(b)?.title ?? ""));
  }
  return out;
}
function filteredFor(query, list, grouped, keybind) {
  const value = query.toLowerCase().trim();
  if (!value) return grouped;
  const out = /* @__PURE__ */ new Map();
  for (const group of GROUPS) out.set(group, []);
  const items = Array.from(list.entries()).map(([id, meta]) => ({
    id,
    title: meta.title,
    group: meta.group,
    keybind: keybind(id)
  }));
  const results = fuzzysort.go(value, items, {
    keys: ["title", "keybind"],
    threshold: -1e4
  });
  for (const result of results) {
    const ids = out.get(result.obj.group);
    if (!ids) continue;
    ids.push(result.obj.id);
  }
  return out;
}
function useKeyCapture(input) {
  onMount(() => {
    const handle = (event) => {
      const id = input.active();
      if (!id) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      if (event.key === "Escape") {
        input.stop();
        return;
      }
      const clear = (event.key === "Backspace" || event.key === "Delete") && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey;
      if (clear) {
        input.set(id, "none");
        input.stop();
        return;
      }
      const next = recordKeybind(event);
      if (!next) return;
      const conflicts = /* @__PURE__ */ new Map();
      for (const sig of signatures(next)) {
        for (const item of input.used().get(sig) ?? []) {
          if (item.id === id) continue;
          conflicts.set(item.id, item.title);
        }
      }
      if (conflicts.size > 0) {
        showToast({
          title: input.language.t("settings.shortcuts.conflict.title"),
          description: input.language.t("settings.shortcuts.conflict.description", {
            keybind: formatKeybind(next, input.language.t),
            titles: [...conflicts.values()].join(", ")
          })
        });
        return;
      }
      input.set(id, next);
      input.stop();
    };
    makeEventListener(document, "keydown", handle, {
      capture: true
    });
  });
}
const SettingsKeybinds = (props) => {
  const command = useCommand();
  const language = useLanguage();
  const settings = useSettings();
  const [store, setStore] = createStore({
    active: null,
    filter: ""
  });
  const stop = () => {
    if (!store.active) return;
    setStore("active", null);
    command.keybinds(true);
  };
  const start = (id) => {
    if (store.active === id) {
      stop();
      return;
    }
    if (store.active) stop();
    setStore("active", id);
    command.keybinds(false);
  };
  const map = createMemo(() => keybinds(settings.current.keybinds));
  const hasOverrides = createMemo(() => Object.values(map()).some((x) => typeof x === "string"));
  const resetAll = () => {
    stop();
    settings.keybinds.resetAll();
    showToast({
      title: language.t("settings.shortcuts.reset.toast.title"),
      description: language.t("settings.shortcuts.reset.toast.description")
    });
  };
  const list = createMemo(() => {
    language.locale();
    return listFor(command, map(), language.t("command.palette"));
  });
  const title = (id) => list().get(id)?.title ?? "";
  const grouped = createMemo(() => groupedFor(list()));
  const filtered = createMemo(() => {
    return filteredFor(store.filter, list(), grouped(), (id) => command.keybind(id) || "");
  });
  const hasResults = createMemo(() => {
    for (const group of GROUPS) {
      const ids = filtered().get(group) ?? [];
      if (ids.length > 0) return true;
    }
    return false;
  });
  const used = createMemo(() => {
    const map2 = /* @__PURE__ */ new Map();
    const add = (key, value) => {
      const list2 = map2.get(key);
      if (!list2) {
        map2.set(key, [value]);
        return;
      }
      list2.push(value);
    };
    const palette = settings.keybinds.get(PALETTE_ID) ?? DEFAULT_PALETTE_KEYBIND;
    for (const sig of signatures(palette)) {
      add(sig, {
        id: PALETTE_ID,
        title: title(PALETTE_ID)
      });
    }
    const valueFor = (id) => {
      const custom = settings.keybinds.get(id);
      if (typeof custom === "string") return custom;
      const live = command.options.find((x) => x.id === id);
      if (live?.keybind) return live.keybind;
      const meta = command.catalog.find((x) => x.id === id);
      return meta?.keybind;
    };
    for (const id of list().keys()) {
      if (id === PALETTE_ID) continue;
      for (const sig of signatures(valueFor(id))) {
        add(sig, {
          id,
          title: title(id)
        });
      }
    }
    return map2;
  });
  const setKeybind = (id, keybind) => settings.keybinds.set(id, keybind);
  useKeyCapture({
    active: () => store.active,
    stop,
    set: setKeybind,
    used,
    language
  });
  onCleanup(() => {
    if (store.active) command.keybinds(true);
  });
  const emptyResults = createComponent(Show, {
    get when() {
      return memo(() => !!store.filter)() && !hasResults();
    },
    get children() {
      var _el$ = _tmpl$2(), _el$2 = _el$.firstChild;
      insert(_el$2, () => language.t("settings.shortcuts.search.empty"));
      insert(_el$, createComponent(Show, {
        get when() {
          return store.filter;
        },
        get children() {
          var _el$3 = _tmpl$(), _el$4 = _el$3.firstChild, _el$6 = _el$4.nextSibling;
          _el$6.nextSibling;
          insert(_el$3, () => store.filter, _el$6);
          createRenderEffect((_$p) => classList(_el$3, {
            "text-14-regular text-text-strong mt-1": !props.v2,
            "settings-v2-shortcuts-status-filter": props.v2
          }, _$p));
          return _el$3;
        }
      }), null);
      createRenderEffect((_p$) => {
        var _v$ = {
          "flex flex-col items-center justify-center py-12 text-center": !props.v2,
          "settings-v2-shortcuts-status": props.v2
        }, _v$2 = {
          "text-14-regular text-text-weak": !props.v2
        };
        _p$.e = classList(_el$, _v$, _p$.e);
        _p$.t = classList(_el$2, _v$2, _p$.t);
        return _p$;
      }, {
        e: void 0,
        t: void 0
      });
      return _el$;
    }
  });
  const List = props.v2 ? SettingsListV2 : SettingsList;
  const groups = (() => {
    var _el$7 = _tmpl$3();
    insert(_el$7, createComponent(For, {
      each: GROUPS,
      children: (group) => createComponent(Show, {
        get when() {
          return (filtered().get(group) ?? []).length > 0;
        },
        get children() {
          var _el$8 = _tmpl$4(), _el$9 = _el$8.firstChild;
          insert(_el$9, () => language.t(groupKey[group]));
          insert(_el$8, createComponent(List, {
            get children() {
              return createComponent(For, {
                get each() {
                  return filtered().get(group) ?? [];
                },
                children: (id) => (() => {
                  var _el$0 = _tmpl$5(), _el$1 = _el$0.firstChild, _el$10 = _el$1.nextSibling;
                  insert(_el$1, () => title(id));
                  _el$10.$$click = () => start(id);
                  setAttribute(_el$10, "data-keybind-id", id);
                  insert(_el$10, createComponent(Show, {
                    get when() {
                      return store.active === id;
                    },
                    get fallback() {
                      return command.keybind(id) || language.t("settings.shortcuts.unassigned");
                    },
                    get children() {
                      return language.t("settings.shortcuts.pressKeys");
                    }
                  }));
                  createRenderEffect((_p$) => {
                    var _v$5 = {
                      "text-14-regular text-text-strong": !props.v2
                    }, _v$6 = {
                      "settings-v2-keybind-button": props.v2,
                      "settings-v2-keybind-button--active": props.v2 && store.active === id,
                      "h-8 px-3 rounded-md text-12-regular": !props.v2,
                      "bg-surface-base text-text-subtle hover:bg-surface-raised-base-hover active:bg-surface-raised-base-active": !props.v2 && store.active !== id,
                      "border border-border-weak-base bg-surface-inset-base text-text-weak": !props.v2 && store.active === id
                    };
                    _p$.e = classList(_el$1, _v$5, _p$.e);
                    _p$.t = classList(_el$10, _v$6, _p$.t);
                    return _p$;
                  }, {
                    e: void 0,
                    t: void 0
                  });
                  return _el$0;
                })()
              });
            }
          }), null);
          createRenderEffect((_p$) => {
            var _v$3 = {
              "settings-v2-section": props.v2,
              "flex flex-col gap-1": !props.v2
            }, _v$4 = {
              "settings-v2-section-title": props.v2,
              "text-14-medium text-text-strong pb-2": !props.v2
            };
            _p$.e = classList(_el$8, _v$3, _p$.e);
            _p$.t = classList(_el$9, _v$4, _p$.t);
            return _p$;
          }, {
            e: void 0,
            t: void 0
          });
          return _el$8;
        }
      })
    }), null);
    insert(_el$7, emptyResults, null);
    createRenderEffect((_$p) => classList(_el$7, {
      "settings-v2-shortcuts flex flex-col gap-8": props.v2,
      "flex flex-col gap-8 max-w-[720px]": !props.v2
    }, _$p));
    return _el$7;
  })();
  return createComponent(Show, {
    get when() {
      return props.v2;
    },
    get fallback() {
      return (() => {
        var _el$16 = _tmpl$8(), _el$17 = _el$16.firstChild, _el$18 = _el$17.firstChild, _el$19 = _el$18.firstChild, _el$20 = _el$19.firstChild, _el$21 = _el$19.nextSibling;
        insert(_el$20, () => language.t("settings.shortcuts.title"));
        insert(_el$19, createComponent(Button, {
          size: "small",
          variant: "secondary",
          onClick: resetAll,
          get disabled() {
            return !hasOverrides();
          },
          get children() {
            return language.t("settings.shortcuts.reset.button");
          }
        }), null);
        insert(_el$21, createComponent(Icon, {
          name: "magnifying-glass",
          "class": "text-icon-weak-base flex-shrink-0"
        }), null);
        insert(_el$21, createComponent(TextField, {
          variant: "ghost",
          type: "text",
          get value() {
            return store.filter;
          },
          onChange: (v) => setStore("filter", v),
          get placeholder() {
            return language.t("settings.shortcuts.search.placeholder");
          },
          spellcheck: false,
          autocorrect: "off",
          autocomplete: "off",
          autocapitalize: "off",
          "class": "flex-1"
        }), null);
        insert(_el$21, createComponent(Show, {
          get when() {
            return store.filter;
          },
          get children() {
            return createComponent(IconButton, {
              icon: "circle-x",
              variant: "ghost",
              onClick: () => setStore("filter", "")
            });
          }
        }), null);
        insert(_el$16, groups, null);
        return _el$16;
      })();
    },
    get children() {
      return [(() => {
        var _el$11 = _tmpl$6(), _el$12 = _el$11.firstChild, _el$13 = _el$12.firstChild, _el$14 = _el$12.nextSibling;
        insert(_el$13, () => language.t("settings.shortcuts.title"));
        insert(_el$12, createComponent(ButtonV2, {
          variant: "ghost",
          onClick: resetAll,
          get disabled() {
            return !hasOverrides();
          },
          get children() {
            return language.t("settings.shortcuts.reset.button");
          }
        }), null);
        insert(_el$14, createComponent(TextInputV2, {
          type: "search",
          appearance: "base",
          get value() {
            return store.filter;
          },
          onInput: (event) => setStore("filter", event.currentTarget.value),
          get placeholder() {
            return language.t("settings.shortcuts.search.placeholder");
          },
          spellcheck: false,
          autocorrect: "off",
          autocomplete: "off",
          autocapitalize: "off",
          get ["aria-label"]() {
            return language.t("settings.shortcuts.search.placeholder");
          }
        }), null);
        insert(_el$14, createComponent(Show, {
          get when() {
            return store.filter;
          },
          get children() {
            return createComponent(IconButtonV2, {
              type: "button",
              variant: "ghost-muted",
              size: "small",
              "class": "settings-v2-tab-search-clear",
              get icon() {
                return createComponent(IconV2, {
                  name: "close",
                  size: "large",
                  "class": "text-v2-icon-icon-muted"
                });
              },
              onClick: () => setStore("filter", "")
            });
          }
        }), null);
        return _el$11;
      })(), (() => {
        var _el$15 = _tmpl$7();
        insert(_el$15, groups);
        return _el$15;
      })()];
    }
  });
};
delegateEvents(["click"]);
export {
  SettingsKeybinds as S,
  SettingsList as a,
  useUpdaterAction as u
};
//# sourceMappingURL=settings-keybinds-C4JPLPQu.js.map
