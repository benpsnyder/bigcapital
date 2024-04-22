const { FlatCompat } = require("@eslint/eslintrc");
const nxEslintPlugin = require("@nx/eslint-plugin");
const js = require("@eslint/js");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

module.exports = [
    { plugins: { "@nx": nxEslintPlugin } },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.js",
            "**/*.jsx"
        ],
        rules: { "@nx/enforce-module-boundaries": [
                "error",
                {
                    allow: [],
                    depConstraints: [{
                            onlyDependOnLibsWithTags: ["*"],
                            sourceTag: "*"
                        }],
                    enforceBuildableLibDependency: true
                }
            ] }
    },
    ...compat.config({ extends: ["plugin:@nx/typescript"] }).map(config => ({
        ...config,
        files: [
            "**/*.ts",
            "**/*.tsx"
        ],
        rules: {
            "@typescript-eslint/no-explicit-any": 0,
            "max-len": 0
        },
        languageSettings: { parserOptions: { project: "./tsconfig.*?.json" } }
    })),
    ...compat.config({ extends: ["plugin:@nx/javascript"] }).map(config => ({
        ...config,
        files: [
            "**/*.js",
            "**/*.jsx"
        ],
        rules: {}
    }))
];
