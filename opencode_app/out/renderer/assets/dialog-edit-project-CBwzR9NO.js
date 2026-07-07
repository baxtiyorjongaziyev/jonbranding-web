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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "48d5ffb2-f2fd-40b7-a66a-a1c35f0302e2", e._sentryDebugIdIdentifier = "sentry-dbid-48d5ffb2-f2fd-40b7-a66a-a1c35f0302e2");
    })();
  } catch (e) {
  }
}
;
import { bD as useDialog, bH as useGlobal, bI as useLanguage, au as createMemo, aQ as getFilename, aC as createStore, bM as useMutation, al as createComponent, aV as insert, a2 as TextField, X as Show, ay as createRenderEffect, bn as setAttribute, A as Avatar, a$ as mergeProps, aO as getAvatarColors, aR as getProjectAvatarSource, I as Icon, by as use, m as For, ah as classList, B as Button, aZ as memo, D as Dialog, bs as template, aH as delegateEvents } from "./main-Do1GNfcH.js";
var _tmpl$ = /* @__PURE__ */ template(`<div class="flex flex-col gap-2"><label class="text-12-medium text-text-weak"></label><div class="flex gap-1.5">`), _tmpl$2 = /* @__PURE__ */ template(`<form class="flex flex-col gap-6 p-6 pt-0"><div class="flex flex-col gap-4"><div class="flex flex-col gap-2"><label class="text-12-medium text-text-weak"></label><div class="flex gap-3 items-start"><div class=relative><div class="relative size-16 rounded-md transition-colors cursor-pointer"></div><div class="absolute inset-0 size-16 bg-surface-raised-stronger-non-alpha/90 rounded-[6px] z-10 pointer-events-none flex items-center justify-center transition-opacity"></div><div class="absolute inset-0 size-16 bg-surface-raised-stronger-non-alpha/90 rounded-[6px] z-10 pointer-events-none flex items-center justify-center transition-opacity"></div></div><input id=icon-upload type=file accept=image/* class=hidden><div class="flex flex-col gap-1.5 text-12-regular text-text-weak self-center"><span></span><span></span></div></div></div></div><div class="flex justify-end gap-2">`), _tmpl$3 = /* @__PURE__ */ template(`<div class="size-full flex items-center justify-center">`), _tmpl$4 = /* @__PURE__ */ template(`<img class="size-full object-cover">`), _tmpl$5 = /* @__PURE__ */ template(`<button type=button>`);
const AVATAR_COLOR_KEYS = ["pink", "mint", "orange", "purple", "cyan", "lime"];
function DialogEditProject(props) {
  const dialog = useDialog();
  const global2 = useGlobal();
  const language = useLanguage();
  const serverCtx = createMemo(() => global2.ensureServerCtx(props.server));
  const serverSDK = () => serverCtx().sdk;
  const serverSync = () => serverCtx().sync;
  const folderName = createMemo(() => getFilename(props.project.worktree));
  const defaultName = createMemo(() => props.project.name || folderName());
  const [store, setStore] = createStore({
    name: defaultName(),
    color: props.project.icon?.color,
    iconOverride: props.project.icon?.override,
    startup: props.project.commands?.start ?? "",
    dragOver: false,
    iconHover: false
  });
  let iconInput;
  function handleFileSelect(file) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setStore("iconOverride", e.target?.result);
      setStore("iconHover", false);
    };
    reader.readAsDataURL(file);
  }
  function handleDrop(e) {
    e.preventDefault();
    setStore("dragOver", false);
    const file = e.dataTransfer?.files[0];
    if (file) handleFileSelect(file);
  }
  function handleDragOver(e) {
    e.preventDefault();
    setStore("dragOver", true);
  }
  function handleDragLeave() {
    setStore("dragOver", false);
  }
  function handleInputChange(e) {
    const input = e.target;
    const file = input.files?.[0];
    if (file) handleFileSelect(file);
  }
  function clearIcon() {
    setStore("iconOverride", "");
  }
  const saveMutation = useMutation(() => ({
    mutationFn: async () => {
      const name = store.name.trim() === folderName() ? "" : store.name.trim();
      const start = store.startup.trim();
      if (props.project.id && props.project.id !== "global") {
        await serverSDK().client.project.update({
          projectID: props.project.id,
          directory: props.project.worktree,
          name,
          icon: {
            color: store.color || "",
            override: store.iconOverride || ""
          },
          commands: {
            start
          }
        });
        serverSync().project.icon(props.project.worktree, store.iconOverride || void 0);
        dialog.close();
        return;
      }
      serverSync().project.meta(props.project.worktree, {
        name,
        icon: {
          color: store.color || void 0,
          override: store.iconOverride || void 0
        },
        commands: {
          start: start || void 0
        }
      });
      dialog.close();
    }
  }));
  function handleSubmit(e) {
    e.preventDefault();
    if (saveMutation.isPending) return;
    saveMutation.mutate();
  }
  return createComponent(Dialog, {
    get title() {
      return language.t("dialog.project.edit.title");
    },
    "class": "w-full max-w-[480px] mx-auto",
    get children() {
      var _el$ = _tmpl$2(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$4.nextSibling, _el$6 = _el$5.firstChild, _el$7 = _el$6.firstChild, _el$8 = _el$7.nextSibling, _el$9 = _el$8.nextSibling, _el$0 = _el$6.nextSibling, _el$1 = _el$0.nextSibling, _el$10 = _el$1.firstChild, _el$11 = _el$10.nextSibling, _el$15 = _el$2.nextSibling;
      _el$.addEventListener("submit", handleSubmit);
      insert(_el$2, createComponent(TextField, {
        autofocus: true,
        type: "text",
        get label() {
          return language.t("dialog.project.edit.name");
        },
        get placeholder() {
          return folderName();
        },
        get value() {
          return store.name;
        },
        onChange: (v) => setStore("name", v)
      }), _el$3);
      insert(_el$4, () => language.t("dialog.project.edit.icon"));
      _el$6.addEventListener("mouseleave", () => setStore("iconHover", false));
      _el$6.addEventListener("mouseenter", () => setStore("iconHover", true));
      _el$7.$$click = () => {
        if (store.iconOverride && store.iconHover) {
          clearIcon();
        } else {
          iconInput?.click();
        }
      };
      _el$7.addEventListener("dragleave", handleDragLeave);
      _el$7.addEventListener("dragover", handleDragOver);
      _el$7.addEventListener("drop", handleDrop);
      insert(_el$7, createComponent(Show, {
        get when() {
          return getProjectAvatarSource(props.project.id, {
            color: store.color,
            url: props.project.icon?.url,
            override: store.iconOverride
          });
        },
        get fallback() {
          return (() => {
            var _el$16 = _tmpl$3();
            insert(_el$16, createComponent(Avatar, mergeProps({
              get fallback() {
                return store.name || defaultName();
              }
            }, () => getAvatarColors(store.color), {
              "class": "size-full text-[32px]"
            })));
            return _el$16;
          })();
        },
        children: (src) => (() => {
          var _el$17 = _tmpl$4();
          createRenderEffect((_p$) => {
            var _v$6 = src(), _v$7 = language.t("dialog.project.edit.icon.alt");
            _v$6 !== _p$.e && setAttribute(_el$17, "src", _p$.e = _v$6);
            _v$7 !== _p$.t && setAttribute(_el$17, "alt", _p$.t = _v$7);
            return _p$;
          }, {
            e: void 0,
            t: void 0
          });
          return _el$17;
        })()
      }));
      insert(_el$8, createComponent(Icon, {
        name: "cloud-upload",
        size: "large",
        "class": "text-icon-on-interactive-base drop-shadow-sm"
      }));
      insert(_el$9, createComponent(Icon, {
        name: "trash",
        size: "large",
        "class": "text-icon-on-interactive-base drop-shadow-sm"
      }));
      _el$0.addEventListener("change", handleInputChange);
      use((el) => {
        iconInput = el;
      }, _el$0);
      insert(_el$10, () => language.t("dialog.project.edit.icon.hint"));
      insert(_el$11, () => language.t("dialog.project.edit.icon.recommended"));
      insert(_el$2, createComponent(Show, {
        get when() {
          return !store.iconOverride;
        },
        get children() {
          var _el$12 = _tmpl$(), _el$13 = _el$12.firstChild, _el$14 = _el$13.nextSibling;
          insert(_el$13, () => language.t("dialog.project.edit.color"));
          insert(_el$14, createComponent(For, {
            each: AVATAR_COLOR_KEYS,
            children: (color) => (() => {
              var _el$18 = _tmpl$5();
              _el$18.$$click = () => {
                if (store.color === color && !props.project.icon?.url) return;
                setStore("color", store.color === color ? void 0 : color);
              };
              insert(_el$18, createComponent(Avatar, mergeProps({
                get fallback() {
                  return store.name || defaultName();
                }
              }, () => getAvatarColors(color), {
                "class": "size-full rounded"
              })));
              createRenderEffect((_p$) => {
                var _v$8 = language.t("dialog.project.edit.color.select", {
                  color
                }), _v$9 = store.color === color, _v$0 = {
                  "flex items-center justify-center size-10 p-0.5 rounded-lg overflow-hidden transition-colors cursor-default": true,
                  "bg-transparent border-2 border-icon-strong-base hover:bg-surface-base-hover": store.color === color,
                  "bg-transparent border border-transparent hover:bg-surface-base-hover hover:border-border-weak-base": store.color !== color
                };
                _v$8 !== _p$.e && setAttribute(_el$18, "aria-label", _p$.e = _v$8);
                _v$9 !== _p$.t && setAttribute(_el$18, "aria-pressed", _p$.t = _v$9);
                _p$.a = classList(_el$18, _v$0, _p$.a);
                return _p$;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              });
              return _el$18;
            })()
          }));
          return _el$12;
        }
      }), null);
      insert(_el$2, createComponent(TextField, {
        multiline: true,
        get label() {
          return language.t("dialog.project.edit.worktree.startup");
        },
        get description() {
          return language.t("dialog.project.edit.worktree.startup.description");
        },
        get placeholder() {
          return language.t("dialog.project.edit.worktree.startup.placeholder");
        },
        get value() {
          return store.startup;
        },
        onChange: (v) => setStore("startup", v),
        spellcheck: false,
        "class": "max-h-14 w-full overflow-y-auto font-mono text-xs"
      }), null);
      insert(_el$15, createComponent(Button, {
        type: "button",
        variant: "ghost",
        size: "large",
        onClick: () => dialog.close(),
        get children() {
          return language.t("common.cancel");
        }
      }), null);
      insert(_el$15, createComponent(Button, {
        type: "submit",
        variant: "primary",
        size: "large",
        get disabled() {
          return saveMutation.isPending;
        },
        get children() {
          return memo(() => !!saveMutation.isPending)() ? language.t("common.saving") : language.t("common.save");
        }
      }), null);
      createRenderEffect((_p$) => {
        var _v$ = {
          "border-text-interactive-base bg-surface-info-base/20": store.dragOver,
          "border-border-base hover:border-border-strong": !store.dragOver,
          "overflow-hidden": !!store.iconOverride
        }, _v$2 = !!(store.iconHover && !store.iconOverride), _v$3 = !(store.iconHover && !store.iconOverride), _v$4 = !!(store.iconHover && !!store.iconOverride), _v$5 = !(store.iconHover && !!store.iconOverride);
        _p$.e = classList(_el$7, _v$, _p$.e);
        _v$2 !== _p$.t && _el$8.classList.toggle("opacity-100", _p$.t = _v$2);
        _v$3 !== _p$.a && _el$8.classList.toggle("opacity-0", _p$.a = _v$3);
        _v$4 !== _p$.o && _el$9.classList.toggle("opacity-100", _p$.o = _v$4);
        _v$5 !== _p$.i && _el$9.classList.toggle("opacity-0", _p$.i = _v$5);
        return _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      });
      return _el$;
    }
  });
}
delegateEvents(["click"]);
export {
  DialogEditProject
};
//# sourceMappingURL=dialog-edit-project-CBwzR9NO.js.map
