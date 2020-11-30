const fs = require('fs');
const path = require('path');
const ncp = require('ncp').ncp;
const { exec } = require('child_process');
const getProjectDirectory = require('./helper.js').getProjectDirectory;
const ROOT_DIR = getProjectDirectory();

const prettierNpmRegistry = '@simplr-wc/prettier-config';
const eslintNpmRegistry = '@simplr-wc/eslint-config';
const routerNpmRegistry = '@simplr-wc/router';

const routerTemplates = ROOT_DIR + '/templates/router';
const rollupTemplates = ROOT_DIR + '/templates/rollup';

const rollupDeps = [
    'rimraf',
    '@rollup/plugin-node-resolve',
    'rollup-plugin-copy',
    'rollup-plugin-filesize',
    'rollup-plugin-minify-html-literals',
    'rollup-plugin-terser',
];

function getPackageJson(projectDir) {
    const packageJSONPath = process.cwd() + `/${projectDir}/package.json`;
    const packageJSON = require(packageJSONPath);
    return packageJSON;
}

function getPackageJsonPath(projectDir) {
    return process.cwd() + `/${projectDir}/package.json`;
}

function writePackageJson(packageJSONPath, packageJSON) {
    fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 4));
}

async function build(decisions) {
    const projectDir = decisions.projectName;
    const templateDir = decisions.template.src;

    fs.mkdirSync(decisions.projectName);

    copyTemplate(projectDir, templateDir);
    await npmInit(projectDir);
    await installNecessities(projectDir);
    await installExtras(projectDir, decisions);
    await installRouting(projectDir, decisions);
    await installOthers(projectDir, decisions);
    await rewriteFunctionNames(projectDir, decisions);
    await rewritePackageJson(projectDir, decisions);
    console.log(`

    ✅ All done!

    ➡️  cd ${projectDir} 
    💻 npm start

    To run your freshly created project!
`);
}

function copyTemplate(projectDir, templateDir) {
    console.log('');
    console.log('🔨  Copying template...');
    ncp(templateDir, projectDir, err => {
        if (err) {
            return console.error(err);
        }
    });
}

async function npmInit(projectDir) {
    console.log('🔨  Initializing npm project...');
    await runComm(`cd ${projectDir} && npm init -y`);
}

async function installNecessities(projectDir) {
    console.log('🔨  Installing Web Dev Server...');
    await runComm(`cd ${projectDir} && npm install -D @web/dev-server`);
}

async function installExtras(projectDir, decisions) {
    const projName = decisions.projectName;
    const projectNameKebabCase = pascalToKebab(projName);
    if (decisions.prettier) {
        console.log('🔨  Installing prettier...');
        await runComm(`cd ${projectDir} && npm install -D ${prettierNpmRegistry}`);
    }
    if (decisions.eslint) {
        console.log('🔨  Installing eslint...');
        await runComm(`cd ${projectDir} && npm install -D ${eslintNpmRegistry}`);
    }
    if (decisions.rollup) {
        console.log('🔨  Installing rollup...');
        await runComm(`cd ${projectDir} && npm install -D rollup`);
        for (const dep of rollupDeps) {
            await runComm(`cd ${projectDir} && npm install -D ${dep}`);
        }
        fs.copyFileSync(`${rollupTemplates}/rollup.config.js`, `${projectDir}/rollup.config.js`);

        const pathToFile = projectDir + path.sep + 'rollup.config.js';
        if (decisions.routing) {
            replaceStringInFile('template-component', 'router', pathToFile);
        } else {
            replaceStringInFile('template-component', projectNameKebabCase, pathToFile);
        }
    }
}

async function installRouting(projectDir, decisions) {
    if (!decisions.routing) {
        return;
    }
    console.log('🔨  Installing Simplr Router...');
    await runComm(`cd ${projectDir} && npm install ${routerNpmRegistry}`);
    fs.copyFileSync(`${routerTemplates}/router.js`, `${projectDir}/src/router.js`);
    fs.copyFileSync(`${routerTemplates}/routes.js`, `${projectDir}/src/routes.js`);
    fs.copyFileSync(`${routerTemplates}/info-view.js`, `${projectDir}/src/info-view.js`);
    fs.copyFileSync(`${routerTemplates}/index.html`, `${projectDir}/index.html`);
}

async function rewriteFunctionNames(projectDir, decisions) {
    console.log('🔨  Rewriting template names...');
    const projName = decisions.projectName;
    const projectNamePascalCase = kebabToPascal(projName);
    const projectNameKebabCase = pascalToKebab(projName);

    const files = fs.readdirSync(projectDir);
    files.forEach(file => {
        const pathToFile = projectDir + path.sep + file;
        const isDir = fs.lstatSync(pathToFile).isDirectory();
        if (!isDir) {
            replaceStringInFile('template-component', projectNameKebabCase, pathToFile);
            replaceStringInFile('TemplateComponent', projectNamePascalCase, pathToFile);
        }
    });

    const sourcePath = projectDir + path.sep + 'src';
    const sourceFiles = fs.readdirSync(sourcePath);

    sourceFiles.forEach(file => {
        const pathToFile = sourcePath + path.sep + file;
        const isDir = fs.lstatSync(pathToFile).isDirectory();
        if (!isDir) {
            replaceStringInFile('template-component', projectNameKebabCase, pathToFile);
            replaceStringInFile('TemplateComponent', projectNamePascalCase, pathToFile);
        }
    });

    fs.renameSync(`${projectDir}/src/template-component.js`, `${projectDir}/src/${projectNameKebabCase}.js`);
}

async function replaceStringInFile(from, to, file) {
    let fileAsString = fs.readFileSync(file, 'utf-8');
    fileAsString = fileAsString.replace(new RegExp(from, 'g'), to);
    fs.writeFileSync(file, fileAsString, 'utf8');
}

async function installOthers(projectDir, decisions) {
    if (!decisions.template.installs) return;
    for (let inst of decisions.template.installs) {
        console.log(`🔨  Installing ${inst}...`);
        await runComm(`cd ${projectDir} && npm install ${inst}`);
    }
}

async function rewritePackageJson(projectDir, decisions) {
    const packageJSONPath = getPackageJsonPath(projectDir);
    const packageJSON = getPackageJson(projectDir);
    delete packageJSON.scripts['test'];

    packageJSON.scripts['start'] = 'wds --node-resolve --watch --open';

    if (decisions.rollup) {
        packageJSON.scripts['build'] = 'rimraf dist && rollup -c rollup.config.js';
    }
    writePackageJson(packageJSONPath, packageJSON);
}

function kebabToPascal(nameString) {
    if (!nameString.includes('-')) return nameString;
    const parts = nameString.split('-');
    let pascalString = '';
    for (let i = 0; i < parts.length; i++) {
        pascalString += parts[i].substring(0, 1).toUpperCase() + parts[i].substring(1).toLowerCase();
    }
    return pascalString;
}

function pascalToKebab(nameString) {
    if (nameString.includes('-')) return nameString;
    const parts = nameString.split('');
    let kebabString = '';
    for (part of parts) {
        if (part === part.toUpperCase()) {
            kebabString += kebabString.length > 0 ? `-${part.toLowerCase()}` : part.toLowerCase();
        } else {
            kebabString += part;
        }
    }
    return kebabString;
}

function runComm(command) {
    console.log(`Running command: ${command}`);
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            if (stdout.length > 0) {
                console.log(stdout);
            }
            resolve();
        });
    });
}

module.exports.default = build;
