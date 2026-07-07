const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./dialog-select-provider-Dh2NFik3.js","./main-Do1GNfcH.js","./main-DetviuuX.css"])))=>i.map(i=>d[i]);
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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "af9fbbb8-53b4-4ed7-9e4f-3462e3ef12df", e._sentryDebugIdIdentifier = "sentry-dbid-af9fbbb8-53b4-4ed7-9e4f-3462e3ef12df");
    })();
  } catch (e) {
  }
}
;
import { bQ as usePlatform, bq as splitProps, br as spread, a$ as mergeProps, aV as insert, bs as template, aH as delegateEvents, bD as useDialog, bY as useServerSync, bX as useServerSDK, bI as useLanguage, bS as useProviders, b6 as onCleanup, au as createMemo, az as createResource, aC as createStore, ao as createEffect, al as createComponent, z as ProviderIcon, Z as Switch, M as Match, aZ as memo, Y as Spinner, I as Icon, ay as createRenderEffect, s as IconButton, D as Dialog, L as List, a2 as TextField, B as Button, b7 as onMount, bi as produce, bo as showToast, a6 as __vitePreload } from "./main-Do1GNfcH.js";
var _tmpl$$1 = /* @__PURE__ */ template(`<a>`);
function Link(props) {
  const platform = usePlatform();
  const [local, rest] = splitProps(props, ["href", "children", "class"]);
  return (() => {
    var _el$ = _tmpl$$1();
    _el$.$$click = (event) => {
      if (!local.href) return;
      event.preventDefault();
      platform.openLink(local.href);
    };
    spread(_el$, mergeProps({
      get href() {
        return local.href;
      },
      get ["class"]() {
        return `text-text-strong underline ${local.class ?? ""}`;
      }
    }, rest), false, true);
    insert(_el$, () => local.children);
    return _el$;
  })();
}
delegateEvents(["click"]);
var _tmpl$ = /* @__PURE__ */ template(`<div class="w-full flex flex-col gap-1.5"><div class="text-14-regular text-text-base"></div><div>`), _tmpl$2 = /* @__PURE__ */ template(`<form class="flex flex-col items-start gap-4">`), _tmpl$3 = /* @__PURE__ */ template(`<div class="w-full flex items-center gap-x-2"><div class="w-4 h-2 rounded-[1px] bg-input-base shadow-xs-border-base flex items-center justify-center"><div class="w-2.5 h-0.5 ml-0 bg-icon-strong-base hidden"data-slot=list-item-extra-icon></div></div><span></span><span class="text-14-regular text-text-weak">`), _tmpl$4 = /* @__PURE__ */ template(`<div class="text-14-regular text-text-base">`), _tmpl$5 = /* @__PURE__ */ template(`<div>`), _tmpl$6 = /* @__PURE__ */ template(`<div class="w-full flex items-center gap-x-2"><div class="w-4 h-2 rounded-[1px] bg-input-base shadow-xs-border-base flex items-center justify-center"><div class="w-2.5 h-0.5 ml-0 bg-icon-strong-base hidden"data-slot=list-item-extra-icon></div></div><span>`), _tmpl$7 = /* @__PURE__ */ template(`<div class="flex flex-col gap-4"><div class="text-14-regular text-text-base"></div><div class="text-14-regular text-text-base"></div><div class="text-14-regular text-text-base">`), _tmpl$8 = /* @__PURE__ */ template(`<div class="flex flex-col gap-6"><form class="flex flex-col items-start gap-4">`), _tmpl$9 = /* @__PURE__ */ template(`<div class="flex flex-col gap-6"><div class="text-14-regular text-text-base"></div><form class="flex flex-col items-start gap-4">`), _tmpl$0 = /* @__PURE__ */ template(`<div class="flex flex-col gap-6"><div class="text-14-regular text-text-base"></div><div class="text-14-regular text-text-base flex items-center gap-4"><span>`), _tmpl$1 = /* @__PURE__ */ template(`<div class="text-14-regular text-text-base"><div class="flex items-center gap-x-2"><span>`), _tmpl$10 = /* @__PURE__ */ template(`<div class="flex flex-col gap-6 px-2.5 pb-3"><div class="px-2.5 flex gap-4 items-center"><div class="text-16-medium text-text-strong"></div></div><div class="px-2.5 pb-10 flex flex-col gap-6"><div tabindex=0>`);
function DialogConnectProvider(props) {
  const dialog = useDialog();
  const serverSync = useServerSync();
  const serverSDK = useServerSDK();
  const language = useLanguage();
  const providers = useProviders(props.directory);
  const all = () => {
    void __vitePreload(() => import("./dialog-select-provider-Dh2NFik3.js").then((n) => n.d), true ? __vite__mapDeps([0,1,2]) : void 0, import.meta.url).then((x) => {
      dialog.show(() => createComponent(x.DialogSelectProvider, {
        get directory() {
          return props.directory;
        }
      }));
    });
  };
  const alive = {
    value: true
  };
  const timer = {
    current: void 0
  };
  onCleanup(() => {
    alive.value = false;
    if (timer.current === void 0) return;
    clearTimeout(timer.current);
    timer.current = void 0;
  });
  const provider = createMemo(() => providers.all().get(props.provider) ?? serverSync().data.provider.all.get(props.provider));
  const fallback = createMemo(() => [{
    type: "api",
    label: language.t("provider.connect.method.apiKey")
  }]);
  const [auth] = createResource(() => props.provider, async () => {
    const cached = serverSync().data.provider_auth[props.provider];
    if (cached) return cached;
    const res = await serverSDK().client.provider.auth();
    if (!alive.value) return fallback();
    serverSync().set("provider_auth", res.data ?? {});
    return res.data?.[props.provider] ?? fallback();
  });
  const loading = createMemo(() => auth.loading && !serverSync().data.provider_auth[props.provider]);
  const methods = createMemo(() => auth.latest ?? serverSync().data.provider_auth[props.provider] ?? fallback());
  const [store, setStore] = createStore({
    methodIndex: void 0,
    authorization: void 0,
    promptInputs: void 0,
    state: "pending",
    error: void 0
  });
  function dispatch(action) {
    setStore(produce((draft) => {
      if (action.type === "method.select") {
        draft.methodIndex = action.index;
        draft.authorization = void 0;
        draft.promptInputs = void 0;
        draft.state = void 0;
        draft.error = void 0;
        return;
      }
      if (action.type === "method.reset") {
        draft.methodIndex = void 0;
        draft.authorization = void 0;
        draft.promptInputs = void 0;
        draft.state = void 0;
        draft.error = void 0;
        return;
      }
      if (action.type === "auth.prompt") {
        draft.state = "prompt";
        draft.error = void 0;
        return;
      }
      if (action.type === "auth.inputs") {
        draft.promptInputs = action.inputs;
        draft.state = void 0;
        draft.error = void 0;
        return;
      }
      if (action.type === "auth.pending") {
        draft.state = "pending";
        draft.error = void 0;
        return;
      }
      if (action.type === "auth.complete") {
        draft.state = "complete";
        draft.authorization = action.authorization;
        draft.error = void 0;
        return;
      }
      draft.state = "error";
      draft.error = action.error;
    }));
  }
  const method = createMemo(() => store.methodIndex !== void 0 ? methods().at(store.methodIndex) : void 0);
  const methodLabel = (value) => {
    if (!value) return "";
    if (value.type === "api") return language.t("provider.connect.method.apiKey");
    return value.label ?? "";
  };
  function formatError(value, fallback2) {
    if (value && typeof value === "object" && "data" in value) {
      const data = value.data;
      if (typeof data?.message === "string" && data.message) return data.message;
    }
    if (value && typeof value === "object" && "error" in value) {
      const nested = formatError(value.error, "");
      if (nested) return nested;
    }
    if (value && typeof value === "object" && "message" in value) {
      const message = value.message;
      if (typeof message === "string" && message) return message;
    }
    if (value instanceof Error && value.message) return value.message;
    if (typeof value === "string" && value) return value;
    return fallback2;
  }
  async function selectMethod(index, inputs) {
    if (timer.current !== void 0) {
      clearTimeout(timer.current);
      timer.current = void 0;
    }
    const method2 = methods()[index];
    dispatch({
      type: "method.select",
      index
    });
    if (method2.type === "api" && method2.prompts?.length) {
      if (!inputs) {
        dispatch({
          type: "auth.prompt"
        });
        return;
      }
      dispatch({
        type: "auth.inputs",
        inputs
      });
      return;
    }
    if (method2.type === "oauth") {
      if (method2.prompts?.length && !inputs) {
        dispatch({
          type: "auth.prompt"
        });
        return;
      }
      dispatch({
        type: "auth.pending"
      });
      const start = Date.now();
      await serverSDK().client.provider.oauth.authorize({
        providerID: props.provider,
        method: index,
        inputs
      }, {
        throwOnError: true
      }).then((x) => {
        if (!alive.value) return;
        const elapsed = Date.now() - start;
        const delay = 1e3 - elapsed;
        if (delay > 0) {
          if (timer.current !== void 0) clearTimeout(timer.current);
          timer.current = setTimeout(() => {
            timer.current = void 0;
            if (!alive.value) return;
            dispatch({
              type: "auth.complete",
              authorization: x.data
            });
          }, delay);
          return;
        }
        dispatch({
          type: "auth.complete",
          authorization: x.data
        });
      }).catch((e) => {
        if (!alive.value) return;
        dispatch({
          type: "auth.error",
          error: formatError(e, language.t("common.requestFailed"))
        });
      });
    }
  }
  function AuthPromptsView() {
    const [formStore, setFormStore] = createStore({
      value: {},
      index: 0
    });
    const prompts = createMemo(() => {
      const value = method();
      return value?.prompts ?? [];
    });
    const matches = (prompt, value) => {
      if (!prompt.when) return true;
      const actual = value[prompt.when.key];
      if (actual === void 0) return false;
      return prompt.when.op === "eq" ? actual === prompt.when.value : actual !== prompt.when.value;
    };
    const current = createMemo(() => {
      const all2 = prompts();
      const index = all2.findIndex((prompt, index2) => index2 >= formStore.index && matches(prompt, formStore.value));
      if (index === -1) return;
      return {
        index,
        prompt: all2[index]
      };
    });
    const valid = createMemo(() => {
      const item2 = current();
      if (!item2 || item2.prompt.type !== "text") return false;
      const value = formStore.value[item2.prompt.key] ?? "";
      return value.trim().length > 0;
    });
    async function next(index, value) {
      if (store.methodIndex === void 0) return;
      const next2 = prompts().findIndex((prompt, i) => i > index && matches(prompt, value));
      if (next2 !== -1) {
        setFormStore("index", next2);
        return;
      }
      if (method()?.type === "api") {
        dispatch({
          type: "auth.inputs",
          inputs: value
        });
        return;
      }
      await selectMethod(store.methodIndex, value);
    }
    async function handleSubmit(e) {
      e.preventDefault();
      const item2 = current();
      if (!item2 || item2.prompt.type !== "text") return;
      if (!valid()) return;
      await next(item2.index, formStore.value);
    }
    const item = () => current();
    const text = createMemo(() => {
      const prompt = item()?.prompt;
      if (!prompt || prompt.type !== "text") return;
      return prompt;
    });
    const select = createMemo(() => {
      const prompt = item()?.prompt;
      if (!prompt || prompt.type !== "select") return;
      return prompt;
    });
    return (() => {
      var _el$ = _tmpl$2();
      _el$.addEventListener("submit", handleSubmit);
      insert(_el$, createComponent(Switch, {
        get children() {
          return [createComponent(Match, {
            get when() {
              return item()?.prompt.type === "text";
            },
            get children() {
              return [createComponent(TextField, {
                type: "text",
                get label() {
                  return text()?.message ?? "";
                },
                get placeholder() {
                  return text()?.placeholder;
                },
                get value() {
                  return memo(() => !!text())() ? formStore.value[text().key] ?? "" : "";
                },
                onChange: (value) => {
                  const prompt = text();
                  if (!prompt) return;
                  setFormStore("value", prompt.key, value);
                }
              }), createComponent(Button, {
                "class": "w-auto",
                type: "submit",
                size: "large",
                variant: "primary",
                get disabled() {
                  return !valid();
                },
                get children() {
                  return language.t("common.continue");
                }
              })];
            }
          }), createComponent(Match, {
            get when() {
              return item()?.prompt.type === "select";
            },
            get children() {
              var _el$2 = _tmpl$(), _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling;
              insert(_el$3, () => select()?.message);
              insert(_el$4, createComponent(List, {
                "class": "px-3",
                get items() {
                  return select()?.options ?? [];
                },
                key: (x) => x.value,
                get current() {
                  return select()?.options.find((x) => x.value === formStore.value[select().key]);
                },
                onSelect: (value) => {
                  if (!value) return;
                  const prompt = select();
                  if (!prompt) return;
                  const nextValue = {
                    ...formStore.value,
                    [prompt.key]: value.value
                  };
                  setFormStore("value", prompt.key, value.value);
                  void next(item().index, nextValue);
                },
                children: (option) => (() => {
                  var _el$5 = _tmpl$3(), _el$6 = _el$5.firstChild, _el$7 = _el$6.nextSibling, _el$8 = _el$7.nextSibling;
                  insert(_el$7, () => option.label);
                  insert(_el$8, () => option.hint);
                  return _el$5;
                })()
              }));
              return _el$2;
            }
          })];
        }
      }));
      return _el$;
    })();
  }
  let listRef;
  function handleKey(e) {
    if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
      return;
    }
    if (e.key === "Escape") return;
    listRef?.onKeyDown(e);
  }
  let auto = false;
  createEffect(() => {
    if (auto) return;
    if (loading()) return;
    if (methods().length === 1) {
      auto = true;
      void selectMethod(0);
    }
  });
  async function complete() {
    await serverSDK().client.global.dispose();
    dialog.close();
    showToast({
      variant: "success",
      icon: "circle-check",
      title: language.t("provider.connect.toast.connected.title", {
        provider: provider().name
      }),
      description: language.t("provider.connect.toast.connected.description", {
        provider: provider().name
      })
    });
  }
  function goBack() {
    if (methods().length === 1) {
      all();
      return;
    }
    if (store.authorization) {
      dispatch({
        type: "method.reset"
      });
      return;
    }
    if (store.methodIndex !== void 0) {
      dispatch({
        type: "method.reset"
      });
      return;
    }
    all();
  }
  function MethodSelection() {
    return [(() => {
      var _el$9 = _tmpl$4();
      insert(_el$9, () => language.t("provider.connect.selectMethod", {
        provider: provider().name
      }));
      return _el$9;
    })(), (() => {
      var _el$0 = _tmpl$5();
      insert(_el$0, createComponent(List, {
        "class": "px-3",
        ref: (ref) => {
          listRef = ref;
        },
        items: methods,
        key: (m) => m?.label,
        onSelect: async (selected, index) => {
          if (!selected) return;
          void selectMethod(index);
        },
        children: (i) => (() => {
          var _el$1 = _tmpl$6(), _el$10 = _el$1.firstChild, _el$11 = _el$10.nextSibling;
          insert(_el$11, () => methodLabel(i));
          return _el$1;
        })()
      }));
      return _el$0;
    })()];
  }
  function ApiAuthView() {
    const [formStore, setFormStore] = createStore({
      value: "",
      error: void 0
    });
    async function handleSubmit(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      const apiKey = formData.get("apiKey");
      if (!apiKey?.trim()) {
        setFormStore("error", language.t("provider.connect.apiKey.required"));
        return;
      }
      setFormStore("error", void 0);
      await serverSDK().client.auth.set({
        providerID: props.provider,
        auth: {
          type: "api",
          key: apiKey,
          ...store.promptInputs ? {
            metadata: store.promptInputs
          } : {}
        }
      });
      await complete();
    }
    return (() => {
      var _el$12 = _tmpl$8(), _el$18 = _el$12.firstChild;
      insert(_el$12, createComponent(Switch, {
        get children() {
          return [createComponent(Match, {
            get when() {
              return provider().id === "opencode";
            },
            get children() {
              var _el$13 = _tmpl$7(), _el$14 = _el$13.firstChild, _el$15 = _el$14.nextSibling, _el$16 = _el$15.nextSibling;
              insert(_el$14, () => language.t("provider.connect.opencodeZen.line1"));
              insert(_el$15, () => language.t("provider.connect.opencodeZen.line2"));
              insert(_el$16, () => language.t("provider.connect.opencodeZen.visit.prefix"), null);
              insert(_el$16, createComponent(Link, {
                href: "https://opencode.ai/zen",
                tabIndex: -1,
                get children() {
                  return language.t("provider.connect.opencodeZen.visit.link");
                }
              }), null);
              insert(_el$16, () => language.t("provider.connect.opencodeZen.visit.suffix"), null);
              return _el$13;
            }
          }), createComponent(Match, {
            when: true,
            get children() {
              var _el$17 = _tmpl$4();
              insert(_el$17, () => language.t("provider.connect.apiKey.description", {
                provider: provider().name
              }));
              return _el$17;
            }
          })];
        }
      }), _el$18);
      _el$18.addEventListener("submit", handleSubmit);
      insert(_el$18, createComponent(TextField, {
        autofocus: true,
        type: "text",
        get label() {
          return language.t("provider.connect.apiKey.label", {
            provider: provider().name
          });
        },
        get placeholder() {
          return language.t("provider.connect.apiKey.placeholder");
        },
        name: "apiKey",
        get value() {
          return formStore.value;
        },
        onChange: (v) => setFormStore("value", v),
        get validationState() {
          return formStore.error ? "invalid" : void 0;
        },
        get error() {
          return formStore.error;
        }
      }), null);
      insert(_el$18, createComponent(Button, {
        "class": "w-auto",
        type: "submit",
        size: "large",
        variant: "primary",
        get children() {
          return language.t("common.continue");
        }
      }), null);
      return _el$12;
    })();
  }
  function OAuthCodeView() {
    const [formStore, setFormStore] = createStore({
      value: "",
      error: void 0
    });
    async function handleSubmit(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      const code = formData.get("code");
      if (!code?.trim()) {
        setFormStore("error", language.t("provider.connect.oauth.code.required"));
        return;
      }
      setFormStore("error", void 0);
      const result = await serverSDK().client.provider.oauth.callback({
        providerID: props.provider,
        method: store.methodIndex,
        code
      }).then((value) => value.error ? {
        ok: false,
        error: value.error
      } : {
        ok: true
      }).catch((error) => ({
        ok: false,
        error
      }));
      if (result.ok) {
        await complete();
        return;
      }
      setFormStore("error", formatError(result.error, language.t("provider.connect.oauth.code.invalid")));
    }
    return (() => {
      var _el$19 = _tmpl$9(), _el$20 = _el$19.firstChild, _el$21 = _el$20.nextSibling;
      insert(_el$20, () => language.t("provider.connect.oauth.code.visit.prefix"), null);
      insert(_el$20, createComponent(Link, {
        get href() {
          return store.authorization.url;
        },
        get children() {
          return language.t("provider.connect.oauth.code.visit.link");
        }
      }), null);
      insert(_el$20, () => language.t("provider.connect.oauth.code.visit.suffix", {
        provider: provider().name
      }), null);
      _el$21.addEventListener("submit", handleSubmit);
      insert(_el$21, createComponent(TextField, {
        autofocus: true,
        type: "text",
        get label() {
          return language.t("provider.connect.oauth.code.label", {
            method: method()?.label ?? ""
          });
        },
        get placeholder() {
          return language.t("provider.connect.oauth.code.placeholder");
        },
        name: "code",
        get value() {
          return formStore.value;
        },
        onChange: (v) => setFormStore("value", v),
        get validationState() {
          return formStore.error ? "invalid" : void 0;
        },
        get error() {
          return formStore.error;
        }
      }), null);
      insert(_el$21, createComponent(Button, {
        "class": "w-auto",
        type: "submit",
        size: "large",
        variant: "primary",
        get children() {
          return language.t("common.continue");
        }
      }), null);
      return _el$19;
    })();
  }
  function OAuthAutoView() {
    const code = createMemo(() => {
      const instructions = store.authorization?.instructions;
      if (instructions?.includes(":")) {
        return instructions.split(":").pop()?.trim();
      }
      return instructions;
    });
    onMount(() => {
      void (async () => {
        const result = await serverSDK().client.provider.oauth.callback({
          providerID: props.provider,
          method: store.methodIndex
        }).then((value) => value.error ? {
          ok: false,
          error: value.error
        } : {
          ok: true
        }).catch((error) => ({
          ok: false,
          error
        }));
        if (!alive.value) return;
        if (!result.ok) {
          const message = formatError(result.error, language.t("common.requestFailed"));
          dispatch({
            type: "auth.error",
            error: message
          });
          return;
        }
        await complete();
      })();
    });
    return (() => {
      var _el$22 = _tmpl$0(), _el$23 = _el$22.firstChild, _el$24 = _el$23.nextSibling, _el$25 = _el$24.firstChild;
      insert(_el$23, () => language.t("provider.connect.oauth.auto.visit.prefix"), null);
      insert(_el$23, createComponent(Link, {
        get href() {
          return store.authorization.url;
        },
        get children() {
          return language.t("provider.connect.oauth.auto.visit.link");
        }
      }), null);
      insert(_el$23, () => language.t("provider.connect.oauth.auto.visit.suffix", {
        provider: provider().name
      }), null);
      insert(_el$22, createComponent(TextField, {
        get label() {
          return language.t("provider.connect.oauth.auto.confirmationCode");
        },
        "class": "font-mono",
        get value() {
          return code();
        },
        readOnly: true,
        copyable: true
      }), _el$24);
      insert(_el$24, createComponent(Spinner, {}), _el$25);
      insert(_el$25, () => language.t("provider.connect.status.waiting"));
      return _el$22;
    })();
  }
  return createComponent(Dialog, {
    get title() {
      return createComponent(IconButton, {
        tabIndex: -1,
        icon: "arrow-left",
        variant: "ghost",
        onClick: goBack,
        get ["aria-label"]() {
          return language.t("common.goBack");
        }
      });
    },
    get children() {
      var _el$26 = _tmpl$10(), _el$27 = _el$26.firstChild, _el$28 = _el$27.firstChild, _el$29 = _el$27.nextSibling, _el$30 = _el$29.firstChild;
      insert(_el$27, createComponent(ProviderIcon, {
        get id() {
          return props.provider;
        },
        "class": "size-5 shrink-0 icon-strong-base"
      }), _el$28);
      insert(_el$28, createComponent(Switch, {
        get children() {
          return [createComponent(Match, {
            get when() {
              return memo(() => props.provider === "anthropic")() && method()?.label?.toLowerCase().includes("max");
            },
            get children() {
              return language.t("provider.connect.title.anthropicProMax");
            }
          }), createComponent(Match, {
            when: true,
            get children() {
              return language.t("provider.connect.title", {
                provider: provider().name
              });
            }
          })];
        }
      }));
      _el$30.$$keydown = handleKey;
      insert(_el$30, createComponent(Switch, {
        get children() {
          return [createComponent(Match, {
            get when() {
              return loading();
            },
            get children() {
              var _el$31 = _tmpl$1(), _el$32 = _el$31.firstChild, _el$33 = _el$32.firstChild;
              insert(_el$32, createComponent(Spinner, {}), _el$33);
              insert(_el$33, () => language.t("provider.connect.status.inProgress"));
              return _el$31;
            }
          }), createComponent(Match, {
            get when() {
              return store.methodIndex === void 0;
            },
            get children() {
              return createComponent(MethodSelection, {});
            }
          }), createComponent(Match, {
            get when() {
              return store.state === "pending";
            },
            get children() {
              var _el$34 = _tmpl$1(), _el$35 = _el$34.firstChild, _el$36 = _el$35.firstChild;
              insert(_el$35, createComponent(Spinner, {}), _el$36);
              insert(_el$36, () => language.t("provider.connect.status.inProgress"));
              return _el$34;
            }
          }), createComponent(Match, {
            get when() {
              return store.state === "prompt";
            },
            get children() {
              return createComponent(AuthPromptsView, {});
            }
          }), createComponent(Match, {
            get when() {
              return store.state === "error";
            },
            get children() {
              var _el$37 = _tmpl$1(), _el$38 = _el$37.firstChild, _el$39 = _el$38.firstChild;
              insert(_el$38, createComponent(Icon, {
                name: "circle-ban-sign",
                "class": "text-icon-critical-base"
              }), _el$39);
              insert(_el$39, () => language.t("provider.connect.status.failed", {
                error: store.error ?? ""
              }));
              return _el$37;
            }
          }), createComponent(Match, {
            get when() {
              return method()?.type === "api";
            },
            get children() {
              return createComponent(ApiAuthView, {});
            }
          }), createComponent(Match, {
            get when() {
              return method()?.type === "oauth";
            },
            get children() {
              return createComponent(Switch, {
                get children() {
                  return [createComponent(Match, {
                    get when() {
                      return store.authorization?.method === "code";
                    },
                    get children() {
                      return createComponent(OAuthCodeView, {});
                    }
                  }), createComponent(Match, {
                    get when() {
                      return store.authorization?.method === "auto";
                    },
                    get children() {
                      return createComponent(OAuthAutoView, {});
                    }
                  })];
                }
              });
            }
          })];
        }
      }));
      createRenderEffect(() => _el$30.autofocus = store.methodIndex === void 0 ? true : void 0);
      return _el$26;
    }
  });
}
delegateEvents(["keydown"]);
const dialogConnectProvider = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DialogConnectProvider
}, Symbol.toStringTag, { value: "Module" }));
export {
  DialogConnectProvider as D,
  Link as L,
  dialogConnectProvider as d
};
//# sourceMappingURL=dialog-connect-provider-VwuxBEmX.js.map
