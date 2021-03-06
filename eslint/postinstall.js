const fs = require("fs");

const eslintConfig = {
  extends: ["@simplr-wc/eslint-config"],
};

const packageJSONPath =
  require.main.paths[0].split("node_modules")[0] + "package.json";
const packageJSON = require(packageJSONPath);
packageJSON.eslintConfig = eslintConfig;

fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 4));
