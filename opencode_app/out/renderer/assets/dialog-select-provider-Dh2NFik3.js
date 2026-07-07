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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "f2eaefb8-4fb4-42dc-94c6-1c7d4c6a2b2f", e._sentryDebugIdIdentifier = "sentry-dbid-f2eaefb8-4fb4-42dc-94c6-1c7d4c6a2b2f");
    })();
  } catch (e) {
  }
}
;
import { bD as useDialog, bY as useServerSync, bX as useServerSDK, bI as useLanguage, aC as createStore, bM as useMutation, bo as showToast, al as createComponent, aV as insert, z as ProviderIcon, a2 as TextField, m as For, s as IconButton, ay as createRenderEffect, bn as setAttribute, B as Button, aZ as memo, D as Dialog, bs as template, ad as batch, bi as produce, bS as useProviders, L as List, X as Show, a0 as Tag, bg as popularProviders } from "./main-Do1GNfcH.js";
import { L as Link, D as DialogConnectProvider } from "./dialog-connect-provider-VwuxBEmX.js";
const PROVIDER_ID = /^[a-z0-9][a-z0-9-_]*$/;
const OPENAI_COMPATIBLE = "@ai-sdk/openai-compatible";
function validateCustomProvider(input) {
  const providerID = input.form.providerID.trim();
  const name = input.form.name.trim();
  const baseURL = input.form.baseURL.trim();
  const apiKey = input.form.apiKey.trim();
  const env = apiKey.match(/^\{env:([^}]+)\}$/)?.[1]?.trim();
  const key = apiKey && !env ? apiKey : void 0;
  const idError = !providerID ? input.t("provider.custom.error.providerID.required") : !PROVIDER_ID.test(providerID) ? input.t("provider.custom.error.providerID.format") : void 0;
  const nameError = !name ? input.t("provider.custom.error.name.required") : void 0;
  const urlError = !baseURL ? input.t("provider.custom.error.baseURL.required") : !/^https?:\/\//.test(baseURL) ? input.t("provider.custom.error.baseURL.format") : void 0;
  const disabled = input.disabledProviders.includes(providerID);
  const existsError = idError ? void 0 : input.existingProviderIDs.has(providerID) && !disabled ? input.t("provider.custom.error.providerID.exists") : void 0;
  const seenModels = /* @__PURE__ */ new Set();
  const models = input.form.models.map((m) => {
    const id = m.id.trim();
    const idError2 = !id ? input.t("provider.custom.error.required") : seenModels.has(id) ? input.t("provider.custom.error.duplicate") : (() => {
      seenModels.add(id);
      return void 0;
    })();
    const nameError2 = !m.name.trim() ? input.t("provider.custom.error.required") : void 0;
    return { id: idError2, name: nameError2 };
  });
  const modelsValid = models.every((m) => !m.id && !m.name);
  const modelConfig = Object.fromEntries(input.form.models.map((m) => [m.id.trim(), { name: m.name.trim() }]));
  const seenHeaders = /* @__PURE__ */ new Set();
  const headers = input.form.headers.map((h) => {
    const key2 = h.key.trim();
    const value = h.value.trim();
    if (!key2 && !value) return {};
    const keyError = !key2 ? input.t("provider.custom.error.required") : seenHeaders.has(key2.toLowerCase()) ? input.t("provider.custom.error.duplicate") : (() => {
      seenHeaders.add(key2.toLowerCase());
      return void 0;
    })();
    const valueError = !value ? input.t("provider.custom.error.required") : void 0;
    return { key: keyError, value: valueError };
  });
  const headersValid = headers.every((h) => !h.key && !h.value);
  const headerConfig = Object.fromEntries(
    input.form.headers.map((h) => ({ key: h.key.trim(), value: h.value.trim() })).filter((h) => !!h.key && !!h.value).map((h) => [h.key, h.value])
  );
  const err = {
    providerID: idError ?? existsError,
    name: nameError,
    baseURL: urlError
  };
  const ok = !idError && !existsError && !nameError && !urlError && modelsValid && headersValid;
  if (!ok) return { err, models, headers };
  return {
    err,
    models,
    headers,
    result: {
      providerID,
      name,
      key,
      config: {
        npm: OPENAI_COMPATIBLE,
        name,
        ...env ? { env: [env] } : {},
        options: {
          baseURL,
          ...Object.keys(headerConfig).length ? { headers: headerConfig } : {}
        },
        models: modelConfig
      }
    }
  };
}
let row = 0;
const nextRow = () => `row-${row++}`;
const modelRow = () => ({ row: nextRow(), id: "", name: "", err: {} });
const headerRow = () => ({ row: nextRow(), key: "", value: "", err: {} });
var _tmpl$$1 = /* @__PURE__ */ template(`<div class="flex flex-col gap-6 px-2.5 pb-3 overflow-y-auto max-h-[60vh]"><div class="px-2.5 flex gap-4 items-center"><div class="text-16-medium text-text-strong"></div></div><form class="px-2.5 pb-6 flex flex-col gap-6"><p class="text-14-regular text-text-base"></p><div class="flex flex-col gap-4"></div><div class="flex flex-col gap-3"><label class="text-12-medium text-text-weak"></label></div><div class="flex flex-col gap-3"><label class="text-12-medium text-text-weak">`), _tmpl$2$1 = /* @__PURE__ */ template(`<div class="flex gap-2 items-start"><div class=flex-1></div><div class=flex-1>`);
function DialogCustomProvider(props) {
  const dialog = useDialog();
  const serverSync = useServerSync();
  const serverSDK = useServerSDK();
  const language = useLanguage();
  const [form, setForm] = createStore({
    providerID: "",
    name: "",
    baseURL: "",
    apiKey: "",
    models: [modelRow()],
    headers: [headerRow()],
    err: {}
  });
  const goBack = () => {
    if (props.back === "close") {
      dialog.close();
      return;
    }
    dialog.show(() => createComponent(DialogSelectProvider, {
      get directory() {
        return props.directory;
      }
    }));
  };
  const addModel = () => {
    setForm("models", produce((rows) => {
      rows.push(modelRow());
    }));
  };
  const removeModel = (index) => {
    if (form.models.length <= 1) return;
    setForm("models", produce((rows) => {
      rows.splice(index, 1);
    }));
  };
  const addHeader = () => {
    setForm("headers", produce((rows) => {
      rows.push(headerRow());
    }));
  };
  const removeHeader = (index) => {
    if (form.headers.length <= 1) return;
    setForm("headers", produce((rows) => {
      rows.splice(index, 1);
    }));
  };
  const setField = (key, value) => {
    setForm(key, value);
    if (key === "apiKey") return;
    setForm("err", key, void 0);
  };
  const setModel = (index, key, value) => {
    batch(() => {
      setForm("models", index, key, value);
      setForm("models", index, "err", key, void 0);
    });
  };
  const setHeader = (index, key, value) => {
    batch(() => {
      setForm("headers", index, key, value);
      setForm("headers", index, "err", key, void 0);
    });
  };
  const validate = () => {
    const output = validateCustomProvider({
      form,
      t: language.t,
      disabledProviders: serverSync().data.config.disabled_providers ?? [],
      existingProviderIDs: new Set(serverSync().data.provider.all.keys())
    });
    batch(() => {
      setForm("err", output.err);
      output.models.forEach((err, index) => setForm("models", index, "err", err));
      output.headers.forEach((err, index) => setForm("headers", index, "err", err));
    });
    return output.result;
  };
  const saveMutation = useMutation(() => ({
    mutationFn: async (result) => {
      const disabledProviders = serverSync().data.config.disabled_providers ?? [];
      const nextDisabled = disabledProviders.filter((id) => id !== result.providerID);
      if (result.key) {
        await serverSDK().client.auth.set({
          providerID: result.providerID,
          auth: {
            type: "api",
            key: result.key
          }
        });
      }
      await serverSync().updateConfig({
        provider: {
          [result.providerID]: result.config
        },
        disabled_providers: nextDisabled
      });
      return result;
    },
    onSuccess: (result) => {
      dialog.close();
      showToast({
        variant: "success",
        icon: "circle-check",
        title: language.t("provider.connect.toast.connected.title", {
          provider: result.name
        }),
        description: language.t("provider.connect.toast.connected.description", {
          provider: result.name
        })
      });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : String(err);
      showToast({
        title: language.t("common.requestFailed"),
        description: message
      });
    }
  }));
  const save = (e) => {
    e.preventDefault();
    if (saveMutation.isPending) return;
    const result = validate();
    if (!result) return;
    saveMutation.mutate(result);
  };
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
    transition: true,
    get children() {
      var _el$ = _tmpl$$1(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$2.nextSibling, _el$5 = _el$4.firstChild, _el$6 = _el$5.nextSibling, _el$7 = _el$6.nextSibling, _el$8 = _el$7.firstChild, _el$9 = _el$7.nextSibling, _el$0 = _el$9.firstChild;
      insert(_el$2, createComponent(ProviderIcon, {
        id: "synthetic",
        "class": "size-5 shrink-0 icon-strong-base"
      }), _el$3);
      insert(_el$3, () => language.t("provider.custom.title"));
      _el$4.addEventListener("submit", save);
      insert(_el$5, () => language.t("provider.custom.description.prefix"), null);
      insert(_el$5, createComponent(Link, {
        href: "https://opencode.ai/docs/providers/#custom-provider",
        tabIndex: -1,
        get children() {
          return language.t("provider.custom.description.link");
        }
      }), null);
      insert(_el$5, () => language.t("provider.custom.description.suffix"), null);
      insert(_el$6, createComponent(TextField, {
        autofocus: true,
        get label() {
          return language.t("provider.custom.field.providerID.label");
        },
        get placeholder() {
          return language.t("provider.custom.field.providerID.placeholder");
        },
        get description() {
          return language.t("provider.custom.field.providerID.description");
        },
        get value() {
          return form.providerID;
        },
        onChange: (v) => setField("providerID", v),
        get validationState() {
          return form.err.providerID ? "invalid" : void 0;
        },
        get error() {
          return form.err.providerID;
        }
      }), null);
      insert(_el$6, createComponent(TextField, {
        get label() {
          return language.t("provider.custom.field.name.label");
        },
        get placeholder() {
          return language.t("provider.custom.field.name.placeholder");
        },
        get value() {
          return form.name;
        },
        onChange: (v) => setField("name", v),
        get validationState() {
          return form.err.name ? "invalid" : void 0;
        },
        get error() {
          return form.err.name;
        }
      }), null);
      insert(_el$6, createComponent(TextField, {
        get label() {
          return language.t("provider.custom.field.baseURL.label");
        },
        get placeholder() {
          return language.t("provider.custom.field.baseURL.placeholder");
        },
        get value() {
          return form.baseURL;
        },
        onChange: (v) => setField("baseURL", v),
        get validationState() {
          return form.err.baseURL ? "invalid" : void 0;
        },
        get error() {
          return form.err.baseURL;
        }
      }), null);
      insert(_el$6, createComponent(TextField, {
        get label() {
          return language.t("provider.custom.field.apiKey.label");
        },
        get placeholder() {
          return language.t("provider.custom.field.apiKey.placeholder");
        },
        get description() {
          return language.t("provider.custom.field.apiKey.description");
        },
        get value() {
          return form.apiKey;
        },
        onChange: (v) => setField("apiKey", v)
      }), null);
      insert(_el$8, () => language.t("provider.custom.models.label"));
      insert(_el$7, createComponent(For, {
        get each() {
          return form.models;
        },
        children: (m, i) => (() => {
          var _el$1 = _tmpl$2$1(), _el$10 = _el$1.firstChild, _el$11 = _el$10.nextSibling;
          insert(_el$10, createComponent(TextField, {
            get label() {
              return language.t("provider.custom.models.id.label");
            },
            hideLabel: true,
            get placeholder() {
              return language.t("provider.custom.models.id.placeholder");
            },
            get value() {
              return m.id;
            },
            onChange: (v) => setModel(i(), "id", v),
            get validationState() {
              return m.err.id ? "invalid" : void 0;
            },
            get error() {
              return m.err.id;
            }
          }));
          insert(_el$11, createComponent(TextField, {
            get label() {
              return language.t("provider.custom.models.name.label");
            },
            hideLabel: true,
            get placeholder() {
              return language.t("provider.custom.models.name.placeholder");
            },
            get value() {
              return m.name;
            },
            onChange: (v) => setModel(i(), "name", v),
            get validationState() {
              return m.err.name ? "invalid" : void 0;
            },
            get error() {
              return m.err.name;
            }
          }));
          insert(_el$1, createComponent(IconButton, {
            type: "button",
            icon: "trash",
            variant: "ghost",
            "class": "mt-1.5",
            onClick: () => removeModel(i()),
            get disabled() {
              return form.models.length <= 1;
            },
            get ["aria-label"]() {
              return language.t("provider.custom.models.remove");
            }
          }), null);
          createRenderEffect(() => setAttribute(_el$1, "data-row", m.row));
          return _el$1;
        })()
      }), null);
      insert(_el$7, createComponent(Button, {
        type: "button",
        size: "small",
        variant: "ghost",
        icon: "plus-small",
        onClick: addModel,
        "class": "self-start",
        get children() {
          return language.t("provider.custom.models.add");
        }
      }), null);
      insert(_el$0, () => language.t("provider.custom.headers.label"));
      insert(_el$9, createComponent(For, {
        get each() {
          return form.headers;
        },
        children: (h, i) => (() => {
          var _el$12 = _tmpl$2$1(), _el$13 = _el$12.firstChild, _el$14 = _el$13.nextSibling;
          insert(_el$13, createComponent(TextField, {
            get label() {
              return language.t("provider.custom.headers.key.label");
            },
            hideLabel: true,
            get placeholder() {
              return language.t("provider.custom.headers.key.placeholder");
            },
            get value() {
              return h.key;
            },
            onChange: (v) => setHeader(i(), "key", v),
            get validationState() {
              return h.err.key ? "invalid" : void 0;
            },
            get error() {
              return h.err.key;
            }
          }));
          insert(_el$14, createComponent(TextField, {
            get label() {
              return language.t("provider.custom.headers.value.label");
            },
            hideLabel: true,
            get placeholder() {
              return language.t("provider.custom.headers.value.placeholder");
            },
            get value() {
              return h.value;
            },
            onChange: (v) => setHeader(i(), "value", v),
            get validationState() {
              return h.err.value ? "invalid" : void 0;
            },
            get error() {
              return h.err.value;
            }
          }));
          insert(_el$12, createComponent(IconButton, {
            type: "button",
            icon: "trash",
            variant: "ghost",
            "class": "mt-1.5",
            onClick: () => removeHeader(i()),
            get disabled() {
              return form.headers.length <= 1;
            },
            get ["aria-label"]() {
              return language.t("provider.custom.headers.remove");
            }
          }), null);
          createRenderEffect(() => setAttribute(_el$12, "data-row", h.row));
          return _el$12;
        })()
      }), null);
      insert(_el$9, createComponent(Button, {
        type: "button",
        size: "small",
        variant: "ghost",
        icon: "plus-small",
        onClick: addHeader,
        "class": "self-start",
        get children() {
          return language.t("provider.custom.headers.add");
        }
      }), null);
      insert(_el$4, createComponent(Button, {
        "class": "w-auto self-start",
        type: "submit",
        size: "large",
        variant: "primary",
        get disabled() {
          return saveMutation.isPending;
        },
        get children() {
          return memo(() => !!saveMutation.isPending)() ? language.t("common.saving") : language.t("common.submit");
        }
      }), null);
      return _el$;
    }
  });
}
var _tmpl$ = /* @__PURE__ */ template(`<div class="text-14-regular text-text-weak">`), _tmpl$2 = /* @__PURE__ */ template(`<div class="px-1.25 w-full flex items-center gap-x-3"><span>`);
const CUSTOM_ID = "_custom";
const DialogSelectProvider = (props) => {
  const dialog = useDialog();
  const providers = useProviders(props.directory);
  const language = useLanguage();
  const popularGroup = () => language.t("dialog.provider.group.popular");
  const otherGroup = () => language.t("dialog.provider.group.other");
  const customLabel = () => language.t("settings.providers.tag.custom");
  const note = (id) => {
    if (id === "anthropic") return language.t("dialog.provider.anthropic.note");
    if (id === "openai") return language.t("dialog.provider.openai.note");
    if (id.startsWith("github-copilot")) return language.t("dialog.provider.copilot.note");
    if (id === "opencode-go") return language.t("dialog.provider.opencodeGo.tagline");
  };
  return createComponent(Dialog, {
    get title() {
      return language.t("command.provider.connect");
    },
    transition: true,
    get children() {
      return createComponent(List, {
        "class": "px-3",
        get search() {
          return {
            placeholder: language.t("dialog.provider.search.placeholder"),
            autofocus: true
          };
        },
        get emptyMessage() {
          return language.t("dialog.provider.empty");
        },
        activeIcon: "plus-small",
        key: (x) => x?.id,
        items: () => {
          language.locale();
          return [{
            id: CUSTOM_ID,
            name: customLabel()
          }, ...providers.all().values()];
        },
        filterKeys: ["id", "name"],
        groupBy: (x) => popularProviders.includes(x.id) ? popularGroup() : otherGroup(),
        sortBy: (a, b) => {
          if (a.id === CUSTOM_ID) return -1;
          if (b.id === CUSTOM_ID) return 1;
          if (popularProviders.includes(a.id) && popularProviders.includes(b.id)) return popularProviders.indexOf(a.id) - popularProviders.indexOf(b.id);
          return a.name.localeCompare(b.name);
        },
        sortGroupsBy: (a, b) => {
          const popular = popularGroup();
          if (a.category === popular && b.category !== popular) return -1;
          if (b.category === popular && a.category !== popular) return 1;
          return 0;
        },
        onSelect: (x) => {
          if (!x) return;
          if (x.id === CUSTOM_ID) {
            dialog.show(() => createComponent(DialogCustomProvider, {
              back: "providers",
              get directory() {
                return props.directory;
              }
            }));
            return;
          }
          dialog.show(() => createComponent(DialogConnectProvider, {
            get provider() {
              return x.id;
            },
            get directory() {
              return props.directory;
            }
          }));
        },
        children: (i) => (() => {
          var _el$ = _tmpl$2(), _el$2 = _el$.firstChild;
          insert(_el$, createComponent(ProviderIcon, {
            "data-slot": "list-item-extra-icon",
            get id() {
              return i.id;
            }
          }), _el$2);
          insert(_el$2, () => i.name);
          insert(_el$, createComponent(Show, {
            get when() {
              return i.id === "opencode";
            },
            get children() {
              var _el$3 = _tmpl$();
              insert(_el$3, () => language.t("dialog.provider.opencode.tagline"));
              return _el$3;
            }
          }), null);
          insert(_el$, createComponent(Show, {
            get when() {
              return i.id === CUSTOM_ID;
            },
            get children() {
              return createComponent(Tag, {
                get children() {
                  return language.t("settings.providers.tag.custom");
                }
              });
            }
          }), null);
          insert(_el$, createComponent(Show, {
            get when() {
              return i.id === "opencode";
            },
            get children() {
              return createComponent(Tag, {
                get children() {
                  return language.t("dialog.provider.tag.recommended");
                }
              });
            }
          }), null);
          insert(_el$, createComponent(Show, {
            get when() {
              return note(i.id);
            },
            children: (value) => (() => {
              var _el$4 = _tmpl$();
              insert(_el$4, value);
              return _el$4;
            })()
          }), null);
          insert(_el$, createComponent(Show, {
            get when() {
              return i.id === "opencode-go";
            },
            get children() {
              return createComponent(Tag, {
                get children() {
                  return language.t("dialog.provider.tag.recommended");
                }
              });
            }
          }), null);
          return _el$;
        })()
      });
    }
  });
};
const dialogSelectProvider = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DialogSelectProvider
}, Symbol.toStringTag, { value: "Module" }));
export {
  DialogCustomProvider as D,
  DialogSelectProvider as a,
  dialogSelectProvider as d
};
//# sourceMappingURL=dialog-select-provider-Dh2NFik3.js.map
