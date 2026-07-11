const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./dialog-settings-BcaPjZrS.js","./main-Do1GNfcH.js","./main-DetviuuX.css","./switch-CcOrtMmL.js","./LROKH5N7-Bao07a_E.js","./settings-keybinds-C4JPLPQu.js","./dialog-connect-provider-VwuxBEmX.js","./dialog-select-provider-Dh2NFik3.js"])))=>i.map(i=>d[i]);
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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "0e38fa2f-7219-403e-928e-0e64e52fb7bd", e._sentryDebugIdIdentifier = "sentry-dbid-0e38fa2f-7219-403e-928e-0e64e52fb7bd");
    })();
  } catch (e) {
  }
}
;
import { bq as splitProps, al as createComponent, a$ as mergeProps, _ as Tabs, aV as insert, br as spread, X as Show, ay as createRenderEffect, bn as setAttribute, ah as classList, bs as template, aH as delegateEvents, b6 as onCleanup, au as createMemo, C as Select, aZ as memo, c2 as useTheme, bI as useLanguage, bP as usePermission, bQ as usePlatform, bD as useDialog, b$ as useSettings, bY as useServerSync, bX as useServerSDK, at as createMediaQuery, az as createResource, b7 as onMount, a6 as __vitePreload, a3 as TextInputV2, bj as sansDefault, bk as sansFontFamily, b1 as monoDefault, b2 as monoFontFamily, bt as terminalDefault, bu as terminalFontFamily, a as ButtonV2, bl as sansInput, b3 as monoInput, bv as terminalInput, S as SOUND_OPTIONS, bf as playSoundById, bS as useProviders, bg as popularProviders, m as For, z as ProviderIcon, a1 as Tag, bo as showToast, bL as useModels, bF as useFilteredList, t as IconButtonV2, r as Icon, R as RadioGroup, aN as fuzzysort, bM as useMutation, ao as createEffect, b as Dialog, e as DialogHeader, g as DialogTitle, i as DividerV2, c as DialogBody, aa as addEventListener, d as DialogFooter, c3 as useWslServers, aC as createStore, bp as showToast$1, u as MenuV2, H as ServerConnection, O as ServerHealthIndicator, bW as useServerManagementController, bm as serverName, U as ServerRowMenu, f as DialogServerV2, I as Icon$1 } from "./main-Do1GNfcH.js";
import { S as SettingsRowV2, a as Switch } from "./row-4AB8wTZz.js";
import { u as useUpdaterAction, S as SettingsKeybinds } from "./settings-keybinds-C4JPLPQu.js";
import { L as Link, D as DialogConnectProvider } from "./dialog-connect-provider-VwuxBEmX.js";
import { SettingsListV2 } from "./list-BTiznb36.js";
import { D as DialogCustomProvider, a as DialogSelectProvider } from "./dialog-select-provider-Dh2NFik3.js";
import "./LROKH5N7-Bao07a_E.js";
var _tmpl$$a = /* @__PURE__ */ template(`<span class="inline-flex items-center gap-2"data-slot=tabs-v2-trigger-content>`), _tmpl$2$7 = /* @__PURE__ */ template(`<div data-slot=tabs-v2-trigger-wrapper>`), _tmpl$3$7 = /* @__PURE__ */ template(`<span data-slot=tabs-v2-subtext class="ml-2 text-xs text-text-weak">`), _tmpl$4$7 = /* @__PURE__ */ template(`<div role=button tabindex=0 aria-label="Close tab"data-slot=tabs-v2-close-button><svg width=14 height=14 viewBox="0 0 14 14"fill=none xmlns=http://www.w3.org/2000/svg><path d="M10.8889 3.11108L3.11108 10.8889"stroke=currentColor stroke-linejoin=round></path><path d="M3.11108 3.11108L10.8889 10.8889"stroke=currentColor stroke-linejoin=round>`), _tmpl$5$6 = /* @__PURE__ */ template(`<div data-slot=tabs-v2-section-title>`);
function TabsV2Root(props) {
  const [split, rest] = splitProps(props, ["class", "classList", "variant", "orientation"]);
  return createComponent(Tabs, mergeProps(rest, {
    get orientation() {
      return split.orientation;
    },
    "data-component": "tabs-v2",
    get ["data-variant"]() {
      return split.variant || "normal";
    },
    get ["data-orientation"]() {
      return split.orientation || "horizontal";
    },
    get classList() {
      return {
        ...split.classList,
        [split.class ?? ""]: !!split.class
      };
    }
  }));
}
function TabsV2List(props) {
  const [split, rest] = splitProps(props, ["class", "classList"]);
  return createComponent(Tabs.List, mergeProps(rest, {
    "data-slot": "tabs-v2-list",
    get classList() {
      return {
        ...split.classList,
        [split.class ?? ""]: !!split.class
      };
    }
  }));
}
function TabsV2Trigger(props) {
  const [split, rest] = splitProps(props, ["class", "classList", "children", "onMiddleClick", "subtext"]);
  return (() => {
    var _el$ = _tmpl$2$7();
    _el$.addEventListener("auxclick", (e) => {
      if (e.button === 1 && split.onMiddleClick) {
        e.preventDefault();
        split.onMiddleClick();
      }
    });
    _el$.$$mousedown = (e) => {
      if (e.button === 1 && split.onMiddleClick) {
        e.preventDefault();
      }
    };
    insert(_el$, createComponent(Tabs.Trigger, mergeProps(rest, {
      "data-slot": "tabs-v2-trigger",
      get ["data-value"]() {
        return props.value;
      },
      get children() {
        var _el$2 = _tmpl$$a();
        insert(_el$2, () => split.children, null);
        insert(_el$2, createComponent(Show, {
          get when() {
            return split.subtext;
          },
          children: (subtext) => (() => {
            var _el$3 = _tmpl$3$7();
            insert(_el$3, subtext);
            return _el$3;
          })()
        }), null);
        return _el$2;
      }
    })));
    createRenderEffect((_p$) => {
      var _v$ = props.value, _v$2 = {
        ...split.classList,
        [split.class ?? ""]: !!split.class
      };
      _v$ !== _p$.e && setAttribute(_el$, "data-value", _p$.e = _v$);
      _p$.t = classList(_el$, _v$2, _p$.t);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
}
function TabsV2CloseButton(props) {
  const [split, rest] = splitProps(props, ["class", "classList", "onClick"]);
  return (() => {
    var _el$4 = _tmpl$4$7();
    spread(_el$4, mergeProps(rest, {
      get classList() {
        return {
          [split.class ?? ""]: !!split.class,
          ...split.classList
        };
      },
      "onClick": (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof split.onClick === "function") {
          split.onClick(e);
        }
      },
      "onMouseDown": (e) => {
        e.preventDefault();
        e.stopPropagation();
      }
    }), false, true);
    return _el$4;
  })();
}
function TabsV2Content(props) {
  const [split, rest] = splitProps(props, ["class", "classList", "children"]);
  return createComponent(Tabs.Content, mergeProps(rest, {
    "data-slot": "tabs-v2-content",
    get classList() {
      return {
        ...split.classList,
        [split.class ?? ""]: !!split.class
      };
    },
    get children() {
      return split.children;
    }
  }));
}
const TabsV2SectionTitle = (props) => {
  return (() => {
    var _el$5 = _tmpl$5$6();
    insert(_el$5, () => props.children);
    return _el$5;
  })();
};
const TabsV2 = Object.assign(TabsV2Root, {
  List: TabsV2List,
  Trigger: TabsV2Trigger,
  CloseButton: TabsV2CloseButton,
  Content: TabsV2Content,
  SectionTitle: TabsV2SectionTitle
});
delegateEvents(["mousedown"]);
var _tmpl$$9 = /* @__PURE__ */ template(`<svg width=16 height=16 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg aria-hidden=true><path d="M11 9.5L8 6.5L5 9.5"stroke=currentColor stroke-width=1 stroke-linecap=round stroke-linejoin=round>`), _tmpl$2$6 = /* @__PURE__ */ template(`<svg width=14 height=14 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg aria-hidden=true><path d="M3.53564 8.17857L6.39279 11.75L12.4642 4.25"stroke=currentColor stroke-width=1 stroke-linecap=round stroke-linejoin=round>`), _tmpl$3$6 = /* @__PURE__ */ template(`<div data-slot=select-v2-value>`), _tmpl$4$6 = /* @__PURE__ */ template(`<span data-slot=select-v2-chevron aria-hidden=true>`), _tmpl$5$5 = /* @__PURE__ */ template(`<div data-slot=menu-v2-group-label>`);
function groupOptions(options, groupBy) {
  if (!groupBy) {
    return [{
      category: "",
      options
    }];
  }
  const map = /* @__PURE__ */ new Map();
  for (const opt of options) {
    const key = groupBy(opt);
    const arr = map.get(key);
    if (arr) arr.push(opt);
    else map.set(key, [opt]);
  }
  return [...map.entries()].map(([category, opts]) => ({
    category,
    options: opts
  }));
}
const ChevronDown = () => _tmpl$$9();
const CheckSmall = () => _tmpl$2$6();
function SelectV2(props) {
  const [local, others] = splitProps(props, ["class", "classList", "placeholder", "options", "current", "value", "label", "groupBy", "onSelect", "onHighlight", "onOpenChange", "children", "appearance", "invalid", "numeric", "disabled", "valueClass", "placement", "gutter", "sameWidth", "flip", "slide", "fitViewport"]);
  const inline = () => (local.appearance ?? "base") === "inline";
  const state = {};
  const stop = () => {
    state.cleanup?.();
    state.cleanup = void 0;
    state.key = void 0;
  };
  const keyFor = (item) => local.value ? local.value(item) : String(item);
  const move = (item) => {
    if (!local.onHighlight) return;
    if (!item) {
      stop();
      return;
    }
    const key = keyFor(item);
    if (state.key === key) return;
    state.cleanup?.();
    state.cleanup = local.onHighlight(item);
    state.key = key;
  };
  onCleanup(stop);
  const grouped = createMemo(() => groupOptions(local.options, local.groupBy));
  return createComponent(Select, mergeProps(others, {
    multiple: false,
    get disabled() {
      return local.disabled;
    },
    "data-component": "select-v2-root",
    get placement() {
      return local.placement ?? (inline() ? "bottom-end" : "bottom-start");
    },
    get gutter() {
      return local.gutter ?? 4;
    },
    get sameWidth() {
      return local.sameWidth ?? !inline();
    },
    get flip() {
      return local.flip ?? true;
    },
    get slide() {
      return local.slide ?? true;
    },
    get fitViewport() {
      return local.fitViewport ?? false;
    },
    get value() {
      return local.current;
    },
    get options() {
      return grouped();
    },
    optionValue: (x) => local.value ? local.value(x) : String(x),
    optionTextValue: (x) => local.label ? local.label(x) : String(x),
    optionGroupChildren: "options",
    get placeholder() {
      return local.placeholder;
    },
    sectionComponent: (sectionProps) => createComponent(Select.Section, {
      get children() {
        return createComponent(Show, {
          get when() {
            return sectionProps.section.rawValue.category;
          },
          get children() {
            var _el$5 = _tmpl$5$5();
            insert(_el$5, () => sectionProps.section.rawValue.category);
            return _el$5;
          }
        });
      }
    }),
    itemComponent: (itemProps) => createComponent(Select.Item, mergeProps(itemProps, {
      "data-component": "menu-v2-item",
      onPointerEnter: () => move(itemProps.item.rawValue),
      onPointerMove: () => move(itemProps.item.rawValue),
      onFocus: () => move(itemProps.item.rawValue),
      get children() {
        return [createComponent(Select.ItemLabel, {
          "data-slot": "menu-v2-item-content",
          as: "span",
          get children() {
            return memo(() => !!local.children)() ? local.children(itemProps.item.rawValue) : memo(() => !!local.label)() ? local.label(itemProps.item.rawValue) : String(itemProps.item.rawValue);
          }
        }), createComponent(Select.ItemIndicator, {
          "data-slot": "menu-v2-item-indicator",
          forceMount: true,
          get children() {
            return createComponent(CheckSmall, {});
          }
        })];
      }
    })),
    onChange: (next) => {
      const v = next == null ? null : Array.isArray(next) ? next[0] ?? null : next;
      local.onSelect?.(v);
      stop();
    },
    onOpenChange: (open) => {
      local.onOpenChange?.(open);
      if (!open) stop();
    },
    get children() {
      return [createComponent(Select.Trigger, {
        as: "div",
        "data-component": "select-v2",
        get ["data-appearance"]() {
          return local.appearance ?? "base";
        },
        get ["data-invalid"]() {
          return local.invalid ? "" : void 0;
        },
        get ["data-numeric"]() {
          return local.numeric ? "" : void 0;
        },
        get disabled() {
          return local.disabled;
        },
        get ["data-disabled"]() {
          return local.disabled ? "" : void 0;
        },
        get classList() {
          return {
            ...local.classList,
            [local.class ?? ""]: !!local.class
          };
        },
        get children() {
          return [(() => {
            var _el$3 = _tmpl$3$6();
            insert(_el$3, createComponent(Select.Value, {
              "data-slot": "select-v2-value-text",
              get ["class"]() {
                return local.valueClass;
              },
              children: (st) => {
                const selected = st.selectedOption();
                if (local.label && selected != null) return local.label(selected);
                return selected != null ? selected : "";
              }
            }));
            return _el$3;
          })(), (() => {
            var _el$4 = _tmpl$4$6();
            insert(_el$4, createComponent(ChevronDown, {}));
            return _el$4;
          })()];
        }
      }), createComponent(Select.Portal, {
        get children() {
          return createComponent(Select.Content, {
            "data-component": "menu-v2-content",
            "data-slot": "select-v2-content",
            get children() {
              return createComponent(Select.Listbox, {
                "data-slot": "select-v2-listbox"
              });
            }
          });
        }
      })];
    }
  }));
}
var _tmpl$$8 = /* @__PURE__ */ template(`<div data-action=settings-auto-accept-permissions>`), _tmpl$2$5 = /* @__PURE__ */ template(`<div data-action=settings-feed-reasoning-summaries>`), _tmpl$3$5 = /* @__PURE__ */ template(`<div data-action=settings-feed-shell-tool-parts-expanded>`), _tmpl$4$5 = /* @__PURE__ */ template(`<div data-action=settings-feed-edit-tool-parts-expanded>`), _tmpl$5$4 = /* @__PURE__ */ template(`<div data-action=settings-new-layout-designs>`), _tmpl$6$4 = /* @__PURE__ */ template(`<div data-action=settings-mobile-titlebar-bottom>`), _tmpl$7$3 = /* @__PURE__ */ template(`<div class=settings-v2-section>`), _tmpl$8$2 = /* @__PURE__ */ template(`<div data-action=settings-show-file-tree>`), _tmpl$9$1 = /* @__PURE__ */ template(`<div data-action=settings-show-search>`), _tmpl$0$1 = /* @__PURE__ */ template(`<div data-action=settings-show-status>`), _tmpl$1 = /* @__PURE__ */ template(`<div data-action=settings-show-custom-agents>`), _tmpl$10 = /* @__PURE__ */ template(`<div class=settings-v2-section><h3 class=settings-v2-section-title>`), _tmpl$11 = /* @__PURE__ */ template(`<div class="w-full sm:w-[220px]">`), _tmpl$12 = /* @__PURE__ */ template(`<div data-action=settings-notifications-agent>`), _tmpl$13 = /* @__PURE__ */ template(`<div data-action=settings-notifications-permissions>`), _tmpl$14 = /* @__PURE__ */ template(`<div data-action=settings-notifications-errors>`), _tmpl$15 = /* @__PURE__ */ template(`<div data-action=settings-release-notes>`), _tmpl$16 = /* @__PURE__ */ template(`<div data-action=settings-pinch-zoom>`), _tmpl$17 = /* @__PURE__ */ template(`<div class=settings-v2-tab-header><h2 class=settings-v2-tab-title>`), _tmpl$18 = /* @__PURE__ */ template(`<div class=settings-v2-tab-body>`);
let demoSoundState = {
  cleanup: void 0,
  timeout: void 0,
  run: 0
};
const stopDemoSound = () => {
  demoSoundState.run += 1;
  if (demoSoundState.cleanup) {
    demoSoundState.cleanup();
  }
  clearTimeout(demoSoundState.timeout);
  demoSoundState.cleanup = void 0;
};
const playDemoSound = (id) => {
  stopDemoSound();
  if (!id) return;
  const run = ++demoSoundState.run;
  demoSoundState.timeout = setTimeout(() => {
    void playSoundById(id).then((cleanup) => {
      if (demoSoundState.run !== run) {
        cleanup?.();
        return;
      }
      demoSoundState.cleanup = cleanup;
    });
  }, 100);
};
const SettingsGeneralV2 = (props) => {
  const theme = useTheme();
  const language = useLanguage();
  const permission = usePermission();
  const platform = usePlatform();
  const dialog = useDialog();
  const settings = useSettings();
  const serverSync = useServerSync();
  const serverSdk = useServerSDK();
  const mobile = createMediaQuery("(max-width: 767px)");
  const updater = useUpdaterAction();
  const dir = createMemo(() => {
    if (!props.sessionID) return void 0;
    return serverSync().session.lineage.peek(props.sessionID)?.session.directory;
  });
  const accepting = createMemo(() => {
    const value = dir();
    if (!value || !props.sessionID) return false;
    return permission.isAutoAccepting(props.sessionID, value);
  });
  const toggleAccept = (checked) => {
    const value = dir();
    if (!value || !props.sessionID) return;
    if (checked) {
      permission.enableAutoAccept(props.sessionID, value);
      return;
    }
    permission.disableAutoAccept(props.sessionID, value);
  };
  const desktop = createMemo(() => platform.platform === "desktop");
  const themeOptions = createMemo(() => theme.ids().map((id) => ({
    id,
    name: theme.name(id)
  })));
  const [shells] = createResource(() => serverSdk().client.pty.shells().then((res) => res.data ?? []).catch(() => []), {
    initialValue: []
  });
  const [pinchZoom, {
    mutate: setPinchZoom
  }] = createResource(() => desktop() && platform.getPinchZoomEnabled ? true : false, () => Promise.resolve(platform.getPinchZoomEnabled?.() ?? false).catch(() => false), {
    initialValue: false
  });
  onMount(() => {
    void theme.loadThemes();
  });
  const autoOption = {
    id: "auto",
    value: "",
    label: language.t("settings.general.row.shell.autoDefault")
  };
  const currentShell = createMemo(() => serverSync().data.config.shell ?? "");
  const shellOptions = createMemo(() => {
    const list = shells.latest;
    const current = serverSync().data.config.shell;
    const nameCounts = /* @__PURE__ */ new Map();
    for (const s of list) {
      nameCounts.set(s.name, (nameCounts.get(s.name) || 0) + 1);
    }
    const options = [autoOption, ...list.map((s) => {
      const ambiguousName = (nameCounts.get(s.name) || 0) > 1;
      const text = ambiguousName ? s.path : s.name;
      const label = s.acceptable ? text : `${text} (${language.t("settings.general.row.shell.terminalOnly")})`;
      return {
        id: s.path,
        // Prefer name over path - "bash" is much cleaner than the explicit full route even when it may change due to PATH.
        value: ambiguousName ? s.path : s.name,
        label
      };
    })];
    if (current && !options.some((o) => o.value === current)) {
      options.push({
        id: current,
        value: current,
        label: current
      });
    }
    return options;
  });
  const onPinchZoomChange = (checked) => {
    setPinchZoom(checked);
    const update = platform.setPinchZoomEnabled?.(checked);
    if (!update) return;
    void update.catch(() => setPinchZoom(!checked));
  };
  const colorSchemeOptions = createMemo(() => [{
    value: "system",
    label: language.t("theme.scheme.system")
  }, {
    value: "light",
    label: language.t("theme.scheme.light")
  }, {
    value: "dark",
    label: language.t("theme.scheme.dark")
  }]);
  const languageOptions = createMemo(() => language.locales.map((locale) => ({
    value: locale,
    label: language.label(locale)
  })));
  const noneSound = {
    id: "none",
    label: "sound.option.none"
  };
  const soundOptions = [noneSound, ...SOUND_OPTIONS];
  const mono = () => monoInput(settings.appearance.font());
  const sans = () => sansInput(settings.appearance.uiFont());
  const terminal = () => terminalInput(settings.appearance.terminalFont());
  const soundSelectProps = (enabled, current, setEnabled, set) => ({
    options: soundOptions,
    current: enabled() ? soundOptions.find((o) => o.id === current()) ?? noneSound : noneSound,
    value: (o) => o.id,
    label: (o) => language.t(o.label),
    onHighlight: (option) => {
      if (!option) return;
      playDemoSound(option.id === "none" ? void 0 : option.id);
    },
    onSelect: (option) => {
      if (!option) return;
      if (option.id === "none") {
        setEnabled(false);
        stopDemoSound();
        return;
      }
      setEnabled(true);
      set(option.id);
      playDemoSound(option.id);
    }
  });
  const GeneralSection = () => (() => {
    var _el$ = _tmpl$7$3();
    insert(_el$, createComponent(SettingsListV2, {
      get children() {
        return [createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.row.language.title");
          },
          get description() {
            return language.t("settings.general.row.language.description");
          },
          get children() {
            return createComponent(SelectV2, {
              appearance: "inline",
              "data-action": "settings-language",
              get options() {
                return languageOptions();
              },
              placement: "bottom-end",
              gutter: 6,
              get current() {
                return languageOptions().find((o) => o.value === language.locale());
              },
              value: (o) => o.value,
              label: (o) => o.label,
              onSelect: (option) => option && language.setLocale(option.value)
            });
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("command.permissions.autoaccept.enable");
          },
          get description() {
            return language.t("toast.permissions.autoaccept.on.description");
          },
          get children() {
            var _el$2 = _tmpl$$8();
            insert(_el$2, createComponent(Switch, {
              get checked() {
                return accepting();
              },
              get disabled() {
                return !dir();
              },
              onChange: toggleAccept
            }));
            return _el$2;
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.row.shell.title");
          },
          get description() {
            return language.t("settings.general.row.shell.description");
          },
          get children() {
            return createComponent(SelectV2, {
              appearance: "inline",
              "data-action": "settings-shell",
              get options() {
                return shellOptions();
              },
              get current() {
                return shellOptions().find((o) => o.value === currentShell()) ?? autoOption;
              },
              placement: "bottom-end",
              gutter: 6,
              value: (o) => o.id,
              label: (o) => o.label,
              onSelect: (option) => {
                if (!option) return;
                if (option.value === currentShell()) return;
                serverSync().updateConfig({
                  shell: option.value
                });
              }
            });
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.row.reasoningSummaries.title");
          },
          get description() {
            return language.t("settings.general.row.reasoningSummaries.description");
          },
          get children() {
            var _el$3 = _tmpl$2$5();
            insert(_el$3, createComponent(Switch, {
              get checked() {
                return settings.general.showReasoningSummaries();
              },
              onChange: (checked) => settings.general.setShowReasoningSummaries(checked)
            }));
            return _el$3;
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.row.shellToolPartsExpanded.title");
          },
          get description() {
            return language.t("settings.general.row.shellToolPartsExpanded.description");
          },
          get children() {
            var _el$4 = _tmpl$3$5();
            insert(_el$4, createComponent(Switch, {
              get checked() {
                return settings.general.shellToolPartsExpanded();
              },
              onChange: (checked) => settings.general.setShellToolPartsExpanded(checked)
            }));
            return _el$4;
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.row.editToolPartsExpanded.title");
          },
          get description() {
            return language.t("settings.general.row.editToolPartsExpanded.description");
          },
          get children() {
            var _el$5 = _tmpl$4$5();
            insert(_el$5, createComponent(Switch, {
              get checked() {
                return settings.general.editToolPartsExpanded();
              },
              onChange: (checked) => settings.general.setEditToolPartsExpanded(checked)
            }));
            return _el$5;
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.row.newLayoutDesigns.title");
          },
          get description() {
            return language.t("settings.general.row.newLayoutDesigns.description");
          },
          get children() {
            var _el$6 = _tmpl$5$4();
            insert(_el$6, createComponent(Switch, {
              get checked() {
                return settings.general.newLayoutDesigns();
              },
              onChange: (checked) => {
                settings.general.setNewLayoutDesigns(checked);
                if (checked) return;
                void __vitePreload(() => import("./dialog-settings-BcaPjZrS.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7]) : void 0, import.meta.url).then((module) => {
                  dialog.show(() => createComponent(module.DialogSettings, {}));
                });
              }
            }));
            return _el$6;
          }
        }), createComponent(Show, {
          get when() {
            return memo(() => !!mobile())() && false;
          },
          get children() {
            return createComponent(SettingsRowV2, {
              get title() {
                return language.t("settings.general.row.mobileTitlebarBottom.title");
              },
              get description() {
                return language.t("settings.general.row.mobileTitlebarBottom.description");
              },
              get children() {
                var _el$7 = _tmpl$6$4();
                insert(_el$7, createComponent(Switch, {
                  get checked() {
                    return settings.general.mobileTitlebarPosition() === "bottom";
                  },
                  onChange: (checked) => settings.general.setMobileTitlebarPosition(checked ? "bottom" : "top")
                }));
                return _el$7;
              }
            });
          }
        })];
      }
    }));
    return _el$;
  })();
  const AdvancedSection = () => (() => {
    var _el$8 = _tmpl$10(), _el$9 = _el$8.firstChild;
    insert(_el$9, () => language.t("settings.general.section.advanced"));
    insert(_el$8, createComponent(SettingsListV2, {
      get children() {
        return [createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.row.showFileTree.title");
          },
          get description() {
            return language.t("settings.general.row.showFileTree.description");
          },
          get children() {
            var _el$0 = _tmpl$8$2();
            insert(_el$0, createComponent(Switch, {
              get checked() {
                return settings.general.showFileTree();
              },
              onChange: (checked) => settings.general.setShowFileTree(checked)
            }));
            return _el$0;
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.row.showSearch.title");
          },
          get description() {
            return language.t("settings.general.row.showSearch.description");
          },
          get children() {
            var _el$1 = _tmpl$9$1();
            insert(_el$1, createComponent(Switch, {
              get checked() {
                return settings.general.showSearch();
              },
              onChange: (checked) => settings.general.setShowSearch(checked)
            }));
            return _el$1;
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.row.showStatus.title");
          },
          get description() {
            return language.t("settings.general.row.showStatus.description");
          },
          get children() {
            var _el$10 = _tmpl$0$1();
            insert(_el$10, createComponent(Switch, {
              get checked() {
                return settings.general.showStatus();
              },
              onChange: (checked) => settings.general.setShowStatus(checked)
            }));
            return _el$10;
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.row.showCustomAgents.title");
          },
          get description() {
            return language.t("settings.general.row.showCustomAgents.description");
          },
          get children() {
            var _el$11 = _tmpl$1();
            insert(_el$11, createComponent(Switch, {
              get checked() {
                return settings.general.showCustomAgents();
              },
              onChange: (checked) => settings.general.setShowCustomAgents(checked)
            }));
            return _el$11;
          }
        })];
      }
    }), null);
    return _el$8;
  })();
  const AppearanceSection = () => (() => {
    var _el$12 = _tmpl$10(), _el$13 = _el$12.firstChild;
    insert(_el$13, () => language.t("settings.general.section.appearance"));
    insert(_el$12, createComponent(SettingsListV2, {
      get children() {
        return [createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.row.colorScheme.title");
          },
          get description() {
            return language.t("settings.general.row.colorScheme.description");
          },
          get children() {
            return createComponent(SelectV2, {
              appearance: "inline",
              "data-action": "settings-color-scheme",
              get options() {
                return colorSchemeOptions();
              },
              get current() {
                return colorSchemeOptions().find((o) => o.value === theme.colorScheme());
              },
              placement: "bottom-end",
              gutter: 6,
              value: (o) => o.value,
              label: (o) => o.label,
              onSelect: (option) => option && theme.setColorScheme(option.value),
              onHighlight: (option) => {
                if (!option) return;
                theme.previewColorScheme(option.value);
                return () => theme.cancelPreview();
              }
            });
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.row.theme.title");
          },
          get description() {
            return [memo(() => language.t("settings.general.row.theme.description")), " ", createComponent(Link, {
              "class": "settings-v2-link",
              href: "https://opencode.ai/docs/themes/",
              get children() {
                return language.t("common.learnMore");
              }
            })];
          },
          get children() {
            return createComponent(SelectV2, {
              appearance: "inline",
              "data-action": "settings-theme",
              get options() {
                return themeOptions();
              },
              get current() {
                return themeOptions().find((o) => o.id === theme.themeId());
              },
              placement: "bottom-end",
              gutter: 6,
              value: (o) => o.id,
              label: (o) => o.name,
              onSelect: (option) => {
                if (!option) return;
                theme.setTheme(option.id);
              },
              onHighlight: (option) => {
                if (!option) return;
                theme.previewTheme(option.id);
                return () => theme.cancelPreview();
              }
            });
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.row.uiFont.title");
          },
          get description() {
            return language.t("settings.general.row.uiFont.description");
          },
          get children() {
            var _el$14 = _tmpl$11();
            insert(_el$14, createComponent(TextInputV2, {
              "data-action": "settings-ui-font",
              type: "text",
              appearance: "base",
              get value() {
                return sans();
              },
              onInput: (event) => settings.appearance.setUIFont(event.currentTarget.value),
              placeholder: sansDefault,
              spellcheck: false,
              autocorrect: "off",
              autocomplete: "off",
              autocapitalize: "off",
              get ["aria-label"]() {
                return language.t("settings.general.row.uiFont.title");
              },
              get style() {
                return {
                  "font-family": sansFontFamily(settings.appearance.uiFont())
                };
              }
            }));
            return _el$14;
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.row.font.title");
          },
          get description() {
            return language.t("settings.general.row.font.description");
          },
          get children() {
            var _el$15 = _tmpl$11();
            insert(_el$15, createComponent(TextInputV2, {
              "data-action": "settings-code-font",
              type: "text",
              appearance: "base",
              get value() {
                return mono();
              },
              onInput: (event) => settings.appearance.setFont(event.currentTarget.value),
              placeholder: monoDefault,
              spellcheck: false,
              autocorrect: "off",
              autocomplete: "off",
              autocapitalize: "off",
              get ["aria-label"]() {
                return language.t("settings.general.row.font.title");
              },
              get style() {
                return {
                  "font-family": monoFontFamily(settings.appearance.font())
                };
              }
            }));
            return _el$15;
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.row.terminalFont.title");
          },
          get description() {
            return language.t("settings.general.row.terminalFont.description");
          },
          get children() {
            var _el$16 = _tmpl$11();
            insert(_el$16, createComponent(TextInputV2, {
              "data-action": "settings-terminal-font",
              type: "text",
              appearance: "base",
              get value() {
                return terminal();
              },
              onInput: (event) => settings.appearance.setTerminalFont(event.currentTarget.value),
              placeholder: terminalDefault,
              spellcheck: false,
              autocorrect: "off",
              autocomplete: "off",
              autocapitalize: "off",
              get ["aria-label"]() {
                return language.t("settings.general.row.terminalFont.title");
              },
              get style() {
                return {
                  "font-family": terminalFontFamily(settings.appearance.terminalFont())
                };
              }
            }));
            return _el$16;
          }
        })];
      }
    }), null);
    return _el$12;
  })();
  const NotificationsSection = () => (() => {
    var _el$17 = _tmpl$10(), _el$18 = _el$17.firstChild;
    insert(_el$18, () => language.t("settings.general.section.notifications"));
    insert(_el$17, createComponent(SettingsListV2, {
      get children() {
        return [createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.notifications.agent.title");
          },
          get description() {
            return language.t("settings.general.notifications.agent.description");
          },
          get children() {
            var _el$19 = _tmpl$12();
            insert(_el$19, createComponent(Switch, {
              get checked() {
                return settings.notifications.agent();
              },
              onChange: (checked) => settings.notifications.setAgent(checked)
            }));
            return _el$19;
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.notifications.permissions.title");
          },
          get description() {
            return language.t("settings.general.notifications.permissions.description");
          },
          get children() {
            var _el$20 = _tmpl$13();
            insert(_el$20, createComponent(Switch, {
              get checked() {
                return settings.notifications.permissions();
              },
              onChange: (checked) => settings.notifications.setPermissions(checked)
            }));
            return _el$20;
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.notifications.errors.title");
          },
          get description() {
            return language.t("settings.general.notifications.errors.description");
          },
          get children() {
            var _el$21 = _tmpl$14();
            insert(_el$21, createComponent(Switch, {
              get checked() {
                return settings.notifications.errors();
              },
              onChange: (checked) => settings.notifications.setErrors(checked)
            }));
            return _el$21;
          }
        })];
      }
    }), null);
    return _el$17;
  })();
  const SoundsSection = () => (() => {
    var _el$22 = _tmpl$10(), _el$23 = _el$22.firstChild;
    insert(_el$23, () => language.t("settings.general.section.sounds"));
    insert(_el$22, createComponent(SettingsListV2, {
      get children() {
        return [createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.sounds.agent.title");
          },
          get description() {
            return language.t("settings.general.sounds.agent.description");
          },
          get children() {
            return createComponent(SelectV2, mergeProps({
              appearance: "inline",
              "data-action": "settings-sounds-agent"
            }, () => soundSelectProps(() => settings.sounds.agentEnabled(), () => settings.sounds.agent(), (value) => settings.sounds.setAgentEnabled(value), (id) => settings.sounds.setAgent(id)), {
              placement: "bottom-end",
              gutter: 6
            }));
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.sounds.permissions.title");
          },
          get description() {
            return language.t("settings.general.sounds.permissions.description");
          },
          get children() {
            return createComponent(SelectV2, mergeProps({
              appearance: "inline",
              "data-action": "settings-sounds-permissions"
            }, () => soundSelectProps(() => settings.sounds.permissionsEnabled(), () => settings.sounds.permissions(), (value) => settings.sounds.setPermissionsEnabled(value), (id) => settings.sounds.setPermissions(id)), {
              placement: "bottom-end",
              gutter: 6
            }));
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.sounds.errors.title");
          },
          get description() {
            return language.t("settings.general.sounds.errors.description");
          },
          get children() {
            return createComponent(SelectV2, mergeProps({
              appearance: "inline",
              "data-action": "settings-sounds-errors"
            }, () => soundSelectProps(() => settings.sounds.errorsEnabled(), () => settings.sounds.errors(), (value) => settings.sounds.setErrorsEnabled(value), (id) => settings.sounds.setErrors(id)), {
              placement: "bottom-end",
              gutter: 6
            }));
          }
        })];
      }
    }), null);
    return _el$22;
  })();
  const UpdatesSection = () => (() => {
    var _el$24 = _tmpl$10(), _el$25 = _el$24.firstChild;
    insert(_el$25, () => language.t("settings.general.section.updates"));
    insert(_el$24, createComponent(SettingsListV2, {
      get children() {
        return [createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.general.row.releaseNotes.title");
          },
          get description() {
            return language.t("settings.general.row.releaseNotes.description");
          },
          get children() {
            var _el$26 = _tmpl$15();
            insert(_el$26, createComponent(Switch, {
              get checked() {
                return settings.general.releaseNotes();
              },
              onChange: (checked) => settings.general.setReleaseNotes(checked)
            }));
            return _el$26;
          }
        }), createComponent(SettingsRowV2, {
          get title() {
            return language.t("settings.updates.row.check.title");
          },
          get description() {
            return language.t("settings.updates.row.check.description");
          },
          get children() {
            return createComponent(ButtonV2, {
              size: "normal",
              variant: "neutral",
              get disabled() {
                return !updater.action().run;
              },
              get onClick() {
                return updater.run;
              },
              get children() {
                return language.t(updater.action().label);
              }
            });
          }
        })];
      }
    }), null);
    return _el$24;
  })();
  const DisplaySection = () => createComponent(Show, {
    get when() {
      return desktop();
    },
    get children() {
      var _el$27 = _tmpl$10(), _el$28 = _el$27.firstChild;
      insert(_el$28, () => language.t("settings.general.section.display"));
      insert(_el$27, createComponent(SettingsListV2, {
        get children() {
          return createComponent(SettingsRowV2, {
            get title() {
              return language.t("settings.general.row.pinchZoom.title");
            },
            get description() {
              return language.t("settings.general.row.pinchZoom.description");
            },
            get children() {
              var _el$29 = _tmpl$16();
              insert(_el$29, createComponent(Switch, {
                get checked() {
                  return pinchZoom.latest;
                },
                onChange: onPinchZoomChange
              }));
              return _el$29;
            }
          });
        }
      }), null);
      return _el$27;
    }
  });
  return [(() => {
    var _el$30 = _tmpl$17(), _el$31 = _el$30.firstChild;
    insert(_el$31, () => language.t("settings.tab.general"));
    return _el$30;
  })(), (() => {
    var _el$32 = _tmpl$18();
    insert(_el$32, createComponent(GeneralSection, {}), null);
    insert(_el$32, createComponent(AppearanceSection, {}), null);
    insert(_el$32, createComponent(NotificationsSection, {}), null);
    insert(_el$32, createComponent(SoundsSection, {}), null);
    insert(_el$32, createComponent(Show, {
      get when() {
        return desktop();
      },
      get children() {
        return createComponent(UpdatesSection, {});
      }
    }), null);
    insert(_el$32, createComponent(DisplaySection, {}), null);
    insert(_el$32, createComponent(AdvancedSection, {}), null);
    return _el$32;
  })()];
};
var _tmpl$$7 = /* @__PURE__ */ template(`<div class=settings-v2-tab-header><h2 class=settings-v2-tab-title>`), _tmpl$2$4 = /* @__PURE__ */ template(`<div class=settings-v2-provider-row data-component=custom-provider-section><div class=settings-v2-provider-lead><div class=settings-v2-provider-copy><div class=settings-v2-provider-main><span class=settings-v2-provider-name></span></div><p class=settings-v2-provider-description>`), _tmpl$3$4 = /* @__PURE__ */ template(`<div class="settings-v2-tab-body settings-v2-providers"><div class=settings-v2-section data-component=connected-providers-section><h3 class=settings-v2-section-title></h3></div><div class=settings-v2-section><h3 class=settings-v2-section-title></h3><button type=button class=settings-v2-providers-view-all>`), _tmpl$4$4 = /* @__PURE__ */ template(`<div class=settings-v2-provider-empty>`), _tmpl$5$3 = /* @__PURE__ */ template(`<div class="settings-v2-provider-row group"><div class=settings-v2-provider-lead><div class=settings-v2-provider-main><span class="settings-v2-provider-name truncate">`), _tmpl$6$3 = /* @__PURE__ */ template(`<span class=settings-v2-provider-env-hint>`), _tmpl$7$2 = /* @__PURE__ */ template(`<div class=settings-v2-provider-row><div class=settings-v2-provider-lead><div class=settings-v2-provider-copy><div class=settings-v2-provider-main><span class=settings-v2-provider-name>`), _tmpl$8$1 = /* @__PURE__ */ template(`<p class=settings-v2-provider-description>`);
const PROVIDER_NOTES = [{
  match: (id) => id === "opencode",
  key: "dialog.provider.opencode.note"
}, {
  match: (id) => id === "opencode-go",
  key: "dialog.provider.opencodeGo.tagline"
}, {
  match: (id) => id === "anthropic",
  key: "dialog.provider.anthropic.note"
}, {
  match: (id) => id.startsWith("github-copilot"),
  key: "dialog.provider.copilot.note"
}, {
  match: (id) => id === "openai",
  key: "dialog.provider.openai.note"
}, {
  match: (id) => id === "google",
  key: "dialog.provider.google.note"
}, {
  match: (id) => id === "openrouter",
  key: "dialog.provider.openrouter.note"
}, {
  match: (id) => id === "vercel",
  key: "dialog.provider.vercel.note"
}];
const PROVIDER_ICON_SIZE$1 = 16;
const SettingsProvidersV2 = () => {
  const dialog = useDialog();
  const language = useLanguage();
  const serverSdk = useServerSDK();
  const serverSync = useServerSync();
  const providers = useProviders();
  const connected = createMemo(() => {
    return providers.connected().filter((p) => p.id !== "opencode" || Object.values(p.models).find((m) => m.cost?.input));
  });
  const popular = createMemo(() => {
    const connectedIDs = new Set(connected().map((p) => p.id));
    const items = providers.popular().filter((p) => !connectedIDs.has(p.id)).slice();
    items.sort((a, b) => popularProviders.indexOf(a.id) - popularProviders.indexOf(b.id));
    return items;
  });
  const source = (item) => {
    if (!("source" in item)) return;
    const value = item.source;
    if (value === "env" || value === "api" || value === "config" || value === "custom") return value;
    return;
  };
  const type = (item) => {
    const current = source(item);
    if (current === "env") return language.t("settings.providers.tag.environment");
    if (current === "api") return language.t("provider.connect.method.apiKey");
    if (current === "config") {
      if (isConfigCustom(item.id)) return language.t("settings.providers.tag.custom");
      return language.t("settings.providers.tag.config");
    }
    if (current === "custom") return language.t("settings.providers.tag.custom");
    return language.t("settings.providers.tag.other");
  };
  const canDisconnect = (item) => source(item) !== "env";
  const note = (id) => PROVIDER_NOTES.find((item) => item.match(id))?.key;
  const isConfigCustom = (providerID) => {
    const provider = serverSync().data.config.provider?.[providerID];
    if (!provider) return false;
    if (provider.npm !== "@ai-sdk/openai-compatible") return false;
    if (!provider.models || Object.keys(provider.models).length === 0) return false;
    return true;
  };
  const disableProvider = async (providerID, name) => {
    const before = serverSync().data.config.disabled_providers ?? [];
    const next = before.includes(providerID) ? before : [...before, providerID];
    serverSync().set("config", "disabled_providers", next);
    await serverSync().updateConfig({
      disabled_providers: next
    }).then(() => {
      showToast({
        variant: "success",
        icon: "circle-check",
        title: language.t("provider.disconnect.toast.disconnected.title", {
          provider: name
        }),
        description: language.t("provider.disconnect.toast.disconnected.description", {
          provider: name
        })
      });
    }).catch((err) => {
      serverSync().set("config", "disabled_providers", before);
      const message = err instanceof Error ? err.message : String(err);
      showToast({
        title: language.t("common.requestFailed"),
        description: message
      });
    });
  };
  const disconnect = async (providerID, name) => {
    if (isConfigCustom(providerID)) {
      await serverSdk().client.auth.remove({
        providerID
      }).catch(() => void 0);
      await disableProvider(providerID, name);
      return;
    }
    await serverSdk().client.auth.remove({
      providerID
    }).then(async () => {
      await serverSdk().client.global.dispose();
      showToast({
        variant: "success",
        icon: "circle-check",
        title: language.t("provider.disconnect.toast.disconnected.title", {
          provider: name
        }),
        description: language.t("provider.disconnect.toast.disconnected.description", {
          provider: name
        })
      });
    }).catch((err) => {
      const message = err instanceof Error ? err.message : String(err);
      showToast({
        title: language.t("common.requestFailed"),
        description: message
      });
    });
  };
  return [(() => {
    var _el$ = _tmpl$$7(), _el$2 = _el$.firstChild;
    insert(_el$2, () => language.t("settings.providers.title"));
    return _el$;
  })(), (() => {
    var _el$3 = _tmpl$3$4(), _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$6 = _el$4.nextSibling, _el$7 = _el$6.firstChild, _el$12 = _el$7.nextSibling;
    insert(_el$5, () => language.t("settings.providers.section.connected"));
    insert(_el$4, createComponent(SettingsListV2, {
      get children() {
        return createComponent(Show, {
          get when() {
            return connected().length > 0;
          },
          get fallback() {
            return (() => {
              var _el$13 = _tmpl$4$4();
              insert(_el$13, () => language.t("settings.providers.connected.empty"));
              return _el$13;
            })();
          },
          get children() {
            return createComponent(For, {
              get each() {
                return connected();
              },
              children: (item) => (() => {
                var _el$14 = _tmpl$5$3(), _el$15 = _el$14.firstChild, _el$16 = _el$15.firstChild, _el$17 = _el$16.firstChild;
                insert(_el$15, createComponent(ProviderIcon, {
                  get id() {
                    return item.id;
                  },
                  width: PROVIDER_ICON_SIZE$1,
                  height: PROVIDER_ICON_SIZE$1,
                  "class": "settings-v2-provider-icon shrink-0"
                }), _el$16);
                insert(_el$17, () => item.name);
                insert(_el$16, createComponent(Tag, {
                  get children() {
                    return type(item);
                  }
                }), null);
                insert(_el$14, createComponent(Show, {
                  get when() {
                    return canDisconnect(item);
                  },
                  get fallback() {
                    return (() => {
                      var _el$18 = _tmpl$6$3();
                      insert(_el$18, () => language.t("settings.providers.connected.environmentDescription"));
                      return _el$18;
                    })();
                  },
                  get children() {
                    return createComponent(ButtonV2, {
                      size: "normal",
                      variant: "ghost-muted",
                      onClick: () => void disconnect(item.id, item.name),
                      get children() {
                        return language.t("common.disconnect");
                      }
                    });
                  }
                }), null);
                return _el$14;
              })()
            });
          }
        });
      }
    }), null);
    insert(_el$7, () => language.t("settings.providers.section.popular"));
    insert(_el$6, createComponent(SettingsListV2, {
      get children() {
        return [createComponent(For, {
          get each() {
            return popular();
          },
          children: (item) => (() => {
            var _el$19 = _tmpl$7$2(), _el$20 = _el$19.firstChild, _el$21 = _el$20.firstChild, _el$22 = _el$21.firstChild, _el$23 = _el$22.firstChild;
            insert(_el$20, createComponent(ProviderIcon, {
              get id() {
                return item.id;
              },
              width: PROVIDER_ICON_SIZE$1,
              height: PROVIDER_ICON_SIZE$1,
              "class": "settings-v2-provider-icon shrink-0"
            }), _el$21);
            insert(_el$23, () => item.name);
            insert(_el$22, createComponent(Show, {
              get when() {
                return item.id === "opencode" || item.id === "opencode-go";
              },
              get children() {
                return createComponent(Tag, {
                  get children() {
                    return language.t("dialog.provider.tag.recommended");
                  }
                });
              }
            }), null);
            insert(_el$21, createComponent(Show, {
              get when() {
                return note(item.id);
              },
              children: (key) => (() => {
                var _el$24 = _tmpl$8$1();
                insert(_el$24, () => language.t(key()));
                return _el$24;
              })()
            }), null);
            insert(_el$19, createComponent(ButtonV2, {
              size: "normal",
              variant: "neutral",
              icon: "plus",
              onClick: () => {
                dialog.show(() => createComponent(DialogConnectProvider, {
                  get provider() {
                    return item.id;
                  }
                }));
              },
              get children() {
                return language.t("common.connect");
              }
            }), null);
            return _el$19;
          })()
        }), (() => {
          var _el$8 = _tmpl$2$4(), _el$9 = _el$8.firstChild, _el$0 = _el$9.firstChild, _el$1 = _el$0.firstChild, _el$10 = _el$1.firstChild, _el$11 = _el$1.nextSibling;
          insert(_el$9, createComponent(ProviderIcon, {
            id: "synthetic",
            width: PROVIDER_ICON_SIZE$1,
            height: PROVIDER_ICON_SIZE$1,
            "class": "settings-v2-provider-icon shrink-0"
          }), _el$0);
          insert(_el$10, () => language.t("provider.custom.title"));
          insert(_el$1, createComponent(Tag, {
            get children() {
              return language.t("settings.providers.tag.custom");
            }
          }), null);
          insert(_el$11, () => language.t("settings.providers.custom.description"));
          insert(_el$8, createComponent(ButtonV2, {
            size: "normal",
            variant: "neutral",
            icon: "plus",
            onClick: () => {
              dialog.show(() => createComponent(DialogCustomProvider, {
                back: "close"
              }));
            },
            get children() {
              return language.t("common.connect");
            }
          }), null);
          return _el$8;
        })()];
      }
    }), _el$12);
    _el$12.$$click = () => {
      dialog.show(() => createComponent(DialogSelectProvider, {}));
    };
    insert(_el$12, () => language.t("dialog.provider.viewAll"));
    return _el$3;
  })()];
};
delegateEvents(["click"]);
var _tmpl$$6 = /* @__PURE__ */ template(`<div class="settings-v2-tab-header settings-v2-tab-header--stacked"><h2 class=settings-v2-tab-title></h2><div class=settings-v2-tab-search>`), _tmpl$2$3 = /* @__PURE__ */ template(`<div class="settings-v2-tab-body settings-v2-models">`), _tmpl$3$3 = /* @__PURE__ */ template(`<div class=settings-v2-models-status>`), _tmpl$4$3 = /* @__PURE__ */ template(`<span class=settings-v2-models-status-filter>&quot;<!>&quot;`), _tmpl$5$2 = /* @__PURE__ */ template(`<div class=settings-v2-models-status><span>`), _tmpl$6$2 = /* @__PURE__ */ template(`<div class=settings-v2-section data-component=settings-models-provider><div class=settings-v2-models-group-header><h3 class=settings-v2-section-title>`), _tmpl$7$1 = /* @__PURE__ */ template(`<div>`);
const PROVIDER_ICON_SIZE = 16;
const SettingsModelsV2 = () => {
  const language = useLanguage();
  const models = useModels();
  const list = useFilteredList({
    items: (_filter) => models.list(),
    key: (x) => `${x.provider.id}:${x.id}`,
    filterKeys: ["provider.name", "name", "id"],
    sortBy: (a, b) => a.name.localeCompare(b.name),
    groupBy: (x) => x.provider.id,
    sortGroupsBy: (a, b) => {
      const aIndex = popularProviders.indexOf(a.category);
      const bIndex = popularProviders.indexOf(b.category);
      const aPopular = aIndex >= 0;
      const bPopular = bIndex >= 0;
      if (aPopular && !bPopular) return -1;
      if (!aPopular && bPopular) return 1;
      if (aPopular && bPopular) return aIndex - bIndex;
      const aName = a.items[0].provider.name;
      const bName = b.items[0].provider.name;
      return aName.localeCompare(bName);
    }
  });
  return [(() => {
    var _el$ = _tmpl$$6(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    insert(_el$2, () => language.t("settings.models.title"));
    insert(_el$3, createComponent(TextInputV2, {
      type: "search",
      appearance: "base",
      get value() {
        return list.filter();
      },
      onInput: (event) => list.onInput(event.currentTarget.value),
      get placeholder() {
        return language.t("dialog.model.search.placeholder");
      },
      spellcheck: false,
      autocorrect: "off",
      autocomplete: "off",
      autocapitalize: "off",
      get ["aria-label"]() {
        return language.t("dialog.model.search.placeholder");
      }
    }), null);
    insert(_el$3, createComponent(Show, {
      get when() {
        return list.filter();
      },
      get children() {
        return createComponent(IconButtonV2, {
          type: "button",
          variant: "ghost-muted",
          size: "small",
          "class": "settings-v2-tab-search-clear",
          get icon() {
            return createComponent(Icon, {
              name: "close",
              size: "large",
              "class": "text-v2-icon-icon-muted"
            });
          },
          onClick: () => list.clear()
        });
      }
    }), null);
    return _el$;
  })(), (() => {
    var _el$4 = _tmpl$2$3();
    insert(_el$4, createComponent(Show, {
      get when() {
        return !list.grouped.loading;
      },
      get fallback() {
        return (() => {
          var _el$5 = _tmpl$3$3();
          insert(_el$5, () => language.t("common.loading"), null);
          insert(_el$5, () => language.t("common.loading.ellipsis"), null);
          return _el$5;
        })();
      },
      get children() {
        return createComponent(Show, {
          get when() {
            return list.flat().length > 0;
          },
          get fallback() {
            return (() => {
              var _el$6 = _tmpl$5$2(), _el$7 = _el$6.firstChild;
              insert(_el$7, () => language.t("dialog.model.empty"));
              insert(_el$6, createComponent(Show, {
                get when() {
                  return list.filter();
                },
                get children() {
                  var _el$8 = _tmpl$4$3(), _el$9 = _el$8.firstChild, _el$1 = _el$9.nextSibling;
                  _el$1.nextSibling;
                  insert(_el$8, () => list.filter(), _el$1);
                  return _el$8;
                }
              }), null);
              return _el$6;
            })();
          },
          get children() {
            return createComponent(For, {
              get each() {
                return list.grouped.latest;
              },
              children: (group) => (() => {
                var _el$10 = _tmpl$6$2(), _el$11 = _el$10.firstChild, _el$12 = _el$11.firstChild;
                insert(_el$11, createComponent(ProviderIcon, {
                  get id() {
                    return group.category;
                  },
                  width: PROVIDER_ICON_SIZE,
                  height: PROVIDER_ICON_SIZE,
                  "class": "settings-v2-models-provider-icon shrink-0"
                }), _el$12);
                insert(_el$12, () => group.items[0].provider.name);
                insert(_el$10, createComponent(SettingsListV2, {
                  get children() {
                    return createComponent(For, {
                      get each() {
                        return group.items;
                      },
                      children: (item) => {
                        const key = {
                          providerID: item.provider.id,
                          modelID: item.id
                        };
                        return createComponent(SettingsRowV2, {
                          get title() {
                            return item.name;
                          },
                          description: "",
                          get children() {
                            var _el$13 = _tmpl$7$1();
                            insert(_el$13, createComponent(Switch, {
                              get checked() {
                                return models.visible(key);
                              },
                              onChange: (checked) => {
                                models.setVisibility(key, checked);
                              },
                              hideLabel: true,
                              get children() {
                                return item.name;
                              }
                            }));
                            return _el$13;
                          }
                        });
                      }
                    });
                  }
                }), null);
                return _el$10;
              })()
            });
          }
        });
      }
    }));
    return _el$4;
  })()];
};
var _tmpl$$5 = /* @__PURE__ */ template(`<svg><circle cx=8 cy=8 r=6 data-slot=loader-v2-background stroke-width=2></circle><circle cx=8 cy=8 r=6 data-slot=loader-v2-progress pathLength=100 stroke-width=2 stroke-dasharray="33 67">`);
function LoaderV2(props) {
  const [local, rest] = splitProps(props, ["class", "classList", "width", "height"]);
  return (() => {
    var _el$ = _tmpl$$5();
    spread(_el$, mergeProps(rest, {
      get ["class"]() {
        return local.class;
      },
      get classList() {
        return local.classList;
      },
      get width() {
        return local.width ?? 16;
      },
      get height() {
        return local.height ?? 16;
      },
      "viewBox": "0 0 16 16",
      "fill": "none",
      "xmlns": "http://www.w3.org/2000/svg",
      "data-component": "loader-v2",
      get ["aria-hidden"]() {
        return rest["aria-hidden"] ?? "true";
      }
    }), true, true);
    return _el$;
  })();
}
var _tmpl$$4 = /* @__PURE__ */ template(`<div data-slot=radio-v2-items>`), _tmpl$2$2 = /* @__PURE__ */ template(`<div data-slot=radio-v2-item-control-stack>`), _tmpl$3$2 = /* @__PURE__ */ template(`<div data-slot=radio-v2-item-text><span data-slot=radio-v2-item-label-text>`), _tmpl$4$2 = /* @__PURE__ */ template(`<span data-slot=radio-v2-item-description>`);
function RadioGroupV2(props) {
  const [local, others] = splitProps(props, ["class", "classList", "children", "label", "description", "hideLabel"]);
  return createComponent(RadioGroup, mergeProps(others, {
    "data-component": "radio-v2",
    get classList() {
      return {
        ...local.classList,
        [local.class ?? ""]: !!local.class
      };
    },
    get children() {
      return [createComponent(Show, {
        get when() {
          return local.label;
        },
        children: (label) => createComponent(RadioGroup.Label, {
          "data-slot": "radio-v2-label",
          get classList() {
            return {
              "sr-only": local.hideLabel
            };
          },
          get children() {
            return label();
          }
        })
      }), createComponent(Show, {
        get when() {
          return local.description;
        },
        children: (description) => createComponent(RadioGroup.Description, {
          "data-slot": "radio-v2-description",
          get children() {
            return description();
          }
        })
      }), (() => {
        var _el$ = _tmpl$$4();
        insert(_el$, () => local.children);
        return _el$;
      })(), createComponent(RadioGroup.ErrorMessage, {
        "data-slot": "radio-v2-error"
      })];
    }
  }));
}
function RadioItemV2(props) {
  const [local, others] = splitProps(props, ["class", "classList", "label", "description", "hideLabel"]);
  return createComponent(RadioGroup.Item, mergeProps(others, {
    "data-slot": "radio-v2-item",
    get classList() {
      return {
        ...local.classList,
        [local.class ?? ""]: !!local.class
      };
    },
    get children() {
      return [createComponent(RadioGroup.ItemInput, {
        "data-slot": "radio-v2-item-input"
      }), (() => {
        var _el$2 = _tmpl$2$2();
        insert(_el$2, createComponent(RadioGroup.ItemControl, {
          "data-slot": "radio-v2-item-control",
          get children() {
            return createComponent(RadioGroup.ItemIndicator, {
              "data-slot": "radio-v2-item-indicator"
            });
          }
        }));
        return _el$2;
      })(), createComponent(RadioGroup.ItemLabel, {
        "data-slot": "radio-v2-item-label",
        get classList() {
          return {
            "sr-only": local.hideLabel
          };
        },
        get children() {
          var _el$3 = _tmpl$3$2(), _el$4 = _el$3.firstChild;
          insert(_el$4, () => local.label);
          insert(_el$3, createComponent(Show, {
            get when() {
              return local.description;
            },
            children: (description) => (() => {
              var _el$5 = _tmpl$4$2();
              insert(_el$5, description);
              return _el$5;
            })()
          }), null);
          return _el$3;
        }
      })];
    }
  }));
}
function isHiddenDistro(name) {
  return /^docker-desktop(?:-data)?$/i.test(name);
}
const wslRuntimeRetryable = (runtime) => runtime.kind === "failed" || runtime.kind === "stopped";
function wslOpencodeAction(check) {
  if (!check) return;
  if (!check.resolvedPath) return "Install OpenCode";
  if (check.matchesDesktop === false) return "Update OpenCode";
}
function wslDistroReady(state, name) {
  const installed = state?.installed.find((item) => item.name === name);
  const probe = state?.distroProbes[name];
  if (!probe || !installed) return false;
  if (installed.version === 1) return false;
  return probe.canExecute && probe.hasBash && probe.hasCurl;
}
function addServerViewModel(input) {
  const state = input.state;
  const visibleInstalledDistros = (state?.installed ?? []).filter((item) => !isHiddenDistro(item.name));
  const visibleOnlineDistros = (state?.online ?? []).filter((item) => !isHiddenDistro(item.name));
  const existingServerDistros = new Set((state?.servers ?? []).map((item) => item.config.distro));
  const addableInstalledDistros = visibleInstalledDistros.filter((item) => !existingServerDistros.has(item.name));
  const selectedDistro = addServerSelectedDistro(input.selectedDistro, visibleInstalledDistros, addableInstalledDistros);
  const opencodeCheck = selectedDistro ? state?.opencodeChecks[selectedDistro] ?? null : null;
  const installableDistros = addServerInstallableDistros(visibleInstalledDistros, visibleOnlineDistros);
  const filteredInstallableDistros = addServerFilteredInstallableDistros(installableDistros, input.catalogSearch);
  const catalogTarget = addServerCatalogTarget(input.catalogTarget, filteredInstallableDistros);
  const busy = !!state?.job || input.adding || input.probingAddable;
  return {
    busy,
    runtimeState: addServerRuntimeState(state),
    visibleInstalledDistros,
    visibleOnlineDistros,
    addableInstalledDistros,
    selectedDistro,
    opencodeCheck,
    wslReady: !!state?.runtime?.available && !state?.pendingRestart,
    distroStatuses: Object.fromEntries(
      addableInstalledDistros.flatMap((item) => {
        const status = addServerDistroStatus({ state, name: item.name, probingAddable: input.probingAddable });
        if (!status) return [];
        return [[item.name, status]];
      })
    ),
    primaryButton: addServerPrimaryButton({
      state,
      selectedDistro,
      opencodeCheck,
      adding: input.adding,
      probingAddable: input.probingAddable
    }),
    installableDistros,
    filteredInstallableDistros,
    catalogTarget,
    installingCatalogDistro: state?.job?.kind === "install-distro"
  };
}
function addServerSelectedDistro(selected, visibleInstalledDistros, addableInstalledDistros) {
  if (selected && addableInstalledDistros.some((item) => item.name === selected && item.version !== 1)) return selected;
  const defaultDistro = visibleInstalledDistros.find((item) => item.isDefault);
  if (defaultDistro && defaultDistro.version !== 1 && addableInstalledDistros.some((item) => item.name === defaultDistro.name)) {
    return defaultDistro.name;
  }
  return addableInstalledDistros.find((item) => item.version !== 1)?.name ?? null;
}
function addServerRuntimeState(state) {
  if (!state) return "loading";
  if (state.pendingRestart) return "pendingRestart";
  if (!state.runtime) return "checking";
  if (!state.runtime.available) return "unavailable";
  return "ready";
}
function addServerDistroStatus(input) {
  const installed = input.state?.installed.find((item) => item.name === input.name);
  if (installed?.version === 1) return { label: { key: "wsl.onboarding.distroStatus.unsupported" }, tone: "muted" };
  const job = input.state?.job;
  const probe = input.state?.distroProbes[input.name];
  if (!probe) {
    if (input.probingAddable || job?.kind === "probe-addable" && job.distros.includes(input.name)) {
      return checkingStatus();
    }
    return;
  }
  if (!probe.canExecute) {
    if (!installed) {
      return { label: { key: "wsl.onboarding.distroNotInstalled", params: { distro: input.name } }, tone: "warning" };
    }
    return { label: { key: "wsl.onboarding.openDistroOnce", params: { distro: input.name } }, tone: "warning" };
  }
  if (!probe.hasBash || !probe.hasCurl) {
    return { label: { key: "wsl.onboarding.distroStatus.missingTools" }, tone: "warning" };
  }
  const check = input.state?.opencodeChecks[input.name];
  if (!check) {
    if (input.probingAddable || job?.kind === "probe-addable" && job.distros.includes(input.name)) {
      return checkingStatus();
    }
    return;
  }
  if (check.matchesDesktop === false) return { label: { key: "wsl.onboarding.updateOpencode" }, tone: "warning" };
  if (!check.resolvedPath) return { label: { key: "wsl.onboarding.distroStatus.opencodeMissing" }, tone: "warning" };
  if (check.error) return { label: { key: "wsl.onboarding.installOpencode" }, tone: "warning" };
  return { label: { key: "wsl.onboarding.distroStatus.ready" }, tone: "success" };
}
function checkingStatus() {
  return { label: { key: "wsl.onboarding.distroStatus.checking" }, tone: "muted" };
}
function addServerPrimaryButton(input) {
  const ready = !!input.selectedDistro && wslDistroReady(input.state, input.selectedDistro);
  const probingSelected = input.probingAddable && !addServerSelectedDistroSettled(input.state, input.selectedDistro);
  const probingOpencode = probingSelected || ready && (!input.opencodeCheck || !!input.selectedDistro && input.state?.job?.kind === "probe-addable" && input.state.job.distros.includes(input.selectedDistro));
  const installingOpencode = input.state?.job?.kind === "install-opencode" && input.state.job.distro === input.selectedDistro;
  if (!ready || probingOpencode) {
    return {
      variant: "contrast",
      label: probingSelected ? { key: "wsl.onboarding.distroStatus.checking" } : { key: "wsl.server.add" },
      disabled: true,
      action: null,
      loading: probingSelected,
      width: null
    };
  }
  if (!addServerOpencodeReady(input.opencodeCheck)) {
    const update = !!input.opencodeCheck?.resolvedPath && input.opencodeCheck.matchesDesktop === false;
    return {
      variant: "neutral",
      label: installingOpencode ? { key: "wsl.onboarding.updatingOpencode" } : update ? { key: "wsl.onboarding.updateOpencode" } : { key: "wsl.onboarding.installOpencode" },
      disabled: !!input.state?.job || input.adding,
      action: "install-opencode",
      loading: installingOpencode,
      width: update ? "138px" : "129px"
    };
  }
  return {
    variant: "contrast",
    label: input.adding ? { key: "wsl.onboarding.adding" } : { key: "wsl.server.add" },
    disabled: input.adding || !!input.state?.job,
    action: "add",
    loading: input.adding,
    width: null
  };
}
function addServerOpencodeReady(check) {
  return !!check?.resolvedPath && check.matchesDesktop !== false && !check.error;
}
function addServerSelectedDistroSettled(state, selectedDistro) {
  if (!selectedDistro) return false;
  const installed = state?.installed.find((item) => item.name === selectedDistro);
  if (installed?.version === 1) return false;
  if (!state?.distroProbes[selectedDistro]) return false;
  if (!wslDistroReady(state, selectedDistro)) return true;
  return !!state.opencodeChecks[selectedDistro];
}
function addServerInstallableDistros(installedDistros, onlineDistros) {
  const installed = new Set(installedDistros.map((item) => item.name));
  const hasVersionedUbuntu = onlineDistros.some((item) => /^Ubuntu-\d/.test(item.name));
  return onlineDistros.filter((item) => !installed.has(item.name)).filter((item) => item.name !== "Ubuntu" || !hasVersionedUbuntu);
}
function addServerFilteredInstallableDistros(installableDistros, search) {
  const query = search.trim();
  if (!query) return installableDistros;
  return fuzzysort.go(query, installableDistros, { keys: ["label", "name"] }).map((item) => item.obj);
}
function addServerCatalogTarget(target, distros) {
  if (target && distros.some((item) => item.name === target)) return target;
  return distros[0]?.name ?? null;
}
function addableProbePlan(input) {
  const state = input.state;
  if (!state?.runtime?.available || state.pendingRestart || input.view !== "main" || input.adding) return;
  if (state.job) return;
  const ordered = input.selectedDistro ? [
    ...input.addableInstalledDistros.filter((item) => item.name === input.selectedDistro),
    ...input.addableInstalledDistros.filter((item) => item.name !== input.selectedDistro)
  ] : input.addableInstalledDistros;
  const pending = ordered.flatMap((item) => {
    if (item.version === 1) return [];
    if (!state.distroProbes[item.name]) return [`distro:${item.name}`];
    if (wslDistroReady(state, item.name) && !state.opencodeChecks[item.name]) return [`opencode:${item.name}`];
    return [];
  });
  if (!pending.length) return;
  return {
    key: pending.join("|"),
    distros: ordered.filter((item) => item.version !== 1).map((item) => item.name)
  };
}
function autoProbePlan(input) {
  if (!input.state || input.busy || input.state.pendingRestart) return;
  if (!input.state.runtime) return { key: "runtime", action: "probeRuntime" };
  if (!input.state.runtime.available) return;
  if (input.state.installed.length || input.state.online.length) return;
  return { key: "distros", action: "refreshDistros" };
}
function addServerProbePlan(input) {
  const auto = autoProbePlan({ state: input.state, busy: input.busy });
  if (auto) return { kind: "auto", key: `auto:${auto.key}`, plan: auto };
  const addable = addableProbePlan(input);
  if (addable) return { kind: "addable", key: `addable:${addable.key}`, plan: addable };
}
function createProbeFailureGate() {
  let failed;
  return {
    accepts(key) {
      return key !== failed;
    },
    settle(key, error) {
      if (error) failed = key;
    },
    reset() {
      failed = void 0;
    }
  };
}
async function runAddableProbePlan(input) {
  await input.api.probeAddable(input.plan.distros);
}
function useWslAddServerProbes(input) {
  const gate = createProbeFailureGate();
  const probe = useMutation(() => ({
    mutationFn: async (command) => {
      if (command.kind === "addable") {
        await runAddableProbePlan({ plan: command.plan, api: input.api });
        return;
      }
      if (command.plan.action === "probeRuntime") await input.api.probeRuntime();
      if (command.plan.action === "refreshDistros") await input.api.refreshDistros();
    },
    onError: input.onError,
    onSettled: (_result, error, command) => {
      if (command) gate.settle(command.key, error);
    }
  }));
  createEffect(() => {
    if (probe.isPending) return;
    const command = addServerProbePlan({
      state: input.state(),
      view: input.view(),
      adding: input.adding(),
      busy: input.busy(),
      selectedDistro: input.selectedDistro(),
      addableInstalledDistros: input.addableInstalledDistros()
    });
    if (!command || !gate.accepts(command.key)) return;
    probe.mutate(command);
  });
  return {
    probingAddable: () => probe.isPending && probe.variables?.kind === "addable",
    resetProbeFailure: () => gate.reset()
  };
}
var _tmpl$$3 = /* @__PURE__ */ template(`<div class=settings-v2-wsl-section-header><span class=settings-v2-wsl-section-title>`), _tmpl$2$1 = /* @__PURE__ */ template(`<div class=settings-v2-wsl-distro-list>`), _tmpl$3$1 = /* @__PURE__ */ template(`<button type=button class=settings-v2-wsl-catalog-card><span class=settings-v2-wsl-catalog-icon aria-hidden=true><svg width=16 height=16 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M13.5564 10.4443V13.5554H4.22309C3.24087 13.5554 2.44531 13.5554 2.44531 13.5554V10.4443M11.112 5.99989L8.00087 9.111L4.88976 5.99989M8.00087 9.111L8.00087 2.44434"stroke=currentColor></path></svg></span><span class=settings-v2-wsl-catalog-copy><span class=settings-v2-wsl-catalog-title></span><span class=settings-v2-wsl-catalog-description></span></span><span class=settings-v2-wsl-catalog-chevron aria-hidden=true><svg width=16 height=16 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M6 12L10 8L6 4"stroke=currentColor>`), _tmpl$4$1 = /* @__PURE__ */ template(`<div class=settings-v2-wsl-loading>`), _tmpl$5$1 = /* @__PURE__ */ template(`<div class=settings-v2-wsl-catalog-list>`), _tmpl$6$1 = /* @__PURE__ */ template(`<span class=settings-v2-wsl-distro-label>`), _tmpl$7 = /* @__PURE__ */ template(`<div class=settings-v2-wsl-distro-list><div class=settings-v2-wsl-distro-empty>`), _tmpl$8 = /* @__PURE__ */ template(`<span class=settings-v2-wsl-distro-status>`), _tmpl$9 = /* @__PURE__ */ template(`<p class=settings-v2-wsl-unavailable-error>`), _tmpl$0 = /* @__PURE__ */ template(`<div class=settings-v2-wsl-not-installed-content><div class=settings-v2-wsl-not-installed-message><svg class=settings-v2-wsl-not-installed-icon width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg aria-hidden=true><g clip-path=url(#settings-v2-wsl-warning-clip)><path fill-rule=evenodd clip-rule=evenodd d="M12 -0.00244141L23.6926 20.2498H0.308594L12 -0.00244141ZM12.7954 6.32932C12.5844 6.11834 12.2982 5.99982 11.9999 5.99982C11.7015 5.99982 11.4154 6.11834 11.2044 6.32932C10.9934 6.5403 10.8749 6.82645 10.8749 7.12482V11.6248C10.8749 11.9232 10.9934 12.2093 11.2044 12.4203C11.4154 12.6313 11.7015 12.7498 11.9999 12.7498C12.2982 12.7498 12.5844 12.6313 12.7954 12.4203C13.0064 12.2093 13.1249 11.9232 13.1249 11.6248V7.12482C13.1249 6.82645 13.0064 6.5403 12.7954 6.32932ZM13.0605 17.5605C12.7792 17.8418 12.3977 17.9998 11.9999 17.9998C11.6021 17.9998 11.2205 17.8418 10.9392 17.5605C10.6579 17.2792 10.4999 16.8976 10.4999 16.4998C10.4999 16.102 10.6579 15.7205 10.9392 15.4392C11.2205 15.1579 11.6021 14.9998 11.9999 14.9998C12.3977 14.9998 12.7792 15.1579 13.0605 15.4392C13.3418 15.7205 13.4999 16.102 13.4999 16.4998C13.4999 16.8976 13.3418 17.2792 13.0605 17.5605Z"fill=#DBDBDB></path></g><defs><clipPath id=settings-v2-wsl-warning-clip><rect width=24 height=24 fill=white></rect></clipPath></defs></svg><h2 class=settings-v2-wsl-not-installed-title></h2><p class=settings-v2-wsl-not-installed-description>`);
function isWslRuntimeMissing(error) {
  if (!error) return true;
  return /WSL is not installed|not been installed|wsl(?:\.exe)? --install/i.test(error);
}
function translate(language, value) {
  if (value.params) return language.t(value.key, value.params);
  return language.t(value.key);
}
function DialogAddWslServer(props = {}) {
  const language = useLanguage();
  const controller = useWslAddServerController(props);
  const model = controller.model;
  const primaryButton = () => model().primaryButton;
  const primaryButtonStyle = () => {
    const width = primaryButton().width;
    if (!width) return void 0;
    return {
      width
    };
  };
  return createComponent(Show, {
    get when() {
      return memo(() => !!!controller.wslServers.isPending)() && !controller.wslServers.isError;
    },
    get fallback() {
      return createComponent(Dialog, {
        fit: true,
        "class": "settings-v2-wsl-dialog",
        get children() {
          return createComponent(Show, {
            get when() {
              return !controller.wslServers.isError;
            },
            get fallback() {
              return (() => {
                var _el$0 = _tmpl$4$1();
                insert(_el$0, () => controller.loadError());
                return _el$0;
              })();
            },
            get children() {
              var _el$9 = _tmpl$4$1();
              insert(_el$9, createComponent(LoaderV2, {}));
              return _el$9;
            }
          });
        }
      });
    },
    get children() {
      return createComponent(Show, {
        get when() {
          return model().runtimeState === "ready";
        },
        get fallback() {
          return createComponent(Show, {
            get when() {
              return model().runtimeState === "checking" || model().runtimeState === "loading";
            },
            get fallback() {
              return createComponent(DialogWslSetup, {
                get state() {
                  return model().runtimeState;
                },
                get error() {
                  return controller.runtimeError();
                },
                get installable() {
                  return isWslRuntimeMissing(controller.runtimeError());
                },
                get busy() {
                  return model().busy;
                },
                get onInstall() {
                  return controller.installWsl;
                }
              });
            },
            get children() {
              return createComponent(Dialog, {
                fit: true,
                "class": "settings-v2-wsl-dialog",
                get children() {
                  var _el$1 = _tmpl$4$1();
                  insert(_el$1, createComponent(LoaderV2, {}));
                  return _el$1;
                }
              });
            }
          });
        },
        get children() {
          return createComponent(Dialog, {
            fit: true,
            "class": "settings-v2-wsl-dialog",
            get children() {
              return [createComponent(DialogHeader, {
                hideClose: true,
                get children() {
                  return createComponent(DialogTitle, {
                    get children() {
                      return memo(() => controller.view() === "main")() ? language.t("wsl.server.add") : language.t("wsl.onboarding.installDistro");
                    }
                  });
                }
              }), createComponent(DividerV2, {}), createComponent(Show, {
                get when() {
                  return controller.view() === "main";
                },
                get fallback() {
                  return [createComponent(DialogBody, {
                    "class": "settings-v2-wsl-dialog-body settings-v2-wsl-catalog-picker",
                    get children() {
                      return [createComponent(TextInputV2, {
                        "class": "settings-v2-wsl-catalog-search",
                        appearance: "large",
                        get placeholder() {
                          return language.t("wsl.onboarding.searchDistros");
                        },
                        get value() {
                          return controller.catalogSearch();
                        },
                        get disabled() {
                          return model().busy;
                        },
                        onInput: (event) => controller.setCatalogSearch(event.currentTarget.value)
                      }), (() => {
                        var _el$10 = _tmpl$5$1();
                        insert(_el$10, createComponent(RadioGroupV2, {
                          hideLabel: true,
                          "class": "settings-v2-wsl-distro-group",
                          get label() {
                            return language.t("wsl.onboarding.installDistro");
                          },
                          get value() {
                            return model().catalogTarget ?? void 0;
                          },
                          get onChange() {
                            return controller.setCatalogTarget;
                          },
                          get disabled() {
                            return model().busy;
                          },
                          get children() {
                            return createComponent(For, {
                              get each() {
                                return model().filteredInstallableDistros;
                              },
                              children: (item) => createComponent(RadioItemV2, {
                                "class": "settings-v2-wsl-distro-row settings-v2-wsl-catalog-row",
                                get value() {
                                  return item.name;
                                },
                                get disabled() {
                                  return model().busy;
                                },
                                get label() {
                                  return (() => {
                                    var _el$11 = _tmpl$6$1();
                                    insert(_el$11, () => item.label);
                                    return _el$11;
                                  })();
                                }
                              })
                            });
                          }
                        }));
                        return _el$10;
                      })()];
                    }
                  }), createComponent(DialogFooter, {
                    get children() {
                      return [createComponent(ButtonV2, {
                        variant: "neutral",
                        get disabled() {
                          return model().busy;
                        },
                        get onClick() {
                          return controller.closeCatalog;
                        },
                        get children() {
                          return language.t("common.cancel");
                        }
                      }), createComponent(ButtonV2, {
                        get variant() {
                          return model().installingCatalogDistro ? "loading" : "contrast";
                        },
                        get disabled() {
                          return memo(() => !!!model().installingCatalogDistro)() && (model().busy || !model().catalogTarget);
                        },
                        style: {
                          width: "99px"
                        },
                        get onClick() {
                          return controller.installCatalogDistro;
                        },
                        get children() {
                          return createComponent(Show, {
                            get when() {
                              return model().installingCatalogDistro;
                            },
                            get fallback() {
                              return language.t("wsl.onboarding.installDistro");
                            },
                            get children() {
                              return createComponent(LoaderV2, {});
                            }
                          });
                        }
                      })];
                    }
                  })];
                },
                get children() {
                  return [createComponent(DialogBody, {
                    "class": "settings-v2-wsl-dialog-body",
                    get children() {
                      return [(() => {
                        var _el$ = _tmpl$$3(), _el$2 = _el$.firstChild;
                        insert(_el$2, () => language.t("wsl.onboarding.installedDistros"));
                        insert(_el$, createComponent(ButtonV2, {
                          variant: "ghost-muted",
                          size: "small",
                          get disabled() {
                            return model().busy;
                          },
                          get onClick() {
                            return controller.refreshDistros;
                          },
                          get children() {
                            return language.t("wsl.onboarding.checkAgain");
                          }
                        }), null);
                        return _el$;
                      })(), createComponent(Show, {
                        get when() {
                          return model().addableInstalledDistros.length > 0;
                        },
                        get fallback() {
                          return (() => {
                            var _el$12 = _tmpl$7(), _el$13 = _el$12.firstChild;
                            insert(_el$13, (() => {
                              var _c$ = memo(() => !!model().visibleInstalledDistros.length);
                              return () => _c$() ? language.t("wsl.onboarding.allDistrosAdded") : language.t("wsl.onboarding.noDistros");
                            })());
                            return _el$12;
                          })();
                        },
                        get children() {
                          var _el$3 = _tmpl$2$1();
                          insert(_el$3, createComponent(RadioGroupV2, {
                            hideLabel: true,
                            "class": "settings-v2-wsl-distro-group",
                            get label() {
                              return language.t("wsl.onboarding.installedDistros");
                            },
                            get value() {
                              return model().selectedDistro ?? void 0;
                            },
                            get onChange() {
                              return controller.setSelectedDistro;
                            },
                            get disabled() {
                              return model().busy;
                            },
                            get children() {
                              return createComponent(For, {
                                get each() {
                                  return model().addableInstalledDistros;
                                },
                                children: (item) => {
                                  const status = () => model().distroStatuses[item.name] ?? null;
                                  return createComponent(RadioItemV2, {
                                    get ["class"]() {
                                      return `settings-v2-wsl-distro-row${item.version === 1 ? " settings-v2-wsl-distro-row--unsupported" : ""}`;
                                    },
                                    get value() {
                                      return item.name;
                                    },
                                    get disabled() {
                                      return item.version === 1 || model().busy;
                                    },
                                    get label() {
                                      return (() => {
                                        var _el$14 = _tmpl$6$1();
                                        insert(_el$14, () => item.name);
                                        return _el$14;
                                      })();
                                    },
                                    get description() {
                                      return createComponent(Show, {
                                        get when() {
                                          return status();
                                        },
                                        children: (value) => (() => {
                                          var _el$15 = _tmpl$8();
                                          insert(_el$15, () => translate(language, value().label));
                                          createRenderEffect(() => setAttribute(_el$15, "data-tone", value().tone));
                                          return _el$15;
                                        })()
                                      });
                                    }
                                  });
                                }
                              });
                            }
                          }));
                          return _el$3;
                        }
                      }), createComponent(Show, {
                        get when() {
                          return model().installableDistros.length > 0;
                        },
                        get children() {
                          var _el$4 = _tmpl$3$1(), _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling, _el$7 = _el$6.firstChild, _el$8 = _el$7.nextSibling;
                          addEventListener(_el$4, "click", controller.openCatalog, true);
                          insert(_el$7, () => language.t("wsl.onboarding.needAnotherDistro"));
                          insert(_el$8, () => language.t("wsl.onboarding.needAnotherDistroHint"));
                          createRenderEffect(() => _el$4.disabled = model().busy);
                          return _el$4;
                        }
                      })];
                    }
                  }), createComponent(DialogFooter, {
                    get children() {
                      return [createComponent(ButtonV2, {
                        variant: "neutral",
                        get disabled() {
                          return controller.adding();
                        },
                        get onClick() {
                          return controller.close;
                        },
                        get children() {
                          return language.t("common.cancel");
                        }
                      }), createComponent(ButtonV2, {
                        get variant() {
                          return memo(() => !!primaryButton().loading)() ? "loading" : primaryButton().variant;
                        },
                        get disabled() {
                          return memo(() => !!!primaryButton().loading)() && primaryButton().disabled;
                        },
                        get style() {
                          return primaryButtonStyle();
                        },
                        get onClick() {
                          return controller.runPrimary;
                        },
                        get children() {
                          return createComponent(Show, {
                            get when() {
                              return primaryButton().loading;
                            },
                            get fallback() {
                              return translate(language, primaryButton().label);
                            },
                            get children() {
                              return createComponent(LoaderV2, {});
                            }
                          });
                        }
                      })];
                    }
                  })];
                }
              })];
            }
          });
        }
      });
    }
  });
}
function useWslAddServerController(props) {
  const language = useLanguage();
  const platform = usePlatform();
  const dialog = useDialog();
  const wslServers = useWslServers();
  const api = platform.wslServers;
  const [store, setStore] = createStore({
    view: "main",
    selectedDistro: null,
    catalogSearch: "",
    catalogTarget: null,
    adding: false
  });
  const current = () => wslServers.data;
  const viewModel = (probingAddable) => addServerViewModel({
    state: current(),
    view: store.view,
    selectedDistro: store.selectedDistro,
    catalogSearch: store.catalogSearch,
    catalogTarget: store.catalogTarget,
    adding: store.adding,
    probingAddable
  });
  const baseModel = createMemo(() => viewModel(false));
  const probes = useWslAddServerProbes({
    state: current,
    api,
    view: () => store.view,
    adding: () => store.adding,
    busy: () => baseModel().busy,
    selectedDistro: () => baseModel().selectedDistro,
    addableInstalledDistros: () => baseModel().addableInstalledDistros,
    onError: (error) => requestError(language, error)
  });
  const model = createMemo(() => viewModel(probes.probingAddable()));
  const openCatalog = () => {
    const first = model().installableDistros[0];
    setStore({
      view: "catalog",
      catalogSearch: "",
      catalogTarget: first?.name ?? null
    });
  };
  const run = async (action) => {
    try {
      await action();
    } catch (err) {
      requestError(language, err);
    }
  };
  const refreshDistros = () => {
    void run(async () => {
      probes.resetProbeFailure();
      await api.refreshDistros();
    });
  };
  const installDistro = (name) => {
    void run(async () => {
      probes.resetProbeFailure();
      await api.installDistro(name);
      setStore("view", "main");
    });
  };
  const installCatalogDistro = () => {
    if (model().installingCatalogDistro) return;
    const name = model().catalogTarget;
    if (!name) return;
    installDistro(name);
  };
  const closeCatalog = () => {
    probes.resetProbeFailure();
    setStore({
      view: "main",
      catalogSearch: "",
      catalogTarget: null
    });
  };
  const runPrimary = async () => {
    const button = model().primaryButton;
    if (button.loading) return;
    const distro = model().selectedDistro;
    const action = button.action;
    if (!distro || !action) return;
    if (action === "install-opencode") {
      await run(() => api.installOpencode(distro));
      return;
    }
    setStore("adding", true);
    try {
      await api.addServer(distro);
      if (props.onAdded) {
        await props.onAdded(distro);
      } else {
        dialog.close();
      }
    } catch (err) {
      requestError(language, err);
    } finally {
      setStore("adding", false);
    }
  };
  const loadError = () => {
    const error = wslServers.error;
    if (!error) return language.t("wsl.onboarding.loadFailed");
    return error instanceof Error ? error.message : String(error);
  };
  return {
    wslServers,
    model,
    loadError,
    runtimeError: () => current()?.runtime?.error ?? null,
    view: () => store.view,
    catalogSearch: () => store.catalogSearch,
    adding: () => store.adding,
    setCatalogSearch: (value) => setStore("catalogSearch", value),
    setCatalogTarget: (value) => setStore("catalogTarget", value),
    setSelectedDistro: (value) => setStore("selectedDistro", value),
    openCatalog,
    closeCatalog,
    refreshDistros,
    installCatalogDistro,
    installWsl: () => void run(() => api.installWsl()),
    runPrimary: () => void runPrimary(),
    close: () => dialog.close()
  };
}
function DialogWslSetup(props) {
  const language = useLanguage();
  const dialog = useDialog();
  const title = () => props.state === "pendingRestart" ? language.t("wsl.onboarding.restartRequired") : props.installable ? language.t("wsl.onboarding.wslNotInstalled.title") : language.t("wsl.onboarding.wslUnavailable.title");
  const description = () => {
    if (props.state === "pendingRestart") return language.t("wsl.onboarding.windowsRestartRequired");
    if (!props.installable) return language.t("wsl.onboarding.wslUnavailable.description");
    return language.t("wsl.onboarding.wslNotInstalled.description");
  };
  return createComponent(Dialog, {
    fit: true,
    "class": "settings-v2-wsl-not-installed-dialog",
    get children() {
      var _el$16 = _tmpl$0(), _el$17 = _el$16.firstChild, _el$18 = _el$17.firstChild, _el$19 = _el$18.nextSibling, _el$20 = _el$19.nextSibling;
      insert(_el$19, title);
      insert(_el$20, description);
      insert(_el$17, createComponent(Show, {
        get when() {
          return memo(() => !!!props.installable)() && props.error;
        },
        get children() {
          var _el$21 = _tmpl$9();
          insert(_el$21, () => props.error);
          return _el$21;
        }
      }), null);
      insert(_el$16, createComponent(Show, {
        get when() {
          return memo(() => props.state === "unavailable")() && props.installable;
        },
        get children() {
          return createComponent(ButtonV2, {
            variant: "neutral",
            get disabled() {
              return props.busy;
            },
            get onClick() {
              return props.onInstall;
            },
            get children() {
              return language.t("wsl.onboarding.installWsl");
            }
          });
        }
      }), null);
      insert(_el$16, createComponent(Show, {
        get when() {
          return props.state !== "unavailable";
        },
        get children() {
          return createComponent(ButtonV2, {
            variant: "neutral",
            onClick: () => dialog.close(),
            get children() {
              return language.t("common.close");
            }
          });
        }
      }), null);
      return _el$16;
    }
  });
}
function requestError(language, err) {
  console.error("WSL servers request failed", err instanceof Error ? err.stack ?? err.message : String(err));
  showToast$1({
    variant: "error",
    title: language.t("common.requestFailed"),
    description: err instanceof Error ? err.message : String(err)
  });
}
delegateEvents(["click"]);
var _tmpl$$2 = /* @__PURE__ */ template(`<div class=settings-v2-servers-row><div class=settings-v2-servers-lead><div class=settings-v2-servers-copy><span class="flex min-w-0 items-center gap-1"><span class=settings-v2-servers-name></span><span class="shrink-0 rounded-[3px] border border-v2-border-border-base px-1 py-0.5 text-[9px] leading-none text-v2-text-text-muted"></span></span><span class=settings-v2-servers-meta></span></div></div><div class=settings-v2-servers-actions>`);
function isWslServer(server) {
  return server.type === "sidecar" && server.variant === "wsl";
}
function AddServerMenu(props) {
  const platform = usePlatform();
  const dialog = useDialog();
  const language = useLanguage();
  const openAddWsl = () => {
    dialog.push(() => createComponent(DialogAddWslServer, {}));
  };
  return createComponent(Show, {
    get when() {
      return platform.wslServers;
    },
    get fallback() {
      return createComponent(ButtonV2, {
        variant: "ghost-muted",
        icon: "plus",
        get onClick() {
          return props.onAddServer;
        },
        get children() {
          return language.t("dialog.server.add.button");
        }
      });
    },
    get children() {
      return createComponent(MenuV2, {
        gutter: 4,
        modal: false,
        placement: "bottom-end",
        get children() {
          return [createComponent(MenuV2.Trigger, {
            as: ButtonV2,
            variant: "ghost-muted",
            icon: "plus",
            get children() {
              return language.t("dialog.server.add.button");
            }
          }), createComponent(MenuV2.Portal, {
            get children() {
              return createComponent(MenuV2.Content, {
                get children() {
                  return [createComponent(MenuV2.Item, {
                    get onSelect() {
                      return props.onAddServer;
                    },
                    get children() {
                      return language.t("dialog.server.add.button");
                    }
                  }), createComponent(MenuV2.Item, {
                    onSelect: openAddWsl,
                    get children() {
                      return language.t("wsl.server.add");
                    }
                  })];
                }
              });
            }
          })];
        }
      });
    }
  });
}
function useFilteredWslServers(filter) {
  const wsl = useWslServers();
  return createMemo(() => {
    const servers = wsl.data?.servers ?? [];
    const query = filter().trim();
    if (!query) return servers;
    return fuzzysort.go(query, servers, {
      keys: [(item) => item.config.distro, (item) => item.config.id]
    }).map((x) => x.obj);
  });
}
function WslServerSettings(props) {
  const platform = usePlatform();
  const language = useLanguage();
  const wsl = useWslServers();
  const api = platform.wslServers;
  const request = useMutation(() => ({
    mutationFn: (action) => action(),
    onError: (error) => showToast({
      variant: "error",
      title: language.t("common.requestFailed"),
      description: error instanceof Error ? error.message : String(error)
    })
  }));
  const remove = (key) => {
    request.mutate(() => props.controller.handleRemove(key));
  };
  return createComponent(Show, {
    when: api,
    get children() {
      return createComponent(For, {
        get each() {
          return props.servers();
        },
        children: (item) => {
          const key = ServerConnection.Key.make(item.config.id);
          const check = () => wsl.data?.opencodeChecks[item.config.distro];
          const opencodeAction = () => wslOpencodeAction(check());
          const busy = () => wsl.data?.job?.kind === "install-opencode" && wsl.data.job.distro === item.config.distro;
          return (() => {
            var _el$ = _tmpl$$2(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling, _el$7 = _el$4.nextSibling, _el$8 = _el$2.nextSibling;
            insert(_el$2, createComponent(ServerHealthIndicator, {
              get health() {
                return props.controller.status()[key];
              }
            }), _el$3);
            insert(_el$5, () => item.config.distro);
            insert(_el$6, () => language.t("wsl.server.label"));
            insert(_el$7, createComponent(Show, {
              get when() {
                return check()?.version;
              },
              children: (version) => `v${version()}`
            }));
            insert(_el$8, createComponent(Show, {
              get when() {
                return memo(() => !!props.controller.canDefault())() && props.controller.defaultKey() === key;
              },
              get children() {
                return createComponent(Tag, {
                  get children() {
                    return language.t("dialog.server.status.default");
                  }
                });
              }
            }), null);
            insert(_el$8, createComponent(Show, {
              get when() {
                return opencodeAction();
              },
              children: (label) => createComponent(ButtonV2, {
                size: "small",
                get disabled() {
                  return busy() || request.isPending;
                },
                onClick: () => api && request.mutate(() => api.installOpencode(item.config.distro)),
                get children() {
                  return memo(() => !!busy())() ? language.t("wsl.server.updating") : label();
                }
              })
            }), null);
            insert(_el$8, createComponent(MenuV2, {
              gutter: 4,
              modal: false,
              placement: "bottom-end",
              get children() {
                return [createComponent(MenuV2.Trigger, {
                  as: IconButtonV2,
                  variant: "ghost-muted",
                  size: "small",
                  get icon() {
                    return createComponent(Icon, {
                      name: "outline-dots"
                    });
                  },
                  get ["aria-label"]() {
                    return language.t("common.moreOptions");
                  }
                }), createComponent(MenuV2.Portal, {
                  get children() {
                    return createComponent(MenuV2.Content, {
                      get children() {
                        return createComponent(MenuV2.Group, {
                          get children() {
                            return [createComponent(MenuV2.GroupLabel, {
                              get children() {
                                return language.t("wsl.server.menu.label");
                              }
                            }), createComponent(Show, {
                              get when() {
                                return wslRuntimeRetryable(item.runtime);
                              },
                              get children() {
                                return createComponent(MenuV2.Item, {
                                  onSelect: () => api && request.mutate(() => api.startServer(key)),
                                  get children() {
                                    return language.t("wsl.server.retryStart");
                                  }
                                });
                              }
                            }), createComponent(Show, {
                              get when() {
                                return memo(() => !!props.controller.canDefault())() && props.controller.defaultKey() !== key;
                              },
                              get children() {
                                return createComponent(MenuV2.Item, {
                                  onSelect: () => props.controller.setDefault(key),
                                  get children() {
                                    return language.t("dialog.server.menu.default");
                                  }
                                });
                              }
                            }), createComponent(Show, {
                              get when() {
                                return memo(() => !!props.controller.canDefault())() && props.controller.defaultKey() === key;
                              },
                              get children() {
                                return createComponent(MenuV2.Item, {
                                  onSelect: () => props.controller.setDefault(null),
                                  get children() {
                                    return language.t("dialog.server.menu.defaultRemove");
                                  }
                                });
                              }
                            }), createComponent(MenuV2.Separator, {}), createComponent(MenuV2.Item, {
                              onSelect: () => remove(key),
                              get children() {
                                return language.t("dialog.server.menu.delete");
                              }
                            })];
                          }
                        });
                      }
                    });
                  }
                })];
              }
            }), null);
            return _el$;
          })();
        }
      });
    }
  });
}
var _tmpl$$1 = /* @__PURE__ */ template(`<div class=settings-v2-tab-search>`), _tmpl$2 = /* @__PURE__ */ template(`<div class="settings-v2-tab-header settings-v2-servers-header"><div class=settings-v2-tab-header-row><h2 class=settings-v2-tab-title>`), _tmpl$3 = /* @__PURE__ */ template(`<div class="settings-v2-tab-body settings-v2-servers">`), _tmpl$4 = /* @__PURE__ */ template(`<span class=settings-v2-servers-status-filter>&quot;<!>&quot;`), _tmpl$5 = /* @__PURE__ */ template(`<div class=settings-v2-servers-status><span>`), _tmpl$6 = /* @__PURE__ */ template(`<div class=settings-v2-servers-row><div class=settings-v2-servers-lead><div class=settings-v2-servers-copy><span class=settings-v2-servers-name></span><span class=settings-v2-servers-meta></span></div></div><div class=settings-v2-servers-actions>`);
const SettingsServersV2 = () => {
  const dialog = useDialog();
  const language = useLanguage();
  const controller = useServerManagementController();
  const [store, setStore] = createStore({
    filter: ""
  });
  const wslServers = useFilteredWslServers(() => store.filter);
  const showSearch = createMemo(() => controller.sortedItems().filter((item) => !isWslServer(item)).length + wslServers().length > 1);
  const filtered = createMemo(() => {
    const items = controller.sortedItems().filter((item) => !isWslServer(item));
    const query = store.filter.trim();
    if (!query) return items;
    return fuzzysort.go(query, items, {
      keys: [(item) => serverName(item), (item) => item.http.url]
    }).map((result) => result.obj);
  });
  const openAdd = () => {
    dialog.push(() => createComponent(DialogServerV2, {
      mode: "add"
    }));
  };
  const openEdit = (server) => {
    dialog.push(() => createComponent(DialogServerV2, {
      mode: "edit",
      server
    }));
  };
  return [(() => {
    var _el$ = _tmpl$2(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild;
    insert(_el$3, () => language.t("status.popover.tab.servers"));
    insert(_el$2, createComponent(AddServerMenu, {
      onAddServer: openAdd
    }), null);
    insert(_el$, createComponent(Show, {
      get when() {
        return showSearch();
      },
      get children() {
        var _el$4 = _tmpl$$1();
        insert(_el$4, createComponent(TextInputV2, {
          type: "search",
          appearance: "base",
          get value() {
            return store.filter;
          },
          onInput: (event) => setStore("filter", event.currentTarget.value),
          get placeholder() {
            return language.t("dialog.server.search.placeholder");
          },
          spellcheck: false,
          autocorrect: "off",
          autocomplete: "off",
          autocapitalize: "off",
          get ["aria-label"]() {
            return language.t("dialog.server.search.placeholder");
          }
        }), null);
        insert(_el$4, createComponent(Show, {
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
                return createComponent(Icon, {
                  name: "close",
                  size: "large",
                  "class": "text-v2-icon-icon-muted"
                });
              },
              onClick: () => setStore("filter", "")
            });
          }
        }), null);
        return _el$4;
      }
    }), null);
    createRenderEffect(() => _el$.classList.toggle("settings-v2-tab-header--stacked", !!showSearch()));
    return _el$;
  })(), (() => {
    var _el$5 = _tmpl$3();
    insert(_el$5, createComponent(Show, {
      get when() {
        return filtered().length > 0 || wslServers().length > 0;
      },
      get fallback() {
        return (() => {
          var _el$6 = _tmpl$5(), _el$7 = _el$6.firstChild;
          insert(_el$7, (() => {
            var _c$ = memo(() => !!store.filter);
            return () => _c$() ? language.t("palette.empty") : language.t("dialog.server.empty");
          })());
          insert(_el$6, createComponent(Show, {
            get when() {
              return store.filter;
            },
            get children() {
              var _el$8 = _tmpl$4(), _el$9 = _el$8.firstChild, _el$1 = _el$9.nextSibling;
              _el$1.nextSibling;
              insert(_el$8, () => store.filter, _el$1);
              return _el$8;
            }
          }), null);
          return _el$6;
        })();
      },
      get children() {
        return createComponent(SettingsListV2, {
          get children() {
            return [createComponent(WslServerSettings, {
              controller,
              servers: wslServers
            }), createComponent(For, {
              get each() {
                return filtered();
              },
              children: (item) => {
                const key = ServerConnection.key(item);
                const health = () => controller.status()[key];
                const isDefault = () => controller.defaultKey() === key;
                return (() => {
                  var _el$10 = _tmpl$6(), _el$11 = _el$10.firstChild, _el$12 = _el$11.firstChild, _el$13 = _el$12.firstChild, _el$14 = _el$13.nextSibling, _el$15 = _el$11.nextSibling;
                  insert(_el$11, createComponent(ServerHealthIndicator, {
                    get health() {
                      return health();
                    }
                  }), _el$12);
                  insert(_el$13, () => serverName(item));
                  insert(_el$14, createComponent(Show, {
                    get when() {
                      return health()?.version;
                    },
                    get children() {
                      return ["v", memo(() => health()?.version)];
                    }
                  }), null);
                  insert(_el$14, createComponent(Show, {
                    get when() {
                      return memo(() => !!health()?.version)() && item.type === "http";
                    },
                    children: " • "
                  }), null);
                  insert(_el$14, createComponent(Show, {
                    get when() {
                      return memo(() => item.type === "http")() && item.http.username;
                    },
                    get fallback() {
                      return createComponent(Show, {
                        get when() {
                          return item.type === "http";
                        },
                        get children() {
                          return language.t("server.row.noUsername");
                        }
                      });
                    },
                    get children() {
                      return item.http.username;
                    }
                  }), null);
                  insert(_el$15, createComponent(Show, {
                    get when() {
                      return memo(() => !!controller.canDefault())() && isDefault();
                    },
                    get children() {
                      return createComponent(Tag, {
                        get children() {
                          return language.t("dialog.server.status.default");
                        }
                      });
                    }
                  }), null);
                  insert(_el$15, createComponent(ServerRowMenu, {
                    server: item,
                    controller,
                    onEdit: openEdit
                  }), null);
                  return _el$10;
                })();
              }
            })];
          }
        });
      }
    }));
    return _el$5;
  })()];
};
var _tmpl$ = /* @__PURE__ */ template(`<div class="flex flex-col justify-between h-full w-full"><div class="flex flex-col gap-3 w-full"><div class="flex flex-col gap-3"><div class="flex flex-col gap-1.5"><div class="flex flex-col gap-1.5 w-full"></div></div><div class="flex flex-col gap-1.5"><div class="flex flex-col gap-1.5 w-full"></div></div></div></div><div class=settings-v2-nav-footer><span></span><span>v`);
const DialogSettings = (props) => {
  const language = useLanguage();
  const platform = usePlatform();
  return createComponent(Dialog, {
    size: "x-large",
    variant: "settings",
    "class": "settings-v2-dialog",
    get children() {
      return createComponent(TabsV2, {
        orientation: "vertical",
        variant: "settings",
        defaultValue: "general",
        "class": "settings-v2",
        get children() {
          return [createComponent(TabsV2.List, {
            get children() {
              var _el$ = _tmpl$(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$6 = _el$4.nextSibling, _el$7 = _el$6.firstChild, _el$8 = _el$2.nextSibling, _el$9 = _el$8.firstChild, _el$0 = _el$9.nextSibling;
              _el$0.firstChild;
              insert(_el$4, createComponent(TabsV2.SectionTitle, {
                get children() {
                  return language.t("settings.section.desktop");
                }
              }), _el$5);
              insert(_el$5, createComponent(TabsV2.Trigger, {
                value: "general",
                get children() {
                  return [createComponent(Icon$1, {
                    name: "sliders"
                  }), memo(() => language.t("settings.tab.general"))];
                }
              }), null);
              insert(_el$5, createComponent(TabsV2.Trigger, {
                value: "shortcuts",
                get children() {
                  return [createComponent(Icon$1, {
                    name: "keyboard"
                  }), memo(() => language.t("settings.tab.shortcuts"))];
                }
              }), null);
              insert(_el$6, createComponent(TabsV2.SectionTitle, {
                get children() {
                  return language.t("settings.section.server");
                }
              }), _el$7);
              insert(_el$7, createComponent(TabsV2.Trigger, {
                value: "servers",
                get children() {
                  return [createComponent(Icon$1, {
                    name: "server"
                  }), memo(() => language.t("status.popover.tab.servers"))];
                }
              }), null);
              insert(_el$7, createComponent(TabsV2.Trigger, {
                value: "providers",
                get children() {
                  return [createComponent(Icon$1, {
                    name: "providers"
                  }), memo(() => language.t("settings.providers.title"))];
                }
              }), null);
              insert(_el$7, createComponent(TabsV2.Trigger, {
                value: "models",
                get children() {
                  return [createComponent(Icon$1, {
                    name: "models"
                  }), memo(() => language.t("settings.models.title"))];
                }
              }), null);
              insert(_el$9, () => language.t("app.name.desktop"));
              insert(_el$0, () => platform.version, null);
              return _el$;
            }
          }), createComponent(TabsV2.Content, {
            value: "general",
            "class": "settings-v2-panel",
            get children() {
              return createComponent(SettingsGeneralV2, {
                get sessionID() {
                  return props.sessionID;
                }
              });
            }
          }), createComponent(TabsV2.Content, {
            value: "shortcuts",
            "class": "settings-v2-panel",
            get children() {
              return createComponent(SettingsKeybinds, {
                v2: true
              });
            }
          }), createComponent(TabsV2.Content, {
            value: "servers",
            "class": "settings-v2-panel",
            get children() {
              return createComponent(SettingsServersV2, {});
            }
          }), createComponent(TabsV2.Content, {
            value: "providers",
            "class": "settings-v2-panel",
            get children() {
              return createComponent(SettingsProvidersV2, {});
            }
          }), createComponent(TabsV2.Content, {
            value: "models",
            "class": "settings-v2-panel",
            get children() {
              return createComponent(SettingsModelsV2, {});
            }
          })];
        }
      });
    }
  });
};
export {
  DialogSettings
};
//# sourceMappingURL=index-3e6cubAn.js.map
