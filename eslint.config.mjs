import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.js", "scripts/**/*.js"],
    languageOptions: { sourceType: "commonjs" },
  },
  {
    ignores: ["node_modules/**", "www/libs/**"], // Ignora diretórios globalmente
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        $: true, // jQuery
      }
    }
  },
  pluginJs.configs.recommended,
];
