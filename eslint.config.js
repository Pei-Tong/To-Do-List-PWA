import globals from "globals";
import pluginJs from "@eslint/js";
import js from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  {
  rules: {
    "no-unused-vars": "warn",
    "no-undef": "warn"
  },
  files: ["*.js"]
  },
];
