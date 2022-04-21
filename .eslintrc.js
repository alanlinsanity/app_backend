/* eslint-env node, amd */
const eslintrcPath = process.env.ESLINTRC_PATH ?? undefined;

const defaultConfig = {
  extends: ["eslint:recommended", "prettier"],
  env: {
    es2022: true,
  },
  parserOptions: { ecmaVersion: "latest" },
};

const myConfig = {
  extends: [eslintrcPath],
  env: {
    es2022: true,
    node: true,
    amd: true,
  },
  rules: {
    "unicorn/prefer-module": "off",
  },
};

const config = eslintrcPath ? myConfig : defaultConfig;

module.exports = config;
