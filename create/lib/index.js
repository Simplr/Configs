const build = require('./builder.js').default;
const getProjectDirectory = require('./helper.js').getProjectDirectory;
const ROOT_DIR = getProjectDirectory();

let decisions = {};
const prompts = require('prompts');

const EXTRA_PRETTIER = 0;
const EXTRA_ESLINT = 1;
const EXTRA_ROLLUP = 2;

const templateTypes = [
    {
        value: 0,
        title: 'Lit Element template',
        src: `${ROOT_DIR}/templates/lit-element/`,
        installs: ['lit-element'],
    },
    {
        value: 1,
        title: 'HTML Element template',
        src: `${ROOT_DIR}/templates/html-element/`,
    },
    { value: 2, title: 'React template', src: `${ROOT_DIR}/templates/react/` },
];

const extras = [
    {
        value: EXTRA_PRETTIER,
        title: 'Prettier',
    },
    {
        value: EXTRA_ESLINT,
        title: 'ESLint',
    },
    {
        value: EXTRA_ROLLUP,
        title: 'Rollup',
    },
];

function welcome() {
    console.clear();
    console.log(`
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@ @@@@@@@@@         @@@@@@
@@@@   @@@@@@@             @@@@   🏗️  Welcome to the Simplr Quick Start 🏗️
@@     @@@@@@@               @@
@       @@@@@@@               @
@         @@@@@@@             @   Simplr Quick Start is a perfect way to start a
@           @@@@@@@@          @   Web Components Project.
@              @@@@@@@        @
@@              @@@@@@@      @@   You can cancel this quick start operation by 
@@@             @@@@@@@@    @@@   pressing Ctrl+C.
@@@@@          @@@@@@@@   @@@@@
@@@@@@@@    @@@@@@@@@   @@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    `);
}

async function queryTemplate() {
    console.log('');
    const response = await prompts(
        {
            type: 'select',
            name: 'value',
            message: '  Which template would you like to use? 📋 ',
            choices: templateTypes,
        },
        { onCancel },
    );

    decisions.template = templateTypes[response.value];
}

async function queryExtras() {
    console.log('');
    const response = await prompts(
        {
            type: 'multiselect',
            name: 'value',
            message: '  What extras would you like? 📦  ',
            hint: '- Space to select. Return to submit',
            choices: extras,
        },
        { onCancel },
    );
    decisions.prettier = response.value.includes(EXTRA_PRETTIER);
    decisions.eslint = response.value.includes(EXTRA_ESLINT);
    decisions.rollup = response.value.includes(EXTRA_ROLLUP);
}

async function queryRouting() {
    console.log('');
    const response = await prompts(
        {
            type: 'confirm',
            name: 'value',
            message: '  Use routing? (simplr-router) (y/n) 🚀 ',
            initial: true,
        },
        { onCancel },
    );
    decisions.routing = response.value;
}

async function queryProjectName() {
    console.log('');
    const response = await prompts(
        {
            type: 'text',
            name: 'value',
            message: "  What's the name of the project?",
        },
        { onCancel },
    );
    if (!response.value || !response.value.includes('-')) {
        console.error('You must supply a name for the project and it must include a dash. e.g. my-project');
        exitWith(0);
    }
    decisions.projectName = response.value;
}

async function create() {
    welcome();
    await queryTemplate();
    await queryExtras();
    await queryRouting();
    await queryProjectName();
    await build(decisions);
}

function onCancel() {
    exitWith(0);
}

function exitWith(code) {
    console.log(`
    Exiting...
`);
    process.exit(code);
}

create();
