const build = require('./builder.js').default;

let decisions = {};
const prompts = require('prompts');

const EXTRA_PRETTIER = 0;
const EXTRA_ESLINT = 1;

const templateTypes = [
    {
        value: 0,
        title: 'Lit Element template',
        src: './templates/lit-element/',
    },
    {
        value: 1,
        title: 'HTML Element template',
        src: './templates/html-element/',
    },
    { value: 2, title: 'React template', src: './templates/react/' },
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
];

function welcome() {
    console.clear();
    console.log(`🏗️  Welcome to the Simplr Quick Start 🏗️`);
}

async function queryTemplate() {
    console.log('');
    const response = await prompts({
        type: 'select',
        name: 'value',
        message: '  Which template would you like to use? 📋 ',
        choices: templateTypes,
    });

    decisions.template = templateTypes[response.value];
}

async function queryExtras() {
    console.log('');
    const response = await prompts({
        type: 'multiselect',
        name: 'value',
        message: '  What extras would you like? 📦  ',
        hint: '- Space to select. Return to submit',
        choices: extras,
    });
    decisions.prettier = response.value.includes(EXTRA_PRETTIER);
    decisions.eslint = response.value.includes(EXTRA_ESLINT);
}

async function queryRouting() {
    console.log('');
    const response = await prompts({
        type: 'confirm',
        name: 'value',
        message: 'Use routing? (simplr-router) (y/n) 🚀 ',
        initial: true,
    });
    decisions.routing = response.value;
}

async function queryProjectName() {
    console.log('');
    const response = await prompts({
        type: 'text',
        name: 'value',
        message: "What's the name of the project?",
    });
    if (!response.value) {
        throw Error('A name is required');
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

create();
