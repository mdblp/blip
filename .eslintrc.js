/** @typedef {import("eslint").Linter.Config } Options */
/** @typedef {import("eslint").Linter.ConfigOverride } ConfigOverride */

const path = require("path");

/** @type {ConfigOverride} */
const eslintTSConfig = {
  globals: {
    globalThis: true,
    AppConfig: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.resolve(__dirname, "packages/yourloops/test", "tsconfig.json"),
  },
  plugins: ["@typescript-eslint", "moment-utc", "react", "react-hooks"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "eslint:recommended",
    "plugin:react/recommended",
  ],

  files: ["**/*.{ts,tsx}"],
  rules: {
    "quotes": ["error", "double", { avoidEscape: true }],
    "quote-props": ["error", "consistent-as-needed"],
    "jsx-quotes": ["error", "prefer-double"],
    "import/no-duplicates": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/require-await": "error",
    "brace-style": ["error", "1tbs", { allowSingleLine: true }],
    "complexity": "error",
    "comma-dangle": ["warn", "always-multiline"],
    "consistent-return": "error",
    "default-param-last": "error",
    "func-names": ["error", "as-needed"],
    "guard-for-in": "warn",
    "no-bitwise": ["error", { int32Hint: true }],
    "no-restricted-globals": ["error", { name: "isNaN", message: "Use Number.isNaN instead" }, "NaN", "parseFloat", "parseInt"],
    "no-else-return": "error",
    "keyword-spacing": [
      "error",
      {
        before: true,
        after: true,
        overrides: {
          function: {
            before: true,
            after: false,
          },
        },
      },
    ],
    "linebreak-style": ["error", "unix"],
    "eol-last": ["error", "always"],
    "max-lines": ["error", { max: 1000, skipComments: true, skipBlankLines: true }],
    "no-implied-eval": "error",
    "no-eq-null": "error",
    "no-fallthrough": ["warn", { commentPattern: ".*[Ff]allthrough.*" }],
    "no-loop-func": "error",
    "no-lonely-if": "error",
    "no-magic-numbers": ["warn", { ignore: [-1, 0, 1, 2, 3, 4, 5, 10, 100, 500, 1000] }],
    "no-multi-spaces": "error",
    "no-return-assign": "error",
    "no-return-await": "error",
    "no-trailing-spaces": "error",
    "no-undef": "off",
    "no-underscore-dangle": ["error", { allow: ["_jipt", "_paq"] }],
    "no-use-before-define": "off",
    "object-curly-spacing": ["error", "always"],
    "prefer-promise-reject-errors": "error",
    "radix": "warn",
    "space-before-blocks": ["error", "always"],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "never",
        asyncArrow: "always",
      },
    ],
    "indent": ["error", 2, { SwitchCase: 0 }],
    "semi": "error",
    "lodash/preferred-alias": "error",
    "lodash/prefer-constant": "off",
    "lodash/prefer-is-nil": "off",
    "lodash/prefer-lodash-typecheck": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
  },
};

/** @type {Options} */
const eslintConfig = {
  root: true,
  overrides: [ eslintTSConfig ],
  parser: "@babel/eslint-parser",
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: false,
    requireConfigFile: true,
    babelOptions: {
      configFile: `${__dirname}/babel.config.json`,
    },
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    mocha: true,
  },
  globals: {
    process: false,
    require: false,
    define: false,
    console: false,
  },
  ignorePatterns: ["**/dist/*", "**/node_modules/*", "templates/lambda-request-viewer.js"],
  rules: {
    "quotes": ["error", "double", { avoidEscape: true, allowTemplateLiterals: false }],
    "quote-props": ["error", "consistent-as-needed"],
    "jsx-quotes": ["error", "prefer-double"],
    "linebreak-style": ["error", "unix"],
    "eol-last": ["error", "always"],
    "camelcase": ["error", { allow: ["UNSAFE_componentWillReceiveProps", "UNSAFE_componentWillMount"] }],
    "eqeqeq": "error",
    "import/no-duplicates": "error",
    "indent": ["error", 2, { SwitchCase: 0 }],
    "wrap-iife": [1, "inside"],
    "new-cap": "error",
    "no-bitwise": "warn",
    "no-caller": 2,
    "no-case-declarations": 1,
    "no-dupe-keys": 1,
    "no-dupe-else-if": 1,
    "no-empty": 1,
    "no-extra-boolean-cast": 1,
    "no-extra-semi": "error",
    "no-inner-declarations": 1,
    "no-mixed-requires": 1,
    "no-multi-spaces": 1,
    "no-redeclare": 1,
    "no-self-assign": 1,
    "no-trailing-spaces": "error",
    "no-undef": "error",
    "no-use-before-define": [1, "nofunc"],
    "no-unused-vars": "error",
    "no-unreachable": "error",
    "no-useless-escape": "error",
    "no-restricted-globals": ["error", { name: "isNaN", message: "Use Number.isNaN instead" }, "NaN", "parseFloat", "parseInt"],
    "no-else-return": "warn",
    "no-lonely-if": "warn",
    "semi": "error",
    "jsx-a11y/alt-text": 1,
    "jsx-a11y/click-events-have-key-events": 1,
    "jsx-a11y/anchor-is-valid": 1,
    "jsx-a11y/iframe-has-title": 1,
    "jsx-a11y/no-noninteractive-element-interactions": 1,
    "jsx-a11y/no-onchange": 1,
    "jsx-a11y/no-static-element-interactions": 1,
    "jsx-a11y/mouse-events-have-key-events": 1,
    "jsx-a11y/img-redundant-alt": 1,
    "lodash/collection-method-value": 1,
    "lodash/collection-return": 1,
    "lodash/import-scope": 0,
    "lodash/matches-prop-shorthand": 1,
    "lodash/matches-shorthand": 1,
    "lodash/path-style": 1,
    "lodash/prop-shorthand": 1,
    "lodash/prefer-get": 1,
    "lodash/prefer-constant": "off",
    "lodash/prefer-compact": 1,
    "lodash/prefer-filter": 1,
    "lodash/prefer-find": 1,
    "lodash/prefer-flat-map": 1,
    "lodash/prefer-includes": 0,
    "lodash/prefer-immutable-method": 1,
    "lodash/prefer-is-nil": 1,
    "lodash/prefer-lodash-chain": 1,
    "lodash/prefer-lodash-method": 0,
    "lodash/prefer-lodash-typecheck": "off",
    "lodash/prefer-matches": 1,
    "lodash/prefer-map": 1,
    "lodash/prefer-noop": 1,
    "lodash/prefer-reject": 1,
    "lodash/prefer-some": 1,
    "lodash/prefer-times": 1,
    "lodash/prefer-startswith": 1,
    "lodash/preferred-alias": "error",
    "moment-utc/no-moment-without-utc": 1,
    "react/no-children-prop": 1,
    "react/no-unescaped-entities": 1,
    "react/jsx-no-duplicate-props": 1,
    "react/jsx-no-target-blank": 1,
    "react/jsx-uses-react": 2,
    "react/jsx-uses-vars": 2,
    "react/react-in-jsx-scope": 2,
    "react/no-find-dom-node": 1,
    "react/no-is-mounted": 1,
    "react/no-deprecated": 1,
    "react/no-string-refs": 1,
    "react/display-name": 1,
    "react/require-render-return": "warn",
    "react/prop-types": "error",
  },
  plugins: ["react", "jsx-a11y", "moment-utc", "lodash", "import"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/warnings",
    "plugin:lodash/recommended",
  ],
  settings: {
    react: {
      pragma: "React",
      version: "16.13.1",
    },
  },
};


module.exports = eslintConfig;
