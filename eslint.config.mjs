import nextVitals from "eslint-config-next/core-web-vitals";

const strippedPlugins = new WeakMap();

const stripPluginConfigs = (plugin) => {
  if (!plugin || typeof plugin !== "object" || !("configs" in plugin)) {
    return plugin;
  }

  if (strippedPlugins.has(plugin)) {
    return strippedPlugins.get(plugin);
  }

  const { configs, ...serializablePlugin } = plugin;
  strippedPlugins.set(plugin, serializablePlugin);
  return serializablePlugin;
};

const makeSerializableConfig = (entry) => {
  if (!entry.plugins) {
    return entry;
  }

  return {
    ...entry,
    plugins: Object.fromEntries(
      Object.entries(entry.plugins).map(([name, plugin]) => [
        name,
        stripPluginConfigs(plugin),
      ]),
    ),
  };
};

const config = [
  {
    ignores: [
      ".next/**",
      ".netlify/**",
      ".open-next/**",
      ".wrangler/**",
      "node_modules/**",
      "out/**",
      "dist/**",
      "coverage/**",
      "opencode_app/**",
      "graphify-out/**",
      "DESIGN_AUDIT/**",
    ],
  },
  ...nextVitals.map(makeSerializableConfig),
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
];

export default config;
