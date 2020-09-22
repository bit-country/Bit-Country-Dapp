/* global require module */
const { override, fixBabelImports, addLessLoader, useEslintRc } = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: { "@primary-color": "#40e0d0" },
    },
  }),
  useEslintRc(),
);
