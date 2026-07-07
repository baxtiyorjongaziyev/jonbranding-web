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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "3841fec0-8e51-4811-bd47-8269e38652d2", e._sentryDebugIdIdentifier = "sentry-dbid-3841fec0-8e51-4811-bd47-8269e38652d2");
    })();
  } catch (e) {
  }
}
;
import { bK as useLocal, bI as useLanguage, bD as useDialog, al as createComponent, L as List, aV as insert, a4 as Tooltip, B as Button, D as Dialog, bF as useFilteredList, bg as popularProviders, e as DialogHeader, h as DialogTitleGroup, a as ButtonV2, c as DialogBody, a3 as TextInputV2, X as Show, t as IconButtonV2, r as Icon, m as For, z as ProviderIcon, b as Dialog$1, bs as template, aG as decode64, aH as delegateEvents } from "./main-Do1GNfcH.js";
import { S as Switch } from "./switch-CcOrtMmL.js";
import { a as Switch$1, S as SettingsRowV2 } from "./row-4AB8wTZz.js";
import { a as DialogSelectProvider } from "./dialog-select-provider-Dh2NFik3.js";
import { SettingsListV2 } from "./list-BTiznb36.js";
import "./LROKH5N7-Bao07a_E.js";
import "./dialog-connect-provider-VwuxBEmX.js";
var _tmpl$ = /* @__PURE__ */ template(`<span>`), _tmpl$2 = /* @__PURE__ */ template(`<div class="w-full flex items-center justify-between gap-x-3"><span></span><div>`), _tmpl$3 = /* @__PURE__ */ template(`<div class="px-4 pt-px pb-3"><div class=relative>`), _tmpl$4 = /* @__PURE__ */ template(`<div data-slot=manage-models-scroll class="relative min-h-0 flex-1"><div class="settings-v2-panel settings-v2-models h-full px-4 pt-4 pb-4">`), _tmpl$5 = /* @__PURE__ */ template(`<div class=settings-v2-models-status>`), _tmpl$6 = /* @__PURE__ */ template(`<span class=settings-v2-models-status-filter>&quot;<!>&quot;`), _tmpl$7 = /* @__PURE__ */ template(`<div class=settings-v2-models-status><span>`), _tmpl$8 = /* @__PURE__ */ template(`<div class=settings-v2-section data-component=settings-models-provider><div class="settings-v2-models-group-header justify-between"><div class="flex min-w-0 items-center gap-2"><h3 class=settings-v2-section-title></h3></div><div>`), _tmpl$9 = /* @__PURE__ */ template(`<div>`);
const DialogManageModels = () => {
  const local = useLocal();
  const language = useLanguage();
  const dialog = useDialog();
  const directory = () => decode64(local.slug());
  const handleConnectProvider = () => {
    dialog.show(() => createComponent(DialogSelectProvider, {
      directory
    }));
  };
  const providerRank = (id) => popularProviders.indexOf(id);
  const providerList = (providerID) => local.model.list().filter((x) => x.provider.id === providerID);
  const providerVisible = (providerID) => providerList(providerID).every((x) => local.model.visible({
    modelID: x.id,
    providerID: x.provider.id
  }));
  const setProviderVisibility = (providerID, checked) => {
    providerList(providerID).forEach((x) => {
      local.model.setVisibility({
        modelID: x.id,
        providerID: x.provider.id
      }, checked);
    });
  };
  return createComponent(Dialog, {
    get title() {
      return language.t("dialog.model.manage");
    },
    get description() {
      return language.t("dialog.model.manage.description");
    },
    get action() {
      return createComponent(Button, {
        "class": "h-7 -my-1 text-14-medium",
        icon: "plus-small",
        tabIndex: -1,
        onClick: handleConnectProvider,
        get children() {
          return language.t("command.provider.connect");
        }
      });
    },
    get children() {
      return createComponent(List, {
        "class": "px-3",
        get search() {
          return {
            placeholder: language.t("dialog.model.search.placeholder"),
            autofocus: true
          };
        },
        get emptyMessage() {
          return language.t("dialog.model.empty");
        },
        key: (x) => `${x?.provider?.id}:${x?.id}`,
        get items() {
          return local.model.list();
        },
        filterKeys: ["provider.name", "name", "id"],
        sortBy: (a, b) => a.name.localeCompare(b.name),
        groupBy: (x) => x.provider.id,
        groupHeader: (group) => {
          const provider = group.items[0].provider;
          return [(() => {
            var _el$ = _tmpl$();
            insert(_el$, () => provider.name);
            return _el$;
          })(), createComponent(Tooltip, {
            placement: "top",
            get value() {
              return language.t("dialog.model.manage.provider.toggle", {
                provider: provider.name
              });
            },
            get children() {
              return createComponent(Switch, {
                "class": "-mr-1",
                get checked() {
                  return providerVisible(provider.id);
                },
                onChange: (checked) => setProviderVisibility(provider.id, checked),
                hideLabel: true,
                get children() {
                  return provider.name;
                }
              });
            }
          })];
        },
        sortGroupsBy: (a, b) => {
          const aRank = providerRank(a.items[0].provider.id);
          const bRank = providerRank(b.items[0].provider.id);
          const aPopular = aRank >= 0;
          const bPopular = bRank >= 0;
          if (aPopular && !bPopular) return -1;
          if (!aPopular && bPopular) return 1;
          return aRank - bRank;
        },
        onSelect: (x) => {
          if (!x) return;
          const key = {
            modelID: x.id,
            providerID: x.provider.id
          };
          local.model.setVisibility(key, !local.model.visible(key));
        },
        children: (i) => (() => {
          var _el$2 = _tmpl$2(), _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling;
          insert(_el$3, () => i.name);
          _el$4.$$click = (e) => e.stopPropagation();
          insert(_el$4, createComponent(Switch, {
            get checked() {
              return !!local.model.visible({
                modelID: i.id,
                providerID: i.provider.id
              });
            },
            onChange: (checked) => {
              local.model.setVisibility({
                modelID: i.id,
                providerID: i.provider.id
              }, checked);
            }
          }));
          return _el$2;
        })()
      });
    }
  });
};
const DialogManageModelsV2 = () => {
  const local = useLocal();
  const language = useLanguage();
  const dialog = useDialog();
  const directory = () => decode64(local.slug());
  const handleConnectProvider = () => {
    dialog.show(() => createComponent(DialogSelectProvider, {
      directory
    }));
  };
  const providerList = (providerID) => local.model.list().filter((x) => x.provider.id === providerID);
  const providerVisible = (providerID) => providerList(providerID).every((x) => local.model.visible({
    modelID: x.id,
    providerID: x.provider.id
  }));
  const setProviderVisibility = (providerID, checked) => {
    providerList(providerID).forEach((x) => {
      local.model.setVisibility({
        modelID: x.id,
        providerID: x.provider.id
      }, checked);
    });
  };
  const setModelVisibility = (item, checked) => {
    local.model.setVisibility({
      modelID: item.id,
      providerID: item.provider.id
    }, checked);
  };
  const list = useFilteredList({
    items: () => local.model.list(),
    key: (x) => `${x.provider.id}:${x.id}`,
    filterKeys: ["provider.name", "name", "id"],
    sortBy: (a, b) => a.name.localeCompare(b.name),
    groupBy: (x) => x.provider.id,
    sortGroupsBy: (a, b) => {
      const aRank = popularProviders.indexOf(a.category);
      const bRank = popularProviders.indexOf(b.category);
      const aPopular = aRank >= 0;
      const bPopular = bRank >= 0;
      if (aPopular && !bPopular) return -1;
      if (!aPopular && bPopular) return 1;
      return aRank - bRank;
    }
  });
  return createComponent(Dialog$1, {
    size: "large",
    variant: "settings",
    "class": "settings-v2-manage-models-dialog",
    get children() {
      return [createComponent(DialogHeader, {
        hideClose: true,
        get closeLabel() {
          return language.t("common.close");
        },
        get children() {
          return [createComponent(DialogTitleGroup, {
            get title() {
              return language.t("dialog.model.manage");
            },
            get description() {
              return language.t("dialog.model.manage.description");
            }
          }), createComponent(ButtonV2, {
            variant: "neutral",
            icon: "plus",
            onClick: handleConnectProvider,
            get children() {
              return language.t("command.provider.connect");
            }
          })];
        }
      }), createComponent(DialogBody, {
        "class": "flex min-h-0 flex-1 flex-col",
        get children() {
          return [(() => {
            var _el$5 = _tmpl$3(), _el$6 = _el$5.firstChild;
            insert(_el$6, createComponent(TextInputV2, {
              type: "search",
              appearance: "base",
              "class": "!w-full self-stretch",
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
              autofocus: true,
              get ["aria-label"]() {
                return language.t("dialog.model.search.placeholder");
              }
            }), null);
            insert(_el$6, createComponent(Show, {
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
                  onClick: () => list.clear(),
                  get ["aria-label"]() {
                    return language.t("common.clear");
                  }
                });
              }
            }), null);
            return _el$5;
          })(), (() => {
            var _el$7 = _tmpl$4(), _el$8 = _el$7.firstChild;
            insert(_el$8, createComponent(Show, {
              get when() {
                return !list.grouped.loading;
              },
              get fallback() {
                return (() => {
                  var _el$9 = _tmpl$5();
                  insert(_el$9, () => language.t("common.loading"), null);
                  insert(_el$9, () => language.t("common.loading.ellipsis"), null);
                  return _el$9;
                })();
              },
              get children() {
                return createComponent(Show, {
                  get when() {
                    return list.flat().length > 0;
                  },
                  get fallback() {
                    return (() => {
                      var _el$0 = _tmpl$7(), _el$1 = _el$0.firstChild;
                      insert(_el$1, () => language.t("dialog.model.empty"));
                      insert(_el$0, createComponent(Show, {
                        get when() {
                          return list.filter();
                        },
                        get children() {
                          var _el$10 = _tmpl$6(), _el$11 = _el$10.firstChild, _el$13 = _el$11.nextSibling;
                          _el$13.nextSibling;
                          insert(_el$10, () => list.filter(), _el$13);
                          return _el$10;
                        }
                      }), null);
                      return _el$0;
                    })();
                  },
                  get children() {
                    return createComponent(For, {
                      get each() {
                        return list.grouped.latest;
                      },
                      children: (group) => (() => {
                        var _el$14 = _tmpl$8(), _el$15 = _el$14.firstChild, _el$16 = _el$15.firstChild, _el$17 = _el$16.firstChild, _el$18 = _el$16.nextSibling;
                        insert(_el$16, createComponent(ProviderIcon, {
                          get id() {
                            return group.category;
                          },
                          width: 16,
                          height: 16,
                          "class": "ml-4 shrink-0"
                        }), _el$17);
                        insert(_el$17, () => group.items[0].provider.name);
                        insert(_el$18, createComponent(Switch$1, {
                          "class": "mr-6",
                          get checked() {
                            return providerVisible(group.category);
                          },
                          onChange: (checked) => setProviderVisibility(group.category, checked),
                          hideLabel: true,
                          get children() {
                            return group.items[0].provider.name;
                          }
                        }));
                        insert(_el$14, createComponent(SettingsListV2, {
                          get children() {
                            return createComponent(For, {
                              get each() {
                                return group.items;
                              },
                              children: (item) => createComponent(SettingsRowV2, {
                                get title() {
                                  return item.name;
                                },
                                description: "",
                                get children() {
                                  var _el$19 = _tmpl$9();
                                  insert(_el$19, createComponent(Switch$1, {
                                    get checked() {
                                      return local.model.visible({
                                        modelID: item.id,
                                        providerID: item.provider.id
                                      });
                                    },
                                    onChange: (checked) => setModelVisibility(item, checked),
                                    hideLabel: true,
                                    get children() {
                                      return item.name;
                                    }
                                  }));
                                  return _el$19;
                                }
                              })
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
            return _el$7;
          })()];
        }
      })];
    }
  });
};
delegateEvents(["click"]);
export {
  DialogManageModels,
  DialogManageModelsV2
};
//# sourceMappingURL=dialog-manage-models-CqW6SnX0.js.map
