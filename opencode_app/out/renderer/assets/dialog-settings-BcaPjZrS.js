const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-3e6cubAn.js","./main-Do1GNfcH.js","./main-DetviuuX.css","./row-4AB8wTZz.js","./LROKH5N7-Bao07a_E.js","./row-BP1iSXaw.css","./settings-keybinds-C4JPLPQu.js","./dialog-connect-provider-VwuxBEmX.js","./list-BTiznb36.js","./dialog-select-provider-Dh2NFik3.js","./index-DdlBrOZg.css"])))=>i.map(i=>d[i]);
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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "50712dbe-208b-4ac9-b7d2-cabff450016e", e._sentryDebugIdIdentifier = "sentry-dbid-50712dbe-208b-4ac9-b7d2-cabff450016e");
    })();
  } catch (e) {
  }
}
;
import { c2 as useTheme, bI as useLanguage, bP as usePermission, bQ as usePlatform, bD as useDialog, bO as useParams, b$ as useSettings, au as createMemo, aG as decode64, bY as useServerSync, bX as useServerSDK, az as createResource, b7 as onMount, aV as insert, al as createComponent, X as Show, bs as template, G as Select, a6 as __vitePreload, aZ as memo, a2 as TextField, bj as sansDefault, bk as sansFontFamily, b1 as monoDefault, b2 as monoFontFamily, bt as terminalDefault, bu as terminalFontFamily, a$ as mergeProps, B as Button, a4 as Tooltip, I as Icon, bl as sansInput, b3 as monoInput, bv as terminalInput, S as SOUND_OPTIONS, bf as playSoundById, bH as useGlobal, j as DropdownMenu, O as ServerHealthIndicator, H as ServerConnection, T as ServerRow, m as For, V as ServerSDKProvider, W as ServerSyncProvider, w as ModelsProvider, Q as QueryClientProvider, bS as useProviders, bg as popularProviders, z as ProviderIcon, a0 as Tag, bo as showToast, bL as useModels, bF as useFilteredList, s as IconButton, bW as useServerManagementController, J as ServerConnectionForm, N as ServerConnectionList, $ as Tabs, D as Dialog } from "./main-Do1GNfcH.js";
import { S as Switch } from "./switch-CcOrtMmL.js";
import { u as useUpdaterAction, a as SettingsList, S as SettingsKeybinds } from "./settings-keybinds-C4JPLPQu.js";
import { L as Link, D as DialogConnectProvider } from "./dialog-connect-provider-VwuxBEmX.js";
import { D as DialogCustomProvider, a as DialogSelectProvider } from "./dialog-select-provider-Dh2NFik3.js";
import "./LROKH5N7-Bao07a_E.js";
var _tmpl$$4 = /* @__PURE__ */ template(`<div data-action=settings-auto-accept-permissions>`), _tmpl$2$3 = /* @__PURE__ */ template(`<div data-action=settings-feed-reasoning-summaries>`), _tmpl$3$3 = /* @__PURE__ */ template(`<div data-action=settings-feed-shell-tool-parts-expanded>`), _tmpl$4$2 = /* @__PURE__ */ template(`<div data-action=settings-feed-edit-tool-parts-expanded>`), _tmpl$5$2 = /* @__PURE__ */ template(`<div data-action=settings-new-layout-designs>`), _tmpl$6$1 = /* @__PURE__ */ template(`<div class="flex flex-col gap-1">`), _tmpl$7$1 = /* @__PURE__ */ template(`<div data-action=settings-show-file-tree>`), _tmpl$8 = /* @__PURE__ */ template(`<div data-action=settings-show-navigation>`), _tmpl$9 = /* @__PURE__ */ template(`<div data-action=settings-show-search>`), _tmpl$0 = /* @__PURE__ */ template(`<div data-action=settings-show-status>`), _tmpl$1 = /* @__PURE__ */ template(`<div data-action=settings-show-custom-agents>`), _tmpl$10 = /* @__PURE__ */ template(`<div class="flex flex-col gap-1"><h3 class="text-14-medium text-text-strong pb-2">`), _tmpl$11 = /* @__PURE__ */ template(`<div class="w-full sm:w-[220px]">`), _tmpl$12 = /* @__PURE__ */ template(`<div data-action=settings-notifications-agent>`), _tmpl$13 = /* @__PURE__ */ template(`<div data-action=settings-notifications-permissions>`), _tmpl$14 = /* @__PURE__ */ template(`<div data-action=settings-notifications-errors>`), _tmpl$15 = /* @__PURE__ */ template(`<div data-action=settings-release-notes>`), _tmpl$16 = /* @__PURE__ */ template(`<div data-action=settings-pinch-zoom>`), _tmpl$17 = /* @__PURE__ */ template(`<div data-action=settings-wayland>`), _tmpl$18 = /* @__PURE__ */ template(`<span class=text-text-weak>`), _tmpl$19 = /* @__PURE__ */ template(`<div class="flex items-center gap-2"><span>`), _tmpl$20 = /* @__PURE__ */ template(`<div class="flex flex-col h-full overflow-y-auto no-scrollbar px-4 pb-10 sm:px-10 sm:pb-10"><div class="sticky top-0 z-10 bg-[linear-gradient(to_bottom,var(--surface-stronger-non-alpha)_calc(100%_-_24px),transparent)]"><div class="flex flex-col gap-1 pt-6 pb-8"><h2 class="text-16-medium text-text-strong"></h2></div></div><div class="flex flex-col gap-8 w-full">`), _tmpl$21 = /* @__PURE__ */ template(`<div class="flex flex-wrap items-center gap-4 py-3 border-b border-border-weak-base last:border-none sm:flex-nowrap"><div class="flex min-w-0 flex-1 flex-col gap-0.5"><span class="text-14-medium text-text-strong"></span><span class="text-12-regular text-text-weak"></span></div><div class="flex w-full justify-end sm:w-auto sm:shrink-0">`);
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
const SettingsGeneral = () => {
  const theme = useTheme();
  const language = useLanguage();
  const permission = usePermission();
  const platform = usePlatform();
  const dialog = useDialog();
  const params = useParams();
  const settings = useSettings();
  const updater = useUpdaterAction();
  const linux = createMemo(() => platform.platform === "desktop" && platform.os === "linux");
  const dir = createMemo(() => decode64(params.dir));
  const accepting = createMemo(() => {
    const value = dir();
    if (!value) return false;
    if (!params.id) return permission.isAutoAcceptingDirectory(value);
    return permission.isAutoAccepting(params.id, value);
  });
  const toggleAccept = (checked) => {
    const value = dir();
    if (!value) return;
    if (!params.id) {
      if (permission.isAutoAcceptingDirectory(value) === checked) return;
      permission.toggleAutoAcceptDirectory(value);
      return;
    }
    if (checked) {
      permission.enableAutoAccept(params.id, value);
      return;
    }
    permission.disableAutoAccept(params.id, value);
  };
  const desktop = createMemo(() => platform.platform === "desktop");
  const themeOptions = createMemo(() => theme.ids().map((id) => ({
    id,
    name: theme.name(id)
  })));
  const serverSync = useServerSync();
  const serverSdk = useServerSDK();
  const [shells] = createResource(() => serverSdk().client.pty.shells().then((res) => res.data ?? []).catch(() => []), {
    initialValue: []
  });
  const [displayBackend, {
    refetch: refetchDisplayBackend
  }] = createResource(() => linux() && platform.getDisplayBackend ? true : false, () => Promise.resolve(platform.getDisplayBackend?.() ?? null).catch(() => null), {
    initialValue: null
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
  const onDisplayBackendChange = (checked) => {
    const update = platform.setDisplayBackend?.(checked ? "wayland" : "auto");
    if (!update) return;
    void update.finally(() => {
      void refetchDisplayBackend();
    });
  };
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
    },
    variant: "secondary",
    size: "small",
    triggerVariant: "settings"
  });
  const GeneralSection = () => (() => {
    var _el$ = _tmpl$6$1();
    insert(_el$, createComponent(SettingsList, {
      get children() {
        return [createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.row.language.title");
          },
          get description() {
            return language.t("settings.general.row.language.description");
          },
          get children() {
            return createComponent(Select, {
              "data-action": "settings-language",
              get options() {
                return languageOptions();
              },
              get current() {
                return languageOptions().find((o) => o.value === language.locale());
              },
              value: (o) => o.value,
              label: (o) => o.label,
              onSelect: (option) => option && language.setLocale(option.value),
              variant: "secondary",
              size: "small",
              triggerVariant: "settings"
            });
          }
        }), createComponent(SettingsRow, {
          get title() {
            return language.t("command.permissions.autoaccept.enable");
          },
          get description() {
            return language.t("toast.permissions.autoaccept.on.description");
          },
          get children() {
            var _el$2 = _tmpl$$4();
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
        }), createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.row.shell.title");
          },
          get description() {
            return language.t("settings.general.row.shell.description");
          },
          get children() {
            return createComponent(Select, {
              "data-action": "settings-shell",
              get options() {
                return shellOptions();
              },
              get current() {
                return shellOptions().find((o) => o.value === currentShell()) ?? autoOption;
              },
              value: (o) => o.id,
              label: (o) => o.label,
              onSelect: (option) => {
                if (!option) return;
                if (option.value === currentShell()) return;
                serverSync().updateConfig({
                  shell: option.value
                });
              },
              variant: "secondary",
              size: "small",
              triggerVariant: "settings",
              triggerStyle: {
                "min-width": "180px"
              }
            });
          }
        }), createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.row.reasoningSummaries.title");
          },
          get description() {
            return language.t("settings.general.row.reasoningSummaries.description");
          },
          get children() {
            var _el$3 = _tmpl$2$3();
            insert(_el$3, createComponent(Switch, {
              get checked() {
                return settings.general.showReasoningSummaries();
              },
              onChange: (checked) => settings.general.setShowReasoningSummaries(checked)
            }));
            return _el$3;
          }
        }), createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.row.shellToolPartsExpanded.title");
          },
          get description() {
            return language.t("settings.general.row.shellToolPartsExpanded.description");
          },
          get children() {
            var _el$4 = _tmpl$3$3();
            insert(_el$4, createComponent(Switch, {
              get checked() {
                return settings.general.shellToolPartsExpanded();
              },
              onChange: (checked) => settings.general.setShellToolPartsExpanded(checked)
            }));
            return _el$4;
          }
        }), createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.row.editToolPartsExpanded.title");
          },
          get description() {
            return language.t("settings.general.row.editToolPartsExpanded.description");
          },
          get children() {
            var _el$5 = _tmpl$4$2();
            insert(_el$5, createComponent(Switch, {
              get checked() {
                return settings.general.editToolPartsExpanded();
              },
              onChange: (checked) => settings.general.setEditToolPartsExpanded(checked)
            }));
            return _el$5;
          }
        }), createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.row.newLayoutDesigns.title");
          },
          get description() {
            return language.t("settings.general.row.newLayoutDesigns.description");
          },
          get children() {
            var _el$6 = _tmpl$5$2();
            insert(_el$6, createComponent(Switch, {
              get checked() {
                return settings.general.newLayoutDesigns();
              },
              onChange: (checked) => {
                settings.general.setNewLayoutDesigns(checked);
                if (!checked) return;
                void __vitePreload(() => import("./index-3e6cubAn.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]) : void 0, import.meta.url).then((module) => {
                  dialog.show(() => createComponent(module.DialogSettings, {}));
                });
              }
            }));
            return _el$6;
          }
        })];
      }
    }));
    return _el$;
  })();
  const AdvancedSection = () => (() => {
    var _el$7 = _tmpl$10(), _el$8 = _el$7.firstChild;
    insert(_el$8, () => language.t("settings.general.section.advanced"));
    insert(_el$7, createComponent(SettingsList, {
      get children() {
        return [createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.row.showFileTree.title");
          },
          get description() {
            return language.t("settings.general.row.showFileTree.description");
          },
          get children() {
            var _el$9 = _tmpl$7$1();
            insert(_el$9, createComponent(Switch, {
              get checked() {
                return settings.general.showFileTree();
              },
              onChange: (checked) => settings.general.setShowFileTree(checked)
            }));
            return _el$9;
          }
        }), createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.row.showNavigation.title");
          },
          get description() {
            return language.t("settings.general.row.showNavigation.description");
          },
          get children() {
            var _el$0 = _tmpl$8();
            insert(_el$0, createComponent(Switch, {
              get checked() {
                return settings.general.showNavigation();
              },
              onChange: (checked) => settings.general.setShowNavigation(checked)
            }));
            return _el$0;
          }
        }), createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.row.showSearch.title");
          },
          get description() {
            return language.t("settings.general.row.showSearch.description");
          },
          get children() {
            var _el$1 = _tmpl$9();
            insert(_el$1, createComponent(Switch, {
              get checked() {
                return settings.general.showSearch();
              },
              onChange: (checked) => settings.general.setShowSearch(checked)
            }));
            return _el$1;
          }
        }), createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.row.showStatus.title");
          },
          get description() {
            return language.t("settings.general.row.showStatus.description");
          },
          get children() {
            var _el$10 = _tmpl$0();
            insert(_el$10, createComponent(Switch, {
              get checked() {
                return settings.general.showStatus();
              },
              onChange: (checked) => settings.general.setShowStatus(checked)
            }));
            return _el$10;
          }
        }), createComponent(SettingsRow, {
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
    return _el$7;
  })();
  const AppearanceSection = () => (() => {
    var _el$12 = _tmpl$10(), _el$13 = _el$12.firstChild;
    insert(_el$13, () => language.t("settings.general.section.appearance"));
    insert(_el$12, createComponent(SettingsList, {
      get children() {
        return [createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.row.colorScheme.title");
          },
          get description() {
            return language.t("settings.general.row.colorScheme.description");
          },
          get children() {
            return createComponent(Select, {
              "data-action": "settings-color-scheme",
              get options() {
                return colorSchemeOptions();
              },
              get current() {
                return colorSchemeOptions().find((o) => o.value === theme.colorScheme());
              },
              value: (o) => o.value,
              label: (o) => o.label,
              onSelect: (option) => option && theme.setColorScheme(option.value),
              onHighlight: (option) => {
                if (!option) return;
                theme.previewColorScheme(option.value);
                return () => theme.cancelPreview();
              },
              variant: "secondary",
              size: "small",
              triggerVariant: "settings",
              triggerStyle: {
                "min-width": "220px"
              }
            });
          }
        }), createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.row.theme.title");
          },
          get description() {
            return [memo(() => language.t("settings.general.row.theme.description")), " ", createComponent(Link, {
              href: "https://opencode.ai/docs/themes/",
              get children() {
                return language.t("common.learnMore");
              }
            })];
          },
          get children() {
            return createComponent(Select, {
              "data-action": "settings-theme",
              get options() {
                return themeOptions();
              },
              get current() {
                return themeOptions().find((o) => o.id === theme.themeId());
              },
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
              },
              variant: "secondary",
              size: "small",
              triggerVariant: "settings"
            });
          }
        }), createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.row.uiFont.title");
          },
          get description() {
            return language.t("settings.general.row.uiFont.description");
          },
          get children() {
            var _el$14 = _tmpl$11();
            insert(_el$14, createComponent(TextField, {
              "data-action": "settings-ui-font",
              get label() {
                return language.t("settings.general.row.uiFont.title");
              },
              hideLabel: true,
              type: "text",
              get value() {
                return sans();
              },
              onChange: (value) => settings.appearance.setUIFont(value),
              placeholder: sansDefault,
              spellcheck: false,
              autocorrect: "off",
              autocomplete: "off",
              autocapitalize: "off",
              "class": "text-12-regular",
              get style() {
                return {
                  "font-family": sansFontFamily(settings.appearance.uiFont())
                };
              }
            }));
            return _el$14;
          }
        }), createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.row.font.title");
          },
          get description() {
            return language.t("settings.general.row.font.description");
          },
          get children() {
            var _el$15 = _tmpl$11();
            insert(_el$15, createComponent(TextField, {
              "data-action": "settings-code-font",
              get label() {
                return language.t("settings.general.row.font.title");
              },
              hideLabel: true,
              type: "text",
              get value() {
                return mono();
              },
              onChange: (value) => settings.appearance.setFont(value),
              placeholder: monoDefault,
              spellcheck: false,
              autocorrect: "off",
              autocomplete: "off",
              autocapitalize: "off",
              "class": "text-12-regular",
              get style() {
                return {
                  "font-family": monoFontFamily(settings.appearance.font())
                };
              }
            }));
            return _el$15;
          }
        }), createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.row.terminalFont.title");
          },
          get description() {
            return language.t("settings.general.row.terminalFont.description");
          },
          get children() {
            var _el$16 = _tmpl$11();
            insert(_el$16, createComponent(TextField, {
              "data-action": "settings-terminal-font",
              get label() {
                return language.t("settings.general.row.terminalFont.title");
              },
              hideLabel: true,
              type: "text",
              get value() {
                return terminal();
              },
              onChange: (value) => settings.appearance.setTerminalFont(value),
              placeholder: terminalDefault,
              spellcheck: false,
              autocorrect: "off",
              autocomplete: "off",
              autocapitalize: "off",
              "class": "text-12-regular",
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
    insert(_el$17, createComponent(SettingsList, {
      get children() {
        return [createComponent(SettingsRow, {
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
        }), createComponent(SettingsRow, {
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
        }), createComponent(SettingsRow, {
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
    insert(_el$22, createComponent(SettingsList, {
      get children() {
        return [createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.sounds.agent.title");
          },
          get description() {
            return language.t("settings.general.sounds.agent.description");
          },
          get children() {
            return createComponent(Select, mergeProps({
              "data-action": "settings-sounds-agent"
            }, () => soundSelectProps(() => settings.sounds.agentEnabled(), () => settings.sounds.agent(), (value) => settings.sounds.setAgentEnabled(value), (id) => settings.sounds.setAgent(id))));
          }
        }), createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.sounds.permissions.title");
          },
          get description() {
            return language.t("settings.general.sounds.permissions.description");
          },
          get children() {
            return createComponent(Select, mergeProps({
              "data-action": "settings-sounds-permissions"
            }, () => soundSelectProps(() => settings.sounds.permissionsEnabled(), () => settings.sounds.permissions(), (value) => settings.sounds.setPermissionsEnabled(value), (id) => settings.sounds.setPermissions(id))));
          }
        }), createComponent(SettingsRow, {
          get title() {
            return language.t("settings.general.sounds.errors.title");
          },
          get description() {
            return language.t("settings.general.sounds.errors.description");
          },
          get children() {
            return createComponent(Select, mergeProps({
              "data-action": "settings-sounds-errors"
            }, () => soundSelectProps(() => settings.sounds.errorsEnabled(), () => settings.sounds.errors(), (value) => settings.sounds.setErrorsEnabled(value), (id) => settings.sounds.setErrors(id))));
          }
        })];
      }
    }), null);
    return _el$22;
  })();
  const UpdatesSection = () => (() => {
    var _el$24 = _tmpl$10(), _el$25 = _el$24.firstChild;
    insert(_el$25, () => language.t("settings.general.section.updates"));
    insert(_el$24, createComponent(SettingsList, {
      get children() {
        return [createComponent(SettingsRow, {
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
        }), createComponent(SettingsRow, {
          get title() {
            return language.t("settings.updates.row.check.title");
          },
          get description() {
            return language.t("settings.updates.row.check.description");
          },
          get children() {
            return createComponent(Button, {
              size: "small",
              variant: "secondary",
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
      insert(_el$27, createComponent(SettingsList, {
        get children() {
          return [createComponent(SettingsRow, {
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
          }), createComponent(Show, {
            get when() {
              return linux();
            },
            get children() {
              return createComponent(SettingsRow, {
                get title() {
                  return (() => {
                    var _el$31 = _tmpl$19(), _el$32 = _el$31.firstChild;
                    insert(_el$32, () => language.t("settings.general.row.wayland.title"));
                    insert(_el$31, createComponent(Tooltip, {
                      get value() {
                        return language.t("settings.general.row.wayland.tooltip");
                      },
                      placement: "top",
                      get children() {
                        var _el$33 = _tmpl$18();
                        insert(_el$33, createComponent(Icon, {
                          name: "help",
                          size: "small"
                        }));
                        return _el$33;
                      }
                    }), null);
                    return _el$31;
                  })();
                },
                get description() {
                  return language.t("settings.general.row.wayland.description");
                },
                get children() {
                  var _el$30 = _tmpl$17();
                  insert(_el$30, createComponent(Switch, {
                    get checked() {
                      return displayBackend.latest === "wayland";
                    },
                    onChange: onDisplayBackendChange
                  }));
                  return _el$30;
                }
              });
            }
          })];
        }
      }), null);
      return _el$27;
    }
  });
  return (() => {
    var _el$34 = _tmpl$20(), _el$35 = _el$34.firstChild, _el$36 = _el$35.firstChild, _el$37 = _el$36.firstChild, _el$38 = _el$35.nextSibling;
    insert(_el$37, () => language.t("settings.tab.general"));
    insert(_el$38, createComponent(GeneralSection, {}), null);
    insert(_el$38, createComponent(AppearanceSection, {}), null);
    insert(_el$38, createComponent(NotificationsSection, {}), null);
    insert(_el$38, createComponent(SoundsSection, {}), null);
    insert(_el$38, createComponent(UpdatesSection, {}), null);
    insert(_el$38, createComponent(DisplaySection, {}), null);
    insert(_el$38, createComponent(Show, {
      get when() {
        return desktop();
      },
      get children() {
        return createComponent(AdvancedSection, {});
      }
    }), null);
    return _el$34;
  })();
};
const SettingsRow = (props) => {
  return (() => {
    var _el$39 = _tmpl$21(), _el$40 = _el$39.firstChild, _el$41 = _el$40.firstChild, _el$42 = _el$41.nextSibling, _el$43 = _el$40.nextSibling;
    insert(_el$41, () => props.title);
    insert(_el$42, () => props.description);
    insert(_el$43, () => props.children);
    return _el$39;
  })();
};
function SettingsServerScope(props) {
  const global2 = useGlobal();
  const settings = useSettings();
  return createComponent(Show, {
    get when() {
      return settings.general.newLayoutDesigns();
    },
    get fallback() {
      return props.children;
    },
    get children() {
      return createComponent(Show, {
        get when() {
          return global2.settings.server.selected();
        },
        children: (server) => createComponent(SettingsServerDataProviders, {
          get server() {
            return server();
          },
          get children() {
            return props.children;
          }
        })
      });
    }
  });
}
function SettingsServerDataProviders(props) {
  const global2 = useGlobal();
  const serverCtx = () => global2.ensureServerCtx(props.server);
  return createComponent(QueryClientProvider, {
    get client() {
      return serverCtx().queryClient;
    },
    get children() {
      return createComponent(ServerSDKProvider, {
        server: () => props.server,
        get children() {
          return createComponent(ServerSyncProvider, {
            get children() {
              return createComponent(ModelsProvider, {
                get children() {
                  return props.children;
                }
              });
            }
          });
        }
      });
    }
  });
}
function SettingsServerPicker() {
  const global2 = useGlobal();
  const settings = useSettings();
  const selected = createMemo(() => settings.general.newLayoutDesigns() ? global2.settings.server.selected() : void 0);
  return createComponent(Show, {
    get when() {
      return selected();
    },
    children: (conn) => createComponent(DropdownMenu, {
      gutter: 4,
      placement: "bottom-end",
      get children() {
        return [createComponent(DropdownMenu.Trigger, {
          as: Button,
          variant: "secondary",
          size: "large",
          "class": "h-8 max-w-[260px] gap-2 px-2 py-1.5 data-[expanded]:bg-surface-base-active",
          get children() {
            return [createComponent(ServerHealthIndicator, {
              get health() {
                return global2.servers.health[ServerConnection.key(conn())];
              }
            }), createComponent(ServerRow, {
              get conn() {
                return conn();
              },
              get status() {
                return global2.servers.health[ServerConnection.key(conn())];
              },
              "class": "flex items-center gap-2 min-w-0 flex-1",
              nameClass: "text-14-regular text-text-base truncate",
              versionClass: "hidden"
            }), createComponent(Icon, {
              name: "chevron-down",
              size: "small",
              "class": "text-icon-weak shrink-0"
            })];
          }
        }), createComponent(DropdownMenu.Portal, {
          get children() {
            return createComponent(DropdownMenu.Content, {
              "class": "w-[320px] mt-1 [&_[data-slot=dropdown-menu-radio-item]]:pl-2 [&_[data-slot=dropdown-menu-radio-item]]:pr-2",
              get children() {
                return createComponent(DropdownMenu.RadioGroup, {
                  get value() {
                    return global2.settings.server.key;
                  },
                  onChange: (key) => {
                    if (typeof key === "string") global2.settings.server.set(ServerConnection.Key.make(key));
                  },
                  get children() {
                    return createComponent(For, {
                      get each() {
                        return global2.servers.list();
                      },
                      children: (item) => {
                        const key = ServerConnection.key(item);
                        const blocked = () => global2.servers.health[key]?.healthy === false;
                        return createComponent(DropdownMenu.RadioItem, {
                          value: key,
                          get disabled() {
                            return blocked();
                          },
                          get children() {
                            return [createComponent(ServerHealthIndicator, {
                              get health() {
                                return global2.servers.health[key];
                              }
                            }), createComponent(ServerRow, {
                              conn: item,
                              get dimmed() {
                                return blocked();
                              },
                              get status() {
                                return global2.servers.health[key];
                              },
                              "class": "flex items-center gap-2 min-w-0 flex-1",
                              nameClass: "text-14-regular text-text-base truncate",
                              versionClass: "text-12-regular text-text-weak truncate"
                            }), createComponent(DropdownMenu.ItemIndicator, {
                              get children() {
                                return createComponent(Icon, {
                                  name: "check-small",
                                  size: "small",
                                  "class": "text-icon-weak"
                                });
                              }
                            })];
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        })];
      }
    })
  });
}
var _tmpl$$3 = /* @__PURE__ */ template(`<div class="flex items-center justify-between gap-4 min-h-16 border-b border-border-weak-base last:border-none flex-wrap py-3"data-component=custom-provider-section><div class="flex flex-col min-w-0"><div class="flex flex-wrap items-center gap-x-3 gap-y-1"><span class="text-14-medium text-text-strong"></span></div><span class="text-12-regular text-text-weak pl-8">`), _tmpl$2$2 = /* @__PURE__ */ template(`<div class="flex flex-col h-full overflow-y-auto no-scrollbar px-4 pb-10 sm:px-10 sm:pb-10"><div class="sticky top-0 z-10 bg-[linear-gradient(to_bottom,var(--surface-stronger-non-alpha)_calc(100%_-_24px),transparent)]"><div class="flex items-center justify-between gap-4 pt-6 pb-8 max-w-[720px]"><h2 class="text-16-medium text-text-strong"></h2></div></div><div class="flex flex-col gap-8 max-w-[720px]"><div class="flex flex-col gap-1"data-component=connected-providers-section><h3 class="text-14-medium text-text-strong pb-2"></h3></div><div class="flex flex-col gap-1"><h3 class="text-14-medium text-text-strong pb-2">`), _tmpl$3$2 = /* @__PURE__ */ template(`<div class="py-4 text-14-regular text-text-weak">`), _tmpl$4$1 = /* @__PURE__ */ template(`<div class="group flex flex-wrap items-center justify-between gap-4 min-h-16 py-3 border-b border-border-weak-base last:border-none"><div class="flex items-center gap-3 min-w-0"><span class="text-14-medium text-text-strong truncate">`), _tmpl$5$1 = /* @__PURE__ */ template(`<span class="text-14-regular text-text-base opacity-0 group-hover:opacity-100 transition-opacity duration-200 pr-3 cursor-default">`), _tmpl$6 = /* @__PURE__ */ template(`<div class="flex flex-wrap items-center justify-between gap-4 min-h-16 py-3 border-b border-border-weak-base last:border-none"><div class="flex flex-col min-w-0"><div class="flex items-center gap-x-3"><span class="text-14-medium text-text-strong">`), _tmpl$7 = /* @__PURE__ */ template(`<span class="text-12-regular text-text-weak pl-8">`);
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
const SettingsProviders = () => {
  return createComponent(SettingsServerScope, {
    get children() {
      return createComponent(SettingsProvidersContent, {});
    }
  });
};
const SettingsProvidersContent = () => {
  const dialog = useDialog();
  const language = useLanguage();
  const serverSDK = useServerSDK();
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
      await serverSDK().client.auth.remove({
        providerID
      }).catch(() => void 0);
      await disableProvider(providerID, name);
      return;
    }
    await serverSDK().client.auth.remove({
      providerID
    }).then(async () => {
      await serverSDK().client.global.dispose();
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
  return (() => {
    var _el$ = _tmpl$2$2(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$2.nextSibling, _el$6 = _el$5.firstChild, _el$7 = _el$6.firstChild, _el$8 = _el$6.nextSibling, _el$9 = _el$8.firstChild;
    insert(_el$4, () => language.t("settings.providers.title"));
    insert(_el$3, createComponent(SettingsServerPicker, {}), null);
    insert(_el$7, () => language.t("settings.providers.section.connected"));
    insert(_el$6, createComponent(SettingsList, {
      get children() {
        return createComponent(Show, {
          get when() {
            return connected().length > 0;
          },
          get fallback() {
            return (() => {
              var _el$13 = _tmpl$3$2();
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
                var _el$14 = _tmpl$4$1(), _el$15 = _el$14.firstChild, _el$16 = _el$15.firstChild;
                insert(_el$15, createComponent(ProviderIcon, {
                  get id() {
                    return item.id;
                  },
                  "class": "size-5 shrink-0 icon-strong-base"
                }), _el$16);
                insert(_el$16, () => item.name);
                insert(_el$15, createComponent(Tag, {
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
                      var _el$17 = _tmpl$5$1();
                      insert(_el$17, () => language.t("settings.providers.connected.environmentDescription"));
                      return _el$17;
                    })();
                  },
                  get children() {
                    return createComponent(Button, {
                      size: "large",
                      variant: "ghost",
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
    insert(_el$9, () => language.t("settings.providers.section.popular"));
    insert(_el$8, createComponent(SettingsList, {
      get children() {
        return [createComponent(For, {
          get each() {
            return popular();
          },
          children: (item) => (() => {
            var _el$18 = _tmpl$6(), _el$19 = _el$18.firstChild, _el$20 = _el$19.firstChild, _el$21 = _el$20.firstChild;
            insert(_el$20, createComponent(ProviderIcon, {
              get id() {
                return item.id;
              },
              "class": "size-5 shrink-0 icon-strong-base"
            }), _el$21);
            insert(_el$21, () => item.name);
            insert(_el$20, createComponent(Show, {
              get when() {
                return item.id === "opencode";
              },
              get children() {
                return createComponent(Tag, {
                  get children() {
                    return language.t("dialog.provider.tag.recommended");
                  }
                });
              }
            }), null);
            insert(_el$20, createComponent(Show, {
              get when() {
                return item.id === "opencode-go";
              },
              get children() {
                return createComponent(Tag, {
                  get children() {
                    return language.t("dialog.provider.tag.recommended");
                  }
                });
              }
            }), null);
            insert(_el$19, createComponent(Show, {
              get when() {
                return note(item.id);
              },
              children: (key) => (() => {
                var _el$22 = _tmpl$7();
                insert(_el$22, () => language.t(key()));
                return _el$22;
              })()
            }), null);
            insert(_el$18, createComponent(Button, {
              size: "large",
              variant: "secondary",
              icon: "plus-small",
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
            return _el$18;
          })()
        }), (() => {
          var _el$0 = _tmpl$$3(), _el$1 = _el$0.firstChild, _el$10 = _el$1.firstChild, _el$11 = _el$10.firstChild, _el$12 = _el$10.nextSibling;
          insert(_el$10, createComponent(ProviderIcon, {
            id: "synthetic",
            "class": "size-5 shrink-0 icon-strong-base"
          }), _el$11);
          insert(_el$11, () => language.t("provider.custom.title"));
          insert(_el$10, createComponent(Tag, {
            get children() {
              return language.t("settings.providers.tag.custom");
            }
          }), null);
          insert(_el$12, () => language.t("settings.providers.custom.description"));
          insert(_el$0, createComponent(Button, {
            size: "large",
            variant: "secondary",
            icon: "plus-small",
            onClick: () => {
              dialog.show(() => createComponent(DialogCustomProvider, {
                back: "close"
              }));
            },
            get children() {
              return language.t("common.connect");
            }
          }), null);
          return _el$0;
        })()];
      }
    }), null);
    insert(_el$8, createComponent(Button, {
      variant: "ghost",
      "class": "px-0 py-0 mt-5 text-14-medium text-text-interactive-base text-left justify-start hover:bg-transparent active:bg-transparent",
      onClick: () => {
        dialog.show(() => createComponent(DialogSelectProvider, {}));
      },
      get children() {
        return language.t("dialog.provider.viewAll");
      }
    }), null);
    return _el$;
  })();
};
var _tmpl$$2 = /* @__PURE__ */ template(`<div class="flex flex-col items-center justify-center py-12 text-center"><span class="text-14-regular text-text-weak">`), _tmpl$2$1 = /* @__PURE__ */ template(`<span class="text-14-regular text-text-strong mt-1">&quot;<!>&quot;`), _tmpl$3$1 = /* @__PURE__ */ template(`<div class="flex flex-col h-full overflow-y-auto no-scrollbar px-4 pb-10 sm:px-10 sm:pb-10"><div class="sticky top-0 z-10 bg-[linear-gradient(to_bottom,var(--surface-stronger-non-alpha)_calc(100%_-_24px),transparent)]"><div class="flex flex-col gap-4 pt-6 pb-6 max-w-[720px]"><div class="flex items-center justify-between gap-4"><h2 class="text-16-medium text-text-strong"></h2></div><div class="flex items-center gap-2 px-3 h-9 rounded-lg bg-surface-base"></div></div></div><div class="flex flex-col gap-8 max-w-[720px]">`), _tmpl$4 = /* @__PURE__ */ template(`<div class="flex flex-col gap-1"><div class="flex items-center gap-2 pb-2"><span class="text-14-medium text-text-strong">`), _tmpl$5 = /* @__PURE__ */ template(`<div class="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-border-weak-base last:border-none"><div class=min-w-0><span class="text-14-regular text-text-strong truncate block"></span></div><div class=flex-shrink-0>`);
const ListLoadingState = (props) => {
  return (() => {
    var _el$ = _tmpl$$2(), _el$2 = _el$.firstChild;
    insert(_el$2, () => props.label);
    return _el$;
  })();
};
const ListEmptyState = (props) => {
  return (() => {
    var _el$3 = _tmpl$$2(), _el$4 = _el$3.firstChild;
    insert(_el$4, () => props.message);
    insert(_el$3, createComponent(Show, {
      get when() {
        return props.filter;
      },
      get children() {
        var _el$5 = _tmpl$2$1(), _el$6 = _el$5.firstChild, _el$8 = _el$6.nextSibling;
        _el$8.nextSibling;
        insert(_el$5, () => props.filter, _el$8);
        return _el$5;
      }
    }), null);
    return _el$3;
  })();
};
const SettingsModels = () => {
  return createComponent(SettingsServerScope, {
    get children() {
      return createComponent(SettingsModelsContent, {});
    }
  });
};
const SettingsModelsContent = () => {
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
  return (() => {
    var _el$9 = _tmpl$3$1(), _el$0 = _el$9.firstChild, _el$1 = _el$0.firstChild, _el$10 = _el$1.firstChild, _el$11 = _el$10.firstChild, _el$12 = _el$10.nextSibling, _el$13 = _el$0.nextSibling;
    insert(_el$11, () => language.t("settings.models.title"));
    insert(_el$10, createComponent(SettingsServerPicker, {}), null);
    insert(_el$12, createComponent(Icon, {
      name: "magnifying-glass",
      "class": "text-icon-weak-base flex-shrink-0"
    }), null);
    insert(_el$12, createComponent(TextField, {
      variant: "ghost",
      type: "text",
      get value() {
        return list.filter();
      },
      get onChange() {
        return list.onInput;
      },
      get placeholder() {
        return language.t("dialog.model.search.placeholder");
      },
      spellcheck: false,
      autocorrect: "off",
      autocomplete: "off",
      autocapitalize: "off",
      "class": "flex-1"
    }), null);
    insert(_el$12, createComponent(Show, {
      get when() {
        return list.filter();
      },
      get children() {
        return createComponent(IconButton, {
          icon: "circle-x",
          variant: "ghost",
          get onClick() {
            return list.clear;
          }
        });
      }
    }), null);
    insert(_el$13, createComponent(Show, {
      get when() {
        return !list.grouped.loading;
      },
      get fallback() {
        return createComponent(ListLoadingState, {
          get label() {
            return `${language.t("common.loading")}${language.t("common.loading.ellipsis")}`;
          }
        });
      },
      get children() {
        return createComponent(Show, {
          get when() {
            return list.flat().length > 0;
          },
          get fallback() {
            return createComponent(ListEmptyState, {
              get message() {
                return language.t("dialog.model.empty");
              },
              get filter() {
                return list.filter();
              }
            });
          },
          get children() {
            return createComponent(For, {
              get each() {
                return list.grouped.latest;
              },
              children: (group) => (() => {
                var _el$14 = _tmpl$4(), _el$15 = _el$14.firstChild, _el$16 = _el$15.firstChild;
                insert(_el$15, createComponent(ProviderIcon, {
                  get id() {
                    return group.category;
                  },
                  "class": "size-5 shrink-0 icon-strong-base"
                }), _el$16);
                insert(_el$16, () => group.items[0].provider.name);
                insert(_el$14, createComponent(SettingsList, {
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
                        return (() => {
                          var _el$17 = _tmpl$5(), _el$18 = _el$17.firstChild, _el$19 = _el$18.firstChild, _el$20 = _el$18.nextSibling;
                          insert(_el$19, () => item.name);
                          insert(_el$20, createComponent(Switch, {
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
                          return _el$17;
                        })();
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
    }));
    return _el$9;
  })();
};
var _tmpl$$1 = /* @__PURE__ */ template(`<div class="flex flex-1 min-h-0 flex-col gap-4 pt-6"><div class="text-16-medium text-text-strong">`), _tmpl$2 = /* @__PURE__ */ template(`<div class="flex flex-col h-full overflow-y-auto no-scrollbar px-4 pb-10 sm:px-10 sm:pb-10"><div class="flex flex-col flex-1 min-h-0 max-w-[720px]">`), _tmpl$3 = /* @__PURE__ */ template(`<div class="sticky top-0 z-10 bg-[linear-gradient(to_bottom,var(--surface-stronger-non-alpha)_calc(100%_-_24px),transparent)]"><div class="flex flex-col gap-1 pt-6 pb-8"><h2 class="text-16-medium text-text-strong">`);
const SettingsServers = () => {
  const language = useLanguage();
  const controller = useServerManagementController();
  return (() => {
    var _el$ = _tmpl$2(), _el$2 = _el$.firstChild;
    insert(_el$2, createComponent(Show, {
      get when() {
        return controller.isFormMode();
      },
      get fallback() {
        return [(() => {
          var _el$5 = _tmpl$3(), _el$6 = _el$5.firstChild, _el$7 = _el$6.firstChild;
          insert(_el$7, () => language.t("status.popover.tab.servers"));
          return _el$5;
        })(), createComponent(ServerConnectionList, {
          controller
        })];
      },
      get children() {
        var _el$3 = _tmpl$$1(), _el$4 = _el$3.firstChild;
        insert(_el$4, () => controller.formTitle());
        insert(_el$3, createComponent(ServerConnectionForm, {
          controller
        }), null);
        return _el$3;
      }
    }));
    return _el$;
  })();
};
var _tmpl$ = /* @__PURE__ */ template(`<div class="flex flex-col justify-between h-full w-full gap-4"><div class="flex flex-col gap-3 w-full pt-3"><div class="flex flex-col gap-3"><div class="flex flex-col gap-1.5"><div class="flex flex-col gap-1.5 w-full"></div></div><div class="flex flex-col gap-1.5"><div class="flex flex-col gap-1.5 w-full"></div></div></div></div><div class="flex flex-col gap-1 pl-1 py-1 text-12-medium text-text-weak"><span></span><span class=text-11-regular>v`);
const DialogSettings = () => {
  const language = useLanguage();
  const platform = usePlatform();
  return createComponent(Dialog, {
    size: "x-large",
    transition: true,
    get children() {
      return createComponent(Tabs, {
        orientation: "vertical",
        variant: "settings",
        defaultValue: "general",
        "class": "h-full settings-dialog",
        get children() {
          return [createComponent(Tabs.List, {
            get children() {
              var _el$ = _tmpl$(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$6 = _el$4.nextSibling, _el$7 = _el$6.firstChild, _el$8 = _el$2.nextSibling, _el$9 = _el$8.firstChild, _el$0 = _el$9.nextSibling;
              _el$0.firstChild;
              insert(_el$4, createComponent(Tabs.SectionTitle, {
                get children() {
                  return language.t("settings.section.desktop");
                }
              }), _el$5);
              insert(_el$5, createComponent(Tabs.Trigger, {
                value: "general",
                get children() {
                  return [createComponent(Icon, {
                    name: "sliders"
                  }), memo(() => language.t("settings.tab.general"))];
                }
              }), null);
              insert(_el$5, createComponent(Tabs.Trigger, {
                value: "shortcuts",
                get children() {
                  return [createComponent(Icon, {
                    name: "keyboard"
                  }), memo(() => language.t("settings.tab.shortcuts"))];
                }
              }), null);
              insert(_el$5, createComponent(Tabs.Trigger, {
                value: "servers",
                get children() {
                  return [createComponent(Icon, {
                    name: "server"
                  }), memo(() => language.t("status.popover.tab.servers"))];
                }
              }), null);
              insert(_el$6, createComponent(Tabs.SectionTitle, {
                get children() {
                  return language.t("settings.section.server");
                }
              }), _el$7);
              insert(_el$7, createComponent(Tabs.Trigger, {
                value: "providers",
                get children() {
                  return [createComponent(Icon, {
                    name: "providers"
                  }), memo(() => language.t("settings.providers.title"))];
                }
              }), null);
              insert(_el$7, createComponent(Tabs.Trigger, {
                value: "models",
                get children() {
                  return [createComponent(Icon, {
                    name: "models"
                  }), memo(() => language.t("settings.models.title"))];
                }
              }), null);
              insert(_el$9, () => language.t("app.name.desktop"));
              insert(_el$0, () => platform.version, null);
              return _el$;
            }
          }), createComponent(Tabs.Content, {
            value: "general",
            "class": "no-scrollbar",
            get children() {
              return createComponent(SettingsGeneral, {});
            }
          }), createComponent(Tabs.Content, {
            value: "shortcuts",
            "class": "no-scrollbar",
            get children() {
              return createComponent(SettingsKeybinds, {});
            }
          }), createComponent(Tabs.Content, {
            value: "servers",
            "class": "no-scrollbar",
            get children() {
              return createComponent(SettingsServers, {});
            }
          }), createComponent(Tabs.Content, {
            value: "providers",
            "class": "no-scrollbar",
            get children() {
              return createComponent(SettingsProviders, {});
            }
          }), createComponent(Tabs.Content, {
            value: "models",
            "class": "no-scrollbar",
            get children() {
              return createComponent(SettingsModels, {});
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
//# sourceMappingURL=dialog-settings-BcaPjZrS.js.map
