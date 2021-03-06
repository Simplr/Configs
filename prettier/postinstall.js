const fs = require('fs');

const packageJSONPath = require.main.paths[0].split('node_modules')[0] + 'package.json';
const packageJSON = require(packageJSONPath);
packageJSON.prettier = '@simplr-wc/prettier-config';

fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 4));
