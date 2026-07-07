!(function() {
  try {
    var e2 = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : {};
    e2.SENTRY_RELEASE = { id: "desktop@1.17.13" };
  } catch (e3) {
  }
})();
;
{
  try {
    (function() {
      var e2 = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : {}, n2 = new e2.Error().stack;
      n2 && (e2._sentryDebugIds = e2._sentryDebugIds || {}, e2._sentryDebugIds[n2] = "33ceefaf-4731-4e2c-a183-25938d0c25b2", e2._sentryDebugIdIdentifier = "sentry-dbid-33ceefaf-4731-4e2c-a183-25938d0c25b2");
    })();
  } catch (e2) {
  }
}
;
import { bH as useGlobal, bD as useDialog, bI as useLanguage, bc as pickerMode, aB as createSignal, au as createMemo, az as createResource, aF as currentPickerSuggestions, b7 as onMount, b6 as onCleanup, ao as createEffect, al as createComponent, e as DialogHeader, g as DialogTitle, i as DividerV2, c as DialogBody, aV as insert, a3 as TextInputV2, aZ as memo, aj as cleanPickerInput, a as ButtonV2, be as pickerRoot, bd as pickerParent, X as Show, m as For, aK as displayPickerPath, ay as createRenderEffect, bn as setAttribute, b5 as nextTreeScrollTop, d as DialogFooter, by as use, b as Dialog, a7 as absoluteTreePath, ab as advanceTreePreload, bh as preloadTreeDirectories, ba as pickerAbsoluteInput, a9 as activeTreeNavigation, bs as template, bb as pickerFileSearchQuery, av as createPriorityTaskQueue, b4 as nextSuggestionIndex, aH as delegateEvents, an as createDirectorySearch } from "./main-Do1GNfcH.js";
const FILE_TREE_TAG_NAME = "file-tree-container";
const FILE_TREE_STYLE_ATTRIBUTE = "data-file-tree-style";
const FILE_TREE_UNSAFE_CSS_ATTRIBUTE = "data-file-tree-unsafe-css";
const FILE_TREE_SCROLLBAR_MEASURE_ATTRIBUTE = "data-file-tree-scrollbar-measure";
const FILE_TREE_SCROLLBAR_GUTTER_STYLE_ATTRIBUTE = "data-file-tree-scrollbar-gutter-measured";
const FILE_TREE_SCROLLBAR_GUTTER_MEASURED_PROPERTY = "--trees-scrollbar-gutter-measured";
const FLATTENED_PREFIX = "f::";
const HEADER_SLOT_NAME = "header";
const CONTEXT_MENU_SLOT_NAME = "context-menu";
const CONTEXT_MENU_TRIGGER_TYPE = "context-menu-trigger";
var style_default = "@layer base, theme, unsafe;\n\n@layer base {\n  :host {\n    /*\n      CSS variables use a fallback stack to ensure user and theme colors slot\n      in with ease. User colors take precedence over theme colors, which take\n      precedence over defaults.\n\n      Fallback order:\n\n      1. --trees-*-override (explicit)\n      2. --trees-theme-* (e.g. Shiki/VS Code tokens)\n      3. defaults\n\n      Theme variable names mirror Shiki/VS Code theme file JSON tokens.\n\n      // Available CSS Color Overrides\n      --trees-fg-override\n      --trees-fg-muted-override\n      --trees-bg-override\n      --trees-bg-muted-override\n      --trees-accent-override\n      --trees-border-color-override\n\n      --trees-focus-ring-color-override\n      --trees-focus-ring-width-override\n      --trees-focus-ring-offset-override\n\n      --trees-search-fg-override\n      --trees-search-font-weight-override\n      --trees-search-bg-override\n\n      --trees-selected-fg-override\n      --trees-selected-bg-override\n      --trees-selected-focused-border-color-override\n\n      // Git Status Color Overrides\n      --trees-status-added-override\n      --trees-status-ignored-override\n      --trees-status-modified-override\n      --trees-status-renamed-override\n      --trees-status-untracked-override\n      --trees-status-deleted-override\n      --trees-git-added-color-override\n      --trees-git-ignored-color-override\n      --trees-git-modified-color-override\n      --trees-git-renamed-color-override\n      --trees-git-untracked-color-override\n      --trees-git-deleted-color-override\n\n      // Built-in File Icon Color Overrides\n      --trees-file-icon-color\n      --trees-file-icon-color-astro\n      --trees-file-icon-color-babel\n      --trees-file-icon-color-bash\n      --trees-file-icon-color-biome\n      --trees-file-icon-color-bootstrap\n      --trees-file-icon-color-browserslist\n      --trees-file-icon-color-bun\n      --trees-file-icon-color-c\n      --trees-file-icon-color-cpp\n      --trees-file-icon-color-claude\n      --trees-file-icon-color-css\n      --trees-file-icon-color-database\n      --trees-file-icon-color-default\n      --trees-file-icon-color-docker\n      --trees-file-icon-color-eslint\n      --trees-file-icon-color-git\n      --trees-file-icon-color-go\n      --trees-file-icon-color-graphql\n      --trees-file-icon-color-html\n      --trees-file-icon-color-image\n      --trees-file-icon-color-javascript\n      --trees-file-icon-color-json\n      --trees-file-icon-color-markdown\n      --trees-file-icon-color-mcp\n      --trees-file-icon-color-npm\n      --trees-file-icon-color-oxc\n      --trees-file-icon-color-postcss\n      --trees-file-icon-color-prettier\n      --trees-file-icon-color-python\n      --trees-file-icon-color-react\n      --trees-file-icon-color-ruby\n      --trees-file-icon-color-rust\n      --trees-file-icon-color-sass\n      --trees-file-icon-color-svg\n      --trees-file-icon-color-svelte\n      --trees-file-icon-color-svgo\n      --trees-file-icon-color-swift\n      --trees-file-icon-color-table\n      --trees-file-icon-color-text\n      --trees-file-icon-color-tailwind\n      --trees-file-icon-color-terraform\n      --trees-file-icon-color-typescript\n      --trees-file-icon-color-vite\n      --trees-file-icon-color-vscode\n      --trees-file-icon-color-vue\n      --trees-file-icon-color-wasm\n      --trees-file-icon-color-webpack\n      --trees-file-icon-color-yml\n      --trees-file-icon-color-zig\n      --trees-file-icon-color-zip\n\n      // Density\n      //\n      // A unitless scale factor for padding, gaps, and indentation. Usually\n      // set via `density` on useFileTree. Individual overrides take precedence.\n      //\n      //   Compact: 0.8\n      //   Default: 1\n      //   Relaxed: 1.2\n      //\n      --trees-density-override\n\n      // Available CSS Layout Overrides\n      --trees-gap-override\n      --trees-border-radius-override\n      --trees-font-family-override\n      --trees-font-size-override\n      --trees-font-weight-regular-override\n      --trees-font-weight-semibold-override\n      --trees-level-gap-override\n      --trees-item-padding-x-override\n      --trees-item-margin-x-override\n      --trees-item-row-gap-override\n      --trees-icon-width-override\n      --trees-icon-nudge-override\n      --trees-scrollbar-gutter-override\n      --trees-padding-inline-override\n    */\n\n    --trees-accent: var(--trees-accent-override, #009fff);\n    --trees-fg: var(\n      --trees-fg-override,\n      var(--trees-theme-sidebar-fg, light-dark(#6c6c71, #adadb1))\n    );\n    --trees-fg-muted: var(\n      --trees-fg-muted-override,\n      var(--trees-theme-sidebar-header-fg, light-dark(#84848a, #84848a))\n    );\n    --trees-bg: var(\n      --trees-bg-override,\n      var(--trees-theme-sidebar-bg, light-dark(#f8f8f8, #141415))\n    );\n    /* var(--trees-theme-list-hover-bg, light-dark(#dfebff59, #19283c59)) */\n    --trees-bg-muted: var(\n      --trees-bg-muted-override,\n      var(\n        --trees-theme-list-hover-bg,\n        light-dark(\n          color-mix(\n            in lab,\n            var(--trees-accent) var(--trees-bg-alpha-light, 8%),\n            var(--trees-bg)\n          ),\n          color-mix(\n            in lab,\n            var(--trees-accent) var(--trees-bg-alpha-dark, 10%),\n            var(--trees-bg)\n          )\n        )\n      )\n    );\n    --trees-input-bg: var(\n      --trees-input-bg-override,\n      light-dark(#f8f8f8, #070707)\n    );\n\n    --trees-added-light: #16a994;\n    --trees-added-dark: #00cab1;\n    --trees-ignored-light: #adadb1;\n    --trees-ignored-dark: #4a4a4e;\n    --trees-modified-light: #1ca1c7;\n    --trees-modified-dark: #08c0ef;\n    --trees-renamed-light: #d5a910;\n    --trees-renamed-dark: #ffd452;\n    --trees-untracked-light: #16a994;\n    --trees-untracked-dark: #00cab1;\n    --trees-deleted-light: #ff2e3f;\n    --trees-deleted-dark: #ff6762;\n\n    --trees-border-color: var(\n      --trees-border-color-override,\n      var(--trees-theme-sidebar-border, light-dark(#eeeeef, #070707))\n    );\n    --trees-indent-guide-bg: var(\n      --trees-indent-guide-bg-override,\n      color-mix(in lab, var(--trees-fg-muted) 25%, transparent)\n    );\n    --trees-density: var(--trees-density-override, 1);\n    --trees-border-radius: var(\n      --trees-border-radius-override,\n      calc(6px * var(--trees-density))\n    );\n\n    --trees-font-family: var(--trees-font-family-override, system-ui);\n    --trees-font-size: var(--trees-font-size-override, 13px);\n    --trees-font-weight-regular: var(--trees-font-weight-regular-override, 400);\n    --trees-font-weight-semibold: var(\n      --trees-font-weight-semibold-override,\n      600\n    );\n\n    --trees-focus-ring-color: var(\n      --trees-focus-ring-color-override,\n      var(--trees-theme-focus-ring, var(--trees-accent))\n    );\n    --trees-focus-ring-width: var(--trees-focus-ring-width-override, 1px);\n    --trees-focus-ring-offset: var(--trees-focus-ring-offset-override, -1px);\n\n    --trees-search-fg: var(\n      --trees-search-fg-override,\n      var(--trees-theme-input-fg, var(--trees-fg))\n    );\n    --trees-search-font-weight: var(--trees-search-font-weight-override, 600);\n    --trees-search-bg: var(\n      --trees-search-bg-override,\n      var(--trees-theme-input-bg, var(--trees-input-bg))\n    );\n\n    --trees-scrollbar-thumb: var(\n      --trees-scrollbar-thumb-override,\n      var(\n        --trees-theme-scrollbar-thumb,\n        color-mix(in lab, var(--trees-fg) 25%, var(--trees-bg))\n      )\n    );\n\n    --trees-selected-fg: var(\n      --trees-selected-fg-override,\n      var(--trees-theme-list-active-selection-fg, var(--trees-fg))\n    );\n    --trees-selected-bg: var(\n      --trees-selected-bg-override,\n      var(\n        --trees-theme-list-active-selection-bg,\n        light-dark(\n          color-mix(in lab, var(--trees-accent) 12%, var(--trees-bg)),\n          color-mix(in lab, var(--trees-accent) 15%, var(--trees-bg))\n        )\n      )\n    );\n    --trees-selected-focused-border-color: var(\n      --trees-selected-focused-border-color-override,\n      var(--trees-theme-focus-ring, var(--trees-accent))\n    );\n\n    /* Git status (e.g. from Shiki theme gitDecoration.*) */\n    --trees-status-added: var(\n      --trees-status-added-override,\n      var(\n        --trees-theme-git-added-fg,\n        light-dark(var(--trees-added-light), var(--trees-added-dark))\n      )\n    );\n    --trees-status-ignored: var(\n      --trees-status-ignored-override,\n      var(\n        --trees-theme-git-ignored-fg,\n        light-dark(var(--trees-ignored-light), var(--trees-ignored-dark))\n      )\n    );\n    --trees-status-modified: var(\n      --trees-status-modified-override,\n      var(\n        --trees-theme-git-modified-fg,\n        light-dark(var(--trees-modified-light), var(--trees-modified-dark))\n      )\n    );\n    --trees-status-renamed: var(\n      --trees-status-renamed-override,\n      var(\n        --trees-theme-git-renamed-fg,\n        light-dark(var(--trees-renamed-light), var(--trees-renamed-dark))\n      )\n    );\n    --trees-status-untracked: var(\n      --trees-status-untracked-override,\n      var(\n        --trees-theme-git-untracked-fg,\n        light-dark(var(--trees-untracked-light), var(--trees-untracked-dark))\n      )\n    );\n    --trees-status-deleted: var(\n      --trees-status-deleted-override,\n      var(\n        --trees-theme-git-deleted-fg,\n        light-dark(var(--trees-deleted-light), var(--trees-deleted-dark))\n      )\n    );\n    --trees-git-modified-color: var(\n      --trees-git-modified-color-override,\n      var(--trees-status-modified)\n    );\n    --trees-git-added-color: var(\n      --trees-git-added-color-override,\n      var(--trees-status-added)\n    );\n    --trees-git-ignored-color: var(\n      --trees-git-ignored-color-override,\n      var(--trees-status-ignored)\n    );\n    --trees-git-deleted-color: var(\n      --trees-git-deleted-color-override,\n      var(--trees-status-deleted)\n    );\n    --trees-git-renamed-color: var(\n      --trees-git-renamed-color-override,\n      var(--trees-status-renamed)\n    );\n    --trees-git-untracked-color: var(\n      --trees-git-untracked-color-override,\n      var(--trees-status-untracked)\n    );\n\n    --trees-icon-gray: light-dark(#84848a, #adadb1);\n    --trees-icon-red: light-dark(#d52c36, #ff6762);\n    --trees-icon-vermilion: light-dark(#ff8c5b, #d5512f);\n    --trees-icon-orange: light-dark(#d47628, #ffa359);\n    --trees-icon-yellow: light-dark(#d5a910, #ffd452);\n    --trees-icon-green: light-dark(#199f43, #5ecc71);\n    --trees-icon-teal: light-dark(#17a5af, #64d1db);\n    --trees-icon-cyan: light-dark(#1ca1c7, #68cdf2);\n    --trees-icon-blue: light-dark(#1a85d4, #69b1ff);\n    --trees-icon-indigo: light-dark(#693acf, #9d6afb);\n    --trees-icon-purple: light-dark(#a631be, #d568ea);\n    --trees-icon-pink: light-dark(#d32a61, #ff678d);\n    --trees-icon-mauve: light-dark(#594c5b, #79697b);\n\n    --trees-file-icon-color-default: var(\n      --trees-file-icon-color,\n      var(--trees-icon-gray)\n    );\n    --trees-file-icon-color-astro: var(\n      --trees-file-icon-color,\n      var(--trees-icon-purple)\n    );\n    --trees-file-icon-color-babel: var(\n      --trees-file-icon-color,\n      var(--trees-icon-yellow)\n    );\n    --trees-file-icon-color-bash: var(\n      --trees-file-icon-color,\n      var(--trees-icon-green)\n    );\n    --trees-file-icon-color-biome: var(\n      --trees-file-icon-color,\n      var(--trees-icon-blue)\n    );\n    --trees-file-icon-color-bootstrap: var(\n      --trees-file-icon-color,\n      var(--trees-icon-indigo)\n    );\n    --trees-file-icon-color-browserslist: var(\n      --trees-file-icon-color,\n      var(--trees-icon-yellow)\n    );\n    --trees-file-icon-color-bun: var(\n      --trees-file-icon-color,\n      var(--trees-icon-mauve)\n    );\n    --trees-file-icon-color-c: var(\n      --trees-file-icon-color,\n      var(--trees-icon-blue)\n    );\n    --trees-file-icon-color-cpp: var(\n      --trees-file-icon-color,\n      var(--trees-icon-blue)\n    );\n    --trees-file-icon-color-claude: var(\n      --trees-file-icon-color,\n      var(--trees-icon-orange)\n    );\n    --trees-file-icon-color-css: var(\n      --trees-file-icon-color,\n      var(--trees-icon-indigo)\n    );\n    --trees-file-icon-color-database: var(\n      --trees-file-icon-color,\n      var(--trees-icon-purple)\n    );\n    --trees-file-icon-color-docker: var(\n      --trees-file-icon-color,\n      var(--trees-icon-blue)\n    );\n    --trees-file-icon-color-eslint: var(\n      --trees-file-icon-color,\n      var(--trees-icon-indigo)\n    );\n    --trees-file-icon-color-git: var(\n      --trees-file-icon-vermilion,\n      var(--trees-icon-vermilion)\n    );\n    --trees-file-icon-color-go: var(\n      --trees-file-icon-color,\n      var(--trees-icon-cyan)\n    );\n    --trees-file-icon-color-graphql: var(\n      --trees-file-icon-color,\n      var(--trees-icon-pink)\n    );\n    --trees-file-icon-color-html: var(\n      --trees-file-icon-color,\n      var(--trees-icon-orange)\n    );\n    --trees-file-icon-color-image: var(\n      --trees-file-icon-color,\n      var(--trees-icon-pink)\n    );\n    --trees-file-icon-color-javascript: var(\n      --trees-file-icon-color,\n      var(--trees-icon-yellow)\n    );\n    --trees-file-icon-color-json: var(\n      --trees-file-icon-color,\n      var(--trees-icon-orange)\n    );\n    --trees-file-icon-color-markdown: var(\n      --trees-file-icon-color,\n      var(--trees-icon-green)\n    );\n    --trees-file-icon-color-mcp: var(\n      --trees-file-icon-color,\n      var(--trees-icon-teal)\n    );\n    --trees-file-icon-color-npm: var(\n      --trees-file-icon-color,\n      var(--trees-icon-red)\n    );\n    --trees-file-icon-color-oxc: var(\n      --trees-file-icon-cyan,\n      var(--trees-icon-cyan)\n    );\n    --trees-file-icon-color-postcss: var(\n      --trees-file-icon-color,\n      var(--trees-icon-red)\n    );\n    --trees-file-icon-color-prettier: var(\n      --trees-file-icon-color,\n      var(--trees-icon-teal)\n    );\n    --trees-file-icon-color-python: var(\n      --trees-file-icon-color,\n      var(--trees-icon-blue)\n    );\n    --trees-file-icon-color-react: var(\n      --trees-file-icon-color,\n      var(--trees-icon-cyan)\n    );\n    --trees-file-icon-color-ruby: var(\n      --trees-file-icon-color,\n      var(--trees-icon-red)\n    );\n    --trees-file-icon-color-rust: var(\n      --trees-file-icon-color,\n      var(--trees-icon-orange)\n    );\n    --trees-file-icon-color-sass: var(\n      --trees-file-icon-color,\n      var(--trees-icon-pink)\n    );\n    --trees-file-icon-color-svg: var(\n      --trees-file-icon-color,\n      var(--trees-icon-orange)\n    );\n    --trees-file-icon-color-svelte: var(\n      --trees-file-icon-color,\n      var(--trees-icon-red)\n    );\n    --trees-file-icon-color-svgo: var(\n      --trees-file-icon-color,\n      var(--trees-icon-green)\n    );\n    --trees-file-icon-color-swift: var(\n      --trees-file-icon-color,\n      var(--trees-icon-orange)\n    );\n    --trees-file-icon-color-table: var(\n      --trees-file-icon-color,\n      var(--trees-icon-teal)\n    );\n    --trees-file-icon-color-text: var(\n      --trees-file-icon-color,\n      var(--trees-icon-gray)\n    );\n    --trees-file-icon-color-tailwind: var(\n      --trees-file-icon-color,\n      var(--trees-icon-cyan)\n    );\n    --trees-file-icon-color-terraform: var(\n      --trees-file-icon-color,\n      var(--trees-icon-indigo)\n    );\n    --trees-file-icon-color-typescript: var(\n      --trees-file-icon-color,\n      var(--trees-icon-blue)\n    );\n    --trees-file-icon-color-vite: var(\n      --trees-file-icon-color,\n      var(--trees-icon-purple)\n    );\n    --trees-file-icon-color-vscode: var(\n      --trees-file-icon-color,\n      var(--trees-icon-blue)\n    );\n    --trees-file-icon-color-vue: var(\n      --trees-file-icon-color,\n      var(--trees-icon-green)\n    );\n    --trees-file-icon-color-wasm: var(\n      --trees-file-icon-color,\n      var(--trees-icon-indigo)\n    );\n    --trees-file-icon-color-webpack: var(\n      --trees-file-icon-color,\n      var(--trees-icon-blue)\n    );\n    --trees-file-icon-color-yml: var(\n      --trees-file-icon-color,\n      var(--trees-icon-red)\n    );\n    --trees-file-icon-color-zig: var(\n      --trees-file-icon-color,\n      var(--trees-icon-orange)\n    );\n    --trees-file-icon-color-zip: var(\n      --trees-file-icon-color,\n      var(--trees-icon-orange)\n    );\n\n    --trees-level-gap: var(\n      --trees-level-gap-override,\n      calc(8px * var(--trees-density))\n    );\n    --trees-item-padding-x: var(\n      --trees-item-padding-x-override,\n      calc(8px * var(--trees-density))\n    );\n    --trees-item-margin-x: var(\n      --trees-item-margin-x-override,\n      calc(2px * var(--trees-density))\n    );\n    --trees-item-row-gap: var(\n      --trees-item-row-gap-override,\n      calc(6px * var(--trees-density))\n    );\n    --trees-icon-width: var(--trees-icon-width-override, 16px);\n    --trees-icon-nudge: var(\n      --trees-icon-nudge-override,\n      calc(1px * var(--trees-density))\n    );\n    --trees-row-height: var(--trees-item-height, 30px);\n    --trees-git-lane-width: var(--trees-git-lane-width-override, 12px);\n    --trees-action-lane-width: var(\n      --trees-action-lane-width-override,\n      calc(var(--trees-icon-width) + 2px)\n    );\n    /* Keep the floating trigger aligned with the row's action lane. Going in\n       from the root's right edge: the scroll container reserves\n       `--trees-padding-inline` of effective inset on each side (its asymmetric\n       padding formula cancels the scrollbar gutter on the right), the row\n       sits inside that inset, and its trailing `--trees-item-padding-x` is the\n       action lane itself. The trigger's own focus-ring margin then trims one\n       pixel back so the button's visible right edge lines up with the lane. */\n    --trees-context-menu-trigger-inline-offset: calc(\n      var(--trees-padding-inline) + var(--trees-item-padding-x) -\n        var(--trees-focus-ring-width)\n    );\n\n    --trees-scrollbar-gutter: var(--trees-scrollbar-gutter-override, 6px);\n    --trees-padding-inline: var(--trees-padding-inline-override, 16px);\n\n    color-scheme: light dark;\n    display: flex;\n    flex-direction: column;\n    font-size: var(--trees-font-size);\n    color: var(--trees-fg);\n    background-color: var(--trees-bg);\n    --truncate-marker-background-color: var(--trees-bg);\n    --truncate-marker-background-overlay-color: transparent;\n    font-family: var(--trees-font-family);\n    font-weight: var(--trees-font-weight-regular);\n  }\n\n  :host([data-file-tree-virtualized='true']) {\n    height: 100%;\n    overflow: hidden;\n  }\n\n  [data-file-tree-virtualized-wrapper='true'] {\n    height: 100%;\n    overflow: hidden;\n    display: flex;\n    flex-direction: column;\n  }\n\n  [data-file-tree-virtualized-root='true'] {\n    height: 100%;\n    display: flex;\n    flex-direction: column;\n    overflow: hidden;\n  }\n\n  [data-file-tree-virtualized-scroll='true'],\n  [data-file-tree-scrollbar-measure='true'] {\n    --trees-scrollbar-thumb-current: transparent;\n    overflow-y: auto;\n    scrollbar-gutter: stable;\n\n    &:hover {\n      --trees-scrollbar-thumb-current: var(--trees-scrollbar-thumb);\n    }\n\n    &::-webkit-scrollbar {\n      width: var(--trees-scrollbar-gutter);\n      height: var(--trees-scrollbar-gutter);\n    }\n\n    &::-webkit-scrollbar-track {\n      background: transparent;\n    }\n\n    &::-webkit-scrollbar-thumb {\n      background-color: var(--trees-scrollbar-thumb-current);\n      border: 1px solid transparent;\n      background-clip: content-box;\n      border-radius: calc(var(--trees-scrollbar-gutter) / 2);\n    }\n\n    &::-webkit-scrollbar-corner {\n      background-color: transparent;\n    }\n  }\n\n  /* These are styles for a temporarily generated element to measure the size\n   * of the scrollbar.  It's intended to be somewhat similar in scrollbar style\n   * scope to the scrollable tree so `--trees-scrollbar-gutter-measured` is an\n   * accurate reflection of the size the scrollbar gutter takes up. */\n  [data-file-tree-scrollbar-measure='true'] {\n    position: absolute;\n    top: 0;\n    left: 0;\n    visibility: hidden;\n    pointer-events: none;\n    width: 100px;\n    height: 100px;\n  }\n\n  @supports (-moz-appearance: none) {\n    [data-file-tree-virtualized-scroll='true'],\n    [data-file-tree-scrollbar-measure='true'] {\n      scrollbar-width: thin;\n      scrollbar-color: var(--trees-scrollbar-thumb-current) transparent;\n    }\n  }\n\n  [data-file-tree-virtualized-scroll='true'] {\n    position: relative;\n    overflow-y: auto;\n    flex: 1 1 0;\n    min-height: 0;\n    padding-inline: max(\n        calc(var(--trees-padding-inline) - var(--trees-item-margin-x)),\n        0px\n      )\n      /* NOTE(amadeus): We can assume that all Webkit based browser gutters\n       * will align to the value of '--trees-scrollbar-gutter', however if not, then\n       * `--trees-scrollbar-gutter-measured` should correct it. Mostly we are\n       * hoping to avoid SSR alignment jumps if possible. In non-SSR'd environments\n       * `--trees-scrollbar-gutter-measured` should always be immediately available.\n       */\n      max(\n        calc(\n          var(--trees-padding-inline) - var(--trees-item-margin-x) -\n            var(\n              --trees-scrollbar-gutter-measured,\n              var(--trees-scrollbar-gutter)\n            )\n        ),\n        0px\n      );\n  }\n\n  @supports (-moz-appearance: none) {\n    [data-file-tree-virtualized-scroll='true'] {\n      padding-inline: max(\n          calc(var(--trees-padding-inline) - var(--trees-item-margin-x)),\n          0px\n        )\n        /* NOTE(amadeus): However on Firefox it can vary a little bit, but most\n         * likely the majority of cases will default to a 0px width scrollbar lets\n         * inherit that first to avoid SSR jumps. In non-SSR'd environments\n         * `--trees-scrollbar-gutter-measured` should always be immediately available.\n         */\n        max(\n          calc(\n            var(--trees-padding-inline) - var(--trees-item-margin-x) -\n              var(--trees-scrollbar-gutter-measured, 0px)\n          ),\n          0px\n        );\n    }\n  }\n\n  [data-file-tree-sticky-overlay='true'] {\n    position: sticky;\n    top: 0;\n    height: 0;\n    z-index: 4;\n    overflow: visible;\n    pointer-events: none;\n  }\n\n  /* The overlay DOM is kept populated even at scrollTop=0 so the browser has\n   * the rendered rows on hand the moment scrolling begins — otherwise the\n   * compositor paints a scrolled frame before React can mount the overlay,\n   * and the topmost sticky folder jumps up by a couple of pixels before it\n   * \"snaps\" into its pinned position. We hide it via CSS whenever the scroll\n   * is at the top and no scroll is in progress, so the preview doesn't leak\n   * through at rest. `data-overlay-reveal` is stamped on the root only when\n   * the user initiates a scroll while already at the top — exactly the case\n   * where we need the pre-mounted overlay to be visible through the first\n   * compositor frame. It is deliberately distinct from the general\n   * `data-is-scrolling` flag so a scroll that ends at the top (e.g. ArrowUp\n   * navigation) re-hides the overlay the instant the scroll lands, rather\n   * than waiting for the hover-suppression timer to elapse. */\n  [data-file-tree-virtualized-root='true'][data-scroll-at-top='true']:not(\n      [data-overlay-reveal]\n    )\n    [data-file-tree-sticky-overlay='true'] {\n    visibility: hidden;\n  }\n\n  [data-file-tree-sticky-overlay-content='true'] {\n    background-color: var(--trees-bg);\n    position: relative;\n    pointer-events: none;\n  }\n\n  [data-file-tree-virtualized-list='true'] {\n    background-color: var(--trees-bg);\n    position: relative;\n    min-height: 100%;\n    width: 100%;\n    overflow-anchor: none;\n\n    &[data-is-scrolling] {\n      pointer-events: none;\n    }\n  }\n\n  [data-file-tree-virtualized-sticky-offset='true'] {\n    contain: layout size;\n  }\n\n  [data-file-tree-virtualized-sticky='true'] {\n    position: sticky;\n    top: 0;\n    width: 100%;\n    display: flex;\n    flex-direction: column;\n    isolation: isolate;\n    /* Promote to its own compositor layer so text inside the window is\n     * rasterized once and GPU-translated during scroll. Without this, the\n     * browser re-paints the window (and its text) at every scroll frame,\n     * which produces visible 1px shake / character tearing. */\n    will-change: transform;\n  }\n\n  [data-file-tree-search-container] {\n    display: flex;\n    padding: 0;\n    padding-inline: var(--trees-padding-inline);\n    margin-bottom: var(--trees-item-row-gap);\n  }\n\n  [data-file-tree-search-input] {\n    --trees-focus-ring-width: 2px;\n    font-family: var(--trees-font-family);\n    font-size: var(--trees-font-size);\n    flex: 1;\n    height: var(--trees-row-height);\n    /* 1px breathing room so the focus-visible outline isn't clipped when the\n     * input sits flush against the top of the scroll container. */\n    margin-block: 1px;\n    padding-inline: var(--trees-item-padding-x);\n    line-height: var(--trees-row-height);\n    color: var(--trees-search-fg);\n    background-color: var(--trees-search-bg);\n    border: 1px solid var(--trees-border-color);\n    border-radius: var(--trees-border-radius);\n    outline: none;\n\n    &::placeholder {\n      color: color-mix(\n        in lab,\n        var(--trees-search-fg) 65%,\n        var(--trees-search-bg)\n      );\n    }\n\n    &:focus-visible,\n    &[data-file-tree-search-input-fake-focus='true'] {\n      outline: var(--trees-focus-ring-width) solid var(--trees-focus-ring-color);\n      outline-offset: var(--trees-focus-ring-offset);\n    }\n  }\n\n  /* The wrapper for the tree items */\n  [role='tree'] {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    gap: var(--trees-gap-override, 0);\n  }\n\n  /* LIST ITEM */\n  [data-type='item'] {\n    color: inherit;\n    font-family: var(--trees-font-family);\n    font-size: var(--trees-font-size);\n    text-align: start;\n    outline: none;\n    background-color: var(--trees-bg);\n    border: none;\n    position: relative;\n\n    padding: 0 var(--trees-item-padding-x);\n    margin: 0 var(--trees-item-margin-x);\n    cursor: pointer;\n    -webkit-user-select: none;\n            user-select: none;\n    -webkit-touch-callout: none;\n    touch-action: manipulation;\n    display: flex;\n    flex: 0 0 var(--trees-row-height);\n    align-items: center;\n    height: var(--trees-row-height);\n    line-height: var(--trees-row-height);\n    gap: var(--trees-item-row-gap);\n    border-radius: var(--trees-border-radius);\n    /* Row states may be translucent, so markers paint the tree background first\n     * and then the state color on top to avoid compositing the same alpha twice. */\n    --truncate-marker-background-color: var(--trees-bg);\n    --truncate-marker-background-overlay-color: transparent;\n    --truncate-marker-block-inset: 0px;\n\n    &:hover,\n    &[data-item-context-hover='true'] {\n      background-color: var(--trees-bg-muted);\n      --truncate-marker-background-overlay-color: var(--trees-bg-muted);\n    }\n\n    &[data-item-focused='true'],\n    &:focus-visible {\n      z-index: 2;\n\n      /* Flattened segment markers sit high enough to cover the row outline unless\n       * their painted background is inset by the focus ring width. */\n      [data-item-flattened-subitems] {\n        --truncate-marker-block-inset: var(--trees-focus-ring-width);\n      }\n\n      &::before {\n        position: absolute;\n        inset: 0;\n        content: '';\n        display: block;\n        border-radius: var(--trees-border-radius);\n        outline: var(--trees-focus-ring-width) solid\n          var(--trees-focus-ring-color);\n        outline-offset: var(--trees-focus-ring-offset);\n        pointer-events: none;\n      }\n\n      &[data-item-selected='true']::before {\n        outline-color: var(--trees-selected-focused-border-color);\n      }\n    }\n\n    &[data-item-selected='true'] {\n      color: var(--trees-selected-fg);\n      background-color: var(--trees-selected-bg);\n      --truncate-marker-background-overlay-color: var(--trees-selected-bg);\n      z-index: 3;\n\n      [data-item-section='icon'] {\n        color: var(--trees-selected-fg);\n      }\n    }\n\n    &[data-item-search-match='true'] {\n      font-weight: var(--trees-search-font-weight);\n    }\n  }\n\n  [data-type='item'][data-file-tree-sticky-row='true'] {\n    pointer-events: auto;\n  }\n\n  /* Sticky rows opt back into pointer events because the overlay wrapper is\n   * inert. During scroll, put them back under the same hover suppression as\n   * the virtualized list so translucent hover states and menu triggers do not\n   * paint over rows moving beneath the sticky stack. */\n  [data-file-tree-virtualized-root='true'][data-is-scrolling]\n    [data-type='item'][data-file-tree-sticky-row='true'] {\n    pointer-events: none;\n  }\n\n  [data-file-tree-virtualized-root='true'][data-is-scrolling]\n    [data-type='item'][data-file-tree-sticky-row='true']:hover:not(\n      [data-item-selected='true']\n    ),\n  [data-file-tree-virtualized-root='true'][data-is-scrolling]\n    [data-type='item'][data-file-tree-sticky-row='true'][data-item-context-hover='true']:not(\n      [data-item-selected='true']\n    ) {\n    background-color: var(--trees-bg);\n    --truncate-marker-background-overlay-color: transparent;\n  }\n\n  [data-item-selected='true']:has(+ [data-item-selected='true']) {\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0;\n  }\n\n  [data-item-selected='true'] + [data-item-selected='true'] {\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n  }\n\n  /* Flattened Directory Parts */\n  [data-item-flattened-subitems] {\n    display: inline-flex;\n    align-items: center;\n    gap: 2px;\n  }\n  [data-item-flattened-subitem]:hover,\n  [data-item-flattened-subitem-drag-target='true'] {\n    text-decoration: underline;\n  }\n\n  /* Icon for each item */\n  [data-item-section='icon'] {\n    flex-shrink: 0;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    color: var(--trees-fg-muted);\n    fill: currentColor;\n    width: var(--trees-icon-width);\n  }\n\n  :where([data-item-section='icon'] > [data-icon-token]) {\n    color: var(--trees-fg-muted);\n  }\n\n  [data-file-tree-colored-icons='true'] {\n    [data-icon-token='astro'] {\n      color: var(--trees-file-icon-color-astro);\n    }\n    [data-icon-token='babel'] {\n      color: var(--trees-file-icon-color-babel);\n    }\n    [data-icon-token='bash'] {\n      color: var(--trees-file-icon-color-bash);\n    }\n    [data-icon-token='biome'] {\n      color: var(--trees-file-icon-color-biome);\n    }\n    [data-icon-token='bootstrap'] {\n      color: var(--trees-file-icon-color-bootstrap);\n    }\n    [data-icon-token='browserslist'] {\n      color: var(--trees-file-icon-color-browserslist);\n    }\n    [data-icon-token='bun'] {\n      color: var(--trees-file-icon-color-bun);\n    }\n    [data-icon-token='c'] {\n      color: var(--trees-file-icon-color-c);\n    }\n    [data-icon-token='cpp'] {\n      color: var(--trees-file-icon-color-cpp);\n    }\n    [data-icon-token='claude'] {\n      color: var(--trees-file-icon-color-claude);\n    }\n    [data-icon-token='css'] {\n      color: var(--trees-file-icon-color-css);\n    }\n    [data-icon-token='database'] {\n      color: var(--trees-file-icon-color-database);\n    }\n    [data-icon-token='default'] {\n      color: var(--trees-file-icon-color-default);\n    }\n    [data-icon-token='docker'] {\n      color: var(--trees-file-icon-color-docker);\n    }\n    [data-icon-token='eslint'] {\n      color: var(--trees-file-icon-color-eslint);\n    }\n    [data-icon-token='git'] {\n      color: var(--trees-file-icon-color-git);\n    }\n    [data-icon-token='go'] {\n      color: var(--trees-file-icon-color-go);\n    }\n    [data-icon-token='graphql'] {\n      color: var(--trees-file-icon-color-graphql);\n    }\n    [data-icon-token='html'] {\n      color: var(--trees-file-icon-color-html);\n    }\n    [data-icon-token='image'] {\n      color: var(--trees-file-icon-color-image);\n    }\n    [data-icon-token='javascript'] {\n      color: var(--trees-file-icon-color-javascript);\n    }\n    [data-icon-token='json'] {\n      color: var(--trees-file-icon-color-json);\n    }\n    [data-icon-token='markdown'] {\n      color: var(--trees-file-icon-color-markdown);\n    }\n    [data-icon-token='mcp'] {\n      color: var(--trees-file-icon-color-mcp);\n    }\n    [data-icon-token='npm'] {\n      color: var(--trees-file-icon-color-npm);\n    }\n    [data-icon-token='oxc'] {\n      color: var(--trees-file-icon-color-oxc);\n    }\n    [data-icon-token='postcss'] {\n      color: var(--trees-file-icon-color-postcss);\n    }\n    [data-icon-token='prettier'] {\n      color: var(--trees-file-icon-color-prettier);\n    }\n    [data-icon-token='python'] {\n      color: var(--trees-file-icon-color-python);\n    }\n    [data-icon-token='react'] {\n      color: var(--trees-file-icon-color-react);\n    }\n    [data-icon-token='ruby'] {\n      color: var(--trees-file-icon-color-ruby);\n    }\n    [data-icon-token='rust'] {\n      color: var(--trees-file-icon-color-rust);\n    }\n    [data-icon-token='sass'] {\n      color: var(--trees-file-icon-color-sass);\n    }\n    [data-icon-token='svg'] {\n      color: var(--trees-file-icon-color-svg);\n    }\n    [data-icon-token='svelte'] {\n      color: var(--trees-file-icon-color-svelte);\n    }\n    [data-icon-token='svgo'] {\n      color: var(--trees-file-icon-color-svgo);\n    }\n    [data-icon-token='swift'] {\n      color: var(--trees-file-icon-color-swift);\n    }\n    [data-icon-token='table'] {\n      color: var(--trees-file-icon-color-table);\n    }\n    [data-icon-token='text'] {\n      color: var(--trees-file-icon-color-text);\n    }\n    [data-icon-token='tailwind'] {\n      color: var(--trees-file-icon-color-tailwind);\n    }\n    [data-icon-token='terraform'] {\n      color: var(--trees-file-icon-color-terraform);\n    }\n    [data-icon-token='typescript'] {\n      color: var(--trees-file-icon-color-typescript);\n    }\n    [data-icon-token='vite'] {\n      color: var(--trees-file-icon-color-vite);\n    }\n    [data-icon-token='vscode'] {\n      color: var(--trees-file-icon-color-vscode);\n    }\n    [data-icon-token='vue'] {\n      color: var(--trees-file-icon-color-vue);\n    }\n    [data-icon-token='wasm'] {\n      color: var(--trees-file-icon-color-wasm);\n    }\n    [data-icon-token='webpack'] {\n      color: var(--trees-file-icon-color-webpack);\n    }\n    [data-icon-token='yml'] {\n      color: var(--trees-file-icon-color-yml);\n    }\n    [data-icon-token='zig'] {\n      color: var(--trees-file-icon-color-zig);\n    }\n    [data-icon-token='zip'] {\n      color: var(--trees-file-icon-color-zip);\n    }\n  }\n\n  /* Chevron rotation and visual alignment */\n  /* Chevron pointing down */\n  [data-icon-name='file-tree-icon-chevron'] {\n    &[data-align-capitals='false'] {\n      transform: translate(0, var(--trees-icon-nudge));\n    }\n    &[data-align-capitals='true'] {\n      transform: translate(0, 0);\n    }\n  }\n\n  [data-item-section='content'] {\n    flex: 0 1 auto;\n    text-align: start;\n    min-width: 0;\n    max-width: 100%;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    /* Breaks middle truncate component to also set this */\n    /* white-space: nowrap; */\n  }\n\n  [data-item-section='decoration'] {\n    flex: 1 1 0;\n    min-width: 0;\n    display: flex;\n    justify-content: flex-end;\n    text-align: end;\n    overflow: hidden;\n    color: var(--trees-fg-muted);\n  }\n\n  [data-item-section='decoration'] > span {\n    min-width: 0;\n    max-width: 100%;\n    display: inline-flex;\n    align-items: center;\n    justify-content: flex-end;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n\n  [data-item-section='git'],\n  [data-item-section='action'] {\n    flex: 0 0 auto;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n\n  [data-item-section='git'] {\n    width: var(--trees-git-lane-width);\n  }\n\n  [data-item-section='action'] {\n    width: var(--trees-action-lane-width);\n    color: var(--trees-fg-muted);\n    fill: currentColor;\n    pointer-events: none;\n  }\n\n  [data-item-section='git'] > span,\n  [data-item-section='action'] > span {\n    width: 100%;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n  }\n\n  [data-item-action-affordance='decorative'] {\n    opacity: 0.85;\n  }\n\n  [data-item-rename-input] {\n    appearance: none;\n    width: 100%;\n    min-width: 0;\n    height: calc(var(--trees-row-height) - 4px);\n    font-family: inherit;\n    font-size: inherit;\n    /* line-height: calc(var(--trees-row-height) - 8px); */\n    color: inherit;\n    background-color: transparent;\n    border: 0;\n    padding-inline: 6px;\n    outline: none;\n    box-sizing: border-box;\n  }\n\n  [data-item-section='content']:has([data-item-rename-input])\n    ~ [data-item-section='action'],\n  [data-item-section='content']:has([data-item-rename-input])\n    ~ [data-item-section='decoration'] {\n    display: none;\n  }\n\n  /* Chevron pointing right */\n  [aria-expanded='false'][data-item-type='folder']\n    > [data-item-section='icon']\n    > [data-icon-name='file-tree-icon-chevron'] {\n    &[data-align-capitals='true'] {\n      transform: rotate(-90deg)\n        translate(\n          calc(var(--trees-icon-nudge) / 2),\n          calc(var(--trees-icon-nudge) / 2)\n        );\n    }\n    &[data-align-capitals='false'] {\n      transform: rotate(-90deg)\n        translate(\n          calc(var(--trees-icon-nudge) / 2 * -1),\n          calc(var(--trees-icon-nudge) / 2)\n        );\n    }\n  }\n\n  /* LIST IDENTATION */\n  /* Spacing container */\n  [data-item-section='spacing'] {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: center;\n    height: var(--trees-row-height);\n    padding-left: calc(calc(var(--trees-icon-width) / 2) - 0.5px);\n\n    &:empty {\n      padding-left: 0;\n    }\n  }\n\n  /* Spacing per level */\n  [data-item-section='spacing-item'] {\n    transform: translateX(-0.25px);\n    display: inline-block;\n    border-left: 1px solid var(--trees-indent-guide-bg);\n    height: 100%;\n    margin-right: calc(var(--trees-level-gap) - 1px);\n    opacity: 0;\n    transition: opacity 150ms ease;\n\n    & + & {\n      margin-left: calc(\n        var(--trees-item-row-gap) + calc(var(--trees-icon-width) / 2) - 0.5px\n      );\n    }\n  }\n\n  :host(:hover) [data-item-section='spacing-item'] {\n    opacity: 0.75;\n  }\n\n  /* Git status indicator */\n\n  /* This is a folder that contains a git change */\n  [data-item-contains-git-change='true'] > [data-item-section='git'] {\n    color: var(--trees-git-modified-color);\n    opacity: 0.5;\n    fill: currentColor;\n  }\n\n  /* These are files that have a git change */\n  [data-item-git-status] {\n    &\n      > :where([data-item-section='icon'])\n      > :where(:not([data-icon-name='file-tree-icon-chevron'])) {\n      color: var(--trees-item-git-status-color);\n    }\n    & > [data-item-section='content'] {\n      color: var(--trees-item-git-status-color);\n    }\n    & > [data-item-section='git'] {\n      color: var(--trees-item-git-status-color);\n      font-weight: var(--trees-font-weight-semibold);\n    }\n  }\n\n  [data-item-git-status='added'] {\n    --trees-item-git-status-color: var(--trees-git-added-color);\n  }\n\n  [data-item-git-status='deleted'] {\n    --trees-item-git-status-color: var(--trees-git-deleted-color);\n  }\n\n  [data-item-git-status='ignored'] {\n    --trees-item-git-status-color: var(--trees-git-ignored-color);\n\n    & > [data-item-section='icon'] {\n      opacity: 0.5;\n    }\n  }\n\n  [data-item-section='git'] [data-icon-name='file-tree-icon-dot'] {\n    /* this is a nudge to align the dot with the likely lowercase text. it's slightly\n    generalizable, but other fonts are gonna need other nudges i assume */\n    transform: translateY(calc(0.65ex - 50%));\n  }\n\n  [data-item-git-status='modified'] {\n    --trees-item-git-status-color: var(--trees-git-modified-color);\n  }\n\n  [data-item-git-status='renamed'] {\n    --trees-item-git-status-color: var(--trees-git-renamed-color);\n  }\n\n  [data-item-git-status='untracked'] {\n    --trees-item-git-status-color: var(--trees-git-untracked-color);\n  }\n\n  /* Drag and drop */\n  [data-item-drag-target='true'] {\n    background-color: var(--trees-selected-bg);\n  }\n\n  [data-item-dragging='true'] {\n    opacity: 0.5;\n  }\n\n  /* Lock icon for locked paths (sibling of content) */\n  [data-item-section='lock'] {\n    flex: 0 0 auto;\n    margin-left: auto;\n    display: flex;\n    align-items: center;\n    color: var(--trees-fg-muted);\n  }\n  [data-item-section='lock'] svg {\n    display: block;\n  }\n\n  [data-type='header-slot'] {\n    display: block;\n    flex: 0 0 auto;\n  }\n\n  [data-type='context-menu-wash'] {\n    position: absolute;\n    inset: 0;\n    z-index: 3;\n    background-color: transparent;\n    touch-action: none;\n  }\n\n  [data-type='context-menu-anchor'] {\n    position: absolute;\n    top: 0;\n    right: var(--trees-context-menu-trigger-inline-offset);\n    z-index: 4;\n    display: none;\n    align-items: center;\n\n    &[data-visible='true'] {\n      display: flex;\n    }\n  }\n\n  /* Hide the floating trigger while the scroll container is actively moving.\n   * The anchor is positioned against the root, not the scroll content, so its\n   * `top` follows the row via a React state update — one frame behind the\n   * compositor. That delay is visible as the trigger hovering over the wrong\n   * row during the first frame of a scroll. The `data-is-scrolling` flag on\n   * the root is flipped synchronously on `wheel`/`touchmove`/`keydown` before\n   * the compositor commits the next paint, so this selector hides the anchor\n   * in the same frame the scroll begins. */\n  [data-file-tree-virtualized-root='true'][data-is-scrolling]\n    [data-type='context-menu-anchor'] {\n    display: none;\n  }\n\n  [data-type='context-menu-anchor'] > slot[name='context-menu'] {\n    display: block;\n    width: 0;\n    min-width: 0;\n    flex: 0 0 0;\n    overflow: visible;\n  }\n\n  /* Single floating context menu trigger */\n  [data-type='context-menu-trigger'] {\n    all: unset;\n    align-items: center;\n    justify-content: center;\n    width: var(--trees-action-lane-width);\n    color: var(--trees-fg-muted);\n    fill: currentColor;\n    cursor: pointer;\n    font-family: var(--trees-font-family);\n    font-size: var(--trees-font-size);\n    border-top-right-radius: var(--trees-border-radius);\n    border-bottom-right-radius: var(--trees-border-radius);\n    margin: var(--trees-focus-ring-width);\n    height: calc(var(--trees-row-height) - var(--trees-focus-ring-width) * 2);\n    border-width: 0;\n    transition: color 120ms ease;\n\n    display: flex;\n  }\n\n  [data-type='context-menu-trigger']:hover,\n  [data-type='context-menu-trigger'][aria-expanded='true'] {\n    color: var(--trees-fg);\n  }\n\n  /** @pierre/truncate css here, manually copy pasted for now */\n  [data-truncate-container] {\n    /* CUSTOM TO TREES, TO SUPPORT THE OUTLINE */\n    margin-top: -1px;\n    margin-bottom: -1px;\n\n    /* Width of the fade from default marker to text */\n    --truncate-internal-marker-fade-width: var(\n      --truncate-marker-fade-width,\n      2px\n    );\n    /* Width of the solid color between the fade from the default marker to the text */\n    --truncate-internal-marker-gap: var(--truncate-marker-gap, 0px);\n    /* Opacity of the marker 'color' property, not of the element itself */\n    --truncate-internal-marker-opacity: var(--truncate-marker-opacity, 50%);\n    /* Opacity of the marker 'color' property specifically for the middle truncate, not opacity of the element itself */\n    --truncate-internal-middle-marker-opacity: var(\n      --truncate-middle-marker-opacity,\n      80%\n    );\n    /* Background color of the default marker */\n    --truncate-internal-marker-background-color: var(\n      --truncate-marker-background-color,\n      light-dark(white, black)\n    );\n    --truncate-internal-marker-background-overlay-color: var(\n      --truncate-marker-background-overlay-color,\n      transparent\n    );\n    --truncate-internal-marker-block-inset: var(\n      --truncate-marker-block-inset,\n      0px\n    );\n    /* Duration of the fade out animation for the marker */\n    --truncate-internal-marker-fade-out-duration: var(\n      --truncate-marker-fade-out-duration,\n      0ms\n    );\n    /* Duration of the fade in animation for the marker */\n    --truncate-internal-marker-fade-in-duration: var(\n      --truncate-marker-fade-in-duration,\n      100ms\n    );\n\n    /* FADE Variant specifics */\n    --truncate-internal-fade-marker-color: var(\n      --truncate-fade-marker-color,\n      #000\n    );\n    --truncate-internal-fade-marker-width: var(\n      --truncate-fade-marker-width,\n      0.2lh\n    );\n\n    /*\n    In some special cases people might be adding spacing in other ways\n    that would benefit from being able to override this, however the container\n    query below can't use this and would need to be redeclared with the overridden\n    value. It's a bad time, but better than nothing.\n    */\n    --truncate-internal-single-line-height: 1lh;\n\n    height: var(--truncate-internal-single-line-height);\n    min-width: 0;\n    overflow: hidden;\n  }\n\n  [data-truncate-marker] {\n    display: flex;\n    position: absolute;\n    height: var(--truncate-internal-single-line-height);\n    padding-block: var(--truncate-internal-marker-block-inset);\n    box-sizing: border-box;\n    align-items: center;\n    background-clip: content-box;\n    z-index: 2;\n    color: color-mix(\n      in srgb,\n      currentColor var(--truncate-internal-marker-opacity),\n      transparent\n    );\n\n    /* Core trick for hiding the marker until overflow occurs */\n    opacity: 0;\n    transition: opacity var(--truncate-internal-marker-fade-out-duration)\n      ease-in-out;\n  }\n\n  @container measure (height > 1lh) {\n    [data-truncate-marker] {\n      opacity: 1;\n      transition: opacity var(--truncate-internal-marker-fade-in-duration)\n        ease-in-out;\n    }\n  }\n\n  [data-truncate-grid] {\n    display: grid;\n    position: relative;\n  }\n\n  [data-truncate-content='visible'] {\n    white-space: nowrap;\n  }\n\n  [data-truncate-content='overflow'] {\n    opacity: 0;\n    pointer-events: none;\n    -webkit-user-select: none;\n            user-select: none;\n    word-break: break-all;\n    margin-top: calc(-1 * var(--truncate-internal-single-line-height));\n  }\n\n  [data-truncate-marker-cell] {\n    container: measure / size;\n    overflow: visible;\n    -webkit-user-select: none;\n            user-select: none;\n    pointer-events: none;\n  }\n\n  [data-truncate-container='truncate'] {\n    & [data-truncate-grid] {\n      grid-template-columns: minmax(0, max-content) 0;\n    }\n    & [data-truncate-marker] {\n      right: 0;\n    }\n    & [data-truncate-fade] {\n      margin-right: calc(-2 * var(--truncate-internal-fade-marker-width));\n    }\n  }\n\n  [data-truncate-container='fruncate'] {\n    & [data-truncate-grid] {\n      grid-template-columns: 0 minmax(0, max-content) auto;\n    }\n    & [data-truncate-content] {\n      direction: rtl;\n    }\n    & [data-truncate-content] > span {\n      unicode-bidi: plaintext;\n    }\n    & [data-truncate-fade] {\n      margin-left: calc(-2 * var(--truncate-internal-fade-marker-width));\n    }\n  }\n\n  [data-truncate-variant='default'] {\n    & [data-truncate-marker] {\n      background-color: var(--truncate-internal-marker-background-color);\n      background-image: linear-gradient(\n        var(--truncate-internal-marker-background-overlay-color),\n        var(--truncate-internal-marker-background-overlay-color)\n      );\n    }\n    & [data-truncate-marker]::after,\n    & [data-truncate-marker]::before {\n      content: '';\n      position: absolute;\n      width: calc(\n        var(--truncate-internal-marker-fade-width) +\n          var(--truncate-internal-marker-gap)\n      );\n      inset-block-start: var(--truncate-internal-marker-block-inset);\n      height: max(\n        0px,\n        calc(\n          var(--truncate-internal-single-line-height) -\n            var(--truncate-internal-marker-block-inset) * 2\n        )\n      );\n      background-color: var(--truncate-internal-marker-background-color);\n      background-image: linear-gradient(\n        var(--truncate-internal-marker-background-overlay-color),\n        var(--truncate-internal-marker-background-overlay-color)\n      );\n      mask-image: linear-gradient(\n        var(--truncate-internal-fade-dir),\n        #000 0%,\n        #000 var(--truncate-internal-marker-gap),\n        transparent 100%\n      );\n    }\n    & [data-truncate-marker]::after {\n      --truncate-internal-fade-dir: to right;\n      right: calc(\n        -1 *\n          (\n            var(--truncate-internal-marker-fade-width) +\n              var(--truncate-internal-marker-gap)\n          )\n      );\n    }\n    & [data-truncate-marker]::before {\n      --truncate-internal-fade-dir: to left;\n      left: calc(\n        -1 *\n          (\n            var(--truncate-internal-marker-fade-width) +\n              var(--truncate-internal-marker-gap)\n          )\n      );\n    }\n  }\n\n  [data-truncate-variant='fade'] {\n    & [data-truncate-marker] {\n      background: transparent;\n    }\n  }\n\n  [data-truncate-fade] {\n    box-shadow:\n      0 0 calc(var(--truncate-internal-fade-marker-width) / 2)\n        var(--truncate-internal-fade-marker-color),\n      0 0 var(--truncate-internal-fade-marker-width)\n        var(--truncate-internal-fade-marker-color);\n    width: calc(var(--truncate-internal-fade-marker-width) * 2);\n    height: calc(\n      var(--truncate-internal-single-line-height) -\n        (var(--truncate-internal-fade-marker-width) * 2)\n    );\n    margin: var(--truncate-internal-fade-marker-width) 0;\n  }\n\n  [data-truncate-group-container='middle'] {\n    & [data-truncate-container] {\n      --truncate-marker-opacity: var(--truncate-internal-middle-marker-opacity);\n    }\n\n    display: flex;\n    min-width: 0;\n\n    & > div {\n      min-width: 0;\n    }\n\n    & > div[data-truncate-segment-priority='1'] {\n      flex: 0 1 max-content;\n    }\n    & > div[data-truncate-segment-priority='2'] {\n      flex: 0 999999 max-content;\n    }\n  }\n}\n";
const LAYER_ORDER = `@layer base, unsafe;`;
function wrapCoreCSS(coreCSS) {
  return `${LAYER_ORDER}
@layer base {
  ${coreCSS}
}`;
}
function wrapUnsafeCSS(unsafeCSS) {
  return `${LAYER_ORDER}
@layer unsafe {
  ${unsafeCSS}
}`;
}
const measuredGutterCache = /* @__PURE__ */ new WeakMap();
function measureScrollbarGutter(shadowRoot) {
  const cachedScrollbarGutter = measuredGutterCache.get(shadowRoot);
  if (cachedScrollbarGutter != null) return cachedScrollbarGutter;
  const wrapper = document.createElement("div");
  wrapper.setAttribute(FILE_TREE_SCROLLBAR_MEASURE_ATTRIBUTE, "true");
  const child = document.createElement("div");
  child.style.position = "relative";
  child.style.height = "200%";
  wrapper.appendChild(child);
  shadowRoot.appendChild(wrapper);
  const measuredGutter = Math.max(wrapper.offsetWidth - wrapper.clientWidth, 0);
  wrapper.remove();
  measuredGutterCache.set(shadowRoot, measuredGutter);
  return measuredGutter;
}
function ensureMeasuredScrollbarGutter(host, shadowRoot) {
  if (!host.isConnected) return;
  const measuredScrollbarGutter = measureScrollbarGutter(shadowRoot);
  if (measuredScrollbarGutter == null) return;
  const existing = shadowRoot.querySelector(`style[${FILE_TREE_SCROLLBAR_GUTTER_STYLE_ATTRIBUTE}]`);
  const styleEl = existing instanceof HTMLStyleElement ? existing : document.createElement("style");
  if (!(existing instanceof HTMLStyleElement)) {
    styleEl.setAttribute(FILE_TREE_SCROLLBAR_GUTTER_STYLE_ATTRIBUTE, "");
    shadowRoot.appendChild(styleEl);
  }
  styleEl.textContent = `:host { ${FILE_TREE_SCROLLBAR_GUTTER_MEASURED_PROPERTY}: ${measuredScrollbarGutter}px; }`;
}
let sheet;
function ensureFileTreeStyles(shadowRoot) {
  if (typeof CSSStyleSheet !== "undefined" && typeof CSSStyleSheet.prototype.replaceSync === "function" && "adoptedStyleSheets" in shadowRoot) {
    if (sheet == null) {
      sheet = new CSSStyleSheet();
      sheet.replaceSync(wrapCoreCSS(style_default));
    }
    let adopted = false;
    try {
      shadowRoot.adoptedStyleSheets = [sheet];
      adopted = true;
    } catch {
    }
    if (adopted) {
      shadowRoot.querySelector(`style[${FILE_TREE_STYLE_ATTRIBUTE}]`)?.remove();
      return;
    }
  }
  if (shadowRoot.querySelector(`style[${FILE_TREE_STYLE_ATTRIBUTE}]`) == null) {
    const styleEl = document.createElement("style");
    styleEl.setAttribute(FILE_TREE_STYLE_ATTRIBUTE, "");
    styleEl.textContent = wrapCoreCSS(style_default);
    shadowRoot.prepend(styleEl);
  }
}
function prepareFileTreeShadowRoot(host, shadowRoot) {
  adoptDeclarativeShadowDom(host, shadowRoot);
  ensureFileTreeStyles(shadowRoot);
  ensureMeasuredScrollbarGutter(host, shadowRoot);
}
function adoptDeclarativeShadowDom(host, shadowRoot) {
  const template2 = host.querySelector('template[shadowrootmode="open"], template[data-file-tree-shadowrootmode="open"]');
  if (!(template2 instanceof HTMLTemplateElement)) return;
  if (shadowRoot.childNodes.length > 0) return;
  shadowRoot.appendChild(template2.content.cloneNode(true));
  if (template2.hasAttribute("shadowrootmode")) template2.remove();
}
if (typeof HTMLElement !== "undefined" && customElements.get(FILE_TREE_TAG_NAME) == null) {
  class FileTreeContainer extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
      prepareFileTreeShadowRoot(this, shadowRoot);
    }
  }
  customElements.define(FILE_TREE_TAG_NAME, FileTreeContainer);
  if (typeof document !== "undefined") for (const el of Array.from(document.querySelectorAll(FILE_TREE_TAG_NAME))) {
    if (!(el instanceof HTMLElement)) continue;
    prepareFileTreeShadowRoot(el, el.shadowRoot ?? el.attachShadow({ mode: "open" }));
  }
}
const FileTreeContainerLoaded = true;
const MINIMAL_SVG_SPRITE_SHEET = `<svg data-icon-sprite aria-hidden="true" width="0" height="0">
  <symbol id="file-tree-icon-chevron" viewBox="0 0 16 16">
    <path d="M12.4697 5.46973C12.7626 5.17684 13.2374 5.17684 13.5303 5.46973C13.8232 5.76262 13.8232 6.23738 13.5303 6.53028L8.53028 11.5303C8.23738 11.8232 7.76262 11.8232 7.46973 11.5303L2.46973 6.53028C2.17684 6.23738 2.17684 5.76262 2.46973 5.46973C2.76262 5.17684 3.23738 5.17684 3.53028 5.46973L8 9.93946L12.4697 5.46973Z" fill="currentcolor"/>
  </symbol>
  <symbol id="file-tree-icon-dot" viewBox="0 0 6 6">
    <circle cx="3" cy="3" r="3" />
  </symbol>
  <symbol id="file-tree-icon-file" viewBox="0 0 16 16">
    <path fill="currentColor" d="M8 1v3a3 3 0 0 0 3 3h3v5.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 12.5v-9A2.5 2.5 0 0 1 4.5 1z" class="bg" opacity=".5"/>
    <path fill="currentColor" d="M9.5 1a.5.5 0 0 1 .354.146l4 4A.5.5 0 0 1 14 5.5V6h-3a2 2 0 0 1-2-2V1z" class="fg"/>
  </symbol>
  <symbol id="file-tree-icon-lock" viewBox="0 0 16 16">
    <path fill="currentcolor" d="M4 5.336V4a4 4 0 1 1 8 0v1.336c1.586.54 2 1.843 2 4.664v1c0 4.118-.883 5-5 5H7c-4.117 0-5-.883-5-5v-1c0-2.821.414-4.124 2-4.664M5.5 4v1.054Q6.166 4.998 7 5h2q.834-.002 1.5.054V4a2.5 2.5 0 0 0-5 0m-2 6v1c0 .995.055 1.692.167 2.193.107.483.246.686.35.79s.307.243.79.35c.5.112 1.198.167 2.193.167h2c.995 0 1.692-.055 2.193-.166.483-.108.686-.247.79-.35.104-.105.243-.308.35-.791.112-.5.167-1.198.167-2.193v-1c0-.995-.055-1.692-.166-2.193-.108-.483-.247-.686-.35-.79-.105-.104-.308-.243-.791-.35C10.693 6.555 9.995 6.5 9 6.5H7c-.995 0-1.692.055-2.193.167-.483.107-.686.246-.79.35s-.243.307-.35.79C3.555 8.307 3.5 9.005 3.5 10" />
  </symbol>
  <symbol id="file-tree-icon-ellipsis" viewBox="0 0 16 16">
    <path d="M5 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M9.5 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M14 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
  </symbol>
</svg>`;
const sym_astro = `<symbol id="file-tree-builtin-astro" viewBox="0 0 16 16">
  <path fill="currentColor" d="M6.08 13.92c-.63-.57-.81-1.79-.55-2.67.45.56 1.08.73 1.73.83 1 .15 1.99.1 2.92-.37l.32-.19q.13.38.08.78a2.1 2.1 0 0 1-.9 1.5q-.3.24-.61.43c-.64.44-.81.95-.57 1.69l.02.08a1.7 1.7 0 0 1-.74-.64 2 2 0 0 1-.3-.98q0-.27-.02-.52-.07-.61-.61-.62a.7.7 0 0 0-.75.6z" class="bg" opacity=".6"/>
  <path fill="currentColor" d="M2.5 11.1s1.86-.9 3.72-.9l1.4-4.39c.05-.21.2-.36.38-.36s.33.15.38.36l1.4 4.38c2.2 0 3.72.92 3.72.92l-3.16-8.69q-.13-.4-.45-.42H6.11q-.3.02-.45.42z" class="fg"/>
</symbol>`;
const sym_babel = `<symbol id="file-tree-builtin-babel" viewBox="0 0 16 16">
  <path fill="currentColor" fill-rule="evenodd" d="M9.49.5q1.92.05 2.66.54 1.27.6 1.35 1.52v.23a4 4 0 0 1-.53 1.9l-1.38 1.24q-.74.38-.72.63c.77.82 1.33 1.29.85 2.42q-.47 1.1-2.04 2.28c-.5.32-1.88 1.35-2.96 1.86-1.64.77-3.1 1.4-4.65 1.89-.51.16-1.5.16-1.5.16L.5 15A76 76 0 0 0 5.76 3.49q-.1-.08-.1-.2.1 0 .32-.35l-.03-.09q-1.17.39-2.38 1.3l-.13.03q0-.1-.21-.16-.46.31-.82.7l-.13-.19.16-.06-.03-.16-.34.29L2 4.5q.36-.48.72-.54l.04-.1V3.8q.16 0 .15-.06l.13-.06a6 6 0 0 0 1.13-.9v-.03H4.1l-.12.07q0-.1-.1-.1l-.15.07-.04-.1q.93-.52 1.63-1.05Q7.89.65 9.5.5M8.46 7.83l-.32.04c-1.31.54-2.31.82-2.91.88a71 71 0 0 0-2.2 4.54h.07q.58-.04 3.04-1.42.13 0 1.66-1.05L9.18 9.7v.03q.45-.2.81-1.3v-.2q-.5-.46-1.53-.4m.28-5.75c-.5.1-.75.19-.72.38l-1.16 2.6q-.17.1-.34.95-.3.48-.25.77v.1l.22.05A15 15 0 0 1 8.86 6c1.1-.71 2.12-1.38 2.8-2.54q.24-.33.21-.54-.02-.33-.4-.54c-.54 0-1.07-.34-1.63-.28l-.94-.03z" clip-rule="evenodd"/>
</symbol>`;
const sym_bash = `<symbol id="file-tree-builtin-bash" viewBox="0 0 16 16">
  <path fill="currentColor" d="M8 1C2.24 1 1 2.24 1 8s1.24 7 7 7 7-1.24 7-7-1.24-7-7-7" class="bg" opacity=".2"/>
  <path fill="currentColor" d="M11.5 11a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1zM7 6.75C7 6.42 6.64 6 6 6s-1 .42-1 .75q-.01.25.22.41.26.21.89.35.74.14 1.28.53c.37.29.61.7.61 1.21 0 .87-.68 1.5-1.5 1.7v.55a.5.5 0 0 1-1 0v-.56c-.82-.18-1.5-.82-1.5-1.69a.5.5 0 0 1 1 0c0 .33.36.75 1 .75s1-.42 1-.75q.01-.25-.22-.41a2 2 0 0 0-.89-.35q-.74-.14-1.28-.53A1.5 1.5 0 0 1 4 6.75c0-.87.68-1.5 1.5-1.7V4.5a.5.5 0 0 1 1 0v.56c.82.18 1.5.82 1.5 1.69a.5.5 0 0 1-1 0" class="fg-stroke"/>
</symbol>`;
const sym_biome = `<symbol id="file-tree-builtin-biome" viewBox="0 0 16 16">
  <path fill="currentColor" d="M8 2 4.88 7.35a7 7 0 0 1 3.7-.13l1.04.25-.99 4.16-1.05-.25a2.7 2.7 0 0 0-3.07 1.45l-.98-.47a4 4 0 0 1 1.07-1.31 3.8 3.8 0 0 1 3.23-.71l.5-2.08a6 6 0 0 0-5.07 1.12A5.9 5.9 0 0 0 1 14h14z"/>
</symbol>`;
const sym_bootstrap = `<symbol id="file-tree-builtin-bootstrap" viewBox="0 0 16 16">
  <path fill="currentColor" fill-rule="evenodd" d="M11.72 1.5A2.5 2.5 0 0 1 14.2 4q.02 1.08.3 2.09c.22.73.56 1.24 1.08 1.45.22.08.4.27.4.5s-.18.43-.4.51q-.76.34-1.08 1.45c-.2.65-.27 1.32-.3 2a2.5 2.5 0 0 1-2.48 2.5H4.25A2.6 2.6 0 0 1 1.7 12c-.04-.85-.1-1.68-.22-2.04C1.26 9.23.92 8.7.4 8.5.18 8.42 0 8.23 0 8s.18-.42.4-.5q.77-.35 1.09-1.46c.1-.36.17-1.19.2-2.04a2.6 2.6 0 0 1 2.56-2.5z" class="bg" clip-rule="evenodd" opacity=".2"/>
  <path fill="currentColor" fill-rule="evenodd" d="M8.47 4.54c1.23 0 2.04.68 2.04 1.73 0 .73-.55 1.39-1.24 1.5v.04c.94.1 1.58.77 1.58 1.7 0 1.2-.9 1.95-2.37 1.95H5.97a.3.3 0 0 1-.2-.08.3.3 0 0 1-.08-.2V4.82a.3.3 0 0 1 .08-.2.3.3 0 0 1 .2-.08zm-1.7 6.04h1.49q1.47-.01 1.49-1.15Q9.74 8.31 8.2 8.3H6.77zm0-5.16v2.06h1.21c.93 0 1.45-.38 1.45-1.06 0-.65-.44-1-1.22-1z" class="fg" clip-rule="evenodd"/>
</symbol>`;
const sym_browserslist = `<symbol id="file-tree-builtin-browserslist" viewBox="0 0 16 16">
  <path fill="currentColor" d="M8.88 6.96c0 3.82 3.72 4.7 5.7 3.74-.23.9-1.04 1.67-2.35 1.93-.02.4.42 1.28.82 1.63-.9.35-1.94-.12-2.51-.48a5 5 0 0 0-.32 1.87c-.68 0-1.57-1-1.8-1.37-.3.18-.85 1.15-.96 1.72a2.4 2.4 0 0 1-.81-.86 2.4 2.4 0 0 1-.3-1.15c-.38.27-1.48.95-1.99 1.18-.25-.58-.15-1.3 0-2.06-.21.12-1.8.27-2.43.12.32-.36.75-1.19.94-1.57A4.5 4.5 0 0 1 .44 10.6c.48-.22.97-.53 1.49-1.06C1.26 9.17.24 8.64 0 7.7a6 6 0 0 0 1.79-.32C1.28 7.08.44 6.15.6 5.01c.42.21 1.3.37 1.73.3a3.4 3.4 0 0 1-.25-2.75 5 5 0 0 0 1.48 1c-.08-.8.3-2.31.8-2.71.2.46.73 1.21 1.08 1.4.09-.61.87-2.06 1.57-2.25 0 .5.27 1.4.5 1.67.51-.54 2.25-1.44 3.64-1.13-.43.45-.75.61-.86.98 1.05 0 2.78.34 4.27 1.93-2.34-.89-5.69.56-5.69 3.5" class="bg" opacity=".5"/>
  <path fill="currentColor" d="M11.21 3.59a4.1 4.1 0 0 0 2.47 2.89c.24-.22.61-.38.95-.19.76.44.2 1.26-.34 1.66l-.07.06a13 13 0 0 1-4.49 1.61l-.3-.43a10.5 10.5 0 0 0 4.13-1.31 1 1 0 0 0 .23-.25.5.5 0 0 0-.21-.69l-.15-.06a4.5 4.5 0 0 1-1.77-1.31 4.5 4.5 0 0 1-.88-1.77q.2-.12.43-.21"/>
  <path fill="currentColor" d="M10.36 5.18a.4.4 0 0 0-.03.38c.09.2.3.3.46.23s.24-.3.15-.5l-.01-.02q.23.13.34.39a.83.83 0 0 1-.43 1.08.8.8 0 0 1-1.08-.43.83.83 0 0 1 .6-1.13"/>
</symbol>`;
const sym_bun = `<symbol id="file-tree-builtin-bun" viewBox="0 0 16 16">
  <path fill="currentColor" d="M8 14c3.87 0 7-2.46 7-5.49 0-1.88-1.2-3.53-3.04-4.52q-1.1-.61-1.84-1.07C9.2 2.35 8.64 2 8 2s-1.36.45-2.31 1.03A29 29 0 0 1 4.04 4C2.2 4.98 1 6.63 1 8.51 1 11.54 4.13 14 8 14M7.18 3.88q.3-.66.3-1.37c0-.08.11-.1.13-.01.38 1.57-.53 2.35-1.2 2.61-.08.03-.12-.07-.06-.12a3 3 0 0 0 .83-1.12m1.2-.05a3 3 0 0 0-.45-1.3V2.5c-.04-.07.05-.15.1-.1 1.15 1.2.77 2.3.33 2.87-.05.05-.13 0-.11-.08q.21-.67.13-1.37m1.04-.32a3 3 0 0 0-.94-1.02v-.01c-.06-.05-.01-.16.07-.12 1.51.61 1.61 1.8 1.43 2.5l-.03.03a.07.07 0 0 1-.1-.06 3 3 0 0 0-.43-1.32m-2.97.32c-.36.3-.74.43-1.2.56q-.11 0-.1-.1a3.5 3.5 0 0 0 1.76-1.57s.09-.07.1.04c0 .18-.2.76-.56 1.07m2.89 6.36q-.13.52-.55.88a1.3 1.3 0 0 1-.75.35 1.3 1.3 0 0 1-.77-.35 1.7 1.7 0 0 1-.54-.88.13.13 0 0 1 .15-.15h2.31a.14.14 0 0 1 .15.15M6.15 8.95a1.1 1.1 0 0 1-1.39-.14A1.1 1.1 0 0 1 5.12 7a1.1 1.1 0 0 1 1.2.25 1.1 1.1 0 0 1-.17 1.69m4.96 0a1.1 1.1 0 0 1-1.4-.14 1.1 1.1 0 0 1 .37-1.8 1.1 1.1 0 0 1 1.2.25 1.1 1.1 0 0 1 .24 1.2 1 1 0 0 1-.41.5"/>
</symbol>`;
const sym_c = `<symbol id="file-tree-builtin-c" viewBox="0 0 16 16">
  <path fill="currentColor" fill-rule="evenodd" d="M8 1q.084 0 .166.021.098.023.186.075c1.055.624 4.22 2.486 5.277 3.11.085.05.15.112.209.192h-.002l.028.037a.5.5 0 0 1 .103.21q.031.102.033.21v6.29a.71.71 0 0 1-.347.616l-5.307 3.144a.68.68 0 0 1-.693 0l-5.307-3.144A.72.72 0 0 1 2 11.145V4.832a.71.71 0 0 1 .346-.612l5.288-3.126A.7.7 0 0 1 7.992 1zm2.901 4.349a3.75 3.75 0 1 0 0 5.302l-1.06-1.06a2.25 2.25 0 1 1 0-3.182z" clip-rule="evenodd"/>
</symbol>`;
const sym_claude = `<symbol id="file-tree-builtin-claude" viewBox="0 0 16 16">
  <path fill="currentColor" d="M3.75 10.31 6.5 8.77l.04-.14-.04-.07h-.14l-.46-.03-1.57-.04-1.38-.07-1.33-.07-.34-.07L1 7.86l.03-.21.28-.18.4.03.89.07 1.33.08.97.06 1.43.16h.22l.03-.1-.07-.05-.06-.06-1.39-.92-1.48-.98-.79-.57-.42-.28-.2-.28-.1-.6.39-.41.52.04.12.03.52.4 1.12.86L6.2 6.04l.2.17.09-.06.01-.04-.1-.15-.76-1.46-.85-1.46-.37-.6-.1-.36a1 1 0 0 1-.06-.42l.42-.59.25-.07.6.08.22.2.36.84.58 1.3.9 1.77.29.53.14.47.04.14h.1v-.07l.07-1 .14-1.22.14-1.57.04-.45.23-.53.42-.28.36.15.28.41-.04.25-.16 1.08-.36 1.7-.21 1.14h.12l.14-.15.58-.76.97-1.2.42-.5.5-.51.32-.25h.6l.44.66-.2.68-.61.79-.52.65-.74 1-.45.8.04.05h.1l1.68-.36.9-.16 1.06-.18.5.23.05.22-.2.48-1.15.28-1.34.28-2 .46-.04.01.03.04.9.09.4.03h.94l1.77.14.46.28.27.37-.04.28-.72.37-.95-.23-2.24-.53-.76-.18h-.11v.06l.64.63L12 10.86l1.48 1.35.07.34-.18.28-.2-.03-1.29-.98-.5-.42-1.12-.95h-.07v.1l.25.38 1.37 2.05.07.63-.1.2-.36.14-.38-.08-.8-1.12-.85-1.26-.66-1.15-.07.05-.4 4.23-.19.21-.42.17-.35-.28-.2-.42.2-.87.23-1.12.18-.9.17-1.1.1-.36v-.03h-.1l-.84 1.16-1.27 1.72-1 1.07-.24.1-.42-.22.04-.39.22-.32 1.4-1.8.84-1.1.57-.64-.02-.07h-.04l-3.7 2.4-.66.09-.28-.28.03-.42.14-.14 1.12-.77z"/>
</symbol>`;
const sym_cpp = `<symbol id="file-tree-builtin-cpp" viewBox="0 0 16 16">
  <path fill="currentColor" fill-rule="evenodd" d="M8 1q.084 0 .166.021.098.023.186.075c1.055.624 4.22 2.486 5.277 3.11.085.05.15.112.209.192h-.002l.028.037a.5.5 0 0 1 .103.21q.031.102.033.21v6.29a.71.71 0 0 1-.347.616l-5.307 3.144a.68.68 0 0 1-.693 0l-5.307-3.144A.72.72 0 0 1 2 11.145V4.832a.71.71 0 0 1 .346-.612l5.288-3.126A.7.7 0 0 1 7.992 1zm2.901 4.349a3.75 3.75 0 1 0 0 5.302l-1.06-1.06a2.25 2.25 0 1 1 0-3.182z" clip-rule="evenodd"/>
</symbol>`;
const sym_css = `<symbol id="file-tree-builtin-css" viewBox="0 0 16 16">
  <path fill="currentColor" d="M8 15c-5.76 0-7-1.24-7-7V2a1 1 0 0 1 1-1h6c5.77 0 7 1.24 7 7s-1.24 7-7 7" class="vector" opacity=".2"/>
  <path fill="currentColor" d="M10.1 9.19h.73c.03.49.22.6 1 .6.76 0 .93-.12.93-.68 0-.52-.17-.67-.94-.85-1.38-.3-1.68-.56-1.68-1.47 0-1.05.3-1.29 1.67-1.29 1.29 0 1.57.2 1.6 1.13h-.74c-.01-.34-.17-.42-.85-.42-.77 0-.94.1-.94.58 0 .42.17.55.96.73 1.36.3 1.66.58 1.66 1.59 0 1.14-.31 1.39-1.73 1.39-1.39 0-1.69-.24-1.67-1.31m-3.9 0h.74c.03.49.21.6.99.6.76 0 .93-.12.93-.68 0-.52-.17-.67-.93-.85-1.39-.3-1.69-.56-1.69-1.47 0-1.05.3-1.29 1.67-1.29 1.3 0 1.58.2 1.6 1.13h-.73c-.02-.34-.18-.42-.85-.42-.78 0-.95.1-.95.58 0 .42.17.55.96.73 1.37.3 1.67.58 1.67 1.59 0 1.14-.32 1.39-1.74 1.39-1.38 0-1.68-.24-1.66-1.31m-1.22 0h.75c-.09 1.07-.37 1.31-1.56 1.31-1.37 0-1.68-.45-1.68-2.5 0-1.96.36-2.5 1.68-2.5 1.16 0 1.44.25 1.52 1.35h-.76c-.08-.52-.22-.64-.76-.64-.74 0-.9.33-.9 1.78 0 1.47.16 1.8.9 1.8.58 0 .74-.11.8-.6"/>
</symbol>`;
const sym_database = `<symbol id="file-tree-builtin-database" viewBox="0 0 16 16">
  <path fill="currentColor" d="M14.953 9.733a12.4 12.4 0 0 1-.244 1.936c-.207.933-.532 1.58-.996 2.044s-1.11.789-2.044.996C10.73 14.918 9.533 15 8 15s-2.73-.082-3.669-.291c-.933-.207-1.58-.532-2.044-.996s-.789-1.11-.996-2.044c-.122-.547-.2-1.182-.244-1.92q.23.364.532.667c.64.639 1.482 1.031 2.533 1.265 1.046.232 2.33.315 3.884.315 1.555 0 2.838-.083 3.884-.315 1.051-.234 1.893-.626 2.532-1.265a4 4 0 0 0 .541-.683"/>
  <path fill="currentColor" d="M14.93 5.924c-.046.663-.118 1.24-.23 1.743-.207.932-.532 1.579-.995 2.042s-1.11.789-2.042.996c-.938.209-2.135.291-3.667.291-1.531 0-2.729-.082-3.667-.29-.932-.208-1.579-.534-2.042-.997s-.789-1.11-.996-2.042a12 12 0 0 1-.227-1.683l.016-.188a4 4 0 0 0 .5.62c.638.639 1.48 1.031 2.532 1.265 1.046.232 2.33.315 3.884.315 1.555 0 2.838-.083 3.884-.315 1.051-.234 1.893-.626 2.532-1.265.192-.192.357-.404.506-.633z"/>
  <path fill="currentColor" d="M8 1c1.533 0 2.73.082 3.669.291.933.207 1.58.533 2.044.996.403.404.904.944.91 1.695.004.764-.509 1.318-.918 1.727-.463.463-1.11.789-2.042.996-.938.209-2.135.291-3.667.291-1.531 0-2.729-.082-3.667-.29-.932-.208-1.579-.534-2.042-.997-.406-.406-.915-.953-.915-1.71 0-.758.509-1.305.915-1.712.464-.463 1.11-.789 2.044-.996C5.27 1.082 6.467 1 8 1"/>
</symbol>`;
const sym_default = `<symbol id="file-tree-builtin-default" viewBox="0 0 16 16">
  <path fill="currentColor" d="M8 1v3a3 3 0 0 0 3 3h3v5.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 12.5v-9A2.5 2.5 0 0 1 4.5 1z" class="bg" opacity=".4"/>
  <path fill="currentColor" d="M9.5 1a.5.5 0 0 1 .354.146l4 4A.5.5 0 0 1 14 5.5V6h-3a2 2 0 0 1-2-2V1z" class="fg"/>
</symbol>`;
const sym_docker = `<symbol id="file-tree-builtin-docker" viewBox="0 0 16 16">
  <path fill="currentColor" d="M15.85 6.54c-.05-.04-.45-.36-1.31-.36q-.34 0-.68.06a2.7 2.7 0 0 0-1.14-1.79l-.23-.14-.15.23a3 3 0 0 0-.4 1q-.24 1.01.26 1.84c-.4.24-1.03.3-1.17.3H.5a.5.5 0 0 0-.5.52q-.01 1.46.46 2.83.55 1.5 1.6 2.18c.79.5 2.08.79 3.54.79q.96 0 1.94-.18a8 8 0 0 0 2.55-.97 7 7 0 0 0 1.73-1.5 10 10 0 0 0 1.7-3.06h.15a2.4 2.4 0 0 0 1.8-.7 2 2 0 0 0 .47-.74l.06-.2z"/>
  <path fill="currentColor" d="M1.48 7.36h1.4a.14.14 0 0 0 .14-.13V5.91q-.01-.12-.13-.14H1.48a.13.13 0 0 0-.13.14v1.32q.02.13.13.13m1.94 0h1.41a.14.14 0 0 0 .13-.13V5.91q-.01-.12-.13-.14h-1.4a.13.13 0 0 0-.13.14v1.32q0 .13.12.13m1.98 0h1.4q.13 0 .14-.13V5.91a.13.13 0 0 0-.14-.14H5.4q-.1.01-.12.14v1.32q0 .13.12.13m1.95 0h1.42q.1 0 .12-.13V5.91q0-.12-.12-.14H7.35q-.1.01-.12.14v1.32q.01.13.12.13M3.42 5.5h1.41c.07 0 .13-.08.13-.15V4.03a.13.13 0 0 0-.13-.14h-1.4q-.12 0-.13.14v1.31q0 .13.12.15m1.98 0h1.4c.08 0 .14-.08.14-.15V4.03q0-.13-.14-.14H5.4q-.1 0-.12.14v1.31q0 .13.12.15m1.95 0h1.42c.06 0 .12-.08.12-.15V4.03q-.01-.13-.12-.14H7.35q-.1 0-.12.14v1.31q.01.13.12.15m0-1.9h1.42q.1-.02.12-.14v-1.3Q8.88 2 8.77 2H7.35q-.1 0-.12.14v1.3q.01.13.12.14m1.97 3.78h1.4a.13.13 0 0 0 .14-.13V5.91q-.01-.12-.13-.14H9.32q-.1.01-.12.14v1.32q.01.13.12.13" opacity=".5"/>
</symbol>`;
const sym_eslint = `<symbol id="file-tree-builtin-eslint" viewBox="0 0 16 16">
  <path fill="currentColor" d="M11.16 6.1 8.12 4.35a.3.3 0 0 0-.24 0L4.84 6.1a.3.3 0 0 0-.12.2v3.5q0 .14.12.22l3.04 1.74q.12.08.24 0l3.04-1.74a.2.2 0 0 0 .13-.22V6.3a.3.3 0 0 0-.13-.2" opacity=".5"/>
  <path fill="currentColor" d="m.1 7.69 3.63-6.3A.8.8 0 0 1 4.37 1h7.26c.26 0 .5.17.64.4l3.63 6.27a.8.8 0 0 1 0 .75l-3.63 6.24a.7.7 0 0 1-.64.34H4.37a.7.7 0 0 1-.64-.34L.1 8.41a.7.7 0 0 1 0-.72m3 3.02q.01.15.14.23l4.63 2.66q.13.06.26 0l4.63-2.66a.3.3 0 0 0 .14-.23V5.4a.3.3 0 0 0-.14-.23L8.13 2.52a.3.3 0 0 0-.26 0L3.24 5.17a.3.3 0 0 0-.14.23z"/>
</symbol>`;
const sym_font = `<symbol id="file-tree-builtin-font" viewBox="0 0 16 16">
  <path fill="currentColor" d="M12.3 13c-1.59 0-2.68-.99-2.68-2.5 0-1.43 1-2.34 2.88-2.35h2.16v-.83c0-1.08-.62-1.68-1.73-1.68-1.05 0-1.66.54-1.73 1.36H9.93c.09-1.43 1.06-2.48 3.05-2.48 1.75 0 3.02.95 3.02 2.68v5.66h-1.29v-1.02h-.04c-.41.66-1.16 1.16-2.37 1.16m.36-1.12c1.14 0 2-.72 2-1.74v-.96H12.6c-1.12 0-1.6.54-1.6 1.28 0 .97.8 1.42 1.66 1.42m-11.24.98H0L3.8 2h1.39l3.8 10.86H7.54l-1.08-3.2H2.5zm3.09-9.25h-.04l-1.6 4.95H6.1z"/>
</symbol>`;
const sym_git = `<symbol id="file-tree-builtin-git" viewBox="0 0 16 16">
  <path fill="currentColor" d="M14.74 7.38 8.62 1.26a.9.9 0 0 0-1.27 0L6.08 2.53l1.61 1.61a1.07 1.07 0 0 1 1.36 1.37l1.55 1.55a1.07 1.07 0 0 1 1.1 1.77 1.07 1.07 0 0 1-1.74-1.16L8.5 6.22v3.8a1.07 1.07 0 1 1-.89-.02V6.15a1.07 1.07 0 0 1-.58-1.4l-1.58-1.6-4.2 4.2a.9.9 0 0 0 0 1.27l6.12 6.12a.9.9 0 0 0 1.27 0l6.09-6.09a.9.9 0 0 0 0-1.27"/>
</symbol>`;
const sym_go = `<symbol id="file-tree-builtin-go" viewBox="0 0 16 16">
  <path fill="currentColor" fill-rule="evenodd" d="M4.41 4.57A3.2 3.2 0 0 1 6.87 5q.74.49 1.08 1.29.08.12-.1.16l-1.55.4c-.14.03-.15.04-.27-.1a1 1 0 0 0-.44-.34 1.6 1.6 0 0 0-1.68.14q-.95.61-.94 1.73c0 .73.52 1.33 1.25 1.43q.95.1 1.58-.6l.25-.34h-1.8c-.19 0-.24-.12-.17-.27.12-.28.34-.76.47-1a.3.3 0 0 1 .24-.14h2.98a4 4 0 0 1 .64-1.19 4 4 0 0 1 2.6-1.52 3.5 3.5 0 0 1 2.64.46q1.13.73 1.31 2.04a3.5 3.5 0 0 1-1.06 3.09q-.93.92-2.23 1.17l-.74.08a3.5 3.5 0 0 1-2.27-.8 3 3 0 0 1-.93-1.42 4 4 0 0 1-.39.61 4 4 0 0 1-2.64 1.56 3.3 3.3 0 0 1-2.5-.6 3 3 0 0 1-1.18-2.03 3.5 3.5 0 0 1 .8-2.67 4 4 0 0 1 2.6-1.58M13.1 7.5a1.53 1.53 0 0 0-1.9-1.21q-1.3.3-1.62 1.59a1.5 1.5 0 0 0 .85 1.72q.77.33 1.52-.05a2 2 0 0 0 1.18-1.74q0-.17-.03-.3" clip-rule="evenodd"/>
</symbol>`;
const sym_graphql = `<symbol id="file-tree-builtin-graphql" viewBox="0 0 16 16">
  <path fill="currentColor" fill-rule="evenodd" d="M8 1a1.25 1.25 0 0 1 1.18 1.65l2.8 1.61q.33-.25.77-.26a1.25 1.25 0 0 1 .48 2.4v3.2a1.25 1.25 0 1 1-1.25 2.13l-2.8 1.62A1.25 1.25 0 0 1 8 15a1.25 1.25 0 0 1-1.18-1.65l-2.8-1.62q-.33.26-.77.27a1.25 1.25 0 0 1-.48-2.4V6.4a1.25 1.25 0 1 1 1.25-2.14l2.8-1.61A1.25 1.25 0 0 1 8 1M4.44 11.14l-.06.13 2.75 1.58a1.25 1.25 0 0 1 1.74 0l2.74-1.58-.05-.13zm3.89-7.68a1.3 1.3 0 0 1-.66 0L4.03 9.77q.37.3.45.78h7.04q.08-.48.45-.78zM4.38 4.73a1.24 1.24 0 0 1-1.02 1.76v3.02l.13.01 3.67-6.35-.03-.02zm4.46-1.56 3.67 6.35.13-.01V6.49a1.25 1.25 0 0 1-1.03-1.76L8.87 3.15z" clip-rule="evenodd"/>
</symbol>`;
const sym_html = `<symbol id="file-tree-builtin-html" viewBox="0 0 16 16">
  <path fill="currentColor" d="M8 1C2.24 1 1 2.24 1 8s1.24 7 7 7 7-1.24 7-7-1.24-7-7-7" class="bg" opacity=".2"/>
  <path fill="currentColor" d="M10.48 3.76a.5.5 0 0 1 .4.58L10.6 5.8h1.14a.5.5 0 0 1 0 1h-1.32L10 9.2h1.08a.5.5 0 0 1 0 1H9.8l-.3 1.64a.5.5 0 1 1-.98-.18l.27-1.46H6.4l-.3 1.64a.5.5 0 1 1-.98-.18l.27-1.46H4.25a.5.5 0 0 1 0-1h1.32L6 6.8H4.93a.5.5 0 0 1 0-1H6.2l.3-1.64a.5.5 0 1 1 .98.18L7.2 5.8h2.4l.3-1.64a.5.5 0 0 1 .58-.4M6.58 9.2h2.4l.44-2.4h-2.4z" class="fg"/>
</symbol>`;
const sym_image = `<symbol id="file-tree-builtin-image" viewBox="0 0 16 16">
  <path fill="currentColor" d="M12.5 2A2.5 2.5 0 0 1 15 4.5v4.67l-4.05-3.54-4.08 4.08-3-2L1 10.6V4.5A2.5 2.5 0 0 1 3.5 2z" opacity=".3"/>
  <path fill="currentColor" d="M15 10.5v1a2.5 2.5 0 0 1-2.5 2.5h-9a2.5 2.5 0 0 1-2.46-2.04L4 9l3 2 4-4zm-7-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
</symbol>`;
const sym_javascript = `<symbol id="file-tree-builtin-javascript" viewBox="0 0 16 16">
  <path fill="currentColor" d="M8 1C2.24 1 1 2.24 1 8s1.24 7 7 7 7-1.24 7-7-1.24-7-7-7" class="bg" opacity=".2"/>
  <path fill="currentColor" d="M8.1 9.64h.95c.04.62.28.76 1.28.76s1.2-.14 1.2-.85c0-.66-.2-.85-1.2-1.07-1.79-.38-2.18-.7-2.18-1.86C8.15 5.3 8.54 5 10.31 5c1.67 0 2.04.26 2.07 1.42h-.95c-.02-.43-.23-.53-1.1-.53-1 0-1.22.14-1.22.74 0 .52.22.7 1.24.92 1.76.38 2.15.73 2.15 2 0 1.44-.4 1.75-2.24 1.75-1.8 0-2.18-.3-2.15-1.66M3.5 9.5h.98c0 .76.15.92.85.92.77 0 .94-.18.94-1.02V5.1h1v4.34c0 1.54-.35 1.87-1.92 1.87-1.55 0-1.89-.32-1.86-1.8"/>
</symbol>`;
const sym_json = `<symbol id="file-tree-builtin-json" viewBox="0 0 16 16">
  <path fill="currentColor" d="M13.25 11.5V9.75a.5.5 0 0 1 .36-.48l.55-.15a1.16 1.16 0 0 0 0-2.24l-.55-.15a.5.5 0 0 1-.36-.48V4.5a2.5 2.5 0 0 0-2.5-2.5h-.25a.5.5 0 0 0 0 1h.25a1.5 1.5 0 0 1 1.5 1.5v1.75a1.5 1.5 0 0 0 1.09 1.44l.54.15a.16.16 0 0 1 0 .32l-.54.15a1.5 1.5 0 0 0-1.09 1.44v1.75a1.5 1.5 0 0 1-1.5 1.5h-.25a.5.5 0 0 0 0 1h.25a2.5 2.5 0 0 0 2.5-2.5m-10.5 0V9.75a.5.5 0 0 0-.36-.48l-.55-.15a1.16 1.16 0 0 1 0-2.24l.55-.15a.5.5 0 0 0 .36-.48V4.5A2.5 2.5 0 0 1 5.25 2h.25a.5.5 0 0 1 0 1h-.25a1.5 1.5 0 0 0-1.5 1.5v1.75a1.5 1.5 0 0 1-1.09 1.44l-.54.15a.16.16 0 0 0 0 .32l.54.15a1.5 1.5 0 0 1 1.09 1.45v1.74a1.5 1.5 0 0 0 1.5 1.5h.25a.5.5 0 0 1 0 1h-.25a2.5 2.5 0 0 1-2.5-2.5"/>
</symbol>`;
const sym_markdown = `<symbol id="file-tree-builtin-markdown" viewBox="0 0 16 16">
  <path fill="currentColor" d="M1 12V4h2l2 2.5L7 4h2v8H7V7.5l-2 2-2-2V12zm9-3 3 3.5L16 9h-2V4h-2v5z"/>
</symbol>`;
const sym_mcp = `<symbol id="file-tree-builtin-mcp" viewBox="0 0 16 16">
  <path fill="currentColor" d="M9.26-.04a3 3 0 0 1 2 .82 2.8 2.8 0 0 1 .8 2.35 2.9 2.9 0 0 1 2.41.8l.03.02a2.74 2.74 0 0 1 0 3.94l-5.8 5.69-.04.06-.02.07q0 .04.02.07.01.04.04.06l1.2 1.17a.55.55 0 0 1 0 .79.6.6 0 0 1-.81 0l-1.2-1.17a1.3 1.3 0 0 1 0-1.84L13.7 7.1a1.65 1.65 0 0 0 .37-1.82 2 2 0 0 0-.37-.54l-.03-.03a1.73 1.73 0 0 0-2.4 0L6.47 9.4l-.07.06a.58.58 0 0 1-.92-.18.6.6 0 0 1 .12-.6l4.85-4.76a1.65 1.65 0 0 0 0-2.36 1.73 1.73 0 0 0-2.4 0l-6.43 6.3a.6.6 0 0 1-.8 0 .55.55 0 0 1 0-.8L7.25.79a3 3 0 0 1 2-.82"/>
  <path fill="currentColor" d="M9.26 2.19a.6.6 0 0 1 .52.34.6.6 0 0 1 0 .43l-.12.18L4.9 7.79a1.65 1.65 0 0 0 0 2.36 1.73 1.73 0 0 0 2.4 0l4.75-4.66a.58.58 0 0 1 .93.18.6.6 0 0 1-.12.61l-4.75 4.66a2.9 2.9 0 0 1-4.01 0 2.75 2.75 0 0 1-.62-3.04A3 3 0 0 1 4.1 7l4.74-4.65a.6.6 0 0 1 .4-.16"/>
</symbol>`;
const sym_nextjs = `<symbol id="file-tree-builtin-nextjs" viewBox="0 0 16 16">
  <defs>
  <linearGradient id="a" x1="4.522" x2="14" y1="3.943" y2="16" gradientUnits="userSpaceOnUse">
  <stop stop-color="currentColor"/>
  <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
  </linearGradient>
  </defs>
  <path fill="currentColor" d="M3 2h1.522v9.09H3z"/>
  <path fill="url(#a)" d="M4.903 2 15 15.075q-.565.5-1.195.925L4.522 3.943z"/>
  <path fill="currentColor" d="M12.172 2h-1.508v9.094h1.508z"/>
</symbol>`;
const sym_npm = `<symbol id="file-tree-builtin-npm" viewBox="0 0 16 16">
  <path fill="currentColor" d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z" class="vector" opacity=".2"/>
  <path fill="currentColor" d="M10.5 13H13V3H3v10h5V5.5h2.5z"/>
</symbol>`;
const sym_oxc = `<symbol id="file-tree-builtin-oxc" viewBox="0 0 16 16">
  <path fill="currentColor" d="M9.5 1a.5.5 0 0 1 .5.5V3h3.5a.5.5 0 0 1 .38.83L10.5 7.69v1.44q.41.04.95-.16a4 4 0 0 0 .72-.35l.04-.03h.01a.5.5 0 0 1 .67.1l2 2.5a.5.5 0 0 1 0 .62c-.76.96-3.14 2.69-6.89 2.69s-6.13-1.73-6.89-2.69a.5.5 0 0 1 0-.62l2-2.5a.5.5 0 0 1 .67-.1l.05.03.16.09q.22.13.56.26.54.2.95.16V7.69L2.12 3.83A.5.5 0 0 1 2.5 3H6V1.5a.5.5 0 0 1 .5-.5zM7 3.5a.5.5 0 0 1-.5.5H3.6l2.78 3.17a.5.5 0 0 1 .12.33v2a.5.5 0 0 1-.28.45c-.7.35-1.5.15-2.02-.05a5 5 0 0 1-.58-.26l-1.46 1.84c.82.78 2.8 2.02 5.84 2.02s5.02-1.24 5.84-2.02l-1.46-1.83a5 5 0 0 1-.58.26c-.52.2-1.33.39-2.02.04a.5.5 0 0 1-.28-.45v-2a.5.5 0 0 1 .12-.33L12.4 4H9.5a.5.5 0 0 1-.5-.5V2H7z"/>
</symbol>`;
const sym_postcss = `<symbol id="file-tree-builtin-postcss" viewBox="0 0 16 16">
  <path fill="currentColor" d="M14.5 8a6.5 6.5 0 0 0-5.9-6.47l5.42 8.93A7 7 0 0 0 14.5 8M2.88 12A6.5 6.5 0 0 0 8 14.5c2.08 0 3.93-.98 5.12-2.5zm8.62-1h1.68L11.5 8.24zm-1-.55a4 4 0 0 1-.7.55h.7zM8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M5.5 11h.7a4 4 0 0 1-.7-.55zm-2.68 0H4.5V8.24zm3.76-6.2A4 4 0 0 1 8 4.5q.76 0 1.42.3L8 2.46zM1.5 8q0 1.31.48 2.46L7.4 1.53A6.5 6.5 0 0 0 1.5 8m14 0a7.5 7.5 0 0 1-.99 3.72l-.01.03-.02.03A7.5 7.5 0 0 1 8 15.5a7.5 7.5 0 0 1-6.5-3.75l-.01-.03A7.5 7.5 0 1 1 15.5 8"/>
</symbol>`;
const sym_prettier = `<symbol id="file-tree-builtin-prettier" viewBox="0 0 16 16">
  <path fill="currentColor" d="M6 12v1H4.93v-1zm1-2v1H2v-1zm6-4v1h-3V6zm-1-4v1H9V2z"/>
  <path fill="currentColor" d="M11.5 10v1H8v-1zM5 6v1H2V6zm5-2v1H9V4z" opacity=".8"/>
  <path fill="currentColor" d="M6 14v1H2v-1zm-.5-6v1H2V8zM13 4v1h-3V4zM4.93 2v1H2V2z" opacity=".6"/>
  <path fill="currentColor" d="M4.93 12v1H2v-1zM13 8v1H9V8zM5.5 4v1H2V4zM9 2v1H4.93V2z" opacity=".4"/>
</symbol>`;
const sym_python = `<symbol id="file-tree-builtin-python" viewBox="0 0 16 16">
  <path fill="currentColor" d="M8.33 8.4H10c1.16 0 1.9-.73 1.9-1.86V5.08q0-.24.25-.24h.74c.75 0 1.33.32 1.66.97q.4.73.41 1.46c.09.9.09 1.78-.24 2.67-.25.73-.75 1.3-1.58 1.46h-4.8c-.08 0-.25 0-.25.08v.4s.17.09.25.09h2.82q.34-.02.33.32v1.06c0 .56-.25.97-.75 1.13-.41.16-.83.33-1.24.4a7 7 0 0 1-2.98-.07 3 3 0 0 1-1.16-.49c-.33-.32-.58-.65-.5-1.14v-2.91c0-1.13.67-1.78 1.82-1.78q.89-.1 1.66-.08m2.32 4.86a.65.65 0 0 0-.66-.65c-.34 0-.67.33-.67.65s.33.57.67.65a.65.65 0 0 0 .66-.65" class="bg" opacity=".8"/>
  <path fill="currentColor" d="M7.67 7.6H6c-1.16 0-1.9.73-1.9 1.86v1.46q0 .24-.25.24h-.74c-.75 0-1.33-.32-1.66-.97a3 3 0 0 1-.41-1.46 6 6 0 0 1 .24-2.67c.25-.73.75-1.3 1.58-1.46h4.8c.08 0 .25 0 .25-.08v-.4s-.17-.09-.25-.09H4.85c-.24 0-.33-.08-.33-.32V2.65c0-.56.25-.97.75-1.13.41-.16.83-.33 1.24-.4a7 7 0 0 1 2.98.07c.41.09.83.25 1.16.49.33.32.58.65.5 1.13v2.92c0 1.14-.67 1.78-1.82 1.78-.58.08-1.16.08-1.66.08M5.35 2.73c0 .33.25.65.66.65.33 0 .66-.32.66-.65 0-.32-.33-.56-.66-.64a.65.65 0 0 0-.66.64" class="fg"/>
</symbol>`;
const sym_react = `<symbol id="file-tree-builtin-react" viewBox="0 0 16 16">
  <path fill="currentColor" d="M8 6.65c.73 0 1.31.6 1.31 1.35S8.73 9.35 8 9.35 6.69 8.75 6.69 8 7.27 6.65 8 6.65"/>
  <path fill="currentColor" fill-rule="evenodd" d="M8 2.55c1.3-.99 2.59-1.34 3.5-.8.92.55 1.27 1.87 1.08 3.53C14.06 5.94 15 6.9 15 8s-.94 2.06-2.42 2.72c.19 1.65-.16 2.98-1.08 3.52-.91.55-2.2.2-3.5-.8-1.3 1-2.58 1.35-3.5.8-.91-.54-1.27-1.87-1.08-3.52C1.94 10.06 1 9.1 1 8s.94-2.06 2.42-2.72c-.19-1.66.17-2.98 1.08-3.52s2.2-.2 3.5.8M4.26 11.2c-.08 1.34.28 2.03.68 2.26s1.15.22 2.25-.52l.11-.09a12 12 0 0 1-1.24-1.39 11 11 0 0 1-1.8-.41zm7.47-.15q-.83.27-1.79.41-.6.8-1.24 1.4l.11.08c1.1.74 1.86.76 2.25.52.4-.23.76-.92.68-2.26zm-3.04.54a14 14 0 0 1-1.38 0q.34.38.69.7.35-.32.7-.7M8 5.29q-.76 0-1.47.1A13 13 0 0 0 5.07 8a14 14 0 0 0 1.46 2.62 13 13 0 0 0 2.94 0A13 13 0 0 0 10.93 8a14 14 0 0 0-1.46-2.62A13 13 0 0 0 8 5.3M4.64 9.18q-.15.5-.25.96.44.16.94.27a15 15 0 0 1-.7-1.23m6.73 0a15 15 0 0 1-.7 1.23q.5-.11.95-.27a10 10 0 0 0-.25-.96M3.44 6.26C2.27 6.86 1.87 7.53 1.87 8s.4 1.14 1.57 1.74l.13.07q.18-.88.55-1.81a12 12 0 0 1-.55-1.8q-.07.02-.13.06m8.99-.07A12 12 0 0 1 11.88 8q.36.94.55 1.8l.13-.06c1.17-.6 1.56-1.27 1.56-1.74s-.39-1.14-1.56-1.74zm-7.1-.6q-.5.11-.94.27.1.46.25.96a15 15 0 0 1 .69-1.23m5.34 0a15 15 0 0 1 .7 1.23q.14-.5.24-.96-.44-.15-.94-.27M7.18 3.06c-1.09-.74-1.85-.76-2.24-.52s-.76.92-.69 2.26l.01.15a11 11 0 0 1 1.8-.41q.6-.8 1.24-1.4zm3.88-.52c-.4-.24-1.15-.22-2.25.52l-.12.08q.65.6 1.25 1.4.96.15 1.8.41v-.14c.08-1.35-.28-2.04-.68-2.27M8 3.7a10 10 0 0 0-.7.7 14 14 0 0 1 1.4 0 10 10 0 0 0-.7-.7" clip-rule="evenodd"/>
</symbol>`;
const sym_ruby = `<symbol id="file-tree-builtin-ruby" viewBox="0 0 16 16">
  <path fill="currentColor" fill-rule="evenodd" d="M11.04 2c.48 0 .92.23 1.18.6l2.54 3.65c.37.52.3 1.23-.15 1.69l-5.58 5.64a1.47 1.47 0 0 1-2.06 0L1.39 7.94a1.3 1.3 0 0 1-.15-1.7l2.54-3.63q.2-.3.5-.45.33-.16.68-.16zm.84 2.17a.5.5 0 0 0-.7-.05L8 6.84 4.83 4.12a.5.5 0 0 0-.65.76L6.65 7H3.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1H9.35l2.48-2.12a.5.5 0 0 0 .05-.7" clip-rule="evenodd"/>
</symbol>`;
const sym_rust = `<symbol id="file-tree-builtin-rust" viewBox="0 0 16 16">
  <path fill="currentColor" fill-rule="evenodd" d="M8 .8a.2.2 0 0 1 .18.1l.38.6.16.02.5-.53.01-.01a.2.2 0 0 1 .33.08l.25.68.16.05.59-.43h.02a.2.2 0 0 1 .3.14l.12.71.15.08.65-.3a.2.2 0 0 1 .2.02.2.2 0 0 1 .1.18l-.03.72.12.1.71-.16a.2.2 0 0 1 .25.25l-.17.7q.06.06.1.13l.73-.03A.2.2 0 0 1 14 4a.2.2 0 0 1 .02.2l-.3.66.08.14.71.12a.2.2 0 0 1 .14.32l-.43.59.05.16.68.25a.2.2 0 0 1 .07.35l-.53.49.01.16.62.38a.2.2 0 0 1 0 .36l-.62.38-.01.16.53.5a.2.2 0 0 1-.07.34l-.68.25-.05.16.43.59a.2.2 0 0 1-.14.32l-.72.12-.07.15.3.65a.2.2 0 0 1-.02.2.2.2 0 0 1-.18.1l-.72-.03-.1.13.16.7a.2.2 0 0 1-.25.25l-.7-.17-.13.1.03.73a.2.2 0 0 1-.1.18.2.2 0 0 1-.2.02l-.66-.3-.14.08-.12.71a.2.2 0 0 1-.32.14l-.59-.43-.16.05-.25.68a.2.2 0 0 1-.34.07l-.5-.53-.16.01-.38.62a.2.2 0 0 1-.36 0l-.38-.62-.16-.01-.5.53a.2.2 0 0 1-.34-.07l-.25-.68-.16-.05-.59.43a.2.2 0 0 1-.32-.14L5 13.78l-.15-.07-.65.3a.2.2 0 0 1-.2-.02.2.2 0 0 1-.1-.18l.03-.72-.13-.1-.7.16a.2.2 0 0 1-.25-.25l.17-.7-.1-.13-.73.03a.2.2 0 0 1-.2-.3l.3-.66-.08-.14-.71-.12a.2.2 0 0 1-.14-.32l.43-.59-.05-.16-.68-.25A.2.2 0 0 1 1 9.22l.53-.5-.02-.16-.6-.38A.2.2 0 0 1 .8 8a.2.2 0 0 1 .1-.18l.6-.38.02-.16-.53-.5a.2.2 0 0 1 .07-.34l.68-.25.05-.16-.43-.59a.2.2 0 0 1 .14-.32L2.2 5l.08-.15L2 4.2a.2.2 0 0 1 .2-.3l.72.03.1-.13-.16-.7a.2.2 0 0 1 .25-.25l.7.16.13-.1-.03-.72A.2.2 0 0 1 4 2a.2.2 0 0 1 .2-.02l.65.3L5 2.2l.12-.71v-.03a.2.2 0 0 1 .32-.1l.59.41.16-.04.25-.68.01-.02A.2.2 0 0 1 6.8.99l.49.53.16-.02.38-.61.02-.02A.2.2 0 0 1 8 .79M6.8 9.45h1.26l.06.01q.03.01.03.05v1.52q0 .07-.09.06h-4.5A5.4 5.4 0 0 0 8 13.42a5.4 5.4 0 0 0 4.45-2.33h-2.42c-.36 0-.68-.5-.77-.75-.08-.22-.2-.91-.25-1.12-.15-.61-.59-.71-.78-.73H6.8zM8 2.58a5.4 5.4 0 0 0-4.07 1.85h5.74l.17.02c.23.03.6.12.96.35.34.23.83.68.83 1.4 0 .66-.55 1.16-1.08 1.5.42.33.7.53.86 1.44.04.17.34.32.62.29.29-.03.62-.16.62-.75v-.24q0-.1.07-.1h.68A5.43 5.43 0 0 0 8 2.59M2.96 6.03a5.4 5.4 0 0 0-.19 3.37h1.66V6.03zM6.8 7.06h1.66c.35 0 .77-.12.77-.47 0-.42-.55-.53-.65-.53H6.8z" clip-rule="evenodd"/>
</symbol>`;
const sym_sass = `<symbol id="file-tree-builtin-sass" viewBox="0 0 16 16">
  <path fill="currentColor" fill-rule="evenodd" d="M8.08 1.44c2.41-.91 4.96-.37 5.35 1.27.39 1.62-.92 3.56-2.6 4.25a5 5 0 0 1-3.26.35c-.58-.2-.92-.62-1-.85-.03-.09-.09-.24 0-.3.05-.03.08-.02.22.15s.7.6 1.75.48c2.78-.34 4.45-2.64 3.92-3.88-.37-.87-2.5-1.26-5.18.16C4.03 4.81 3.85 6.24 3.82 6.8c-.08 1.5 1.73 2.28 2.7 3.4q.04.03.07.08c.3-.12.7-.19 1.35-.2 1.58-.03 2.47 1.08 2.43 2.08-.03.78-.7 1.1-.82 1.13-.1.01-.14.02-.15-.06q-.03-.06.13-.15c.16-.09.42-.3.48-.72.05-.43-.24-1.44-1.76-1.63a3 3 0 0 0-1.33.08c.27.62.32 1.87-.29 2.83-.63 1-1.8 1.61-2.93 1.27-.37-.1-.93-.92-.45-2.05.46-1.07 2.4-2.12 2.66-2.26-.9-.83-3.08-1.95-3.4-3.65-.08-.49.13-1.65 1.46-2.98a12 12 0 0 1 4.11-2.52m-1.88 9.7c-.01.01-.9.47-1.52 1.17-.59.66-.75 1.48-.43 1.69.3.18 1-.04 1.51-.62a3 3 0 0 0 .5-.9q.2-.64.02-1.39z" clip-rule="evenodd"/>
</symbol>`;
const sym_stylelint = `<symbol id="file-tree-builtin-stylelint" viewBox="0 0 16 16">
  <path fill="currentColor" d="M4 3v3.5l1.5-1L7 15 .5 6l1-1.5L0 3l2.5-2h1zm12 0-1.5 1.5 1 1.5L9 15l1.5-9.5 1.5 1V3l.5-2h1zm-8 8.5a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1m0-3a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1m0-3a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1"/>
  <path fill="currentColor" d="M6.5 2.5V4l-2 1.5v-4zm5 3L9.5 4V2.5l2-1zM9 4H7V2.5h2z"/>
</symbol>`;
const sym_svelte = `<symbol id="file-tree-builtin-svelte" viewBox="0 0 16 16">
  <path fill="currentColor" d="m3.98 3.7 3.36-2.08a4.5 4.5 0 0 1 5.9 1.23 4 4 0 0 1 .7 3.02q-.16.75-.58 1.4c.42.77.56 1.66.4 2.52a3.7 3.7 0 0 1-1.57 2.4l-.17.1-3.36 2.09a4.5 4.5 0 0 1-5.9-1.23 4 4 0 0 1-.66-1.44 4 4 0 0 1-.04-1.58 4 4 0 0 1 .58-1.4 4 4 0 0 1-.4-2.52 3.7 3.7 0 0 1 1.57-2.4zl3.36-2.08zm7.87 0a2.7 2.7 0 0 0-1.26-.95 2.7 2.7 0 0 0-1.6-.07 3 3 0 0 0-.52.2l-.16.09-3.36 2.08a2 2 0 0 0-.69.64 2 2 0 0 0-.36.86 2.3 2.3 0 0 0 .42 1.81A2.7 2.7 0 0 0 7.18 9.4q.28-.06.53-.2l.16-.09 1.28-.79.2-.09a.8.8 0 0 1 .87.31.7.7 0 0 1 .13.55.7.7 0 0 1-.24.4l-.08.05-3.36 2.08-.2.09a1 1 0 0 1-.49-.02 1 1 0 0 1-.38-.3 1 1 0 0 1-.13-.37v-.1l.01-.13-.13-.03a4 4 0 0 1-1.1-.5l-.2-.14-.18-.12-.07.18-.08.3a2.3 2.3 0 0 0 .43 1.82q.45.64 1.19.93.73.28 1.51.14l.16-.04q.27-.07.52-.2l.16-.09 3.36-2.08q.4-.25.69-.64.27-.4.36-.86a2.3 2.3 0 0 0-.42-1.82 2.7 2.7 0 0 0-1.27-.95 2.7 2.7 0 0 0-1.6-.08q-.27.07-.52.2l-.16.1-1.28.79-.2.09a1 1 0 0 1-.49-.03 1 1 0 0 1-.38-.29.7.7 0 0 1-.13-.54.7.7 0 0 1 .24-.4l.08-.06L9.33 4.4l.2-.1a.8.8 0 0 1 .87.32 1 1 0 0 1 .13.38v.22l.11.04q.6.18 1.12.5l.2.14.17.12.06-.19.08-.3a2.3 2.3 0 0 0-.42-1.81z"/>
</symbol>`;
const sym_svg = `<symbol id="file-tree-builtin-svg" viewBox="0 0 16 16">
  <path fill="currentColor" d="M5 7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/>
  <path fill="currentColor" d="M6 1a5 5 0 0 1 4.58 3H7a3 3 0 0 0-3 3v3.58A5 5 0 0 1 6 1" opacity=".5"/>
</symbol>`;
const sym_svgo = `<symbol id="file-tree-builtin-svgo" viewBox="0 0 16 16">
  <path fill="currentColor" d="M9.43 4.8A.6.6 0 1 1 9.19 6l-.56.96a1.2 1.2 0 0 1 .32 1.58l.7.53a.89.89 0 1 1-.17.22l-.7-.52a1.2 1.2 0 0 1-1.4.25l-.56.87a.75.75 0 1 1-.57-.2 1 1 0 0 1 .32.05l.56-.87a1.2 1.2 0 0 1-.4-1.24l-1.2-.47a.56.56 0 1 1 .1-.28v.02l1.2.47a1.2 1.2 0 0 1 1.56-.55l.56-.97a.6.6 0 0 1-.15-.64.6.6 0 0 1 .63-.4"/>
  <path fill="currentColor" fill-rule="evenodd" d="M9.17 1q.16.63.27 1.26a6 6 0 0 1 1.61.67q.52-.38 1.08-.71l1.65 1.64q-.32.56-.68 1.05.48.78.72 1.67.6.09 1.18.25v2.32q-.55.15-1.11.24a6 6 0 0 1-.7 1.82q.31.44.59.91l-1.65 1.65-.85-.55a6 6 0 0 1-1.9.83q-.08.47-.2.95H6.84q-.12-.46-.2-.93a6 6 0 0 1-1.96-.81q-.39.27-.8.51l-1.65-1.65q.25-.43.53-.84a6 6 0 0 1-.75-1.9L1 9.16V6.83q.54-.14 1.09-.24a6 6 0 0 1 .77-1.74q-.33-.47-.63-.98l1.65-1.65q.54.32 1.03.68a6 6 0 0 1 1.66-.66q.1-.61.26-1.24zM7.96 3.73a4 4 0 0 0-1.74.36 4.5 4.5 0 0 0-2.3 2.3 4.4 4.4 0 0 0-.1 3.29l.03.06a4.4 4.4 0 0 0 2.4 2.47 4.4 4.4 0 0 0 3.48-.02l.03-.02a4.4 4.4 0 0 0 2.3-2.42l.06-.14a4.4 4.4 0 0 0-.2-3.4 4.4 4.4 0 0 0-2.13-2.07L9.47 4a4 4 0 0 0-1.51-.27" clip-rule="evenodd"/>
</symbol>`;
const sym_swift = `<symbol id="file-tree-builtin-swift" viewBox="0 0 16 16">
  <path fill="currentColor" d="M9.63 1c6.15 4.35 4.16 9.15 4.16 9.15s1.75 2.05 1.04 3.85c0 0-.72-1.26-1.93-1.26-1.17 0-1.85 1.26-4.2 1.26C3.47 14 1 9.46 1 9.46c4.71 3.22 7.93.94 7.93.94C6.8 9.12 2.29 3 2.29 3c3.93 3.47 5.63 4.39 5.63 4.39-1.01-.87-3.86-5.13-3.86-5.13C6.34 4.66 10.86 8 10.86 8c1.28-3.7-1.23-7-1.23-7"/>
</symbol>`;
const sym_table = `<symbol id="file-tree-builtin-table" viewBox="0 0 16 16">
  <path fill="currentColor" d="M8 4a3 3 0 0 0 3 3h3v5.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 12.5v-9A2.5 2.5 0 0 1 4.5 1H8z" class="bg" opacity=".4"/>
  <path fill="currentColor" d="M11.5 8a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5zM5 12h2.5v-1H5zm3.5 0H11v-1H8.5zM5 10h2.5V9H5zm3.5 0H11V9H8.5zm1-9a.5.5 0 0 1 .354.146l4 4A.5.5 0 0 1 14 5.5V6h-3a2 2 0 0 1-2-2V1z" class="fg"/>
</symbol>`;
const sym_tailwind = `<symbol id="file-tree-builtin-tailwind" viewBox="0 0 16 16">
  <path fill="currentColor" fill-rule="evenodd" d="M8 4Q5.2 4 4.5 6.67q1.05-1.34 2.45-1c.53.12.91.5 1.33.9C8.98 7.23 9.77 8 11.5 8q2.8 0 3.5-2.67-1.05 1.34-2.45 1c-.53-.12-.91-.5-1.33-.9C10.52 4.77 9.73 4 8 4M4.5 8Q1.7 8 1 10.67q1.05-1.34 2.45-1c.53.12.91.5 1.33.9C5.48 11.23 6.26 12 8 12q2.8 0 3.5-2.67-1.05 1.34-2.45 1c-.53-.12-.91-.5-1.33-.9C7.02 8.77 6.24 8 4.5 8" clip-rule="evenodd"/>
</symbol>`;
const sym_terraform = `<symbol id="file-tree-builtin-terraform" viewBox="0 0 16 16">
  <path fill="currentColor" d="M1 0v5.05l4.35 2.53V2.53zm9.18 5.34L5.83 2.82v5.05l4.35 2.53zm.47 5.06V5.34L15 2.82v5.05zm-.48 5.6-4.35-2.53V8.42l4.35 2.53z"/>
</symbol>`;
const sym_text = `<symbol id="file-tree-builtin-text" viewBox="0 0 16 16">
  <path fill="currentColor" fill-rule="evenodd" d="M8 4a3 3 0 0 0 3 3h3v5.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 12.5v-9A2.5 2.5 0 0 1 4.5 1H8z" class="bg" clip-rule="evenodd" opacity=".4"/>
  <path fill="currentColor" d="M8.5 11a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1zm2-2a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zm-1-8a.5.5 0 0 1 .354.146l4 4A.5.5 0 0 1 14 5.5V6h-3a2 2 0 0 1-2-2V1z"/>
</symbol>`;
const sym_typescript = `<symbol id="file-tree-builtin-typescript" viewBox="0 0 16 16">
  <path fill="currentColor" d="M8 1C2.24 1 1 2.24 1 8s1.24 7 7 7 7-1.24 7-7-1.24-7-7-7" class="bg" opacity=".2"/>
  <path fill="currentColor" d="M8.1 9.64h.95c.04.62.28.76 1.28.76s1.2-.14 1.2-.85c0-.66-.2-.85-1.2-1.07-1.79-.38-2.18-.7-2.18-1.86C8.15 5.3 8.54 5 10.31 5c1.67 0 2.04.26 2.07 1.42h-.95c-.02-.43-.23-.53-1.1-.53-1 0-1.22.14-1.22.74 0 .52.22.7 1.24.92 1.76.38 2.15.73 2.15 2 0 1.44-.4 1.75-2.24 1.75-1.8 0-2.18-.3-2.15-1.66m-3 1.57V5.99H3.5v-.9h4.21v.9H6.1v5.22z"/>
</symbol>`;
const sym_vite = `<symbol id="file-tree-builtin-vite" viewBox="0 0 16 16">
  <path fill="currentColor" d="M8.57 14.87c-.18.26-.55.11-.55-.22v-3.18l-.05-.27-.13-.22-.2-.15-.24-.06H4.29c-.26 0-.4-.32-.26-.55L6.08 7c.3-.46 0-1.1-.5-1.1H1.8c-.25 0-.4-.32-.25-.56l2.65-4.2A.3.3 0 0 1 4.46 1h7.9c.26 0 .4.32.26.55l-2.05 3.23c-.29.46 0 1.1.5 1.1h3.12c.26 0 .4.34.24.57z"/>
</symbol>`;
const sym_vscode = `<symbol id="file-tree-builtin-vscode" viewBox="0 0 16 16">
  <path fill="currentColor" d="m5.11 9.68-2.4 1.84a.6.6 0 0 1-.75-.04l-.77-.7a.6.6 0 0 1 0-.87L3.28 8zm5.52-8.42a.51.51 0 0 1 .87.36V4.8L7.32 8 5.1 6.32z" opacity=".75"/>
  <path fill="currentColor" d="M11.1 14.99h.03zM1.96 4.52a.6.6 0 0 1 .75-.04l8.8 6.71v3.19a.51.51 0 0 1-.88.36L1.19 6.1a.6.6 0 0 1 0-.87z" opacity=".65"/>
  <path fill="currentColor" d="M11.62 14.91a.9.9 0 0 1-1-.17.51.51 0 0 0 .88-.36V1.62a.51.51 0 0 0-.87-.36.9.9 0 0 1 1-.17l2.87 1.39a.9.9 0 0 1 .5.8v9.44a.9.9 0 0 1-.5.8z"/>
</symbol>`;
const sym_vue = `<symbol id="file-tree-builtin-vue" viewBox="0 0 16 16">
  <path fill="currentColor" d="M9.62 2.25 8 5.02 6.38 2.25H1l7 12 7-12z" opacity=".5"/>
  <path fill="currentColor" d="M9.54 2.25 8 4.95l-1.54-2.7H4l4 7 4-7z"/>
</symbol>`;
const sym_wasm = `<symbol id="file-tree-builtin-wasm" viewBox="0 0 16 16">
  <path fill="currentColor" d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3a2 2 0 1 0 4 0z" class="subtract" opacity=".2"/>
  <path fill="currentColor" d="M4.64 11.4h.02l.8-3.4h.91l.73 3.45L7.88 8h.96l-1.25 5h-.97L5.9 9.6 5.1 13h-1L3 8h.98z"/>
  <path fill="currentColor" fill-rule="evenodd" d="M13 13h-1.02l-.33-1.11H9.9L9.64 13h-.97l1.26-5h1.54zm-2.49-3.77-.42 1.84h1.32l-.49-1.84z" clip-rule="evenodd"/>
</symbol>`;
const sym_webpack = `<symbol id="file-tree-builtin-webpack" viewBox="0 0 16 16">
  <path fill="currentColor" d="M14.1 11.79 8.26 15v-2.5l3.64-1.94zm.4-.35V4.73l-2.14 1.2v4.3zm-12.6.35L7.74 15v-2.5L4.1 10.56zm-.4-.35V4.73l2.14 1.2v4.3zm.25-7.15 6-3.29v2.42L3.9 5.47l-.03.01zm12.5 0L8.25 1v2.42l3.85 2.05.03.01z" class="bg" opacity=".4"/>
  <path fill="currentColor" d="m7.74 11.93-3.59-1.92v-3.8l3.6 2.02zm.52 0 3.59-1.92v-3.8l-3.6 2.02zM4.4 5.77 8 3.85l3.6 1.93L8 7.8z" class="fg"/>
</symbol>`;
const sym_yml = `<symbol id="file-tree-builtin-yml" viewBox="0 0 16 16">
  <path fill="currentColor" d="M7.5 2A1.5 1.5 0 0 1 9 3.5v3A1.5 1.5 0 0 1 7.5 8h-2v2A1.5 1.5 0 0 0 7 11.5v-1A1.5 1.5 0 0 1 8.5 9h5a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 7 13.5v-1A2.5 2.5 0 0 1 4.5 10V8h-2A1.5 1.5 0 0 1 1 6.5v-3A1.5 1.5 0 0 1 2.5 2zm1 8a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm-6-7a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z"/>
</symbol>`;
const sym_zig = `<symbol id="file-tree-builtin-zig" viewBox="0 0 16 16">
  <path fill="currentColor" d="m14.73 1.5-7.29 8.82h4.17l-1.73 2.04H5.76L1.27 14.5l7.3-8.91H4.39l1.73-2.05h4.12z"/>
  <path fill="currentColor" d="M5.21 3.54 3.56 5.6h-.55v4.73h.83L2.1 12.36H1V3.54zm9.79 0v8.82h-4.3l1.74-2.04h.55V5.68h-.83l1.74-2.14z"/>
</symbol>`;
const standardTierSymbols = [
  sym_bash,
  sym_c,
  sym_cpp,
  sym_css,
  sym_database,
  sym_default,
  sym_font,
  sym_git,
  sym_go,
  sym_html,
  sym_image,
  sym_javascript,
  sym_json,
  sym_markdown,
  sym_mcp,
  sym_python,
  sym_ruby,
  sym_rust,
  sym_swift,
  sym_table,
  sym_text,
  sym_typescript,
  `<symbol id="file-tree-builtin-zip" viewBox="0 0 16 16">
  <path fill="currentColor" d="M4.585 2a2 2 0 0 1 1.028.285l1.788 1.072a1 1 0 0 0 .514.143H12A2 2 0 0 1 13.935 5H0V4a2 2 0 0 1 2-2z" class="bg" opacity=".5"/>
  <path fill="currentColor" fill-rule="evenodd" d="M14 12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-1.25h1v-1H0V6h14zM9.9 8.25c-.883 0-1.9.5-1.9.5H7v1h1v1s1.017.5 1.9.5c.884 0 1.6-.672 1.6-1.5s-.716-1.5-1.6-1.5M2 9.75v1h1v-1zm2 0v1h1v-1zm2 0v1h1v-1zm-5-1v1h1v-1zm2 0v1h1v-1zm2 0v1h1v-1z" class="fg" clip-rule="evenodd"/>
</symbol>`
];
const completeOnlySymbols = [
  sym_astro,
  sym_babel,
  sym_biome,
  sym_bootstrap,
  sym_browserslist,
  sym_bun,
  sym_claude,
  sym_docker,
  sym_eslint,
  sym_graphql,
  sym_nextjs,
  sym_npm,
  sym_oxc,
  sym_postcss,
  sym_prettier,
  sym_react,
  sym_sass,
  sym_stylelint,
  sym_svelte,
  sym_svg,
  sym_svgo,
  sym_tailwind,
  sym_terraform,
  sym_vite,
  sym_vscode,
  sym_vue,
  sym_wasm,
  sym_webpack,
  sym_yml,
  sym_zig
];
function appendSymbols(spriteSheet, symbols) {
  if (symbols.length === 0) return spriteSheet;
  return spriteSheet.replace("</svg>", `
  ${symbols.join("\n  ")}
</svg>`);
}
const STANDARD_SVG_SPRITE_SHEET = appendSymbols(MINIMAL_SVG_SPRITE_SHEET, standardTierSymbols);
const BUILT_IN_SVG_SPRITE_SHEETS = {
  minimal: MINIMAL_SVG_SPRITE_SHEET,
  standard: STANDARD_SVG_SPRITE_SHEET,
  complete: appendSymbols(STANDARD_SVG_SPRITE_SHEET, completeOnlySymbols)
};
const BUILT_IN_FILE_NAME_TOKENS = {
  ".babelrc": "babel",
  ".babelrc.json": "babel",
  ".bash_profile": "bash",
  ".bashrc": "bash",
  ".browserslistrc": "browserslist",
  ".dockerignore": "docker",
  ".eslintignore": "eslint",
  ".eslintrc": "eslint",
  ".eslintrc.cjs": "eslint",
  ".eslintrc.js": "eslint",
  ".eslintrc.json": "eslint",
  ".eslintrc.yaml": "eslint",
  ".eslintrc.yml": "eslint",
  ".gitattributes": "git",
  ".gitignore": "git",
  ".gitkeep": "git",
  ".gitmodules": "git",
  ".oxlintrc.json": "oxc",
  ".postcssrc": "postcss",
  ".postcssrc.json": "postcss",
  ".postcssrc.yaml": "postcss",
  ".postcssrc.yml": "postcss",
  ".prettierignore": "prettier",
  ".prettierrc": "prettier",
  ".prettierrc.cjs": "prettier",
  ".prettierrc.js": "prettier",
  ".prettierrc.json": "prettier",
  ".prettierrc.mjs": "prettier",
  ".prettierrc.toml": "prettier",
  ".prettierrc.yaml": "prettier",
  ".prettierrc.yml": "prettier",
  ".stylelintignore": "stylelint",
  ".stylelintrc": "stylelint",
  ".stylelintrc.cjs": "stylelint",
  ".stylelintrc.js": "stylelint",
  ".stylelintrc.json": "stylelint",
  ".stylelintrc.mjs": "stylelint",
  ".stylelintrc.yaml": "stylelint",
  ".stylelintrc.yml": "stylelint",
  ".terraform.lock.hcl": "terraform",
  ".zprofile": "bash",
  ".zshenv": "bash",
  ".zshrc": "bash",
  "babel.config.cjs": "babel",
  "babel.config.js": "babel",
  "babel.config.json": "babel",
  "babel.config.mjs": "babel",
  "biome.json": "biome",
  "biome.jsonc": "biome",
  "bootstrap.bundle.js": "bootstrap",
  "bootstrap.bundle.min.js": "bootstrap",
  "bootstrap.css": "bootstrap",
  "bootstrap.js": "bootstrap",
  "bootstrap.min.css": "bootstrap",
  "bootstrap.min.js": "bootstrap",
  "bun.lock": "bun",
  "bun.lockb": "bun",
  "bunfig.toml": "bun",
  "claude.md": "claude",
  "compose.yaml": "docker",
  "compose.yml": "docker",
  "docker-compose.override.yml": "docker",
  "docker-compose.yaml": "docker",
  "docker-compose.yml": "docker",
  dockerfile: "docker",
  "eslint.config.cjs": "eslint",
  "eslint.config.js": "eslint",
  "eslint.config.mjs": "eslint",
  "eslint.config.mts": "eslint",
  "eslint.config.ts": "eslint",
  gemfile: "ruby",
  "next.config.js": "nextjs",
  "next.config.mjs": "nextjs",
  "next.config.mts": "nextjs",
  "next.config.ts": "nextjs",
  "postcss.config.cjs": "postcss",
  "postcss.config.js": "postcss",
  "postcss.config.mjs": "postcss",
  "postcss.config.ts": "postcss",
  "prettier.config.cjs": "prettier",
  "prettier.config.js": "prettier",
  "prettier.config.mjs": "prettier",
  rakefile: "ruby",
  "readme.md": "markdown",
  "stylelint.config.cjs": "stylelint",
  "stylelint.config.js": "stylelint",
  "stylelint.config.mjs": "stylelint",
  "svgo.config.cjs": "svgo",
  "svgo.config.js": "svgo",
  "svgo.config.mjs": "svgo",
  "svgo.config.ts": "svgo",
  "tailwind.config.cjs": "tailwind",
  "tailwind.config.js": "tailwind",
  "tailwind.config.mjs": "tailwind",
  "tailwind.config.ts": "tailwind",
  "vite.config.js": "vite",
  "vite.config.mjs": "vite",
  "vite.config.mts": "vite",
  "vite.config.ts": "vite",
  "webpack.config.babel.js": "webpack",
  "webpack.config.cjs": "webpack",
  "webpack.config.js": "webpack",
  "webpack.config.mjs": "webpack",
  "webpack.config.ts": "webpack"
};
const BUILT_IN_FILE_EXTENSION_TOKENS = {
  "7z": "zip",
  astro: "astro",
  AUTHORS: "text",
  avif: "image",
  bash: "bash",
  bmp: "image",
  bz2: "zip",
  c: "c",
  cc: "cpp",
  cfg: "text",
  CHANGELOG: "text",
  cjs: "javascript",
  "code-workspace": "vscode",
  conf: "text",
  CONTRIBUTORS: "text",
  cpp: "cpp",
  csh: "bash",
  css: "css",
  csv: "table",
  cts: "typescript",
  cxx: "cpp",
  db: "database",
  editorconfig: "text",
  env: "text",
  "env.development": "text",
  "env.local": "text",
  "env.production": "text",
  eot: "font",
  erb: "ruby",
  fish: "bash",
  gemspec: "ruby",
  gif: "image",
  go: "go",
  gql: "graphql",
  graphql: "graphql",
  gz: "zip",
  h: "c",
  hh: "cpp",
  hpp: "cpp",
  htm: "html",
  html: "html",
  hxx: "cpp",
  icns: "image",
  ico: "image",
  ini: "text",
  inl: "cpp",
  jar: "zip",
  jpeg: "image",
  jpg: "image",
  js: "javascript",
  json: "json",
  json5: "json",
  jsonc: "json",
  jsonl: "json",
  jsx: "javascript",
  ksh: "bash",
  less: "css",
  LICENSE: "text",
  log: "text",
  markdown: "markdown",
  mcp: "mcp",
  md: "markdown",
  mdx: "markdown",
  "mdx.tsx": "markdown",
  mjs: "javascript",
  mm: "cpp",
  mts: "typescript",
  ods: "table",
  otf: "font",
  png: "image",
  postcss: "css",
  py: "python",
  pyi: "python",
  pyw: "python",
  pyx: "python",
  rake: "ruby",
  rar: "zip",
  rb: "ruby",
  rs: "rust",
  rst: "text",
  rtf: "text",
  sass: "css",
  scss: "css",
  sh: "bash",
  sql: "database",
  sqlite: "database",
  sqlite3: "database",
  styl: "css",
  svelte: "svelte",
  svg: "svg",
  swift: "swift",
  tar: "zip",
  tf: "terraform",
  tfstate: "terraform",
  tfvars: "terraform",
  tgz: "zip",
  tif: "image",
  tiff: "image",
  ts: "typescript",
  tsv: "table",
  tsx: "typescript",
  ttf: "font",
  txt: "text",
  vue: "vue",
  war: "zip",
  wasm: "wasm",
  wast: "wasm",
  wat: "wasm",
  webp: "image",
  woff: "font",
  woff2: "font",
  xhtml: "html",
  xls: "table",
  xlsx: "table",
  xz: "zip",
  yaml: "yml",
  yml: "yml",
  zig: "zig",
  zip: "zip",
  zsh: "bash"
};
const COMPLETE_EXTENSION_OVERRIDES = {
  jsx: "react",
  sass: "sass",
  scss: "sass",
  tsx: "react"
};
const STANDARD_TIER_TOKENS = /* @__PURE__ */ new Set([
  "bash",
  "c",
  "cpp",
  "css",
  "database",
  "default",
  "font",
  "git",
  "go",
  "html",
  "image",
  "javascript",
  "json",
  "markdown",
  "mcp",
  "python",
  "ruby",
  "rust",
  "swift",
  "table",
  "text",
  "typescript",
  "zip"
]);
const COLORED_SETS = /* @__PURE__ */ new Set(["complete"]);
function getBuiltInSpriteSheet(set) {
  return BUILT_IN_SVG_SPRITE_SHEETS[set === "none" ? "minimal" : set];
}
function getBuiltInFileIconName(token) {
  return `file-tree-builtin-${token}`;
}
function isColoredBuiltInIconSet(set) {
  return set !== "none" && COLORED_SETS.has(set);
}
function resolveBuiltInFileIconToken(set, fileName, extensionCandidates) {
  if (set === "minimal" || set === "none") return;
  const isComplete = set === "complete";
  const fileNameToken = BUILT_IN_FILE_NAME_TOKENS[fileName.toLowerCase()];
  if (fileNameToken != null) {
    if (isComplete || STANDARD_TIER_TOKENS.has(fileNameToken)) return fileNameToken;
  }
  for (const extension of extensionCandidates) {
    if (isComplete) {
      const override = COMPLETE_EXTENSION_OVERRIDES[extension];
      if (override != null) return override;
    }
    const match = BUILT_IN_FILE_EXTENSION_TOKENS[extension];
    if (match != null) {
      if (isComplete || STANDARD_TIER_TOKENS.has(match)) return match;
    }
  }
  return "default";
}
function hasCustomIconOverrides(icons) {
  return icons.spriteSheet != null || icons.remap != null || icons.byFileName != null || icons.byFileExtension != null || icons.byFileNameContains != null;
}
function normalizeFileTreeIcons(icons) {
  if (icons == null) return {
    set: "complete",
    colored: true
  };
  if (typeof icons === "string") return {
    set: icons,
    colored: true
  };
  return {
    ...icons,
    set: icons.set ?? (hasCustomIconOverrides(icons) ? "none" : "complete"),
    colored: icons.colored ?? true
  };
}
const normalizeIconRuleKey = (value) => value.trim().toLowerCase();
const getBaseFileName = (path) => {
  return path.split("/").at(-1) ?? path;
};
const getExtensionCandidates = (fileName) => {
  const segments = fileName.toLowerCase().split(".");
  const candidates = [];
  for (let index = 1; index < segments.length; index += 1) candidates.push(segments.slice(index).join("."));
  return candidates;
};
function remapEntryToIcon(entry, remappedFrom) {
  if (typeof entry === "string") return {
    name: entry,
    remappedFrom
  };
  return {
    ...entry,
    remappedFrom
  };
}
function createFileTreeIconResolver(icons) {
  const normalizedIcons = normalizeFileTreeIcons(icons);
  const iconRemap = normalizedIcons.remap;
  const iconByFileName = /* @__PURE__ */ new Map();
  for (const [fileName, icon] of Object.entries(normalizedIcons.byFileName ?? {})) iconByFileName.set(fileName.toLowerCase(), icon);
  const iconByFileExtension = /* @__PURE__ */ new Map();
  for (const [extension, icon] of Object.entries(normalizedIcons.byFileExtension ?? {})) iconByFileExtension.set(normalizeIconRuleKey(extension), icon);
  const iconByFileNameContains = Object.entries(normalizedIcons.byFileNameContains ?? {}).map(([needle, icon]) => [needle.toLowerCase(), icon]);
  const resolveIcon = (name, filePath) => {
    if (name === "file-tree-icon-file" && filePath != null) {
      const fileName = getBaseFileName(filePath);
      const lowerFileName = fileName.toLowerCase();
      const fileNameEntry = iconByFileName.get(lowerFileName);
      if (fileNameEntry != null) return remapEntryToIcon(fileNameEntry, name);
      for (const [needle, matchEntry] of iconByFileNameContains) if (lowerFileName.includes(needle)) return remapEntryToIcon(matchEntry, name);
      const extensionCandidates = getExtensionCandidates(fileName);
      for (const extension of extensionCandidates) {
        const extensionEntry = iconByFileExtension.get(extension);
        if (extensionEntry != null) return remapEntryToIcon(extensionEntry, name);
      }
      const builtInToken = resolveBuiltInFileIconToken(normalizedIcons.set, fileName, extensionCandidates);
      if (builtInToken != null && normalizedIcons.set !== "none") return {
        name: getBuiltInFileIconName(builtInToken),
        remappedFrom: name,
        token: builtInToken
      };
    }
    const remappedEntry = iconRemap?.[name];
    if (remappedEntry == null) return { name };
    return remapEntryToIcon(remappedEntry, name);
  };
  return { resolveIcon };
}
const PATH_STORE_CHILD_INDEX_CHUNK_SHIFT = 5;
const PATH_STORE_CHILD_INDEX_CHUNK_SIZE = 1 << PATH_STORE_CHILD_INDEX_CHUNK_SHIFT;
const PATH_STORE_CHILD_INDEX_CHUNK_THRESHOLD = PATH_STORE_CHILD_INDEX_CHUNK_SIZE * 4;
const PATH_STORE_CHILD_INDEX_CHUNK_THRESHOLD_EXTERNAL = PATH_STORE_CHILD_INDEX_CHUNK_THRESHOLD;
function createDirectoryChildIndex() {
  return {
    childIdByNameId: /* @__PURE__ */ new Map(),
    childIds: [],
    childPositionById: /* @__PURE__ */ new Map(),
    childVisibleChunkSums: null,
    totalChildSubtreeNodeCount: 0,
    totalChildVisibleSubtreeCount: 0
  };
}
function createPresortedDirectoryChildIndex() {
  return {
    childIdByNameId: null,
    childIds: [],
    childPositionById: null,
    childVisibleChunkSums: null,
    totalChildSubtreeNodeCount: 0,
    totalChildVisibleSubtreeCount: 0
  };
}
function ensureChildIdByNameId(nodes, index) {
  if (index.childIdByNameId != null) return index.childIdByNameId;
  const map = /* @__PURE__ */ new Map();
  for (const childId of index.childIds) {
    const childNode = nodes[childId];
    if (childNode != null) map.set(childNode.nameId, childId);
  }
  index.childIdByNameId = map;
  return map;
}
function ensureChildPositions(index) {
  if (index.childPositionById != null) return index.childPositionById;
  const positions = /* @__PURE__ */ new Map();
  for (let i2 = 0; i2 < index.childIds.length; i2++) {
    const childId = index.childIds[i2];
    if (childId != null) positions.set(childId, i2);
  }
  index.childPositionById = positions;
  return positions;
}
function appendChildReference(index, childId) {
  if (index.childPositionById != null) index.childPositionById.set(childId, index.childIds.length);
  index.childIds.push(childId);
}
function updateChildPositionsFrom(index, startIndex) {
  if (index.childPositionById == null) return;
  for (let position = startIndex; position < index.childIds.length; position++) {
    const childId = index.childIds[position];
    if (childId != null) index.childPositionById.set(childId, position);
  }
}
function rebuildDirectoryChildAggregates(nodes, index) {
  let totalChildSubtreeNodeCount = 0;
  let totalChildVisibleSubtreeCount = 0;
  for (const childId of index.childIds) {
    const childNode = nodes[childId];
    if (childNode == null) continue;
    totalChildSubtreeNodeCount += childNode.subtreeNodeCount;
    totalChildVisibleSubtreeCount += childNode.visibleSubtreeCount;
  }
  index.totalChildSubtreeNodeCount = totalChildSubtreeNodeCount;
  index.totalChildVisibleSubtreeCount = totalChildVisibleSubtreeCount;
  rebuildVisibleChildChunks(nodes, index);
}
function applyChildAggregateDelta(index, childId, subtreeNodeDelta, visibleSubtreeDelta) {
  index.totalChildSubtreeNodeCount += subtreeNodeDelta;
  index.totalChildVisibleSubtreeCount += visibleSubtreeDelta;
  if (index.childVisibleChunkSums == null || visibleSubtreeDelta === 0) return;
  const childPosition = ensureChildPositions(index).get(childId);
  if (childPosition === void 0) return;
  const chunkIndex = childPosition >> PATH_STORE_CHILD_INDEX_CHUNK_SHIFT;
  index.childVisibleChunkSums[chunkIndex] += visibleSubtreeDelta;
}
function selectChildIndexByVisibleIndex(nodes, index, visibleIndex) {
  const chunkSums = index.childVisibleChunkSums;
  if (chunkSums != null) {
    let remainingIndex$1 = visibleIndex;
    let childIndex = 0;
    for (const chunkVisibleCount of chunkSums) {
      if (remainingIndex$1 < chunkVisibleCount) {
        const selected = selectChildIndexWithinChunk(nodes, index, childIndex, remainingIndex$1);
        return {
          ...selected,
          childVisibleIndex: visibleIndex - selected.localVisibleIndex
        };
      }
      remainingIndex$1 -= chunkVisibleCount;
      childIndex += PATH_STORE_CHILD_INDEX_CHUNK_SIZE;
    }
    throw new Error(`Visible child index ${String(visibleIndex)} is out of range`);
  }
  let remainingIndex = visibleIndex;
  for (let childIndex = 0; childIndex < index.childIds.length; childIndex++) {
    const childId = index.childIds[childIndex];
    if (childId == null) continue;
    const childNode = nodes[childId];
    if (childNode == null) continue;
    if (remainingIndex < childNode.visibleSubtreeCount) return {
      childIndex,
      childVisibleIndex: visibleIndex - remainingIndex,
      localVisibleIndex: remainingIndex
    };
    remainingIndex -= childNode.visibleSubtreeCount;
  }
  throw new Error(`Visible child index ${String(visibleIndex)} is out of range`);
}
function getVisibleChildPrefixCount(nodes, index, childPosition) {
  let visibleCount = 0;
  const chunkSums = index.childVisibleChunkSums;
  let scanStart = 0;
  if (chunkSums != null) {
    const chunkIndex = childPosition >> PATH_STORE_CHILD_INDEX_CHUNK_SHIFT;
    for (let chunkOffset = 0; chunkOffset < chunkIndex; chunkOffset += 1) visibleCount += chunkSums[chunkOffset] ?? 0;
    scanStart = chunkIndex << PATH_STORE_CHILD_INDEX_CHUNK_SHIFT;
  }
  for (let childIndex = scanStart; childIndex < childPosition; childIndex += 1) {
    const childId = index.childIds[childIndex];
    if (childId == null) continue;
    const childNode = nodes[childId];
    if (childNode == null) continue;
    visibleCount += childNode.visibleSubtreeCount;
  }
  return visibleCount;
}
function rebuildVisibleChildChunks(nodes, index) {
  if (index.childIds.length < PATH_STORE_CHILD_INDEX_CHUNK_THRESHOLD) {
    index.childVisibleChunkSums = null;
    return;
  }
  const chunkCount = Math.ceil(index.childIds.length / PATH_STORE_CHILD_INDEX_CHUNK_SIZE);
  const chunkSums = new Int32Array(chunkCount);
  for (let childIndex = 0; childIndex < index.childIds.length; childIndex++) {
    const childId = index.childIds[childIndex];
    if (childId == null) continue;
    const childNode = nodes[childId];
    if (childNode == null) continue;
    chunkSums[childIndex >> PATH_STORE_CHILD_INDEX_CHUNK_SHIFT] += childNode.visibleSubtreeCount;
  }
  index.childVisibleChunkSums = chunkSums;
}
function selectChildIndexWithinChunk(nodes, index, chunkStartIndex, visibleIndex) {
  const chunkEndIndex = Math.min(index.childIds.length, chunkStartIndex + PATH_STORE_CHILD_INDEX_CHUNK_SIZE);
  let remainingIndex = visibleIndex;
  for (let childIndex = chunkStartIndex; childIndex < chunkEndIndex; childIndex++) {
    const childId = index.childIds[childIndex];
    if (childId == null) continue;
    const childNode = nodes[childId];
    if (childNode == null) continue;
    if (remainingIndex < childNode.visibleSubtreeCount) return {
      childIndex,
      localVisibleIndex: remainingIndex
    };
    remainingIndex -= childNode.visibleSubtreeCount;
  }
  throw new Error(`Visible child index ${String(visibleIndex)} is out of range`);
}
const PATH_STORE_NODE_KIND_FILE = 0;
const PATH_STORE_NODE_KIND_DIRECTORY = 1;
const PATH_STORE_NODE_FLAG_EXPLICIT = 1;
const PATH_STORE_NODE_FLAG_ROOT = 2;
const PATH_STORE_NODE_FLAG_REMOVED = 4;
const PATH_STORE_NODE_FLAGS_MASK = PATH_STORE_NODE_FLAG_ROOT | 5;
const PATH_STORE_NODE_KIND_SHIFT = 3;
const PATH_STORE_NODE_KIND_MASK = 1 << PATH_STORE_NODE_KIND_SHIFT;
const PATH_STORE_NODE_DEPTH_SHIFT = 4;
function createNodeDepthAndFlags(depth, flags, kind = PATH_STORE_NODE_KIND_FILE) {
  return depth << PATH_STORE_NODE_DEPTH_SHIFT | kind << PATH_STORE_NODE_KIND_SHIFT | flags;
}
function getNodeDepth(node) {
  return node.depthAndFlags >>> PATH_STORE_NODE_DEPTH_SHIFT;
}
function getNodeKind(node) {
  return (node.depthAndFlags & PATH_STORE_NODE_KIND_MASK) >> PATH_STORE_NODE_KIND_SHIFT;
}
function isDirectoryNode(node) {
  return (node.depthAndFlags & PATH_STORE_NODE_KIND_MASK) !== 0;
}
function getNodeFlags(node) {
  return node.depthAndFlags & PATH_STORE_NODE_FLAGS_MASK;
}
function hasNodeFlag(node, flag) {
  return (getNodeFlags(node) & flag) !== 0;
}
function addNodeFlag(node, flag) {
  node.depthAndFlags |= flag;
}
function setNodeDepth(node, depth) {
  node.depthAndFlags = createNodeDepthAndFlags(depth, getNodeFlags(node), getNodeKind(node));
}
const BENCHMARK_INSTRUMENTATION = Symbol("benchmarkInstrumentation");
function attachBenchmarkInstrumentation(value, instrumentation) {
  if (instrumentation == null) return value;
  Object.defineProperty(value, BENCHMARK_INSTRUMENTATION, {
    configurable: true,
    enumerable: false,
    value: instrumentation,
    writable: false
  });
  return value;
}
function getBenchmarkInstrumentation(value) {
  if (value == null) return null;
  return value[BENCHMARK_INSTRUMENTATION] ?? null;
}
function withBenchmarkPhase(instrumentation, name, fn) {
  if (instrumentation == null) return fn();
  return instrumentation.measurePhase(name, fn);
}
function setBenchmarkCounter(instrumentation, name, value) {
  if (!Number.isFinite(value) || instrumentation == null) return;
  instrumentation.setCounter(name, value);
}
function isDigitCode(characterCode) {
  return characterCode >= 48 && characterCode <= 57;
}
function splitIntoNaturalTokens(value) {
  const tokens = [];
  let tokenStart = 0;
  let index = 0;
  while (index < value.length) {
    while (index < value.length && !isDigitCode(value.charCodeAt(index))) index += 1;
    if (index >= value.length) break;
    if (index > tokenStart) tokens.push(value.slice(tokenStart, index));
    let numberValue = 0;
    while (index < value.length && isDigitCode(value.charCodeAt(index))) {
      numberValue = numberValue * 10 + (value.charCodeAt(index) - 48);
      index += 1;
    }
    tokens.push(numberValue);
    tokenStart = index;
  }
  if (tokenStart < value.length || tokens.length === 0) tokens.push(value.slice(tokenStart));
  return tokens;
}
function createSegmentSortKey(value) {
  const lowerValue = value.toLowerCase();
  return {
    lowerValue,
    tokens: splitIntoNaturalTokens(lowerValue)
  };
}
function compareNaturalTokens(leftTokens, rightTokens) {
  const tokenCount = Math.min(leftTokens.length, rightTokens.length);
  for (let index = 0; index < tokenCount; index++) {
    const leftToken = leftTokens[index];
    const rightToken = rightTokens[index];
    if (leftToken === rightToken) continue;
    if (typeof leftToken === "number" && typeof rightToken === "number") return leftToken < rightToken ? -1 : 1;
    const leftString = String(leftToken);
    const rightString = String(rightToken);
    if (leftString !== rightString) return leftString < rightString ? -1 : 1;
  }
  if (leftTokens.length !== rightTokens.length) return leftTokens.length < rightTokens.length ? -1 : 1;
  return 0;
}
function compareSegmentSortKeys(leftKey, rightKey) {
  if (leftKey.tokens.length === 1 && rightKey.tokens.length === 1 && typeof leftKey.tokens[0] === "string" && typeof rightKey.tokens[0] === "string") {
    if (leftKey.lowerValue === rightKey.lowerValue) return 0;
    return leftKey.lowerValue < rightKey.lowerValue ? -1 : 1;
  }
  const tokenComparison = compareNaturalTokens(leftKey.tokens, rightKey.tokens);
  if (tokenComparison !== 0) return tokenComparison;
  if (leftKey.lowerValue !== rightKey.lowerValue) return leftKey.lowerValue < rightKey.lowerValue ? -1 : 1;
  return 0;
}
function compareSegmentValuesWithSortKeyLookup(left, right, getSortKey) {
  const comparison = compareSegmentSortKeys(getSortKey(left), getSortKey(right));
  if (comparison !== 0) return comparison;
  if (left === right) return 0;
  return left < right ? -1 : 1;
}
function compareSegmentValues(left, right) {
  return compareSegmentValuesWithSortKeyLookup(left, right, createSegmentSortKey);
}
function getKindAtDepth(entry, depth) {
  if (!(depth === entry.segments.length - 1)) return PATH_STORE_NODE_KIND_DIRECTORY;
  return entry.isDirectory ? PATH_STORE_NODE_KIND_DIRECTORY : PATH_STORE_NODE_KIND_FILE;
}
function comparePreparedEntries(left, right) {
  const sharedDepth = Math.min(left.segments.length, right.segments.length);
  for (let depth = 0; depth < sharedDepth; depth++) {
    const leftSegment = left.segments[depth];
    const rightSegment = right.segments[depth];
    if (leftSegment === rightSegment) continue;
    const leftKind = getKindAtDepth(left, depth);
    if (leftKind !== getKindAtDepth(right, depth)) return leftKind === PATH_STORE_NODE_KIND_DIRECTORY ? -1 : 1;
    return compareSegmentValues(leftSegment, rightSegment);
  }
  if (left.segments.length !== right.segments.length) return left.segments.length < right.segments.length ? -1 : 1;
  if (left.isDirectory === right.isDirectory) return 0;
  return left.isDirectory ? -1 : 1;
}
function comparePreparedPaths(left, right) {
  return comparePreparedEntries(left, right);
}
function comparePreparedPathsWithCachedSortKeys(left, right, cache) {
  const getCachedSortKey = (value) => {
    const existingKey = cache.get(value);
    if (existingKey != null) return existingKey;
    const nextKey = createSegmentSortKey(value);
    cache.set(value, nextKey);
    return nextKey;
  };
  const sharedDepth = Math.min(left.segments.length, right.segments.length);
  for (let depth = 0; depth < sharedDepth; depth++) {
    const leftSegment = left.segments[depth];
    const rightSegment = right.segments[depth];
    if (leftSegment === rightSegment) continue;
    const leftKind = getKindAtDepth(left, depth);
    if (leftKind !== getKindAtDepth(right, depth)) return leftKind === PATH_STORE_NODE_KIND_DIRECTORY ? -1 : 1;
    return compareSegmentValuesWithSortKeyLookup(leftSegment, rightSegment, getCachedSortKey);
  }
  if (left.segments.length !== right.segments.length) return left.segments.length < right.segments.length ? -1 : 1;
  if (left.isDirectory === right.isDirectory) return 0;
  return left.isDirectory ? -1 : 1;
}
function getSegmentSortKey(segmentTable, segmentId) {
  const existingKey = segmentTable.sortKeyById[segmentId];
  if (existingKey !== void 0) return existingKey;
  const value = segmentTable.valueById[segmentId];
  const nextKey = createSegmentSortKey(value);
  segmentTable.sortKeyById[segmentId] = nextKey;
  return nextKey;
}
function resolvePathStoreOptions(options = {}) {
  return {
    flattenEmptyDirectories: options.flattenEmptyDirectories !== false,
    sort: options.sort ?? "default"
  };
}
function splitCanonicalPath(inputPath) {
  const hasTrailingSlash = inputPath.length > 0 && inputPath.charCodeAt(inputPath.length - 1) === 47;
  const endIndex = hasTrailingSlash ? inputPath.length - 1 : inputPath.length;
  const segments = [];
  let segmentStart = 0;
  for (let index = 0; index < endIndex; index++) {
    if (inputPath.charCodeAt(index) !== 47) continue;
    segments.push(inputPath.slice(segmentStart, index));
    segmentStart = index + 1;
  }
  segments.push(inputPath.slice(segmentStart, endIndex));
  return {
    hasTrailingSlash,
    segments
  };
}
function parseInputPath(inputPath) {
  const { hasTrailingSlash, segments } = splitCanonicalPath(inputPath);
  return {
    basename: segments[segments.length - 1] ?? "",
    isDirectory: hasTrailingSlash,
    path: inputPath,
    segments
  };
}
function parseLookupPath(inputPath) {
  if (inputPath.length === 0) return {
    requiresDirectory: false,
    segments: []
  };
  const { hasTrailingSlash, segments } = splitCanonicalPath(inputPath);
  return {
    requiresDirectory: hasTrailingSlash,
    segments
  };
}
const ROOT_SEGMENT_VALUE = "";
function createSegmentTable() {
  const idByValue = /* @__PURE__ */ new Map();
  idByValue.set(ROOT_SEGMENT_VALUE, 0);
  return {
    idByValue,
    valueById: [ROOT_SEGMENT_VALUE],
    sortKeyById: [createSegmentSortKey(ROOT_SEGMENT_VALUE)]
  };
}
function internSegment(segmentTable, value) {
  const existingId = segmentTable.idByValue.get(value);
  if (existingId !== void 0) return existingId;
  const nextId = segmentTable.valueById.length;
  segmentTable.idByValue.set(value, nextId);
  segmentTable.valueById.push(value);
  return nextId;
}
function getSegmentValue(segmentTable, segmentId) {
  const value = segmentTable.valueById[segmentId];
  if (value === void 0) throw new Error(`Unknown segment ID: ${String(segmentId)}`);
  return value;
}
const PREPARED_INPUT_KIND = Symbol("pathStorePreparedInputKind");
function attachPreparedInputKind(value, kind) {
  value[PREPARED_INPUT_KIND] = kind;
  return value;
}
function createCompareEntry$1(preparedPath) {
  return {
    basename: preparedPath.basename,
    depth: preparedPath.segments.length,
    isDirectory: preparedPath.isDirectory,
    path: preparedPath.path,
    segments: preparedPath.segments
  };
}
function compareWithSortOption(left, right, sort) {
  if (sort === "default") return comparePreparedPaths(left, right);
  return sort(createCompareEntry$1(left), createCompareEntry$1(right));
}
function createRootNode() {
  return {
    depthAndFlags: createNodeDepthAndFlags(0, PATH_STORE_NODE_FLAG_EXPLICIT | PATH_STORE_NODE_FLAG_ROOT, PATH_STORE_NODE_KIND_DIRECTORY),
    nameId: 0,
    parentId: 0,
    subtreeNodeCount: 1,
    visibleSubtreeCount: 1
  };
}
function computeSharedPrefixLength(left, right) {
  const maxLength = Math.min(left.length, right.length);
  for (let index = 0; index < maxLength; index++) if (left[index] !== right[index]) return index;
  return maxLength;
}
function getDirectoryDepth(preparedPath) {
  return preparedPath.isDirectory ? preparedPath.segments.length : preparedPath.segments.length - 1;
}
function isPreparedPathArray(value) {
  return Array.isArray(value) && value.every((entry) => entry != null && typeof entry === "object" && typeof entry.path === "string" && Array.isArray(entry.segments) && typeof entry.basename === "string" && typeof entry.isDirectory === "boolean");
}
function isStringArray(value) {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function preparePaths(paths, options = {}) {
  return preparePathEntries(paths, options).map((entry) => entry.path);
}
function prepareInput(paths, options = {}) {
  const preparedPaths = preparePathEntries(paths, options);
  return attachPreparedInputKind({
    paths: preparedPaths.map((entry) => entry.path),
    preparedPaths
  }, "prepared");
}
function preparePresortedInput(paths) {
  const pathCount = paths.length;
  let presortedPathsContainDirectories = false;
  for (let index = 0; index < pathCount; index += 1) {
    const path = paths[index];
    if (path.length > 0 && path.charCodeAt(path.length - 1) === 47) {
      presortedPathsContainDirectories = true;
      break;
    }
  }
  return attachPreparedInputKind({
    paths,
    presortedPaths: paths,
    presortedPathsContainDirectories
  }, "presorted");
}
function getPreparedInputEntries(preparedInput) {
  const internalPreparedInput = preparedInput;
  const preparedPaths = internalPreparedInput.preparedPaths;
  if (internalPreparedInput[PREPARED_INPUT_KIND] === "prepared" && preparedPaths != null) return preparedPaths;
  if (!isPreparedPathArray(preparedPaths)) throw new Error("preparedInput must come from PathStore.prepareInput()");
  return preparedPaths;
}
function getPreparedInputPresortedPaths(preparedInput) {
  const internalPreparedInput = preparedInput;
  if (internalPreparedInput[PREPARED_INPUT_KIND] === "presorted" && internalPreparedInput.presortedPaths != null) return internalPreparedInput.presortedPaths;
  return isStringArray(internalPreparedInput.presortedPaths) ? internalPreparedInput.presortedPaths : null;
}
function getPreparedInputPresortedPathsContainDirectories(preparedInput) {
  const internalPreparedInput = preparedInput;
  return typeof internalPreparedInput.presortedPathsContainDirectories === "boolean" ? internalPreparedInput.presortedPathsContainDirectories : null;
}
function preparePathEntries(paths, options = {}) {
  const resolvedOptions = resolvePathStoreOptions(options);
  const instrumentation = getBenchmarkInstrumentation(options);
  setBenchmarkCounter(instrumentation, "workload.inputFiles", paths.length);
  const preparedPaths = withBenchmarkPhase(instrumentation, "store.preparePathEntries.parse", () => paths.map((path) => parseInputPath(path)));
  withBenchmarkPhase(instrumentation, "store.preparePathEntries.sort", () => preparedPaths.sort((left, right) => compareWithSortOption(left, right, resolvedOptions.sort)));
  return preparedPaths;
}
var PathStoreBuilder = class {
  directories = /* @__PURE__ */ new Map();
  directoryStack = [0];
  presortedDirectoryNodeIds = [];
  initialExpandedPathSet;
  createdDirectoriesAllExpanded = false;
  createdDirectoryCount = 0;
  lastPreparedPath = null;
  nodes = [createRootNode()];
  options;
  instrumentation;
  segmentSortKeyCache = /* @__PURE__ */ new Map();
  segmentTable = createSegmentTable();
  hasDeferredDirectoryIndexes = false;
  constructor(options = {}) {
    this.instrumentation = getBenchmarkInstrumentation(options);
    this.options = resolvePathStoreOptions(options);
    const initialExpandedPaths = options.initialExpandedPaths ?? null;
    if (initialExpandedPaths == null || initialExpandedPaths.length === 0) this.initialExpandedPathSet = null;
    else {
      const normalizedPaths = /* @__PURE__ */ new Set();
      const hintCount = initialExpandedPaths.length;
      for (let index = 0; index < hintCount; index += 1) {
        const path = initialExpandedPaths[index];
        const length = path.length;
        normalizedPaths.add(length > 0 && path.charCodeAt(length - 1) === 47 ? path.slice(0, length - 1) : path);
      }
      this.initialExpandedPathSet = normalizedPaths;
      this.createdDirectoriesAllExpanded = true;
    }
    this.directories.set(0, createDirectoryChildIndex());
  }
  appendPaths(paths) {
    return withBenchmarkPhase(this.instrumentation, "store.builder.appendPaths.parse", () => this.appendPreparedPaths(paths.map((path) => parseInputPath(path))));
  }
  appendPreparedPaths(preparedPaths, validateOrder = true) {
    this.createdDirectoriesAllExpanded = false;
    withBenchmarkPhase(this.instrumentation, "store.builder.appendPreparedPaths", () => {
      for (const preparedPath of preparedPaths) this.appendPreparedPath(preparedPath, validateOrder);
    });
    return this;
  }
  appendPresortedPaths(paths, containsDirectories = null) {
    withBenchmarkPhase(this.instrumentation, "store.builder.appendPresortedPaths", () => {
      if (containsDirectories === false) {
        this.appendPresortedFilePaths(paths);
        return;
      }
      this.createdDirectoriesAllExpanded = false;
      let previousPath = null;
      let currentDepth = 0;
      const nodes = this.nodes;
      const segmentTable = this.segmentTable;
      const idByValue = segmentTable.idByValue;
      const valueById = segmentTable.valueById;
      const dirStack = this.directoryStack;
      let stackTop = 0;
      let cachedDirPrefix = "";
      let cachedDirDepth = 0;
      for (const path of paths) {
        if (previousPath === path) throw new Error(`Duplicate path: "${path}"`);
        const hasTrailingSlash = path.length > 0 && path.charCodeAt(path.length - 1) === 47;
        const endIndex = hasTrailingSlash ? path.length - 1 : path.length;
        let sharedDirectoryDepth = 0;
        let unsharedSegmentStart = 0;
        if (previousPath != null) if (cachedDirPrefix.length > 0 && path.length > cachedDirPrefix.length && path.startsWith(cachedDirPrefix)) {
          sharedDirectoryDepth = cachedDirDepth;
          unsharedSegmentStart = cachedDirPrefix.length;
        } else {
          const compareLength = Math.min(endIndex, previousPath.length);
          let prefixMatched = true;
          for (let ci = 0; ci < compareLength; ci++) {
            const cc = path.charCodeAt(ci);
            if (cc !== previousPath.charCodeAt(ci)) {
              prefixMatched = false;
              break;
            }
            if (cc === 47) {
              sharedDirectoryDepth++;
              unsharedSegmentStart = ci + 1;
            }
          }
          if (prefixMatched && hasTrailingSlash && compareLength === endIndex && previousPath.length > endIndex && previousPath.charCodeAt(endIndex) === 47) {
            sharedDirectoryDepth++;
            unsharedSegmentStart = endIndex + 1;
          }
        }
        stackTop = sharedDirectoryDepth;
        currentDepth = sharedDirectoryDepth;
        let segmentStart = unsharedSegmentStart;
        let slashPos = path.indexOf("/", segmentStart);
        while (slashPos >= 0 && slashPos < endIndex) {
          const parentId = dirStack[stackTop];
          if (parentId === void 0) throw new Error("Directory stack underflow while building the path store");
          currentDepth++;
          const dirSeg = path.slice(segmentStart, slashPos);
          let dirNameId = idByValue.get(dirSeg);
          if (dirNameId === void 0) {
            dirNameId = valueById.length;
            idByValue.set(dirSeg, dirNameId);
            valueById.push(dirSeg);
          }
          const nodeId = nodes.length;
          nodes.push({
            depthAndFlags: createNodeDepthAndFlags(currentDepth, 0, PATH_STORE_NODE_KIND_DIRECTORY),
            nameId: dirNameId,
            parentId,
            subtreeNodeCount: 1,
            visibleSubtreeCount: 1
          });
          this.recordCreatedDirectoryPath(path.slice(0, slashPos));
          stackTop++;
          dirStack[stackTop] = nodeId;
          segmentStart = slashPos + 1;
          slashPos = path.indexOf("/", segmentStart);
        }
        if (hasTrailingSlash) {
          if (segmentStart < endIndex) {
            const parentId = dirStack[stackTop];
            if (parentId === void 0) throw new Error(`Unable to resolve directory parent for "${path}"`);
            currentDepth++;
            const trailSeg = path.slice(segmentStart, endIndex);
            let trailNameId = idByValue.get(trailSeg);
            if (trailNameId === void 0) {
              trailNameId = valueById.length;
              idByValue.set(trailSeg, trailNameId);
              valueById.push(trailSeg);
            }
            const nodeId = nodes.length;
            nodes.push({
              depthAndFlags: createNodeDepthAndFlags(currentDepth, 0, PATH_STORE_NODE_KIND_DIRECTORY),
              nameId: trailNameId,
              parentId,
              subtreeNodeCount: 1,
              visibleSubtreeCount: 1
            });
            stackTop++;
            dirStack[stackTop] = nodeId;
          }
          const directoryId = dirStack[stackTop];
          if (directoryId === void 0) throw new Error(`Unable to resolve directory node for "${path}"`);
          this.promoteDirectoryToExplicit(directoryId, path);
        } else {
          const parentId = dirStack[stackTop];
          if (parentId === void 0) throw new Error(`Unable to resolve file parent for "${path}"`);
          const fileSeg = path.slice(segmentStart);
          let fileNameId = idByValue.get(fileSeg);
          if (fileNameId === void 0) {
            fileNameId = valueById.length;
            idByValue.set(fileSeg, fileNameId);
            valueById.push(fileSeg);
          }
          nodes.push({
            depthAndFlags: createNodeDepthAndFlags(currentDepth + 1, 0),
            nameId: fileNameId,
            parentId,
            subtreeNodeCount: 1,
            visibleSubtreeCount: 1
          });
        }
        if (segmentStart !== cachedDirPrefix.length) {
          cachedDirPrefix = path.substring(0, segmentStart);
          cachedDirDepth = currentDepth;
        }
        previousPath = path;
      }
      dirStack.length = stackTop + 1;
      if (previousPath != null) this.lastPreparedPath = parseInputPath(previousPath);
      this.hasDeferredDirectoryIndexes = true;
    });
    return this;
  }
  appendPresortedFilePaths(paths) {
    let previousPath = null;
    let currentDepth = 0;
    const nodes = this.nodes;
    const segmentTable = this.segmentTable;
    const idByValue = segmentTable.idByValue;
    const valueById = segmentTable.valueById;
    const dirStack = this.directoryStack;
    let stackTop = 0;
    let cachedDirPrefix = "";
    let cachedDirDepth = 0;
    for (const path of paths) {
      if (previousPath === path) throw new Error(`Duplicate path: "${path}"`);
      const endIndex = path.length;
      let sharedDirectoryDepth = 0;
      let unsharedSegmentStart = 0;
      if (previousPath != null) if (cachedDirPrefix.length > 0 && path.length > cachedDirPrefix.length && path.startsWith(cachedDirPrefix)) {
        sharedDirectoryDepth = cachedDirDepth;
        unsharedSegmentStart = cachedDirPrefix.length;
      } else {
        const compareLength = Math.min(endIndex, previousPath.length);
        for (let ci = 0; ci < compareLength; ci++) {
          const cc = path.charCodeAt(ci);
          if (cc !== previousPath.charCodeAt(ci)) break;
          if (cc === 47) {
            sharedDirectoryDepth++;
            unsharedSegmentStart = ci + 1;
          }
        }
      }
      stackTop = sharedDirectoryDepth;
      currentDepth = sharedDirectoryDepth;
      let segmentStart = unsharedSegmentStart;
      let slashPos = path.indexOf("/", segmentStart);
      while (slashPos >= 0) {
        const parentId$1 = dirStack[stackTop];
        if (parentId$1 === void 0) throw new Error("Directory stack underflow while building the path store");
        currentDepth++;
        const dirSeg = path.slice(segmentStart, slashPos);
        let dirNameId = idByValue.get(dirSeg);
        if (dirNameId === void 0) {
          dirNameId = valueById.length;
          idByValue.set(dirSeg, dirNameId);
          valueById.push(dirSeg);
        }
        const nodeId = nodes.length;
        nodes.push({
          depthAndFlags: createNodeDepthAndFlags(currentDepth, 0, PATH_STORE_NODE_KIND_DIRECTORY),
          nameId: dirNameId,
          parentId: parentId$1,
          subtreeNodeCount: 1,
          visibleSubtreeCount: 1
        });
        this.recordCreatedDirectoryPath(path.slice(0, slashPos));
        this.presortedDirectoryNodeIds.push(nodeId);
        stackTop++;
        dirStack[stackTop] = nodeId;
        segmentStart = slashPos + 1;
        slashPos = path.indexOf("/", segmentStart);
      }
      const parentId = dirStack[stackTop];
      if (parentId === void 0) throw new Error(`Unable to resolve file parent for "${path}"`);
      const fileSeg = path.slice(segmentStart);
      let fileNameId = idByValue.get(fileSeg);
      if (fileNameId === void 0) {
        fileNameId = valueById.length;
        idByValue.set(fileSeg, fileNameId);
        valueById.push(fileSeg);
      }
      nodes.push({
        depthAndFlags: createNodeDepthAndFlags(currentDepth + 1, 0),
        nameId: fileNameId,
        parentId,
        subtreeNodeCount: 1,
        visibleSubtreeCount: 1
      });
      if (segmentStart !== cachedDirPrefix.length) {
        cachedDirPrefix = path.substring(0, segmentStart);
        cachedDirDepth = currentDepth;
      }
      previousPath = path;
    }
    dirStack.length = stackTop + 1;
    if (previousPath != null) this.lastPreparedPath = parseInputPath(previousPath);
    this.hasDeferredDirectoryIndexes = true;
  }
  finish(options = {}) {
    const skipSubtreeCountPass = options.skipSubtreeCountPass === true;
    if (this.hasDeferredDirectoryIndexes) {
      withBenchmarkPhase(this.instrumentation, "store.builder.buildDirectoryIndexes", () => this.buildPresortedFinish(skipSubtreeCountPass));
      this.hasDeferredDirectoryIndexes = false;
    } else if (!skipSubtreeCountPass) withBenchmarkPhase(this.instrumentation, "store.builder.computeSubtreeCounts", () => this.computeSubtreeCounts(0));
    return {
      directories: this.directories,
      nodes: this.nodes,
      options: this.options,
      rootId: 0,
      segmentTable: this.segmentTable,
      presortedDirectoryNodeIds: this.presortedDirectoryNodeIds.length > 0 ? this.presortedDirectoryNodeIds : null
    };
  }
  didMatchAllInitialExpandedPaths() {
    return this.createdDirectoriesAllExpanded && this.initialExpandedPathSet != null && this.createdDirectoryCount === this.initialExpandedPathSet.size;
  }
  appendPreparedPath(preparedPath, validateOrder) {
    if (this.hasDeferredDirectoryIndexes) {
      this.buildDirectoryIndexes();
      this.hasDeferredDirectoryIndexes = false;
    }
    if (this.lastPreparedPath != null) {
      if (preparedPath.path === this.lastPreparedPath.path) throw new Error(`Duplicate path: "${preparedPath.path}"`);
      if (validateOrder) {
        if ((this.options.sort === "default" ? comparePreparedPathsWithCachedSortKeys(this.lastPreparedPath, preparedPath, this.segmentSortKeyCache) : compareWithSortOption(this.lastPreparedPath, preparedPath, this.options.sort)) > 0) throw new Error(`Builder input must be sorted before appendPaths(): "${preparedPath.path}"`);
      }
    }
    const previousPath = this.lastPreparedPath;
    const currentDirectoryDepth = getDirectoryDepth(preparedPath);
    const previousDirectoryDepth = previousPath == null ? 0 : getDirectoryDepth(previousPath);
    const sharedPrefixLength = previousPath == null ? 0 : computeSharedPrefixLength(previousPath.segments, preparedPath.segments);
    const sharedDirectoryDepth = Math.min(sharedPrefixLength, currentDirectoryDepth, previousDirectoryDepth);
    this.directoryStack.length = sharedDirectoryDepth + 1;
    for (let segmentIndex = sharedDirectoryDepth; segmentIndex < currentDirectoryDepth; segmentIndex++) {
      const parentId$1 = this.directoryStack[this.directoryStack.length - 1];
      if (parentId$1 === void 0) throw new Error("Directory stack underflow while building the path store");
      const childId = validateOrder ? this.getOrCreateDirectoryChild(parentId$1, preparedPath.segments[segmentIndex]) : this.createDirectoryChild(parentId$1, preparedPath.segments[segmentIndex]);
      this.directoryStack.push(childId);
    }
    if (preparedPath.isDirectory) {
      const directoryId = this.directoryStack[this.directoryStack.length - 1];
      if (directoryId === void 0) throw new Error(`Unable to resolve directory node for "${preparedPath.path}"`);
      this.promoteDirectoryToExplicit(directoryId, preparedPath.path);
      this.lastPreparedPath = preparedPath;
      return;
    }
    const parentId = this.directoryStack[this.directoryStack.length - 1];
    if (parentId === void 0) throw new Error(`Unable to resolve file parent for "${preparedPath.path}"`);
    if (validateOrder) this.createFileChild(parentId, preparedPath.basename, preparedPath.path);
    else this.createFileChildUnchecked(parentId, preparedPath.basename);
    this.lastPreparedPath = preparedPath;
  }
  recordCreatedDirectoryPath(path) {
    if (!this.createdDirectoriesAllExpanded || this.initialExpandedPathSet == null) return;
    this.createdDirectoryCount += 1;
    if (!this.initialExpandedPathSet.has(path)) this.createdDirectoriesAllExpanded = false;
  }
  createFileChild(parentId, basename, path) {
    const nameId = internSegment(this.segmentTable, basename);
    const parentIndex = this.getDirectoryIndex(parentId);
    const nameMap = parentIndex.childIdByNameId;
    if (nameMap != null) {
      if (nameMap.get(nameId) !== void 0) throw new Error(`Path collides with an existing entry: "${path}"`);
    }
    const parentNode = this.nodes[parentId];
    if (parentNode === void 0) throw new Error(`Unknown parent node ID: ${String(parentId)}`);
    const nodeId = this.nodes.length;
    this.nodes.push({
      depthAndFlags: createNodeDepthAndFlags(getNodeDepth(parentNode) + 1, 0),
      nameId,
      parentId,
      subtreeNodeCount: 1,
      visibleSubtreeCount: 1
    });
    if (nameMap != null) nameMap.set(nameId, nodeId);
    appendChildReference(parentIndex, nodeId);
    return nodeId;
  }
  createFileChildUnchecked(parentId, basename) {
    const nameId = internSegment(this.segmentTable, basename);
    const parentIndex = this.getDirectoryIndex(parentId);
    const parentNode = this.nodes[parentId];
    if (parentNode === void 0) throw new Error(`Unknown parent node ID: ${String(parentId)}`);
    const nodeId = this.nodes.length;
    this.nodes.push({
      depthAndFlags: createNodeDepthAndFlags(getNodeDepth(parentNode) + 1, 0),
      nameId,
      parentId,
      subtreeNodeCount: 1,
      visibleSubtreeCount: 1
    });
    if (parentIndex.childIdByNameId != null) parentIndex.childIdByNameId.set(nameId, nodeId);
    appendChildReference(parentIndex, nodeId);
    return nodeId;
  }
  getOrCreateDirectoryChild(parentId, segment) {
    const nameId = internSegment(this.segmentTable, segment);
    const parentIndex = this.getDirectoryIndex(parentId);
    if (parentIndex.childIdByNameId != null) {
      const existingChildId = parentIndex.childIdByNameId.get(nameId);
      if (existingChildId !== void 0) {
        const existingNode = this.nodes[existingChildId];
        if (existingNode != null && !isDirectoryNode(existingNode)) throw new Error(`Path collides with an existing file while creating directory "${segment}"`);
        return existingChildId;
      }
    }
    const parentNode = this.nodes[parentId];
    if (parentNode === void 0) throw new Error(`Unknown parent node ID: ${String(parentId)}`);
    const nodeId = this.nodes.length;
    this.nodes.push({
      depthAndFlags: createNodeDepthAndFlags(getNodeDepth(parentNode) + 1, 0, PATH_STORE_NODE_KIND_DIRECTORY),
      nameId,
      parentId,
      subtreeNodeCount: 1,
      visibleSubtreeCount: 1
    });
    if (parentIndex.childIdByNameId != null) parentIndex.childIdByNameId.set(nameId, nodeId);
    appendChildReference(parentIndex, nodeId);
    this.directories.set(nodeId, createDirectoryChildIndex());
    return nodeId;
  }
  createDirectoryChild(parentId, segment) {
    const nameId = internSegment(this.segmentTable, segment);
    const parentIndex = this.getDirectoryIndex(parentId);
    const parentNode = this.nodes[parentId];
    if (parentNode === void 0) throw new Error(`Unknown parent node ID: ${String(parentId)}`);
    const nodeId = this.nodes.length;
    this.nodes.push({
      depthAndFlags: createNodeDepthAndFlags(getNodeDepth(parentNode) + 1, 0, PATH_STORE_NODE_KIND_DIRECTORY),
      nameId,
      parentId,
      subtreeNodeCount: 1,
      visibleSubtreeCount: 1
    });
    if (parentIndex.childIdByNameId != null) parentIndex.childIdByNameId.set(nameId, nodeId);
    appendChildReference(parentIndex, nodeId);
    this.directories.set(nodeId, createDirectoryChildIndex());
    return nodeId;
  }
  promoteDirectoryToExplicit(directoryId, path) {
    const directoryNode = this.nodes[directoryId];
    if (directoryNode === void 0) throw new Error(`Unknown directory node ID: ${String(directoryId)}`);
    if (!isDirectoryNode(directoryNode)) throw new Error(`Path is not a directory: "${path}"`);
    if (hasNodeFlag(directoryNode, PATH_STORE_NODE_FLAG_EXPLICIT)) throw new Error(`Duplicate path: "${path}"`);
    addNodeFlag(directoryNode, PATH_STORE_NODE_FLAG_EXPLICIT);
  }
  getDirectoryIndex(directoryId) {
    const existingIndex = this.directories.get(directoryId);
    if (existingIndex !== void 0) return existingIndex;
    throw new Error(`Unknown directory child index for node ${String(directoryId)}`);
  }
  buildPresortedFinish(skipSubtreeCountPass) {
    const nodes = this.nodes;
    const directories = this.directories;
    directories.set(0, createPresortedDirectoryChildIndex());
    let cachedParentId = -1;
    let cachedParentIndex = null;
    for (let nodeId = 1; nodeId < nodes.length; nodeId++) {
      const node = nodes[nodeId];
      if (node == null) continue;
      if (isDirectoryNode(node)) {
        const dirIndex = createPresortedDirectoryChildIndex();
        directories.set(nodeId, dirIndex);
        cachedParentId = nodeId;
        cachedParentIndex = dirIndex;
      }
      let parentIndex;
      if (node.parentId === cachedParentId) parentIndex = cachedParentIndex;
      else {
        parentIndex = directories.get(node.parentId);
        cachedParentId = node.parentId;
        cachedParentIndex = parentIndex ?? null;
      }
      if (parentIndex != null) parentIndex.childIds.push(nodeId);
    }
    if (skipSubtreeCountPass) return;
    for (let nodeId = nodes.length - 1; nodeId >= 1; nodeId--) {
      const node = nodes[nodeId];
      if (node == null) continue;
      const parentNode = nodes[node.parentId];
      if (parentNode != null) {
        parentNode.subtreeNodeCount += node.subtreeNodeCount;
        parentNode.visibleSubtreeCount += node.visibleSubtreeCount;
      }
    }
  }
  buildDirectoryIndexes() {
    const nodes = this.nodes;
    for (let nodeId = 1; nodeId < nodes.length; nodeId++) {
      const node = nodes[nodeId];
      if (node == null) continue;
      if (isDirectoryNode(node)) this.directories.set(nodeId, createDirectoryChildIndex());
      const parentIndex = this.directories.get(node.parentId);
      if (parentIndex != null) {
        if (parentIndex.childIdByNameId != null) parentIndex.childIdByNameId.set(node.nameId, nodeId);
        appendChildReference(parentIndex, nodeId);
      }
    }
  }
  computeSubtreeCounts(nodeId) {
    const node = this.nodes[nodeId];
    if (node === void 0) throw new Error(`Unknown node ID: ${String(nodeId)}`);
    if (!isDirectoryNode(node)) {
      node.subtreeNodeCount = 1;
      node.visibleSubtreeCount = 1;
      return 1;
    }
    const directoryIndex = this.getDirectoryIndex(nodeId);
    let subtreeNodeCount = 1;
    for (const childId of directoryIndex.childIds) subtreeNodeCount += this.computeSubtreeCounts(childId);
    rebuildDirectoryChildAggregates(this.nodes, directoryIndex);
    node.subtreeNodeCount = subtreeNodeCount;
    node.visibleSubtreeCount = subtreeNodeCount;
    return subtreeNodeCount;
  }
};
function createPathStoreState(snapshot, initialExpansion = "closed", instrumentation = null) {
  const defaultExpansion = resolveInitialExpansion(initialExpansion);
  return {
    activeNodeCount: snapshot.nodes.length - 1,
    collapsedDirectoryIds: /* @__PURE__ */ new Set(),
    collapseNewDirectoriesByDefault: false,
    defaultExpansion,
    directoriesOpenByDefault: defaultExpansion === "open",
    hasCollapsedDirectoryOverrides: false,
    directoryLoadInfoById: /* @__PURE__ */ new Map(),
    expandedDirectoryIds: /* @__PURE__ */ new Set(),
    instrumentation,
    listeners: /* @__PURE__ */ new Map(),
    pathCacheByNodeId: /* @__PURE__ */ new Map([[snapshot.rootId, {
      path: "",
      version: 0
    }]]),
    pathCacheVersion: 0,
    snapshot,
    transactionStack: []
  };
}
function createTransactionFrame() {
  return {
    affectedAncestorIds: /* @__PURE__ */ new Set(),
    affectedNodeIds: /* @__PURE__ */ new Set(),
    events: []
  };
}
function resolveInitialExpansion(initialExpansion) {
  if (typeof initialExpansion !== "number") return initialExpansion;
  if (!Number.isInteger(initialExpansion) || initialExpansion < 0) throw new Error(`initialExpansion must be "open", "closed", or a non-negative integer depth. Received: ${String(initialExpansion)}`);
  return initialExpansion;
}
function isDirectoryExpandedByDefault(state, node) {
  if (hasNodeFlag(node, PATH_STORE_NODE_FLAG_ROOT)) return true;
  if (state.defaultExpansion === "open") return true;
  if (state.defaultExpansion === "closed") return false;
  return getNodeDepth(node) <= state.defaultExpansion;
}
function isDirectoryExpanded(state, nodeId, node = state.snapshot.nodes[nodeId]) {
  if (node == null || !isDirectoryNode(node)) return false;
  if (state.directoriesOpenByDefault && !state.hasCollapsedDirectoryOverrides) return true;
  if (state.collapsedDirectoryIds.has(nodeId)) return false;
  if (state.expandedDirectoryIds.has(nodeId)) return true;
  return isDirectoryExpandedByDefault(state, node);
}
function setDirectoryExpanded(state, nodeId, expanded, node = state.snapshot.nodes[nodeId]) {
  if (node == null || !isDirectoryNode(node)) return;
  const expandedByDefault = isDirectoryExpandedByDefault(state, node);
  if (expanded) {
    if (expandedByDefault) {
      state.collapsedDirectoryIds.delete(nodeId);
      state.hasCollapsedDirectoryOverrides = state.collapsedDirectoryIds.size > 0;
      return;
    }
    state.expandedDirectoryIds.add(nodeId);
    return;
  }
  if (expandedByDefault) {
    state.collapsedDirectoryIds.add(nodeId);
    state.hasCollapsedDirectoryOverrides = true;
    return;
  }
  state.expandedDirectoryIds.delete(nodeId);
}
function getOrCreateDirectoryLoadInfo(state, nodeId) {
  const existingInfo = state.directoryLoadInfoById.get(nodeId);
  if (existingInfo != null) return existingInfo;
  const nextInfo = {
    activeAttemptId: null,
    errorMessage: null,
    nextAttemptId: 1,
    state: "loaded"
  };
  state.directoryLoadInfoById.set(nodeId, nextInfo);
  return nextInfo;
}
function getDirectoryLoadState(state, nodeId) {
  return state.directoryLoadInfoById.get(nodeId)?.state ?? "loaded";
}
function beginDirectoryLoad(state, nodeId) {
  const loadInfo = getOrCreateDirectoryLoadInfo(state, nodeId);
  if (loadInfo.state === "loading" && loadInfo.activeAttemptId != null) return {
    attemptId: loadInfo.activeAttemptId,
    nodeId,
    reused: true
  };
  const attemptId = loadInfo.nextAttemptId;
  loadInfo.activeAttemptId = attemptId;
  loadInfo.errorMessage = null;
  loadInfo.nextAttemptId += 1;
  loadInfo.state = "loading";
  return {
    attemptId,
    nodeId,
    reused: false
  };
}
function markDirectoryUnloadedState(state, nodeId) {
  const loadInfo = getOrCreateDirectoryLoadInfo(state, nodeId);
  loadInfo.activeAttemptId = null;
  loadInfo.errorMessage = null;
  loadInfo.state = "unloaded";
}
function completeDirectoryLoad(state, nodeId, attemptId) {
  const loadInfo = state.directoryLoadInfoById.get(nodeId);
  if (loadInfo == null || loadInfo.activeAttemptId !== attemptId) return false;
  loadInfo.activeAttemptId = null;
  loadInfo.errorMessage = null;
  loadInfo.state = "loaded";
  return true;
}
function isDirectoryLoadAttemptCurrent(state, nodeId, attemptId) {
  return state.directoryLoadInfoById.get(nodeId)?.activeAttemptId === attemptId;
}
function failDirectoryLoad(state, nodeId, attemptId, errorMessage) {
  const loadInfo = state.directoryLoadInfoById.get(nodeId);
  if (loadInfo == null || loadInfo.activeAttemptId !== attemptId) return false;
  loadInfo.activeAttemptId = null;
  loadInfo.errorMessage = errorMessage ?? null;
  loadInfo.state = "error";
  return true;
}
function clearDirectoryLoadInfo(state, nodeId) {
  state.directoryLoadInfoById.delete(nodeId);
}
function subscribe(state, type, handler) {
  const rawHandler = handler;
  const existingListeners = state.listeners.get(type);
  if (existingListeners != null) existingListeners.add(rawHandler);
  else state.listeners.set(type, /* @__PURE__ */ new Set([rawHandler]));
  return () => {
    const listeners = state.listeners.get(type);
    if (listeners == null) return;
    listeners.delete(rawHandler);
    if (listeners.size === 0) state.listeners.delete(type);
  };
}
function createAddEvent(args) {
  return {
    affectedAncestorIds: args.affectedAncestorIds ?? [],
    affectedNodeIds: args.affectedNodeIds ?? [],
    canonicalChanged: true,
    operation: "add",
    path: args.path,
    projectionChanged: args.projectionChanged,
    visibleCountDelta: null
  };
}
function createRemoveEvent(args) {
  return {
    affectedAncestorIds: args.affectedAncestorIds ?? [],
    affectedNodeIds: args.affectedNodeIds ?? [],
    canonicalChanged: true,
    operation: "remove",
    path: args.path,
    projectionChanged: args.projectionChanged,
    recursive: args.recursive,
    visibleCountDelta: null
  };
}
function createMoveEvent(args) {
  return {
    affectedAncestorIds: args.affectedAncestorIds ?? [],
    affectedNodeIds: args.affectedNodeIds ?? [],
    canonicalChanged: true,
    from: args.from,
    operation: "move",
    projectionChanged: args.projectionChanged,
    to: args.to,
    visibleCountDelta: null
  };
}
function createExpandEvent(args) {
  return {
    affectedAncestorIds: args.affectedAncestorIds ?? [],
    affectedNodeIds: args.affectedNodeIds ?? [],
    canonicalChanged: false,
    operation: "expand",
    path: args.path,
    projectionChanged: true,
    visibleCountDelta: null
  };
}
function createCollapseEvent(args) {
  return {
    affectedAncestorIds: args.affectedAncestorIds ?? [],
    affectedNodeIds: args.affectedNodeIds ?? [],
    canonicalChanged: false,
    operation: "collapse",
    path: args.path,
    projectionChanged: true,
    visibleCountDelta: null
  };
}
function createMarkDirectoryUnloadedEvent(args) {
  return {
    affectedAncestorIds: args.affectedAncestorIds ?? [],
    affectedNodeIds: args.affectedNodeIds ?? [],
    canonicalChanged: false,
    operation: "mark-directory-unloaded",
    path: args.path,
    projectionChanged: args.projectionChanged,
    visibleCountDelta: null
  };
}
function createBeginChildLoadEvent(args) {
  return {
    affectedAncestorIds: args.affectedAncestorIds ?? [],
    affectedNodeIds: args.affectedNodeIds ?? [],
    attemptId: args.attemptId,
    canonicalChanged: false,
    operation: "begin-child-load",
    path: args.path,
    projectionChanged: args.projectionChanged,
    reused: args.reused,
    visibleCountDelta: null
  };
}
function createApplyChildPatchEvent(args) {
  return {
    affectedAncestorIds: args.affectedAncestorIds ?? [],
    affectedNodeIds: args.affectedNodeIds ?? [],
    attemptId: args.attemptId,
    canonicalChanged: args.childEvents.some((event) => event.canonicalChanged),
    childEvents: args.childEvents,
    operation: "apply-child-patch",
    path: args.path,
    projectionChanged: args.projectionChanged,
    visibleCountDelta: null
  };
}
function createCompleteChildLoadEvent(args) {
  return {
    affectedAncestorIds: args.affectedAncestorIds ?? [],
    affectedNodeIds: args.affectedNodeIds ?? [],
    attemptId: args.attemptId,
    canonicalChanged: false,
    operation: "complete-child-load",
    path: args.path,
    projectionChanged: args.projectionChanged,
    stale: args.stale,
    visibleCountDelta: null
  };
}
function createFailChildLoadEvent(args) {
  return {
    affectedAncestorIds: args.affectedAncestorIds ?? [],
    affectedNodeIds: args.affectedNodeIds ?? [],
    attemptId: args.attemptId,
    canonicalChanged: false,
    errorMessage: args.errorMessage,
    operation: "fail-child-load",
    path: args.path,
    projectionChanged: args.projectionChanged,
    stale: args.stale,
    visibleCountDelta: null
  };
}
function createCleanupEvent(args) {
  return {
    activeNodeCountAfter: args.activeNodeCountAfter,
    activeNodeCountBefore: args.activeNodeCountBefore,
    affectedAncestorIds: args.affectedAncestorIds ?? [],
    affectedNodeIds: args.affectedNodeIds ?? [],
    cachedPathEntryCountAfter: args.cachedPathEntryCountAfter,
    cachedPathEntryCountBefore: args.cachedPathEntryCountBefore,
    canonicalChanged: false,
    idsPreserved: args.idsPreserved,
    loadInfoEntryCountAfter: args.loadInfoEntryCountAfter,
    loadInfoEntryCountBefore: args.loadInfoEntryCountBefore,
    mode: args.mode,
    operation: "cleanup",
    projectionChanged: args.projectionChanged,
    reclaimedCachedPathEntryCount: args.reclaimedCachedPathEntryCount,
    reclaimedLoadInfoEntryCount: args.reclaimedLoadInfoEntryCount,
    reclaimedNodeSlotCount: args.reclaimedNodeSlotCount,
    reclaimedSegmentCount: args.reclaimedSegmentCount,
    segmentCountAfter: args.segmentCountAfter,
    segmentCountBefore: args.segmentCountBefore,
    totalNodeSlotCountAfter: args.totalNodeSlotCountAfter,
    totalNodeSlotCountBefore: args.totalNodeSlotCountBefore,
    visibleCountDelta: null
  };
}
function finalizeEvent(state, previousVisibleCount, event) {
  return {
    ...event,
    visibleCountDelta: getCurrentVisibleCount(state) - previousVisibleCount
  };
}
function batchEvents(state, run) {
  const previousVisibleCount = getCurrentVisibleCount(state);
  const frame = createTransactionFrame();
  state.transactionStack.push(frame);
  try {
    run();
  } catch (error) {
    finishTransaction(state, frame, false);
    throw error;
  }
  finishTransaction(state, frame, true, getCurrentVisibleCount(state) - previousVisibleCount);
}
function recordEvent(state, event) {
  const instrumentation = state.instrumentation;
  if (instrumentation == null) {
    recordEventNow(state, event);
    return;
  }
  withBenchmarkPhase(instrumentation, "store.events.record", () => recordEventNow(state, event));
}
function recordEventNow(state, event) {
  const currentFrame = state.transactionStack[state.transactionStack.length - 1] ?? null;
  if (currentFrame == null) {
    emitEvent(state, event);
    return;
  }
  currentFrame.events.push(event);
  mergeEventMetadataIntoFrame(currentFrame, event);
}
function finishTransaction(state, frame, emit, visibleCountDelta = null) {
  if (state.transactionStack.pop() !== frame) throw new Error("Transaction stack underflow");
  if (!emit) return;
  const parentFrame = state.transactionStack[state.transactionStack.length - 1] ?? null;
  if (parentFrame != null) {
    const instrumentation$1 = state.instrumentation;
    if (instrumentation$1 == null) mergeBatchFrameIntoParent(parentFrame, frame);
    else withBenchmarkPhase(instrumentation$1, "store.events.batch.merge", () => mergeBatchFrameIntoParent(parentFrame, frame));
    return;
  }
  const batchEvent = createBatchEvent(frame, visibleCountDelta);
  const instrumentation = state.instrumentation;
  if (instrumentation == null) {
    emitEvent(state, batchEvent);
    return;
  }
  withBenchmarkPhase(instrumentation, "store.events.batch.commit", () => emitEvent(state, batchEvent));
}
function createBatchEvent(frame, visibleCountDelta) {
  return {
    affectedAncestorIds: [...frame.affectedAncestorIds],
    affectedNodeIds: [...frame.affectedNodeIds],
    canonicalChanged: frame.events.some((event) => event.canonicalChanged),
    events: [...frame.events],
    operation: "batch",
    projectionChanged: frame.events.some((event) => event.projectionChanged),
    visibleCountDelta
  };
}
function mergeFrameMetadata(target, source) {
  for (const nodeId of source.affectedAncestorIds) target.affectedAncestorIds.add(nodeId);
  for (const nodeId of source.affectedNodeIds) target.affectedNodeIds.add(nodeId);
}
function mergeBatchFrameIntoParent(parentFrame, frame) {
  for (const event of frame.events) parentFrame.events.push(event);
  mergeFrameMetadata(parentFrame, frame);
}
function mergeEventMetadataIntoFrame(frame, event) {
  for (const nodeId of event.affectedNodeIds) frame.affectedNodeIds.add(nodeId);
  for (const nodeId of event.affectedAncestorIds) frame.affectedAncestorIds.add(nodeId);
}
function emitEvent(state, event) {
  const instrumentation = state.instrumentation;
  if (instrumentation == null) {
    emitEventNow(state, event);
    return;
  }
  withBenchmarkPhase(instrumentation, "store.events.emit", () => emitEventNow(state, event));
}
function emitEventNow(state, event) {
  state.listeners.get(event.operation)?.forEach((handler) => handler(event));
  state.listeners.get("*")?.forEach((handler) => handler(event));
}
function getCurrentVisibleCount(state) {
  return state.snapshot.nodes[state.snapshot.rootId]?.visibleSubtreeCount ?? 0;
}
function getFlattenedChildDirectoryId(state, directoryNodeId) {
  if (state.snapshot.options.flattenEmptyDirectories !== true) return null;
  const directoryNode = state.snapshot.nodes[directoryNodeId];
  if (directoryNode == null || !isDirectoryNode(directoryNode) || hasNodeFlag(directoryNode, PATH_STORE_NODE_FLAG_ROOT)) return null;
  const directoryIndex = state.snapshot.directories.get(directoryNodeId);
  if (directoryIndex == null || directoryIndex.childIds.length !== 1) return null;
  const childId = directoryIndex.childIds[0];
  if (childId == null) return null;
  const childNode = state.snapshot.nodes[childId];
  if (childNode == null || !isDirectoryNode(childNode)) return null;
  return childId;
}
function getFlattenedTerminalDirectoryId(state, directoryNodeId) {
  let currentDirectoryId = directoryNodeId;
  while (true) {
    const nextDirectoryId = getFlattenedChildDirectoryId(state, currentDirectoryId);
    if (nextDirectoryId == null) return currentDirectoryId;
    currentDirectoryId = nextDirectoryId;
  }
}
function collectFlattenedDirectoryChainIds(state, directoryNodeId) {
  const chainIds = [directoryNodeId];
  let currentDirectoryId = directoryNodeId;
  while (true) {
    const nextDirectoryId = getFlattenedChildDirectoryId(state, currentDirectoryId);
    if (nextDirectoryId == null) return chainIds;
    chainIds.push(nextDirectoryId);
    currentDirectoryId = nextDirectoryId;
  }
}
function listPaths(state, path) {
  const nodeId = path == null ? state.snapshot.rootId : findNodeId(state, path);
  if (nodeId == null) return [];
  return collectCanonicalEntries(state, nodeId);
}
function addPath(state, path) {
  const preparedPath = parseInputPath(path);
  const parentSegments = preparedPath.isDirectory ? preparedPath.segments : preparedPath.segments.slice(0, -1);
  const previousProjectionSignature = getCollapsedProjectionSignature(state, findDeepestExistingDirectoryId(state, parentSegments));
  const { createdNodeIds, directoryId } = ensureDirectoryChain(state, parentSegments);
  const affectedNodeIds = new Set(createdNodeIds);
  let addedNodeId = directoryId;
  if (preparedPath.isDirectory) {
    const directoryNode = requireNode(state, directoryId);
    if (hasNodeFlag(directoryNode, PATH_STORE_NODE_FLAG_EXPLICIT)) throw new Error(`Path already exists: "${path}"`);
    addNodeFlag(directoryNode, PATH_STORE_NODE_FLAG_EXPLICIT);
    state.pathCacheByNodeId.set(directoryId, {
      path,
      version: state.pathCacheVersion
    });
    affectedNodeIds.add(directoryId);
  } else {
    addedNodeId = createFileNode(state, directoryId, preparedPath.basename);
    affectedNodeIds.add(addedNodeId);
  }
  recomputeCountsUpwardFrom(state, directoryId);
  const nextProjectionSignature = getCollapsedProjectionSignature(state, directoryId);
  return createAddEvent({
    affectedAncestorIds: collectAncestorIds(state, addedNodeId),
    affectedNodeIds: [...affectedNodeIds],
    path,
    projectionChanged: didProjectionChange(previousProjectionSignature, nextProjectionSignature)
  });
}
function removePath(state, path, options) {
  const nodeId = findNodeId(state, path);
  if (nodeId == null) throw new Error(`Path does not exist: "${path}"`);
  const node = requireNode(state, nodeId);
  if (hasNodeFlag(node, PATH_STORE_NODE_FLAG_ROOT)) throw new Error("The root node cannot be removed");
  if (isDirectoryNode(node) && getDirectoryIndex(state, nodeId).childIds.length > 0 && options.recursive !== true) throw new Error(`Cannot remove a non-empty directory without recursive: "${path}"`);
  const parentId = node.parentId;
  const previousProjectionSignature = getCollapsedProjectionSignature(state, parentId);
  const removedNodeIds = removeSubtree(state, nodeId);
  removeChildReference(state, parentId, nodeId, node.nameId);
  promoteEmptyAncestorsToExplicit(state, parentId);
  recomputeCountsUpwardFrom(state, parentId);
  const nextProjectionSignature = getCollapsedProjectionSignature(state, parentId);
  return createRemoveEvent({
    affectedAncestorIds: collectAncestorIds(state, parentId),
    affectedNodeIds: removedNodeIds,
    path,
    projectionChanged: didProjectionChange(previousProjectionSignature, nextProjectionSignature),
    recursive: options.recursive === true
  });
}
function movePath(state, fromPath, toPath, options) {
  const sourceNodeId = findNodeId(state, fromPath);
  if (sourceNodeId == null) throw new Error(`Source path does not exist: "${fromPath}"`);
  const sourceNode = requireNode(state, sourceNodeId);
  if (hasNodeFlag(sourceNode, PATH_STORE_NODE_FLAG_ROOT)) throw new Error("The root node cannot be moved");
  const collision = options.collision ?? "error";
  const moveTarget = resolveMoveTarget(state, sourceNodeId, toPath);
  const previousSourceProjectionSignature = getCollapsedProjectionSignature(state, sourceNode.parentId);
  const previousTargetProjectionSignature = getCollapsedProjectionSignature(state, moveTarget.parentId);
  const sourceName = getSegmentValue(state.snapshot.segmentTable, sourceNode.nameId);
  const targetNameId = internSegment(state.snapshot.segmentTable, moveTarget.basename);
  if (moveTarget.parentId === sourceNode.parentId && sourceName === moveTarget.basename) return null;
  if (isDirectoryNode(sourceNode) && isAncestor(state, sourceNodeId, moveTarget.parentId)) throw new Error("Cannot move a directory into one of its descendants");
  const siblingCollisionId = ensureChildIdByNameId(state.snapshot.nodes, getDirectoryIndex(state, moveTarget.parentId)).get(targetNameId);
  const collisionNodeId = moveTarget.existingNodeId ?? siblingCollisionId ?? null;
  if (collisionNodeId != null && collisionNodeId !== sourceNodeId) {
    if (handleMoveCollision(state, collisionNodeId, collision, getNodeKind(sourceNode)) === "skip") return null;
  }
  const previousParentId = sourceNode.parentId;
  removeChildReference(state, previousParentId, sourceNodeId, sourceNode.nameId);
  sourceNode.parentId = moveTarget.parentId;
  sourceNode.nameId = targetNameId;
  state.pathCacheByNodeId.delete(sourceNodeId);
  recomputeDepths(state, sourceNodeId);
  insertChildReference(state, moveTarget.parentId, sourceNodeId);
  promoteEmptyAncestorsToExplicit(state, previousParentId);
  state.pathCacheVersion++;
  recomputeCountsUpwardFrom(state, previousParentId);
  if (moveTarget.parentId !== previousParentId) recomputeCountsUpwardFrom(state, moveTarget.parentId);
  const nextSourceProjectionSignature = getCollapsedProjectionSignature(state, previousParentId);
  const nextTargetProjectionSignature = getCollapsedProjectionSignature(state, moveTarget.parentId);
  return createMoveEvent({
    affectedAncestorIds: [.../* @__PURE__ */ new Set([...collectAncestorIds(state, previousParentId), ...collectAncestorIds(state, moveTarget.parentId)])],
    affectedNodeIds: [sourceNodeId],
    from: fromPath,
    projectionChanged: didAnyProjectionChange([previousSourceProjectionSignature, previousTargetProjectionSignature], [nextSourceProjectionSignature, nextTargetProjectionSignature]),
    to: materializeNodePath(state, sourceNodeId)
  });
}
function getCachedNodePath(state, nodeId) {
  const cachedEntry = state.pathCacheByNodeId.get(nodeId);
  return cachedEntry != null && cachedEntry.version === state.pathCacheVersion ? cachedEntry.path : null;
}
function setCachedNodePath(state, nodeId, path) {
  state.pathCacheByNodeId.set(nodeId, {
    path,
    version: state.pathCacheVersion
  });
  return path;
}
function materializeNodePath(state, nodeId) {
  const node = requireNode(state, nodeId);
  const cachedPath = getCachedNodePath(state, nodeId);
  if (cachedPath != null) return cachedPath;
  if (hasNodeFlag(node, PATH_STORE_NODE_FLAG_ROOT)) return setCachedNodePath(state, nodeId, "");
  const parentPath = materializeNodePath(state, node.parentId);
  const nodeName = getSegmentValue(state.snapshot.segmentTable, node.nameId);
  const path = parentPath.length === 0 ? nodeName : `${parentPath}${nodeName}`;
  return setCachedNodePath(state, nodeId, isDirectoryNode(node) ? `${path}/` : path);
}
function recomputeCountsUpwardFrom(state, startNodeId) {
  const instrumentation = state.instrumentation;
  if (instrumentation == null) {
    recomputeCountsUpwardFromNow(state, startNodeId);
    return;
  }
  withBenchmarkPhase(instrumentation, "store.recomputeCountsUpwardFrom", () => recomputeCountsUpwardFromNow(state, startNodeId));
}
function recomputeCountsRecursive(state, nodeId) {
  const stack = [[nodeId, 0]];
  const { nodes, directories } = state.snapshot;
  while (stack.length > 0) {
    const frame = stack[stack.length - 1];
    const nid = frame[0];
    const node = nodes[nid];
    if (node == null || !isDirectoryNode(node)) {
      recomputeNodeCounts(state, nid, node, true);
      stack.pop();
      continue;
    }
    const dirIndex = directories.get(nid);
    if (dirIndex == null || frame[1] >= dirIndex.childIds.length) {
      recomputeNodeCounts(state, nid, node, true);
      stack.pop();
      continue;
    }
    const childId = dirIndex.childIds[frame[1]++];
    stack.push([childId, 0]);
  }
}
function collectAncestorIds(state, nodeId) {
  const ancestorIds = [];
  let currentNodeId = nodeId;
  while (currentNodeId != null) {
    const currentNode = requireNode(state, currentNodeId);
    ancestorIds.push(currentNodeId);
    if (currentNodeId === state.snapshot.rootId) break;
    currentNodeId = currentNode.parentId;
  }
  return ancestorIds;
}
function findNodeId(state, path) {
  if (path.length === 0) return state.snapshot.rootId;
  const lookupPath = parseLookupPath(path);
  return findNodeIdBySegments(state, lookupPath.segments, lookupPath.requiresDirectory);
}
function findNodeIdBySegments(state, segments, requireDirectory) {
  let currentNodeId = state.snapshot.rootId;
  for (const segment of segments) {
    const segmentId = state.snapshot.segmentTable.idByValue.get(segment);
    if (segmentId === void 0) return null;
    const currentIndex = getDirectoryIndex(state, currentNodeId);
    const nextNodeId = ensureChildIdByNameId(state.snapshot.nodes, currentIndex).get(segmentId);
    if (nextNodeId === void 0) return null;
    currentNodeId = nextNodeId;
  }
  const currentNode = requireNode(state, currentNodeId);
  if (requireDirectory && !isDirectoryNode(currentNode)) return null;
  return currentNodeId;
}
function getDirectoryIndex(state, directoryId) {
  const directoryIndex = state.snapshot.directories.get(directoryId);
  if (directoryIndex === void 0) throw new Error(`Unknown directory child index for node ${String(directoryId)}`);
  return directoryIndex;
}
function requireNode(state, nodeId) {
  const node = state.snapshot.nodes[nodeId];
  if (node === void 0 || hasNodeFlag(node, PATH_STORE_NODE_FLAG_REMOVED)) throw new Error(`Unknown node ID: ${String(nodeId)}`);
  return node;
}
function collectCanonicalEntries(state, nodeId) {
  const rootNode = state.snapshot.nodes[nodeId];
  if (rootNode === void 0 || hasNodeFlag(rootNode, PATH_STORE_NODE_FLAG_REMOVED)) return [];
  if (!isDirectoryNode(rootNode)) return [materializeNodePath(state, nodeId)];
  if (getDirectoryIndex(state, nodeId).childIds.length === 0) return hasNodeFlag(rootNode, PATH_STORE_NODE_FLAG_EXPLICIT) && !hasNodeFlag(rootNode, PATH_STORE_NODE_FLAG_ROOT) ? [materializeNodePath(state, nodeId)] : [];
  const entries = [];
  const stack = [{
    childIndex: 0,
    nodeId
  }];
  while (stack.length > 0) {
    const frame = stack[stack.length - 1];
    if (frame == null) break;
    const currentNode = state.snapshot.nodes[frame.nodeId];
    if (currentNode === void 0 || hasNodeFlag(currentNode, PATH_STORE_NODE_FLAG_REMOVED)) {
      stack.pop();
      continue;
    }
    if (!isDirectoryNode(currentNode)) {
      entries.push(materializeNodePath(state, frame.nodeId));
      stack.pop();
      continue;
    }
    const currentIndex = getDirectoryIndex(state, frame.nodeId);
    if (currentIndex.childIds.length === 0) {
      if (hasNodeFlag(currentNode, PATH_STORE_NODE_FLAG_EXPLICIT) && !hasNodeFlag(currentNode, PATH_STORE_NODE_FLAG_ROOT)) entries.push(materializeNodePath(state, frame.nodeId));
      stack.pop();
      continue;
    }
    const nextChildId = currentIndex.childIds[frame.childIndex];
    if (nextChildId == null) {
      stack.pop();
      continue;
    }
    frame.childIndex++;
    stack.push({
      childIndex: 0,
      nodeId: nextChildId
    });
  }
  return entries;
}
function ensureDirectoryChain(state, directorySegments) {
  const createdNodeIds = [];
  let currentDirectoryId = state.snapshot.rootId;
  for (const segment of directorySegments) {
    const segmentId = internSegment(state.snapshot.segmentTable, segment);
    const currentIndex = getDirectoryIndex(state, currentDirectoryId);
    const existingChildId = ensureChildIdByNameId(state.snapshot.nodes, currentIndex).get(segmentId);
    if (existingChildId !== void 0) {
      if (!isDirectoryNode(requireNode(state, existingChildId))) throw new Error(`Cannot create a directory that collides with an existing file: "${segment}"`);
      currentDirectoryId = existingChildId;
      continue;
    }
    currentDirectoryId = createDirectoryNode(state, currentDirectoryId, segmentId);
    createdNodeIds.push(currentDirectoryId);
  }
  return {
    createdNodeIds,
    directoryId: currentDirectoryId
  };
}
function createDirectoryNode(state, parentId, nameId) {
  const parentNode = requireNode(state, parentId);
  const nodeId = state.snapshot.nodes.length;
  state.snapshot.nodes.push({
    depthAndFlags: createNodeDepthAndFlags(getNodeDepth(parentNode) + 1, 0, PATH_STORE_NODE_KIND_DIRECTORY),
    nameId,
    parentId,
    subtreeNodeCount: 1,
    visibleSubtreeCount: 1
  });
  state.snapshot.directories.set(nodeId, createDirectoryChildIndex());
  insertChildReference(state, parentId, nodeId);
  if (state.collapseNewDirectoriesByDefault) {
    state.collapsedDirectoryIds.add(nodeId);
    state.hasCollapsedDirectoryOverrides = true;
  }
  state.activeNodeCount++;
  return nodeId;
}
function createFileNode(state, parentId, basename) {
  const nameId = internSegment(state.snapshot.segmentTable, basename);
  const parentIndex = getDirectoryIndex(state, parentId);
  if (ensureChildIdByNameId(state.snapshot.nodes, parentIndex).has(nameId)) throw new Error(`Path already exists: "${buildPathPreview(state, parentId, basename)}"`);
  const parentNode = requireNode(state, parentId);
  const nodeId = state.snapshot.nodes.length;
  state.snapshot.nodes.push({
    depthAndFlags: createNodeDepthAndFlags(getNodeDepth(parentNode) + 1, 0),
    nameId,
    parentId,
    subtreeNodeCount: 1,
    visibleSubtreeCount: 1
  });
  insertChildReference(state, parentId, nodeId);
  state.activeNodeCount++;
  return nodeId;
}
function findChildInsertIndex(state, parentIndex, childId) {
  let low = 0;
  let high = parentIndex.childIds.length;
  while (low < high) {
    const middle = low + high >>> 1;
    const existingChildId = parentIndex.childIds[middle];
    if (existingChildId == null) {
      high = middle;
      continue;
    }
    if (compareSiblingNodes(state, childId, existingChildId) < 0) high = middle;
    else low = middle + 1;
  }
  return low;
}
function insertChildReference(state, parentId, childId) {
  const parentIndex = getDirectoryIndex(state, parentId);
  const childNode = requireNode(state, childId);
  ensureChildIdByNameId(state.snapshot.nodes, parentIndex).set(childNode.nameId, childId);
  applyChildAggregateDelta(parentIndex, childId, childNode.subtreeNodeCount, childNode.visibleSubtreeCount);
  const insertIndex = findChildInsertIndex(state, parentIndex, childId);
  parentIndex.childIds.splice(insertIndex, 0, childId);
  updateChildPositionsFrom(parentIndex, insertIndex);
  rebuildVisibleChildChunks(state.snapshot.nodes, parentIndex);
}
function removeChildReference(state, parentId, childId, childNameId) {
  const parentIndex = getDirectoryIndex(state, parentId);
  const positions = ensureChildPositions(parentIndex);
  const childIndex = positions.get(childId) ?? -1;
  ensureChildIdByNameId(state.snapshot.nodes, parentIndex).delete(childNameId);
  positions.delete(childId);
  const childNode = state.snapshot.nodes[childId];
  if (childNode != null) applyChildAggregateDelta(parentIndex, childId, -childNode.subtreeNodeCount, -childNode.visibleSubtreeCount);
  if (childIndex >= 0) {
    parentIndex.childIds.splice(childIndex, 1);
    updateChildPositionsFrom(parentIndex, childIndex);
    rebuildVisibleChildChunks(state.snapshot.nodes, parentIndex);
  }
}
function compareSiblingNodes(state, leftId, rightId) {
  const sortOption = state.snapshot.options.sort;
  if (sortOption === "default") return compareSiblingNodesDefault(state, leftId, rightId);
  return sortOption(createCompareEntry(state, leftId), createCompareEntry(state, rightId));
}
function compareSiblingNodesDefault(state, leftId, rightId) {
  const leftNode = requireNode(state, leftId);
  const rightNode = requireNode(state, rightId);
  const leftIsDirectory = isDirectoryNode(leftNode);
  if (leftIsDirectory !== isDirectoryNode(rightNode)) return leftIsDirectory ? -1 : 1;
  const comparison = compareSegmentSortKeys(getSegmentSortKey(state.snapshot.segmentTable, leftNode.nameId), getSegmentSortKey(state.snapshot.segmentTable, rightNode.nameId));
  if (comparison !== 0) return comparison;
  const leftName = getSegmentValue(state.snapshot.segmentTable, leftNode.nameId);
  const rightName = getSegmentValue(state.snapshot.segmentTable, rightNode.nameId);
  if (leftName !== rightName) return leftName < rightName ? -1 : 1;
  return leftId < rightId ? -1 : 1;
}
function createCompareEntry(state, nodeId) {
  const node = requireNode(state, nodeId);
  const path = materializeNodePath(state, nodeId);
  const isDirectory = isDirectoryNode(node);
  const normalizedPath = isDirectory ? path.slice(0, -1) : path;
  return {
    basename: getSegmentValue(state.snapshot.segmentTable, node.nameId),
    depth: getNodeDepth(node),
    isDirectory,
    path,
    segments: normalizedPath.length === 0 ? [] : normalizedPath.split("/")
  };
}
function resolveMoveTarget(state, sourceNodeId, toPath) {
  const sourceNode = requireNode(state, sourceNodeId);
  const existingDestinationId = findNodeId(state, toPath);
  if (existingDestinationId != null) {
    const existingDestination = requireNode(state, existingDestinationId);
    if (isDirectoryNode(existingDestination)) return {
      basename: getSegmentValue(state.snapshot.segmentTable, sourceNode.nameId),
      existingNodeId: null,
      parentId: existingDestinationId
    };
    const destinationSegments = parseLookupPath(toPath).segments;
    return {
      basename: destinationSegments[destinationSegments.length - 1] ?? "",
      existingNodeId: existingDestinationId,
      parentId: existingDestination.parentId
    };
  }
  const destinationLookup = parseLookupPath(toPath);
  const basename = destinationLookup.segments[destinationLookup.segments.length - 1] ?? "";
  const parentSegments = destinationLookup.segments.slice(0, -1);
  const parentId = parentSegments.length === 0 ? state.snapshot.rootId : findNodeIdBySegments(state, parentSegments, true);
  if (parentId == null) throw new Error(`Destination parent does not exist: "${toPath}"`);
  return {
    basename,
    existingNodeId: null,
    parentId
  };
}
function handleMoveCollision(state, collisionNodeId, strategy, sourceKind) {
  if (strategy === "skip") return "skip";
  if (strategy === "error") throw new Error(`Destination already exists: "${materializeNodePath(state, collisionNodeId)}"`);
  const collisionNode = requireNode(state, collisionNodeId);
  if (getNodeKind(collisionNode) !== sourceKind) throw new Error("replace collision requires the same source and destination kinds");
  if (isDirectoryNode(collisionNode) && getDirectoryIndex(state, collisionNodeId).childIds.length > 0) throw new Error("replace collision does not support non-empty directories");
  const collisionParentId = collisionNode.parentId;
  const collisionNameId = collisionNode.nameId;
  removeSubtree(state, collisionNodeId);
  removeChildReference(state, collisionParentId, collisionNodeId, collisionNameId);
  promoteEmptyAncestorsToExplicit(state, collisionParentId);
  recomputeCountsUpwardFrom(state, collisionParentId);
  return "handled";
}
function removeSubtree(state, nodeId) {
  const removedNodeIds = [];
  const stack = [{
    nodeId,
    visitedChildren: false
  }];
  while (stack.length > 0) {
    const frame = stack.pop();
    if (frame == null) break;
    const node = requireNode(state, frame.nodeId);
    if (frame.visitedChildren || !isDirectoryNode(node)) {
      if (isDirectoryNode(node)) state.snapshot.directories.delete(frame.nodeId);
      addNodeFlag(node, PATH_STORE_NODE_FLAG_REMOVED);
      state.pathCacheByNodeId.delete(frame.nodeId);
      if (state.collapsedDirectoryIds.delete(frame.nodeId)) state.hasCollapsedDirectoryOverrides = state.collapsedDirectoryIds.size > 0;
      state.expandedDirectoryIds.delete(frame.nodeId);
      clearDirectoryLoadInfo(state, frame.nodeId);
      state.activeNodeCount--;
      removedNodeIds.push(frame.nodeId);
      continue;
    }
    stack.push({
      nodeId: frame.nodeId,
      visitedChildren: true
    });
    const directoryIndex = getDirectoryIndex(state, frame.nodeId);
    for (let childIndex = directoryIndex.childIds.length - 1; childIndex >= 0; childIndex--) {
      const childId = directoryIndex.childIds[childIndex];
      if (childId != null) stack.push({
        nodeId: childId,
        visitedChildren: false
      });
    }
  }
  return removedNodeIds;
}
function promoteEmptyAncestorsToExplicit(state, startDirectoryId) {
  let currentDirectoryId = startDirectoryId;
  while (currentDirectoryId != null) {
    const currentNode = requireNode(state, currentDirectoryId);
    if (!isDirectoryNode(currentNode) || hasNodeFlag(currentNode, PATH_STORE_NODE_FLAG_ROOT)) return;
    if (getDirectoryIndex(state, currentDirectoryId).childIds.length > 0) return;
    addNodeFlag(currentNode, PATH_STORE_NODE_FLAG_EXPLICIT);
    currentDirectoryId = currentNode.parentId === currentDirectoryId ? null : currentNode.parentId;
  }
}
function findDeepestExistingDirectoryId(state, segments) {
  let currentDirectoryId = state.snapshot.rootId;
  for (const segment of segments) {
    const segmentId = state.snapshot.segmentTable.idByValue.get(segment);
    if (segmentId == null) break;
    const nextNodeId = ensureChildIdByNameId(state.snapshot.nodes, getDirectoryIndex(state, currentDirectoryId)).get(segmentId);
    if (nextNodeId == null) break;
    if (!isDirectoryNode(requireNode(state, nextNodeId))) break;
    currentDirectoryId = nextNodeId;
  }
  return currentDirectoryId;
}
function getCollapsedProjectionSignature(state, startDirectoryId) {
  const collapsedAncestorId = findNearestCollapsedAncestor(state, startDirectoryId);
  if (collapsedAncestorId == null) return null;
  const terminalDirectoryId = getFlattenedTerminalDirectoryId(state, collapsedAncestorId);
  const terminalNode = requireNode(state, terminalDirectoryId);
  const flattenedSegmentPaths = collapsedAncestorId === terminalDirectoryId ? null : collectFlattenedDirectoryChainIds(state, collapsedAncestorId).map((nodeId) => materializeNodePath(state, nodeId));
  return JSON.stringify({
    flattenedSegmentPaths,
    hasChildren: getDirectoryIndex(state, terminalDirectoryId).childIds.length > 0,
    path: materializeNodePath(state, terminalDirectoryId),
    terminalKind: getNodeKind(terminalNode)
  });
}
function didProjectionChange(previousProjectionSignature, nextProjectionSignature) {
  return didAnyProjectionChange([previousProjectionSignature], [nextProjectionSignature]);
}
function didAnyProjectionChange(previousProjectionSignatures, nextProjectionSignatures) {
  for (let index = 0; index < previousProjectionSignatures.length; index += 1) {
    const previousProjectionSignature = previousProjectionSignatures[index];
    const nextProjectionSignature = nextProjectionSignatures[index];
    if (previousProjectionSignature == null || nextProjectionSignature == null || previousProjectionSignature !== nextProjectionSignature) return true;
  }
  return false;
}
function findNearestCollapsedAncestor(state, startDirectoryId) {
  let currentDirectoryId = startDirectoryId;
  while (currentDirectoryId != null) {
    const currentNode = requireNode(state, currentDirectoryId);
    if (!isDirectoryNode(currentNode) || hasNodeFlag(currentNode, PATH_STORE_NODE_FLAG_ROOT)) return null;
    if (!isDirectoryExpanded(state, currentDirectoryId, currentNode)) return currentDirectoryId;
    currentDirectoryId = currentNode.parentId;
  }
  return null;
}
function recomputeDepths(state, nodeId) {
  const node = requireNode(state, nodeId);
  setNodeDepth(node, (nodeId === state.snapshot.rootId ? -1 : getNodeDepth(requireNode(state, node.parentId))) + 1);
  if (!isDirectoryNode(node)) return;
  const directoryIndex = getDirectoryIndex(state, nodeId);
  for (const childId of directoryIndex.childIds) recomputeDepths(state, childId);
}
function isAncestor(state, ancestorNodeId, nodeId) {
  let currentNodeId = nodeId;
  while (currentNodeId != null) {
    if (currentNodeId === ancestorNodeId) return true;
    const currentNode = requireNode(state, currentNodeId);
    if (currentNodeId === state.snapshot.rootId) return false;
    currentNodeId = currentNode.parentId;
  }
  return false;
}
function recomputeNodeCounts(state, nodeId, currentNode = requireNode(state, nodeId), rebuildChildAggregates = false) {
  const instrumentation = state.instrumentation;
  if (instrumentation == null) {
    recomputeNodeCountsNow(state, nodeId, currentNode, rebuildChildAggregates);
    return;
  }
  withBenchmarkPhase(instrumentation, "store.recomputeNodeCounts", () => recomputeNodeCountsNow(state, nodeId, currentNode, rebuildChildAggregates));
}
function recomputeCountsUpwardFromNow(state, startNodeId) {
  let currentNodeId = startNodeId;
  while (currentNodeId != null) {
    const currentNode = requireNode(state, currentNodeId);
    const previousSubtreeNodeCount = currentNode.subtreeNodeCount;
    const previousVisibleSubtreeCount = currentNode.visibleSubtreeCount;
    recomputeNodeCounts(state, currentNodeId, currentNode);
    if (currentNodeId === state.snapshot.rootId) return;
    const subtreeNodeDelta = currentNode.subtreeNodeCount - previousSubtreeNodeCount;
    const visibleSubtreeDelta = currentNode.visibleSubtreeCount - previousVisibleSubtreeCount;
    const parentId = currentNode.parentId;
    if (subtreeNodeDelta !== 0 || visibleSubtreeDelta !== 0) applyChildAggregateDelta(getDirectoryIndex(state, parentId), currentNodeId, subtreeNodeDelta, visibleSubtreeDelta);
    currentNodeId = parentId;
  }
}
function recomputeNodeCountsNow(state, nodeId, currentNode, rebuildChildAggregates) {
  if (!isDirectoryNode(currentNode)) {
    currentNode.subtreeNodeCount = 1;
    currentNode.visibleSubtreeCount = 1;
    return;
  }
  const currentIndex = getDirectoryIndex(state, nodeId);
  if (rebuildChildAggregates) {
    const instrumentation = state.instrumentation;
    if (instrumentation == null) rebuildDirectoryChildAggregates(state.snapshot.nodes, currentIndex);
    else withBenchmarkPhase(instrumentation, "store.recomputeNodeCounts.rebuildChildAggregates", () => rebuildDirectoryChildAggregates(state.snapshot.nodes, currentIndex));
  }
  const subtreeNodeCount = 1 + currentIndex.totalChildSubtreeNodeCount;
  const visibleChildCount = currentIndex.totalChildVisibleSubtreeCount;
  currentNode.subtreeNodeCount = subtreeNodeCount;
  if (hasNodeFlag(currentNode, PATH_STORE_NODE_FLAG_ROOT)) {
    currentNode.visibleSubtreeCount = visibleChildCount;
    return;
  }
  currentNode.visibleSubtreeCount = getFlattenedChildDirectoryId(state, nodeId) != null ? visibleChildCount : isDirectoryExpanded(state, nodeId, currentNode) ? 1 + visibleChildCount : 1;
}
function buildPathPreview(state, parentId, basename) {
  const parentPath = materializeNodePath(state, parentId);
  return parentPath.length === 0 ? basename : `${parentPath}${basename}`;
}
function isLiveNode(node) {
  return node != null && !hasNodeFlag(node, PATH_STORE_NODE_FLAG_REMOVED);
}
function isLiveDirectoryNode(state, nodeId) {
  const node = state.snapshot.nodes[nodeId];
  if (!isLiveNode(node) || !isDirectoryNode(node) || hasNodeFlag(node, PATH_STORE_NODE_FLAG_ROOT)) return null;
  return node;
}
function countCachedPathEntries(state) {
  let cachedPathEntryCount = 0;
  for (const [nodeId, cachedEntry] of state.pathCacheByNodeId) {
    if (cachedEntry.version !== state.pathCacheVersion) continue;
    if (!isLiveNode(state.snapshot.nodes[nodeId])) continue;
    cachedPathEntryCount += 1;
  }
  return cachedPathEntryCount;
}
function countSegmentEntries(segmentTable) {
  return Math.max(0, segmentTable.valueById.length - 1);
}
function createCleanupMetricSnapshot(state) {
  return {
    activeNodeCount: state.activeNodeCount,
    cachedPathEntryCount: countCachedPathEntries(state),
    loadInfoEntryCount: state.directoryLoadInfoById.size,
    segmentCount: countSegmentEntries(state.snapshot.segmentTable),
    totalNodeSlotCount: Math.max(0, state.snapshot.nodes.length - 1)
  };
}
function createCleanupResult(mode, idsPreserved, before, after) {
  return {
    activeNodeCountAfter: after.activeNodeCount,
    activeNodeCountBefore: before.activeNodeCount,
    cachedPathEntryCountAfter: after.cachedPathEntryCount,
    cachedPathEntryCountBefore: before.cachedPathEntryCount,
    idsPreserved,
    loadInfoEntryCountAfter: after.loadInfoEntryCount,
    loadInfoEntryCountBefore: before.loadInfoEntryCount,
    mode,
    reclaimedCachedPathEntryCount: before.cachedPathEntryCount - after.cachedPathEntryCount,
    reclaimedLoadInfoEntryCount: before.loadInfoEntryCount - after.loadInfoEntryCount,
    reclaimedNodeSlotCount: before.totalNodeSlotCount - after.totalNodeSlotCount,
    reclaimedSegmentCount: before.segmentCount - after.segmentCount,
    segmentCountAfter: after.segmentCount,
    segmentCountBefore: before.segmentCount,
    totalNodeSlotCountAfter: after.totalNodeSlotCount,
    totalNodeSlotCountBefore: before.totalNodeSlotCount
  };
}
function collectExpansionOverridePaths(state) {
  const collapsedPaths = [];
  const expandedPaths = [];
  for (const nodeId of state.collapsedDirectoryIds) if (isLiveDirectoryNode(state, nodeId) != null) collapsedPaths.push(materializeNodePath(state, nodeId));
  for (const nodeId of state.expandedDirectoryIds) if (isLiveDirectoryNode(state, nodeId) != null) expandedPaths.push(materializeNodePath(state, nodeId));
  return {
    collapsedPaths,
    expandedPaths
  };
}
function collectDirectoryLoadInfos(state) {
  const retainedInfos = [];
  for (const [nodeId, info] of state.directoryLoadInfoById) {
    if (isLiveDirectoryNode(state, nodeId) == null || getDirectoryLoadState(state, nodeId) === "loaded") continue;
    retainedInfos.push({
      info: {
        activeAttemptId: null,
        errorMessage: info.errorMessage,
        nextAttemptId: info.nextAttemptId,
        state: info.state
      },
      path: materializeNodePath(state, nodeId)
    });
  }
  return retainedInfos;
}
function restoreExpansionOverridePaths(state, persistedExpansionState) {
  state.collapsedDirectoryIds.clear();
  state.hasCollapsedDirectoryOverrides = false;
  state.expandedDirectoryIds.clear();
  for (const path of persistedExpansionState.expandedPaths) {
    const nodeId = findNodeId(state, path);
    if (nodeId == null) continue;
    setDirectoryExpanded(state, nodeId, true, requireNode(state, nodeId));
  }
  for (const path of persistedExpansionState.collapsedPaths) {
    const nodeId = findNodeId(state, path);
    if (nodeId == null) continue;
    setDirectoryExpanded(state, nodeId, false, requireNode(state, nodeId));
  }
}
function restoreDirectoryLoadInfos(state, persistedLoadInfos) {
  state.directoryLoadInfoById.clear();
  for (const retainedInfo of persistedLoadInfos) {
    const nodeId = findNodeId(state, retainedInfo.path);
    if (nodeId == null) continue;
    if (isLiveDirectoryNode(state, nodeId) == null) continue;
    state.directoryLoadInfoById.set(nodeId, {
      activeAttemptId: null,
      errorMessage: retainedInfo.info.errorMessage,
      nextAttemptId: retainedInfo.info.nextAttemptId,
      state: retainedInfo.info.state
    });
  }
}
function clearPathCaches(state) {
  state.pathCacheVersion += 1;
  state.pathCacheByNodeId.clear();
  state.pathCacheByNodeId.set(state.snapshot.rootId, {
    path: "",
    version: state.pathCacheVersion
  });
}
function rebuildSegmentTablePreservingNodeIds(state) {
  const previousSegmentTable = state.snapshot.segmentTable;
  const nextSegmentTable = createSegmentTable();
  for (const node of state.snapshot.nodes) {
    if (!isLiveNode(node)) continue;
    if (hasNodeFlag(node, PATH_STORE_NODE_FLAG_ROOT)) {
      node.nameId = 0;
      continue;
    }
    node.nameId = internSegment(nextSegmentTable, getSegmentValue(previousSegmentTable, node.nameId));
  }
  state.snapshot.segmentTable = nextSegmentTable;
}
function rebuildDirectoryIndexes(state) {
  for (const [directoryId, directoryIndex] of state.snapshot.directories) {
    const directoryNode = state.snapshot.nodes[directoryId];
    if (!isLiveNode(directoryNode) || !isDirectoryNode(directoryNode)) {
      state.snapshot.directories.delete(directoryId);
      continue;
    }
    const liveChildIds = directoryIndex.childIds.filter((childId) => {
      const childNode = state.snapshot.nodes[childId];
      return isLiveNode(childNode) && childNode.parentId === directoryId;
    });
    directoryIndex.childIds = liveChildIds;
    directoryIndex.childIdByNameId = new Map(liveChildIds.map((childId) => [requireNode(state, childId).nameId, childId]));
    directoryIndex.childPositionById = new Map(liveChildIds.map((childId, childIndex) => [childId, childIndex]));
    rebuildDirectoryChildAggregates(state.snapshot.nodes, directoryIndex);
  }
}
function trimTrailingRemovedNodeSlots(state) {
  let lastNodeIndex = state.snapshot.nodes.length - 1;
  while (lastNodeIndex > state.snapshot.rootId) {
    const node = state.snapshot.nodes[lastNodeIndex];
    if (isLiveNode(node)) break;
    lastNodeIndex -= 1;
  }
  state.snapshot.nodes.length = lastNodeIndex + 1;
}
function runStableCleanup(state) {
  const persistedExpansionState = collectExpansionOverridePaths(state);
  const persistedLoadInfos = collectDirectoryLoadInfos(state);
  withBenchmarkPhase(state.instrumentation, "store.cleanup.stable.clearPathCaches", () => clearPathCaches(state));
  withBenchmarkPhase(state.instrumentation, "store.cleanup.stable.rebuildSegmentTable", () => rebuildSegmentTablePreservingNodeIds(state));
  withBenchmarkPhase(state.instrumentation, "store.cleanup.stable.rebuildDirectoryIndexes", () => rebuildDirectoryIndexes(state));
  withBenchmarkPhase(state.instrumentation, "store.cleanup.stable.trimTrailingRemovedNodeSlots", () => trimTrailingRemovedNodeSlots(state));
  withBenchmarkPhase(state.instrumentation, "store.cleanup.stable.restoreExpansionOverrides", () => restoreExpansionOverridePaths(state, persistedExpansionState));
  withBenchmarkPhase(state.instrumentation, "store.cleanup.stable.restoreDirectoryLoadInfos", () => restoreDirectoryLoadInfos(state, persistedLoadInfos));
  withBenchmarkPhase(state.instrumentation, "store.cleanup.stable.recomputeCounts", () => recomputeCountsRecursive(state, state.snapshot.rootId));
}
function runAggressiveCleanup(state) {
  const persistedExpansionState = collectExpansionOverridePaths(state);
  const persistedLoadInfos = collectDirectoryLoadInfos(state);
  const canonicalPaths = withBenchmarkPhase(state.instrumentation, "store.cleanup.aggressive.listPaths", () => listPaths(state));
  const builderOptions = attachBenchmarkInstrumentation({ ...state.snapshot.options }, state.instrumentation);
  const rebuiltSnapshot = withBenchmarkPhase(state.instrumentation, "store.cleanup.aggressive.rebuildSnapshot", () => {
    const builder = new PathStoreBuilder(builderOptions);
    builder.appendPaths(canonicalPaths);
    return builder.finish();
  });
  state.snapshot = rebuiltSnapshot;
  state.activeNodeCount = rebuiltSnapshot.nodes.length - 1;
  state.pathCacheByNodeId = /* @__PURE__ */ new Map([[rebuiltSnapshot.rootId, {
    path: "",
    version: 0
  }]]);
  state.pathCacheVersion = 0;
  withBenchmarkPhase(state.instrumentation, "store.cleanup.aggressive.restoreExpansionOverrides", () => restoreExpansionOverridePaths(state, persistedExpansionState));
  withBenchmarkPhase(state.instrumentation, "store.cleanup.aggressive.restoreDirectoryLoadInfos", () => restoreDirectoryLoadInfos(state, persistedLoadInfos));
  withBenchmarkPhase(state.instrumentation, "store.cleanup.aggressive.recomputeCounts", () => recomputeCountsRecursive(state, state.snapshot.rootId));
}
function hasActiveCleanupBlockingLoads(state) {
  for (const loadInfo of state.directoryLoadInfoById.values()) if (loadInfo.state === "loading" && loadInfo.activeAttemptId != null) return true;
  return false;
}
function cleanupPathStoreState(state, mode) {
  const before = createCleanupMetricSnapshot(state);
  if (mode === "stable") withBenchmarkPhase(state.instrumentation, "store.cleanup.stable", () => runStableCleanup(state));
  else withBenchmarkPhase(state.instrumentation, "store.cleanup.aggressive", () => runAggressiveCleanup(state));
  const after = createCleanupMetricSnapshot(state);
  return createCleanupResult(mode, mode === "stable", before, after);
}
const INITIAL_PROJECTION_DEPTH_CAPACITY = 64;
function ensureProjectionDepthCapacity(depthTable, depth) {
  const requiredLength = depth + 2;
  if (requiredLength <= depthTable.length) return depthTable;
  let nextLength = depthTable.length;
  while (nextLength < requiredLength) nextLength *= 2;
  const nextDepthTable = new Int32Array(nextLength);
  nextDepthTable.fill(-1);
  nextDepthTable.set(depthTable);
  return nextDepthTable;
}
function getVisibleCount(state) {
  return requireNode(state, state.snapshot.rootId).visibleSubtreeCount;
}
function getVisibleRowSubtreeEndIndex(state, cursor, index, totalVisibleCount) {
  const terminalNode = requireNode(state, cursor.terminalNodeId);
  const subtreeSize = Math.max(1, terminalNode.visibleSubtreeCount);
  return Math.min(totalVisibleCount - 1, index + subtreeSize - 1);
}
function materializeVisibleAncestorRow(state, entry, totalVisibleCount, ancestorPaths) {
  return {
    ancestorPaths,
    index: entry.index,
    posInSet: entry.posInSet,
    row: materializeVisibleRow(state, entry.cursor),
    setSize: entry.setSize,
    subtreeEndIndex: getVisibleRowSubtreeEndIndex(state, entry.cursor, entry.index, totalVisibleCount)
  };
}
function selectVisibleRowContextWithinDirectory(state, directoryNodeId, index, directoryStartIndex, parentVisibleDepth, ancestors) {
  const directoryIndex = getDirectoryIndex(state, directoryNodeId);
  const { childIndex, childVisibleIndex, localVisibleIndex } = selectChildIndexByVisibleIndex(state.snapshot.nodes, directoryIndex, index);
  const childId = directoryIndex.childIds[childIndex];
  if (childId == null) throw new Error(`Visible index ${String(index)} is out of range`);
  return selectVisibleRowContextWithinSubtree(state, childId, localVisibleIndex, directoryStartIndex + childVisibleIndex, parentVisibleDepth + 1, childIndex, directoryIndex.childIds.length, ancestors);
}
function selectVisibleRowContextWithinSubtree(state, nodeId, index, rowIndex, visibleDepth, posInSet, setSize, ancestors) {
  if (!isDirectoryNode(requireNode(state, nodeId))) {
    if (index === 0) return {
      ancestors,
      cursor: {
        headNodeId: nodeId,
        terminalNodeId: nodeId,
        visibleDepth
      },
      index: rowIndex,
      posInSet,
      setSize
    };
    throw new Error(`Visible index ${String(index)} is out of range for file`);
  }
  const currentCursor = createVisibleRowCursor(state, nodeId, visibleDepth);
  if (index === 0) return {
    ancestors,
    cursor: currentCursor,
    index: rowIndex,
    posInSet,
    setSize
  };
  const terminalNode = requireNode(state, currentCursor.terminalNodeId);
  if (!isDirectoryNode(terminalNode) || !isDirectoryExpanded(state, currentCursor.terminalNodeId, terminalNode)) throw new Error(`Visible index ${String(index)} is out of range for collapsed directory`);
  return selectVisibleRowContextWithinDirectory(state, currentCursor.terminalNodeId, index - 1, rowIndex + 1, currentCursor.visibleDepth, [...ancestors, {
    cursor: currentCursor,
    index: rowIndex,
    posInSet,
    setSize
  }]);
}
function getVisibleRowContext(state, index) {
  const totalVisibleCount = getVisibleCount(state);
  if (index < 0 || index >= totalVisibleCount) return null;
  const selected = selectVisibleRowContextWithinDirectory(state, state.snapshot.rootId, index, 0, -1, []);
  const ancestorPaths = selected.ancestors.map((ancestor) => materializeNodePath(state, ancestor.cursor.terminalNodeId));
  let cachedAncestorRows = null;
  return {
    ancestorPaths,
    get ancestorRows() {
      if (cachedAncestorRows != null) return cachedAncestorRows;
      const ancestorRows = [];
      const rowAncestorPaths = [];
      for (const ancestor of selected.ancestors) {
        const ancestorRow = materializeVisibleAncestorRow(state, ancestor, totalVisibleCount, [...rowAncestorPaths]);
        ancestorRows.push(ancestorRow);
        rowAncestorPaths.push(ancestorRow.row.path);
      }
      cachedAncestorRows = ancestorRows;
      return cachedAncestorRows;
    },
    index: selected.index,
    posInSet: selected.posInSet,
    row: materializeVisibleRow(state, selected.cursor),
    setSize: selected.setSize,
    subtreeEndIndex: getVisibleRowSubtreeEndIndex(state, selected.cursor, selected.index, totalVisibleCount)
  };
}
function getVisibleSlice(state, start, end) {
  const instrumentation = state.instrumentation;
  const totalVisibleCount = getVisibleCount(state);
  if (totalVisibleCount <= 0 || end < start) return [];
  const normalizedStart = Math.max(0, Math.min(start, totalVisibleCount - 1));
  const normalizedEnd = Math.max(normalizedStart, Math.min(end, totalVisibleCount - 1));
  if (instrumentation == null) {
    if (normalizedStart === 0) return collectVisibleRowsDFS(state, normalizedEnd + 1);
    const rows$1 = [];
    let currentCursor$1 = selectVisibleRow(state, normalizedStart);
    for (let visibleIndex = normalizedStart; visibleIndex <= normalizedEnd && currentCursor$1 != null; visibleIndex++) {
      const row = materializeVisibleRow(state, currentCursor$1);
      rows$1.push(row);
      currentCursor$1 = getNextVisibleRowCursor(state, currentCursor$1);
    }
    return rows$1;
  }
  const rows = [];
  let flattenedRowCount = 0;
  let flattenedSegmentCount = 0;
  let currentCursor = withBenchmarkPhase(instrumentation, "store.getVisibleSlice.selectFirstRow", () => selectVisibleRow(state, normalizedStart));
  for (let visibleIndex = normalizedStart; visibleIndex <= normalizedEnd && currentCursor != null; visibleIndex++) {
    const row = withBenchmarkPhase(instrumentation, "store.getVisibleSlice.materializeRow", () => materializeVisibleRow(state, currentCursor));
    rows.push(row);
    if (row.isFlattened) {
      flattenedRowCount++;
      flattenedSegmentCount += row.flattenedSegments?.length ?? 0;
    }
    currentCursor = withBenchmarkPhase(instrumentation, "store.getVisibleSlice.advanceCursor", () => getNextVisibleRowCursor(state, currentCursor));
  }
  setBenchmarkCounter(instrumentation, "workload.visibleRowsRead", rows.length);
  setBenchmarkCounter(instrumentation, "workload.flattenedRowsRead", flattenedRowCount);
  setBenchmarkCounter(instrumentation, "workload.flattenedSegmentsRead", flattenedSegmentCount);
  return rows;
}
function getVisibleTreeProjectionData(state, maxRows = getVisibleCount(state)) {
  const instrumentation = state.instrumentation;
  if (instrumentation == null) return buildVisibleTreeProjectionDataDFS(state, maxRows);
  return withBenchmarkPhase(instrumentation, "store.getVisibleTreeProjection", () => buildVisibleTreeProjectionDataDFS(state, maxRows));
}
function getVisibleTreeProjection(state) {
  return createVisibleTreeProjectionFromData(getVisibleTreeProjectionData(state));
}
function getVisibleIndexByPath(state, path) {
  const nodeId = findNodeId(state, path);
  if (nodeId == null || nodeId === state.snapshot.rootId) return null;
  if (isDirectoryNode(requireNode(state, nodeId)) && getFlattenedTerminalDirectoryId(state, nodeId) !== nodeId) return null;
  let visibleIndex = 0;
  let currentNodeId = nodeId;
  const { nodes, rootId } = state.snapshot;
  while (currentNodeId !== rootId) {
    const parentId = requireNode(state, currentNodeId).parentId;
    const parentIndex = getDirectoryIndex(state, parentId);
    const childPosition = ensureChildPositions(parentIndex).get(currentNodeId);
    if (childPosition == null) throw new Error(`Child ${String(currentNodeId)} was not found in its parent index`);
    visibleIndex += getVisibleChildPrefixCount(nodes, parentIndex, childPosition);
    if (parentId !== rootId) {
      const parentNode = requireNode(state, parentId);
      const flattenedChildDirectoryId = getFlattenedChildDirectoryId(state, parentId);
      if (!isDirectoryExpanded(state, parentId, parentNode) && flattenedChildDirectoryId !== currentNodeId) return null;
      if (getFlattenedTerminalDirectoryId(state, parentId) === parentId) visibleIndex += 1;
    }
    currentNodeId = parentId;
  }
  return visibleIndex;
}
function expandPath(state, path) {
  const directoryNodeId = findNodeId(state, path);
  if (directoryNodeId == null) throw new Error(`Path does not exist: "${path}"`);
  const directoryNode = requireNode(state, directoryNodeId);
  if (!isDirectoryNode(directoryNode)) throw new Error(`Path is not a directory: "${path}"`);
  if (isDirectoryExpanded(state, directoryNodeId, directoryNode)) return null;
  setDirectoryExpanded(state, directoryNodeId, true, directoryNode);
  recomputeCountsUpwardFrom(state, directoryNodeId);
  return createExpandEvent({
    affectedAncestorIds: collectAncestorIds(state, directoryNodeId),
    affectedNodeIds: [directoryNodeId],
    path
  });
}
function collapsePath(state, path) {
  const directoryNodeId = findNodeId(state, path);
  if (directoryNodeId == null) throw new Error(`Path does not exist: "${path}"`);
  const directoryNode = requireNode(state, directoryNodeId);
  if (!isDirectoryNode(directoryNode)) throw new Error(`Path is not a directory: "${path}"`);
  if (!isDirectoryExpanded(state, directoryNodeId, directoryNode)) return null;
  setDirectoryExpanded(state, directoryNodeId, false, directoryNode);
  recomputeCountsUpwardFrom(state, directoryNodeId);
  return createCollapseEvent({
    affectedAncestorIds: collectAncestorIds(state, directoryNodeId),
    affectedNodeIds: [directoryNodeId],
    path
  });
}
function selectVisibleRow(state, index) {
  if (index < 0 || index >= getVisibleCount(state)) return null;
  return selectVisibleRowWithinDirectory(state, state.snapshot.rootId, index, -1);
}
function selectVisibleRowWithinDirectory(state, directoryNodeId, index, parentVisibleDepth) {
  const directoryIndex = getDirectoryIndex(state, directoryNodeId);
  const instrumentation = state.instrumentation;
  const { childIndex, localVisibleIndex } = instrumentation == null ? selectChildIndexByVisibleIndex(state.snapshot.nodes, directoryIndex, index) : withBenchmarkPhase(instrumentation, "store.getVisibleSlice.selectChildIndex", () => selectChildIndexByVisibleIndex(state.snapshot.nodes, directoryIndex, index));
  const childId = directoryIndex.childIds[childIndex];
  if (childId != null) return selectVisibleRowWithinSubtree(state, childId, localVisibleIndex, parentVisibleDepth + 1);
  throw new Error(`Visible index ${String(index)} is out of range`);
}
function selectVisibleRowWithinSubtree(state, nodeId, index, visibleDepth) {
  if (!isDirectoryNode(requireNode(state, nodeId))) {
    if (index === 0) return {
      headNodeId: nodeId,
      terminalNodeId: nodeId,
      visibleDepth
    };
    throw new Error(`Visible index ${String(index)} is out of range for file`);
  }
  const currentCursor = createVisibleRowCursor(state, nodeId, visibleDepth);
  if (index === 0) return currentCursor;
  const terminalNode = requireNode(state, currentCursor.terminalNodeId);
  if (!isDirectoryNode(terminalNode) || !isDirectoryExpanded(state, currentCursor.terminalNodeId, terminalNode)) throw new Error(`Visible index ${String(index)} is out of range for collapsed directory`);
  return selectVisibleRowWithinDirectory(state, currentCursor.terminalNodeId, index - 1, currentCursor.visibleDepth);
}
function createVisibleRowCursor(state, nodeId, visibleDepth) {
  if (!isDirectoryNode(requireNode(state, nodeId))) return {
    headNodeId: nodeId,
    terminalNodeId: nodeId,
    visibleDepth
  };
  if (state.instrumentation == null) return {
    headNodeId: nodeId,
    terminalNodeId: getFlattenedTerminalDirectoryId(state, nodeId),
    visibleDepth
  };
  return {
    headNodeId: nodeId,
    terminalNodeId: withBenchmarkPhase(state.instrumentation, "store.getVisibleSlice.flatten.resolveTerminalDirectory", () => getFlattenedTerminalDirectoryId(state, nodeId)),
    visibleDepth
  };
}
function isVisibleRowHeadNode(state, nodeId) {
  const node = requireNode(state, nodeId);
  if (!isDirectoryNode(node)) return true;
  const parentId = node.parentId;
  if (parentId === state.snapshot.rootId) return true;
  return getFlattenedChildDirectoryId(state, parentId) !== nodeId;
}
function getNextVisibleRowCursor(state, currentCursor) {
  const terminalNode = requireNode(state, currentCursor.terminalNodeId);
  if (isDirectoryNode(terminalNode)) {
    const currentIndex = getDirectoryIndex(state, currentCursor.terminalNodeId);
    if (isDirectoryExpanded(state, currentCursor.terminalNodeId, terminalNode) && currentIndex.childIds.length > 0) {
      const firstChildId = currentIndex.childIds[0];
      return firstChildId == null ? null : selectVisibleRowWithinSubtree(state, firstChildId, 0, currentCursor.visibleDepth + 1);
    }
  }
  let currentNodeId = currentCursor.terminalNodeId;
  let currentVisibleDepth = currentCursor.visibleDepth;
  while (true) {
    const currentNode = requireNode(state, currentNodeId);
    if (currentNodeId === state.snapshot.rootId) return null;
    const parentId = currentNode.parentId;
    const parentIndex = getDirectoryIndex(state, parentId);
    const siblingIndex = ensureChildPositions(parentIndex).get(currentNodeId) ?? -1;
    if (siblingIndex < 0) throw new Error(`Child ${String(currentNodeId)} was not found in its parent index`);
    const nextSiblingId = parentIndex.childIds[siblingIndex + 1] ?? null;
    if (nextSiblingId != null) return selectVisibleRowWithinSubtree(state, nextSiblingId, 0, currentVisibleDepth);
    if (isVisibleRowHeadNode(state, currentNodeId)) currentVisibleDepth--;
    currentNodeId = parentId;
  }
}
function createVisibleTreeProjectionFromData(projection) {
  const rowCount = projection.paths.length;
  const projectionRows = new Array(rowCount);
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const parentIndex = projection.getParentIndex(rowIndex);
    projectionRows[rowIndex] = {
      index: rowIndex,
      parentPath: parentIndex >= 0 ? projection.paths[parentIndex] ?? null : null,
      path: projection.paths[rowIndex] ?? "",
      posInSet: projection.posInSetByIndex[rowIndex] ?? 0,
      setSize: projection.setSizeByIndex[rowIndex] ?? 0
    };
  }
  return {
    getParentIndex: projection.getParentIndex,
    rows: projectionRows,
    get visibleIndexByPath() {
      return projection.visibleIndexByPath;
    }
  };
}
function buildVisibleTreeProjectionDataDFS(state, maxRows) {
  const paths = new Array(maxRows);
  const parentRowIndex = new Int32Array(maxRows);
  const posInSetByIndex = new Int32Array(maxRows);
  const setSizeByIndex = new Int32Array(maxRows);
  let lastRowAtDepth = new Int32Array(INITIAL_PROJECTION_DEPTH_CAPACITY);
  lastRowAtDepth.fill(-1);
  let rowCount = 0;
  const { nodes, directories, segmentTable } = state.snapshot;
  const stack = [[
    directories.get(state.snapshot.rootId),
    0,
    -1,
    ""
  ]];
  const flattenEnabled = state.snapshot.options.flattenEmptyDirectories;
  const pathCacheByNodeId = state.pathCacheByNodeId;
  const pathCacheVersion = state.pathCacheVersion;
  const segmentValues = segmentTable.valueById;
  while (stack.length > 0 && rowCount < maxRows) {
    const frame = stack[stack.length - 1];
    const dirIndex = frame[0];
    if (frame[1] >= dirIndex.childIds.length) {
      stack.pop();
      continue;
    }
    const childOffset = frame[1];
    const childId = dirIndex.childIds[frame[1]++];
    const childNode = nodes[childId];
    const visibleDepth = frame[2] + 1;
    const parentPath = frame[3];
    lastRowAtDepth = ensureProjectionDepthCapacity(lastRowAtDepth, visibleDepth);
    let path;
    let terminalNodeId = childId;
    if (!isDirectoryNode(childNode)) {
      const cachedPathEntry = pathCacheByNodeId.get(childId);
      path = cachedPathEntry != null && cachedPathEntry.version === pathCacheVersion ? cachedPathEntry.path : `${parentPath}${segmentValues[childNode.nameId]}`;
    } else {
      terminalNodeId = flattenEnabled ? getFlattenedTerminalDirectoryId(state, childId) : childId;
      path = terminalNodeId === childId ? `${parentPath}${segmentValues[childNode.nameId]}/` : materializeNodePath(state, terminalNodeId);
    }
    parentRowIndex[rowCount] = lastRowAtDepth[visibleDepth];
    paths[rowCount] = path;
    posInSetByIndex[rowCount] = childOffset;
    setSizeByIndex[rowCount] = dirIndex.childIds.length;
    lastRowAtDepth[visibleDepth + 1] = rowCount;
    rowCount += 1;
    const terminalNode = nodes[terminalNodeId];
    if (terminalNode != null && isDirectoryNode(terminalNode) && isDirectoryExpanded(state, terminalNodeId, terminalNode)) stack.push([
      directories.get(terminalNodeId),
      0,
      visibleDepth,
      path
    ]);
  }
  if (rowCount < maxRows) paths.length = rowCount;
  const finalParentRowIndex = parentRowIndex.subarray(0, rowCount);
  const finalPosInSetByIndex = posInSetByIndex.subarray(0, rowCount);
  const finalSetSizeByIndex = setSizeByIndex.subarray(0, rowCount);
  let cachedVisibleIndexByPath = null;
  return {
    getParentIndex(index) {
      return index < 0 || index >= rowCount ? -1 : finalParentRowIndex[index] ?? -1;
    },
    paths,
    posInSetByIndex: finalPosInSetByIndex,
    setSizeByIndex: finalSetSizeByIndex,
    get visibleIndexByPath() {
      if (cachedVisibleIndexByPath == null) {
        cachedVisibleIndexByPath = /* @__PURE__ */ new Map();
        for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) cachedVisibleIndexByPath.set(paths[rowIndex] ?? "", rowIndex);
      }
      return cachedVisibleIndexByPath;
    }
  };
}
function collectVisibleRowsDFS(state, maxRows) {
  const rows = new Array(maxRows);
  let rowCount = 0;
  const { nodes, directories, segmentTable } = state.snapshot;
  const stack = [[
    directories.get(state.snapshot.rootId),
    0,
    -1
  ]];
  const segmentValues = segmentTable.valueById;
  const flattenEnabled = state.snapshot.options.flattenEmptyDirectories;
  const pathCacheByNodeId = state.pathCacheByNodeId;
  const pathCacheVersion = state.pathCacheVersion;
  while (stack.length > 0 && rowCount < maxRows) {
    const frame = stack[stack.length - 1];
    const dirIndex = frame[0];
    if (frame[1] >= dirIndex.childIds.length) {
      stack.pop();
      continue;
    }
    const childId = dirIndex.childIds[frame[1]++];
    const childNode = nodes[childId];
    const visibleDepth = frame[2] + 1;
    if (!isDirectoryNode(childNode)) {
      const cachedPathEntry = pathCacheByNodeId.get(childId);
      rows[rowCount++] = {
        depth: visibleDepth,
        flattenedSegments: void 0,
        hasChildren: false,
        id: childId,
        isExpanded: false,
        isFlattened: false,
        isLoading: false,
        kind: "file",
        loadState: void 0,
        name: segmentValues[childNode.nameId],
        path: cachedPathEntry != null && cachedPathEntry.version === pathCacheVersion ? cachedPathEntry.path : materializeNodePath(state, childId)
      };
      continue;
    }
    const terminalNodeId = flattenEnabled ? getFlattenedTerminalDirectoryId(state, childId) : childId;
    const cursor = {
      headNodeId: childId,
      terminalNodeId,
      visibleDepth
    };
    rows[rowCount++] = materializeVisibleRow(state, cursor);
    const terminalNode = nodes[terminalNodeId];
    if (terminalNode != null && isDirectoryNode(terminalNode) && isDirectoryExpanded(state, terminalNodeId, terminalNode)) stack.push([
      directories.get(terminalNodeId),
      0,
      visibleDepth
    ]);
  }
  if (rowCount < maxRows) rows.length = rowCount;
  return rows;
}
function materializeVisibleRow(state, cursor) {
  const terminalNode = requireNode(state, cursor.terminalNodeId);
  const loadState = isDirectoryNode(terminalNode) ? getVisibleRowLoadState(state, cursor) : null;
  const path = materializeNodePath(state, cursor.terminalNodeId);
  const name = getSegmentValue(state.snapshot.segmentTable, terminalNode.nameId);
  const hasChildren = isDirectoryNode(terminalNode) && getDirectoryIndex(state, cursor.terminalNodeId).childIds.length > 0;
  const isFlattened = cursor.headNodeId !== cursor.terminalNodeId;
  const instrumentation = state.instrumentation;
  const flattenedSegments = isFlattened ? instrumentation == null ? collectFlattenedDirectoryChainIds(state, cursor.headNodeId).map((nodeId) => {
    const node = requireNode(state, nodeId);
    return {
      isTerminal: nodeId === cursor.terminalNodeId,
      name: getSegmentValue(state.snapshot.segmentTable, node.nameId),
      nodeId,
      path: materializeNodePath(state, nodeId)
    };
  }) : withBenchmarkPhase(instrumentation, "store.getVisibleSlice.flatten.collectSegments", () => collectFlattenedDirectoryChainIds(state, cursor.headNodeId).map((nodeId) => {
    const node = requireNode(state, nodeId);
    return {
      isTerminal: nodeId === cursor.terminalNodeId,
      name: getSegmentValue(state.snapshot.segmentTable, node.nameId),
      nodeId,
      path: materializeNodePath(state, nodeId)
    };
  })) : void 0;
  return {
    depth: cursor.visibleDepth,
    flattenedSegments,
    hasChildren,
    id: cursor.terminalNodeId,
    isExpanded: isDirectoryNode(terminalNode) && isDirectoryExpanded(state, cursor.terminalNodeId, terminalNode),
    isFlattened,
    isLoading: loadState === "loading",
    kind: isDirectoryNode(terminalNode) ? "directory" : "file",
    loadState: loadState == null || loadState === "loaded" ? void 0 : loadState,
    name,
    path
  };
}
function getVisibleRowLoadState(state, cursor) {
  if (cursor.headNodeId === cursor.terminalNodeId) return getDirectoryLoadState(state, cursor.terminalNodeId);
  const chainNodeIds = collectFlattenedDirectoryChainIds(state, cursor.headNodeId);
  let hasUnloaded = false;
  let hasError = false;
  for (const nodeId of chainNodeIds) {
    const loadState = getDirectoryLoadState(state, nodeId);
    if (loadState === "loading") return "loading";
    if (loadState === "error") {
      hasError = true;
      continue;
    }
    if (loadState === "unloaded") hasUnloaded = true;
  }
  if (hasError) return "error";
  if (hasUnloaded) return "unloaded";
  return "loaded";
}
function initializeOpenVisibleCounts(state) {
  const { directories, nodes, options, rootId, presortedDirectoryNodeIds } = state.snapshot;
  const flattenEmptyDirectories = options.flattenEmptyDirectories === true;
  const walkDirectory = (nodeId) => {
    const currentNode = nodes[nodeId];
    if (currentNode == null || !isDirectoryNode(currentNode)) return;
    const currentIndex = directories.get(nodeId);
    if (currentIndex == null) throw new Error(`Unknown directory child index for node ${String(nodeId)}`);
    const childIds = currentIndex.childIds;
    const childCount = childIds.length;
    let totalChildSubtreeNodeCount = 0;
    let totalChildVisibleSubtreeCount = 0;
    for (let ci = 0; ci < childCount; ci++) {
      const childId = childIds[ci];
      if (childId == null) continue;
      const childNode = nodes[childId];
      totalChildSubtreeNodeCount += childNode.subtreeNodeCount;
      totalChildVisibleSubtreeCount += childNode.visibleSubtreeCount;
    }
    currentIndex.totalChildSubtreeNodeCount = totalChildSubtreeNodeCount;
    currentIndex.totalChildVisibleSubtreeCount = totalChildVisibleSubtreeCount;
    if (childCount >= PATH_STORE_CHILD_INDEX_CHUNK_THRESHOLD_EXTERNAL) rebuildVisibleChildChunks(nodes, currentIndex);
    currentNode.subtreeNodeCount = 1 + totalChildSubtreeNodeCount;
    let newVisibleSubtreeCount;
    if (flattenEmptyDirectories && childCount === 1) {
      const onlyChild = nodes[childIds[0]];
      newVisibleSubtreeCount = onlyChild != null && isDirectoryNode(onlyChild) ? totalChildVisibleSubtreeCount : 1 + totalChildVisibleSubtreeCount;
    } else newVisibleSubtreeCount = 1 + totalChildVisibleSubtreeCount;
    currentNode.visibleSubtreeCount = newVisibleSubtreeCount;
  };
  if (presortedDirectoryNodeIds != null) for (let i2 = presortedDirectoryNodeIds.length - 1; i2 >= 0; i2--) walkDirectory(presortedDirectoryNodeIds[i2]);
  else for (let nodeId = nodes.length - 1; nodeId >= 1; nodeId--) walkDirectory(nodeId);
  const rootNode = nodes[rootId];
  const rootIndex = directories.get(rootId);
  if (rootNode == null || rootIndex == null) return;
  const rootChildIds = rootIndex.childIds;
  let rootTotalChildSubtreeNodeCount = 0;
  let rootTotalChildVisibleSubtreeCount = 0;
  for (let ci = 0; ci < rootChildIds.length; ci++) {
    const childId = rootChildIds[ci];
    if (childId == null) continue;
    const childNode = nodes[childId];
    rootTotalChildSubtreeNodeCount += childNode.subtreeNodeCount;
    rootTotalChildVisibleSubtreeCount += childNode.visibleSubtreeCount;
  }
  rootIndex.totalChildSubtreeNodeCount = rootTotalChildSubtreeNodeCount;
  rootIndex.totalChildVisibleSubtreeCount = rootTotalChildVisibleSubtreeCount;
  rebuildVisibleChildChunks(nodes, rootIndex);
  rootNode.subtreeNodeCount = 1 + rootTotalChildSubtreeNodeCount;
  rootNode.visibleSubtreeCount = rootTotalChildVisibleSubtreeCount;
}
function canInitializeOpenVisibleCounts(options) {
  return options.initialExpansion === "open" && (options.initialExpandedPaths == null || options.initialExpandedPaths.length === 0);
}
var PathStore = class PathStore2 {
  #state;
  constructor(options = {}) {
    const instrumentation = getBenchmarkInstrumentation(options);
    const builder = withBenchmarkPhase(instrumentation, "store.builder.create", () => new PathStoreBuilder(options));
    if (options.preparedInput != null) {
      const presortedPaths = getPreparedInputPresortedPaths(options.preparedInput);
      if (presortedPaths != null) builder.appendPresortedPaths(presortedPaths, getPreparedInputPresortedPathsContainDirectories(options.preparedInput));
      else builder.appendPreparedPaths(getPreparedInputEntries(options.preparedInput), false);
    } else {
      const inputPaths = options.paths ?? [];
      if (options.presorted === true) builder.appendPaths(inputPaths);
      else builder.appendPreparedPaths(withBenchmarkPhase(instrumentation, "store.preparePathEntries", () => preparePathEntries(inputPaths, options)));
    }
    const snapshot = withBenchmarkPhase(instrumentation, "store.builder.finish", () => builder.finish({ skipSubtreeCountPass: true }));
    const useExplicitOpenExpansionFastPath = withBenchmarkPhase(instrumentation, "store.state.detectAllDirectoriesExpanded", () => (options.initialExpansion ?? "closed") === "closed" && builder.didMatchAllInitialExpandedPaths());
    this.#state = withBenchmarkPhase(instrumentation, "store.state.create", () => createPathStoreState(snapshot, useExplicitOpenExpansionFastPath ? "open" : options.initialExpansion ?? "closed", instrumentation));
    if (useExplicitOpenExpansionFastPath) this.#state.collapseNewDirectoriesByDefault = true;
    const expandedDirectoryCount = useExplicitOpenExpansionFastPath ? this.#state.snapshot.directories.size - 1 : withBenchmarkPhase(instrumentation, "store.state.initializeExpandedPaths", () => this.initializeExpandedPaths(options.initialExpandedPaths));
    if (useExplicitOpenExpansionFastPath || canInitializeOpenVisibleCounts(options) || (options.initialExpansion ?? "closed") === "closed" && expandedDirectoryCount === this.#state.snapshot.directories.size - 1 || (options.initialExpandedPaths?.length ?? 0) > 0 && withBenchmarkPhase(instrumentation, "store.state.checkAllDirectoriesExpanded", () => this.hasAllDirectoriesExpanded())) withBenchmarkPhase(instrumentation, "store.state.initializeOpenVisibleCounts", () => initializeOpenVisibleCounts(this.#state));
    else withBenchmarkPhase(instrumentation, "store.state.recomputeCounts", () => recomputeCountsRecursive(this.#state, this.#state.snapshot.rootId));
  }
  static preparePaths(paths, options = {}) {
    return preparePaths(paths, options);
  }
  static prepareInput(paths, options = {}) {
    return prepareInput(paths, options);
  }
  static preparePresortedInput(paths) {
    return preparePresortedInput(paths);
  }
  list(path) {
    return withBenchmarkPhase(this.#state.instrumentation, "store.list", () => listPaths(this.#state, path));
  }
  add(path) {
    withBenchmarkPhase(this.#state.instrumentation, "store.add", () => {
      const previousVisibleCount = getVisibleCount(this.#state);
      recordEvent(this.#state, finalizeEvent(this.#state, previousVisibleCount, addPath(this.#state, path)));
    });
  }
  remove(path, options = {}) {
    withBenchmarkPhase(this.#state.instrumentation, "store.remove", () => {
      const previousVisibleCount = getVisibleCount(this.#state);
      recordEvent(this.#state, finalizeEvent(this.#state, previousVisibleCount, removePath(this.#state, path, options)));
    });
  }
  move(fromPath, toPath, options = {}) {
    withBenchmarkPhase(this.#state.instrumentation, "store.move", () => {
      const previousVisibleCount = getVisibleCount(this.#state);
      const event = movePath(this.#state, fromPath, toPath, options);
      if (event != null) recordEvent(this.#state, finalizeEvent(this.#state, previousVisibleCount, event));
    });
  }
  batch(operations) {
    batchEvents(this.#state, () => {
      if (typeof operations === "function") {
        operations(this);
        return;
      }
      for (const operation of operations) switch (operation.type) {
        case "add":
          this.add(operation.path);
          break;
        case "remove":
          this.remove(operation.path, { recursive: operation.recursive });
          break;
        case "move":
          this.move(operation.from, operation.to, { collision: operation.collision });
          break;
      }
    });
  }
  getVisibleCount() {
    return withBenchmarkPhase(this.#state.instrumentation, "store.getVisibleCount", () => getVisibleCount(this.#state));
  }
  getVisibleSlice(start, end) {
    return withBenchmarkPhase(this.#state.instrumentation, "store.getVisibleSlice", () => getVisibleSlice(this.#state, start, end));
  }
  getVisibleRowContext(index) {
    return withBenchmarkPhase(this.#state.instrumentation, "store.getVisibleRowContext", () => getVisibleRowContext(this.#state, index));
  }
  getVisibleTreeProjection() {
    return getVisibleTreeProjection(this.#state);
  }
  getVisibleTreeProjectionData(maxRows) {
    return getVisibleTreeProjectionData(this.#state, maxRows);
  }
  /**
  * Resolves a path to its visible row index without building a full projection
  * index. Returns null when the path is unknown or currently hidden.
  */
  getVisibleIndex(path) {
    return withBenchmarkPhase(this.#state.instrumentation, "store.getVisibleIndex", () => getVisibleIndexByPath(this.#state, path));
  }
  /**
  * Resolves a lookup path to the store's canonical path and item kind.
  * Lets tree adapters answer path-first queries without building a second
  * whole-tree metadata index alongside the store.
  */
  getPathInfo(path) {
    return withBenchmarkPhase(this.#state.instrumentation, "store.getPathInfo", () => {
      const nodeId = findNodeId(this.#state, path);
      if (nodeId == null) return null;
      const node = requireNode(this.#state, nodeId);
      return {
        depth: getNodeDepth(node),
        kind: isDirectoryNode(node) ? "directory" : "file",
        path: materializeNodePath(this.#state, nodeId)
      };
    });
  }
  isExpanded(path) {
    return withBenchmarkPhase(this.#state.instrumentation, "store.isExpanded", () => {
      const directoryNodeId = this.requireDirectoryNodeId(path);
      const directoryNode = requireNode(this.#state, directoryNodeId);
      return isDirectoryExpanded(this.#state, directoryNodeId, directoryNode);
    });
  }
  expand(path) {
    withBenchmarkPhase(this.#state.instrumentation, "store.expand", () => {
      const previousVisibleCount = getVisibleCount(this.#state);
      const event = expandPath(this.#state, path);
      if (event != null) recordEvent(this.#state, finalizeEvent(this.#state, previousVisibleCount, event));
    });
  }
  collapse(path) {
    withBenchmarkPhase(this.#state.instrumentation, "store.collapse", () => {
      const previousVisibleCount = getVisibleCount(this.#state);
      const event = collapsePath(this.#state, path);
      if (event != null) recordEvent(this.#state, finalizeEvent(this.#state, previousVisibleCount, event));
    });
  }
  on(type, handler) {
    return subscribe(this.#state, type, handler);
  }
  getDirectoryLoadState(path) {
    const directoryNodeId = this.requireDirectoryNodeId(path);
    return getDirectoryLoadState(this.#state, directoryNodeId);
  }
  markDirectoryUnloaded(path) {
    withBenchmarkPhase(this.#state.instrumentation, "store.markDirectoryUnloaded", () => {
      const directoryNodeId = this.requireDirectoryNodeId(path);
      if (getDirectoryIndex(this.#state, directoryNodeId).childIds.length > 0) throw new Error(`Cannot mark a directory with known children as unloaded: "${path}"`);
      const previousVisibleCount = getVisibleCount(this.#state);
      markDirectoryUnloadedState(this.#state, directoryNodeId);
      recordEvent(this.#state, finalizeEvent(this.#state, previousVisibleCount, createMarkDirectoryUnloadedEvent({
        affectedAncestorIds: collectAncestorIds(this.#state, directoryNodeId),
        affectedNodeIds: [directoryNodeId],
        path,
        projectionChanged: this.isDirectoryProjectionVisible(directoryNodeId)
      })));
    });
  }
  beginChildLoad(path) {
    return withBenchmarkPhase(this.#state.instrumentation, "store.beginChildLoad", () => {
      const directoryNodeId = this.requireDirectoryNodeId(path);
      const previousVisibleCount = getVisibleCount(this.#state);
      const attempt = beginDirectoryLoad(this.#state, directoryNodeId);
      recordEvent(this.#state, finalizeEvent(this.#state, previousVisibleCount, createBeginChildLoadEvent({
        affectedAncestorIds: collectAncestorIds(this.#state, directoryNodeId),
        affectedNodeIds: [directoryNodeId],
        attemptId: attempt.attemptId,
        path,
        projectionChanged: this.isDirectoryProjectionVisible(directoryNodeId),
        reused: attempt.reused
      })));
      return attempt;
    });
  }
  applyChildPatch(attempt, patch) {
    return withBenchmarkPhase(this.#state.instrumentation, "store.applyChildPatch", () => {
      const directoryNodeId = this.resolveActiveDirectoryNodeId(attempt.nodeId);
      if (directoryNodeId == null || getDirectoryLoadState(this.#state, directoryNodeId) !== "loading" || !isDirectoryLoadAttemptCurrent(this.#state, directoryNodeId, attempt.attemptId)) return false;
      const directoryPath = materializeNodePath(this.#state, directoryNodeId);
      this.validateChildPatch(directoryPath, patch);
      const previousVisibleCount = getVisibleCount(this.#state);
      const childEvents = [];
      for (const operation of patch.operations) {
        assertOperationTargetsDirectory(directoryPath, operation);
        const operationVisibleCount = getVisibleCount(this.#state);
        switch (operation.type) {
          case "add":
            childEvents.push(finalizeEvent(this.#state, operationVisibleCount, addPath(this.#state, operation.path)));
            break;
          case "remove":
            childEvents.push(finalizeEvent(this.#state, operationVisibleCount, removePath(this.#state, operation.path, { recursive: operation.recursive })));
            break;
          case "move": {
            const event = movePath(this.#state, operation.from, operation.to, { collision: operation.collision });
            if (event != null) childEvents.push(finalizeEvent(this.#state, operationVisibleCount, event));
            break;
          }
        }
      }
      const projectionChanged = childEvents.some((event) => event.projectionChanged) || this.isDirectoryProjectionVisible(directoryNodeId);
      recordEvent(this.#state, finalizeEvent(this.#state, previousVisibleCount, createApplyChildPatchEvent({
        affectedAncestorIds: collectAncestorIds(this.#state, directoryNodeId),
        affectedNodeIds: [directoryNodeId],
        attemptId: attempt.attemptId,
        childEvents,
        path: materializeNodePath(this.#state, directoryNodeId),
        projectionChanged
      })));
      return true;
    });
  }
  completeChildLoad(attempt) {
    return withBenchmarkPhase(this.#state.instrumentation, "store.completeChildLoad", () => {
      const directoryNodeId = this.resolveActiveDirectoryNodeId(attempt.nodeId);
      if (directoryNodeId == null) return false;
      const previousVisibleCount = getVisibleCount(this.#state);
      const applied = completeDirectoryLoad(this.#state, directoryNodeId, attempt.attemptId);
      recordEvent(this.#state, finalizeEvent(this.#state, previousVisibleCount, createCompleteChildLoadEvent({
        affectedAncestorIds: collectAncestorIds(this.#state, directoryNodeId),
        affectedNodeIds: [directoryNodeId],
        attemptId: attempt.attemptId,
        path: materializeNodePath(this.#state, directoryNodeId),
        projectionChanged: this.isDirectoryProjectionVisible(directoryNodeId),
        stale: !applied
      })));
      return applied;
    });
  }
  failChildLoad(attempt, errorMessage) {
    return withBenchmarkPhase(this.#state.instrumentation, "store.failChildLoad", () => {
      const directoryNodeId = this.resolveActiveDirectoryNodeId(attempt.nodeId);
      if (directoryNodeId == null) return false;
      const previousVisibleCount = getVisibleCount(this.#state);
      const applied = failDirectoryLoad(this.#state, directoryNodeId, attempt.attemptId, errorMessage);
      recordEvent(this.#state, finalizeEvent(this.#state, previousVisibleCount, createFailChildLoadEvent({
        affectedAncestorIds: collectAncestorIds(this.#state, directoryNodeId),
        affectedNodeIds: [directoryNodeId],
        attemptId: attempt.attemptId,
        errorMessage,
        path: materializeNodePath(this.#state, directoryNodeId),
        projectionChanged: this.isDirectoryProjectionVisible(directoryNodeId),
        stale: !applied
      })));
      return applied;
    });
  }
  cleanup(options = {}) {
    return withBenchmarkPhase(this.#state.instrumentation, "store.cleanup", () => {
      if (this.#state.transactionStack.length > 0) throw new Error("Cleanup cannot run during an open batch or transaction.");
      if (hasActiveCleanupBlockingLoads(this.#state)) throw new Error("Cleanup cannot run while directory loads are active.");
      const previousVisibleCount = getVisibleCount(this.#state);
      const result = cleanupPathStoreState(this.#state, options.mode ?? "stable");
      recordEvent(this.#state, finalizeEvent(this.#state, previousVisibleCount, createCleanupEvent({
        ...result,
        affectedAncestorIds: [],
        affectedNodeIds: [],
        projectionChanged: result.idsPreserved === false
      })));
      return result;
    });
  }
  getNodeCount() {
    return this.#state.activeNodeCount;
  }
  initializeExpandedPaths(expandedPaths) {
    if (expandedPaths == null || expandedPaths.length === 0) return 0;
    let expandedDirectoryCount = 0;
    const previousChildOffsets = [];
    const previousNodeIds = [];
    let previousEndIndex = 0;
    let previousPath = null;
    const segmentTable = this.#state.snapshot.segmentTable;
    const segmentValues = segmentTable.valueById;
    const nodes = this.#state.snapshot.nodes;
    const targetSegmentSortKeyCache = /* @__PURE__ */ new Map();
    for (const path of expandedPaths) {
      if (previousPath != null && path < previousPath) {
        previousPath = null;
        previousEndIndex = 0;
        previousChildOffsets.length = 0;
        previousNodeIds.length = 0;
      }
      const endIndex = path.length > 0 && path.charCodeAt(path.length - 1) === 47 ? path.length - 1 : path.length;
      if (endIndex === 0) {
        previousPath = path;
        previousEndIndex = endIndex;
        previousChildOffsets.length = 0;
        previousNodeIds.length = 0;
        continue;
      }
      let sharedDepth = 0;
      let unsharedSegmentStart = 0;
      if (previousPath != null) {
        const compareLength = Math.min(endIndex, previousEndIndex);
        let prefixMatched = true;
        for (let charIndex = 0; charIndex < compareLength; charIndex += 1) {
          const charCode = path.charCodeAt(charIndex);
          if (charCode !== previousPath.charCodeAt(charIndex)) {
            prefixMatched = false;
            break;
          }
          if (charCode === 47) {
            sharedDepth += 1;
            unsharedSegmentStart = charIndex + 1;
          }
        }
        if (prefixMatched) {
          if (compareLength === previousEndIndex && endIndex > compareLength && path.charCodeAt(compareLength) === 47) {
            sharedDepth += 1;
            unsharedSegmentStart = compareLength + 1;
          } else if (compareLength === endIndex && previousEndIndex > compareLength && previousPath.charCodeAt(compareLength) === 47) {
            sharedDepth += 1;
            unsharedSegmentStart = endIndex + 1;
          }
        }
        sharedDepth = Math.min(sharedDepth, previousNodeIds.length);
      }
      let currentDirectoryId = sharedDepth === 0 ? this.#state.snapshot.rootId : previousNodeIds[sharedDepth - 1] ?? this.#state.snapshot.rootId;
      let resolvedDepth = sharedDepth;
      let foundDirectory = true;
      let segmentStart = unsharedSegmentStart;
      while (segmentStart <= endIndex) {
        const slashIndex = path.indexOf("/", segmentStart);
        const segmentEnd = slashIndex === -1 || slashIndex > endIndex ? endIndex : slashIndex;
        const segment = path.slice(segmentStart, segmentEnd);
        const childIds = getDirectoryIndex(this.#state, currentDirectoryId).childIds;
        const searchStartIndex = resolvedDepth === sharedDepth ? previousChildOffsets[resolvedDepth] ?? 0 : 0;
        let nextChildOffset = searchStartIndex;
        let nextNodeId;
        const targetSegmentSortKey = targetSegmentSortKeyCache.get(segment) ?? createSegmentSortKey(segment);
        targetSegmentSortKeyCache.set(segment, targetSegmentSortKey);
        const searchForSegment = (startIndex, endIndex$1) => {
          for (nextChildOffset = startIndex; nextChildOffset < endIndex$1; nextChildOffset += 1) {
            const candidateNodeId = childIds[nextChildOffset];
            const candidateNode = nodes[candidateNodeId];
            const candidateSegment = segmentValues[candidateNode.nameId];
            if (candidateSegment === segment) {
              nextNodeId = candidateNodeId;
              return true;
            }
            const orderComparison = compareSegmentSortKeys(getSegmentSortKey(segmentTable, candidateNode.nameId), targetSegmentSortKey);
            if (orderComparison > 0 || orderComparison === 0 && candidateSegment > segment) return false;
          }
          return false;
        };
        if (!searchForSegment(searchStartIndex, childIds.length) && searchStartIndex > 0) searchForSegment(0, searchStartIndex);
        if (nextNodeId === void 0) {
          foundDirectory = false;
          break;
        }
        if (!isDirectoryNode(requireNode(this.#state, nextNodeId))) {
          foundDirectory = false;
          break;
        }
        previousChildOffsets[resolvedDepth] = nextChildOffset;
        previousNodeIds[resolvedDepth] = nextNodeId;
        currentDirectoryId = nextNodeId;
        resolvedDepth += 1;
        if (segmentEnd === endIndex) break;
        segmentStart = segmentEnd + 1;
      }
      previousPath = path;
      previousEndIndex = endIndex;
      previousChildOffsets.length = resolvedDepth;
      previousNodeIds.length = resolvedDepth;
      if (!foundDirectory) {
        previousPath = null;
        previousEndIndex = 0;
        previousChildOffsets.length = 0;
        previousNodeIds.length = 0;
        continue;
      }
      for (let depthIndex = sharedDepth; depthIndex < resolvedDepth; depthIndex += 1) {
        const directoryNodeId = previousNodeIds[depthIndex];
        if (directoryNodeId == null) continue;
        const directoryNode = requireNode(this.#state, directoryNodeId);
        if (isDirectoryExpanded(this.#state, directoryNodeId, directoryNode)) continue;
        setDirectoryExpanded(this.#state, directoryNodeId, true, directoryNode);
        expandedDirectoryCount += 1;
      }
    }
    return expandedDirectoryCount;
  }
  hasAllDirectoriesExpanded() {
    for (const directoryNodeId of this.#state.snapshot.directories.keys()) {
      if (directoryNodeId === this.#state.snapshot.rootId) continue;
      const directoryNode = requireNode(this.#state, directoryNodeId);
      if (!isDirectoryExpanded(this.#state, directoryNodeId, directoryNode)) return false;
    }
    return true;
  }
  requireDirectoryNodeId(path) {
    const directoryNodeId = findNodeId(this.#state, path);
    if (directoryNodeId == null) throw new Error(`Path does not exist: "${path}"`);
    if (!isDirectoryNode(requireNode(this.#state, directoryNodeId))) throw new Error(`Path is not a directory: "${path}"`);
    return directoryNodeId;
  }
  resolveActiveDirectoryNodeId(directoryNodeId) {
    try {
      if (!isDirectoryNode(requireNode(this.#state, directoryNodeId))) throw new Error(`Node is not a directory: ${String(directoryNodeId)}`);
      return directoryNodeId;
    } catch {
      return null;
    }
  }
  isDirectoryProjectionVisible(directoryNodeId) {
    let currentNodeId = directoryNodeId;
    while (currentNodeId !== this.#state.snapshot.rootId) {
      const parentId = requireNode(this.#state, currentNodeId).parentId;
      if (parentId !== this.#state.snapshot.rootId) {
        const parentNode = requireNode(this.#state, parentId);
        const flattenedChildDirectoryId = getFlattenedChildDirectoryId(this.#state, parentId);
        if (!isDirectoryExpanded(this.#state, parentId, parentNode) && flattenedChildDirectoryId !== currentNodeId) return false;
      }
      currentNodeId = parentId;
    }
    return true;
  }
  validateChildPatch(directoryPath, patch) {
    new PathStore2({
      paths: this.list(directoryPath),
      presorted: true,
      sort: this.#state.snapshot.options.sort
    }).batch(patch.operations);
  }
};
function assertOperationTargetsDirectory(directoryPath, operation) {
  switch (operation.type) {
    case "add":
    case "remove":
      if (!operation.path.startsWith(directoryPath) || operation.path === directoryPath) throw new Error(`Child patch operation must stay within ${directoryPath}: "${operation.path}"`);
      break;
    case "move":
      if (!operation.from.startsWith(directoryPath) || !operation.to.startsWith(directoryPath) || operation.from === directoryPath || operation.to === directoryPath) throw new Error(`Child patch move must stay within ${directoryPath}: "${operation.from}" -> "${operation.to}"`);
      break;
  }
}
const FILE_TREE_DENSITY_PRESETS = {
  compact: {
    itemHeight: 24,
    factor: 0.8
  },
  default: {
    itemHeight: 30,
    factor: 1
  },
  relaxed: {
    itemHeight: 36,
    factor: 1.2
  }
};
function resolveFileTreeDensity(density, explicitItemHeight) {
  if (typeof density === "number") return {
    itemHeight: explicitItemHeight ?? FILE_TREE_DENSITY_PRESETS.default.itemHeight,
    factor: density
  };
  const preset = FILE_TREE_DENSITY_PRESETS[density ?? "default"];
  return {
    itemHeight: explicitItemHeight ?? preset.itemHeight,
    factor: preset.factor
  };
}
const FILE_TREE_DEFAULT_ITEM_HEIGHT = FILE_TREE_DENSITY_PRESETS.default.itemHeight;
const FILE_TREE_DEFAULT_OVERSCAN = 10;
const FILE_TREE_DEFAULT_VIEWPORT_HEIGHT = 420;
const getSelectionPath = (path) => path.startsWith(FLATTENED_PREFIX) ? path.slice(FLATTENED_PREFIX.length) : path;
function splitPath(path) {
  const separatorIndex = path.lastIndexOf("/");
  if (separatorIndex < 0) return {
    parentPath: "",
    baseName: path
  };
  return {
    parentPath: path.slice(0, separatorIndex),
    baseName: path.slice(separatorIndex + 1)
  };
}
function joinPath(parentPath, baseName) {
  return parentPath === "" ? baseName : `${parentPath}/${baseName}`;
}
function renameFileTreePaths({ files, path, isFolder, nextBasename }) {
  const sourcePath = getSelectionPath(path);
  const trimmedBasename = nextBasename.trim();
  if (trimmedBasename.length === 0) return { error: "Name cannot be empty." };
  if (trimmedBasename.includes("/")) return { error: 'Name cannot include "/".' };
  const { parentPath, baseName } = splitPath(sourcePath);
  if (trimmedBasename === baseName) return {
    nextFiles: files,
    sourcePath,
    destinationPath: sourcePath,
    isFolder
  };
  const destinationPath = joinPath(parentPath, trimmedBasename);
  const nextFiles = new Array(files.length);
  const seenPaths = /* @__PURE__ */ new Set();
  if (!isFolder) {
    const destinationPrefix$1 = `${destinationPath}/`;
    let renamed = false;
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (file !== sourcePath && file.startsWith(destinationPrefix$1)) return { error: `"${destinationPath}" already exists.` };
      const nextFile = file === sourcePath ? destinationPath : file;
      if (seenPaths.has(nextFile)) return { error: `"${destinationPath}" already exists.` };
      seenPaths.add(nextFile);
      nextFiles[index] = nextFile;
      if (file === sourcePath) renamed = true;
    }
    if (!renamed) return { error: "Could not find the selected file to rename." };
    return {
      nextFiles,
      sourcePath,
      destinationPath,
      isFolder
    };
  }
  const sourcePrefix = `${sourcePath}/`;
  const destinationPrefix = `${destinationPath}/`;
  let renamedPathCount = 0;
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const isWithinRenamedFolder = file === sourcePath || file.startsWith(sourcePrefix);
    if (!isWithinRenamedFolder && (file === destinationPath || file.startsWith(destinationPrefix))) return { error: `"${destinationPath}" already exists.` };
    const nextFile = isWithinRenamedFolder ? `${destinationPath}${file.slice(sourcePath.length)}` : file;
    if (seenPaths.has(nextFile)) return { error: `"${destinationPath}" already exists.` };
    seenPaths.add(nextFile);
    nextFiles[index] = nextFile;
    if (isWithinRenamedFolder) renamedPathCount++;
  }
  if (renamedPathCount === 0) return { error: "Could not find the selected folder to rename." };
  return {
    nextFiles,
    sourcePath,
    destinationPath,
    isFolder
  };
}
function isCanonicalDirectoryPath$1(path) {
  return path.endsWith("/");
}
function getPathBasename(path) {
  const trimmedPath = path.endsWith("/") ? path.slice(0, -1) : path;
  const lastSlashIndex = trimmedPath.lastIndexOf("/");
  const basename = lastSlashIndex < 0 ? trimmedPath : trimmedPath.slice(lastSlashIndex + 1);
  return path.endsWith("/") ? `${basename}/` : basename;
}
function normalizeDraggedPaths(paths) {
  const uniquePaths = [];
  const seenPaths = /* @__PURE__ */ new Set();
  for (const path of paths) {
    if (seenPaths.has(path)) continue;
    seenPaths.add(path);
    uniquePaths.push(path);
  }
  const keptPaths = /* @__PURE__ */ new Set();
  for (const path of uniquePaths.toSorted((left, right) => {
    if (left.length !== right.length) return left.length - right.length;
    return left.localeCompare(right);
  })) {
    const segments = (path.endsWith("/") ? path.slice(0, -1) : path).split("/");
    let hasSelectedAncestor = false;
    for (let index = 0; index < segments.length - 1; index += 1) {
      const ancestorPath = `${segments.slice(0, index + 1).join("/")}/`;
      if (!keptPaths.has(ancestorPath)) continue;
      hasSelectedAncestor = true;
      break;
    }
    if (hasSelectedAncestor) continue;
    keptPaths.add(path);
  }
  return uniquePaths.filter((path) => keptPaths.has(path));
}
function resolveDraggedPathsForStart(path, selectedPaths) {
  return selectedPaths.includes(path) ? normalizeDraggedPaths(selectedPaths) : [path];
}
function dropTargetsEqual(left, right) {
  if (left === right) return true;
  if (left == null || right == null) return false;
  return left.kind === right.kind && left.directoryPath === right.directoryPath && left.flattenedSegmentPath === right.flattenedSegmentPath && left.hoveredPath === right.hoveredPath;
}
function createDropContext(draggedPaths, target) {
  return {
    draggedPaths,
    target
  };
}
function isSelfOrDescendantDrop(draggedPaths, target) {
  if (target.kind !== "directory" || target.directoryPath == null) return false;
  for (const draggedPath of draggedPaths) {
    if (!isCanonicalDirectoryPath$1(draggedPath)) continue;
    if (target.directoryPath === draggedPath || target.directoryPath.startsWith(draggedPath)) return true;
  }
  return false;
}
function resolveMoveDestinationPath(sourcePath, target) {
  if (target.kind === "root" || target.directoryPath == null) return getPathBasename(sourcePath);
  return target.directoryPath;
}
function buildDropOperations(draggedPaths, target) {
  const operations = draggedPaths.map((draggedPath) => {
    const destinationPath = resolveMoveDestinationPath(draggedPath, target);
    if (destinationPath === draggedPath) return null;
    return {
      from: draggedPath,
      to: destinationPath,
      type: "move"
    };
  }).filter((operation) => {
    return operation != null;
  });
  if (operations.length === 0) return null;
  return {
    operations,
    result: {
      draggedPaths,
      operation: operations.length === 1 ? "move" : "batch",
      target
    }
  };
}
function haveMatchingPaths(currentPaths, preparedPaths) {
  if (currentPaths === preparedPaths) return true;
  if (currentPaths.length !== preparedPaths.length) return false;
  for (let index = 0; index < currentPaths.length; index += 1) if (currentPaths[index] !== preparedPaths[index]) return false;
  return true;
}
function resolveFileTreeInput(options, context, sort) {
  const { paths, preparedInput } = options;
  if (preparedInput == null) {
    if (paths == null) throw new Error("FileTree requires paths or preparedInput");
    return {
      paths,
      preparedInput: void 0
    };
  }
  const preparedPaths = preparedInput.paths;
  if (paths == null) return {
    paths: preparedPaths,
    preparedInput
  };
  if (!haveMatchingPaths(PathStore.preparePaths(paths, sort == null ? {} : { sort }), preparedPaths)) throw new Error(`FileTree ${context} received paths and preparedInput for different path lists`);
  return {
    paths: preparedPaths,
    preparedInput
  };
}
function isPathMutationEvent(event) {
  return event.operation === "add" || event.operation === "remove" || event.operation === "move" || event.operation === "batch";
}
function remapMovedPath(path, fromPath, toPath) {
  if (path === fromPath) return toPath;
  const descendantPrefix = fromPath.endsWith("/") ? fromPath : `${fromPath}/`;
  if (!path.startsWith(descendantPrefix)) return path;
  return `${toPath.endsWith("/") ? toPath : `${toPath}/`}${path.slice(descendantPrefix.length)}`;
}
function isPathRemoved(path, removedPath) {
  if (path === removedPath) return true;
  const descendantPrefix = removedPath.endsWith("/") ? removedPath : `${removedPath}/`;
  return path.startsWith(descendantPrefix);
}
function remapPathThroughMutation(path, event, preserveRemovedPath = false) {
  if (path == null) return null;
  switch (event.operation) {
    case "add":
    case "expand":
    case "collapse":
    case "mark-directory-unloaded":
    case "begin-child-load":
    case "apply-child-patch":
    case "complete-child-load":
    case "fail-child-load":
    case "cleanup":
      return path;
    case "remove":
      return isPathRemoved(path, event.path) ? preserveRemovedPath ? path : null : path;
    case "move":
      return remapMovedPath(path, event.from, event.to);
    case "batch": {
      let nextPath = path;
      for (const childEvent of event.events) {
        nextPath = remapPathThroughMutation(nextPath, childEvent, preserveRemovedPath);
        if (nextPath == null) return null;
      }
      return nextPath;
    }
  }
}
function createMutationInvalidation(event) {
  return {
    canonicalChanged: event.canonicalChanged,
    projectionChanged: event.projectionChanged,
    visibleCountDelta: event.visibleCountDelta
  };
}
function toTreesMutationSemanticEvent(event) {
  switch (event.operation) {
    case "add":
      return {
        ...createMutationInvalidation(event),
        operation: "add",
        path: event.path
      };
    case "remove":
      return {
        ...createMutationInvalidation(event),
        operation: "remove",
        path: event.path,
        recursive: event.recursive
      };
    case "move":
      return {
        ...createMutationInvalidation(event),
        from: event.from,
        operation: "move",
        to: event.to
      };
  }
}
function toTreesBatchEvent(event) {
  return {
    ...createMutationInvalidation(event),
    events: event.events.filter((childEvent) => childEvent.operation === "add" || childEvent.operation === "remove" || childEvent.operation === "move").map((childEvent) => toTreesMutationSemanticEvent(childEvent)),
    operation: "batch"
  };
}
function toTreesMutationEvent(event) {
  switch (event.operation) {
    case "add":
    case "remove":
    case "move":
      return toTreesMutationSemanticEvent(event);
    case "batch":
      return toTreesBatchEvent(event);
    default:
      return null;
  }
}
function arePathSetsEqual(currentPaths, nextPaths) {
  if (currentPaths.size !== nextPaths.length) return false;
  for (const path of nextPaths) if (!currentPaths.has(path)) return false;
  return true;
}
function getAncestorDirectoryPaths$1(path) {
  const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;
  if (normalizedPath.length === 0) return [];
  const segments = normalizedPath.split("/");
  return segments.slice(0, -1).map((_2, index) => `${segments.slice(0, index + 1).join("/")}/`);
}
function getImmediateParentPath(path) {
  return getAncestorDirectoryPaths$1(path).at(-1) ?? null;
}
function getSiblingComparisonKey(path, parentPath) {
  if (parentPath == null) return path;
  return path.startsWith(parentPath) ? path.slice(parentPath.length) : path;
}
function isCanonicalDirectoryPath(path) {
  return path.endsWith("/");
}
const toLowerCaseSearchPath = (path) => path.toLowerCase();
function getRenameLeafName(path) {
  const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;
  const separatorIndex = normalizedPath.lastIndexOf("/");
  return separatorIndex < 0 ? normalizedPath : normalizedPath.slice(separatorIndex + 1);
}
function toRenameHelperPath(path) {
  return path.endsWith("/") ? path.slice(0, -1) : path;
}
function toCanonicalRenamePath(path, isFolder) {
  return isFolder && !path.endsWith("/") ? `${path}/` : path;
}
const normalizeSearchQuery = (value) => {
  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) return "";
  return (trimmedValue.includes("\\") ? trimmedValue.replaceAll("\\", "/") : trimmedValue).toLowerCase();
};
const FILE_TREE_RENAME_VIEW = Symbol("FILE_TREE_RENAME_VIEW");
const INITIAL_PROJECTION_ROW_LIMIT = 512;
const CONTEXT_VISIBLE_ROW_RANGE_LIMIT = 512;
function normalizeScrollOffset(offset) {
  return offset === "top" || offset === "center" ? offset : "nearest";
}
function resolveFocusedIndexByLookup(rowCount, getVisibleIndex, candidatePath) {
  if (rowCount === 0) return -1;
  if (candidatePath != null) {
    const directIndex = getVisibleIndex(candidatePath);
    if (directIndex != null) return directIndex;
    const ancestorPaths = getAncestorDirectoryPaths$1(candidatePath);
    for (let index = ancestorPaths.length - 1; index >= 0; index -= 1) {
      const ancestorPath = ancestorPaths[index];
      if (ancestorPath == null) continue;
      const ancestorIndex = getVisibleIndex(ancestorPath);
      if (ancestorIndex != null) return ancestorIndex;
    }
  }
  return 0;
}
function createVisibleProjection(projection, focusedPathCandidate, resolveVisibleIndexByPath) {
  if (projection.paths.length === 0) return {
    focusedIndex: -1,
    getParentIndex: projection.getParentIndex,
    paths: projection.paths,
    posInSetByIndex: projection.posInSetByIndex,
    setSizeByIndex: projection.setSizeByIndex
  };
  if (focusedPathCandidate == null) return {
    focusedIndex: 0,
    getParentIndex: projection.getParentIndex,
    paths: projection.paths,
    posInSetByIndex: projection.posInSetByIndex,
    setSizeByIndex: projection.setSizeByIndex
  };
  const getVisibleIndex = resolveVisibleIndexByPath ?? ((path) => projection.visibleIndexByPath.get(path) ?? null);
  return {
    focusedIndex: resolveFocusedIndexByLookup(projection.paths.length, getVisibleIndex, focusedPathCandidate),
    getParentIndex: projection.getParentIndex,
    paths: projection.paths,
    posInSetByIndex: projection.posInSetByIndex,
    setSizeByIndex: projection.setSizeByIndex
  };
}
var FileTreeController = class {
  #baseOptions;
  #listeners = /* @__PURE__ */ new Set();
  #mutationListeners = /* @__PURE__ */ new Map();
  #dragAndDropConfig = null;
  #dragSession = null;
  #ancestorIndicesByIndex = /* @__PURE__ */ new Map();
  #ancestorPathsByIndex = /* @__PURE__ */ new Map();
  #focusedIndex = -1;
  #focusedPath = null;
  #hasFullProjection = false;
  #getParentIndexForVisibleRow = (_index) => -1;
  #itemHandles = /* @__PURE__ */ new Map();
  #knownDirectoryPaths = null;
  #knownDirectoryPathsLowerCase = null;
  #knownPaths = null;
  #listedPaths = null;
  #listedPathsLowerCase = null;
  #onRename;
  #onRenameError;
  #onSearchChange;
  #projectionPaths = [];
  #projectionPosInSetByIndex = new Int32Array(0);
  #projectionSetSizeByIndex = new Int32Array(0);
  #renameCanRename = void 0;
  #renameEnabled = false;
  #renamingPath = null;
  #renamingValue = "";
  #removeRenamingPathIfCanceled = false;
  #searchMatchPathSet = /* @__PURE__ */ new Set();
  #searchMatchingPaths = [];
  #searchMode;
  #searchPreviousExpandedPaths = null;
  #searchValue = null;
  #searchVisiblePathSet = null;
  #searchVisibleIndexByPath = null;
  #searchVisibleIndices = null;
  #searchVisiblePaths = null;
  #scrollRequest = null;
  #scrollRequestId = 0;
  #selectionAnchorPath = null;
  #selectedPaths = /* @__PURE__ */ new Set();
  #selectionVersion = 0;
  #store;
  #storeVisibleCount = 0;
  #suppressStoreNotifications = false;
  #visibleCount = 0;
  #unsubscribe;
  constructor(options) {
    const { dragAndDrop, fileTreeSearchMode, initialSearchQuery, initialSelectedPaths, renaming, onSearchChange, paths, preparedInput, ...baseOptions } = options;
    const resolvedInput = resolveFileTreeInput({
      paths,
      preparedInput
    }, "constructor", baseOptions.sort);
    this.#baseOptions = baseOptions;
    if (dragAndDrop != null && dragAndDrop !== false) this.#dragAndDropConfig = dragAndDrop === true ? {} : dragAndDrop;
    this.#renameEnabled = renaming != null && renaming !== false;
    if (renaming != null && renaming !== false && renaming !== true) {
      this.#renameCanRename = renaming.canRename;
      this.#onRenameError = renaming.onError;
      this.#onRename = renaming.onRename;
    }
    this.#onSearchChange = onSearchChange;
    this.#searchMode = fileTreeSearchMode ?? "hide-non-matches";
    this.#store = this.#createStore(resolvedInput.paths, resolvedInput.preparedInput);
    const resolvedInitialSelectedPaths = initialSelectedPaths?.map((path) => this.#resolveSelectionPath(path)).filter((resolved) => resolved != null) ?? [];
    const initialFocusedPath = resolvedInitialSelectedPaths.at(-1) ?? null;
    if (resolvedInitialSelectedPaths.length > 0) {
      this.#selectedPaths = new Set(resolvedInitialSelectedPaths);
      this.#selectionAnchorPath = initialFocusedPath;
      this.#selectionVersion = 1;
    }
    this.#rebuildVisibleProjection(initialFocusedPath, false);
    if (initialSearchQuery != null) this.#setSearchState(initialSearchQuery, false);
    this.#unsubscribe = this.#subscribe();
  }
  destroy() {
    this.#unsubscribe?.();
    this.#unsubscribe = null;
    this.#mutationListeners.clear();
    this.#listeners.clear();
    this.#itemHandles.clear();
    this.#dragSession = null;
    this.#invalidateKnownPathCaches();
  }
  focusFirstItem() {
    if (this.#getCurrentVisiblePaths().length > 0) this.#setFocusedIndex(0);
  }
  focusLastItem() {
    if (this.#visibleCount <= 0) return;
    this.#ensureFullProjection();
    this.#setFocusedIndex(this.#visibleCount - 1);
  }
  focusNextItem() {
    this.#moveFocus(1);
  }
  focusParentItem() {
    if (this.#focusedPath == null) return;
    const parentPath = getImmediateParentPath(this.#focusedPath);
    if (parentPath == null) return;
    const nextFocusedIndex = this.#resolveFocusedIndex(parentPath);
    if (nextFocusedIndex >= 0) this.#setFocusedIndex(nextFocusedIndex);
  }
  focusPath(path) {
    const resolvedPath = this.#store.getPathInfo(path)?.path ?? null;
    if (resolvedPath == null) return;
    this.#ensureFullProjection();
    const nextFocusedIndex = this.#resolveFocusedIndex(resolvedPath);
    if (nextFocusedIndex >= 0) this.#setFocusedIndex(nextFocusedIndex);
  }
  scrollToPath(path, options) {
    const resolvedPath = this.#store.getPathInfo(path)?.path ?? null;
    if (resolvedPath == null) return;
    this.#ensureFullProjection();
    const targetIndex = this.#getExactCurrentVisibleIndexByPath(resolvedPath);
    if (targetIndex < 0) return;
    if (this.#resolveVisiblePathAtIndex(targetIndex) == null) return;
    if (options?.focus !== false) this.#setFocusedIndex(targetIndex, false);
    this.#scrollRequest = {
      id: this.#scrollRequestId += 1,
      offset: normalizeScrollOffset(options?.offset),
      visibleIndex: targetIndex
    };
    this.#emit();
  }
  focusMountedPathFromInput(path) {
    const resolvedPath = this.#store.getPathInfo(path)?.path ?? null;
    if (resolvedPath == null) return;
    const nextFocusedIndex = this.#resolveFocusedIndex(resolvedPath);
    if (nextFocusedIndex >= 0) this.#setFocusedIndex(nextFocusedIndex);
  }
  focusNearestPath(path) {
    const nextPath = this.resolveNearestVisiblePath(path);
    if (nextPath == null) return null;
    const nextFocusedIndex = this.#resolveFocusedIndex(nextPath);
    if (nextFocusedIndex >= 0) {
      this.#setFocusedIndex(nextFocusedIndex);
      return this.#getCurrentVisiblePaths()[nextFocusedIndex] ?? nextPath;
    }
    return null;
  }
  focusPreviousItem() {
    this.#moveFocus(-1);
  }
  getFocusedIndex() {
    return this.#focusedIndex;
  }
  getFocusedItem() {
    return this.#focusedPath == null ? null : this.#getOrCreateItemHandle(this.#focusedPath);
  }
  getFocusedPath() {
    return this.#focusedPath;
  }
  getScrollRequest() {
    return this.#scrollRequest;
  }
  clearScrollRequest(id) {
    if (this.#scrollRequest?.id === id) this.#scrollRequest = null;
  }
  resolveNearestVisiblePath(path) {
    const currentVisiblePaths = this.#getCurrentVisiblePaths();
    if (this.#visibleCount === 0) return null;
    if (path == null) return this.#focusedPath ?? currentVisiblePaths[0] ?? null;
    const resolvedPath = this.#store.getPathInfo(path)?.path ?? path;
    const directIndex = this.#resolveFocusedIndex(resolvedPath);
    if (directIndex >= 0) return currentVisiblePaths[directIndex] ?? resolvedPath;
    const siblingPath = this.#findNearestVisibleSiblingPath(resolvedPath);
    if (siblingPath != null) return siblingPath;
    return this.#focusedPath ?? currentVisiblePaths[0] ?? null;
  }
  getSelectedPaths() {
    return [...this.#selectedPaths];
  }
  getSelectionVersion() {
    return this.#selectionVersion;
  }
  getVisibleCount() {
    return this.#visibleCount;
  }
  getVisibleRows(start, end) {
    if (end < start || this.#visibleCount === 0) return [];
    const boundedStart = Math.max(0, start);
    const boundedEnd = Math.min(this.#visibleCount - 1, end);
    if (boundedEnd < boundedStart) return [];
    const boundedLength = boundedEnd - boundedStart + 1;
    if (this.#searchVisibleIndices == null && !this.#hasFullProjection && boundedEnd >= this.#projectionPaths.length && boundedLength <= CONTEXT_VISIBLE_ROW_RANGE_LIMIT) {
      const rows = [];
      for (let index = boundedStart; index <= boundedEnd; index += 1) {
        const context = this.#store.getVisibleRowContext(index);
        if (context == null) break;
        rows.push(this.#createVisibleRowFromContext(context));
      }
      return rows;
    }
    if (!this.#hasFullProjection && boundedEnd >= this.#projectionPaths.length) this.#ensureFullProjection();
    if (this.#searchVisibleIndices != null) {
      const projectionIndices = Array.from({ length: boundedEnd - boundedStart + 1 }, (_2, visibleOffset) => this.#getProjectionIndexFromVisibleIndex(boundedStart + visibleOffset));
      const visibleRowByProjectionIndex = /* @__PURE__ */ new Map();
      let runStartIndex = projectionIndices[0] ?? -1;
      let runEndIndex = runStartIndex;
      for (let index = 1; index <= projectionIndices.length; index += 1) {
        const projectionIndex = projectionIndices[index];
        if (projectionIndex != null && projectionIndex === runEndIndex + 1) {
          runEndIndex = projectionIndex;
          continue;
        }
        if (runStartIndex >= 0) this.#store.getVisibleSlice(runStartIndex, runEndIndex).forEach((row, offset) => {
          visibleRowByProjectionIndex.set(runStartIndex + offset, row);
        });
        if (projectionIndex == null) {
          runStartIndex = -1;
          runEndIndex = -1;
          continue;
        }
        runStartIndex = projectionIndex;
        runEndIndex = projectionIndex;
      }
      return Array.from({ length: boundedEnd - boundedStart + 1 }, (_2, visibleOffset) => {
        const visibleIndex = boundedStart + visibleOffset;
        const projectionIndex = this.#getProjectionIndexFromVisibleIndex(visibleIndex);
        const row = visibleRowByProjectionIndex.get(projectionIndex);
        const projectionPath = this.#projectionPaths[projectionIndex];
        if (row == null || projectionPath == null) throw new Error(`Missing projection row for filtered visible index ${String(visibleIndex)}`);
        return this.#createVisibleRow(row, visibleIndex, projectionIndex, {
          ancestorPaths: this.#getAncestorPaths(projectionIndex),
          path: projectionPath
        });
      });
    }
    return this.#store.getVisibleSlice(boundedStart, boundedEnd).map((row, offset) => {
      const index = boundedStart + offset;
      const projectionPath = this.#projectionPaths[index];
      if (projectionPath == null) throw new Error(`Missing projection path for visible index ${String(index)}`);
      return this.#createVisibleRow(row, index, index, {
        ancestorPaths: this.#getAncestorPaths(index),
        path: projectionPath
      });
    });
  }
  getStickyRowCandidates(scrollTop, itemHeight) {
    if (this.#searchVisibleIndices != null) return null;
    if (this.#visibleCount === 0 || scrollTop <= 0 || itemHeight <= 0) return [];
    const stickyRows = [];
    for (let slotDepth = 0; slotDepth < this.#visibleCount; slotDepth += 1) {
      const slotTop = scrollTop + slotDepth * itemHeight;
      const thresholdIndex = Math.min(this.#visibleCount - 1, Math.floor(slotTop / itemHeight));
      const candidateContext = this.#getStickyCandidateContextAt(thresholdIndex, slotDepth) ?? (thresholdIndex > 0 ? this.#getStickyCandidateContextAt(thresholdIndex - 1, slotDepth) : void 0);
      if (candidateContext == null) break;
      stickyRows.push({
        row: this.#createVisibleRowFromContext(candidateContext),
        subtreeEndIndex: candidateContext.subtreeEndIndex
      });
    }
    return stickyRows;
  }
  /**
  * Returns the item handle for the given path.
  *
  * Accepts both canonical directory paths (`src/`) and bare directory lookup
  * paths (`src`) so callers do not need to know the canonical slash rules.
  */
  getItem(path) {
    const itemInfo = this.#store.getPathInfo(path);
    return itemInfo == null ? null : this.#getOrCreateItemHandle(itemInfo.path, itemInfo);
  }
  resolveMountedDirectoryPathFromInput(path) {
    const pathInfo = this.#store.getPathInfo(path);
    return pathInfo?.kind === "directory" ? pathInfo.path : null;
  }
  toggleMountedDirectoryFromInput(path) {
    const directoryPath = this.resolveMountedDirectoryPathFromInput(path);
    if (directoryPath == null) return;
    this.#toggleDirectory(directoryPath);
  }
  selectAllVisiblePaths() {
    this.#ensureFullProjection();
    const nextSelectedPaths = [...this.#getCurrentVisiblePaths()];
    this.#applySelection(nextSelectedPaths, this.#focusedPath ?? this.#selectionAnchorPath);
  }
  selectOnlyPath(path) {
    const resolvedPath = this.#resolveSelectionPath(path);
    if (resolvedPath == null) return;
    this.#applySelection([resolvedPath], resolvedPath);
  }
  selectOnlyMountedPathFromInput(path) {
    this.#applySelection([path], path);
  }
  selectPath(path) {
    const resolvedPath = this.#resolveSelectionPath(path);
    if (resolvedPath == null || this.#selectedPaths.has(resolvedPath)) return;
    this.#applySelection([...this.#selectedPaths, resolvedPath]);
  }
  deselectPath(path) {
    const resolvedPath = this.#resolveSelectionPath(path);
    if (resolvedPath == null || !this.#selectedPaths.has(resolvedPath)) return;
    this.#applySelection([...this.#selectedPaths].filter((selectedPath) => selectedPath !== resolvedPath));
  }
  toggleFocusedSelection() {
    if (this.#focusedPath == null) return;
    this.togglePathSelectionFromInput(this.#focusedPath);
  }
  togglePathSelection(path) {
    const resolvedPath = this.#resolveSelectionPath(path);
    if (resolvedPath == null) return;
    if (this.#selectedPaths.has(resolvedPath)) {
      this.deselectPath(resolvedPath);
      return;
    }
    this.selectPath(resolvedPath);
  }
  togglePathSelectionFromInput(path) {
    const resolvedPath = this.#resolveSelectionPath(path);
    if (resolvedPath == null) return;
    if (this.#selectedPaths.has(resolvedPath)) {
      this.#applySelection([...this.#selectedPaths].filter((selectedPath) => selectedPath !== resolvedPath), resolvedPath);
      return;
    }
    this.#applySelection([...this.#selectedPaths, resolvedPath], resolvedPath);
  }
  selectPathRange(path, unionSelection) {
    const resolvedPath = this.#resolveSelectionPath(path);
    if (resolvedPath == null) return;
    this.#ensureFullProjection();
    const anchorPath = this.#selectionAnchorPath;
    const anchorIndex = anchorPath == null ? -1 : this.#getVisibleIndexByPath(anchorPath);
    const targetIndex = this.#getVisibleIndexByPath(resolvedPath);
    if (anchorIndex === -1 || targetIndex === -1) {
      const nextSelectedPaths$1 = unionSelection ? [...this.#selectedPaths, resolvedPath] : [resolvedPath];
      this.#applySelection(nextSelectedPaths$1, resolvedPath);
      return;
    }
    const [startIndex, endIndex] = anchorIndex <= targetIndex ? [anchorIndex, targetIndex] : [targetIndex, anchorIndex];
    const rangePaths = this.#getCurrentVisiblePaths().slice(startIndex, endIndex + 1);
    const nextSelectedPaths = unionSelection ? [...this.#selectedPaths, ...rangePaths] : rangePaths;
    this.#applySelection(nextSelectedPaths, anchorPath);
  }
  extendSelectionFromFocused(offset) {
    if (this.#focusedPath == null) return;
    const focusedIndex = this.#focusedIndex;
    if (focusedIndex === -1) return;
    const nextIndex = Math.min(this.#visibleCount - 1, Math.max(0, focusedIndex + offset));
    if (nextIndex === focusedIndex) return;
    if (!this.#hasFullProjection && nextIndex >= this.#projectionPaths.length) this.#ensureFullProjection();
    const visiblePaths = this.#getCurrentVisiblePaths();
    const currentPath = visiblePaths[focusedIndex] ?? null;
    const nextPath = visiblePaths[nextIndex] ?? null;
    if (currentPath == null || nextPath == null) return;
    const nextSelectedPaths = new Set(this.#selectedPaths);
    if (nextSelectedPaths.has(currentPath) && nextSelectedPaths.has(nextPath)) nextSelectedPaths.delete(currentPath);
    else nextSelectedPaths.add(nextPath);
    this.#applySelection([...nextSelectedPaths], this.#selectionAnchorPath ?? currentPath, false);
    this.#setFocusedIndex(nextIndex);
  }
  getDragAndDropConfig() {
    return this.#dragAndDropConfig;
  }
  isDragAndDropEnabled() {
    return this.#dragAndDropConfig != null;
  }
  getDragSession() {
    if (this.#dragSession == null) return null;
    return {
      draggedPaths: [...this.#dragSession.draggedPaths],
      primaryPath: this.#dragSession.primaryPath,
      target: this.#dragSession.target == null ? null : { ...this.#dragSession.target }
    };
  }
  startDrag(path) {
    if (this.#dragAndDropConfig == null) return false;
    const resolvedPath = this.#resolveSelectionPath(path);
    if (resolvedPath == null) return false;
    if (this.#searchValue != null && this.#searchValue.length > 0) return false;
    const selectedPaths = this.getSelectedPaths();
    const draggedPaths = resolveDraggedPathsForStart(resolvedPath, selectedPaths);
    if (this.#dragAndDropConfig.canDrag?.(draggedPaths) === false) return false;
    if (!selectedPaths.includes(resolvedPath)) this.#applySelection([resolvedPath], resolvedPath, false);
    this.#focusPathWithoutEmit(resolvedPath);
    this.#dragSession = {
      draggedPaths,
      primaryPath: resolvedPath,
      target: null
    };
    this.#emit();
    return true;
  }
  setDragTarget(target) {
    const dragSession = this.#dragSession;
    if (dragSession == null) return;
    let nextTarget = target;
    if (nextTarget != null) {
      const context = createDropContext(dragSession.draggedPaths, nextTarget);
      if (isSelfOrDescendantDrop(dragSession.draggedPaths, nextTarget) || this.#dragAndDropConfig?.canDrop?.(context) === false) nextTarget = null;
    }
    if (dropTargetsEqual(dragSession.target, nextTarget)) return;
    this.#dragSession = {
      ...dragSession,
      target: nextTarget
    };
    this.#emit();
  }
  cancelDrag() {
    if (this.#dragSession == null) return;
    this.#dragSession = null;
    this.#emit();
  }
  completeDrag() {
    const dragSession = this.#dragSession;
    if (dragSession == null) return false;
    this.#dragSession = null;
    const target = dragSession.target == null ? null : { ...dragSession.target };
    if (target == null) {
      this.#emit();
      return false;
    }
    const dropContext = createDropContext(dragSession.draggedPaths, target);
    if (isSelfOrDescendantDrop(dragSession.draggedPaths, target) || this.#dragAndDropConfig?.canDrop?.(dropContext) === false) {
      this.#emit();
      return false;
    }
    const dropPlan = buildDropOperations(dragSession.draggedPaths, target);
    if (dropPlan == null) {
      this.#emit();
      return false;
    }
    try {
      if (dropPlan.operations.length === 1) {
        const singleOperation = dropPlan.operations[0];
        if (singleOperation == null || singleOperation.type !== "move") throw new Error("Expected a single move operation for one-item drops");
        this.#store.move(singleOperation.from, singleOperation.to, { collision: singleOperation.collision });
      } else {
        this.#validateBatchDropOperations(dropPlan.operations);
        this.#store.batch(dropPlan.operations);
      }
    } catch (error) {
      this.#emit();
      this.#dragAndDropConfig?.onDropError?.(error instanceof Error ? error.message : String(error), dropContext);
      return false;
    }
    this.#dragAndDropConfig?.onDropComplete?.(dropPlan.result);
    return true;
  }
  subscribe(listener) {
    this.#listeners.add(listener);
    listener();
    return () => {
      this.#listeners.delete(listener);
    };
  }
  /**
  * Applies one file/directory addition through the shared mutation handle
  * without exposing the raw store to tree consumers.
  */
  add(path) {
    this.#store.add(path);
  }
  remove(path, options = {}) {
    this.#store.remove(path, options);
  }
  move(fromPath, toPath, options = {}) {
    this.#store.move(fromPath, toPath, options);
  }
  batch(operations) {
    this.#store.batch(operations);
  }
  onMutation(type, handler) {
    const key = type;
    const typedHandler = handler;
    let listenersForType = this.#mutationListeners.get(key);
    if (listenersForType == null) {
      listenersForType = /* @__PURE__ */ new Set();
      this.#mutationListeners.set(key, listenersForType);
    }
    listenersForType.add(typedHandler);
    return () => {
      const registeredListeners = this.#mutationListeners.get(key);
      registeredListeners?.delete(typedHandler);
      if (registeredListeners?.size === 0) this.#mutationListeners.delete(key);
    };
  }
  setSearch(value) {
    this.#setSearchState(value, true);
  }
  openSearch(initialValue = "") {
    this.#setSearchState(initialValue, true);
  }
  closeSearch() {
    this.#setSearchState(null, true);
  }
  isSearchOpen() {
    return this.#searchValue !== null;
  }
  getSearchValue() {
    return this.#searchValue ?? "";
  }
  getSearchMatchingPaths() {
    return this.#searchMatchingPaths;
  }
  focusNextSearchMatch() {
    this.#focusRelativeSearchMatch(1);
  }
  focusPreviousSearchMatch() {
    this.#focusRelativeSearchMatch(-1);
  }
  startRenaming(path = this.#focusedPath ?? "", options = {}) {
    if (!this.#renameEnabled) return false;
    const itemInfo = this.#store.getPathInfo(path);
    if (itemInfo == null) return false;
    const canonicalPath = itemInfo.path;
    const isFolder = isCanonicalDirectoryPath(canonicalPath);
    const publicPath = toRenameHelperPath(canonicalPath);
    if (this.#renameCanRename?.({
      isFolder,
      path: publicPath
    }) === false) return false;
    for (const ancestorPath of getAncestorDirectoryPaths$1(canonicalPath)) if (!this.#store.isExpanded(ancestorPath)) this.#store.expand(ancestorPath);
    this.#applySelection([canonicalPath], canonicalPath, false);
    if (this.#searchValue != null) {
      this.#setSearchState(null, false);
      this.#onSearchChange?.(this.#searchValue);
    }
    this.#focusPathWithoutEmit(canonicalPath);
    this.#renamingPath = canonicalPath;
    this.#renamingValue = getRenameLeafName(canonicalPath);
    this.#removeRenamingPathIfCanceled = options.removeIfCanceled ?? false;
    this.#emit();
    return true;
  }
  [FILE_TREE_RENAME_VIEW]() {
    return {
      cancel: () => {
        this.#cancelRenaming();
      },
      commit: () => {
        this.#completeRenaming();
      },
      getPath: () => this.#renamingPath,
      getValue: () => this.#renamingValue,
      isActive: () => this.#renamingPath != null,
      setValue: (value) => {
        this.#setRenamingValue(value);
      }
    };
  }
  #cancelRenaming() {
    if (this.#renamingPath == null) return;
    const renamingPath = this.#renamingPath;
    const removePlaceholderEntry = this.#removeRenamingPathIfCanceled;
    this.#renamingPath = null;
    this.#renamingValue = "";
    this.#removeRenamingPathIfCanceled = false;
    if (removePlaceholderEntry) {
      this.remove(renamingPath, isCanonicalDirectoryPath(renamingPath) ? { recursive: true } : void 0);
      return;
    }
    this.#focusPathWithoutEmit(renamingPath);
    this.#emit();
  }
  #completeRenaming() {
    const renamingPath = this.#renamingPath;
    if (renamingPath == null) return;
    if (this.#removeRenamingPathIfCanceled && this.#renamingValue.trim().length === 0) {
      this.#renamingPath = null;
      this.#renamingValue = "";
      this.#removeRenamingPathIfCanceled = false;
      this.remove(renamingPath, isCanonicalDirectoryPath(renamingPath) ? { recursive: true } : void 0);
      return;
    }
    const isFolder = isCanonicalDirectoryPath(renamingPath);
    const result = renameFileTreePaths({
      files: this.#store.list(),
      isFolder,
      nextBasename: this.#renamingValue,
      path: toRenameHelperPath(renamingPath)
    });
    this.#renamingPath = null;
    this.#renamingValue = "";
    this.#removeRenamingPathIfCanceled = false;
    if ("error" in result) {
      this.#focusPathWithoutEmit(renamingPath);
      this.#onRenameError?.(result.error);
      this.#emit();
      return;
    }
    if (result.sourcePath === result.destinationPath) {
      this.#focusPathWithoutEmit(renamingPath);
      this.#emit();
      return;
    }
    this.#onRename?.({
      destinationPath: result.destinationPath,
      isFolder: result.isFolder,
      sourcePath: result.sourcePath
    });
    this.move(toCanonicalRenamePath(result.sourcePath, isFolder), toCanonicalRenamePath(result.destinationPath, isFolder));
  }
  #setRenamingValue(value) {
    if (this.#renamingPath == null || this.#renamingValue === value) return;
    this.#renamingValue = value;
    this.#emit();
  }
  /**
  * Rebuilds the controller around a new full path set. This is intentionally a
  * coarse whole-tree reset path rather than a localized mutation fast path.
  */
  resetPaths(paths, options = {}) {
    const previousPathCount = this.#store.list().length;
    const previousVisibleCount = this.#visibleCount;
    const resolvedInput = resolveFileTreeInput({
      paths,
      preparedInput: options.preparedInput
    }, "resetPaths", this.#baseOptions.sort);
    const nextStore = this.#createStore(resolvedInput.paths, resolvedInput.preparedInput, options.initialExpandedPaths);
    const previousFocusedPath = this.#focusedPath;
    const previousRenamingPath = this.#renamingPath;
    const previousSelectedPaths = this.getSelectedPaths();
    const previousSelectionAnchorPath = this.#selectionAnchorPath;
    this.#unsubscribe?.();
    this.#store = nextStore;
    this.#itemHandles.clear();
    this.#invalidateKnownPathCaches();
    const nextSelectedPaths = previousSelectedPaths.map((selectedPath) => nextStore.getPathInfo(selectedPath)?.path ?? null).filter((resolved) => resolved != null);
    const selectionChanged = !arePathSetsEqual(this.#selectedPaths, nextSelectedPaths);
    this.#selectedPaths = new Set(nextSelectedPaths);
    if (selectionChanged) this.#selectionVersion += 1;
    this.#selectionAnchorPath = previousSelectionAnchorPath == null ? null : nextStore.getPathInfo(previousSelectionAnchorPath)?.path ?? null;
    this.#renamingPath = previousRenamingPath == null ? null : nextStore.getPathInfo(previousRenamingPath)?.path ?? null;
    if (this.#renamingPath == null) {
      this.#renamingValue = "";
      this.#removeRenamingPathIfCanceled = false;
    }
    this.#rebuildVisibleProjection(previousFocusedPath, previousFocusedPath != null || nextSelectedPaths.length > 0 || this.#selectionAnchorPath != null);
    this.#unsubscribe = this.#subscribe();
    this.#emit();
    this.#emitMutation({
      canonicalChanged: true,
      operation: "reset",
      pathCountAfter: resolvedInput.paths.length,
      pathCountBefore: previousPathCount,
      projectionChanged: true,
      usedPreparedInput: options.preparedInput != null,
      visibleCountDelta: this.#visibleCount - previousVisibleCount
    });
  }
  #findNearestVisibleSiblingPath(path) {
    this.#ensureFullProjection();
    const parentPath = getImmediateParentPath(path);
    const candidateKey = getSiblingComparisonKey(path, parentPath);
    let previousSiblingPath = null;
    let nextSiblingPath = null;
    for (const siblingPath of this.#getCurrentVisiblePaths()) {
      if (getImmediateParentPath(siblingPath) !== parentPath) continue;
      const siblingKey = getSiblingComparisonKey(siblingPath, parentPath);
      if (siblingKey < candidateKey) {
        previousSiblingPath = siblingPath;
        continue;
      }
      if (siblingKey > candidateKey) {
        nextSiblingPath = siblingPath;
        break;
      }
    }
    return previousSiblingPath ?? nextSiblingPath;
  }
  #resolveFocusedIndex(path) {
    const directIndex = this.#getVisibleIndexByPath(path);
    if (directIndex !== -1) return directIndex;
    const ancestorPaths = getAncestorDirectoryPaths$1(path);
    for (let index = ancestorPaths.length - 1; index >= 0; index -= 1) {
      const ancestorPath = ancestorPaths[index];
      if (ancestorPath == null) continue;
      const ancestorIndex = this.#getVisibleIndexByPath(ancestorPath);
      if (ancestorIndex !== -1) return ancestorIndex;
    }
    return this.#getCurrentVisiblePaths().length > 0 ? 0 : -1;
  }
  #getOrCreateItemHandle(path, itemInfo) {
    const cachedHandle = this.#itemHandles.get(path);
    if (cachedHandle != null) return cachedHandle;
    const resolvedItemInfo = itemInfo ?? this.#store.getPathInfo(path);
    if (resolvedItemInfo == null) return null;
    const handle = resolvedItemInfo.kind === "directory" ? this.#createDirectoryHandle(resolvedItemInfo.path) : this.#createFileHandle(resolvedItemInfo.path);
    this.#itemHandles.set(resolvedItemInfo.path, handle);
    return handle;
  }
  #createVisibleRow(row, visibleIndex, projectionIndex, projection) {
    return {
      ancestorPaths: projection.ancestorPaths,
      depth: row.depth,
      flattenedSegments: row.flattenedSegments?.map((segment) => ({
        isTerminal: segment.isTerminal,
        name: segment.name,
        path: segment.path
      })),
      hasChildren: row.hasChildren,
      index: visibleIndex,
      isExpanded: row.isExpanded,
      isFlattened: row.isFlattened,
      isFocused: projection.path === this.#focusedPath,
      isSelected: this.#selectedPaths.has(projection.path),
      kind: row.kind,
      level: row.depth,
      name: row.name,
      path: projection.path,
      posInSet: projection.posInSet ?? this.#projectionPosInSetByIndex[projectionIndex] ?? 0,
      setSize: projection.setSize ?? this.#projectionSetSizeByIndex[projectionIndex] ?? 0
    };
  }
  #createVisibleRowFromContext(context) {
    return this.#createVisibleRow(context.row, context.index, context.index, {
      ancestorPaths: context.ancestorPaths,
      path: context.row.path,
      posInSet: context.posInSet,
      setSize: context.setSize
    });
  }
  #getStickyCandidateContextAt(index, slotDepth) {
    const context = this.#store.getVisibleRowContext(index);
    if (context == null) return;
    const ancestorRow = context.ancestorRows[slotDepth];
    if (ancestorRow != null) return ancestorRow;
    return slotDepth === context.ancestorRows.length && context.row.kind === "directory" && context.row.isExpanded ? context : void 0;
  }
  #getAncestorIndices(index) {
    const cached = this.#ancestorIndicesByIndex.get(index);
    if (cached != null) return cached;
    const parentIndex = this.#getParentIndexForVisibleRow(index);
    const ancestorIndices = parentIndex < 0 ? [] : [...this.#getAncestorIndices(parentIndex), parentIndex];
    this.#ancestorIndicesByIndex.set(index, ancestorIndices);
    return ancestorIndices;
  }
  #getAncestorPaths(index) {
    const cached = this.#ancestorPathsByIndex.get(index);
    if (cached != null) return cached;
    const ancestorPaths = this.#getAncestorIndices(index).map((ancestorIndex) => this.#projectionPaths[ancestorIndex] ?? "").filter((path) => path !== "");
    this.#ancestorPathsByIndex.set(index, ancestorPaths);
    return ancestorPaths;
  }
  #collapseDirectory(path) {
    this.#store.collapse(path);
  }
  #applySelection(nextSelectedPaths, nextAnchorPath = this.#selectionAnchorPath, emit = true) {
    const uniqueSelectedPaths = [...new Set(nextSelectedPaths)];
    const selectionChanged = !arePathSetsEqual(this.#selectedPaths, uniqueSelectedPaths);
    const anchorChanged = this.#selectionAnchorPath !== nextAnchorPath;
    if (!selectionChanged && !anchorChanged) return;
    this.#selectedPaths = new Set(uniqueSelectedPaths);
    this.#selectionAnchorPath = nextAnchorPath;
    if (selectionChanged) this.#selectionVersion += 1;
    if (emit) this.#emit();
  }
  #createDirectoryHandle(path) {
    return {
      collapse: () => {
        this.#collapseDirectory(path);
      },
      deselect: () => {
        this.deselectPath(path);
      },
      expand: () => {
        this.#expandDirectory(path);
      },
      focus: () => {
        this.focusPath(path);
      },
      getPath: () => path,
      isDirectory: () => true,
      isExpanded: () => this.#store.isExpanded(path),
      isFocused: () => this.#focusedPath === path,
      isSelected: () => this.#selectedPaths.has(path),
      select: () => {
        this.selectPath(path);
      },
      toggleSelect: () => {
        this.togglePathSelection(path);
      },
      toggle: () => {
        this.#toggleDirectory(path);
      }
    };
  }
  #createFileHandle(path) {
    return {
      deselect: () => {
        this.deselectPath(path);
      },
      focus: () => {
        this.focusPath(path);
      },
      getPath: () => path,
      isDirectory: () => false,
      isFocused: () => this.#focusedPath === path,
      isSelected: () => this.#selectedPaths.has(path),
      select: () => {
        this.selectPath(path);
      },
      toggleSelect: () => {
        this.togglePathSelection(path);
      }
    };
  }
  #validateBatchDropOperations(operations) {
    const currentPaths = this.#store.list();
    this.#createStore(currentPaths).batch(operations);
  }
  #createStore(paths, preparedInput, initialExpandedPathsOverride) {
    return new PathStore({
      ...this.#baseOptions,
      paths,
      preparedInput: preparedInput == null ? void 0 : preparedInput,
      ...initialExpandedPathsOverride !== void 0 ? { initialExpandedPaths: initialExpandedPathsOverride } : {}
    });
  }
  #getListedPaths() {
    if (this.#listedPaths != null) return this.#listedPaths;
    this.#listedPaths = this.#store.list();
    return this.#listedPaths;
  }
  #getAllKnownPaths() {
    if (this.#knownPaths != null) return this.#knownPaths;
    const knownPaths = /* @__PURE__ */ new Set();
    for (const path of this.#getListedPaths()) {
      knownPaths.add(path);
      for (const ancestorPath of getAncestorDirectoryPaths$1(path)) knownPaths.add(ancestorPath);
    }
    this.#knownPaths = [...knownPaths].sort();
    return this.#knownPaths;
  }
  #getListedPathsLowerCase() {
    if (this.#listedPathsLowerCase != null) return this.#listedPathsLowerCase;
    this.#listedPathsLowerCase = this.#getListedPaths().map(toLowerCaseSearchPath);
    return this.#listedPathsLowerCase;
  }
  #getAllKnownDirectoryPaths() {
    if (this.#knownDirectoryPaths != null) return this.#knownDirectoryPaths;
    this.#knownDirectoryPaths = this.#getAllKnownPaths().filter((path) => path.endsWith("/"));
    return this.#knownDirectoryPaths;
  }
  #getAllKnownDirectoryPathsLowerCase() {
    if (this.#knownDirectoryPathsLowerCase != null) return this.#knownDirectoryPathsLowerCase;
    this.#knownDirectoryPathsLowerCase = this.#getAllKnownDirectoryPaths().map(toLowerCaseSearchPath);
    return this.#knownDirectoryPathsLowerCase;
  }
  #invalidateKnownPathCaches() {
    this.#knownDirectoryPaths = null;
    this.#knownDirectoryPathsLowerCase = null;
    this.#knownPaths = null;
    this.#listedPaths = null;
    this.#listedPathsLowerCase = null;
  }
  #getExpandedDirectoryPaths() {
    return this.#getAllKnownDirectoryPaths().filter((path) => this.#store.isExpanded(path));
  }
  #restoreSearchExpandedPaths(keepSelectedOpen) {
    const expandedPaths = new Set(this.#searchPreviousExpandedPaths ?? []);
    if (keepSelectedOpen) for (const selectedPath of this.#selectedPaths) for (const ancestorPath of getAncestorDirectoryPaths$1(selectedPath)) expandedPaths.add(ancestorPath);
    this.#setExpandedPaths(expandedPaths);
  }
  #setExpandedPaths(expandedPaths) {
    this.#suppressStoreNotifications = true;
    try {
      for (const directoryPath of this.#getAllKnownDirectoryPaths()) {
        const shouldExpand = expandedPaths.has(directoryPath);
        const isExpanded = this.#store.isExpanded(directoryPath);
        if (shouldExpand && !isExpanded) this.#store.expand(directoryPath);
        else if (!shouldExpand && isExpanded) this.#store.collapse(directoryPath);
      }
    } finally {
      this.#suppressStoreNotifications = false;
    }
  }
  #syncSearchVisibilityState() {
    if (this.#searchValue == null || this.#searchValue.length === 0) {
      this.#searchMatchingPaths = [];
      this.#searchVisibleIndices = null;
      this.#searchVisiblePaths = null;
      this.#searchVisibleIndexByPath = null;
      this.#visibleCount = this.#storeVisibleCount;
      return;
    }
    const currentVisiblePaths = this.#projectionPaths;
    this.#searchMatchingPaths = currentVisiblePaths.filter((path) => this.#searchMatchPathSet.has(path));
    if (this.#searchMode !== "hide-non-matches" || this.#searchMatchPathSet.size === 0) {
      this.#searchVisibleIndices = null;
      this.#searchVisiblePaths = null;
      this.#searchVisibleIndexByPath = null;
      this.#visibleCount = this.#storeVisibleCount;
      return;
    }
    const visibleIndices = [];
    const visiblePaths = [];
    const visibleIndexByPath = /* @__PURE__ */ new Map();
    for (const [index, path] of currentVisiblePaths.entries()) {
      if (this.#searchVisiblePathSet?.has(path) !== true) continue;
      visibleIndexByPath.set(path, visiblePaths.length);
      visibleIndices.push(index);
      visiblePaths.push(path);
    }
    this.#searchVisibleIndices = visibleIndices;
    this.#searchVisiblePaths = visiblePaths;
    this.#searchVisibleIndexByPath = visibleIndexByPath;
    this.#visibleCount = visiblePaths.length;
  }
  #getCurrentVisiblePaths() {
    return this.#searchVisiblePaths ?? this.#projectionPaths;
  }
  #getExactCurrentVisibleIndexByPath(path) {
    if (this.#searchVisiblePaths != null) return this.#searchVisibleIndexByPath?.get(path) ?? -1;
    return this.#store.getVisibleIndex(path) ?? -1;
  }
  #getProjectionIndexFromVisibleIndex(index) {
    return this.#searchVisibleIndices?.[index] ?? index;
  }
  #getVisibleIndexByPath(path) {
    const searchIndex = this.#searchVisibleIndexByPath?.get(path);
    if (searchIndex != null) return searchIndex;
    return this.#store.getVisibleIndex(path) ?? -1;
  }
  #focusRelativeSearchMatch(direction) {
    const matchPaths = this.#searchMatchingPaths;
    if (matchPaths.length === 0) return;
    const focusedPath = this.#focusedPath;
    const currentIndex = focusedPath == null ? -1 : matchPaths.indexOf(focusedPath);
    const nextPath = matchPaths[currentIndex < 0 ? direction > 0 ? 0 : matchPaths.length - 1 : Math.min(matchPaths.length - 1, Math.max(0, currentIndex + direction))];
    if (nextPath != null) this.focusPath(nextPath);
  }
  #setSearchState(value, emitChange) {
    const normalizedValue = value == null ? null : normalizeSearchQuery(value);
    const previousSearch = this.#searchValue;
    if (previousSearch === normalizedValue) return;
    if (previousSearch == null && normalizedValue != null) this.#searchPreviousExpandedPaths = this.#getExpandedDirectoryPaths();
    this.#searchValue = normalizedValue;
    if (normalizedValue == null) {
      this.#restoreSearchExpandedPaths(true);
      this.#searchPreviousExpandedPaths = null;
      this.#searchMatchPathSet.clear();
      this.#searchVisiblePathSet = null;
      this.#rebuildVisibleProjection(this.#focusedPath, true);
    } else if (normalizedValue.length === 0) {
      this.#restoreSearchExpandedPaths(false);
      this.#searchMatchPathSet.clear();
      this.#searchVisiblePathSet = null;
      this.#rebuildVisibleProjection(this.#focusedPath, true);
    } else {
      const focusCandidate = this.#refreshActiveSearchState();
      this.#rebuildVisibleProjection(focusCandidate, true);
    }
    if (emitChange) {
      this.#onSearchChange?.(this.#searchValue);
      this.#emit();
    }
  }
  #refreshActiveSearchState() {
    if (this.#searchValue == null || this.#searchValue.length === 0) {
      this.#searchMatchPathSet.clear();
      return this.#focusedPath;
    }
    const searchValue = this.#searchValue;
    const listedPaths = this.#getListedPaths();
    const listedPathsLowerCase = this.#getListedPathsLowerCase();
    const matchingPaths = [];
    const matchingPathSet = /* @__PURE__ */ new Set();
    let focusCandidate = null;
    for (let index = 0; index < listedPaths.length; index += 1) {
      if (!listedPathsLowerCase[index].includes(searchValue)) continue;
      const path = listedPaths[index];
      matchingPaths.push(path);
      matchingPathSet.add(path);
      focusCandidate ??= path;
    }
    const knownDirectoryPaths = this.#getAllKnownDirectoryPaths();
    const knownDirectoryPathsLowerCase = this.#getAllKnownDirectoryPathsLowerCase();
    for (let index = 0; index < knownDirectoryPaths.length; index += 1) {
      if (!knownDirectoryPathsLowerCase[index].includes(searchValue)) continue;
      const path = knownDirectoryPaths[index];
      if (matchingPathSet.has(path)) continue;
      matchingPaths.push(path);
      matchingPathSet.add(path);
      focusCandidate ??= path;
    }
    this.#searchMatchPathSet = matchingPathSet;
    const searchVisiblePathSet = this.#searchMode === "hide-non-matches" && matchingPaths.length > 0 ? /* @__PURE__ */ new Set() : null;
    this.#searchVisiblePathSet = searchVisiblePathSet;
    const expandedPaths = this.#searchMode === "expand-matches" ? new Set(this.#searchPreviousExpandedPaths ?? []) : /* @__PURE__ */ new Set();
    for (const matchingPath of matchingPaths) {
      if (searchVisiblePathSet != null) searchVisiblePathSet.add(matchingPath);
      if (matchingPath.endsWith("/")) expandedPaths.add(matchingPath);
      for (const ancestorPath of getAncestorDirectoryPaths$1(matchingPath)) {
        expandedPaths.add(ancestorPath);
        if (searchVisiblePathSet != null) searchVisiblePathSet.add(ancestorPath);
      }
    }
    this.#setExpandedPaths(expandedPaths);
    return focusCandidate ?? this.#focusedPath;
  }
  #emit(event) {
    for (const listener of this.#listeners) listener(event);
  }
  #emitMutation(event) {
    this.#mutationListeners.get(event.operation)?.forEach((listener) => {
      listener(event);
    });
    this.#mutationListeners.get("*")?.forEach((listener) => {
      listener(event);
    });
  }
  #expandDirectory(path) {
    for (const ancestorPath of getAncestorDirectoryPaths$1(path)) {
      if (this.#store.isExpanded(ancestorPath)) continue;
      this.#store.expand(ancestorPath);
    }
    if (!this.#store.isExpanded(path)) this.#store.expand(path);
  }
  #moveFocus(offset) {
    const itemCount = this.#visibleCount;
    if (itemCount === 0) return;
    const currentIndex = this.#focusedIndex === -1 ? 0 : this.#focusedIndex;
    const nextIndex = Math.min(itemCount - 1, Math.max(0, currentIndex + offset));
    if (nextIndex !== currentIndex || this.#focusedIndex === -1) {
      if (!this.#hasFullProjection && this.#searchVisibleIndices == null && nextIndex >= this.#projectionPaths.length) this.#ensureFullProjection();
      this.#setFocusedIndex(nextIndex);
    }
  }
  #rebuildVisibleProjection(focusedPathCandidate, full = true) {
    const rawVisibleCount = this.#store.getVisibleCount();
    this.#storeVisibleCount = rawVisibleCount;
    const projection = createVisibleProjection(this.#store.getVisibleTreeProjectionData(full ? void 0 : Math.min(rawVisibleCount, INITIAL_PROJECTION_ROW_LIMIT)), focusedPathCandidate, full ? (path) => this.#store.getVisibleIndex(path) : void 0);
    this.#ancestorIndicesByIndex.clear();
    this.#ancestorPathsByIndex.clear();
    this.#hasFullProjection = projection.paths.length >= rawVisibleCount;
    this.#getParentIndexForVisibleRow = projection.getParentIndex;
    this.#projectionPaths = projection.paths;
    this.#projectionPosInSetByIndex = projection.posInSetByIndex;
    this.#projectionSetSizeByIndex = projection.setSizeByIndex;
    this.#syncSearchVisibilityState();
    this.#focusedIndex = focusedPathCandidate == null ? this.#getCurrentVisiblePaths().length > 0 ? 0 : -1 : this.#resolveFocusedIndex(focusedPathCandidate);
    this.#focusedPath = this.#focusedIndex < 0 ? null : this.#resolveVisiblePathAtIndex(this.#focusedIndex);
  }
  #resolveVisiblePathAtIndex(index) {
    const projectedPath = this.#getCurrentVisiblePaths()[index];
    if (projectedPath != null) return projectedPath;
    if (this.#searchVisibleIndices != null) return null;
    return this.#store.getVisibleRowContext(index)?.row.path ?? null;
  }
  #resolveSelectionPath(path) {
    return this.#store.getPathInfo(path)?.path ?? null;
  }
  #focusPathWithoutEmit(path) {
    if (path == null) return;
    const nextFocusedIndex = this.#resolveFocusedIndex(path);
    if (nextFocusedIndex >= 0) this.#setFocusedIndex(nextFocusedIndex, false);
  }
  #setFocusedIndex(index, emit = true) {
    const nextPath = this.#resolveVisiblePathAtIndex(index);
    if (nextPath == null) return;
    if (this.#focusedIndex === index && this.#focusedPath === nextPath) return;
    this.#focusedIndex = index;
    this.#focusedPath = nextPath;
    if (emit) this.#emit();
  }
  #ensureFullProjection() {
    if (this.#hasFullProjection) return;
    this.#rebuildVisibleProjection(this.#focusedPath, true);
  }
  #applyMutationState(event) {
    const nextRenamingPath = remapPathThroughMutation(this.#renamingPath, event);
    if (nextRenamingPath == null && this.#renamingPath != null) this.#renamingValue = "";
    this.#renamingPath = nextRenamingPath;
    const nextFocusedPath = remapPathThroughMutation(this.#focusedPath, event, true);
    const nextSelectedPaths = [...this.#selectedPaths].map((selectedPath) => remapPathThroughMutation(selectedPath, event)).filter((resolvedPath) => resolvedPath != null).map((resolvedPath) => this.#store.getPathInfo(resolvedPath)?.path ?? null).filter((resolvedPath) => resolvedPath != null);
    const nextSelectionAnchorPath = remapPathThroughMutation(this.#selectionAnchorPath, event);
    const canonicalAnchorPath = nextSelectionAnchorPath == null ? null : this.#store.getPathInfo(nextSelectionAnchorPath)?.path ?? null;
    const uniqueNextSelectedPaths = [...new Set(nextSelectedPaths)];
    if (!arePathSetsEqual(this.#selectedPaths, uniqueNextSelectedPaths)) {
      this.#selectedPaths = new Set(uniqueNextSelectedPaths);
      this.#selectionVersion += 1;
    }
    this.#selectionAnchorPath = canonicalAnchorPath;
    return nextFocusedPath;
  }
  #subscribe() {
    return this.#store.on("*", (event) => {
      if (this.#suppressStoreNotifications) return;
      if (event.canonicalChanged) {
        this.#itemHandles.clear();
        this.#invalidateKnownPathCaches();
      }
      if (this.#dragSession != null && isPathMutationEvent(event)) this.#dragSession = null;
      const focusPathCandidate = isPathMutationEvent(event) ? this.#applyMutationState(event) : this.#focusedPath;
      const searchFocusCandidate = this.#searchValue != null && this.#searchValue.length > 0 ? this.#refreshActiveSearchState() : this.#searchValue === "" ? this.#focusedPath : focusPathCandidate;
      const shouldBuildFullProjection = this.#searchValue != null || event.operation !== "expand" && event.operation !== "collapse";
      this.#rebuildVisibleProjection(searchFocusCandidate, shouldBuildFullProjection);
      this.#emit(event);
      const mutationEvent = toTreesMutationEvent(event);
      if (mutationEvent != null) this.#emitMutation(mutationEvent);
    });
  }
  #toggleDirectory(path) {
    if (this.#store.isExpanded(path)) {
      this.#collapseDirectory(path);
      return;
    }
    this.#expandDirectory(path);
  }
};
const getGitStatusSignature = (entries) => {
  if (entries == null || entries.length === 0) return "0";
  let signature = `${entries.length}`;
  for (const entry of entries) signature += `\0${entry.path}\0${entry.status}`;
  return signature;
};
function normalizeInputPath(inputPath) {
  const isDirectory = inputPath.endsWith("/");
  let normalizedPath = "";
  let segmentStart = -1;
  for (let i2 = 0; i2 <= inputPath.length; i2 += 1) {
    if (!(inputPath[i2] === "/" || i2 === inputPath.length)) {
      if (segmentStart === -1) segmentStart = i2;
      continue;
    }
    if (segmentStart === -1) continue;
    if (normalizedPath !== "") normalizedPath += "/";
    normalizedPath += inputPath.slice(segmentStart, i2);
    segmentStart = -1;
  }
  if (normalizedPath === "") return null;
  return {
    isDirectory,
    path: normalizedPath
  };
}
function getAncestorDirectoryPaths(path) {
  const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;
  if (normalizedPath.length === 0) return [];
  const segments = normalizedPath.split("/");
  return segments.slice(0, -1).map((_2, index) => `${segments.slice(0, index + 1).join("/")}/`);
}
function getCanonicalGitStatusPath(path, isDirectory) {
  return isDirectory ? `${path}/` : path;
}
function resolveFileTreeGitStatusState(entries, previous = null) {
  const signature = getGitStatusSignature(entries == null ? void 0 : [...entries]);
  if (signature === "0") return null;
  if (previous?.signature === signature) return previous;
  const statusByPath = /* @__PURE__ */ new Map();
  const directoriesWithChanges = /* @__PURE__ */ new Set();
  const ignoredDirectoryPaths = /* @__PURE__ */ new Set();
  for (const entry of entries ?? []) {
    const normalizedPath = normalizeInputPath(entry.path);
    if (normalizedPath == null) continue;
    const canonicalPath = getCanonicalGitStatusPath(normalizedPath.path, normalizedPath.isDirectory);
    statusByPath.set(canonicalPath, entry.status);
    if (entry.status === "ignored" && normalizedPath.isDirectory) ignoredDirectoryPaths.add(canonicalPath);
    else if (normalizedPath.isDirectory) ignoredDirectoryPaths.delete(canonicalPath);
    for (const ancestorPath of getAncestorDirectoryPaths(normalizedPath.path)) directoriesWithChanges.add(ancestorPath);
  }
  return {
    directoriesWithChanges,
    ignoredDirectoryPaths,
    signature,
    statusByPath
  };
}
var n, l$1, t$1, i$1, r$1, f$1, e$1, o$2, c$1, s$1, h$1 = {}, p$1 = [], v$1 = Array.isArray, y$1 = p$1.slice, w$1 = Object.assign;
function d$1(n2) {
  n2 && n2.parentNode && n2.remove();
}
function _$1(n2, l2, u2) {
  var t2, i2, r2, f2 = {};
  for (r2 in l2) "key" == r2 ? t2 = l2[r2] : "ref" == r2 && "function" != typeof n2 ? i2 = l2[r2] : f2[r2] = l2[r2];
  return arguments.length > 2 && (f2.children = arguments.length > 3 ? y$1.call(arguments, 2) : u2), g$1(n2, f2, t2, i2, null);
}
function g$1(u2, t2, i2, r2, f2) {
  var e2 = { type: u2, props: t2, key: i2, ref: r2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == f2 ? ++l$1 : f2, __i: -1, __u: 0 };
  return null == f2 && null != n.vnode && n.vnode(e2), e2;
}
function k$1(n2) {
  return n2.children;
}
function m$1(n2, l2) {
  this.props = n2, this.context = l2, this.__g = 0;
}
function M(n2, l2) {
  if (null == l2) return n2.__ ? M(n2.__, n2.__i + 1) : null;
  for (var u2; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) return u2.__e;
  return "function" == typeof n2.type ? M(n2) : null;
}
function S(n2) {
  var l2, u2;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = null, l2 = 0; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) {
      n2.__e = u2.__e;
      break;
    }
    return S(n2);
  }
}
function $(l2) {
  (8 & l2.__g || !(l2.__g |= 8) || !t$1.push(l2) || r$1++) && i$1 == n.debounceRendering || ((i$1 = n.debounceRendering) || queueMicrotask)(x);
}
function x() {
  for (var l2, u2, i2, e2, o2, c2, s2, a2, h2 = 1; t$1.length; ) t$1.length > h2 && t$1.sort(f$1), l2 = t$1.shift(), h2 = t$1.length, 8 & l2.__g && (i2 = void 0, o2 = (e2 = (u2 = l2).__v).__e, c2 = [], s2 = [], (a2 = u2.__P) && ((i2 = w$1({}, e2)).__v = e2.__v + 1, n.vnode && n.vnode(i2), q$1(a2, i2, e2, u2.__n, a2.namespaceURI, 32 & e2.__u ? [o2] : null, c2, null == o2 ? M(e2) : o2, !!(32 & e2.__u), s2, a2.ownerDocument), i2.__v = e2.__v, i2.__.__k[i2.__i] = i2, P(c2, i2, s2), i2.__e != o2 && S(i2)));
  r$1 = 0;
}
function C$1(n2, l2, u2, t2, i2, r2, f2, e2, o2, c2, s2, a2) {
  var v2, y2, w2, d2, _2, g2, b2, k2 = t2 && t2.__k || p$1, m2 = l2.length;
  for (o2 = j(u2, l2, k2, o2, m2), v2 = 0; v2 < m2; v2++) null != (w2 = u2.__k[v2]) && (y2 = -1 == w2.__i ? h$1 : k2[w2.__i] || h$1, w2.__i = v2, g2 = q$1(n2, w2, y2, i2, r2, f2, e2, o2, c2, s2, a2), d2 = w2.__e, w2.ref && y2.ref != w2.ref && (y2.ref && B$1(y2.ref, null, w2), s2.push(w2.ref, w2.__c || d2, w2)), null == _2 && null != d2 && (_2 = d2), (b2 = !!(4 & w2.__u)) || y2.__k === w2.__k ? o2 = A$1(w2, o2, n2, b2) : "function" == typeof w2.type && void 0 !== g2 ? o2 = g2 : d2 && (o2 = d2.nextSibling), w2.__u &= -7);
  return u2.__e = _2, o2;
}
function j(n2, l2, u2, t2, i2) {
  var r2, f2, e2, o2, c2, s2 = u2.length, a2 = s2, h2 = 0;
  for (n2.__k = new Array(i2), r2 = 0; r2 < i2; r2++) null != (f2 = l2[r2]) && "boolean" != typeof f2 && "function" != typeof f2 ? (o2 = r2 + h2, (f2 = n2.__k[r2] = "string" == typeof f2 || "number" == typeof f2 || "bigint" == typeof f2 || f2.constructor == String ? g$1(null, f2, null, null, null) : v$1(f2) ? g$1(k$1, { children: f2 }, null, null, null) : null == f2.constructor && f2.__b > 0 ? g$1(f2.type, f2.props, f2.key, f2.ref ? f2.ref : null, f2.__v) : f2).__ = n2, f2.__b = n2.__b + 1, e2 = null, -1 != (c2 = f2.__i = I(f2, u2, o2, a2)) && (a2--, (e2 = u2[c2]) && (e2.__u |= 2)), null == e2 || null == e2.__v ? (-1 == c2 && (i2 > s2 ? h2-- : i2 < s2 && h2++), "function" != typeof f2.type && (f2.__u |= 4)) : c2 != o2 && (c2 == o2 - 1 ? h2-- : c2 == o2 + 1 ? h2++ : (c2 > o2 ? h2-- : h2++, f2.__u |= 4))) : n2.__k[r2] = null;
  if (a2) for (r2 = 0; r2 < s2; r2++) null != (e2 = u2[r2]) && 0 == (2 & e2.__u) && (e2.__e == t2 && (t2 = M(e2)), D$1(e2, e2));
  return t2;
}
function A$1(n2, l2, u2, t2) {
  var i2, r2;
  if ("function" == typeof n2.type) {
    for (i2 = n2.__k, r2 = 0; i2 && r2 < i2.length; r2++) i2[r2] && (i2[r2].__ = n2, l2 = A$1(i2[r2], l2, u2, t2));
    return l2;
  }
  n2.__e != l2 && (t2 && (l2 && n2.type && !l2.parentNode && (l2 = M(n2)), u2.insertBefore(n2.__e, l2 || null)), l2 = n2.__e);
  do {
    l2 = l2 && l2.nextSibling;
  } while (null != l2 && 8 == l2.nodeType);
  return l2;
}
function I(n2, l2, u2, t2) {
  var i2, r2, f2, e2 = n2.key, o2 = n2.type, c2 = l2[u2], s2 = null != c2 && 0 == (2 & c2.__u);
  if (null === c2 && null == n2.key || s2 && e2 == c2.key && o2 == c2.type) return u2;
  if (t2 > (s2 ? 1 : 0)) {
    for (i2 = u2 - 1, r2 = u2 + 1; i2 >= 0 || r2 < l2.length; ) if (null != (c2 = l2[f2 = i2 >= 0 ? i2-- : r2++]) && 0 == (2 & c2.__u) && e2 == c2.key && o2 == c2.type) return f2;
  }
  return -1;
}
function L(n2, l2, u2) {
  "-" == l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : u2;
}
function O(n2, l2, u2, t2, i2) {
  var r2;
  n: if ("style" == l2) if ("string" == typeof u2) n2.style.cssText = u2;
  else {
    if ("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2) for (l2 in t2) u2 && l2 in u2 || L(n2.style, l2, "");
    if (u2) for (l2 in u2) t2 && u2[l2] == t2[l2] || L(n2.style, l2, u2[l2]);
  }
  else if ("o" == l2[0] && "n" == l2[1]) r2 = l2 != (l2 = l2.replace(e$1, "$1")), (l2 = l2.slice(2))[0].toLowerCase() != l2[0] && (l2 = l2.toLowerCase()), n2.__l || (n2.__l = {}), n2.__l[l2 + r2] = u2, u2 ? t2 ? u2.l = t2.l : (u2.l = o$2, n2.addEventListener(l2, r2 ? s$1 : c$1, r2)) : n2.removeEventListener(l2, r2 ? s$1 : c$1, r2);
  else {
    if ("http://www.w3.org/2000/svg" == i2) l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l2 && "height" != l2 && "href" != l2 && "list" != l2 && "form" != l2 && "tabIndex" != l2 && "download" != l2 && "rowSpan" != l2 && "colSpan" != l2 && "role" != l2 && "popover" != l2 && l2 in n2) try {
      n2[l2] = null == u2 ? "" : u2;
      break n;
    } catch (n3) {
    }
    "function" == typeof u2 || (null == u2 || false === u2 && "-" != l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, "popover" == l2 && 1 == u2 ? "" : u2));
  }
}
function T(l2) {
  return function(u2) {
    if (this.__l) {
      var t2 = this.__l[u2.type + l2];
      if (null == u2.u) u2.u = o$2++;
      else if (u2.u < t2.l) return;
      return t2(n.event ? n.event(u2) : u2);
    }
  };
}
function q$1(l2, u2, t2, i2, r2, f2, e2, o2, c2, s2, a2) {
  var h2, p2, y2, _2, g2, b2, M2, S2, $2, x2, j2, A2, H, I2, L2, O2, T2, q2, P2, B2, D2, F2 = u2.type;
  if (null != u2.constructor) return null;
  128 & t2.__u && (c2 = !!(32 & t2.__u), t2.__c.__z && (o2 = u2.__e = t2.__e = (f2 = t2.__c.__z)[0], t2.__c.__z = null)), (h2 = n.__b) && h2(u2);
  n: if ("function" == typeof F2) try {
    if (S2 = u2.props, $2 = "prototype" in F2 && F2.prototype.render, x2 = (h2 = F2.contextType) && i2[h2.__c], j2 = h2 ? x2 ? x2.props.value : h2.__ : i2, t2.__c ? 2 & (p2 = u2.__c = t2.__c).__g && (p2.__g |= 1, M2 = true) : ($2 ? u2.__c = p2 = new F2(S2, j2) : (u2.__c = p2 = new m$1(S2, j2), p2.constructor = F2, p2.render = E), x2 && x2.sub(p2), p2.props = S2, p2.state || (p2.state = {}), p2.context = j2, p2.__n = i2, y2 = true, p2.__g |= 8, p2.__h = [], p2._sb = []), $2 && null == p2.__s && (p2.__s = p2.state), $2 && null != F2.getDerivedStateFromProps && (p2.__s == p2.state && (p2.__s = w$1({}, p2.__s)), w$1(p2.__s, F2.getDerivedStateFromProps(S2, p2.__s))), _2 = p2.props, g2 = p2.state, p2.__v = u2, y2) $2 && null == F2.getDerivedStateFromProps && null != p2.componentWillMount && p2.componentWillMount(), $2 && null != p2.componentDidMount && p2.__h.push(p2.componentDidMount);
    else {
      if ($2 && null == F2.getDerivedStateFromProps && S2 !== _2 && null != p2.componentWillReceiveProps && p2.componentWillReceiveProps(S2, j2), !(4 & p2.__g) && null != p2.shouldComponentUpdate && false === p2.shouldComponentUpdate(S2, p2.__s, j2) || u2.__v == t2.__v) {
        for (u2.__v != t2.__v && (p2.props = S2, p2.state = p2.__s, p2.__g &= -9), u2.__e = t2.__e, u2.__k = t2.__k, u2.__k.some(function(n2) {
          n2 && (n2.__ = u2);
        }), A2 = 0; A2 < p2._sb.length; A2++) p2.__h.push(p2._sb[A2]);
        p2._sb = [], p2.__h.length && e2.push(p2);
        break n;
      }
      null != p2.componentWillUpdate && p2.componentWillUpdate(S2, p2.__s, j2), $2 && null != p2.componentDidUpdate && p2.__h.push(function() {
        p2.componentDidUpdate(_2, g2, b2);
      });
    }
    if (p2.context = j2, p2.props = S2, p2.__P = l2, p2.__g &= -5, H = n.__r, I2 = 0, $2) {
      for (p2.state = p2.__s, p2.__g &= -9, H && H(u2), h2 = p2.render(p2.props, p2.state, p2.context), L2 = 0; L2 < p2._sb.length; L2++) p2.__h.push(p2._sb[L2]);
      p2._sb = [];
    } else do {
      p2.__g &= -9, H && H(u2), h2 = p2.render(p2.props, p2.state, p2.context), p2.state = p2.__s;
    } while (8 & p2.__g && ++I2 < 25);
    p2.state = p2.__s, null != p2.getChildContext && (i2 = w$1({}, i2, p2.getChildContext())), $2 && !y2 && null != p2.getSnapshotBeforeUpdate && (b2 = p2.getSnapshotBeforeUpdate(_2, g2)), O2 = h2, null != h2 && h2.type === k$1 && null == h2.key && (O2 = V(h2.props.children)), o2 = C$1(l2, v$1(O2) ? O2 : [O2], u2, t2, i2, r2, f2, e2, o2, c2, s2, a2), u2.__u &= -161, p2.__h.length && e2.push(p2), M2 && (p2.__g &= -4);
  } catch (l3) {
    if (u2.__v = null, c2 || null != f2) if (l3.then) {
      for (T2 = 0, q2 = false, u2.__u |= c2 ? 160 : 128, u2.__c.__z = [], P2 = 0; P2 < f2.length; P2++) null == (B2 = f2[P2]) || q2 || (8 == B2.nodeType && "$s" == B2.data ? (T2 > 0 && u2.__c.__z.push(B2), T2++, f2[P2] = null) : 8 == B2.nodeType && "/$s" == B2.data ? (--T2 > 0 && u2.__c.__z.push(B2), q2 = 0 === T2, o2 = f2[P2], f2[P2] = null) : T2 > 0 && (u2.__c.__z.push(B2), f2[P2] = null));
      if (!q2) {
        for (; o2 && 8 == o2.nodeType && o2.nextSibling; ) o2 = o2.nextSibling;
        f2[f2.indexOf(o2)] = null, u2.__c.__z = [o2];
      }
      u2.__e = o2;
    } else {
      for (D2 = f2.length; D2--; ) d$1(f2[D2]);
      N(u2);
    }
    else u2.__e = t2.__e, u2.__k = t2.__k, l3.then || N(u2);
    n.__e(l3, u2, t2);
  }
  else o2 = u2.__e = z$1(t2.__e, u2, t2, i2, r2, f2, e2, c2, s2, a2);
  return (h2 = n.diffed) && h2(u2), 128 & u2.__u ? void 0 : o2;
}
function N(n2) {
  n2 && n2.__c && (n2.__c.__g |= 4), n2 && n2.__k && n2.__k.forEach(N);
}
function P(l2, u2, t2) {
  for (var i2 = 0; i2 < t2.length; i2++) B$1(t2[i2], t2[++i2], t2[++i2]);
  n.__c && n.__c(u2, l2), l2.some(function(u3) {
    try {
      l2 = u3.__h, u3.__h = [], l2.some(function(n2) {
        n2.call(u3);
      });
    } catch (l3) {
      n.__e(l3, u3.__v);
    }
  });
}
function V(n2) {
  return "object" != typeof n2 || null == n2 || n2.__b && n2.__b > 0 ? n2 : v$1(n2) ? n2.map(V) : w$1({}, n2);
}
function z$1(l2, u2, t2, i2, r2, f2, e2, o2, c2, s2) {
  var a2, p2, w2, _2, g2, b2, k2, m2, S2 = t2.props, $2 = u2.props, x2 = u2.type;
  if ("svg" == x2 ? r2 = "http://www.w3.org/2000/svg" : "math" == x2 ? r2 = "http://www.w3.org/1998/Math/MathML" : r2 || (r2 = "http://www.w3.org/1999/xhtml"), null != f2) {
    for (a2 = 0; a2 < f2.length; a2++) if ((g2 = f2[a2]) && "setAttribute" in g2 == !!x2 && (x2 ? g2.localName == x2 : 3 == g2.nodeType)) {
      l2 = g2, f2[a2] = null;
      break;
    }
  }
  if (null == l2) {
    if (null == x2) return s2.createTextNode($2);
    l2 = s2.createElementNS(r2, x2, $2.is && $2), o2 && (n.__m && n.__m(u2, f2), o2 = false), f2 = null;
  }
  if (null == x2) S2 === $2 || o2 && l2.data == $2 || (l2.data = $2);
  else {
    if (f2 = f2 && y$1.call(l2.childNodes), S2 = t2.props || h$1, !o2 && null != f2) for (S2 = {}, a2 = 0; a2 < l2.attributes.length; a2++) S2[(g2 = l2.attributes[a2]).name] = g2.value;
    for (a2 in S2) if (g2 = S2[a2], "children" == a2) ;
    else if ("dangerouslySetInnerHTML" == a2) w2 = g2;
    else if (!(a2 in $2)) {
      if ("value" == a2 && "defaultValue" in $2 || "checked" == a2 && "defaultChecked" in $2) continue;
      O(l2, a2, null, g2, r2);
    }
    for (a2 in m2 = 1 & t2.__u, $2) g2 = $2[a2], "children" == a2 ? _2 = g2 : "dangerouslySetInnerHTML" == a2 ? p2 = g2 : "value" == a2 ? b2 = g2 : "checked" == a2 ? k2 = g2 : o2 && "function" != typeof g2 || S2[a2] === g2 && !m2 || O(l2, a2, g2, S2[a2], r2);
    if (p2) o2 || w2 && (p2.__html == w2.__html || p2.__html == l2.innerHTML) || (l2.innerHTML = p2.__html), u2.__k = [];
    else if (w2 && (l2.innerHTML = ""), C$1("template" == x2 ? l2.content : l2, v$1(_2) ? _2 : [_2], u2, t2, i2, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : r2, f2, e2, f2 ? f2[0] : t2.__k && M(t2, 0), o2, c2, s2), null != f2) for (a2 = f2.length; a2--; ) d$1(f2[a2]);
    o2 || (a2 = "value", "progress" == x2 && null == b2 ? l2.removeAttribute("value") : null == b2 || b2 === l2[a2] && ("progress" !== x2 || b2) || O(l2, a2, b2, S2[a2], r2), a2 = "checked", null != k2 && k2 != l2[a2] && O(l2, a2, k2, S2[a2], r2));
  }
  return l2;
}
function B$1(l2, u2, t2) {
  try {
    if ("function" == typeof l2) {
      var i2 = "function" == typeof l2.__u;
      i2 && l2.__u(), i2 && null == u2 || (l2.__u = l2(u2));
    } else l2.current = u2;
  } catch (l3) {
    n.__e(l3, t2);
  }
}
function D$1(l2, u2, t2) {
  var i2, r2;
  if (n.unmount && n.unmount(l2), (i2 = l2.ref) && (i2.current && i2.current != l2.__e || B$1(i2, null, u2)), null != (i2 = l2.__c)) {
    if (i2.componentWillUnmount) try {
      i2.componentWillUnmount();
    } catch (l3) {
      n.__e(l3, u2);
    }
    i2.__P = null;
  }
  if (i2 = l2.__k) for (r2 = 0; r2 < i2.length; r2++) i2[r2] && D$1(i2[r2], u2, t2 || "function" != typeof l2.type);
  t2 || d$1(l2.__e), l2.__e && l2.__e.__l && (l2.__e.__l = null), l2.__e = l2.__c = l2.__ = null;
}
function E(n2, l2, u2) {
  return this.constructor(n2, u2);
}
function F$1(l2, u2) {
  var t2, i2, r2, f2;
  u2 == document && (u2 = document.documentElement), n.__ && n.__(l2, u2), i2 = (t2 = !!(l2 && 32 & l2.__u)) ? null : u2.__k, l2 = u2.__k = _$1(k$1, null, [l2]), r2 = [], f2 = [], q$1(u2, l2, i2 || h$1, h$1, u2.namespaceURI, i2 ? null : u2.firstChild ? y$1.call(u2.childNodes) : null, r2, i2 ? i2.__e : u2.firstChild, t2, f2, u2.ownerDocument), P(r2, l2, f2);
}
function G(n2, l2) {
  n2.__u |= 32, F$1(n2, l2);
}
n = { __e: function(n2, l2, u2, t2) {
  for (var i2, f2, e2; l2 = l2.__; ) if ((i2 = l2.__c) && !(1 & i2.__g)) {
    i2.__g |= 4;
    try {
      if ((f2 = i2.constructor) && null != f2.getDerivedStateFromError && (i2.setState(f2.getDerivedStateFromError(n2)), e2 = 8 & i2.__g), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), e2 = 8 & i2.__g), e2) return void (i2.__g |= 2);
    } catch (l3) {
      n2 = l3;
    }
  }
  throw r$1 = 0, n2;
} }, l$1 = 0, m$1.prototype.setState = function(n2, l2) {
  var u2;
  u2 = null != this.__s && this.__s != this.state ? this.__s : this.__s = w$1({}, this.state), "function" == typeof n2 && (n2 = n2(w$1({}, u2), this.props)), n2 && w$1(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), $(this));
}, m$1.prototype.forceUpdate = function(n2) {
  this.__v && (this.__g |= 4, n2 && this.__h.push(n2), $(this));
}, m$1.prototype.render = k$1, t$1 = [], r$1 = 0, f$1 = function(n2, l2) {
  return n2.__v.__b - l2.__v.__b;
}, e$1 = /(PointerCapture)$|Capture$/i, o$2 = 0, c$1 = T(false), s$1 = T(true);
var o$1 = 0;
function u$1(t2, e2, n$1, f2, u2, i2) {
  e2 || (e2 = {});
  var a2, c2, l2 = e2;
  if ("ref" in l2 && "function" != typeof t2) for (c2 in l2 = {}, e2) "ref" == c2 ? a2 = e2[c2] : l2[c2] = e2[c2];
  var p2 = { type: t2, props: l2, key: n$1, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --o$1, __i: -1, __u: 0, __source: u2, __self: i2 };
  return n.vnode && n.vnode(p2), p2;
}
const DEFAULT_WIDTH = 16;
const DEFAULT_HEIGHT = 16;
const ICON_SIZE_OVERRIDES = {};
function Icon({ name, remappedFrom, token, width: propWidth, height: propHeight, viewBox: propViewBox, label, alignCapitals = false }) {
  "use no memo";
  const href = `#${name.replace(/^#/, "")}`;
  const { width: iconWidth, height: iconHeight, viewBox: overrideViewBox } = ICON_SIZE_OVERRIDES[name] ?? {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  };
  const width = propWidth ?? iconWidth;
  const height = propHeight ?? iconHeight;
  const viewBox = propViewBox ?? overrideViewBox ?? `0 0 ${iconWidth} ${iconHeight}`;
  const a11yProps = label != null ? {
    "aria-label": label,
    role: "img"
  } : { "aria-hidden": true };
  return /* @__PURE__ */ u$1("svg", {
    "data-icon-name": remappedFrom ?? name,
    "data-icon-token": token,
    "data-align-capitals": alignCapitals,
    ...a11yProps,
    viewBox,
    width,
    height,
    children: /* @__PURE__ */ u$1("use", { href })
  });
}
const splitCenter = (contents) => {
  if (contents.length < 2) return [contents, ""];
  const splitIndex = Math.ceil(contents.length / 2);
  return [contents.slice(0, splitIndex), contents.slice(splitIndex)];
};
const splitExtension = (contents) => {
  if (contents.length < 4) return [contents, ""];
  const extensionIndex = contents.lastIndexOf(".") + 1;
  const isTooLong = contents.length - extensionIndex > 10;
  const splitIndex = extensionIndex >= 1 && !isTooLong ? extensionIndex : Math.ceil(contents.length / 2);
  return [contents.slice(0, splitIndex), contents.slice(splitIndex)];
};
const splitLeafPath = (contents) => {
  if (contents.length < 4) return [contents, ""];
  const leafPathIndex = contents.lastIndexOf("/") + 1;
  const isTooLong = contents.length - leafPathIndex > 25;
  const splitIndex = leafPathIndex >= 1 && !isTooLong ? leafPathIndex : Math.ceil(contents.length / 2);
  return [contents.slice(0, splitIndex), contents.slice(splitIndex)];
};
const splitByIndex = (contents, { splitIndex } = {}) => {
  if (typeof splitIndex !== "number") {
    const centerIndex = Math.ceil(contents.length / 2);
    return [contents.slice(0, centerIndex), contents.slice(centerIndex)];
  }
  return [contents.slice(0, splitIndex), contents.slice(splitIndex)];
};
const splitLast = (contents, { splitOffset } = {}) => {
  if (typeof splitOffset !== "number" || splitOffset <= 0 || splitOffset >= contents.length) {
    const centerIndex = Math.ceil(contents.length / 2);
    return [contents.slice(0, centerIndex), contents.slice(centerIndex)];
  }
  const splitIndex = contents.length - splitOffset;
  return [contents.slice(0, splitIndex), contents.slice(splitIndex)];
};
const splitFirst = (contents, { splitOffset } = {}) => {
  if (typeof splitOffset !== "number" || splitOffset <= 0 || splitOffset >= contents.length) {
    const centerIndex = Math.ceil(contents.length / 2);
    return [contents.slice(0, centerIndex), contents.slice(centerIndex)];
  }
  const splitIndex = splitOffset;
  return [contents.slice(0, splitIndex), contents.slice(splitIndex)];
};
function OverflowMarker({ children, marker, variant = "default" }) {
  "use no memo";
  const isFadeVariant = variant === "fade";
  return /* @__PURE__ */ u$1("div", {
    "aria-hidden": true,
    "data-truncate-marker-cell": true,
    children: /* @__PURE__ */ u$1("div", {
      "data-truncate-marker": true,
      children: typeof marker === "function" ? marker({ children }) : isFadeVariant ? /* @__PURE__ */ u$1("span", { "data-truncate-fade": true }) : marker
    })
  });
}
function OverflowContent(options) {
  "use no memo";
  const { mode, children } = options;
  return /* @__PURE__ */ u$1("div", { children: [/* @__PURE__ */ u$1("div", {
    "data-truncate-content": "visible",
    children: mode === "fruncate" ? /* @__PURE__ */ u$1("span", { children }) : children
  }), /* @__PURE__ */ u$1("div", {
    "data-truncate-content": "overflow",
    "aria-hidden": true,
    children: mode === "fruncate" ? /* @__PURE__ */ u$1("span", { children }) : children
  })] });
}
function OverflowText({ children, mode = "truncate", marker = "…", variant = "default", ...props }) {
  "use no memo";
  const contentNode = /* @__PURE__ */ u$1(OverflowContent, {
    mode,
    children
  }, "content");
  const markerNode = /* @__PURE__ */ u$1(OverflowMarker, {
    marker,
    mode,
    variant
  }, "marker");
  const fillNode = /* @__PURE__ */ u$1("div", { "data-truncate-fill": true }, "fill");
  return /* @__PURE__ */ u$1("div", {
    "data-truncate-container": mode,
    "data-truncate-variant": variant,
    ...props,
    children: /* @__PURE__ */ u$1("div", {
      "data-truncate-grid": true,
      children: mode === "truncate" ? [contentNode, markerNode] : [
        markerNode,
        contentNode,
        fillNode
      ]
    })
  });
}
function Truncate({ children, ...props }) {
  "use no memo";
  return /* @__PURE__ */ u$1(OverflowText, {
    mode: "truncate",
    ...props,
    children
  });
}
function Fruncate({ children, ...props }) {
  "use no memo";
  return /* @__PURE__ */ u$1(OverflowText, {
    mode: "fruncate",
    ...props,
    children
  });
}
function MiddleTruncate({ children, contents, priority = "end", split = "center", minimumLength = 12, className, style, ...props }) {
  "use no memo";
  let firstSegment = null;
  let secondSegment = null;
  if (Array.isArray(contents)) {
    if (contents.length !== 2) {
      console.error("MiddleTruncate: contents must be an array of two items");
      return null;
    }
    firstSegment = /* @__PURE__ */ u$1(Truncate, {
      ...props,
      children: contents[0]
    });
    secondSegment = /* @__PURE__ */ u$1(Fruncate, {
      ...props,
      children: contents[1]
    });
  } else {
    if (typeof children !== "string") {
      console.error("MiddleTruncate: children must be a string");
      return null;
    }
    if (children.length === 0) return /* @__PURE__ */ u$1("div", {
      className,
      style
    });
    if (children.length < minimumLength) if (priority === "end") return /* @__PURE__ */ u$1(Fruncate, {
      ...props,
      className,
      style,
      children
    });
    else return /* @__PURE__ */ u$1(Truncate, {
      ...props,
      className,
      style,
      children
    });
    let splitFn = null;
    let splitIndex = null;
    let splitOffset = null;
    if (typeof split === "string") {
      if (split === "center") splitFn = splitCenter;
      else if (split === "extension") splitFn = splitExtension;
      else if (split === "leaf-path") splitFn = splitLeafPath;
    } else if (typeof split === "number") {
      splitFn = splitByIndex;
      splitIndex = split;
    } else if (Array.isArray(split)) {
      const [offsetType, offsetValue] = split;
      splitOffset = offsetValue;
      if (offsetType === "last") splitFn = splitLast;
      else if (offsetType === "first") splitFn = splitFirst;
    } else if (typeof split === "function") splitFn = split;
    splitFn ??= splitCenter;
    const [firstHalfMessage, secondHalfMessage] = splitFn(children, {
      priority,
      variant: props.variant,
      splitIndex: typeof splitIndex === "number" ? splitIndex : void 0,
      splitOffset: typeof splitOffset === "number" ? splitOffset : void 0
    });
    const firstIsLarger = firstHalfMessage.length >= secondHalfMessage.length;
    const firstCanBeSimple = priority === "equal" && !firstIsLarger;
    const secondCanBeSimple = priority === "equal" && firstIsLarger;
    const firstPropOverrides = {};
    const secondPropOverrides = {};
    if (firstCanBeSimple) firstPropOverrides.marker = "";
    if (secondCanBeSimple) secondPropOverrides.marker = "";
    firstSegment = /* @__PURE__ */ u$1(Truncate, {
      ...props,
      ...firstPropOverrides,
      children: firstHalfMessage
    });
    secondSegment = /* @__PURE__ */ u$1(Fruncate, {
      ...props,
      ...secondPropOverrides,
      children: secondHalfMessage
    });
  }
  return /* @__PURE__ */ u$1("div", {
    "data-truncate-group-container": "middle",
    className,
    style,
    children: [/* @__PURE__ */ u$1("div", {
      "data-truncate-segment-priority": priority === "start" || priority === "equal" ? "1" : "2",
      children: firstSegment
    }), /* @__PURE__ */ u$1("div", {
      "data-truncate-segment-priority": priority === "end" || priority === "equal" ? "1" : "2",
      children: secondSegment
    })]
  });
}
const EMPTY_FILE_TREE_LAYOUT_RANGE = {
  endIndex: -1,
  startIndex: -1
};
function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}
function createRange(startIndex, endIndex) {
  return startIndex < 0 || endIndex < startIndex ? EMPTY_FILE_TREE_LAYOUT_RANGE : {
    endIndex,
    startIndex
  };
}
function isEmptyRange(range) {
  return range.startIndex < 0 || range.endIndex < range.startIndex;
}
function getRangeHeight(range, itemHeight) {
  return isEmptyRange(range) ? 0 : (range.endIndex - range.startIndex + 1) * itemHeight;
}
function getFirstIntersectingIndex(offset, itemCount, itemHeight) {
  if (itemCount <= 0) return -1;
  const totalHeight = itemCount * itemHeight;
  if (offset <= 0) return 0;
  if (offset >= totalHeight) return itemCount;
  return Math.floor(offset / itemHeight);
}
function getLastIntersectingIndex(bottomOffset, itemCount, itemHeight) {
  if (itemCount <= 0 || bottomOffset <= 0) return -1;
  if (bottomOffset >= itemCount * itemHeight) return itemCount - 1;
  return Math.ceil(bottomOffset / itemHeight) - 1;
}
function getExpandedDirectoryIndicesByDepth(rows) {
  const indicesByDepth = /* @__PURE__ */ new Map();
  rows.forEach((row, index) => {
    if (row.kind !== "directory" || !row.isExpanded) return;
    const depth = row.ancestorPaths.length;
    const indices = indicesByDepth.get(depth);
    if (indices == null) {
      indicesByDepth.set(depth, [index]);
      return;
    }
    indices.push(index);
  });
  return indicesByDepth;
}
function findLastIndexAtOrBefore(indices, threshold) {
  let lowerBound = 0;
  let upperBound = indices.length - 1;
  let match = -1;
  while (lowerBound <= upperBound) {
    const midpoint = Math.floor((lowerBound + upperBound) / 2);
    const index = indices[midpoint];
    if (index == null) break;
    if (index <= threshold) {
      match = midpoint;
      lowerBound = midpoint + 1;
      continue;
    }
    upperBound = midpoint - 1;
  }
  return match;
}
function computeExpandedSubtreeEndIndices(rows) {
  const endIndexByPath = /* @__PURE__ */ new Map();
  const openDirectoryPaths = [];
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (row == null) continue;
    const activePaths = row.kind === "directory" && row.isExpanded ? [...row.ancestorPaths, row.path] : row.ancestorPaths;
    let sharedPrefixLength = 0;
    while (sharedPrefixLength < openDirectoryPaths.length && sharedPrefixLength < activePaths.length && openDirectoryPaths[sharedPrefixLength] === activePaths[sharedPrefixLength]) sharedPrefixLength += 1;
    for (let openIndex = openDirectoryPaths.length - 1; openIndex >= sharedPrefixLength; openIndex -= 1) {
      const path = openDirectoryPaths[openIndex];
      if (path != null) endIndexByPath.set(path, index - 1);
    }
    openDirectoryPaths.length = sharedPrefixLength;
    for (let activeIndex = sharedPrefixLength; activeIndex < activePaths.length; activeIndex += 1) {
      const path = activePaths[activeIndex];
      if (path != null) openDirectoryPaths.push(path);
    }
  }
  const lastIndex = rows.length - 1;
  for (const path of openDirectoryPaths) endIndexByPath.set(path, lastIndex);
  return endIndexByPath;
}
function computeStickyRows(rows, scrollTop, itemHeight) {
  if (rows.length === 0 || scrollTop <= 0) return [];
  const subtreeEndIndexByPath = computeExpandedSubtreeEndIndices(rows);
  const expandedDirectoryIndicesByDepth = getExpandedDirectoryIndicesByDepth(rows);
  const stickyRows = [];
  for (let slotDepth = 0; slotDepth < rows.length; slotDepth += 1) {
    const candidateIndices = expandedDirectoryIndicesByDepth.get(slotDepth);
    if (candidateIndices == null || candidateIndices.length === 0) break;
    const slotTop = scrollTop + slotDepth * itemHeight;
    let candidateOffset = findLastIndexAtOrBefore(candidateIndices, Math.min(rows.length - 1, Math.floor(slotTop / itemHeight)));
    let candidate = null;
    while (candidateOffset >= 0) {
      const rowIndex = candidateIndices[candidateOffset];
      const row = rowIndex == null ? null : rows[rowIndex] ?? null;
      if (row != null && (slotDepth === 0 || row.ancestorPaths[slotDepth - 1] === stickyRows[slotDepth - 1]?.path)) {
        candidate = row;
        break;
      }
      candidateOffset -= 1;
    }
    if (candidate == null) break;
    stickyRows.push(candidate);
  }
  return stickyRows.map((row, slotDepth) => {
    const defaultTop = slotDepth * itemHeight;
    const nextBoundaryIndex = (subtreeEndIndexByPath.get(row.path) ?? rows.length - 1) + 1;
    if (nextBoundaryIndex >= rows.length) return {
      row,
      top: defaultTop
    };
    const nextBoundaryTop = nextBoundaryIndex * itemHeight - scrollTop;
    return {
      row,
      top: Math.min(defaultTop, nextBoundaryTop - itemHeight)
    };
  }).filter((entry) => entry.top + itemHeight > 0);
}
function computeFileTreeLayout(rows, metrics) {
  const totalRowCount = metrics.totalRowCount ?? rows.length;
  const totalHeight = totalRowCount * metrics.itemHeight;
  const viewportHeight = Math.max(0, metrics.viewportHeight);
  const overscan = Math.max(0, Math.floor(metrics.overscan));
  const maxScrollTop = Math.max(0, totalHeight - viewportHeight);
  const scrollTop = clamp(metrics.scrollTop, 0, maxScrollTop);
  const stickyRows = metrics.stickyRows ?? computeStickyRows(rows, scrollTop, metrics.itemHeight);
  const stickyHeight = stickyRows.reduce((maximumBottom, entry) => Math.max(maximumBottom, entry.top + metrics.itemHeight), 0);
  const paneTop = Math.min(totalHeight, scrollTop + stickyHeight);
  const paneHeight = Math.max(0, viewportHeight - stickyHeight);
  const contentHeight = Math.max(0, totalHeight - paneTop);
  const firstVisiblePhysicalIndex = getFirstIntersectingIndex(scrollTop, totalRowCount, metrics.itemHeight);
  const firstProjectedIndex = getFirstIntersectingIndex(paneTop, totalRowCount, metrics.itemHeight);
  const firstOccludedIndex = stickyHeight <= 0 || firstVisiblePhysicalIndex < 0 || firstVisiblePhysicalIndex >= totalRowCount ? -1 : firstVisiblePhysicalIndex;
  const lastOccludedIndex = firstOccludedIndex === -1 ? -1 : Math.min(totalRowCount - 1, firstProjectedIndex - 1);
  const occludedCount = firstOccludedIndex === -1 || lastOccludedIndex < firstOccludedIndex ? 0 : lastOccludedIndex - firstOccludedIndex + 1;
  const visible = paneHeight <= 0 || firstProjectedIndex >= totalRowCount ? EMPTY_FILE_TREE_LAYOUT_RANGE : createRange(firstProjectedIndex, getLastIntersectingIndex(paneTop + paneHeight, totalRowCount, metrics.itemHeight));
  const minimumWindowStart = lastOccludedIndex + 1;
  const windowRange = isEmptyRange(visible) ? EMPTY_FILE_TREE_LAYOUT_RANGE : createRange(Math.max(minimumWindowStart, visible.startIndex - overscan), Math.min(totalRowCount - 1, visible.endIndex + overscan));
  const windowHeight = getRangeHeight(windowRange, metrics.itemHeight);
  return {
    occlusion: {
      firstOccludedIndex,
      lastOccludedIndex,
      occludedCount
    },
    physical: {
      itemHeight: metrics.itemHeight,
      maxScrollTop,
      overscan,
      scrollTop,
      totalHeight,
      totalRowCount,
      viewportHeight
    },
    projected: {
      contentHeight,
      paneHeight,
      paneTop
    },
    sticky: {
      height: stickyHeight,
      rows: stickyRows
    },
    visible,
    window: {
      endIndex: windowRange.endIndex,
      height: windowHeight,
      offsetTop: isEmptyRange(windowRange) ? 0 : windowRange.startIndex * metrics.itemHeight,
      startIndex: windowRange.startIndex
    }
  };
}
const GIT_STATUS_LABEL = {
  added: "A",
  deleted: "D",
  ignored: null,
  modified: "M",
  renamed: "R",
  untracked: "U"
};
const GIT_STATUS_TITLE = {
  added: "Git status: added",
  deleted: "Git status: deleted",
  ignored: "Git status: ignored",
  modified: "Git status: modified",
  renamed: "Git status: renamed",
  untracked: "Git status: untracked"
};
const GIT_STATUS_DESCENDANT_TITLE = "Contains git status items";
function computeFocusedRowScrollIntoView(input) {
  const { currentScrollTop, focusedIndex, itemHeight, topInset = 0, viewportHeight } = input;
  if (focusedIndex < 0) return null;
  const effectiveInset = Math.max(0, topInset);
  const itemTop = focusedIndex * itemHeight;
  const itemBottom = itemTop + itemHeight;
  if (itemTop < currentScrollTop + effectiveInset) {
    const nextScrollTop = Math.max(0, itemTop - effectiveInset);
    return nextScrollTop === currentScrollTop ? null : nextScrollTop;
  }
  if (itemBottom > currentScrollTop + viewportHeight) {
    const nextScrollTop = itemBottom - viewportHeight;
    return nextScrollTop === currentScrollTop ? null : nextScrollTop;
  }
  return null;
}
function computeFocusedRowScrollTopForOffset(input) {
  const { currentScrollTop, focusedIndex, itemHeight, offset, topInset = 0, totalHeight, viewportHeight } = input;
  if (offset === "nearest") return computeFocusedRowScrollIntoView({
    currentScrollTop,
    focusedIndex,
    itemHeight,
    topInset,
    viewportHeight
  });
  if (focusedIndex < 0) return null;
  const effectiveInset = Math.max(0, topInset);
  const itemTop = focusedIndex * itemHeight;
  const visibleHeight = Math.max(0, viewportHeight - effectiveInset);
  const targetViewportOffset = offset === "center" ? effectiveInset + Math.max(0, (visibleHeight - itemHeight) / 2) : effectiveInset;
  const maxScrollTop = Math.max(0, totalHeight - viewportHeight);
  const nextScrollTop = Math.max(0, Math.min(itemTop - targetViewportOffset, maxScrollTop));
  return nextScrollTop === currentScrollTop ? null : nextScrollTop;
}
function computeViewportOffsetScrollTop(input) {
  const { currentScrollTop, focusedIndex, itemHeight, targetViewportOffset, totalHeight, viewportHeight } = input;
  if (focusedIndex < 0) return null;
  const effectiveOffset = Math.max(0, targetViewportOffset);
  const itemTop = focusedIndex * itemHeight;
  const itemBottom = itemTop + itemHeight;
  const currentViewportTop = currentScrollTop + effectiveOffset;
  const currentViewportBottom = currentScrollTop + viewportHeight;
  if (itemTop >= currentViewportTop && itemBottom <= currentViewportBottom) return null;
  const maxScrollTop = Math.max(0, totalHeight - viewportHeight);
  const preservedScrollTop = Math.max(0, Math.min(itemTop - effectiveOffset, maxScrollTop));
  return preservedScrollTop === currentScrollTop ? null : preservedScrollTop;
}
function focusElement(element) {
  if (element == null || !element.isConnected) return false;
  if (element === document.body || element === document.documentElement) return false;
  element.focus({ preventScroll: true });
  const rootNode = element.getRootNode();
  if (rootNode instanceof ShadowRoot) return rootNode.activeElement === element;
  return document.activeElement === element;
}
function getActiveTreeElement(rootElement) {
  const rootNode = rootElement.getRootNode();
  if (rootNode instanceof ShadowRoot) {
    const activeElement$1 = rootNode.activeElement;
    return activeElement$1 instanceof HTMLElement ? activeElement$1 : null;
  }
  const activeElement = document.activeElement;
  return activeElement instanceof HTMLElement && rootElement.contains(activeElement) ? activeElement : null;
}
function readMeasuredViewportHeight(scrollElement, fallbackViewportHeight) {
  if (scrollElement == null) return fallbackViewportHeight;
  const rectHeight = scrollElement.getBoundingClientRect().height;
  if (rectHeight > 0) return rectHeight;
  return scrollElement.clientHeight > 0 ? scrollElement.clientHeight : fallbackViewportHeight;
}
function getCachedViewportHeight(cachedViewportHeight, fallbackViewportHeight) {
  return cachedViewportHeight != null && cachedViewportHeight > 0 ? cachedViewportHeight : fallbackViewportHeight;
}
function getResizeObserverViewportHeight(entry) {
  const borderBoxSize = entry.borderBoxSize;
  const firstBorderBoxSize = Array.isArray(borderBoxSize) ? borderBoxSize[0] : borderBoxSize;
  if (firstBorderBoxSize != null && Number.isFinite(firstBorderBoxSize.blockSize) && firstBorderBoxSize.blockSize > 0) return firstBorderBoxSize.blockSize;
  return entry.contentRect.height > 0 ? entry.contentRect.height : null;
}
function scrollFocusedRowIntoView(scrollElement, focusedIndex, itemHeight, viewportHeight, topInset = 0) {
  const nextScrollTop = computeFocusedRowScrollIntoView({
    currentScrollTop: scrollElement.scrollTop,
    focusedIndex,
    itemHeight,
    topInset,
    viewportHeight
  });
  if (nextScrollTop == null) return false;
  scrollElement.scrollTop = nextScrollTop;
  return true;
}
function scrollFocusedRowToOffset(scrollElement, focusedIndex, itemHeight, viewportHeight, totalHeight, offset, topInset = 0) {
  const nextScrollTop = computeFocusedRowScrollTopForOffset({
    currentScrollTop: scrollElement.scrollTop,
    focusedIndex,
    itemHeight,
    offset,
    topInset,
    totalHeight,
    viewportHeight
  });
  if (nextScrollTop == null) return false;
  scrollElement.scrollTop = nextScrollTop;
  return true;
}
function scrollFocusedRowToViewportOffset(scrollElement, focusedIndex, itemHeight, viewportHeight, totalHeight, targetViewportOffset) {
  const nextScrollTop = computeViewportOffsetScrollTop({
    currentScrollTop: scrollElement.scrollTop,
    focusedIndex,
    itemHeight,
    targetViewportOffset,
    totalHeight,
    viewportHeight
  });
  if (nextScrollTop == null) return false;
  scrollElement.scrollTop = nextScrollTop;
  return true;
}
function getParkedFocusedRowOffset(focusedIndex, itemHeight, range, windowHeight) {
  if (range.end < range.start) return null;
  if (focusedIndex < range.start) return -itemHeight;
  if (focusedIndex > range.end) return windowHeight;
  return null;
}
function classifyFileTreeRenameHandoff(input) {
  const { renamingPath, previousRenamingPath, hasRenderedInput } = input;
  if (renamingPath == null) return "reset";
  if (!hasRenderedInput) return "reveal-canonical";
  if (previousRenamingPath === renamingPath) return "ignore";
  return "focus-input";
}
function RenameInput({ ariaLabel, isFlattened = false, ref, value, onBlur, onInput }) {
  return /* @__PURE__ */ u$1("input", {
    ref,
    "data-item-rename-input": true,
    ...isFlattened ? { "data-item-flattened-rename-input": true } : {},
    "aria-label": ariaLabel,
    value,
    onBlur,
    onInput,
    onClick: (event) => event.stopPropagation(),
    onMouseDown: (event) => event.stopPropagation(),
    onPointerDown: (event) => event.stopPropagation()
  });
}
function computeFileTreeRowElementAttributes(input) {
  const { row, mode, targetPath, ariaLabel, domId, isParked, itemHeight, features, state, extraStyle } = input;
  const isSticky = mode === "sticky";
  const parentPath = row.ancestorPaths.at(-1) ?? "";
  const stateAttributes = {};
  if (state.isFocusRinged) stateAttributes["data-item-focused"] = true;
  if (row.isSelected) stateAttributes["data-item-selected"] = true;
  if (state.isContextHovered) stateAttributes["data-item-context-hover"] = "true";
  if (state.isDragTarget) stateAttributes["data-item-drag-target"] = true;
  if (state.isDragging) stateAttributes["data-item-dragging"] = true;
  if (state.effectiveGitStatus != null) stateAttributes["data-item-git-status"] = state.effectiveGitStatus;
  if (state.containsGitChange) stateAttributes["data-item-contains-git-change"] = "true";
  return {
    "aria-expanded": !isSticky && row.kind === "directory" ? row.isExpanded : void 0,
    "aria-haspopup": features.contextMenuEnabled ? "menu" : void 0,
    "aria-label": ariaLabel,
    "aria-level": !isSticky ? row.level + 1 : void 0,
    "aria-posinset": !isSticky ? row.posInSet + 1 : void 0,
    "aria-selected": !isSticky ? row.isSelected ? "true" : "false" : void 0,
    "aria-setsize": !isSticky ? row.setSize : void 0,
    "data-file-tree-sticky-path": isSticky ? targetPath : void 0,
    "data-file-tree-sticky-row": isSticky ? "true" : void 0,
    "data-item-context-menu-button-visibility": features.actionLaneEnabled ? features.contextMenuButtonVisibility : void 0,
    "data-item-context-menu-trigger-mode": features.contextMenuEnabled ? features.contextMenuTriggerMode : void 0,
    "data-item-has-context-menu-action-lane": features.actionLaneEnabled ? "true" : void 0,
    "data-item-has-git-lane": features.gitLaneActive ? "true" : void 0,
    "data-item-parent-path": parentPath.length > 0 ? parentPath : void 0,
    "data-item-parked": isParked ? "true" : void 0,
    "data-item-path": targetPath,
    "data-item-type": row.kind === "directory" ? "folder" : "file",
    "data-type": "item",
    id: !isSticky ? domId : void 0,
    role: !isSticky ? "treeitem" : void 0,
    style: {
      minHeight: `${itemHeight}px`,
      ...extraStyle
    },
    tabIndex: !isSticky && row.isFocused ? 0 : -1,
    ...stateAttributes
  };
}
function computeFileTreeRowClickPlan(input) {
  const { event, mode, isSearchOpen, isDirectory } = input;
  const additive = event.ctrlKey || event.metaKey;
  const hasModifier = event.shiftKey || additive;
  const selection = event.shiftKey ? {
    additive,
    kind: "range"
  } : additive ? { kind: "toggle" } : { kind: "single" };
  return {
    closeSearch: isSearchOpen,
    revealCanonical: mode === "sticky",
    selection,
    toggleDirectory: !hasModifier && isDirectory
  };
}
var t, r, u, i, o = Object.is, f = 0, c = [], e = n, a = e.__b, v = e.__r, l = e.diffed, m = e.__c, s = e.unmount, p = e.__;
function d(n2, t2) {
  e.__h && e.__h(r, n2, f || t2), f = 0;
  var u2 = r.__H || (r.__H = { __: [], __h: [] });
  return n2 >= u2.__.length && u2.__.push({}), u2.__[n2];
}
function h(n2) {
  return f = 1, y(D, n2);
}
function y(n2, u2, i2) {
  var f2 = d(t++, 2);
  if (f2.t = n2, !f2.__c && (f2.__ = [D(void 0, u2), function(n3) {
    var t2 = f2.__N ? f2.__N[0] : f2.__[0], r2 = f2.t(t2, n3);
    o(t2, r2) || (f2.__N = [r2, f2.__[1]], f2.__c.setState({}));
  }], f2.__c = r, !r.__f)) {
    var c2 = function(n3, t2, r2) {
      if (!f2.__c.__H) return true;
      var u3 = f2.__c.__H.__.filter(function(n4) {
        return !!n4.__c;
      });
      if (u3.every(function(n4) {
        return !n4.__N;
      })) return !e2 || e2.call(this, n3, t2, r2);
      var i3 = f2.__c.props !== n3;
      return u3.forEach(function(n4) {
        if (n4.__N) {
          var t3 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, o(t3, n4.__[0]) || (i3 = true);
        }
      }), e2 && e2.call(this, n3, t2, r2) || i3;
    };
    r.__f = true;
    var e2 = r.shouldComponentUpdate, a2 = r.componentWillUpdate;
    r.componentWillUpdate = function(n3, t2, r2) {
      if (4 & this.__g) {
        var u3 = e2;
        e2 = void 0, c2(n3, t2, r2), e2 = u3;
      }
      a2 && a2.call(this, n3, t2, r2);
    }, r.shouldComponentUpdate = c2;
  }
  return f2.__N || f2.__;
}
function _(n2, u2) {
  var i2 = d(t++, 3);
  !e.__s && C(i2.__H, u2) && (i2.__ = n2, i2.u = u2, r.__H.__h.push(i2));
}
function A(n2, u2) {
  var i2 = d(t++, 4);
  !e.__s && C(i2.__H, u2) && (i2.__ = n2, i2.u = u2, r.__h.push(i2));
}
function F(n2) {
  return f = 5, q(function() {
    return { current: n2 };
  }, []);
}
function q(n2, r2) {
  var u2 = d(t++, 7);
  return C(u2.__H, r2) && (u2.__ = n2(), u2.__H = r2, u2.__h = n2), u2.__;
}
function b(n2, t2) {
  return f = 8, q(function() {
    return n2;
  }, t2);
}
function g() {
  for (var n2; n2 = c.shift(); ) if (n2.__P && n2.__H) try {
    n2.__H.__h.forEach(z), n2.__H.__h.forEach(B), n2.__H.__h = [];
  } catch (t2) {
    n2.__H.__h = [], e.__e(t2, n2.__v);
  }
}
e.__b = function(n2) {
  r = null, a && a(n2);
}, e.__ = function(n2, t2) {
  n2 && t2.__k && t2.__k.__m && (n2.__m = t2.__k.__m), p && p(n2, t2);
}, e.__r = function(n2) {
  v && v(n2), t = 0;
  var i2 = (r = n2.__c).__H;
  i2 && (u === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
  })) : (i2.__h.forEach(z), i2.__h.forEach(B), i2.__h = [], t = 0)), u = r;
}, e.diffed = function(n2) {
  l && l(n2);
  var t2 = n2.__c;
  t2 && t2.__H && (t2.__H.__h.length && (1 !== c.push(t2) && i === e.requestAnimationFrame || ((i = e.requestAnimationFrame) || w)(g)), t2.__H.__.forEach(function(n3) {
    n3.u && (n3.__H = n3.u), n3.u = void 0;
  })), u = r = null;
}, e.__c = function(n2, t2) {
  t2.some(function(n3) {
    try {
      n3.__h.forEach(z), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B(n4);
      });
    } catch (r2) {
      t2.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t2 = [], e.__e(r2, n3.__v);
    }
  }), m && m(n2, t2);
}, e.unmount = function(n2) {
  s && s(n2);
  var t2, r2 = n2.__c;
  r2 && r2.__H && (r2.__H.__.forEach(function(n3) {
    try {
      z(n3);
    } catch (n4) {
      t2 = n4;
    }
  }), r2.__H = void 0, t2 && e.__e(t2, r2.__v));
};
var k = "function" == typeof requestAnimationFrame;
function w(n2) {
  var t2, r2 = function() {
    clearTimeout(u2), k && cancelAnimationFrame(t2), setTimeout(n2);
  }, u2 = setTimeout(r2, 35);
  k && (t2 = requestAnimationFrame(r2));
}
function z(n2) {
  var t2 = r, u2 = n2.__c;
  "function" == typeof u2 && (n2.__c = void 0, u2()), r = t2;
}
function B(n2) {
  var t2 = r;
  n2.__c = n2.__(), r = t2;
}
function C(n2, t2) {
  return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
    return !o(t3, n2[r2]);
  });
}
function D(n2, t2) {
  return "function" == typeof t2 ? t2(n2) : t2;
}
function formatFlattenedSegments(row, renameInput = null, dragTargetFlattenedSegmentPath = null) {
  "use no memo";
  const segments = row.flattenedSegments;
  if (segments == null || segments.length === 0) return renameInput ?? row.name;
  return /* @__PURE__ */ u$1("span", {
    "data-item-flattened-subitems": true,
    children: segments.map((segment, index) => {
      const isLast = index === segments.length - 1;
      return /* @__PURE__ */ u$1(k$1, { children: [/* @__PURE__ */ u$1("span", {
        "data-item-flattened-subitem": segment.path,
        "data-item-flattened-subitem-drag-target": dragTargetFlattenedSegmentPath === segment.path ? "true" : void 0,
        children: isLast && renameInput != null ? renameInput : /* @__PURE__ */ u$1(Truncate, { children: segment.name })
      }), index < segments.length - 1 ? " / " : ""] }, segment.path);
    })
  });
}
function getFileTreeRowPath(row) {
  return row.isFlattened ? row.flattenedSegments?.findLast((segment) => segment.isTerminal)?.path ?? row.path : row.path;
}
function getFileTreeRowAriaLabel(row) {
  const flattenedSegments = row.flattenedSegments;
  if (flattenedSegments == null || flattenedSegments.length === 0) return row.name;
  return flattenedSegments.map((segment) => segment.name).join(" / ");
}
function computeStickyRowsFromCandidates(candidates, scrollTop, itemHeight, totalRowCount) {
  return candidates.map((candidate, slotDepth) => {
    const defaultTop = slotDepth * itemHeight;
    const nextBoundaryIndex = candidate.subtreeEndIndex + 1;
    if (nextBoundaryIndex >= totalRowCount) return {
      row: candidate.row,
      top: defaultTop
    };
    const nextBoundaryTop = nextBoundaryIndex * itemHeight - scrollTop;
    return {
      row: candidate.row,
      top: Math.min(defaultTop, nextBoundaryTop - itemHeight)
    };
  }).filter((entry) => entry.top + itemHeight > 0);
}
function computeFileTreeViewLayoutState({ controller, itemHeight, overscan, scrollTop, stickyFolders, viewportHeight }) {
  const visibleCount = controller.getVisibleCount();
  const stickyCandidates = stickyFolders && visibleCount > 0 ? controller.getStickyRowCandidates(scrollTop, itemHeight) : [];
  const visibleRows = stickyCandidates == null && stickyFolders && visibleCount > 0 ? controller.getVisibleRows(0, visibleCount - 1) : [];
  const snapshot = computeFileTreeLayout(visibleRows, {
    itemHeight,
    overscan,
    scrollTop,
    stickyRows: stickyCandidates == null ? void 0 : computeStickyRowsFromCandidates(stickyCandidates, scrollTop, itemHeight, visibleCount),
    totalRowCount: visibleCount,
    viewportHeight
  });
  const previewStickyCandidates = stickyFolders && scrollTop <= 0 && visibleCount > 0 ? controller.getStickyRowCandidates(1, itemHeight) : [];
  const overlayRows = previewStickyCandidates != null && scrollTop <= 0 ? computeStickyRowsFromCandidates(previewStickyCandidates, 1, itemHeight, visibleCount) : stickyFolders && scrollTop <= 0 && visibleRows.length > 0 ? computeStickyRows(visibleRows, 1, itemHeight) : snapshot.sticky.rows;
  return {
    overlayHeight: overlayRows.reduce((maxBottom, entry) => Math.max(maxBottom, entry.top + itemHeight), 0),
    overlayRows,
    snapshot,
    visibleRows
  };
}
const TOUCH_LONG_PRESS_DELAY = 400;
const TOUCH_LONG_PRESS_MOVE_THRESHOLD = 10;
const DRAG_EDGE_SCROLL_THRESHOLD = 40;
const DRAG_EDGE_SCROLL_MAX_SPEED = 18;
function getPointElement(rootNode, clientX, clientY) {
  const pointRoot = rootNode;
  const documentElementFromPoint = document.elementFromPoint?.bind(document) ?? null;
  const element = pointRoot.elementFromPoint?.(clientX, clientY) ?? documentElementFromPoint?.(clientX, clientY) ?? null;
  if (rootNode instanceof ShadowRoot && (element == null || !rootNode.contains(element))) return getShadowPointElementByGeometry(rootNode, clientX, clientY);
  return element instanceof HTMLElement ? element : null;
}
function getShadowPointElementByGeometry(rootNode, clientX, clientY) {
  const candidates = Array.from(rootNode.querySelectorAll('[data-type="item"], [data-item-flattened-subitem]'));
  for (let index = candidates.length - 1; index >= 0; index--) {
    const candidate = candidates[index];
    const rect = candidate.getBoundingClientRect();
    if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) return candidate;
  }
  return null;
}
function resolveDropTargetFromElement(target) {
  const rowButton = target?.closest?.('[data-type="item"]');
  if (!(rowButton instanceof HTMLElement)) return null;
  const hoveredPath = rowButton.dataset.itemPath ?? null;
  if (hoveredPath == null) return null;
  const flattenedSegment = target?.closest?.("[data-item-flattened-subitem]");
  const flattenedSegmentPath = flattenedSegment instanceof HTMLElement ? flattenedSegment.getAttribute("data-item-flattened-subitem") ?? null : null;
  if (flattenedSegmentPath != null && flattenedSegmentPath.endsWith("/")) return {
    directoryPath: flattenedSegmentPath,
    flattenedSegmentPath,
    hoveredPath,
    kind: "directory"
  };
  if (rowButton.dataset.itemType === "folder") return {
    directoryPath: hoveredPath,
    flattenedSegmentPath: null,
    hoveredPath,
    kind: "directory"
  };
  const parentPath = rowButton.dataset.itemParentPath ?? null;
  if (parentPath == null || parentPath.length === 0) return {
    directoryPath: null,
    flattenedSegmentPath: null,
    hoveredPath,
    kind: "root"
  };
  return {
    directoryPath: parentPath,
    flattenedSegmentPath: null,
    hoveredPath,
    kind: "directory"
  };
}
function createDragPreviewElement(sourceElement) {
  const preview = sourceElement.cloneNode(true);
  preview.removeAttribute("id");
  preview.dataset.fileTreeDragPreview = "true";
  preview.setAttribute("aria-hidden", "true");
  preview.tabIndex = -1;
  Object.assign(preview.style, {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    left: "0px",
    margin: "0",
    pointerEvents: "none",
    position: "fixed",
    top: "0px",
    willChange: "transform",
    zIndex: "10000"
  });
  return preview;
}
function shouldUseCustomPointerDragImage() {
  return navigator.vendor !== "Apple Computer, Inc.";
}
function getDragEdgeScrollDelta(clientY, scrollRect) {
  const topDistance = clientY - scrollRect.top;
  if (topDistance < DRAG_EDGE_SCROLL_THRESHOLD) {
    const clampedDistance = Math.max(0, topDistance);
    return -Math.ceil((DRAG_EDGE_SCROLL_THRESHOLD - clampedDistance) / DRAG_EDGE_SCROLL_THRESHOLD * DRAG_EDGE_SCROLL_MAX_SPEED);
  }
  const bottomDistance = scrollRect.bottom - clientY;
  if (bottomDistance < DRAG_EDGE_SCROLL_THRESHOLD) {
    const clampedDistance = Math.max(0, bottomDistance);
    return Math.ceil((DRAG_EDGE_SCROLL_THRESHOLD - clampedDistance) / DRAG_EDGE_SCROLL_THRESHOLD * DRAG_EDGE_SCROLL_MAX_SPEED);
  }
  return 0;
}
function getBuiltInGitStatusDecoration(gitStatus, containsGitChange) {
  if (gitStatus != null) {
    const label = GIT_STATUS_LABEL[gitStatus];
    if (label == null) return null;
    return {
      text: label,
      title: GIT_STATUS_TITLE[gitStatus]
    };
  }
  if (containsGitChange) return {
    icon: {
      name: "file-tree-icon-dot",
      width: 6,
      height: 6
    },
    title: GIT_STATUS_DESCENDANT_TITLE
  };
  return null;
}
function getInheritedIgnoredGitStatus(ancestorPaths, ignoredDirectoryPaths, ignoredInheritanceCache) {
  if (ignoredDirectoryPaths == null || ignoredDirectoryPaths.size === 0) return null;
  const visitedAncestors = [];
  for (let index = ancestorPaths.length - 1; index >= 0; index -= 1) {
    const ancestorPath = ancestorPaths[index];
    const cached = ignoredInheritanceCache.get(ancestorPath);
    if (cached != null) {
      for (const visitedAncestor of visitedAncestors) ignoredInheritanceCache.set(visitedAncestor, cached);
      return cached ? "ignored" : null;
    }
    if (ignoredDirectoryPaths.has(ancestorPath)) {
      ignoredInheritanceCache.set(ancestorPath, true);
      for (const visitedAncestor of visitedAncestors) ignoredInheritanceCache.set(visitedAncestor, true);
      return "ignored";
    }
    visitedAncestors.push(ancestorPath);
  }
  for (const visitedAncestor of visitedAncestors) ignoredInheritanceCache.set(visitedAncestor, false);
  return null;
}
function isFileTreeDirectoryHandle(item) {
  return item != null && "toggle" in item;
}
function isSpaceSelectionKey(event) {
  return event.code === "Space" || event.key === " " || event.key === "Spacebar";
}
function isSearchOpenSeedKey(event) {
  return event.key.length === 1 && /^[\p{L}\p{N}]$/u.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey;
}
function getFileTreeGuideStyleText(focusedParentPath) {
  if (focusedParentPath == null) return "";
  return `[data-item-section="spacing-item"][data-ancestor-path="${focusedParentPath.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"] { opacity: 1; }`;
}
function isContextMenuOpenKey(event) {
  return event.shiftKey && event.key === "F10" || event.key === "ContextMenu";
}
function canKeyUseStickyKeyboardState(event, contextMenuEnabled) {
  if (contextMenuEnabled && isContextMenuOpenKey(event)) return true;
  if ((event.ctrlKey || event.metaKey) && isSpaceSelectionKey(event)) return true;
  return event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp";
}
const BLOCKED_CONTEXT_MENU_NAV_KEYS = /* @__PURE__ */ new Set([
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp"
]);
function isEventInContextMenu(event) {
  for (const entry of event.composedPath()) {
    if (!(entry instanceof HTMLElement)) continue;
    if (entry.dataset.fileTreeContextMenuRoot === "true") return true;
    if (entry.dataset.type === "context-menu-anchor" || entry.dataset.type === CONTEXT_MENU_TRIGGER_TYPE) return true;
    if (entry.getAttribute("slot") === CONTEXT_MENU_SLOT_NAME) return true;
  }
  return false;
}
function serializeAnchorRect(rect) {
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width,
    x: rect.x,
    y: rect.y
  };
}
function createAnchorRectFromPoint(x2, y2) {
  return {
    bottom: y2,
    height: 0,
    left: x2,
    right: x2,
    top: y2,
    width: 0,
    x: x2,
    y: y2
  };
}
function getContextMenuAnchorTop(rootElement, itemElement) {
  if (rootElement == null) return itemElement.offsetTop;
  const itemRect = itemElement.getBoundingClientRect();
  const rootRect = rootElement.getBoundingClientRect();
  return itemRect.top - rootRect.top;
}
function setButtonRef(buttonRefs, path, element) {
  if (element == null) {
    buttonRefs.delete(path);
    return;
  }
  buttonRefs.set(path, element);
}
function getContextMenuAnchorButton(path, stickyButtonRefs, rowButtonRefs) {
  if (path == null) return null;
  const stickyButton = stickyButtonRefs.get(path) ?? null;
  if (stickyButton != null) return stickyButton;
  const rowButton = rowButtonRefs.get(path) ?? null;
  return rowButton?.dataset.itemParked === "true" ? null : rowButton;
}
function getMountedStickyRowPaths(rootElement) {
  if (rootElement == null) return [];
  const paths = [];
  for (const element of rootElement.querySelectorAll('button[data-file-tree-sticky-row="true"]')) {
    if (!(element instanceof HTMLElement)) continue;
    const path = element.dataset.fileTreeStickyPath;
    if (path != null) paths.push(path);
  }
  return paths;
}
function getFocusedParkedRowElement(rootElement, path) {
  if (rootElement == null || path == null) return null;
  for (const element of rootElement.querySelectorAll('button[data-item-focused="true"][data-item-parked="true"]')) if (element instanceof HTMLElement && element.dataset.itemPath === path) return element;
  return null;
}
function getStickyKeyboardViewportOffset(rootElement, scrollElement, activeTreeElement, path, itemHeight, stickyOverlayHeight, viewportHeight) {
  const minimumStickyKeyboardViewportOffset = Math.max(0, stickyOverlayHeight - itemHeight);
  const scrollElementRect = scrollElement?.getBoundingClientRect() ?? null;
  const activeElementTopWithinViewport = scrollElementRect == null || activeTreeElement == null ? null : activeTreeElement.getBoundingClientRect().top - scrollElementRect.top;
  const focusedParkedRowElement = getFocusedParkedRowElement(rootElement, path);
  const parkedElementTopWithinViewport = scrollElementRect == null || focusedParkedRowElement == null ? null : focusedParkedRowElement.getBoundingClientRect().top - scrollElementRect.top;
  return Math.max(0, Math.min(parkedElementTopWithinViewport ?? Math.max(activeElementTopWithinViewport ?? 0, minimumStickyKeyboardViewportOffset), Math.max(0, viewportHeight - itemHeight)));
}
function createContextMenuItem(row, path) {
  return {
    kind: row.kind,
    name: getFileTreeRowAriaLabel(row),
    path
  };
}
function getFileTreeRootDomId(instanceId) {
  return instanceId == null ? void 0 : `${instanceId}__tree`;
}
function getFileTreeFocusedRowDomId(instanceId, path, parked) {
  if (instanceId == null) return;
  return `${instanceId}__focused-item-${encodeURIComponent(path)}${parked ? "__parked" : ""}`;
}
function isBuiltInDecorationIconName(name) {
  return name === "file-tree-icon-chevron" || name === "file-tree-icon-dot" || name === "file-tree-icon-file" || name === "file-tree-icon-lock";
}
function renderRowDecoration(decoration, resolveIcon) {
  if (decoration == null) return null;
  if ("text" in decoration) return /* @__PURE__ */ u$1("span", {
    title: decoration.title,
    children: decoration.text
  });
  const icon = typeof decoration.icon === "string" ? isBuiltInDecorationIconName(decoration.icon) ? resolveIcon(decoration.icon) : { name: decoration.icon } : isBuiltInDecorationIconName(decoration.icon.name) ? (() => {
    const resolvedIcon = resolveIcon(decoration.icon.name);
    const { name: _ignoredName, ...iconOverrides } = decoration.icon;
    return {
      ...resolvedIcon,
      ...iconOverrides
    };
  })() : decoration.icon;
  return /* @__PURE__ */ u$1("span", {
    title: decoration.title,
    children: /* @__PURE__ */ u$1(Icon, { ...icon })
  });
}
function focusFirstMenuElement(menuElement) {
  if (menuElement == null) return;
  focusElement(menuElement.querySelector([
    "button:not([disabled])",
    "[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])'
  ].join(", ")) ?? menuElement);
}
function renderFileTreeRowContent(row, resolveIcon, { actionLaneEnabled = false, customDecoration = null, decorationLaneEnabled = false, dragTargetFlattenedSegmentPath = null, gitDecoration = null, gitLaneActive = false, renameInput = null, showDecorativeActionAffordance = false } = {}) {
  const targetPath = getFileTreeRowPath(row);
  return /* @__PURE__ */ u$1(k$1, { children: [
    row.depth > 0 ? /* @__PURE__ */ u$1("div", {
      "data-item-section": "spacing",
      children: Array.from({ length: row.depth }).map((_2, index) => /* @__PURE__ */ u$1("div", {
        "data-item-section": "spacing-item",
        "data-ancestor-path": row.ancestorPaths[index]
      }, index))
    }) : null,
    /* @__PURE__ */ u$1("div", {
      "data-item-section": "icon",
      children: row.kind === "directory" ? /* @__PURE__ */ u$1(Icon, { ...resolveIcon("file-tree-icon-chevron") }) : /* @__PURE__ */ u$1(Icon, { ...resolveIcon("file-tree-icon-file", targetPath) })
    }),
    /* @__PURE__ */ u$1("div", {
      "data-item-section": "content",
      children: row.isFlattened ? formatFlattenedSegments(row, renameInput, dragTargetFlattenedSegmentPath) : renameInput ?? /* @__PURE__ */ u$1(MiddleTruncate, {
        minimumLength: 5,
        split: "extension",
        children: row.name
      })
    }),
    decorationLaneEnabled ? /* @__PURE__ */ u$1("div", {
      "data-item-section": "decoration",
      children: customDecoration != null ? renderRowDecoration(customDecoration, resolveIcon) : null
    }) : null,
    gitLaneActive ? /* @__PURE__ */ u$1("div", {
      "data-item-section": "git",
      children: renderRowDecoration(gitDecoration, resolveIcon)
    }) : null,
    actionLaneEnabled ? /* @__PURE__ */ u$1("div", {
      "data-item-section": "action",
      children: showDecorativeActionAffordance ? /* @__PURE__ */ u$1("span", {
        "aria-hidden": "true",
        "data-item-action-affordance": "decorative",
        children: /* @__PURE__ */ u$1(Icon, { ...resolveIcon("file-tree-icon-ellipsis") })
      }) : null
    }) : null
  ] });
}
function renderStyledRow(frame, row, key, options = {}) {
  const { controller, renameView, visualFocusPath, contextHoverPath, draggedPathSet, dragTarget, dragAndDropEnabled, shouldSuppressContextMenu, handleRowDragStart, handleRowDragEnd, handleRowTouchStart, instanceId, itemHeight, gitStatusByPath, ignoredGitDirectories, ignoredInheritanceCache, directoriesWithGitChanges, gitLaneActive, contextMenuEnabled, contextMenuTriggerMode, contextMenuButtonTriggerEnabled, contextMenuButtonVisibility, contextMenuRightClickEnabled, registerRenameInput, registerButton, resolveIcon, renderDecorationForRow, openContextMenuForRow, onRowClick, onKeyDown } = frame;
  const targetPath = getFileTreeRowPath(row);
  const { isParked = false, mode = "flow", style } = options;
  const isSticky = mode === "sticky";
  const effectiveGitStatus = gitStatusByPath?.get(targetPath) ?? null ?? getInheritedIgnoredGitStatus(row.ancestorPaths, ignoredGitDirectories, ignoredInheritanceCache);
  const containsGitChange = row.kind === "directory" && (directoriesWithGitChanges?.has(targetPath) ?? false);
  const customDecoration = renderDecorationForRow(row, targetPath);
  const gitDecoration = getBuiltInGitStatusDecoration(effectiveGitStatus, containsGitChange);
  const actionLaneEnabled = contextMenuEnabled && contextMenuButtonTriggerEnabled;
  const decorationLaneEnabled = customDecoration != null || gitLaneActive || actionLaneEnabled;
  const showDecorativeActionAffordance = actionLaneEnabled && contextMenuButtonVisibility === "always";
  const isRenamingRow = renameView.getPath() === targetPath;
  const renamingValue = isRenamingRow ? renameView.getValue() : "";
  const renameInput = isSticky || !isRenamingRow ? null : /* @__PURE__ */ u$1(RenameInput, {
    ref: registerRenameInput,
    ariaLabel: `Rename ${getFileTreeRowAriaLabel(row)}`,
    isFlattened: row.isFlattened,
    value: renamingValue,
    onBlur: () => {
      renameView.commit();
    },
    onInput: (event) => {
      renameView.setValue(event.currentTarget.value);
    }
  });
  const rowContent = renderFileTreeRowContent(row, resolveIcon, {
    actionLaneEnabled,
    customDecoration,
    decorationLaneEnabled,
    dragTargetFlattenedSegmentPath: dragTarget?.flattenedSegmentPath ?? null,
    gitDecoration,
    gitLaneActive,
    renameInput,
    showDecorativeActionAffordance
  });
  const commonProps = {
    ...computeFileTreeRowElementAttributes({
      ariaLabel: getFileTreeRowAriaLabel(row),
      domId: row.isFocused ? getFileTreeFocusedRowDomId(instanceId, targetPath, isParked) : void 0,
      extraStyle: style,
      features: {
        actionLaneEnabled,
        contextMenuButtonVisibility: actionLaneEnabled ? contextMenuButtonVisibility : null,
        contextMenuEnabled,
        contextMenuTriggerMode: contextMenuEnabled ? contextMenuTriggerMode : null,
        gitLaneActive
      },
      isParked,
      itemHeight,
      mode,
      row,
      state: {
        containsGitChange,
        effectiveGitStatus,
        isContextHovered: contextHoverPath === targetPath,
        isDragTarget: dragTarget?.kind === "directory" && dragTarget.directoryPath === targetPath,
        isDragging: draggedPathSet?.has(targetPath) === true,
        isFocusRinged: row.isFocused && visualFocusPath === targetPath
      },
      targetPath
    }),
    key,
    onContextMenu: contextMenuEnabled || dragAndDropEnabled ? (event) => {
      if (shouldSuppressContextMenu()) {
        event.preventDefault();
        return;
      }
      if (!contextMenuEnabled) return;
      event.preventDefault();
      if (!contextMenuRightClickEnabled) return;
      controller.focusMountedPathFromInput(targetPath);
      openContextMenuForRow(row, targetPath, {
        anchorRect: createAnchorRectFromPoint(event.clientX, event.clientY),
        source: "right-click"
      });
    } : void 0,
    onFocus: !isSticky ? () => {
      controller.focusMountedPathFromInput(targetPath);
    } : void 0,
    onKeyDown: !isSticky ? onKeyDown : void 0,
    ref: (element) => {
      registerButton(targetPath, element);
    }
  };
  if (!isSticky && isRenamingRow) return /* @__PURE__ */ u$1("div", {
    ...commonProps,
    children: rowContent
  });
  return /* @__PURE__ */ u$1("button", {
    ...commonProps,
    type: "button",
    draggable: dragAndDropEnabled && !isParked,
    onDragEnd: dragAndDropEnabled && !isParked ? handleRowDragEnd : void 0,
    onDragStart: dragAndDropEnabled && !isParked ? (event) => {
      handleRowDragStart(event, row, targetPath);
    } : void 0,
    onMouseDown: (event) => {
      if (isSticky) {
        event.preventDefault();
        return;
      }
      if (controller.isSearchOpen()) event.preventDefault();
    },
    onTouchStart: dragAndDropEnabled && !isParked ? (event) => {
      handleRowTouchStart(event, row, targetPath);
    } : void 0,
    onClick: (event) => {
      onRowClick(event, row, targetPath, mode);
    },
    children: rowContent
  });
}
function renderRangeChildren(frame, range, hiddenRowPaths) {
  if (range.end < range.start) return [];
  return frame.controller.getVisibleRows(range.start, range.end).filter((row) => !hiddenRowPaths.has(getFileTreeRowPath(row))).map((row, slotIndex) => renderStyledRow(frame, row, range.start + slotIndex));
}
function FileTreeView({ composition, controller, gitStatusByPath, ignoredGitDirectories, directoriesWithGitChanges, icons, instanceId, itemHeight = FILE_TREE_DEFAULT_ITEM_HEIGHT, overscan = FILE_TREE_DEFAULT_OVERSCAN, renamingEnabled = false, renderRowDecoration: renderRowDecoration$1, searchBlurBehavior = "close", searchEnabled = false, searchFakeFocus = false, slotHost, stickyFolders = false, initialViewportHeight = FILE_TREE_DEFAULT_VIEWPORT_HEIGHT }) {
  "use no memo";
  const contextMenuAnchorRef = F(null);
  const contextMenuTriggerRef = F(null);
  const isScrollingRef = F(false);
  const listRef = F(null);
  const renameInputRef = F(null);
  const rootRef = F(null);
  const scrollRef = F(null);
  const searchInputRef = F(null);
  const rowButtonRefs = F(/* @__PURE__ */ new Map());
  const stickyRowButtonRefs = F(/* @__PURE__ */ new Map());
  const updateViewportRef = F(() => {
  });
  const measuredViewportHeightRef = F(null);
  const processedScrollRequestIdRef = F(0);
  const initialFocusedScrollAppliedRef = F(false);
  const initialFocusedScrollControllerRef = F(null);
  if (initialFocusedScrollControllerRef.current !== controller) {
    initialFocusedScrollAppliedRef.current = false;
    initialFocusedScrollControllerRef.current = controller;
  }
  const domFocusOwnerRef = F(false);
  const previousFocusedPathRef = F(null);
  const previousRenamingPathRef = F(null);
  const restoreTreeFocusAfterSearchCloseRef = F(false);
  const restoreTreeFocusViewportOffsetRef = F(null);
  const dragAutoScrollFrameRef = F(null);
  const dragHoverOpenKeyRef = F(null);
  const dragHoverOpenTimerRef = F(null);
  const dragPointRef = F(null);
  const dragPreviewRef = F(null);
  const dragRowSnapshotRef = F(null);
  const touchCleanupRef = F(null);
  const touchDragActiveRef = F(false);
  const touchPreviewOffsetRef = F(null);
  const touchSourceElementRef = F(null);
  const touchStartPointRef = F(null);
  const touchLongPressTimerRef = F(null);
  const ignoredInheritanceCache = q(() => /* @__PURE__ */ new Map(), []);
  const [, setControllerRevision] = h(0);
  const [activeItemPath, setActiveItemPath] = h(null);
  const [contextHoverPath, setContextHoverPath] = h(null);
  const [contextMenuAnchorTop, setContextMenuAnchorTop] = h(null);
  const [lastContextMenuInteraction, setLastContextMenuInteraction] = h(null);
  const [scrollSettledRevision, setScrollSettledRevision] = h(0);
  const [contextMenuState, setContextMenuState] = h(null);
  const contextMenuStateRef = F(contextMenuState);
  contextMenuStateRef.current = contextMenuState;
  const pendingStickyFocusPathRef = F(null);
  const pendingStickyKeyboardFocusPathRef = F(null);
  const pendingStickyKeyboardViewportOffsetRef = F(null);
  const pendingStickyKeyboardScrollTopRef = F(null);
  const debugContextMenuTriggerPathRef = F(null);
  const debugDisableScrollSuppressionRef = F(false);
  const clearPendingStickyKeyboardState = () => {
    pendingStickyKeyboardFocusPathRef.current = null;
    pendingStickyKeyboardViewportOffsetRef.current = null;
    pendingStickyKeyboardScrollTopRef.current = null;
  };
  const preserveStickyKeyboardFocusAtScrollTop = (path, scrollTop) => {
    pendingStickyKeyboardFocusPathRef.current = path;
    pendingStickyKeyboardViewportOffsetRef.current = null;
    pendingStickyKeyboardScrollTopRef.current = scrollTop == null ? null : {
      path,
      scrollTop
    };
  };
  const restoreStickyKeyboardViewportOffset = (path, viewportOffset) => {
    pendingStickyKeyboardFocusPathRef.current = null;
    pendingStickyKeyboardViewportOffsetRef.current = {
      path,
      viewportOffset
    };
    pendingStickyKeyboardScrollTopRef.current = null;
  };
  const skipInitialSearchAutoFocusRef = F(searchBlurBehavior === "retain" && controller.isSearchOpen());
  const [fakeSearchFocusActive, setFakeSearchFocusActive] = h(searchFakeFocus);
  _(() => {
    if (!searchFakeFocus) setFakeSearchFocusActive(false);
  }, [searchFakeFocus]);
  const searchInputUserInteractedRef = F(false);
  const markSearchInputInteracted = b(() => {
    searchInputUserInteractedRef.current = true;
    setFakeSearchFocusActive((previous) => previous ? false : previous);
  }, []);
  const [layoutState, setLayoutState] = h(() => computeFileTreeViewLayoutState({
    controller,
    itemHeight,
    overscan,
    scrollTop: 0,
    stickyFolders,
    viewportHeight: initialViewportHeight
  }));
  const [hasStickyUiMount, setHasStickyUiMount] = h(false);
  _(() => {
    setHasStickyUiMount(true);
  }, []);
  const contextMenuEnabled = composition?.contextMenu?.enabled === true || composition?.contextMenu?.render != null || composition?.contextMenu?.onOpen != null || composition?.contextMenu?.onClose != null;
  const contextMenuTriggerMode = composition?.contextMenu?.triggerMode ?? (contextMenuEnabled ? "right-click" : "both");
  const contextMenuButtonTriggerEnabled = contextMenuTriggerMode === "both" || contextMenuTriggerMode === "button";
  const contextMenuButtonVisibility = composition?.contextMenu?.buttonVisibility ?? "when-needed";
  const contextMenuRightClickEnabled = contextMenuTriggerMode === "both" || contextMenuTriggerMode === "right-click";
  A(() => {
    const rootElement = rootRef.current;
    if (rootElement == null) return;
    const handleDebugSetContextMenuTrigger = (event) => {
      if (!(event instanceof CustomEvent)) return;
      const nextPath = event.detail?.path ?? null;
      debugContextMenuTriggerPathRef.current = nextPath;
      setContextHoverPath(nextPath);
      setLastContextMenuInteraction(nextPath == null ? null : "pointer");
    };
    const handleDebugSetScrollSuppression = (event) => {
      if (!(event instanceof CustomEvent)) return;
      debugDisableScrollSuppressionRef.current = event.detail?.disabled === true;
    };
    rootElement.addEventListener("file-tree-debug-set-context-menu-trigger", handleDebugSetContextMenuTrigger);
    rootElement.addEventListener("file-tree-debug-set-scroll-suppression", handleDebugSetScrollSuppression);
    return () => {
      rootElement.removeEventListener("file-tree-debug-set-context-menu-trigger", handleDebugSetContextMenuTrigger);
      rootElement.removeEventListener("file-tree-debug-set-scroll-suppression", handleDebugSetScrollSuppression);
    };
  }, []);
  const registerRowButton = b((path, element) => {
    setButtonRef(rowButtonRefs.current, path, element);
  }, []);
  const registerStickyRowButton = b((path, element) => {
    setButtonRef(stickyRowButtonRefs.current, path, element);
  }, []);
  const registerRenameInput = b((element) => {
    renameInputRef.current = element;
  }, []);
  const getTriggerAnchorButton = b((path) => {
    return getContextMenuAnchorButton(path, stickyRowButtonRefs.current, rowButtonRefs.current);
  }, []);
  const gitLaneActive = gitStatusByPath != null || ignoredGitDirectories != null || directoriesWithGitChanges != null;
  const { resolveIcon } = q(() => createFileTreeIconResolver(icons), [icons]);
  const renameView = controller[FILE_TREE_RENAME_VIEW]();
  const renamingPath = renameView.getPath();
  const isRenaming = renamingPath != null;
  const isSearchOpen = controller.isSearchOpen();
  const searchValue = controller.getSearchValue();
  const focusedPath = controller.getFocusedPath();
  const focusedIndex = controller.getFocusedIndex();
  const scrollRequest = controller.getScrollRequest();
  const dragAndDropEnabled = controller.isDragAndDropEnabled();
  const dragSession = controller.getDragSession();
  const draggedPathSet = q(() => dragSession == null ? null : new Set(dragSession.draggedPaths), [dragSession]);
  const dragTarget = dragSession?.target ?? null;
  const draggedPrimaryPath = dragSession?.primaryPath ?? null;
  const treeDomId = getFileTreeRootDomId(instanceId);
  const { overlayHeight: overlayRowsHeight, overlayRows, snapshot: layoutSnapshot, visibleRows } = layoutState;
  const resolvedViewportHeight = layoutSnapshot.physical.viewportHeight;
  const range = q(() => ({
    end: layoutSnapshot.window.endIndex,
    start: layoutSnapshot.window.startIndex
  }), [layoutSnapshot.window.endIndex, layoutSnapshot.window.startIndex]);
  const stickyRows = overlayRows;
  const occludedStickyRows = layoutSnapshot.sticky.rows;
  const totalScrollableHeight = layoutSnapshot.physical.totalHeight;
  const stickyOverlayHeight = layoutSnapshot.sticky.height;
  const stickyRowPathSet = q(() => new Set(occludedStickyRows.map((entry) => getFileTreeRowPath(entry.row))), [occludedStickyRows]);
  const focusedRowIsMounted = focusedIndex >= 0 && focusedIndex >= range.start && focusedIndex <= range.end;
  const renderDecorationForRow = b((row, targetPath) => renderRowDecoration$1?.({
    item: createContextMenuItem(row, targetPath),
    row
  }) ?? null, [renderRowDecoration$1]);
  const restoreContextMenuFocus = b((restorePath) => {
    if (focusElement(restorePath == null ? null : rowButtonRefs.current.get(restorePath) ?? null)) return true;
    return focusElement(rootRef.current);
  }, []);
  const restoreFocusToTree = b((path) => {
    restoreContextMenuFocus(controller.focusNearestPath(path));
  }, [controller, restoreContextMenuFocus]);
  const restoreFocusToTreeRef = F(restoreFocusToTree);
  restoreFocusToTreeRef.current = restoreFocusToTree;
  const shouldRestoreContextMenuFocusRef = F(true);
  const closeContextMenuRef = F(() => {
  });
  const closeContextMenu = b((restoreFocus = true) => {
    const currentContextMenuState = contextMenuStateRef.current;
    if (currentContextMenuState == null) return;
    shouldRestoreContextMenuFocusRef.current = shouldRestoreContextMenuFocusRef.current && restoreFocus;
    setContextMenuState(null);
    composition?.contextMenu?.onClose?.();
    if (shouldRestoreContextMenuFocusRef.current) restoreFocusToTree(currentContextMenuState.path);
  }, [composition?.contextMenu, restoreFocusToTree]);
  closeContextMenuRef.current = closeContextMenu;
  const updateTriggerPosition = b((itemButton) => {
    const nextTop = itemButton == null ? null : getContextMenuAnchorTop(rootRef.current, itemButton);
    setContextMenuAnchorTop((previousTop) => previousTop === nextTop ? previousTop : nextTop);
  }, []);
  const openContextMenuForRow = b((row, targetPath, options) => {
    const item = controller.getItem(targetPath);
    if (item == null) return;
    const anchorButton = getTriggerAnchorButton(targetPath);
    if (anchorButton?.dataset.fileTreeStickyRow === "true") {
      const scrollElement = scrollRef.current;
      preserveStickyKeyboardFocusAtScrollTop(targetPath, scrollElement?.scrollTop ?? null);
      domFocusOwnerRef.current = true;
      setActiveItemPath((previousPath) => previousPath === targetPath ? previousPath : targetPath);
    }
    item.focus();
    updateTriggerPosition(anchorButton);
    shouldRestoreContextMenuFocusRef.current = true;
    setContextMenuState({
      anchorRect: options?.anchorRect ?? null,
      item: createContextMenuItem(row, targetPath),
      path: targetPath,
      source: options?.source ?? "keyboard"
    });
  }, [
    controller,
    getTriggerAnchorButton,
    updateTriggerPosition
  ]);
  const startRenameFromPath = b((path) => {
    if (!renamingEnabled) return;
    if (controller.isSearchOpen()) {
      const scrollElement = scrollRef.current;
      const viewportHeight = readMeasuredViewportHeight(scrollElement, resolvedViewportHeight);
      restoreTreeFocusViewportOffsetRef.current = focusedIndex < 0 || scrollElement == null ? null : Math.max(0, Math.min(focusedIndex * itemHeight - scrollElement.scrollTop, Math.max(0, viewportHeight - itemHeight)));
      restoreTreeFocusAfterSearchCloseRef.current = true;
    }
    if (controller.startRenaming(path) === false) return;
    setLastContextMenuInteraction("focus");
    setControllerRevision((revision) => revision + 1);
  }, [
    controller,
    focusedIndex,
    itemHeight,
    renamingEnabled,
    resolvedViewportHeight
  ]);
  const revealCanonicalRowAtStickyOffset = b((path, { restoreTreeFocus = true, targetOffset = "live-overlay" } = {}) => {
    const scrollElement = scrollRef.current;
    if (scrollElement == null) return false;
    controller.focusPath(path);
    const visibleIndex = controller.getFocusedIndex();
    if (visibleIndex < 0) return false;
    const focusedRow = controller.getVisibleRows(visibleIndex, visibleIndex)[0] ?? null;
    if (focusedRow == null) return false;
    const liveViewportHeight = readMeasuredViewportHeight(scrollElement, resolvedViewportHeight);
    const liveTotalHeight = controller.getVisibleCount() * itemHeight;
    const targetViewportOffset = targetOffset === "sticky-parents" ? focusedRow.ancestorPaths.length * itemHeight : computeFileTreeViewLayoutState({
      controller,
      itemHeight,
      overscan,
      scrollTop: scrollElement.scrollTop,
      stickyFolders,
      viewportHeight: liveViewportHeight
    }).snapshot.sticky.height;
    domFocusOwnerRef.current = true;
    scrollFocusedRowToViewportOffset(scrollElement, visibleIndex, itemHeight, liveViewportHeight, liveTotalHeight, targetViewportOffset);
    updateViewportRef.current();
    pendingStickyFocusPathRef.current = restoreTreeFocus ? path : null;
    return true;
  }, [
    controller,
    itemHeight,
    overscan,
    resolvedViewportHeight,
    stickyFolders
  ]);
  const shouldSuppressContextMenu = () => {
    return isScrollingRef.current === true || touchLongPressTimerRef.current != null || touchDragActiveRef.current === true;
  };
  const requestDragAnimationFrame = (callback) => {
    return typeof window.requestAnimationFrame === "function" ? window.requestAnimationFrame(() => {
      callback();
    }) : window.setTimeout(callback, 16);
  };
  const cancelDragAnimationFrame = (handle) => {
    if (handle == null) return;
    if (typeof window.cancelAnimationFrame === "function") {
      window.cancelAnimationFrame(handle);
      return;
    }
    window.clearTimeout(handle);
  };
  const clearDragHoverOpen = () => {
    if (dragHoverOpenTimerRef.current != null) {
      clearTimeout(dragHoverOpenTimerRef.current);
      dragHoverOpenTimerRef.current = null;
    }
    dragHoverOpenKeyRef.current = null;
  };
  const clearDragPreview = () => {
    dragPreviewRef.current?.remove();
    dragPreviewRef.current = null;
  };
  const stopDragAutoScroll = () => {
    cancelDragAnimationFrame(dragAutoScrollFrameRef.current);
    dragAutoScrollFrameRef.current = null;
    dragPointRef.current = null;
  };
  const mountDragPreview = (preview) => {
    const rootNode = rootRef.current?.getRootNode();
    if (rootNode instanceof ShadowRoot) {
      rootNode.append(preview);
      return;
    }
    document.body.append(preview);
  };
  const clearTouchDragResources = () => {
    touchCleanupRef.current?.();
    touchCleanupRef.current = null;
    if (touchLongPressTimerRef.current != null) {
      clearTimeout(touchLongPressTimerRef.current);
      touchLongPressTimerRef.current = null;
    }
    touchDragActiveRef.current = false;
    touchPreviewOffsetRef.current = null;
    touchStartPointRef.current = null;
    if (touchSourceElementRef.current != null) {
      touchSourceElementRef.current.setAttribute("draggable", "true");
      touchSourceElementRef.current.style.removeProperty("touch-action");
      touchSourceElementRef.current = null;
    }
    clearDragPreview();
    clearDragHoverOpen();
    stopDragAutoScroll();
    dragRowSnapshotRef.current = null;
  };
  const syncDropTargetFromPoint = (clientX, clientY) => {
    const rootNode = rootRef.current?.getRootNode();
    const nextTarget = resolveDropTargetFromElement(getPointElement(rootNode instanceof ShadowRoot ? rootNode : document, clientX, clientY));
    controller.setDragTarget(nextTarget);
    return controller.getDragSession()?.target ?? null;
  };
  const scheduleDragHoverOpen = (nextTarget) => {
    const openDelay = controller.getDragAndDropConfig()?.openOnDropDelay ?? 800;
    if (nextTarget == null || nextTarget.kind !== "directory" || nextTarget.directoryPath == null || openDelay <= 0) {
      clearDragHoverOpen();
      return;
    }
    const targetItem = controller.getItem(nextTarget.directoryPath);
    const directoryItem = isFileTreeDirectoryHandle(targetItem) ? targetItem : null;
    if (directoryItem == null || directoryItem.isExpanded()) {
      clearDragHoverOpen();
      return;
    }
    const nextKey = `${nextTarget.directoryPath}::${nextTarget.flattenedSegmentPath ?? ""}`;
    if (dragHoverOpenKeyRef.current === nextKey) return;
    clearDragHoverOpen();
    dragHoverOpenKeyRef.current = nextKey;
    dragHoverOpenTimerRef.current = setTimeout(() => {
      const currentTarget = controller.getDragSession()?.target;
      if (currentTarget?.kind !== "directory" || currentTarget.directoryPath !== nextTarget.directoryPath || currentTarget.flattenedSegmentPath !== nextTarget.flattenedSegmentPath) return;
      directoryItem.expand();
    }, openDelay);
  };
  const runDragAutoScroll = () => {
    dragAutoScrollFrameRef.current = null;
    const dragPoint = dragPointRef.current;
    const scrollElement = scrollRef.current;
    if (dragPoint == null || scrollElement == null || controller.getDragSession() == null) return;
    const scrollRect = scrollElement.getBoundingClientRect();
    const scrollDelta = getDragEdgeScrollDelta(dragPoint.clientY, scrollRect);
    if (scrollDelta === 0) return;
    const maxScrollTop = Math.max(0, scrollElement.scrollHeight - scrollElement.clientHeight);
    const boundedScrollTop = Math.max(0, Math.min(maxScrollTop, scrollElement.scrollTop + scrollDelta));
    if (boundedScrollTop !== scrollElement.scrollTop) {
      scrollElement.scrollTop = boundedScrollTop;
      updateViewportRef.current();
    }
    scheduleDragHoverOpen(syncDropTargetFromPoint(dragPoint.clientX, dragPoint.clientY));
    dragAutoScrollFrameRef.current = requestDragAnimationFrame(runDragAutoScroll);
  };
  const updateDragPoint = (clientX, clientY) => {
    dragPointRef.current = {
      clientX,
      clientY
    };
    dragAutoScrollFrameRef.current ??= requestDragAnimationFrame(runDragAutoScroll);
  };
  const handleRowDragStart = (event, row, targetPath) => {
    const dragSource = event.currentTarget;
    if (dragSource == null) return;
    clearTouchDragResources();
    clearDragPreview();
    clearDragHoverOpen();
    stopDragAutoScroll();
    if (controller.startDrag(targetPath) === false) {
      event.preventDefault();
      return;
    }
    dragRowSnapshotRef.current = row;
    if (event.dataTransfer != null) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.setData("text/plain", targetPath);
      if (shouldUseCustomPointerDragImage()) {
        const preview = createDragPreviewElement(dragSource);
        const rect = dragSource.getBoundingClientRect();
        Object.assign(preview.style, {
          height: `${rect.height}px`,
          opacity: "0.85",
          transform: "translate3d(-9999px, 0px, 0)",
          width: `${rect.width}px`
        });
        mountDragPreview(preview);
        dragPreviewRef.current = preview;
        event.dataTransfer.setDragImage(preview, Math.max(0, event.clientX - rect.left), Math.max(0, event.clientY - rect.top));
      }
    }
  };
  const handleRowDragEnd = () => {
    clearDragPreview();
    clearDragHoverOpen();
    stopDragAutoScroll();
    dragRowSnapshotRef.current = null;
    controller.cancelDrag();
  };
  const handleRowTouchStart = (event, row, targetPath) => {
    if (touchLongPressTimerRef.current != null || touchDragActiveRef.current) return;
    const touch = event.touches[0];
    const dragSource = event.currentTarget;
    if (touch == null || dragSource == null) return;
    touchStartPointRef.current = {
      clientX: touch.clientX,
      clientY: touch.clientY
    };
    touchSourceElementRef.current = dragSource;
    dragSource.setAttribute("draggable", "false");
    const clearPendingTouchStart = (options = {}) => {
      const restoreNativeDraggable = options.restoreNativeDraggable ?? !touchDragActiveRef.current;
      if (touchLongPressTimerRef.current != null) {
        clearTimeout(touchLongPressTimerRef.current);
        touchLongPressTimerRef.current = null;
      }
      document.removeEventListener("touchmove", handlePendingTouchMove);
      document.removeEventListener("touchend", handlePendingTouchEnd);
      document.removeEventListener("touchcancel", handlePendingTouchEnd);
      if (touchCleanupRef.current === clearPendingTouchStart) touchCleanupRef.current = null;
      if (restoreNativeDraggable) {
        dragSource.setAttribute("draggable", "true");
        if (touchSourceElementRef.current === dragSource) touchSourceElementRef.current = null;
        touchStartPointRef.current = null;
      }
    };
    const handlePendingTouchMove = (moveEvent) => {
      const moveTouch = moveEvent.touches[0];
      const startPoint = touchStartPointRef.current;
      if (moveTouch == null || startPoint == null) return;
      const deltaX = moveTouch.clientX - startPoint.clientX;
      const deltaY = moveTouch.clientY - startPoint.clientY;
      if (deltaX * deltaX + deltaY * deltaY <= TOUCH_LONG_PRESS_MOVE_THRESHOLD * TOUCH_LONG_PRESS_MOVE_THRESHOLD) return;
      clearPendingTouchStart();
    };
    const handlePendingTouchEnd = () => {
      clearPendingTouchStart();
    };
    document.addEventListener("touchmove", handlePendingTouchMove, { passive: true });
    document.addEventListener("touchend", handlePendingTouchEnd);
    document.addEventListener("touchcancel", handlePendingTouchEnd);
    touchCleanupRef.current = clearPendingTouchStart;
    touchLongPressTimerRef.current = setTimeout(() => {
      clearPendingTouchStart({ restoreNativeDraggable: false });
      if (controller.startDrag(targetPath) === false) {
        dragSource.setAttribute("draggable", "true");
        if (touchSourceElementRef.current === dragSource) touchSourceElementRef.current = null;
        touchStartPointRef.current = null;
        return;
      }
      touchDragActiveRef.current = true;
      touchSourceElementRef.current = dragSource;
      dragSource.setAttribute("draggable", "false");
      dragSource.style.setProperty("touch-action", "none");
      dragRowSnapshotRef.current = row;
      const rect = dragSource.getBoundingClientRect();
      const preview = createDragPreviewElement(dragSource);
      Object.assign(preview.style, {
        height: `${rect.height}px`,
        opacity: "0.85",
        transform: `translate3d(${rect.left}px, ${rect.top}px, 0)`,
        width: `${rect.width}px`
      });
      mountDragPreview(preview);
      dragPreviewRef.current = preview;
      touchPreviewOffsetRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
      const handleActiveTouchMove = (moveEvent) => {
        const moveTouch = moveEvent.touches[0];
        if (moveTouch == null) return;
        moveEvent.preventDefault();
        const previewOffset = touchPreviewOffsetRef.current;
        if (previewOffset != null && dragPreviewRef.current != null) dragPreviewRef.current.style.transform = `translate3d(${moveTouch.clientX - previewOffset.x}px, ${moveTouch.clientY - previewOffset.y}px, 0)`;
        scheduleDragHoverOpen(syncDropTargetFromPoint(moveTouch.clientX, moveTouch.clientY));
        updateDragPoint(moveTouch.clientX, moveTouch.clientY);
      };
      const handleActiveTouchEnd = (endEvent) => {
        const endTouch = endEvent.changedTouches[0];
        if (endTouch != null) syncDropTargetFromPoint(endTouch.clientX, endTouch.clientY);
        controller.completeDrag();
        clearTouchDragResources();
      };
      const handleActiveTouchCancel = () => {
        controller.cancelDrag();
        clearTouchDragResources();
      };
      touchCleanupRef.current = () => {
        document.removeEventListener("touchmove", handleActiveTouchMove);
        document.removeEventListener("touchend", handleActiveTouchEnd);
        document.removeEventListener("touchcancel", handleActiveTouchCancel);
      };
      document.addEventListener("touchmove", handleActiveTouchMove, { passive: false });
      document.addEventListener("touchend", handleActiveTouchEnd);
      document.addEventListener("touchcancel", handleActiveTouchCancel);
    }, TOUCH_LONG_PRESS_DELAY);
  };
  const handleTreeKeyDown = (event) => {
    if (contextMenuState != null) {
      if (event.key === "Escape") {
        closeContextMenu();
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (BLOCKED_CONTEXT_MENU_NAV_KEYS.has(event.key)) {
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }
    if (renameView.isActive()) {
      if (event.key === "Escape") renameView.cancel();
      else if (event.key === "Enter") renameView.commit();
      else return;
      setLastContextMenuInteraction("focus");
      setControllerRevision((revision) => revision + 1);
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (renamingEnabled && event.key === "F2") {
      startRenameFromPath(focusedPath ?? void 0);
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (isSearchOpen) {
      if (event.key === "Escape") {
        restoreTreeFocusAfterSearchCloseRef.current = false;
        restoreTreeFocusViewportOffsetRef.current = null;
        controller.closeSearch();
      } else if (event.key === "Enter") {
        const currentFocusedPath = controller.getFocusedPath();
        if (currentFocusedPath != null) controller.selectOnlyPath(currentFocusedPath);
        const scrollElement$1 = scrollRef.current;
        const viewportHeight = readMeasuredViewportHeight(scrollElement$1, resolvedViewportHeight);
        restoreTreeFocusViewportOffsetRef.current = focusedIndex < 0 || scrollElement$1 == null ? null : Math.max(0, Math.min(focusedIndex * itemHeight - scrollElement$1.scrollTop, Math.max(0, viewportHeight - itemHeight)));
        restoreTreeFocusAfterSearchCloseRef.current = true;
        controller.closeSearch();
      } else if (event.key === "ArrowDown") controller.focusNextSearchMatch();
      else if (event.key === "ArrowUp") controller.focusPreviousSearchMatch();
      else return;
      setLastContextMenuInteraction("focus");
      setControllerRevision((revision) => revision + 1);
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (searchEnabled && isSearchOpenSeedKey(event)) {
      controller.openSearch(event.key);
      setControllerRevision((revision) => revision + 1);
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const isKeyboardContextMenuRequest = contextMenuEnabled && isContextMenuOpenKey(event);
    const shouldInspectStickyKeyboardState = canKeyUseStickyKeyboardState(event, contextMenuEnabled);
    const activeTreeElement = shouldInspectStickyKeyboardState && rootRef.current != null ? getActiveTreeElement(rootRef.current) : null;
    const mountedStickyRowPathSet = shouldInspectStickyKeyboardState ? new Set(getMountedStickyRowPaths(rootRef.current)) : /* @__PURE__ */ new Set();
    const activeStickyFocusPath = activeTreeElement?.dataset.fileTreeStickyPath ?? null;
    const activeStickyRowOwnsFocus = activeTreeElement?.dataset.fileTreeStickyRow === "true" && activeStickyFocusPath != null;
    if (activeStickyRowOwnsFocus && activeStickyFocusPath !== focusedPath && mountedStickyRowPathSet.has(activeStickyFocusPath)) {
      const scrollElement$1 = scrollRef.current;
      preserveStickyKeyboardFocusAtScrollTop(activeStickyFocusPath, scrollElement$1?.scrollTop ?? null);
      controller.focusPath(activeStickyFocusPath);
    }
    const effectiveFocusedPath = controller.getFocusedPath();
    const effectiveFocusedIndex = controller.getFocusedIndex();
    const focusedItem = controller.getFocusedItem();
    if (focusedItem == null) return;
    const focusedDirectoryItem = isFileTreeDirectoryHandle(focusedItem) ? focusedItem : null;
    const startedFromStickyRow = effectiveFocusedPath != null && (stickyRowPathSet.has(effectiveFocusedPath) || activeStickyRowOwnsFocus && activeStickyFocusPath === effectiveFocusedPath && mountedStickyRowPathSet.has(effectiveFocusedPath));
    const shouldPreserveLocalStickyFocusMove = event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "ArrowRight" && focusedDirectoryItem != null && focusedDirectoryItem.isExpanded();
    const shouldRestoreCollapsedStickyFocusViewport = event.key === "ArrowLeft" && startedFromStickyRow && focusedDirectoryItem != null && focusedDirectoryItem.isExpanded();
    const scrollElement = scrollRef.current;
    let handled = true;
    if (event.shiftKey && event.key === "ArrowDown") controller.extendSelectionFromFocused(1);
    else if (event.shiftKey && event.key === "ArrowUp") controller.extendSelectionFromFocused(-1);
    else if (isKeyboardContextMenuRequest && effectiveFocusedPath != null && effectiveFocusedIndex >= 0) {
      const focusedRow = controller.getVisibleRows(effectiveFocusedIndex, effectiveFocusedIndex)[0] ?? null;
      const focusedButton = getContextMenuAnchorButton(effectiveFocusedPath, stickyRowButtonRefs.current, rowButtonRefs.current);
      if (focusedRow == null || focusedButton == null) handled = false;
      else openContextMenuForRow(focusedRow, effectiveFocusedPath);
    } else if ((event.ctrlKey || event.metaKey) && isSpaceSelectionKey(event)) controller.toggleFocusedSelection();
    else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") controller.selectAllVisiblePaths();
    else switch (event.key) {
      case "ArrowDown":
        controller.focusNextItem();
        break;
      case "ArrowUp":
        controller.focusPreviousItem();
        break;
      case "ArrowRight":
        if (focusedDirectoryItem == null || focusedDirectoryItem.isExpanded()) controller.focusNextItem();
        else focusedDirectoryItem.expand();
        break;
      case "ArrowLeft":
        if (focusedDirectoryItem != null && focusedDirectoryItem.isExpanded()) focusedDirectoryItem.collapse();
        else controller.focusParentItem();
        break;
      case "Home":
        controller.focusFirstItem();
        break;
      case "End":
        controller.focusLastItem();
        break;
      default:
        handled = false;
    }
    if (!handled) return;
    setLastContextMenuInteraction("focus");
    const nextFocusedPath = controller.getFocusedPath();
    const nextFocusedPathIsMountedSticky = nextFocusedPath != null && (stickyRowPathSet.has(nextFocusedPath) || mountedStickyRowPathSet.has(nextFocusedPath));
    const stickyKeyboardMoveLandsOnDifferentStickyRow = shouldPreserveLocalStickyFocusMove && nextFocusedPath !== effectiveFocusedPath;
    const stickyKeyboardMenuStaysOnStickyRow = isKeyboardContextMenuRequest && activeStickyRowOwnsFocus && activeStickyFocusPath === effectiveFocusedPath && nextFocusedPath === effectiveFocusedPath;
    if ((startedFromStickyRow || stickyKeyboardMenuStaysOnStickyRow) && nextFocusedPath != null && (stickyKeyboardMoveLandsOnDifferentStickyRow && nextFocusedPathIsMountedSticky || stickyKeyboardMenuStaysOnStickyRow)) {
      preserveStickyKeyboardFocusAtScrollTop(nextFocusedPath, scrollElement?.scrollTop ?? null);
      domFocusOwnerRef.current = true;
      setActiveItemPath((previousPath) => previousPath === nextFocusedPath ? previousPath : nextFocusedPath);
    } else {
      const stickyArrowUpExitsStack = event.key === "ArrowUp" && startedFromStickyRow && nextFocusedPath !== effectiveFocusedPath;
      if (nextFocusedPath != null && (stickyArrowUpExitsStack || shouldRestoreCollapsedStickyFocusViewport && nextFocusedPath === effectiveFocusedPath)) {
        restoreStickyKeyboardViewportOffset(nextFocusedPath, getStickyKeyboardViewportOffset(rootRef.current, scrollElement, activeTreeElement, effectiveFocusedPath, itemHeight, stickyOverlayHeight, resolvedViewportHeight));
        domFocusOwnerRef.current = true;
        setActiveItemPath((previousPath) => previousPath === nextFocusedPath ? previousPath : nextFocusedPath);
      } else clearPendingStickyKeyboardState();
    }
    setControllerRevision((revision) => revision + 1);
    event.preventDefault();
    event.stopPropagation();
  };
  A(() => {
    if (!searchEnabled || !isSearchOpen) return;
    if (skipInitialSearchAutoFocusRef.current) {
      skipInitialSearchAutoFocusRef.current = false;
      return;
    }
    focusElement(searchInputRef.current);
  }, [isSearchOpen, searchEnabled]);
  A(() => {
    const input = renameInputRef.current;
    switch (classifyFileTreeRenameHandoff({
      hasRenderedInput: input != null,
      previousRenamingPath: previousRenamingPathRef.current,
      renamingPath
    })) {
      case "reset":
        previousRenamingPathRef.current = null;
        return;
      case "reveal-canonical":
        if (renamingPath != null) revealCanonicalRowAtStickyOffset(renamingPath, {
          restoreTreeFocus: false,
          targetOffset: "live-overlay"
        });
        return;
      case "ignore":
        return;
      case "focus-input":
        if (input != null) {
          pendingStickyFocusPathRef.current = null;
          previousRenamingPathRef.current = renamingPath;
          focusElement(input);
          input.select();
        }
        return;
    }
  }, [
    range.end,
    range.start,
    renamingPath,
    revealCanonicalRowAtStickyOffset,
    stickyRowPathSet
  ]);
  A(() => {
    const rootElement = rootRef.current;
    if (rootElement == null) return;
    let nullFocusOutTimer = null;
    const clearNullFocusOutTimer = () => {
      if (nullFocusOutTimer == null) return;
      clearTimeout(nullFocusOutTimer);
      nullFocusOutTimer = null;
    };
    const updateActiveItemPath = () => {
      const nextActiveItemPath = getActiveTreeElement(rootElement)?.dataset.itemPath ?? null;
      setActiveItemPath((previousPath) => previousPath === nextActiveItemPath ? previousPath : nextActiveItemPath);
    };
    const onFocusIn = () => {
      clearNullFocusOutTimer();
      domFocusOwnerRef.current = true;
      updateActiveItemPath();
    };
    const onFocusOut = (event) => {
      const nextTarget = event.relatedTarget;
      if (nextTarget == null) {
        clearNullFocusOutTimer();
        nullFocusOutTimer = setTimeout(() => {
          nullFocusOutTimer = null;
          if (getActiveTreeElement(rootElement) != null) {
            updateActiveItemPath();
            return;
          }
          domFocusOwnerRef.current = false;
          setActiveItemPath(null);
        }, 0);
        return;
      }
      if (!(nextTarget instanceof Node) || !rootElement.contains(nextTarget)) {
        clearNullFocusOutTimer();
        domFocusOwnerRef.current = false;
        setActiveItemPath(null);
        return;
      }
      const nextActiveItemPath = nextTarget instanceof HTMLElement ? nextTarget.dataset.itemPath ?? null : null;
      setActiveItemPath((previousPath) => previousPath === nextActiveItemPath ? previousPath : nextActiveItemPath);
    };
    rootElement.addEventListener("focusin", onFocusIn);
    rootElement.addEventListener("focusout", onFocusOut);
    return () => {
      clearNullFocusOutTimer();
      rootElement.removeEventListener("focusin", onFocusIn);
      rootElement.removeEventListener("focusout", onFocusOut);
    };
  }, []);
  A(() => {
    const rootElement = rootRef.current;
    if (rootElement == null) return;
    if (layoutSnapshot.physical.scrollTop <= 0) rootElement.dataset.scrollAtTop = "true";
    else delete rootElement.dataset.scrollAtTop;
  }, [layoutSnapshot.physical.scrollTop]);
  A(() => {
    let scrollTimer = null;
    const scrollElement = scrollRef.current;
    const listElement = listRef.current;
    const rootElement = rootRef.current;
    if (scrollElement == null) return;
    measuredViewportHeightRef.current = readMeasuredViewportHeight(scrollElement, initialViewportHeight);
    const update = () => {
      const nextItemCount = controller.getVisibleCount();
      const nextViewportHeight = getCachedViewportHeight(measuredViewportHeightRef.current, initialViewportHeight);
      const maxScrollTop = Math.max(0, nextItemCount * itemHeight - nextViewportHeight);
      if (scrollElement.scrollTop > maxScrollTop) scrollElement.scrollTop = maxScrollTop;
      setLayoutState(computeFileTreeViewLayoutState({
        controller,
        itemHeight,
        overscan,
        scrollTop: Math.min(scrollElement.scrollTop, maxScrollTop),
        stickyFolders,
        viewportHeight: nextViewportHeight
      }));
    };
    if (!initialFocusedScrollAppliedRef.current) {
      initialFocusedScrollAppliedRef.current = true;
      const initialFocusedIndex = controller.getFocusedIndex();
      if (initialFocusedIndex >= 0) {
        const initialViewportHeightPx = getCachedViewportHeight(measuredViewportHeightRef.current, initialViewportHeight);
        const initialFocusedRow = controller.getVisibleRows(initialFocusedIndex, initialFocusedIndex)[0] ?? null;
        scrollFocusedRowIntoView(scrollElement, initialFocusedIndex, itemHeight, initialViewportHeightPx, stickyFolders && initialFocusedRow != null ? Math.max(0, Math.min(initialFocusedRow.ancestorPaths.length * itemHeight, Math.max(0, initialViewportHeightPx - itemHeight))) : 0);
      }
    }
    updateViewportRef.current = update;
    let hasSeenInitialControllerSnapshot = false;
    const unsubscribe = controller.subscribe(() => {
      if (hasSeenInitialControllerSnapshot) setControllerRevision((revision) => revision + 1);
      else hasSeenInitialControllerSnapshot = true;
      update();
    });
    const markScrolling = () => {
      if (debugDisableScrollSuppressionRef.current === true) return;
      if (listElement != null) listElement.dataset.isScrolling ??= "";
      if (rootElement != null) rootElement.dataset.isScrolling ??= "";
      isScrollingRef.current = true;
      if (scrollTimer != null) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (listElement != null) delete listElement.dataset.isScrolling;
        if (rootElement != null) delete rootElement.dataset.isScrolling;
        isScrollingRef.current = false;
        setScrollSettledRevision((revision) => revision + 1);
        scrollTimer = null;
      }, 50);
    };
    let overlayRevealTimer = null;
    const clearOverlayReveal = () => {
      if (rootElement != null) delete rootElement.dataset.overlayReveal;
      if (overlayRevealTimer != null) {
        clearTimeout(overlayRevealTimer);
        overlayRevealTimer = null;
      }
    };
    const markOverlayReveal = () => {
      if (rootElement == null || debugDisableScrollSuppressionRef.current === true) return;
      if (scrollElement.scrollTop > 0) return;
      rootElement.dataset.overlayReveal = "true";
      if (overlayRevealTimer != null) clearTimeout(overlayRevealTimer);
      overlayRevealTimer = setTimeout(() => {
        clearOverlayReveal();
      }, 200);
    };
    const onScroll = () => {
      update();
      if (scrollElement.scrollTop > 0) clearOverlayReveal();
      if (contextMenuStateRef.current != null && isScrollingRef.current) closeContextMenuRef.current();
      if (debugDisableScrollSuppressionRef.current === true) {
        isScrollingRef.current = false;
        return;
      }
      setContextHoverPath((previousPath) => previousPath == null ? previousPath : null);
      markScrolling();
    };
    const onPreScroll = () => {
      markScrolling();
      markOverlayReveal();
    };
    const SCROLL_KEYS = /* @__PURE__ */ new Set([
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
      "Spacebar"
    ]);
    const onKeyDownPreScroll = (event) => {
      if (!SCROLL_KEYS.has(event.key)) return;
      onPreScroll();
    };
    scrollElement.addEventListener("scroll", onScroll, { passive: true });
    scrollElement.addEventListener("wheel", onPreScroll, { passive: true });
    scrollElement.addEventListener("touchmove", onPreScroll, { passive: true });
    scrollElement.addEventListener("keydown", onKeyDownPreScroll);
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver((entries) => {
      measuredViewportHeightRef.current = (entries[0] == null ? null : getResizeObserverViewportHeight(entries[0])) ?? readMeasuredViewportHeight(scrollElement, initialViewportHeight);
      update();
    }) : null;
    resizeObserver?.observe(scrollElement);
    return () => {
      updateViewportRef.current = () => {
      };
      unsubscribe();
      scrollElement.removeEventListener("scroll", onScroll);
      scrollElement.removeEventListener("wheel", onPreScroll);
      scrollElement.removeEventListener("touchmove", onPreScroll);
      scrollElement.removeEventListener("keydown", onKeyDownPreScroll);
      if (scrollTimer != null) clearTimeout(scrollTimer);
      if (overlayRevealTimer != null) clearTimeout(overlayRevealTimer);
      if (listElement != null) delete listElement.dataset.isScrolling;
      if (rootElement != null) {
        delete rootElement.dataset.isScrolling;
        delete rootElement.dataset.overlayReveal;
      }
      isScrollingRef.current = false;
      measuredViewportHeightRef.current = null;
      resizeObserver?.disconnect();
    };
  }, [
    controller,
    initialViewportHeight,
    itemHeight,
    overscan,
    stickyFolders
  ]);
  A(() => {
    if (contextMenuEnabled || contextMenuState == null) return;
    closeContextMenu(false);
  }, [
    closeContextMenu,
    contextMenuEnabled,
    contextMenuState
  ]);
  const activeContextMenuKey = q(() => contextMenuState == null ? null : `${contextMenuState.path}::${contextMenuState.source}`, [contextMenuState]);
  A(() => {
    if (activeContextMenuKey == null) {
      slotHost?.clearSlotContent(CONTEXT_MENU_SLOT_NAME);
      return;
    }
    const currentState = contextMenuStateRef.current;
    if (currentState == null) return;
    const anchorElement = contextMenuTriggerRef.current ?? contextMenuAnchorRef.current;
    if (anchorElement == null) return;
    const context = {
      anchorElement,
      anchorRect: currentState.anchorRect ?? serializeAnchorRect(anchorElement.getBoundingClientRect()),
      close: (options) => {
        closeContextMenuRef.current(options?.restoreFocus ?? true);
      },
      restoreFocus: () => {
        if (!shouldRestoreContextMenuFocusRef.current) return;
        restoreFocusToTreeRef.current(contextMenuStateRef.current?.path ?? null);
      }
    };
    const menuContent = composition?.contextMenu?.render?.(currentState.item, context) ?? null;
    slotHost?.setSlotContent(CONTEXT_MENU_SLOT_NAME, menuContent);
    composition?.contextMenu?.onOpen?.(currentState.item, context);
    focusFirstMenuElement(menuContent);
    queueMicrotask(() => {
      if (menuContent == null || !menuContent.isConnected) return;
      if (document.activeElement !== menuContent) return;
      focusFirstMenuElement(menuContent);
    });
    return () => {
      slotHost?.clearSlotContent(CONTEXT_MENU_SLOT_NAME);
    };
  }, [
    activeContextMenuKey,
    composition?.contextMenu,
    slotHost
  ]);
  A(() => {
    if (contextMenuState != null && controller.getItem(contextMenuState.path) == null) closeContextMenu();
  }, [
    closeContextMenu,
    contextMenuState,
    controller
  ]);
  A(() => {
    if (contextMenuState == null) return;
    const rootNode = rootRef.current?.getRootNode();
    const host = rootNode instanceof ShadowRoot ? rootNode.host : rootRef.current;
    const onPointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (isEventInContextMenu(event)) return;
      if (contextMenuAnchorRef.current?.contains(target) === true) return;
      if (host?.contains(target) === true) return;
      closeContextMenu();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeContextMenu();
      }
    };
    document.addEventListener("mousedown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [closeContextMenu, contextMenuState]);
  A(() => {
    const scrollElement = scrollRef.current;
    const rootElement = rootRef.current;
    if (scrollElement == null || rootElement == null) {
      previousFocusedPathRef.current = focusedPath;
      return;
    }
    const focusedButton = focusedPath == null ? null : rowButtonRefs.current.get(focusedPath) ?? null;
    const activeTreeElement = getActiveTreeElement(rootElement);
    const activeTreeElementPath = activeTreeElement?.dataset.itemPath ?? null;
    const renameInputOwnsFocus = isRenaming && renameInputRef.current === activeTreeElement;
    const searchInputOwnsFocus = searchEnabled && searchInputRef.current === activeTreeElement;
    const shouldRestoreTreeFocusAfterSearchClose = restoreTreeFocusAfterSearchCloseRef.current && !isSearchOpen;
    const preservedViewportOffset = restoreTreeFocusViewportOffsetRef.current ?? 0;
    const pendingStickyFocusPath = pendingStickyFocusPathRef.current;
    const pendingStickyKeyboardFocusPath = pendingStickyKeyboardFocusPathRef.current;
    const pendingStickyKeyboardViewportOffset = pendingStickyKeyboardViewportOffsetRef.current;
    const pendingStickyKeyboardScrollTop = pendingStickyKeyboardScrollTopRef.current;
    const focusWithinTree = activeTreeElement != null;
    const shouldOwnDomFocus = domFocusOwnerRef.current || focusWithinTree;
    const focusedPathChanged = previousFocusedPathRef.current !== focusedPath;
    const shouldPreserveStickyKeyboardFocusViewport = pendingStickyKeyboardFocusPath != null && pendingStickyKeyboardFocusPath === focusedPath && focusedPath != null;
    let shouldSuppressDomFocusForScrollRequest = false;
    let shouldUpdateViewportForScrollRequest = false;
    if (scrollRequest != null && scrollRequest.id !== processedScrollRequestIdRef.current) {
      processedScrollRequestIdRef.current = scrollRequest.id;
      const scrollRequestIndex = scrollRequest.visibleIndex;
      const scrollRequestRow = controller.getVisibleRows(scrollRequestIndex, scrollRequestIndex)[0] ?? null;
      if (scrollRequestRow != null) {
        const scrollRequestTopInset = stickyFolders ? Math.max(0, Math.min(scrollRequestRow.ancestorPaths.length * itemHeight, Math.max(0, resolvedViewportHeight - itemHeight))) : stickyOverlayHeight;
        shouldSuppressDomFocusForScrollRequest = true;
        shouldUpdateViewportForScrollRequest = scrollFocusedRowToOffset(scrollElement, scrollRequestIndex, itemHeight, resolvedViewportHeight, totalScrollableHeight, scrollRequest.offset, scrollRequestTopInset);
      }
      controller.clearScrollRequest(scrollRequest.id);
    }
    const shouldRestoreFocusedRowViewportOffset = !shouldSuppressDomFocusForScrollRequest && shouldRestoreTreeFocusAfterSearchClose && scrollFocusedRowToViewportOffset(scrollElement, focusedIndex, itemHeight, resolvedViewportHeight, totalScrollableHeight, preservedViewportOffset);
    const shouldRestoreStickyFocusedRowViewportOffset = !shouldSuppressDomFocusForScrollRequest && pendingStickyFocusPath != null && pendingStickyFocusPath === focusedPath && scrollFocusedRowToViewportOffset(scrollElement, focusedIndex, itemHeight, resolvedViewportHeight, totalScrollableHeight, stickyOverlayHeight);
    const shouldRestoreStickyKeyboardViewportOffset = !shouldSuppressDomFocusForScrollRequest && pendingStickyKeyboardViewportOffset != null && pendingStickyKeyboardViewportOffset.path === focusedPath && scrollFocusedRowToViewportOffset(scrollElement, focusedIndex, itemHeight, resolvedViewportHeight, totalScrollableHeight, pendingStickyKeyboardViewportOffset.viewportOffset);
    const shouldRestoreStickyKeyboardScrollTop = !shouldSuppressDomFocusForScrollRequest && pendingStickyKeyboardScrollTop != null && pendingStickyKeyboardScrollTop.path === focusedPath && scrollElement.scrollTop !== pendingStickyKeyboardScrollTop.scrollTop;
    if (shouldRestoreStickyKeyboardScrollTop) scrollElement.scrollTop = pendingStickyKeyboardScrollTop.scrollTop;
    if (shouldRestoreStickyKeyboardScrollTop || shouldUpdateViewportForScrollRequest || shouldRestoreStickyFocusedRowViewportOffset || shouldRestoreStickyKeyboardViewportOffset || shouldRestoreFocusedRowViewportOffset || shouldOwnDomFocus && focusedPathChanged && pendingStickyFocusPath !== focusedPath && !shouldPreserveStickyKeyboardFocusViewport && scrollFocusedRowIntoView(scrollElement, focusedIndex, itemHeight, resolvedViewportHeight, stickyOverlayHeight)) updateViewportRef.current();
    if (shouldSuppressDomFocusForScrollRequest) {
      previousFocusedPathRef.current = focusedPath;
      return;
    }
    if (!shouldOwnDomFocus) {
      previousFocusedPathRef.current = focusedPath;
      return;
    }
    if (renameInputOwnsFocus) {
      previousFocusedPathRef.current = focusedPath;
      return;
    }
    if (searchInputOwnsFocus && !shouldRestoreTreeFocusAfterSearchClose) {
      previousFocusedPathRef.current = focusedPath;
      return;
    }
    if (focusedButton == null) {
      if (shouldRestoreTreeFocusAfterSearchClose && focusedIndex >= 0) {
        scrollFocusedRowToViewportOffset(scrollElement, focusedIndex, itemHeight, resolvedViewportHeight, totalScrollableHeight, preservedViewportOffset);
        updateViewportRef.current();
      }
      previousFocusedPathRef.current = focusedPath;
      return;
    }
    if (focusedPathChanged || shouldRestoreTreeFocusAfterSearchClose || pendingStickyFocusPath === focusedPath || pendingStickyKeyboardFocusPath === focusedPath || pendingStickyKeyboardViewportOffset?.path === focusedPath || pendingStickyKeyboardScrollTop?.path === focusedPath || activeTreeElementPath == null || activeTreeElementPath !== focusedPath) {
      focusElement(focusedButton);
      if (pendingStickyFocusPath === focusedPath) pendingStickyFocusPathRef.current = null;
      if (pendingStickyKeyboardFocusPath === focusedPath) pendingStickyKeyboardFocusPathRef.current = null;
      if (pendingStickyKeyboardViewportOffset?.path === focusedPath) pendingStickyKeyboardViewportOffsetRef.current = null;
      if (pendingStickyKeyboardScrollTop?.path === focusedPath) pendingStickyKeyboardScrollTopRef.current = null;
      restoreTreeFocusAfterSearchCloseRef.current = false;
      restoreTreeFocusViewportOffsetRef.current = null;
    }
    previousFocusedPathRef.current = focusedPath;
  }, [
    controller,
    focusedIndex,
    focusedPath,
    focusedRowIsMounted,
    itemHeight,
    isRenaming,
    isSearchOpen,
    range,
    resolvedViewportHeight,
    searchEnabled,
    scrollRequest,
    stickyFolders,
    stickyOverlayHeight,
    totalScrollableHeight,
    visibleRows
  ]);
  const focusedRowIsVisible = focusedIndex >= 0 && focusedIndex >= layoutSnapshot.visible.startIndex && focusedIndex <= layoutSnapshot.visible.endIndex;
  const focusedRowIsSticky = focusedPath != null && stickyRows.some((entry) => getFileTreeRowPath(entry.row) === focusedPath);
  const focusedRowHasVisibleAnchor = focusedRowIsVisible || focusedRowIsSticky;
  const focusTriggerPath = contextMenuButtonTriggerEnabled && domFocusOwnerRef.current === true && focusedRowHasVisibleAnchor ? focusedPath : null;
  const pointerTriggerPath = lastContextMenuInteraction === "pointer" ? contextHoverPath : null;
  const triggerPath = contextMenuState?.path ?? debugContextMenuTriggerPathRef.current ?? pointerTriggerPath ?? focusTriggerPath ?? contextHoverPath;
  const isPointerContextMenuOpen = contextMenuState?.source === "right-click";
  A(() => {
    if (isScrollingRef.current && contextMenuState == null) return;
    updateTriggerPosition(getTriggerAnchorButton(triggerPath));
  }, [
    contextMenuState,
    getTriggerAnchorButton,
    range,
    resolvedViewportHeight,
    scrollSettledRevision,
    stickyRows,
    triggerPath,
    updateTriggerPosition,
    visibleRows
  ]);
  const handleTreePointerOver = b((event) => {
    if (isScrollingRef.current) return;
    if (isEventInContextMenu(event)) return;
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest?.(`[data-type="${CONTEXT_MENU_TRIGGER_TYPE}"]`) != null) return;
    const stickyRowButton = target.closest?.('[data-file-tree-sticky-row="true"]');
    const rowButton = target.closest?.('[data-type="item"]');
    const nextPath = stickyRowButton instanceof HTMLElement ? stickyRowButton.dataset.fileTreeStickyPath ?? null : rowButton instanceof HTMLElement ? rowButton.dataset.itemPath ?? null : null;
    if (nextPath != null) setLastContextMenuInteraction((previousMode) => previousMode === "pointer" ? previousMode : "pointer");
    setContextHoverPath((previousPath) => previousPath === nextPath ? previousPath : nextPath);
  }, []);
  const handleTreePointerLeave = b(() => {
    setContextHoverPath(null);
  }, []);
  A(() => {
    if (!dragAndDropEnabled) return;
    const handleWindowDragEnd = () => {
      clearTouchDragResources();
      controller.cancelDrag();
    };
    window.addEventListener("dragend", handleWindowDragEnd);
    return () => {
      window.removeEventListener("dragend", handleWindowDragEnd);
      clearTouchDragResources();
      controller.cancelDrag();
    };
  }, [controller, dragAndDropEnabled]);
  const handleTreeDragOver = (event) => {
    if (!dragAndDropEnabled || controller.getDragSession() == null || touchDragActiveRef.current) return;
    const nextTarget = resolveDropTargetFromElement(event.target instanceof HTMLElement ? event.target : null);
    controller.setDragTarget(nextTarget);
    scheduleDragHoverOpen(controller.getDragSession()?.target ?? null);
    updateDragPoint(event.clientX, event.clientY);
    if (event.dataTransfer != null) event.dataTransfer.dropEffect = "move";
    event.preventDefault();
  };
  const handleTreeDragLeave = (event) => {
    if (!dragAndDropEnabled || controller.getDragSession() == null || touchDragActiveRef.current) return;
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && rootRef.current?.contains(nextTarget) === true) return;
    clearDragHoverOpen();
    stopDragAutoScroll();
    controller.setDragTarget(null);
  };
  const handleTreeDrop = (event) => {
    if (!dragAndDropEnabled || controller.getDragSession() == null || touchDragActiveRef.current) return;
    event.preventDefault();
    syncDropTargetFromPoint(event.clientX, event.clientY);
    controller.completeDrag();
    clearDragPreview();
    clearDragHoverOpen();
    stopDragAutoScroll();
    dragRowSnapshotRef.current = null;
  };
  const windowHeight = layoutSnapshot.window.height;
  const windowOffsetTop = layoutSnapshot.window.offsetTop;
  const windowStickyTopInset = Math.min(0, resolvedViewportHeight - windowHeight);
  const windowStickyBottomInset = Math.min(0, resolvedViewportHeight - windowHeight - stickyOverlayHeight);
  const shouldRenderParkedFocusedRow = activeItemPath === focusedPath || restoreTreeFocusAfterSearchCloseRef.current;
  const parkedFocusedRow = focusedPath != null && shouldRenderParkedFocusedRow && !focusedRowIsMounted && focusedIndex >= 0 ? visibleRows[focusedIndex] ?? controller.getVisibleRows(focusedIndex, focusedIndex)[0] ?? null : null;
  const parkedFocusedRowOffset = parkedFocusedRow == null ? null : getParkedFocusedRowOffset(focusedIndex, itemHeight, range, windowHeight);
  const draggedRowSnapshot = dragRowSnapshotRef.current;
  const draggedRowIsMounted = draggedPrimaryPath != null && draggedRowSnapshot != null && draggedRowSnapshot.path === draggedPrimaryPath && draggedRowSnapshot.index >= range.start && draggedRowSnapshot.index <= range.end;
  const parkedDraggedRow = draggedPrimaryPath != null && draggedRowSnapshot != null && draggedRowSnapshot.path === draggedPrimaryPath && !draggedRowIsMounted && draggedRowSnapshot.path !== parkedFocusedRow?.path ? draggedRowSnapshot : null;
  const parkedDraggedRowOffset = parkedDraggedRow == null ? null : getParkedFocusedRowOffset(parkedDraggedRow.index, itemHeight, range, windowHeight);
  const guideStyleText = getFileTreeGuideStyleText((focusedIndex >= 0 ? visibleRows[focusedIndex] ?? controller.getVisibleRows(focusedIndex, focusedIndex)[0] ?? null : null)?.ancestorPaths.at(-1) ?? null);
  const activeDescendantId = isSearchOpen && focusedPath != null ? getFileTreeFocusedRowDomId(instanceId, focusedPath, !focusedRowIsMounted) : void 0;
  const visualFocusPath = contextMenuState?.path ?? (isSearchOpen ? focusedPath : activeItemPath);
  const visualContextHoverPath = contextMenuState?.path ?? contextHoverPath;
  const triggerButton = getTriggerAnchorButton(triggerPath);
  const triggerButtonVisible = contextMenuEnabled && contextMenuButtonTriggerEnabled && !isPointerContextMenuOpen && !isRenaming && triggerButton != null && contextMenuAnchorTop != null && triggerPath != null;
  const contextMenuAnchorVisible = contextMenuEnabled && (triggerButtonVisible || contextMenuState != null);
  const pointerAnchorRect = contextMenuState?.anchorRect;
  const rowAnchorTop = pointerAnchorRect == null && triggerButton != null && contextMenuAnchorTop != null && (contextMenuState != null || triggerButtonVisible) ? contextMenuAnchorTop : null;
  const contextMenuAnchorStyle = pointerAnchorRect != null ? {
    left: `${pointerAnchorRect.left}px`,
    position: "fixed",
    right: "auto",
    top: `${pointerAnchorRect.top}px`
  } : rowAnchorTop != null ? { top: `${rowAnchorTop}px` } : void 0;
  const contextMenuTriggerStyle = isPointerContextMenuOpen ? { opacity: "0" } : void 0;
  const handleRowClick = b((event, row, targetPath, mode) => {
    const plan = computeFileTreeRowClickPlan({
      event: {
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey
      },
      isDirectory: row.kind === "directory",
      isSearchOpen,
      mode
    });
    const shouldToggleDirectory = plan.toggleDirectory && row.kind === "directory";
    const mountedDirectoryPath = shouldToggleDirectory ? controller.resolveMountedDirectoryPathFromInput(targetPath) : null;
    if (shouldToggleDirectory && mountedDirectoryPath == null) return;
    const actionTargetPath = mountedDirectoryPath ?? targetPath;
    switch (plan.selection.kind) {
      case "range":
        controller.selectPathRange(actionTargetPath, plan.selection.additive);
        break;
      case "toggle":
        controller.togglePathSelectionFromInput(actionTargetPath);
        break;
      case "single":
        controller.selectOnlyMountedPathFromInput(actionTargetPath);
        break;
    }
    const clickedElement = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    const clickedRowIsVisible = row.index >= layoutSnapshot.visible.startIndex && row.index <= layoutSnapshot.visible.endIndex;
    const shouldExposeFocusedTrigger = mode === "flow" && clickedRowIsVisible && clickedElement != null && clickedElement.dataset.itemParked !== "true";
    controller.focusMountedPathFromInput(actionTargetPath);
    if (shouldExposeFocusedTrigger) {
      domFocusOwnerRef.current = true;
      setActiveItemPath((previousPath) => previousPath === actionTargetPath ? previousPath : actionTargetPath);
      setLastContextMenuInteraction("focus");
    }
    if (shouldToggleDirectory) controller.toggleMountedDirectoryFromInput(actionTargetPath);
    if (plan.closeSearch) controller.closeSearch();
    if (plan.revealCanonical) revealCanonicalRowAtStickyOffset(actionTargetPath, { targetOffset: "sticky-parents" });
  }, [
    controller,
    isSearchOpen,
    layoutSnapshot.visible.endIndex,
    layoutSnapshot.visible.startIndex,
    revealCanonicalRowAtStickyOffset
  ]);
  const openMenuFromTrigger = () => {
    if (isScrollingRef.current) return;
    if (!contextMenuButtonTriggerEnabled) return;
    if (triggerPath == null || triggerButton == null) return;
    const triggerItem = controller.getItem(triggerPath);
    if (triggerItem == null) return;
    updateTriggerPosition(triggerButton);
    shouldRestoreContextMenuFocusRef.current = true;
    setContextMenuState({
      anchorRect: null,
      item: {
        kind: triggerItem.isDirectory() ? "directory" : "file",
        name: triggerButton.getAttribute("aria-label") ?? triggerPath,
        path: triggerItem.getPath()
      },
      path: triggerItem.getPath(),
      source: "button"
    });
  };
  const flowRowFrame = {
    contextHoverPath: visualContextHoverPath,
    contextMenuButtonTriggerEnabled,
    contextMenuButtonVisibility,
    contextMenuEnabled,
    contextMenuRightClickEnabled,
    contextMenuTriggerMode,
    controller,
    directoriesWithGitChanges,
    dragAndDropEnabled,
    draggedPathSet,
    dragTarget,
    gitLaneActive,
    gitStatusByPath,
    handleRowDragEnd,
    handleRowDragStart,
    handleRowTouchStart,
    ignoredGitDirectories,
    ignoredInheritanceCache,
    instanceId,
    itemHeight,
    onKeyDown: handleTreeKeyDown,
    onRowClick: handleRowClick,
    openContextMenuForRow,
    registerButton: registerRowButton,
    registerRenameInput,
    renameView,
    renderDecorationForRow,
    resolveIcon,
    shouldSuppressContextMenu,
    visualFocusPath
  };
  const stickyRowFrame = {
    ...flowRowFrame,
    registerButton: registerStickyRowButton
  };
  return /* @__PURE__ */ u$1("div", {
    ref: rootRef,
    id: treeDomId,
    "data-file-tree-context-menu-button-visibility": contextMenuEnabled && contextMenuButtonTriggerEnabled ? contextMenuButtonVisibility : void 0,
    "data-file-tree-context-menu-trigger-mode": contextMenuEnabled ? contextMenuTriggerMode : void 0,
    "data-file-tree-has-context-menu-action-lane": contextMenuEnabled && contextMenuButtonTriggerEnabled ? "true" : void 0,
    "data-file-tree-has-git-lane": gitLaneActive ? "true" : void 0,
    "data-file-tree-virtualized-root": "true",
    onDragLeave: dragAndDropEnabled ? handleTreeDragLeave : void 0,
    onDragOver: dragAndDropEnabled ? handleTreeDragOver : void 0,
    onDrop: dragAndDropEnabled ? handleTreeDrop : void 0,
    onKeyDown: handleTreeKeyDown,
    onPointerLeave: contextMenuEnabled ? handleTreePointerLeave : void 0,
    onPointerOver: contextMenuEnabled ? handleTreePointerOver : void 0,
    role: "tree",
    tabIndex: -1,
    style: {
      outline: "none",
      position: "relative"
    },
    children: [
      /* @__PURE__ */ u$1("style", {
        "data-file-tree-guide-style": "true",
        dangerouslySetInnerHTML: { __html: guideStyleText }
      }),
      /* @__PURE__ */ u$1("slot", {
        name: HEADER_SLOT_NAME,
        "data-type": "header-slot"
      }),
      searchEnabled ? /* @__PURE__ */ u$1("div", {
        "data-file-tree-search-container": true,
        "data-open": isSearchOpen ? "true" : "false",
        children: /* @__PURE__ */ u$1("input", {
          ref: searchInputRef,
          "aria-activedescendant": activeDescendantId,
          "aria-controls": treeDomId,
          placeholder: "Search…",
          "data-file-tree-search-input": true,
          "data-file-tree-search-input-fake-focus": fakeSearchFocusActive ? "true" : void 0,
          value: searchValue,
          onBlur: () => {
            if (searchBlurBehavior === "retain" && !searchInputUserInteractedRef.current) return;
            controller.closeSearch();
          },
          onFocus: markSearchInputInteracted,
          onPointerDown: markSearchInputInteracted,
          onInput: (event) => {
            markSearchInputInteracted();
            const target = event.currentTarget;
            controller.setSearch(target.value);
          }
        })
      }) : null,
      /* @__PURE__ */ u$1("div", {
        ref: scrollRef,
        "data-file-tree-virtualized-scroll": "true",
        children: [stickyFolders && hasStickyUiMount && stickyRows.length > 0 ? /* @__PURE__ */ u$1("div", {
          "aria-hidden": "true",
          "data-file-tree-sticky-overlay": "true",
          children: /* @__PURE__ */ u$1("div", {
            "data-file-tree-sticky-overlay-content": "true",
            style: { height: `${overlayRowsHeight}px` },
            children: stickyRows.map((entry, index) => renderStyledRow(stickyRowFrame, entry.row, `sticky:${getFileTreeRowPath(entry.row)}`, {
              mode: "sticky",
              style: {
                left: "0",
                position: "absolute",
                right: "0",
                top: `${entry.top}px`,
                zIndex: `${stickyRows.length - index}`
              }
            }))
          })
        }) : null, /* @__PURE__ */ u$1("div", {
          ref: listRef,
          "data-file-tree-virtualized-list": "true",
          style: { height: `${totalScrollableHeight}px` },
          children: [/* @__PURE__ */ u$1("div", {
            "data-file-tree-virtualized-sticky-offset": "true",
            "aria-hidden": "true",
            style: { height: `${windowOffsetTop}px` }
          }), /* @__PURE__ */ u$1("div", {
            "data-file-tree-virtualized-sticky": "true",
            style: {
              height: `${windowHeight}px`,
              top: `${windowStickyTopInset}px`,
              bottom: `${windowStickyBottomInset}px`
            },
            children: [
              renderRangeChildren(flowRowFrame, range, stickyRowPathSet),
              parkedFocusedRow != null && parkedFocusedRowOffset != null ? renderStyledRow(flowRowFrame, parkedFocusedRow, `parked:${parkedFocusedRow.path}`, {
                isParked: true,
                style: {
                  left: "0",
                  opacity: "0",
                  pointerEvents: draggedPrimaryPath === parkedFocusedRow.path ? "none" : void 0,
                  position: "absolute",
                  right: "0",
                  top: `${parkedFocusedRowOffset}px`
                }
              }) : null,
              parkedDraggedRow != null && parkedDraggedRowOffset != null ? renderStyledRow(flowRowFrame, parkedDraggedRow, `parked-drag:${parkedDraggedRow.path}`, {
                isParked: true,
                style: {
                  left: "0",
                  opacity: "0",
                  pointerEvents: "none",
                  position: "absolute",
                  right: "0",
                  top: `${parkedDraggedRowOffset}px`
                }
              }) : null
            ]
          })]
        })]
      }),
      contextMenuEnabled ? /* @__PURE__ */ u$1("div", {
        ref: contextMenuAnchorRef,
        "data-type": "context-menu-anchor",
        "data-visible": contextMenuAnchorVisible ? "true" : "false",
        style: contextMenuAnchorStyle,
        children: [/* @__PURE__ */ u$1("button", {
          ref: contextMenuTriggerRef,
          type: "button",
          "data-type": CONTEXT_MENU_TRIGGER_TYPE,
          "aria-label": "Options",
          "aria-haspopup": "menu",
          "aria-expanded": contextMenuState != null ? "true" : "false",
          "data-visible": triggerButtonVisible ? "true" : "false",
          onMouseDown: (event) => {
            event.preventDefault();
          },
          onClick: (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (contextMenuState != null) {
              closeContextMenu();
              return;
            }
            openMenuFromTrigger();
          },
          tabIndex: -1,
          style: contextMenuTriggerStyle,
          children: /* @__PURE__ */ u$1(Icon, { ...resolveIcon("file-tree-icon-ellipsis") })
        }), contextMenuState != null ? /* @__PURE__ */ u$1("slot", { name: CONTEXT_MENU_SLOT_NAME }) : null]
      }) : null,
      contextMenuState != null ? /* @__PURE__ */ u$1("div", {
        "data-type": "context-menu-wash",
        "aria-hidden": "true",
        onMouseDownCapture: (event) => {
          event.preventDefault();
          closeContextMenu();
        },
        onTouchStartCapture: (event) => {
          event.preventDefault();
          event.stopPropagation();
          closeContextMenu();
        },
        onTouchMoveCapture: (event) => {
          event.preventDefault();
          event.stopPropagation();
        },
        onWheelCapture: (event) => {
          event.preventDefault();
          event.stopPropagation();
        }
      }) : null
    ]
  });
}
const fileTreeRenderer = {
  hydrateRoot: (element, props) => {
    G(_$1(FileTreeView, props), element);
  },
  renderRoot: (element, props) => {
    F$1(_$1(FileTreeView, props), element);
  },
  unmountRoot: (element) => {
    F$1(null, element);
  }
};
function renderFileTreeRoot(element, props) {
  fileTreeRenderer.renderRoot(element, props);
}
function hydrateFileTreeRoot(element, props) {
  fileTreeRenderer.hydrateRoot(element, props);
}
function unmountFileTreeRoot(element) {
  fileTreeRenderer.unmountRoot(element);
}
var FileTreeManagedSlotHost = class {
  #contentBySlot = /* @__PURE__ */ new Map();
  #host = null;
  clearAll() {
    for (const content of this.#contentBySlot.values()) content.remove();
    this.#contentBySlot.clear();
  }
  clearSlotContent(slotName) {
    const currentContent = this.#getCurrentContent(slotName);
    if (currentContent == null) return;
    currentContent.remove();
    this.#contentBySlot.delete(slotName);
  }
  setHost(host) {
    this.#host = host;
    if (host == null) return;
    this.#adoptExistingManagedContent(host);
    for (const [slotName, content] of this.#contentBySlot) this.#attachContent(slotName, content);
  }
  setSlotContent(slotName, content) {
    const currentContent = this.#getCurrentContent(slotName);
    if (currentContent === content) {
      if (content != null) {
        this.#contentBySlot.set(slotName, content);
        this.#attachContent(slotName, content);
      }
      return;
    }
    currentContent?.remove();
    if (content == null) {
      this.#contentBySlot.delete(slotName);
      return;
    }
    this.#contentBySlot.set(slotName, content);
    this.#attachContent(slotName, content);
  }
  setSlotHtml(slotName, html) {
    const normalizedHtml = html?.trim() ?? "";
    if (normalizedHtml.length === 0) {
      this.setSlotContent(slotName, null);
      return;
    }
    const currentContent = this.#getCurrentContent(slotName);
    if (currentContent != null && currentContent.innerHTML === normalizedHtml) {
      this.#contentBySlot.set(slotName, currentContent);
      this.#attachContent(slotName, currentContent);
      return;
    }
    const nextContent = document.createElement("div");
    nextContent.innerHTML = normalizedHtml;
    this.setSlotContent(slotName, nextContent);
  }
  #getCurrentContent(slotName) {
    const trackedContent = this.#contentBySlot.get(slotName) ?? null;
    if (trackedContent != null) return trackedContent;
    const host = this.#host;
    if (host == null) return null;
    for (const element of Array.from(host.children)) {
      if (!(element instanceof HTMLElement)) continue;
      if (element.dataset.fileTreeManagedSlot === slotName) return element;
    }
    return null;
  }
  #attachContent(slotName, content) {
    content.slot = slotName;
    content.dataset.fileTreeManagedSlot = slotName;
    if (this.#host != null && content.parentNode !== this.#host) this.#host.appendChild(content);
  }
  #adoptExistingManagedContent(host) {
    for (const element of Array.from(host.children)) {
      if (!(element instanceof HTMLElement)) continue;
      const slotName = element.dataset.fileTreeManagedSlot;
      if (slotName == null || this.#contentBySlot.has(slotName)) continue;
      this.#contentBySlot.set(slotName, element);
    }
  }
};
let clientInstanceId = 0;
function createClientId(explicitId) {
  if (explicitId != null && explicitId.length > 0) return explicitId;
  clientInstanceId += 1;
  return `pst_ft_${clientInstanceId}`;
}
function resolveInitialViewportHeight({ initialVisibleRowCount, itemHeight }) {
  return initialVisibleRowCount == null ? FILE_TREE_DEFAULT_VIEWPORT_HEIGHT : Math.max(0, initialVisibleRowCount) * (itemHeight ?? FILE_TREE_DEFAULT_ITEM_HEIGHT);
}
function parseSpriteSheet(spriteSheet) {
  if (typeof document === "undefined") return;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = spriteSheet;
  const svg = wrapper.querySelector("svg");
  return svg instanceof SVGElement ? svg : void 0;
}
function isBuiltInSpriteSheet(spriteSheet) {
  return spriteSheet.querySelector("#file-tree-icon-chevron") instanceof SVGElement && spriteSheet.querySelector("#file-tree-icon-file") instanceof SVGElement && spriteSheet.querySelector("#file-tree-icon-dot") instanceof SVGElement && spriteSheet.querySelector("#file-tree-icon-lock") instanceof SVGElement;
}
function getTopLevelSpriteSheets(shadowRoot) {
  return Array.from(shadowRoot.children).filter((element) => element instanceof SVGElement);
}
var FileTree = class {
  static LoadedCustomComponent = FileTreeContainerLoaded;
  #composition;
  #controller;
  #id;
  #onExpansionChange;
  #onSelectionChange;
  #renderRowDecoration;
  #renamingEnabled;
  #searchBlurBehavior;
  #searchEnabled;
  #searchFakeFocus;
  #slotHost = new FileTreeManagedSlotHost();
  #density;
  #viewOptions;
  #fileTreeContainer;
  #gitStatusState;
  #icons;
  #unsafeCSS;
  #unsafeCSSStyle;
  #appliedUnsafeCSS;
  #selectionVersion;
  #selectionSubscription = null;
  #expansionSubscription = null;
  #wrapper;
  #wroteHostItemHeight = false;
  #wroteHostDensityFactor = false;
  constructor(options) {
    const { composition, density, fileTreeSearchMode, gitStatus, id, initialSearchQuery, icons, itemHeight, onExpansionChange, onSearchChange, onSelectionChange, overscan, renderRowDecoration: renderRowDecoration2, renaming, search, searchBlurBehavior, searchFakeFocus, stickyFolders, unsafeCSS, initialVisibleRowCount, ...controllerOptions } = options;
    this.#composition = composition;
    this.#id = createClientId(id);
    this.#gitStatusState = resolveFileTreeGitStatusState(gitStatus);
    this.#icons = icons;
    this.#unsafeCSS = unsafeCSS;
    this.#onExpansionChange = onExpansionChange;
    this.#onSelectionChange = onSelectionChange;
    this.#renderRowDecoration = renderRowDecoration2;
    this.#renamingEnabled = renaming != null && renaming !== false;
    this.#searchBlurBehavior = searchBlurBehavior;
    this.#searchEnabled = search === true;
    this.#searchFakeFocus = searchFakeFocus === true;
    this.#density = resolveFileTreeDensity(density, itemHeight);
    this.#viewOptions = {
      itemHeight: this.#density.itemHeight,
      overscan,
      stickyFolders,
      initialVisibleRowCount
    };
    this.#controller = new FileTreeController({
      ...controllerOptions,
      fileTreeSearchMode,
      initialSearchQuery,
      onSearchChange,
      renaming
    });
    this.#selectionVersion = this.#controller.getSelectionVersion();
    this.#selectionSubscription = this.#onSelectionChange == null ? null : this.subscribe(() => {
      this.#emitSelectionChange();
    });
    this.#expansionSubscription = this.#onExpansionChange == null ? null : this.#controller.subscribe((event) => {
      if (event?.operation !== "expand" && event?.operation !== "collapse") return;
      this.#onExpansionChange?.({ path: event.path, expanded: event.operation === "expand" });
    });
  }
  unmount() {
    if (this.#wrapper != null) {
      unmountFileTreeRoot(this.#wrapper);
      delete this.#wrapper.dataset.fileTreeVirtualizedWrapper;
      this.#wrapper = void 0;
    }
    this.#slotHost.clearAll();
    this.#slotHost.setHost(null);
    if (this.#fileTreeContainer != null) {
      delete this.#fileTreeContainer.dataset.fileTreeVirtualized;
      this.#removeOwnedDensityHostStyle(this.#fileTreeContainer);
      this.#fileTreeContainer = void 0;
    }
  }
  cleanUp() {
    this.unmount();
    this.#selectionSubscription?.();
    this.#selectionSubscription = null;
    this.#expansionSubscription?.();
    this.#expansionSubscription = null;
    this.#controller.destroy();
  }
  getFileTreeContainer() {
    return this.#fileTreeContainer;
  }
  getItem(path) {
    return this.#controller.getItem(path);
  }
  getFocusedItem() {
    return this.#controller.getFocusedItem();
  }
  getFocusedPath() {
    return this.#controller.getFocusedPath();
  }
  getSelectedPaths() {
    return this.#controller.getSelectedPaths();
  }
  getComposition() {
    return this.#composition;
  }
  getItemHeight() {
    return this.#density.itemHeight;
  }
  getDensityFactor() {
    return this.#density.factor;
  }
  subscribe(listener) {
    let hasSeenInitialSnapshot = false;
    return this.#controller.subscribe(() => {
      if (!hasSeenInitialSnapshot) {
        hasSeenInitialSnapshot = true;
        return;
      }
      listener();
    });
  }
  focusPath(path) {
    this.#controller.focusPath(path);
  }
  scrollToPath(path, options) {
    this.#controller.scrollToPath(path, options);
  }
  focusNearestPath(path) {
    return this.#controller.focusNearestPath(path);
  }
  add(path) {
    this.#controller.add(path);
  }
  batch(operations) {
    this.#controller.batch(operations);
  }
  move(fromPath, toPath, options) {
    this.#controller.move(fromPath, toPath, options);
  }
  onMutation(type, handler) {
    return this.#controller.onMutation(type, handler);
  }
  setSearch(value) {
    this.#controller.setSearch(value);
  }
  openSearch(initialValue) {
    this.#controller.openSearch(initialValue);
  }
  closeSearch() {
    this.#controller.closeSearch();
  }
  isSearchOpen() {
    return this.#controller.isSearchOpen();
  }
  getSearchValue() {
    return this.#controller.getSearchValue();
  }
  getSearchMatchingPaths() {
    return this.#controller.getSearchMatchingPaths();
  }
  focusNextSearchMatch() {
    this.#controller.focusNextSearchMatch();
  }
  focusPreviousSearchMatch() {
    this.#controller.focusPreviousSearchMatch();
  }
  startRenaming(path, options) {
    return this.#controller.startRenaming(path, options);
  }
  remove(path, options) {
    this.#controller.remove(path, options);
  }
  resetPaths(paths, options) {
    this.#controller.resetPaths(paths, options);
  }
  setComposition(composition) {
    this.#composition = composition;
    const mountedTree = this.#getMountedTreeElements();
    if (mountedTree == null) return;
    this.#syncHeaderSlotContent();
    renderFileTreeRoot(mountedTree.wrapper, this.#getViewProps());
  }
  setGitStatus(gitStatus) {
    this.#gitStatusState = resolveFileTreeGitStatusState(gitStatus, this.#gitStatusState);
    const mountedTree = this.#getMountedTreeElements();
    if (mountedTree == null) return;
    renderFileTreeRoot(mountedTree.wrapper, this.#getViewProps());
  }
  setIcons(icons) {
    this.#icons = icons;
    const mountedTree = this.#getMountedTreeElements();
    if (mountedTree == null) return;
    this.#syncIconSurface(mountedTree.host, mountedTree.wrapper);
    renderFileTreeRoot(mountedTree.wrapper, this.#getViewProps());
  }
  hydrate({ fileTreeContainer }) {
    const host = this.#prepareHost(fileTreeContainer);
    const wrapper = this.#getOrCreateWrapper(host);
    this.#syncHeaderSlotContent();
    hydrateFileTreeRoot(wrapper, this.#getViewProps());
  }
  render({ containerWrapper, fileTreeContainer }) {
    const host = this.#prepareHost(fileTreeContainer ?? this.#fileTreeContainer, containerWrapper);
    const wrapper = this.#getOrCreateWrapper(host);
    this.#syncHeaderSlotContent();
    renderFileTreeRoot(wrapper, this.#getViewProps());
  }
  #getInitialViewOptions() {
    return {
      initialViewportHeight: resolveInitialViewportHeight({
        initialVisibleRowCount: this.#viewOptions.initialVisibleRowCount,
        itemHeight: this.#viewOptions.itemHeight
      }),
      itemHeight: this.#viewOptions.itemHeight,
      overscan: this.#viewOptions.overscan,
      stickyFolders: this.#viewOptions.stickyFolders
    };
  }
  #getViewProps() {
    return {
      composition: this.#composition,
      controller: this.#controller,
      gitStatusByPath: this.#gitStatusState?.statusByPath,
      ignoredGitDirectories: this.#gitStatusState?.ignoredDirectoryPaths,
      directoriesWithGitChanges: this.#gitStatusState?.directoriesWithChanges,
      icons: this.#icons,
      instanceId: this.#id,
      renamingEnabled: this.#renamingEnabled,
      renderRowDecoration: this.#renderRowDecoration,
      searchBlurBehavior: this.#searchBlurBehavior,
      searchEnabled: this.#searchEnabled,
      searchFakeFocus: this.#searchFakeFocus,
      slotHost: this.#slotHost,
      ...this.#getInitialViewOptions()
    };
  }
  #getMountedTreeElements() {
    const host = this.#fileTreeContainer;
    const wrapper = this.#wrapper;
    if (host == null || wrapper == null) return null;
    return {
      host,
      wrapper
    };
  }
  #syncIconSurface(host, wrapper) {
    const shadowRoot = host.shadowRoot;
    if (shadowRoot != null) {
      this.#syncBuiltInSpriteSheet(shadowRoot);
      this.#syncCustomSpriteSheet(shadowRoot);
    }
    this.#syncIconModeAttrs(wrapper);
  }
  #emitSelectionChange() {
    const onSelectionChange = this.#onSelectionChange;
    if (onSelectionChange == null) return;
    const nextSelectionVersion = this.#controller.getSelectionVersion();
    if (nextSelectionVersion === this.#selectionVersion) return;
    this.#selectionVersion = nextSelectionVersion;
    onSelectionChange(this.#controller.getSelectedPaths());
  }
  #syncHeaderSlotContent() {
    const renderHeader = this.#composition?.header?.render;
    if (renderHeader != null) {
      this.#slotHost.setSlotContent(HEADER_SLOT_NAME, renderHeader());
      return;
    }
    this.#slotHost.setSlotHtml(HEADER_SLOT_NAME, this.#composition?.header?.html ?? null);
  }
  #syncBuiltInSpriteSheet(shadowRoot) {
    const currentBuiltInSprite = getTopLevelSpriteSheets(shadowRoot).find((sprite) => isBuiltInSpriteSheet(sprite));
    const nextBuiltInSprite = parseSpriteSheet(getBuiltInSpriteSheet(normalizeFileTreeIcons(this.#icons).set));
    if (nextBuiltInSprite == null) return;
    if (currentBuiltInSprite != null && currentBuiltInSprite.outerHTML === nextBuiltInSprite.outerHTML) return;
    if (currentBuiltInSprite != null) currentBuiltInSprite.replaceWith(nextBuiltInSprite);
    else shadowRoot.prepend(nextBuiltInSprite);
  }
  #syncCustomSpriteSheet(shadowRoot) {
    const topLevelSprites = getTopLevelSpriteSheets(shadowRoot);
    const builtInSprite = topLevelSprites.find((sprite) => isBuiltInSpriteSheet(sprite));
    const currentCustomSprites = topLevelSprites.filter((sprite) => sprite !== builtInSprite);
    const customSpriteSheet = normalizeFileTreeIcons(this.#icons).spriteSheet?.trim() ?? "";
    if (customSpriteSheet.length === 0) {
      for (const currentCustomSprite of currentCustomSprites) currentCustomSprite.remove();
      return;
    }
    const customSprite = parseSpriteSheet(customSpriteSheet);
    if (customSprite == null) {
      for (const currentCustomSprite of currentCustomSprites) currentCustomSprite.remove();
      return;
    }
    if (currentCustomSprites.length === 1 && currentCustomSprites[0].outerHTML === customSprite.outerHTML) return;
    for (const currentCustomSprite of currentCustomSprites) currentCustomSprite.remove();
    shadowRoot.appendChild(customSprite);
  }
  #syncIconModeAttrs(wrapper) {
    const normalizedIcons = normalizeFileTreeIcons(this.#icons);
    if (normalizedIcons.colored && isColoredBuiltInIconSet(normalizedIcons.set)) wrapper.dataset.fileTreeColoredIcons = "true";
    else delete wrapper.dataset.fileTreeColoredIcons;
  }
  #syncUnsafeCSS(shadowRoot) {
    const existingUnsafeStyle = shadowRoot.querySelector(`style[${FILE_TREE_UNSAFE_CSS_ATTRIBUTE}]`);
    if (this.#unsafeCSSStyle == null && existingUnsafeStyle instanceof HTMLStyleElement) this.#unsafeCSSStyle = existingUnsafeStyle;
    if (this.#unsafeCSS == null || this.#unsafeCSS === "") {
      this.#unsafeCSSStyle?.remove();
      this.#unsafeCSSStyle = void 0;
      this.#appliedUnsafeCSS = void 0;
      return;
    }
    if (this.#unsafeCSSStyle?.parentNode === shadowRoot && this.#appliedUnsafeCSS === this.#unsafeCSS) return;
    this.#unsafeCSSStyle ??= document.createElement("style");
    this.#unsafeCSSStyle.setAttribute(FILE_TREE_UNSAFE_CSS_ATTRIBUTE, "");
    if (this.#unsafeCSSStyle.parentNode !== shadowRoot) shadowRoot.appendChild(this.#unsafeCSSStyle);
    this.#unsafeCSSStyle.textContent = wrapUnsafeCSS(this.#unsafeCSS);
    this.#appliedUnsafeCSS = this.#unsafeCSS;
  }
  #getOrCreateWrapper(host) {
    if (this.#wrapper != null) return this.#wrapper;
    const shadowRoot = host.shadowRoot;
    if (shadowRoot == null) throw new Error("FileTree requires a shadow root");
    const wrapperCandidates = Array.from(shadowRoot.children).filter((element) => element instanceof HTMLDivElement && typeof element.dataset.fileTreeId === "string" && element.dataset.fileTreeId.length > 0);
    const existingWrapper = wrapperCandidates.find((element) => element.dataset.fileTreeId === this.#id) ?? wrapperCandidates[0];
    if (existingWrapper != null) this.#id = existingWrapper.dataset.fileTreeId ?? this.#id;
    this.#wrapper = existingWrapper ?? document.createElement("div");
    this.#wrapper.dataset.fileTreeId = this.#id;
    this.#wrapper.dataset.fileTreeVirtualizedWrapper = "true";
    this.#syncIconSurface(host, this.#wrapper);
    if (this.#wrapper.parentNode !== shadowRoot) shadowRoot.appendChild(this.#wrapper);
    return this.#wrapper;
  }
  #prepareHost(fileTreeContainer, parentNode) {
    const host = fileTreeContainer ?? this.#fileTreeContainer ?? document.createElement(FILE_TREE_TAG_NAME);
    if (parentNode != null && host.parentNode !== parentNode) parentNode.appendChild(host);
    const shadowRoot = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    prepareFileTreeShadowRoot(host, shadowRoot);
    this.#syncUnsafeCSS(shadowRoot);
    host.dataset.fileTreeVirtualized = "true";
    host.style.display = "flex";
    this.#applyDensityHostStyle(host);
    this.#slotHost.setHost(host);
    this.#fileTreeContainer = host;
    return host;
  }
  #applyDensityHostStyle(host) {
    if (host.style.getPropertyValue("--trees-item-height") === "") {
      host.style.setProperty("--trees-item-height", `${String(this.#density.itemHeight)}px`);
      this.#wroteHostItemHeight = true;
    }
    if (host.style.getPropertyValue("--trees-density-override") === "") {
      host.style.setProperty("--trees-density-override", String(this.#density.factor));
      this.#wroteHostDensityFactor = true;
    }
  }
  #removeOwnedDensityHostStyle(host) {
    if (this.#wroteHostItemHeight) {
      host.style.removeProperty("--trees-item-height");
      this.#wroteHostItemHeight = false;
    }
    if (this.#wroteHostDensityFactor) {
      host.style.removeProperty("--trees-density-override");
      this.#wroteHostDensityFactor = false;
    }
  }
};
var _tmpl$ = /* @__PURE__ */ template(`<div id=directory-picker-v2-suggestions role=listbox class=directory-picker-v2-suggestions>`), _tmpl$2 = /* @__PURE__ */ template(`<div class=directory-picker-v2-path><div class=directory-picker-v2-actions>`), _tmpl$3 = /* @__PURE__ */ template(`<div class=directory-picker-v2-state>`), _tmpl$4 = /* @__PURE__ */ template(`<div class=directory-picker-v2-browser>`), _tmpl$5 = /* @__PURE__ */ template(`<div class=directory-picker-v2-selection>`), _tmpl$6 = /* @__PURE__ */ template(`<button role=option>`);
function DialogSelectDirectoryV2(props) {
  const global2 = useGlobal();
  const {
    sync,
    sdk
  } = global2.ensureServerCtx(props.server);
  const dialog = useDialog();
  const language = useLanguage();
  const policy = pickerMode(props.mode ?? "directory", props.start);
  const action = {
    file: language.t("dialog.directory.action.selectFile"),
    directory: language.t("dialog.directory.action.selectFolder")
  };
  const [root, setRoot] = createSignal("");
  const [input, setInput] = createSignal("");
  const [selected, setSelected] = createSignal("");
  const [suggestionsOpen, setSuggestionsOpen] = createSignal(false);
  const [activeSuggestion, setActiveSuggestion] = createSignal(-1);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal(false);
  const [rootValid, setRootValid] = createSignal(false);
  const listings = /* @__PURE__ */ new Map();
  const loads = createPriorityTaskQueue(3);
  const advanced = /* @__PURE__ */ new Set();
  let tree;
  let container;
  let pathArea;
  let navigation = 0;
  const missingBase = createMemo(() => !(sync.data.path.home || sync.data.path.directory));
  const [fallbackPath] = createResource(() => missingBase() ? true : void 0, () => sdk.client.path.get().then((result) => result.data).catch(() => void 0), {
    initialValue: void 0
  });
  const home = createMemo(() => sync.data.path.home || fallbackPath()?.home || "");
  const start = createMemo(() => props.start || sync.data.path.home || sync.data.path.directory || fallbackPath()?.home || fallbackPath()?.directory);
  const search = createDirectorySearch({
    sdk,
    home,
    base: () => root() || start()
  });
  const [suggestions] = createResource(input, async (value) => {
    const typed = cleanPickerInput(value).replace(/\/+$/, "");
    const current = displayPickerPath(root(), value, home()).replace(/\/+$/, "");
    if (!typed || typed === current) return {
      query: value,
      items: []
    };
    const directories = (await search(value)).map((absolute) => ({
      absolute,
      type: "directory"
    }));
    if (!policy.includeFiles) return {
      query: value,
      items: directories.slice(0, 5)
    };
    const files = await sdk.client.find.files({
      directory: root(),
      query: pickerFileSearchQuery(root(), value, home()),
      type: "file",
      limit: 20
    }).then((result) => result.data ?? []).catch(() => []);
    const results = [...directories, ...files.map((path) => ({
      absolute: absoluteTreePath(root(), path),
      type: "file"
    }))];
    return {
      query: value,
      items: Array.from(new Map(results.map((result) => [result.absolute, result])).values()).slice(0, 8)
    };
  });
  const currentSuggestions = createMemo(() => currentPickerSuggestions(suggestions(), input()));
  async function load(path, generation, eager = false) {
    const key = path.replace(/\/+$/, "");
    setError(false);
    const absolute = absoluteTreePath(root(), key);
    const existing = listings.get(key);
    if (existing && !eager) loads.promote(`${generation}:${key}`);
    const request = existing ?? loads.schedule(`${generation}:${key}`, eager ? "background" : "user", () => {
      if (!activeTreeNavigation(generation, navigation)) return Promise.resolve(void 0);
      return sdk.client.file.list({
        directory: absolute,
        path: ""
      }).then((result) => result.data ?? []).catch(() => void 0);
    });
    listings.set(key, request);
    const nodes = await request;
    if (!activeTreeNavigation(generation, navigation)) return false;
    if (!nodes) {
      listings.delete(key);
      if (!key) setError(true);
      return false;
    }
    tree?.batch(policy.entries(key, nodes).map((item) => ({
      type: "add",
      path: item
    })));
    if (!eager && advanceTreePreload(advanced, key)) {
      for (const directory of preloadTreeDirectories(key, nodes)) void load(directory, generation, true);
    }
    return true;
  }
  async function navigate(path) {
    const value = policy.navigation(pickerAbsoluteInput(cleanPickerInput(path), home(), root() || start() || home()));
    if (!value) return;
    const token = ++navigation;
    setLoading(true);
    setRootValid(false);
    setSelected("");
    setSuggestionsOpen(false);
    setActiveSuggestion(-1);
    setRoot(value);
    setInput(displayPickerPath(value, value, home()));
    listings.clear();
    advanced.clear();
    tree?.resetPaths([]);
    const valid = await load("", token);
    if (!activeTreeNavigation(token, navigation)) return;
    setRootValid(valid);
    setLoading(false);
  }
  function complete() {
    const items = currentSuggestions();
    const match = items[activeSuggestion()] ?? items[0];
    if (!match) return;
    const value = displayPickerPath(match.absolute, input(), home());
    setInput(match.type === "directory" && !value.endsWith("/") ? value + "/" : value);
    if (match.type === "file") {
      setSelected(policy.selection(root(), pickerFileSearchQuery(root(), match.absolute, home())) ?? "");
      setSuggestionsOpen(false);
      setActiveSuggestion(-1);
    }
  }
  function chooseSuggestion(suggestion) {
    if (suggestion.type === "directory") {
      void navigate(suggestion.absolute);
      return;
    }
    setInput(displayPickerPath(suggestion.absolute, input(), home()));
    setSelected(policy.selection(root(), pickerFileSearchQuery(root(), suggestion.absolute, home())) ?? "");
    setSuggestionsOpen(false);
    setActiveSuggestion(-1);
  }
  function moveSuggestion(delta) {
    setSuggestionsOpen(true);
    setActiveSuggestion((current) => nextSuggestionIndex(current, delta, currentSuggestions().length));
  }
  function activeSuggestionValue() {
    const items = currentSuggestions();
    return items[activeSuggestion()] ?? items[0];
  }
  const keyActions = {
    ArrowDown: () => moveSuggestion(1),
    ArrowUp: () => moveSuggestion(-1),
    Enter: () => {
      const suggestion = activeSuggestionValue();
      if (suggestion) chooseSuggestion(suggestion);
      if (!suggestion) void navigate(input());
    },
    Tab: complete
  };
  function handleInputKey(event) {
    const action2 = keyActions[event.key];
    if (!action2) return;
    if (event.key === "Tab" && event.shiftKey) return;
    event.preventDefault();
    action2();
  }
  function resolve() {
    const path = policy.result(root(), selected(), rootValid());
    if (!path) return;
    props.onSelect(props.multiple ? [path] : path);
    dialog.close();
  }
  onMount(() => {
    const closeSuggestions = (event) => {
      if (pathArea?.contains(event.target)) return;
      setSuggestionsOpen(false);
      setActiveSuggestion(-1);
    };
    document.addEventListener("pointerdown", closeSuggestions);
    onCleanup(() => document.removeEventListener("pointerdown", closeSuggestions));
    tree = new FileTree({
      paths: [],
      flattenEmptyDirectories: false,
      initialExpansion: "closed",
      stickyFolders: true,
      unsafeCSS: `
        button[data-type="item"] {
          background: transparent !important;
          box-shadow: none !important;
        }
        button[data-type="item"]:hover {
          background: var(--v2-overlay-simple-overlay-hover) !important;
        }
        button[data-type="item"]:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
        [data-file-tree-virtualized-scroll] {
          overscroll-behavior: contain;
          scrollbar-width: thin;
        }
      `,
      onExpansionChange(change) {
        if (change.expanded) void load(change.path, navigation);
      },
      onSelectionChange(paths) {
        const path = paths.at(-1);
        setSelected(path ? policy.selection(root(), path) ?? "" : "");
      }
    });
    if (!container) return;
    tree.render({
      containerWrapper: container
    });
    tree.getFileTreeContainer()?.classList.add("directory-picker-v2-tree");
  });
  createEffect(() => {
    const path = start();
    if (!path || root()) return;
    void navigate(path);
  });
  onCleanup(() => tree?.cleanUp());
  return createComponent(Dialog, {
    size: "large",
    "class": "directory-picker-v2",
    get children() {
      return [createComponent(DialogHeader, {
        get children() {
          return createComponent(DialogTitle, {
            get children() {
              return props.title ?? language.t("command.project.open");
            }
          });
        }
      }), createComponent(DividerV2, {}), createComponent(DialogBody, {
        "class": "directory-picker-v2-body pt-4!",
        get children() {
          return [(() => {
            var _el$ = _tmpl$2(), _el$2 = _el$.firstChild;
            var _ref$ = pathArea;
            typeof _ref$ === "function" ? use(_ref$, _el$) : pathArea = _el$;
            insert(_el$, createComponent(TextInputV2, {
              get value() {
                return input();
              },
              autofocus: true,
              autocomplete: "off",
              spellcheck: false,
              "class": "!w-full",
              onInput: (event) => {
                setInput(cleanPickerInput(event.currentTarget.value));
                setSelected("");
                setSuggestionsOpen(true);
                setActiveSuggestion(-1);
              },
              role: "combobox",
              "aria-autocomplete": "list",
              get ["aria-expanded"]() {
                return suggestionsOpen();
              },
              "aria-controls": "directory-picker-v2-suggestions",
              get ["aria-activedescendant"]() {
                return memo(() => activeSuggestion() >= 0)() ? `directory-picker-v2-suggestion-${activeSuggestion()}` : void 0;
              },
              onKeyDown: handleInputKey
            }), _el$2);
            insert(_el$2, createComponent(ButtonV2, {
              size: "small",
              variant: "ghost",
              onClick: () => void navigate(home()),
              children: "~"
            }), null);
            insert(_el$2, createComponent(ButtonV2, {
              size: "small",
              variant: "ghost",
              onClick: () => void navigate(pickerRoot(root()) || root()),
              get children() {
                return language.t("dialog.directory.root");
              }
            }), null);
            insert(_el$2, createComponent(ButtonV2, {
              size: "small",
              variant: "ghost",
              onClick: () => void navigate(pickerParent(root())),
              get children() {
                return language.t("dialog.directory.parent");
              }
            }), null);
            insert(_el$, createComponent(Show, {
              get when() {
                return memo(() => !!suggestionsOpen())() && currentSuggestions().length > 0;
              },
              get children() {
                var _el$3 = _tmpl$();
                insert(_el$3, createComponent(For, {
                  get each() {
                    return currentSuggestions();
                  },
                  children: (suggestion, index) => (() => {
                    var _el$8 = _tmpl$6();
                    _el$8.$$click = () => chooseSuggestion(suggestion);
                    _el$8.$$pointermove = () => setActiveSuggestion(index());
                    insert(_el$8, () => displayPickerPath(suggestion.absolute, input(), home()), null);
                    insert(_el$8, () => suggestion.type === "directory" ? "/" : "", null);
                    createRenderEffect((_p$) => {
                      var _v$ = `directory-picker-v2-suggestion-${index()}`, _v$2 = index() === activeSuggestion(), _v$3 = index() === activeSuggestion() ? "" : void 0;
                      _v$ !== _p$.e && setAttribute(_el$8, "id", _p$.e = _v$);
                      _v$2 !== _p$.t && setAttribute(_el$8, "aria-selected", _p$.t = _v$2);
                      _v$3 !== _p$.a && setAttribute(_el$8, "data-active", _p$.a = _v$3);
                      return _p$;
                    }, {
                      e: void 0,
                      t: void 0,
                      a: void 0
                    });
                    return _el$8;
                  })()
                }));
                return _el$3;
              }
            }), null);
            return _el$;
          })(), (() => {
            var _el$4 = _tmpl$4();
            _el$4.addEventListener("wheel", (event) => {
              const scroller = tree?.getFileTreeContainer()?.shadowRoot?.querySelector("[data-file-tree-virtualized-scroll]");
              if (!scroller) return;
              const next = nextTreeScrollTop(scroller.scrollTop, event.deltaY, scroller.scrollHeight, scroller.clientHeight);
              if (next === scroller.scrollTop) return;
              event.preventDefault();
              scroller.scrollTop = next;
              scroller.dispatchEvent(new Event("scroll"));
            });
            var _ref$2 = container;
            typeof _ref$2 === "function" ? use(_ref$2, _el$4) : container = _el$4;
            insert(_el$4, createComponent(Show, {
              get when() {
                return loading();
              },
              get children() {
                var _el$5 = _tmpl$3();
                insert(_el$5, () => language.t("common.loading"));
                return _el$5;
              }
            }), null);
            insert(_el$4, createComponent(Show, {
              get when() {
                return memo(() => !!!loading())() && error();
              },
              get children() {
                var _el$6 = _tmpl$3();
                insert(_el$6, () => language.t("dialog.directory.readError"));
                return _el$6;
              }
            }), null);
            return _el$4;
          })(), (() => {
            var _el$7 = _tmpl$5();
            insert(_el$7, () => policy.result(root(), selected(), rootValid()));
            return _el$7;
          })()];
        }
      }), createComponent(DialogFooter, {
        get children() {
          return [createComponent(ButtonV2, {
            variant: "neutral",
            onClick: () => dialog.close(),
            get children() {
              return language.t("common.cancel");
            }
          }), createComponent(ButtonV2, {
            variant: "contrast",
            get disabled() {
              return !policy.result(root(), selected(), rootValid());
            },
            onClick: resolve,
            get children() {
              return action[policy.action];
            }
          })];
        }
      })];
    }
  });
}
delegateEvents(["pointermove", "click"]);
export {
  DialogSelectDirectoryV2
};
//# sourceMappingURL=dialog-select-directory-v2-B_2U4bQ-.js.map
