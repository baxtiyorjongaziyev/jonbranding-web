"use strict";
const electron = require("electron");
const updaterCallbacks = /* @__PURE__ */ new Set();
let updaterState;
let updaterSubscription;
const updaterHandler = (_, state) => {
  updaterState = state;
  updaterCallbacks.forEach((callback) => callback(state));
};
const api = {
  killSidecar: () => electron.ipcRenderer.invoke("kill-sidecar"),
  installCli: () => electron.ipcRenderer.invoke("install-cli"),
  awaitInitialization: () => electron.ipcRenderer.invoke("await-initialization"),
  wslServers: {
    getState: () => electron.ipcRenderer.invoke("wsl-servers-get-state"),
    subscribe: (cb) => {
      const handler = (_, event) => cb(event);
      electron.ipcRenderer.on("wsl-servers-event", handler);
      void electron.ipcRenderer.invoke("wsl-servers-subscribe");
      return () => {
        electron.ipcRenderer.removeListener("wsl-servers-event", handler);
        void electron.ipcRenderer.invoke("wsl-servers-unsubscribe");
      };
    },
    probeRuntime: () => electron.ipcRenderer.invoke("wsl-servers-probe-runtime"),
    refreshDistros: () => electron.ipcRenderer.invoke("wsl-servers-refresh-distros"),
    installWsl: () => electron.ipcRenderer.invoke("wsl-servers-install-wsl"),
    installDistro: (name) => electron.ipcRenderer.invoke("wsl-servers-install-distro", name),
    probeAddable: (distros) => electron.ipcRenderer.invoke("wsl-servers-probe-addable", distros),
    installOpencode: (name) => electron.ipcRenderer.invoke("wsl-servers-install-opencode", name),
    openTerminal: (name) => electron.ipcRenderer.invoke("wsl-servers-open-terminal", name),
    addServer: (distro) => electron.ipcRenderer.invoke("wsl-servers-add", distro),
    removeServer: (id) => electron.ipcRenderer.invoke("wsl-servers-remove", id),
    startServer: (id) => electron.ipcRenderer.invoke("wsl-servers-start", id)
  },
  updater: {
    subscribe: async (cb) => {
      updaterCallbacks.add(cb);
      if (updaterState) cb(updaterState);
      if (!updaterSubscription) {
        electron.ipcRenderer.on("updater-state", updaterHandler);
        updaterSubscription = electron.ipcRenderer.invoke("updater-subscribe");
      }
      await updaterSubscription;
      return () => {
        updaterCallbacks.delete(cb);
        if (updaterCallbacks.size > 0) return;
        electron.ipcRenderer.removeListener("updater-state", updaterHandler);
        updaterSubscription = void 0;
        void electron.ipcRenderer.invoke("updater-unsubscribe");
      };
    },
    check: () => electron.ipcRenderer.invoke("updater-check"),
    install: () => electron.ipcRenderer.invoke("updater-install")
  },
  consumeInitialDeepLinks: () => electron.ipcRenderer.invoke("consume-initial-deep-links"),
  getDefaultServerUrl: () => electron.ipcRenderer.invoke("get-default-server-url"),
  setDefaultServerUrl: (url) => electron.ipcRenderer.invoke("set-default-server-url", url),
  getDisplayBackend: () => electron.ipcRenderer.invoke("get-display-backend"),
  setDisplayBackend: (backend) => electron.ipcRenderer.invoke("set-display-backend", backend),
  parseMarkdownCommand: (markdown) => electron.ipcRenderer.invoke("parse-markdown", markdown),
  checkAppExists: (appName) => electron.ipcRenderer.invoke("check-app-exists", appName),
  resolveAppPath: (appName) => electron.ipcRenderer.invoke("resolve-app-path", appName),
  storeGet: (name, key) => electron.ipcRenderer.invoke("store-get", name, key),
  storeSet: (name, key, value) => electron.ipcRenderer.invoke("store-set", name, key, value),
  storeDelete: (name, key) => electron.ipcRenderer.invoke("store-delete", name, key),
  storeClear: (name) => electron.ipcRenderer.invoke("store-clear", name),
  storeKeys: (name) => electron.ipcRenderer.invoke("store-keys", name),
  storeLength: (name) => electron.ipcRenderer.invoke("store-length", name),
  getWindowCount: () => electron.ipcRenderer.invoke("get-window-count"),
  getWindowID: () => electron.ipcRenderer.invoke("get-window-id"),
  onMenuCommand: (cb) => {
    const handler = (_, id) => cb(id);
    electron.ipcRenderer.on("menu-command", handler);
    return () => electron.ipcRenderer.removeListener("menu-command", handler);
  },
  onDeepLink: (cb) => {
    const handler = (_, urls) => cb(urls);
    electron.ipcRenderer.on("deep-link", handler);
    return () => electron.ipcRenderer.removeListener("deep-link", handler);
  },
  openDirectoryPicker: (opts) => electron.ipcRenderer.invoke("open-directory-picker", opts),
  openFilePicker: (opts) => electron.ipcRenderer.invoke("open-file-picker", opts),
  readPickedFile: (token, path) => electron.ipcRenderer.invoke("read-picked-file", token, path),
  releasePickedFiles: (token) => electron.ipcRenderer.invoke("release-picked-files", token),
  getPathForFile: (file) => electron.webUtils.getPathForFile(file),
  saveFilePicker: (opts) => electron.ipcRenderer.invoke("save-file-picker", opts),
  openLink: (url) => electron.ipcRenderer.send("open-link", url),
  openPath: (path, app) => electron.ipcRenderer.invoke("open-path", path, app),
  readClipboardImage: () => electron.ipcRenderer.invoke("read-clipboard-image"),
  showNotification: (title, body) => electron.ipcRenderer.send("show-notification", title, body),
  getWindowFocused: () => electron.ipcRenderer.invoke("get-window-focused"),
  setWindowFocus: () => electron.ipcRenderer.invoke("set-window-focus"),
  showWindow: () => electron.ipcRenderer.invoke("show-window"),
  relaunch: () => electron.ipcRenderer.send("relaunch"),
  getZoomFactor: () => electron.ipcRenderer.invoke("get-zoom-factor"),
  setZoomFactor: (factor) => electron.ipcRenderer.invoke("set-zoom-factor", factor),
  getPinchZoomEnabled: () => electron.ipcRenderer.invoke("get-pinch-zoom-enabled"),
  setPinchZoomEnabled: (enabled) => electron.ipcRenderer.invoke("set-pinch-zoom-enabled", enabled),
  onPinchZoomEnabledChanged: (cb) => {
    const handler = (_, enabled) => cb(enabled);
    electron.ipcRenderer.on("pinch-zoom-enabled-changed", handler);
    return () => electron.ipcRenderer.removeListener("pinch-zoom-enabled-changed", handler);
  },
  onZoomFactorChanged: (cb) => {
    const handler = (_, factor) => cb(factor);
    electron.ipcRenderer.on("zoom-factor-changed", handler);
    return () => electron.ipcRenderer.removeListener("zoom-factor-changed", handler);
  },
  setTitlebar: (theme) => electron.ipcRenderer.invoke("set-titlebar", theme),
  runDesktopMenuAction: (action) => electron.ipcRenderer.invoke("run-desktop-menu-action", action),
  setBackgroundColor: (color) => electron.ipcRenderer.invoke("set-background-color", color),
  exportDebugLogs: () => electron.ipcRenderer.invoke("export-debug-logs"),
  recordFatalRendererError: (error) => electron.ipcRenderer.invoke("record-fatal-renderer-error", error)
};
electron.contextBridge.exposeInMainWorld("api", api);
