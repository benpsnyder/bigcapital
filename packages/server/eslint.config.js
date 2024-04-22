const { FlatCompat } = require("@eslint/eslintrc");
const baseConfig = require("../../eslint.config.js");
const eslintPluginImport = require("eslint-plugin-import");
const typescriptEslintParser = require("@typescript-eslint/parser");
const globals = require("globals");
const js = require("@eslint/js");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

module.exports = [
    ...baseConfig,
    ...compat.extends("airbnb-base", "airbnb-typescript"),
    { plugins: { "import": eslintPluginImport } },
    {
        settings: {
            "import/parsers": { "@typescript-eslint/parser": [
                    ".ts",
                    ".tsx"
                ] },
            "import/resolver": { typescript: {
                    alwaysTryTypes: true,
                    project: "tsconfig.json"
                } }
        },
        languageOptions: {
            parser: typescriptEslintParser,
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: "module",
                project: "tsconfig.json",
                tsconfigRootDir: "./"
            },
            globals: { ...globals.browser, ...globals.es6, Atomics: "readonly", SharedArrayBuffer: "readonly" }
        }
    },
    { rules: {
            "import/no-unresolved": "error",
            "import/prefer-default-export": "off"
        } }
];
