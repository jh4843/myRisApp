module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "eslint-config-prettier",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/typescript",
    "@vue/prettier/@typescript-eslint",
  ],
  parserOptions: {
    project: [
      "./tsconfig.json",
      "./tsconfig.eslint.json",
    ],
    sourceType: "module",
    tsconfigRootDir: __dirname,
    ecmaVersion: 2020,
  },

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

    "prettier/prettier": ["warn", {
      endOfLine: 'auto',
    }],
    //"@typescript-eslint/noImplicitAny": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-empty-interface": "off",
  },
};
