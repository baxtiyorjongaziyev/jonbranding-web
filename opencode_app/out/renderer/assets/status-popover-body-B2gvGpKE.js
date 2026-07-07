const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./main-Do1GNfcH.js","./main-DetviuuX.css"])))=>i.map(i=>d[i]);
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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "e46bfaec-befa-4ab9-b1e0-44491f0e2036", e._sentryDebugIdIdentifier = "sentry-dbid-e46bfaec-befa-4ab9-b1e0-44491f0e2036");
    })();
  } catch (e) {
  }
}
;
import { c1 as useSync, bH as useGlobal, bV as useServer, bQ as usePlatform, bD as useDialog, bI as useLanguage, bN as useNavigate, b$ as useSettings, ao as createEffect, b6 as onCleanup, au as createMemo, aV as insert, al as createComponent, $ as Tabs, aZ as memo, m as For, H as ServerConnection, O as ServerHealthIndicator, T as ServerRow, X as Show, I as Icon, ay as createRenderEffect, ah as classList, bn as setAttribute, B as Button, a6 as __vitePreload, aC as createStore, bs as template, aH as delegateEvents } from "./main-Do1GNfcH.js";
import { S as Switch } from "./switch-CcOrtMmL.js";
import { u as useMcpToggle } from "./mcp-qaCAPBPc.js";
import "./LROKH5N7-Bao07a_E.js";
var _tmpl$ = /* @__PURE__ */ template(`<code class="bg-surface-raised-base px-1.5 py-0.5 rounded-sm text-text-base">`), _tmpl$2 = /* @__PURE__ */ template(`<div class="flex items-center gap-1 w-[360px] rounded-xl shadow-[var(--shadow-lg-border-base)]">`), _tmpl$3 = /* @__PURE__ */ template(`<div class="flex flex-col px-2 pb-2"><div class="flex flex-col p-3 bg-background-base rounded-sm min-h-14">`), _tmpl$4 = /* @__PURE__ */ template(`<div class=flex-1>`), _tmpl$5 = /* @__PURE__ */ template(`<button type=button class="flex items-center gap-2 w-full h-8 pl-3 pr-1.5 py-1.5 rounded-md transition-colors text-left">`), _tmpl$6 = /* @__PURE__ */ template(`<span class="text-11-regular text-text-base bg-surface-base px-1.5 py-0.5 rounded-md">`), _tmpl$7 = /* @__PURE__ */ template(`<div class="text-14-regular text-text-base text-center my-auto">`), _tmpl$8 = /* @__PURE__ */ template(`<span class="text-11-regular text-text-weaker truncate">`), _tmpl$9 = /* @__PURE__ */ template(`<button type=button class="flex items-center gap-2 w-full min-h-8 pl-3 pr-2 py-1 rounded-md hover:bg-surface-raised-base-hover transition-colors text-left"><div></div><span class="flex flex-col min-w-0 flex-1"><span class="flex items-center gap-2 min-w-0"><span class="text-14-regular text-text-base truncate"></span></span></span><div>`), _tmpl$0 = /* @__PURE__ */ template(`<div class="flex items-center gap-2 w-full px-2 py-1"><div></div><span class="text-14-regular text-text-base truncate">`), _tmpl$1 = /* @__PURE__ */ template(`<div class="flex items-center gap-2 w-full px-2 py-1"><div class="size-1.5 rounded-full shrink-0 bg-icon-success-base"></div><span class="text-14-regular text-text-base truncate">`);
const pluginEmptyMessage = (value, file) => {
  const parts = value.split(file);
  if (parts.length === 1) return value;
  return [memo(() => parts[0]), (() => {
    var _el$ = _tmpl$();
    insert(_el$, file);
    return _el$;
  })(), memo(() => parts.slice(1).join(file))];
};
const listServersByHealth = (list, active, status) => {
  if (!list.length) return list;
  const order = new Map(list.map((url, index) => [url, index]));
  const rank = (value) => {
    if (value?.healthy === true) return 0;
    if (value?.healthy === false) return 2;
    return 1;
  };
  return list.slice().sort((a, b) => {
    if (ServerConnection.key(a) === active) return -1;
    if (ServerConnection.key(b) === active) return 1;
    const diff = rank(status[ServerConnection.key(a)]) - rank(status[ServerConnection.key(b)]);
    if (diff !== 0) return diff;
    return (order.get(a) ?? 0) - (order.get(b) ?? 0);
  });
};
const useDefaultServerKey = (get) => {
  const [state, setState] = createStore({
    key: void 0,
    tick: 0
  });
  createEffect(() => {
    state.tick;
    let dead = false;
    const result = get?.();
    if (!result) {
      setState("key", void 0);
      onCleanup(() => {
        dead = true;
      });
      return;
    }
    if (result instanceof Promise) {
      void result.then((next) => {
        if (dead) return;
        setState("key", next ?? void 0);
      });
      onCleanup(() => {
        dead = true;
      });
      return;
    }
    setState("key", ServerConnection.Key.make(result));
    onCleanup(() => {
      dead = true;
    });
  });
  return {
    key: () => {
      return state.key;
    },
    refresh: () => setState("tick", (value) => value + 1)
  };
};
function StatusPopoverServerBody() {
  const global2 = useGlobal();
  const server = useServer();
  const platform = usePlatform();
  const dialog = useDialog();
  const language = useLanguage();
  const navigate = useNavigate();
  let dialogRun = 0;
  let dialogDead = false;
  onCleanup(() => {
    dialogDead = true;
    dialogRun += 1;
  });
  const sortedServers = createMemo(() => listServersByHealth(global2.servers.list(), server.key, global2.servers.health));
  const defaultServer = useDefaultServerKey(platform.getDefaultServer);
  const serverItems = createMemo(() => sortedServers().map((conn) => {
    const key = ServerConnection.key(conn);
    return {
      key,
      conn,
      health: global2.servers.health[key],
      blocked: global2.servers.health[key]?.healthy === false,
      active: !!server.current && key === ServerConnection.key(server.current),
      onSelect: () => {
        navigate("/");
        queueMicrotask(() => server.setActive(key));
      }
    };
  }));
  return createComponent(ServerStatusPopoverView, {
    get state() {
      return {
        servers: serverItems,
        defaultKey: defaultServer.key,
        ariaLabel: language.t("status.popover.ariaLabel"),
        serversLabel: language.t("status.popover.tab.servers"),
        defaultLabel: language.t("common.default"),
        manageLabel: language.t("status.popover.action.manageServers"),
        onManage: () => {
          const run = ++dialogRun;
          void __vitePreload(() => import("./main-Do1GNfcH.js").then((n) => n.aI), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url).then((x) => {
            if (dialogDead || dialogRun !== run) return;
            dialog.show(() => createComponent(x.DialogSelectServer, {}), defaultServer.refresh);
          });
        }
      };
    }
  });
}
function ServerStatusPopoverView(props) {
  return (() => {
    var _el$2 = _tmpl$2();
    insert(_el$2, createComponent(Tabs, {
      get ["aria-label"]() {
        return props.state.ariaLabel;
      },
      "class": "tabs bg-background-strong rounded-xl overflow-hidden",
      "data-component": "tabs",
      "data-active": "servers",
      defaultValue: "servers",
      variant: "alt",
      get children() {
        return [createComponent(Tabs.List, {
          "data-slot": "tablist",
          "class": "bg-transparent border-b-0 px-4 pt-2 pb-0 gap-4 h-10",
          get children() {
            return createComponent(Tabs.Trigger, {
              value: "servers",
              "data-slot": "tab",
              "class": "text-12-regular",
              get children() {
                return [memo(() => memo(() => props.state.servers().length > 0)() ? `${props.state.servers().length} ` : ""), memo(() => props.state.serversLabel)];
              }
            });
          }
        }), createComponent(Tabs.Content, {
          value: "servers",
          get children() {
            return createComponent(ServerStatusList, {
              get state() {
                return props.state;
              }
            });
          }
        })];
      }
    }));
    return _el$2;
  })();
}
function ServerStatusList(props) {
  return (() => {
    var _el$3 = _tmpl$3(), _el$4 = _el$3.firstChild;
    insert(_el$4, createComponent(For, {
      get each() {
        return props.state.servers();
      },
      children: (item) => {
        return (() => {
          var _el$5 = _tmpl$5();
          _el$5.$$click = () => {
            if (item.blocked) return;
            item.onSelect();
          };
          insert(_el$5, createComponent(ServerHealthIndicator, {
            get health() {
              return item.health;
            }
          }), null);
          insert(_el$5, createComponent(ServerRow, {
            get conn() {
              return item.conn;
            },
            get dimmed() {
              return item.blocked;
            },
            get status() {
              return item.health;
            },
            "class": "flex items-center gap-2 w-full min-w-0",
            nameClass: "text-14-regular text-text-base truncate",
            versionClass: "text-12-regular text-text-weak truncate",
            get badge() {
              return createComponent(Show, {
                get when() {
                  return item.key === props.state.defaultKey();
                },
                get children() {
                  var _el$7 = _tmpl$6();
                  insert(_el$7, () => props.state.defaultLabel);
                  return _el$7;
                }
              });
            },
            get children() {
              return [_tmpl$4(), createComponent(Show, {
                get when() {
                  return item.active;
                },
                get children() {
                  return createComponent(Icon, {
                    name: "check",
                    size: "small",
                    "class": "text-icon-weak shrink-0"
                  });
                }
              })];
            }
          }), null);
          createRenderEffect((_p$) => {
            var _v$ = {
              "hover:bg-surface-raised-base-hover": !item.blocked,
              "cursor-not-allowed": item.blocked
            }, _v$2 = item.blocked;
            _p$.e = classList(_el$5, _v$, _p$.e);
            _v$2 !== _p$.t && setAttribute(_el$5, "aria-disabled", _p$.t = _v$2);
            return _p$;
          }, {
            e: void 0,
            t: void 0
          });
          return _el$5;
        })();
      }
    }), null);
    insert(_el$4, createComponent(Button, {
      variant: "secondary",
      "class": "mt-3 self-start h-8 px-3 py-1.5",
      get onClick() {
        return props.state.onManage;
      },
      get children() {
        return props.state.manageLabel;
      }
    }), null);
    return _el$3;
  })();
}
function StatusPopoverBody(props) {
  const sync = useSync();
  const global2 = useGlobal();
  const server = useServer();
  const platform = usePlatform();
  const dialog = useDialog();
  const language = useLanguage();
  const navigate = useNavigate();
  const settings = useSettings();
  createEffect(() => {
    if (!props.shown()) return;
  });
  let dialogRun = 0;
  let dialogDead = false;
  onCleanup(() => {
    dialogDead = true;
    dialogRun += 1;
  });
  const sortedServers = createMemo(() => listServersByHealth(global2.servers.list(), server.key, global2.servers.health));
  const toggleMcp = useMcpToggle();
  const defaultServer = useDefaultServerKey(platform.getDefaultServer);
  const mcpNames = createMemo(() => Object.keys(sync().data.mcp ?? {}).sort((a, b) => a.localeCompare(b)));
  const mcpStatus = (name) => sync().data.mcp?.[name]?.status;
  const mcpConnected = createMemo(() => mcpNames().filter((name) => mcpStatus(name) === "connected").length);
  const lspItems = createMemo(() => sync().data.lsp ?? []);
  const lspCount = createMemo(() => lspItems().length);
  const plugins = createMemo(() => (sync().data.config.plugin ?? []).map((item) => typeof item === "string" ? item : item[0]));
  const pluginCount = createMemo(() => plugins().length);
  const pluginEmpty = createMemo(() => pluginEmptyMessage(language.t("dialog.plugins.empty"), "opencode.json"));
  return (() => {
    var _el$8 = _tmpl$2();
    insert(_el$8, createComponent(Tabs, {
      get ["aria-label"]() {
        return language.t("status.popover.ariaLabel");
      },
      "class": "tabs bg-background-strong rounded-xl overflow-hidden",
      "data-component": "tabs",
      get ["data-active"]() {
        return settings.general.newLayoutDesigns() ? "mcp" : "servers";
      },
      get defaultValue() {
        return settings.general.newLayoutDesigns() ? "mcp" : "servers";
      },
      variant: "alt",
      get children() {
        return [createComponent(Tabs.List, {
          "data-slot": "tablist",
          "class": "bg-transparent border-b-0 px-4 pt-2 pb-0 gap-4 h-10",
          get children() {
            return [memo(() => memo(() => !!!settings.general.newLayoutDesigns())() && createComponent(Tabs.Trigger, {
              value: "servers",
              "data-slot": "tab",
              "class": "text-12-regular",
              get children() {
                return [memo(() => memo(() => global2.servers.list().length > 0)() ? `${global2.servers.list().length} ` : ""), memo(() => language.t("status.popover.tab.servers"))];
              }
            })), createComponent(Tabs.Trigger, {
              value: "mcp",
              "data-slot": "tab",
              "class": "text-12-regular",
              get children() {
                return [memo(() => memo(() => mcpConnected() > 0)() ? `${mcpConnected()} ` : ""), memo(() => language.t("status.popover.tab.mcp"))];
              }
            }), createComponent(Tabs.Trigger, {
              value: "lsp",
              "data-slot": "tab",
              "class": "text-12-regular",
              get children() {
                return [memo(() => memo(() => lspCount() > 0)() ? `${lspCount()} ` : ""), memo(() => language.t("status.popover.tab.lsp"))];
              }
            }), createComponent(Tabs.Trigger, {
              value: "plugins",
              "data-slot": "tab",
              "class": "text-12-regular",
              get children() {
                return [memo(() => memo(() => pluginCount() > 0)() ? `${pluginCount()} ` : ""), memo(() => language.t("status.popover.tab.plugins"))];
              }
            })];
          }
        }), memo(() => memo(() => !!!settings.general.newLayoutDesigns())() && createComponent(Tabs.Content, {
          value: "servers",
          get children() {
            var _el$13 = _tmpl$3(), _el$14 = _el$13.firstChild;
            insert(_el$14, createComponent(For, {
              get each() {
                return sortedServers();
              },
              children: (s) => {
                const key = ServerConnection.key(s);
                const blocked = () => global2.servers.health[key]?.healthy === false;
                return (() => {
                  var _el$15 = _tmpl$5();
                  _el$15.$$click = () => {
                    if (blocked()) return;
                    navigate("/");
                    queueMicrotask(() => server.setActive(key));
                  };
                  insert(_el$15, createComponent(ServerHealthIndicator, {
                    get health() {
                      return global2.servers.health[key];
                    }
                  }), null);
                  insert(_el$15, createComponent(ServerRow, {
                    conn: s,
                    get dimmed() {
                      return blocked();
                    },
                    get status() {
                      return global2.servers.health[key];
                    },
                    "class": "flex items-center gap-2 w-full min-w-0",
                    nameClass: "text-14-regular text-text-base truncate",
                    versionClass: "text-12-regular text-text-weak truncate",
                    get badge() {
                      return createComponent(Show, {
                        get when() {
                          return key === defaultServer.key();
                        },
                        get children() {
                          var _el$17 = _tmpl$6();
                          insert(_el$17, () => language.t("common.default"));
                          return _el$17;
                        }
                      });
                    },
                    get children() {
                      return [_tmpl$4(), createComponent(Show, {
                        get when() {
                          return memo(() => !!server.current)() && key === ServerConnection.key(server.current);
                        },
                        get children() {
                          return createComponent(Icon, {
                            name: "check",
                            size: "small",
                            "class": "text-icon-weak shrink-0"
                          });
                        }
                      })];
                    }
                  }), null);
                  createRenderEffect((_p$) => {
                    var _v$3 = {
                      "hover:bg-surface-raised-base-hover": !blocked(),
                      "cursor-not-allowed": blocked()
                    }, _v$4 = blocked();
                    _p$.e = classList(_el$15, _v$3, _p$.e);
                    _v$4 !== _p$.t && setAttribute(_el$15, "aria-disabled", _p$.t = _v$4);
                    return _p$;
                  }, {
                    e: void 0,
                    t: void 0
                  });
                  return _el$15;
                })();
              }
            }), null);
            insert(_el$14, createComponent(Button, {
              variant: "secondary",
              "class": "mt-3 self-start h-8 px-3 py-1.5",
              onClick: () => {
                const run = ++dialogRun;
                void __vitePreload(() => import("./main-Do1GNfcH.js").then((n) => n.aI), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url).then((x) => {
                  if (dialogDead || dialogRun !== run) return;
                  dialog.show(() => createComponent(x.DialogSelectServer, {}), defaultServer.refresh);
                });
              },
              get children() {
                return language.t("status.popover.action.manageServers");
              }
            }), null);
            return _el$13;
          }
        })), createComponent(Tabs.Content, {
          value: "mcp",
          get children() {
            var _el$9 = _tmpl$3(), _el$0 = _el$9.firstChild;
            insert(_el$0, createComponent(Show, {
              get when() {
                return mcpNames().length > 0;
              },
              get fallback() {
                return (() => {
                  var _el$18 = _tmpl$7();
                  insert(_el$18, () => language.t("dialog.mcp.empty"));
                  return _el$18;
                })();
              },
              get children() {
                return createComponent(For, {
                  get each() {
                    return mcpNames();
                  },
                  children: (name) => {
                    const status = () => mcpStatus(name);
                    const enabled = () => status() === "connected";
                    return (() => {
                      var _el$19 = _tmpl$9(), _el$20 = _el$19.firstChild, _el$21 = _el$20.nextSibling, _el$22 = _el$21.firstChild, _el$23 = _el$22.firstChild, _el$25 = _el$21.nextSibling;
                      _el$19.$$click = () => {
                        if (toggleMcp.isPending) return;
                        toggleMcp.mutate(name);
                      };
                      insert(_el$23, name);
                      insert(_el$21, createComponent(Show, {
                        get when() {
                          return status() === "needs_auth";
                        },
                        get children() {
                          var _el$24 = _tmpl$8();
                          insert(_el$24, () => language.t("mcp.auth.clickToAuthenticate"));
                          return _el$24;
                        }
                      }), null);
                      _el$25.$$click = (event) => event.stopPropagation();
                      insert(_el$25, createComponent(Switch, {
                        get checked() {
                          return enabled();
                        },
                        get disabled() {
                          return memo(() => !!toggleMcp.isPending)() && toggleMcp.variables === name;
                        },
                        onChange: () => {
                          if (toggleMcp.isPending) return;
                          toggleMcp.mutate(name);
                        }
                      }));
                      createRenderEffect((_p$) => {
                        var _v$5 = toggleMcp.isPending && toggleMcp.variables === name, _v$6 = {
                          "size-1.5 rounded-full shrink-0": true,
                          "bg-icon-success-base": status() === "connected",
                          "bg-icon-critical-base": status() === "failed",
                          "bg-border-weak-base": status() === "disabled",
                          "bg-icon-warning-base": status() === "needs_auth" || status() === "needs_client_registration"
                        };
                        _v$5 !== _p$.e && (_el$19.disabled = _p$.e = _v$5);
                        _p$.t = classList(_el$20, _v$6, _p$.t);
                        return _p$;
                      }, {
                        e: void 0,
                        t: void 0
                      });
                      return _el$19;
                    })();
                  }
                });
              }
            }));
            return _el$9;
          }
        }), createComponent(Tabs.Content, {
          value: "lsp",
          get children() {
            var _el$1 = _tmpl$3(), _el$10 = _el$1.firstChild;
            insert(_el$10, createComponent(Show, {
              get when() {
                return lspItems().length > 0;
              },
              get fallback() {
                return (() => {
                  var _el$26 = _tmpl$7();
                  insert(_el$26, () => language.t("dialog.lsp.empty"));
                  return _el$26;
                })();
              },
              get children() {
                return createComponent(For, {
                  get each() {
                    return lspItems();
                  },
                  children: (item) => (() => {
                    var _el$27 = _tmpl$0(), _el$28 = _el$27.firstChild, _el$29 = _el$28.nextSibling;
                    insert(_el$29, () => item.name || item.id);
                    createRenderEffect((_$p) => classList(_el$28, {
                      "size-1.5 rounded-full shrink-0": true,
                      "bg-icon-success-base": item.status === "connected",
                      "bg-icon-critical-base": item.status === "error"
                    }, _$p));
                    return _el$27;
                  })()
                });
              }
            }));
            return _el$1;
          }
        }), createComponent(Tabs.Content, {
          value: "plugins",
          get children() {
            var _el$11 = _tmpl$3(), _el$12 = _el$11.firstChild;
            insert(_el$12, createComponent(Show, {
              get when() {
                return plugins().length > 0;
              },
              get fallback() {
                return (() => {
                  var _el$30 = _tmpl$7();
                  insert(_el$30, pluginEmpty);
                  return _el$30;
                })();
              },
              get children() {
                return createComponent(For, {
                  get each() {
                    return plugins();
                  },
                  children: (plugin) => (() => {
                    var _el$31 = _tmpl$1(), _el$32 = _el$31.firstChild, _el$33 = _el$32.nextSibling;
                    insert(_el$33, plugin);
                    return _el$31;
                  })()
                });
              }
            }));
            return _el$11;
          }
        })];
      }
    }));
    return _el$8;
  })();
}
delegateEvents(["click"]);
export {
  StatusPopoverBody,
  StatusPopoverServerBody
};
//# sourceMappingURL=status-popover-body-B2gvGpKE.js.map
