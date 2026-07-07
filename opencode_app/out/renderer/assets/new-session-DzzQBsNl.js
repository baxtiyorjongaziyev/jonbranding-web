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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "f75d7874-31c2-434a-bd15-4152596ceafa", e._sentryDebugIdIdentifier = "sentry-dbid-f75d7874-31c2-434a-bd15-4152596ceafa");
    })();
  } catch (e) {
  }
}
;
import { aE as createUniqueId, bn as setAttribute, ay as createRenderEffect, ah as classList, bs as template, ai as className, aV as insert, al as createComponent, bI as useLanguage, aC as createStore, aJ as displayName, I as Icon, j as DropdownMenu, by as use, X as Show, m as For, b9 as pathKey, bq as splitProps, br as spread, a$ as mergeProps, x as ProjectAvatar, aS as getProjectAvatarVariant, aR as getProjectAvatarSource, aZ as memo, r as Icon$1, aH as delegateEvents, u as MenuV2, aQ as getFilename, bR as usePrompt, bT as useSDK, c1 as useSync, bY as useServerSync, bA as useComments, bZ as useSessionKey, bU as useSearchParams, bB as useComposerCommands, c0 as useSettingsCommand, aw as createPromptInputController, ax as createPromptProjectControls, au as createMemo, ao as createEffect, bx as untrack, az as createResource, y as PromptInput } from "./main-Do1GNfcH.js";
var _tmpl$$4 = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 720.002 129.001"fill=none preserveAspectRatio=none><g opacity=0.16><path opacity=0.7 d="M55.3846 36.8583H18.4615V92.144H55.3846V36.8583ZM73.8462 110.573H0V18.4297H73.8462V110.573Z"fill=currentColor></path><path opacity=0.7 d="M110.774 92.144H147.697V36.8583H110.774V92.144ZM166.159 110.573H110.774V129.001H92.3125V18.4297H166.159V110.573Z"fill=currentColor></path><path opacity=0.7 d="M258.463 73.7154H203.079V92.144H258.463V110.573H184.617V18.4297H258.463V73.7154ZM203.079 55.2868H240.002V36.8583H203.079V55.2868Z"fill=currentColor></path><path opacity=0.7 d="M332.306 36.8583H295.383V110.573H276.922V18.4297H332.306V36.8583ZM350.768 110.573H332.306V36.8583H350.768V110.573Z"fill=currentColor></path><path opacity=0.7 d="M443.081 36.8583H387.696V92.144H443.081V110.573H369.234V18.4297H443.081V36.8583Z"fill=currentColor></path><path opacity=0.7 d="M516.924 36.8583H480.001V92.144H516.924V36.8583ZM535.385 110.573H461.539V18.4297H535.385V110.573Z"fill=currentColor></path><path opacity=0.7 d="M609.228 36.8571H572.305V92.1429H609.228V36.8571ZM627.69 110.571H553.844V18.4286H609.228V0H627.69V110.571Z"fill=currentColor></path><path opacity=0.7 d="M664.618 36.8583V55.2868H701.541V36.8583H664.618ZM720.002 73.7154H664.618V92.144H720.002V110.573H646.156V18.4297H720.002V73.7154Z"fill=currentColor></path></g><defs><mask maskUnits=userSpaceOnUse x=0 y=0 width=720 height=129><rect width=720 height=129></rect></mask><linearGradient x1=360 y1=0 x2=360 y2=112 gradientUnits=userSpaceOnUse><stop stop-color=white stop-opacity=0.7></stop><stop offset=1 stop-color=white stop-opacity=0></stop></linearGradient><filter x=0 y=0 width=720.002 height=130.001 filterUnits=userSpaceOnUse color-interpolation-filters=sRGB><feFlood flood-opacity=0 result=BackgroundImageFix></feFlood><feBlend mode=normal in=SourceGraphic in2=BackgroundImageFix result=shape></feBlend><feColorMatrix in=SourceAlpha type=matrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"result=hardAlpha></feColorMatrix><feOffset dy=1></feOffset><feGaussianBlur stdDeviation=1></feGaussianBlur><feComposite in2=hardAlpha operator=arithmetic k2=-1 k3=1></feComposite><feColorMatrix type=matrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"></feColorMatrix><feBlend mode=normal in2=shape result=effect1_innerShadow_4938_16028>`);
function WordmarkV2(props) {
  const filter = createUniqueId();
  const mask = createUniqueId();
  const maskGradient = createUniqueId();
  return (() => {
    var _el$ = _tmpl$$4(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.firstChild, _el$5 = _el$4.firstChild, _el$6 = _el$4.nextSibling, _el$7 = _el$6.nextSibling;
    setAttribute(_el$2, "filter", `url(#${filter})`);
    setAttribute(_el$2, "mask", `url(#${mask})`);
    setAttribute(_el$4, "id", mask);
    setAttribute(_el$5, "fill", `url(#${maskGradient})`);
    setAttribute(_el$6, "id", maskGradient);
    setAttribute(_el$7, "id", filter);
    createRenderEffect((_$p) => classList(_el$, {
      [props.class ?? ""]: !!props.class
    }, _$p));
    return _el$;
  })();
}
const NEW_SESSION_CONTENT_WIDTH = "w-full max-w-[720px] px-0";
var _tmpl$$3 = /* @__PURE__ */ template(`<div data-component=session-new-design class="relative size-full overflow-hidden bg-v2-background-bg-deep "><div class="absolute inset-x-0 top-[25.375%] flex justify-center px-6"><div><div class=mt-8>`);
function NewSessionDesignView(props) {
  return (() => {
    var _el$ = _tmpl$$3(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild;
    className(_el$3, NEW_SESSION_CONTENT_WIDTH);
    insert(_el$3, createComponent(WordmarkV2, {
      "class": "h-auto w-full text-v2-icon-icon-base"
    }), _el$4);
    insert(_el$4, () => props.children);
    return _el$;
  })();
}
var _tmpl$$2 = /* @__PURE__ */ template(`<button type=button class="flex size-5 items-center justify-center rounded-sm text-v2-icon-icon-muted hover:bg-v2-overlay-simple-overlay-hover">`), _tmpl$2$2 = /* @__PURE__ */ template(`<div class="flex flex-col p-0.5"><div class="flex h-7 items-center gap-2 rounded-sm pl-3 pr-2.5 text-v2-icon-icon-muted"><input aria-autocomplete=list aria-controls=prompt-project-menu class="h-7 min-w-0 flex-1 border-0 bg-transparent text-[13px] font-[440] leading-5 tracking-[-0.04px] text-v2-text-text-base outline-none placeholder:text-v2-text-text-faint">`), _tmpl$3$2 = /* @__PURE__ */ template(`<div class="h-px bg-v2-border-border-muted">`), _tmpl$4$2 = /* @__PURE__ */ template(`<span data-slot=dropdown-menu-item-label class="min-w-0 flex-1 truncate leading-5">`), _tmpl$5$1 = /* @__PURE__ */ template(`<div class="flex flex-col p-0.5">`), _tmpl$6 = /* @__PURE__ */ template(`<div><div class="flex h-7 select-none items-center pl-1.5 pr-3 text-[11px] font-[530] leading-none tracking-[0.05px] text-v2-text-text-faint">`), _tmpl$7 = /* @__PURE__ */ template(`<button data-action=prompt-project type=button class="flex h-7 min-w-0 max-w-[160px] items-center gap-1.5 rounded-sm px-2 text-[13px] font-[440] leading-5 tracking-[-0.04px] text-v2-text-text-faint transition-colors hover:bg-v2-overlay-simple-overlay-hover focus-visible:bg-v2-overlay-simple-overlay-hover focus-visible:outline-none"><span class="min-w-0 truncate leading-5">`), _tmpl$8 = /* @__PURE__ */ template(`<button><span class="min-w-0 truncate leading-5">`);
const actionPrefix = "action:";
const projectPrefix = "project:";
function projectKey(project) {
  return `${projectPrefix}${encodeURIComponent(project.server?.key ?? "")}:${encodeURIComponent(project.worktree)}`;
}
function actionKey(server) {
  return `${actionPrefix}${encodeURIComponent(server ?? "")}`;
}
function createPromptProjectController(input) {
  const language = useLanguage();
  const [store, setStore] = createStore({
    open: false,
    search: "",
    active: ""
  });
  let searchRef;
  const selected = () => {
    const key = pathKey(input.controls().directory);
    return input.controls().available.find((project) => (!project.server || project.server.key === input.controls().server) && (pathKey(project.worktree) === key || project.sandboxes?.some((sandbox) => pathKey(sandbox) === key)));
  };
  const projects = () => {
    const search = store.search.trim().toLowerCase();
    if (!search) return input.controls().available;
    return input.controls().available.filter((project) => displayName(project).toLowerCase().includes(search));
  };
  const servers = () => input.controls().available.map((project) => project.server).filter((server, index, all) => server && all.findIndex((item) => item?.key === server.key) === index);
  const keys = () => {
    if (servers().length <= 1) {
      return [...projects().map(projectKey), actionKey(servers()[0]?.key)];
    }
    return [...servers().flatMap((server) => projects().filter((project) => project.server?.key === server.key).map(projectKey)), actionKey()];
  };
  const initialActive = () => {
    const selectedKey = selected() ? projectKey(selected()) : void 0;
    const options = keys();
    if (selectedKey && options.includes(selectedKey)) return selectedKey;
    return options[0] ?? "";
  };
  const close = () => {
    setStore({
      open: false,
      search: "",
      active: ""
    });
    input.onDone();
  };
  const select = (project) => {
    if (pathKey(project.worktree) !== pathKey(selected()?.worktree ?? "") || project.server?.key !== selected()?.server?.key) {
      input.controls().select(project.worktree, project.server?.key);
    }
    close();
  };
  const add = (server) => {
    setStore({
      open: false,
      search: "",
      active: ""
    });
    input.controls().add(language.t("command.project.open"), server);
  };
  return {
    selected,
    projects,
    servers,
    projectKey,
    actionKey,
    open: () => store.open,
    search: () => store.search,
    active: () => store.active,
    labels: {
      add: () => language.t("session.new.project.add"),
      clear: () => language.t("common.clear"),
      new: () => language.t("session.new.project.new"),
      search: () => language.t("session.new.project.search")
    },
    add,
    select,
    setOpen(open) {
      if (open) {
        setStore({
          open: true,
          active: initialActive()
        });
        setTimeout(() => requestAnimationFrame(() => searchRef?.focus()));
        return;
      }
      setStore({
        open: false,
        search: "",
        active: ""
      });
    },
    setSearch(value) {
      const search = value.trim().toLowerCase();
      const first = input.controls().available.find((project) => !search || displayName(project).toLowerCase().includes(search));
      setStore({
        search: value,
        active: first ? projectKey(first) : actionKey(servers().length > 1 ? void 0 : servers()[0]?.key)
      });
    },
    clearSearch() {
      setStore({
        search: "",
        active: initialActive()
      });
      setTimeout(() => searchRef?.focus());
    },
    setActive(key) {
      setStore("active", key);
    },
    moveActive(delta) {
      const options = keys();
      if (options.length === 0) return;
      const index = options.indexOf(store.active);
      const start = index === -1 ? 0 : index;
      setStore("active", options[(start + delta + options.length) % options.length]);
    },
    activeProject() {
      return store.active.startsWith(projectPrefix) ? projects().find((project) => projectKey(project) === store.active) : void 0;
    },
    activeServer() {
      return store.active.startsWith(actionPrefix) ? decodeURIComponent(store.active.slice(actionPrefix.length)) || void 0 : void 0;
    },
    activeAction() {
      return store.active.startsWith(actionPrefix);
    },
    setSearchRef(el) {
      searchRef = el;
    },
    focusSearch() {
      setTimeout(() => requestAnimationFrame(() => searchRef?.focus()));
    }
  };
}
function PromptProjectSelector(props) {
  let contentRef;
  let restoreTrigger = true;
  const activeItem = () => props.controller.active() ? contentRef?.querySelector(`[data-option-key="${CSS.escape(props.controller.active())}"]`) : void 0;
  const afterClose = (callback) => {
    const complete = () => {
      if (contentRef?.isConnected) {
        requestAnimationFrame(complete);
        return;
      }
      requestAnimationFrame(() => requestAnimationFrame(callback));
    };
    requestAnimationFrame(complete);
  };
  const selectProject = (project) => {
    restoreTrigger = false;
    props.controller.setOpen(false);
    afterClose(() => props.controller.select(project));
  };
  const selectAction = (server) => {
    restoreTrigger = false;
    props.controller.setOpen(false);
    afterClose(() => props.controller.add(server));
  };
  const selectActive = () => {
    const project = props.controller.activeProject();
    if (project) {
      selectProject(project);
      return;
    }
    if (props.controller.activeAction() && props.controller.servers().length > 1) {
      const item = activeItem();
      item?.focus();
      item?.dispatchEvent(new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true
      }));
      return;
    }
    selectAction(props.controller.activeServer());
  };
  const moveActive = (delta) => {
    props.controller.moveActive(delta);
    queueMicrotask(() => activeItem()?.scrollIntoView({
      block: "nearest"
    }));
  };
  const focusPreviousControl = () => {
    const target = Array.from(document.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter((element) => !contentRef?.contains(element) && !element.hasAttribute("data-focus-trap")).findLast((element) => element.offsetParent !== null);
    restoreTrigger = false;
    target?.focus();
    queueMicrotask(() => {
      if (props.controller.open()) props.controller.setOpen(false);
    });
  };
  const selectedValue = () => {
    const project = props.controller.selected();
    return project ? props.controller.projectKey(project) : void 0;
  };
  return createComponent(DropdownMenu, {
    get open() {
      return props.controller.open();
    },
    get placement() {
      return props.placement ?? "bottom";
    },
    gutter: 4,
    modal: false,
    onOpenChange: (open) => props.controller.setOpen(open),
    get children() {
      return [createComponent(DropdownMenu.Trigger, {
        as: ProjectTrigger,
        get controller() {
          return props.controller;
        }
      }), createComponent(DropdownMenu.Portal, {
        get children() {
          return createComponent(DropdownMenu.Content, {
            ref(r$) {
              var _ref$ = contentRef;
              typeof _ref$ === "function" ? _ref$(r$) : contentRef = r$;
            },
            id: "prompt-project-menu",
            "class": "w-[243px] overflow-hidden rounded-md border-0 bg-v2-background-bg-layer-01 p-0 shadow-[var(--v2-elevation-floating)] focus:outline-none [&[data-closed]]:!animate-none",
            onOpenAutoFocus: (event) => event.preventDefault(),
            onPointerDownOutside: () => restoreTrigger = false,
            onFocusOutside: () => restoreTrigger = false,
            onCloseAutoFocus: (event) => {
              if (!restoreTrigger) event.preventDefault();
            },
            get children() {
              return [(() => {
                var _el$ = _tmpl$2$2(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild;
                insert(_el$2, createComponent(Icon, {
                  name: "magnifying-glass",
                  size: "small",
                  "class": "shrink-0"
                }), _el$3);
                _el$3.$$keydown = (event) => {
                  if (event.key === "Tab") {
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.shiftKey) {
                      focusPreviousControl();
                      return;
                    }
                    activeItem()?.focus();
                    return;
                  }
                  event.stopPropagation();
                  if (event.key === "Escape") {
                    event.preventDefault();
                    props.controller.setOpen(false);
                    return;
                  }
                  if (event.altKey || event.metaKey) return;
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    moveActive(1);
                    return;
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    moveActive(-1);
                    return;
                  }
                  if (event.key === "Enter" && !event.isComposing) {
                    event.preventDefault();
                    selectActive();
                  }
                };
                _el$3.$$input = (event) => props.controller.setSearch(event.currentTarget.value);
                use((el) => props.controller.setSearchRef(el), _el$3);
                insert(_el$2, createComponent(Show, {
                  get when() {
                    return props.controller.search().trim();
                  },
                  get children() {
                    var _el$4 = _tmpl$$2();
                    _el$4.$$click = () => props.controller.clearSearch();
                    _el$4.$$pointerdown = (event) => event.preventDefault();
                    insert(_el$4, createComponent(Icon, {
                      name: "close-small",
                      size: "small"
                    }));
                    createRenderEffect(() => setAttribute(_el$4, "aria-label", props.controller.labels.clear()));
                    return _el$4;
                  }
                }), null);
                insert(_el$, createComponent(Show, {
                  get when() {
                    return props.controller.servers().length > 1;
                  },
                  get fallback() {
                    return createComponent(DropdownMenu.RadioGroup, {
                      get value() {
                        return selectedValue();
                      },
                      get children() {
                        return createComponent(For, {
                          get each() {
                            return props.controller.projects();
                          },
                          children: (project) => createComponent(ProjectItem, {
                            project,
                            get controller() {
                              return props.controller;
                            },
                            onSelect: selectProject
                          })
                        });
                      }
                    });
                  },
                  get children() {
                    return createComponent(For, {
                      get each() {
                        return props.controller.servers().filter((server) => props.controller.projects().some((project) => project.server?.key === server.key));
                      },
                      children: (server) => (() => {
                        var _el$8 = _tmpl$6(), _el$9 = _el$8.firstChild;
                        insert(_el$9, () => server.name);
                        insert(_el$8, createComponent(DropdownMenu.RadioGroup, {
                          get value() {
                            return selectedValue();
                          },
                          get children() {
                            return createComponent(For, {
                              get each() {
                                return props.controller.projects().filter((project) => project.server?.key === server.key);
                              },
                              children: (project) => createComponent(ProjectItem, {
                                project,
                                get controller() {
                                  return props.controller;
                                },
                                onSelect: selectProject
                              })
                            });
                          }
                        }), null);
                        return _el$8;
                      })()
                    });
                  }
                }), null);
                createRenderEffect((_p$) => {
                  var _v$ = props.controller.labels.search(), _v$2 = props.controller.active() || void 0;
                  _v$ !== _p$.e && setAttribute(_el$3, "placeholder", _p$.e = _v$);
                  _v$2 !== _p$.t && setAttribute(_el$3, "aria-activedescendant", _p$.t = _v$2);
                  return _p$;
                }, {
                  e: void 0,
                  t: void 0
                });
                createRenderEffect(() => _el$3.value = props.controller.search());
                return _el$;
              })(), _tmpl$3$2(), (() => {
                var _el$6 = _tmpl$5$1();
                insert(_el$6, createComponent(Show, {
                  get when() {
                    return props.controller.servers().length > 1;
                  },
                  get fallback() {
                    return createComponent(ProjectAction, {
                      get server() {
                        return props.controller.servers()[0]?.key;
                      },
                      get controller() {
                        return props.controller;
                      },
                      onSelect: selectAction
                    });
                  },
                  get children() {
                    return createComponent(DropdownMenu.Sub, {
                      get children() {
                        return [createComponent(DropdownMenu.SubTrigger, {
                          get id() {
                            return props.controller.actionKey();
                          },
                          get ["data-option-key"]() {
                            return props.controller.actionKey();
                          },
                          "class": projectActionClass,
                          get classList() {
                            return {
                              "!bg-v2-overlay-simple-overlay-hover": props.controller.active() === props.controller.actionKey()
                            };
                          },
                          onMouseEnter: () => props.controller.setActive(props.controller.actionKey()),
                          get children() {
                            return [createComponent(Icon, {
                              name: "plus",
                              size: "small"
                            }), (() => {
                              var _el$7 = _tmpl$4$2();
                              insert(_el$7, () => props.controller.labels.add());
                              return _el$7;
                            })(), createComponent(Icon, {
                              name: "chevron-right",
                              size: "small",
                              "class": "shrink-0 text-v2-icon-icon-muted"
                            })];
                          }
                        }), createComponent(DropdownMenu.Portal, {
                          get children() {
                            return createComponent(DropdownMenu.SubContent, {
                              "class": "min-w-[180px] overflow-hidden rounded-md border-0 bg-v2-background-bg-layer-01 p-0.5 shadow-[var(--v2-elevation-floating)] focus:outline-none",
                              get children() {
                                return createComponent(For, {
                                  get each() {
                                    return props.controller.servers();
                                  },
                                  children: (server) => createComponent(ServerAction, {
                                    server,
                                    onSelect: selectAction
                                  })
                                });
                              }
                            });
                          }
                        })];
                      }
                    });
                  }
                }));
                return _el$6;
              })()];
            }
          });
        }
      })];
    }
  });
}
function PromptProjectAddButton(props) {
  return (() => {
    var _el$0 = _tmpl$7(), _el$1 = _el$0.firstChild;
    _el$0.$$click = () => props.controller.add();
    insert(_el$0, createComponent(Icon, {
      name: "folder-add-left",
      size: "small",
      "class": "shrink-0 text-v2-icon-icon-muted"
    }), _el$1);
    insert(_el$1, () => props.controller.labels.new());
    insert(_el$0, createComponent(Icon, {
      name: "chevron-down",
      size: "small",
      "class": "shrink-0 text-v2-icon-icon-muted"
    }), null);
    return _el$0;
  })();
}
function ProjectTrigger(props) {
  const [local, rest] = splitProps(props, ["controller", "class", "classList", "onClick", "onKeyDown"]);
  const project = () => local.controller.selected();
  return (() => {
    var _el$10 = _tmpl$8(), _el$11 = _el$10.firstChild;
    spread(_el$10, mergeProps(rest, {
      "data-action": "prompt-project",
      "type": "button",
      "class": "flex h-7 min-w-0 max-w-[203px] items-center gap-1.5 rounded-sm px-1.5 transition-colors focus-visible:bg-v2-overlay-simple-overlay-hover focus-visible:outline-none",
      get classList() {
        return {
          ...local.classList,
          "hover:bg-v2-overlay-simple-overlay-hover": !local.controller.open(),
          "bg-v2-overlay-simple-overlay-pressed": local.controller.open(),
          "text-v2-text-text-muted": local.controller.open()
        };
      },
      get onClick() {
        return local.onClick ?? (() => local.controller.setOpen(true));
      },
      "onKeyDown": (event) => {
        if (!local.controller.open() && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        if (typeof local.onKeyDown === "function") local.onKeyDown(event);
      }
    }), false, true);
    insert(_el$10, createComponent(Show, {
      get when() {
        return project();
      },
      get fallback() {
        return createComponent(Icon, {
          name: "folder-add-left",
          size: "small",
          "class": "shrink-0 text-v2-icon-icon-muted"
        });
      },
      children: (item) => createComponent(ProjectAvatar, {
        get fallback() {
          return displayName(item());
        },
        get src() {
          return getProjectAvatarSource(item().id, item().icon);
        },
        get variant() {
          return getProjectAvatarVariant(item().icon?.color);
        }
      })
    }), _el$11);
    insert(_el$11, (() => {
      var _c$ = memo(() => !!project());
      return () => _c$() ? displayName(project()) : local.controller.labels.new();
    })());
    insert(_el$10, createComponent(Icon, {
      name: "chevron-down",
      size: "small",
      "class": "shrink-0 text-v2-icon-icon-muted"
    }), null);
    return _el$10;
  })();
}
function ProjectItem(props) {
  const key = () => props.controller.projectKey(props.project);
  return createComponent(DropdownMenu.RadioItem, {
    get id() {
      return key();
    },
    get value() {
      return key();
    },
    get ["data-option-key"]() {
      return key();
    },
    "class": "h-7 gap-2 rounded-sm px-3 text-[13px] font-[440] leading-5 tracking-[-0.04px] text-v2-text-text-base data-[highlighted]:!bg-v2-overlay-simple-overlay-hover",
    get classList() {
      return {
        "!bg-v2-overlay-simple-overlay-hover": props.controller.active() === key()
      };
    },
    style: {
      "font-family": "var(--v2-font-family-sans)",
      "font-size": "13px",
      "font-weight": 440,
      "line-height": "20px",
      "letter-spacing": "-0.04px",
      color: "var(--v2-text-text-base)",
      padding: "0 12px"
    },
    closeOnSelect: true,
    onMouseEnter: () => {
      props.controller.setActive(key());
      props.controller.focusSearch();
    },
    onSelect: () => props.onSelect(props.project),
    get children() {
      return [createComponent(ProjectAvatar, {
        get fallback() {
          return displayName(props.project);
        },
        get src() {
          return getProjectAvatarSource(props.project.id, props.project.icon);
        },
        get variant() {
          return getProjectAvatarVariant(props.project.icon?.color);
        }
      }), createComponent(DropdownMenu.ItemLabel, {
        "class": "min-w-0 truncate leading-5",
        get children() {
          return displayName(props.project);
        }
      }), createComponent(DropdownMenu.ItemIndicator, {
        style: {
          width: "14px",
          height: "14px",
          right: "12px"
        },
        get children() {
          return createComponent(Icon$1, {
            name: "check",
            size: "small",
            "class": "shrink-0 text-v2-icon-icon-base"
          });
        }
      })];
    }
  });
}
const projectActionClass = "h-7 gap-2 rounded-sm px-3 text-[13px] font-[440] leading-5 tracking-[-0.04px] text-v2-text-text-base [font-family:var(--v2-font-family-sans)] data-[highlighted]:!bg-v2-overlay-simple-overlay-hover";
function ProjectAction(props) {
  const key = () => props.controller.actionKey(props.server);
  return createComponent(DropdownMenu.Item, {
    get id() {
      return key();
    },
    get ["data-option-key"]() {
      return key();
    },
    "class": "h-7 gap-2 rounded-sm px-3 text-[13px] font-[440] leading-5 tracking-[-0.04px] text-v2-text-text-base data-[highlighted]:!bg-v2-overlay-simple-overlay-hover",
    get classList() {
      return {
        "!bg-v2-overlay-simple-overlay-hover": props.controller.active() === key()
      };
    },
    style: {
      "font-family": "var(--v2-font-family-sans)",
      "font-size": "13px",
      "font-weight": 440,
      "line-height": "20px",
      "letter-spacing": "-0.04px",
      color: "var(--v2-text-text-base)",
      padding: "0 12px"
    },
    onMouseEnter: () => {
      props.controller.setActive(key());
      props.controller.focusSearch();
    },
    onSelect: () => props.onSelect(props.server),
    get children() {
      return [createComponent(Icon, {
        name: "plus",
        size: "small"
      }), createComponent(DropdownMenu.ItemLabel, {
        "class": "min-w-0 truncate leading-5",
        get children() {
          return props.controller.labels.add();
        }
      })];
    }
  });
}
function ServerAction(props) {
  return createComponent(DropdownMenu.Item, {
    "class": projectActionClass,
    onSelect: () => props.onSelect(props.server.key),
    get children() {
      return createComponent(DropdownMenu.ItemLabel, {
        "class": "min-w-0 flex-1 truncate leading-5",
        get children() {
          return props.server.name;
        }
      });
    }
  });
}
delegateEvents(["input", "keydown", "pointerdown", "click"]);
var _tmpl$$1 = /* @__PURE__ */ template(`<span class="hidden select-none opacity-50 sm:inline mx-1">/`), _tmpl$2$1 = /* @__PURE__ */ template(`<span class="min-w-0 truncate">`), _tmpl$3$1 = /* @__PURE__ */ template(`<span class="min-w-0 flex-1 truncate">`), _tmpl$4$1 = /* @__PURE__ */ template(`<div class="flex h-7 min-w-0 max-w-[220px] items-center gap-1.5 px-2 text-[13px] font-[440] leading-5 tracking-[-0.04px]"><span class="min-w-0 truncate">`);
function PromptWorkspaceSelector(props) {
  const language = useLanguage();
  let pending;
  const selected = () => props.value === props.projectRoot ? "main" : props.value;
  const icon = () => {
    if (selected() === "main") return "monitor";
    if (selected() === "create") return "workspace-new";
    return "workspace";
  };
  const select = (value) => {
    pending = value;
  };
  const onOpenChange = (open) => {
    if (open) return;
    const value = pending;
    pending = void 0;
    if (value) props.onChange(value);
    props.onDone();
  };
  const label = () => {
    if (selected() === "main") return language.t("session.new.workspace.triggerLocal");
    if (props.value === "create") return language.t("workspace.new");
    return getFilename(props.value);
  };
  return [_tmpl$$1(), createComponent(MenuV2, {
    placement: "bottom",
    gutter: 4,
    onOpenChange,
    get children() {
      return [createComponent(MenuV2.Trigger, {
        "class": "flex h-7 min-w-0 max-w-[203px] items-center gap-1.5 rounded-sm px-1.5 hover:bg-v2-overlay-simple-overlay-hover focus-visible:bg-v2-overlay-simple-overlay-hover focus-visible:outline-none data-[expanded]:bg-v2-overlay-simple-overlay-pressed data-[expanded]:text-v2-text-text-muted",
        get children() {
          return [createComponent(Icon$1, {
            get name() {
              return icon();
            },
            "class": "shrink-0 text-v2-icon-icon-muted"
          }), (() => {
            var _el$2 = _tmpl$2$1();
            insert(_el$2, label);
            return _el$2;
          })(), createComponent(Icon, {
            name: "chevron-down",
            size: "small",
            "class": "shrink-0 text-v2-icon-icon-muted"
          })];
        }
      }), createComponent(MenuV2.Portal, {
        get children() {
          return createComponent(MenuV2.Content, {
            "class": "w-[180px]",
            get children() {
              return [createComponent(MenuV2.Group, {
                get children() {
                  return [createComponent(MenuV2.GroupLabel, {
                    get children() {
                      return language.t("session.new.workspace.runIn");
                    }
                  }), createComponent(MenuV2.Item, {
                    onSelect: () => select("main"),
                    get children() {
                      return [createComponent(Icon$1, {
                        name: "monitor"
                      }), (() => {
                        var _el$3 = _tmpl$3$1();
                        insert(_el$3, () => language.t("session.new.workspace.local"));
                        return _el$3;
                      })(), createComponent(Show, {
                        get when() {
                          return selected() === "main";
                        },
                        get children() {
                          return createComponent(Icon, {
                            name: "check",
                            size: "small",
                            "class": "shrink-0"
                          });
                        }
                      })];
                    }
                  }), createComponent(MenuV2.Item, {
                    onSelect: () => select("create"),
                    get children() {
                      return [createComponent(Icon$1, {
                        name: "workspace-new"
                      }), (() => {
                        var _el$4 = _tmpl$3$1();
                        insert(_el$4, () => language.t("workspace.new"));
                        return _el$4;
                      })(), createComponent(Show, {
                        get when() {
                          return selected() === "create";
                        },
                        get children() {
                          return createComponent(Icon, {
                            name: "check",
                            size: "small",
                            "class": "shrink-0"
                          });
                        }
                      })];
                    }
                  })];
                }
              }), createComponent(Show, {
                get when() {
                  return props.workspaces.length > 0;
                },
                get children() {
                  return [createComponent(MenuV2.Separator, {}), createComponent(MenuV2.Sub, {
                    gutter: 0,
                    overlap: true,
                    overflowPadding: 8,
                    get children() {
                      return [createComponent(MenuV2.SubTrigger, {
                        get children() {
                          return [createComponent(Icon$1, {
                            name: "workspace"
                          }), memo(() => language.t("session.new.workspace.existing"))];
                        }
                      }), createComponent(MenuV2.Portal, {
                        get children() {
                          return createComponent(MenuV2.SubContent, {
                            "class": "max-w-[200px]",
                            get children() {
                              return createComponent(For, {
                                get each() {
                                  return props.workspaces;
                                },
                                children: (workspace) => createComponent(MenuV2.Item, {
                                  onSelect: () => select(workspace),
                                  get children() {
                                    return [createComponent(Icon$1, {
                                      name: "workspace-isolated"
                                    }), (() => {
                                      var _el$5 = _tmpl$3$1();
                                      insert(_el$5, () => getFilename(workspace));
                                      return _el$5;
                                    })(), createComponent(Show, {
                                      get when() {
                                        return selected() === workspace;
                                      },
                                      get children() {
                                        return createComponent(Icon, {
                                          name: "check",
                                          size: "small",
                                          "class": "shrink-0"
                                        });
                                      }
                                    })];
                                  }
                                })
                              });
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
      })];
    }
  }), createComponent(Show, {
    get when() {
      return props.branch;
    },
    children: (branch) => [_tmpl$$1(), (() => {
      var _el$7 = _tmpl$4$1(), _el$8 = _el$7.firstChild;
      insert(_el$7, createComponent(Icon, {
        name: "branch",
        size: "small",
        "class": "shrink-0 text-v2-icon-icon-muted"
      }), _el$8);
      insert(_el$8, branch);
      return _el$7;
    })()]
  })];
}
var _tmpl$ = /* @__PURE__ */ template(`<div class="flex min-h-7 min-w-0 items-center gap-0 text-v2-text-text-faint">`), _tmpl$2 = /* @__PURE__ */ template(`<div class="flex flex-col">`), _tmpl$3 = /* @__PURE__ */ template(`<div>`), _tmpl$4 = /* @__PURE__ */ template(`<div class="relative size-full overflow-hidden flex flex-col"><div class="flex-1 min-h-0 flex flex-col gap-2 p-2"><div class="@container relative flex flex-col min-h-0 h-full bg-background-stronger flex-1"><div class="flex-1 min-h-0 overflow-hidden rounded-[10px]">`), _tmpl$5 = /* @__PURE__ */ template(`<div class="w-full min-h-32 md:min-h-40 rounded-md border border-border-weak-base bg-background-base/50 px-4 py-3 text-text-weak pointer-events-none">`);
const showWorkspaceBar = false;
function NewSessionPage() {
  const prompt = usePrompt();
  const sdk = useSDK();
  const sync = useSync();
  const serverSync = useServerSync();
  const comments = useComments();
  const language = useLanguage();
  const route = useSessionKey();
  const [searchParams, setSearchParams] = useSearchParams();
  useComposerCommands();
  useSettingsCommand();
  let inputRef;
  const inputController = createPromptInputController({
    sessionKey: route.sessionKey,
    sessionID: () => route.params.id,
    queryOptions: serverSync().queryOptions
  });
  const projectControls = createPromptProjectControls();
  const projectController = createPromptProjectController({
    controls: projectControls,
    onDone: () => inputRef?.focus()
  });
  const [store, setStore] = createStore({});
  const newSessionWorktree = createMemo(() => {
    if (store.worktree) return store.worktree;
    const project = sync().project;
    if (project && sdk().directory !== project.worktree) return sdk().directory;
    return "main";
  });
  const projectRoot = createMemo(() => sync().project?.worktree ?? sdk().directory);
  const localBranch = createMemo(() => serverSync().child(projectRoot())[0].vcs?.branch);
  const selectedBranch = createMemo(() => {
    const worktree = newSessionWorktree();
    if (worktree === "main" || worktree === "create") return localBranch();
    return serverSync().child(worktree)[0].vcs?.branch ?? localBranch();
  });
  createEffect(() => {
    if (!prompt.ready()) return;
    untrack(() => {
      const text = searchParams.prompt;
      if (!text) return;
      prompt.set([{
        type: "text",
        content: text,
        start: 0,
        end: text.length
      }], text.length);
      setSearchParams({
        ...searchParams,
        prompt: void 0
      });
    });
  });
  createEffect(() => {
    if (!prompt.ready()) return;
    requestAnimationFrame(() => inputRef?.focus());
  });
  const ready = Promise.resolve();
  const [promptReady] = createResource(() => prompt.ready.promise ?? ready, (promise) => promise.then(() => true));
  return (() => {
    var _el$ = _tmpl$4(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild;
    insert(_el$4, createComponent(NewSessionDesignView, {
      get children() {
        var _el$5 = _tmpl$3();
        className(_el$5, NEW_SESSION_CONTENT_WIDTH);
        insert(_el$5, createComponent(Show, {
          get when() {
            return prompt.ready() || promptReady();
          },
          get fallback() {
            return (() => {
              var _el$8 = _tmpl$5();
              insert(_el$8, () => language.t("prompt.loading"));
              return _el$8;
            })();
          },
          get children() {
            var _el$6 = _tmpl$2();
            _el$6.classList.toggle("gap-8", false);
            _el$6.classList.toggle("gap-3", true);
            insert(_el$6, createComponent(PromptInput, {
              get controls() {
                return inputController();
              },
              variant: "new-session",
              ref: (el) => {
                inputRef = el;
              },
              get newSessionWorktree() {
                return newSessionWorktree();
              },
              onNewSessionWorktreeReset: () => setStore("worktree", void 0),
              onSubmit: () => comments.clear(),
              get toolbar() {
                return createComponent(Show, {
                  get when() {
                    return !projectController.selected();
                  },
                  get children() {
                    return createComponent(PromptProjectAddButton, {
                      controller: projectController
                    });
                  }
                });
              }
            }), null);
            insert(_el$6, createComponent(Show, {
              get when() {
                return projectController.selected();
              },
              get children() {
                var _el$7 = _tmpl$();
                insert(_el$7, createComponent(PromptProjectSelector, {
                  controller: projectController,
                  placement: "bottom-start"
                }), null);
                insert(_el$7, createComponent(Show, {
                  when: showWorkspaceBar,
                  get children() {
                    return createComponent(PromptWorkspaceSelector, {
                      get value() {
                        return newSessionWorktree();
                      },
                      get projectRoot() {
                        return projectRoot();
                      },
                      get workspaces() {
                        return sync().project?.sandboxes ?? [];
                      },
                      get branch() {
                        return selectedBranch();
                      },
                      onChange: (value) => setStore("worktree", value === "main" && sync().project?.worktree !== sdk().directory ? sync().project?.worktree : value),
                      onDone: () => inputRef?.focus()
                    });
                  }
                }), null);
                createRenderEffect((_$p) => classList(_el$7, {
                  "flex-col justify-center sm:flex-row": showWorkspaceBar,
                  "justify-start": !showWorkspaceBar
                }, _$p));
                return _el$7;
              }
            }), null);
            return _el$6;
          }
        }));
        return _el$5;
      }
    }));
    return _el$;
  })();
}
export {
  NewSessionPage as default
};
//# sourceMappingURL=new-session-DzzQBsNl.js.map
