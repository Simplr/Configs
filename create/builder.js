const fs = require('fs');
const ncp = require('ncp').ncp;
const { exec } = require('child_process');

const prettierNpmRegistry = '@simplr-wc/prettier-config';
const eslintNpmRegistry = '@simplr-wc/eslint-config';
const routerNpmRegistry = '@simplr-wc/router';

const routerTemplates = './templates/router';

async function build(decisions) {
    const projectDir = decisions.projectName;
    const templateDir = decisions.template.src;

    fs.mkdirSync(decisions.projectName);

    copyTemplate(projectDir, templateDir);
    await npmInit(projectDir);
    await installNecessities(projectDir);
    await installExtras(projectDir, decisions);
    await installRouting(projectDir, decisions);
    await rewriteFunctionNames(projectDir, decisions);
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
    const packageJSONPath = `./${projectDir}/package.json`;
    const packageJSON = require(packageJSONPath);
    delete packageJSON.scripts['test'];
    packageJSON.scripts['start'] = 'wds --node-resolve --watch --open';

    fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 4));
}

async function installExtras(projectDir, decisions) {
    if (decisions.prettier) {
        console.log('🔨  Installing prettier...');
        await runComm(`cd ${projectDir} && npm install -D ${prettierNpmRegistry}`);
    }
    if (decisions.eslint) {
        console.log('🔨  Installing eslint...');
        await runComm(`cd ${projectDir} && npm install -D ${eslintNpmRegistry}`);
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
    fs.copyFileSync(`${routerTemplates}/index.html`, `${projectDir}/index.html`);
}

async function rewriteFunctionNames(projectDir, decisions) {
    console.log('🔨  Rewriting template names...');
    const projName = decisions.projectName;
    const projectNamePascalCase = kebabToPascal(projName);
    const projectNameKebabCase = pascalToKebab(projName);

    // Figure out something better
    await runComm(`sed -i 's/template-component/${projectNameKebabCase}/g' ${projectDir}/*.html`);
    await runComm(`sed -i 's/TemplateComponent/${projectNamePascalCase}/g' ${projectDir}/*.html`);
    await runComm(`sed -i 's/template-component/${projectNameKebabCase}/g' ${projectDir}/*.json`);
    await runComm(`sed -i 's/TemplateComponent/${projectNamePascalCase}/g' ${projectDir}/*.json`);
    await runComm(`sed -i 's/TemplateComponent/${projectNamePascalCase}/g' ${projectDir}/src/*.js`);
    await runComm(`sed -i 's/template-component/${projectNameKebabCase}/g' ${projectDir}/src/*.js`);

    fs.renameSync(`${projectDir}/src/template-component.js`, `${projectDir}/src/${projectNameKebabCase}.js`);
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
