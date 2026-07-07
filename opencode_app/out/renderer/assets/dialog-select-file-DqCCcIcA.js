const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./dialog-select-directory-v2-B_2U4bQ-.js","./main-Do1GNfcH.js","./main-DetviuuX.css","./dialog-select-directory-v2-COz_lkBH.css"])))=>i.map(i=>d[i]);
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
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "4db83661-1392-4d20-8351-73bc50f1e9d3", e._sentryDebugIdIdentifier = "sentry-dbid-4db83661-1392-4d20-8351-73bc50f1e9d3");
    })();
  } catch (e) {
  }
}
;
import { bz as useCommand, bI as useLanguage, bQ as usePlatform, b$ as useSettings, bJ as useLayout, bE as useFile, bD as useDialog, bN as useNavigate, bX as useServerSDK, bY as useServerSync, b_ as useSessionLayout, aB as createSignal, au as createMemo, aG as decode64, b6 as onCleanup, al as createComponent, L as List, Z as Switch, M as Match, aV as insert, X as Show, K as Keybind, aM as formatKeybind, I as Icon, ay as createRenderEffect, l as FileIcon, aP as getDirectory, aQ as getFilename, D as Dialog, aA as createSessionTabs, aX as lazy, a6 as __vitePreload, ac as base64Encode, bs as template } from "./main-Do1GNfcH.js";
function getRelativeTime(dateString, t) {
  const date = new Date(dateString);
  const now = /* @__PURE__ */ new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1e3);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffSeconds < 60) return t("common.time.justNow");
  if (diffMinutes < 60) return t("common.time.minutesAgo.short", { count: diffMinutes });
  if (diffHours < 24) return t("common.time.hoursAgo.short", { count: diffHours });
  return t("common.time.daysAgo.short", { count: diffDays });
}
var _tmpl$ = /* @__PURE__ */ template(`<span class="text-14-regular text-text-weak truncate">`), _tmpl$2 = /* @__PURE__ */ template(`<div class="w-full flex items-center justify-between gap-4"><div class="flex items-center gap-2 min-w-0"><span class="text-14-regular text-text-strong whitespace-nowrap">`), _tmpl$3 = /* @__PURE__ */ template(`<span class="text-12-regular text-text-weak whitespace-nowrap ml-2">`), _tmpl$4 = /* @__PURE__ */ template(`<div class="w-full flex items-center justify-between rounded-md pl-1"><div class="flex items-center gap-x-3 grow min-w-0"><div class="flex items-center gap-2 min-w-0"><span class="text-14-regular text-text-strong truncate">`), _tmpl$5 = /* @__PURE__ */ template(`<div class="w-full flex items-center justify-between rounded-md pl-1"><div class="flex items-center gap-x-3 grow min-w-0"><div class="flex items-center text-14-regular"><span class="text-text-weak whitespace-nowrap overflow-hidden overflow-ellipsis truncate min-w-0"></span><span class="text-text-strong whitespace-nowrap">`);
const DialogSelectFileV2 = lazy(() => __vitePreload(() => import("./dialog-select-directory-v2-B_2U4bQ-.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0, import.meta.url).then((module) => ({
  default: module.DialogSelectDirectoryV2
})));
const ENTRY_LIMIT = 5;
const COMMON_COMMAND_IDS = ["session.new", "workspace.new", "session.previous", "session.next", "terminal.toggle", "review.toggle"];
const uniqueEntries = (items) => {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
};
const createCommandEntry = (option, category) => ({
  id: "command:" + option.id,
  type: "command",
  title: option.title,
  description: option.description,
  keybind: option.keybind,
  category,
  option
});
const createFileEntry = (path, category) => ({
  id: "file:" + path,
  type: "file",
  title: path,
  category,
  path
});
const createSessionEntry = (input, category) => ({
  id: `session:${input.directory}:${input.id}`,
  type: "session",
  title: input.title,
  description: input.description,
  category,
  directory: input.directory,
  sessionID: input.id,
  archived: input.archived,
  updated: input.updated
});
function createCommandEntries(props) {
  const allowed = createMemo(() => {
    if (props.filesOnly()) return [];
    return props.command.options.filter((option) => !option.disabled && !option.hidden && !option.id.startsWith("suggested.") && option.id !== "file.open");
  });
  const list = createMemo(() => {
    const category = props.language.t("palette.group.commands");
    return allowed().map((option) => createCommandEntry(option, category));
  });
  const picks = createMemo(() => {
    const all = allowed();
    const order = new Map(COMMON_COMMAND_IDS.map((id, index) => [id, index]));
    const picked = all.filter((option) => order.has(option.id));
    const base = picked.length ? picked : all.slice(0, ENTRY_LIMIT);
    const sorted = picked.length ? [...base].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)) : base;
    const category = props.language.t("palette.group.commands");
    return sorted.map((option) => createCommandEntry(option, category));
  });
  return {
    allowed,
    list,
    picks
  };
}
function createFileEntries(props) {
  const tabState = createSessionTabs({
    tabs: props.tabs,
    pathFromTab: props.file.pathFromTab,
    normalizeTab: (tab) => tab.startsWith("file://") ? props.file.tab(tab) : tab
  });
  const recent = createMemo(() => {
    const all = tabState.openedTabs();
    const active = tabState.activeFileTab();
    const order = active ? [active, ...all.filter((item) => item !== active)] : all;
    const seen = /* @__PURE__ */ new Set();
    const category = props.language.t("palette.group.files");
    const items = [];
    for (const item of order) {
      const path = props.file.pathFromTab(item);
      if (!path) continue;
      if (seen.has(path)) continue;
      seen.add(path);
      items.push(createFileEntry(path, category));
    }
    return items.slice(0, ENTRY_LIMIT);
  });
  const root = createMemo(() => {
    const category = props.language.t("palette.group.files");
    const nodes = props.file.tree.children("");
    const paths = nodes.filter((node) => node.type === "file").map((node) => node.path).sort((a, b) => a.localeCompare(b));
    return paths.slice(0, ENTRY_LIMIT).map((path) => createFileEntry(path, category));
  });
  return {
    recent,
    root
  };
}
function createSessionEntries(props) {
  const state = {
    token: 0,
    inflight: void 0,
    cached: void 0
  };
  const sessions = (text) => {
    const query = text.trim();
    if (!query) {
      state.token += 1;
      state.inflight = void 0;
      state.cached = void 0;
      return [];
    }
    if (state.cached) return state.cached;
    if (state.inflight) return state.inflight;
    const current = state.token;
    const dirs = props.workspaces();
    if (dirs.length === 0) return [];
    state.inflight = Promise.all(dirs.map((directory) => {
      const description = props.label(directory);
      return props.serverSDK.client.session.list({
        directory,
        roots: true
      }).then((x) => (x.data ?? []).filter((s) => !!s?.id).map((s) => ({
        id: s.id,
        title: s.title ?? props.language.t("command.session.new"),
        description,
        directory,
        archived: s.time?.archived,
        updated: s.time?.updated
      }))).catch(() => []);
    })).then((results) => {
      if (state.token !== current) return [];
      const seen = /* @__PURE__ */ new Set();
      const category = props.language.t("command.category.session");
      const next = results.flat().filter((item) => {
        const key = `${item.directory}:${item.id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).map((item) => createSessionEntry(item, category));
      state.cached = next;
      return next;
    }).catch(() => []).finally(() => {
      state.inflight = void 0;
    });
    return state.inflight;
  };
  return {
    sessions
  };
}
function DialogSelectFile(props) {
  const command = useCommand();
  const language = useLanguage();
  const platform = usePlatform();
  const settings = useSettings();
  const layout = useLayout();
  const file = useFile();
  const dialog = useDialog();
  const navigate = useNavigate();
  const serverSDK = useServerSDK();
  const serverSync = useServerSync();
  const {
    params,
    tabs,
    view
  } = useSessionLayout();
  const filesOnly = () => props.mode === "files";
  const state = {
    cleanup: void 0,
    committed: false
  };
  const [grouped, setGrouped] = createSignal(false);
  const commandEntries = createCommandEntries({
    filesOnly,
    command,
    language
  });
  const fileEntries = createFileEntries({
    file,
    tabs,
    language
  });
  const projectDirectory = createMemo(() => decode64(params.dir) ?? "");
  const project = createMemo(() => {
    const directory = projectDirectory();
    if (!directory) return;
    return layout.projects.list().find((p) => p.worktree === directory || p.sandboxes?.includes(directory));
  });
  const workspaces = createMemo(() => {
    const directory = projectDirectory();
    const current = project();
    if (!current) return directory ? [directory] : [];
    const dirs = [current.worktree, ...current.sandboxes ?? []];
    if (directory && !dirs.includes(directory)) return [...dirs, directory];
    return dirs;
  });
  const homedir = createMemo(() => serverSync().data.path.home);
  const label = (directory) => {
    const current = project();
    const kind = current && directory === current.worktree ? language.t("workspace.type.local") : language.t("workspace.type.sandbox");
    const [store] = serverSync().child(directory, {
      bootstrap: false
    });
    const home = homedir();
    const path = home ? directory.replace(home, "~") : directory;
    const name = store.vcs?.branch ?? getFilename(directory);
    return `${kind} : ${name || path}`;
  };
  const {
    sessions
  } = createSessionEntries({
    workspaces,
    label,
    serverSDK: serverSDK(),
    language
  });
  const items = async (text) => {
    const query = text.trim();
    setGrouped(query.length > 0);
    if (!query && filesOnly()) {
      const loaded = file.tree.state("")?.loaded;
      const pending = loaded ? Promise.resolve() : file.tree.list("");
      const next = uniqueEntries([...fileEntries.recent(), ...fileEntries.root()]);
      if (loaded || next.length > 0) {
        return next;
      }
      await pending;
      return uniqueEntries([...fileEntries.recent(), ...fileEntries.root()]);
    }
    if (!query) return [...commandEntries.picks(), ...fileEntries.recent()];
    if (filesOnly()) {
      const files2 = await file.searchFiles(query);
      const category2 = language.t("palette.group.files");
      return files2.map((path) => createFileEntry(path, category2));
    }
    const [files, nextSessions] = await Promise.all([file.searchFiles(query), Promise.resolve(sessions(query))]);
    const category = language.t("palette.group.files");
    const entries = files.map((path) => createFileEntry(path, category));
    return [...commandEntries.list(), ...nextSessions, ...entries];
  };
  const handleMove = (item) => {
    state.cleanup?.();
    if (!item) return;
    if (item.type !== "command") return;
    state.cleanup = item.option?.onHighlight?.();
  };
  const open = (path) => {
    const value = file.tab(path);
    void tabs().open(value);
    void file.load(path);
    if (!view().reviewPanel.opened()) view().reviewPanel.open();
    layout.fileTree.setTab("all");
    props.onOpenFile?.(path);
    tabs().setActive(value);
  };
  const handleSelect = (item) => {
    if (!item) return;
    state.committed = true;
    state.cleanup = void 0;
    dialog.close();
    if (item.type === "command") {
      item.option?.onSelect?.("palette");
      return;
    }
    if (item.type === "session") {
      if (!item.directory || !item.sessionID) return;
      navigate(`/${base64Encode(item.directory)}/session/${item.sessionID}`);
      return;
    }
    if (!item.path) return;
    open(item.path);
  };
  onCleanup(() => {
    if (state.committed) return;
    state.cleanup?.();
  });
  if (filesOnly() && platform.platform === "desktop" && settings.general.newLayoutDesigns()) {
    return createComponent(DialogSelectFileV2, {
      get server() {
        return serverSDK().server;
      },
      mode: "file",
      get start() {
        return projectDirectory();
      },
      get title() {
        return language.t("session.header.searchFiles");
      },
      onSelect: (result) => {
        if (typeof result !== "string") return;
        open(result);
      }
    });
  }
  return createComponent(Dialog, {
    "class": "pt-3 pb-0 !max-h-[480px]",
    transition: true,
    get children() {
      return createComponent(List, {
        "class": "px-3",
        get search() {
          return {
            placeholder: filesOnly() ? language.t("session.header.searchFiles") : language.t("palette.search.placeholder"),
            autofocus: true,
            hideIcon: true
          };
        },
        get emptyMessage() {
          return language.t("palette.empty");
        },
        get loadingMessage() {
          return language.t("common.loading");
        },
        items,
        key: (item) => item.id,
        filterKeys: ["title", "description", "category"],
        skipFilter: (item) => item.type === "file",
        get groupBy() {
          return grouped() ? (item) => item.category : () => "";
        },
        onMove: handleMove,
        onSelect: handleSelect,
        children: (item) => createComponent(Switch, {
          get fallback() {
            return (() => {
              var _el$1 = _tmpl$5(), _el$10 = _el$1.firstChild, _el$11 = _el$10.firstChild, _el$12 = _el$11.firstChild, _el$13 = _el$12.nextSibling;
              insert(_el$10, createComponent(FileIcon, {
                get node() {
                  return {
                    path: item.path ?? "",
                    type: "file"
                  };
                },
                "class": "shrink-0 size-4"
              }), _el$11);
              insert(_el$12, () => getDirectory(item.path ?? ""));
              insert(_el$13, () => getFilename(item.path ?? ""));
              return _el$1;
            })();
          },
          get children() {
            return [createComponent(Match, {
              get when() {
                return item.type === "command";
              },
              get children() {
                var _el$ = _tmpl$2(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild;
                insert(_el$3, () => item.title);
                insert(_el$2, createComponent(Show, {
                  get when() {
                    return item.description;
                  },
                  get children() {
                    var _el$4 = _tmpl$();
                    insert(_el$4, () => item.description);
                    return _el$4;
                  }
                }), null);
                insert(_el$, createComponent(Show, {
                  get when() {
                    return item.keybind;
                  },
                  get children() {
                    return createComponent(Keybind, {
                      "class": "rounded-[4px]",
                      get children() {
                        return formatKeybind(item.keybind ?? "", language.t);
                      }
                    });
                  }
                }), null);
                return _el$;
              }
            }), createComponent(Match, {
              get when() {
                return item.type === "session";
              },
              get children() {
                var _el$5 = _tmpl$4(), _el$6 = _el$5.firstChild, _el$7 = _el$6.firstChild, _el$8 = _el$7.firstChild;
                insert(_el$6, createComponent(Icon, {
                  name: "bubble-5",
                  size: "small",
                  "class": "shrink-0 text-icon-weak"
                }), _el$7);
                insert(_el$8, () => item.title);
                insert(_el$7, createComponent(Show, {
                  get when() {
                    return item.description;
                  },
                  get children() {
                    var _el$9 = _tmpl$();
                    insert(_el$9, () => item.description);
                    createRenderEffect(() => _el$9.classList.toggle("opacity-70", !!item.archived));
                    return _el$9;
                  }
                }), null);
                insert(_el$5, createComponent(Show, {
                  get when() {
                    return item.updated;
                  },
                  get children() {
                    var _el$0 = _tmpl$3();
                    insert(_el$0, () => getRelativeTime(new Date(item.updated).toISOString(), language.t));
                    return _el$0;
                  }
                }), null);
                createRenderEffect(() => _el$8.classList.toggle("opacity-70", !!item.archived));
                return _el$5;
              }
            })];
          }
        })
      });
    }
  });
}
export {
  DialogSelectFile
};
//# sourceMappingURL=dialog-select-file-DqCCcIcA.js.map
