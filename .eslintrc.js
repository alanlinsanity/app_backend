/* eslint-env node, amd */
const path = require("path");

const extendsPath = path.resolve(__dirname, "../../../..", ".eslintrc.yml");

const defaultConfig = {
  extends: ["eslint:recommended", "prettier"],
  env: {
    es2022: true,
  },
  parserOptions: { ecmaVersion: "latest" },
};

const myConfig = {
  extends: [extendsPath],
  env: {
    es2022: true,
    node: true,
    amd: true,
  },
  rules: {},
};

const config = extendsPath ? defaultConfig : myConfig;

module.exports = config;
