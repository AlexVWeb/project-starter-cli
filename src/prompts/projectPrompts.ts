import {checkbox, input, select} from '@inquirer/prompts';
import {projectTypeEnum} from '../enums/projectType';
import {Answers} from '../interfaces/Answers';
import {ToolsInterface} from "../services/checkConfig";

// Fonction utilitaire pour sélectionner un framework frontend
async function selectFrontendFramework(bundler: string): Promise<string> {
    const commonChoices = [
        {name: 'React', value: 'react'},
        {name: 'Vue.js', value: 'vue'},
        {name: 'Svelte', value: 'svelte'},
    ];

    const viteChoices = [
        ...commonChoices,
        {name: 'Vanilla', value: 'vanilla'},
        {name: 'Preact', value: 'preact'},
        {name: 'Lit', value: 'lit'},
        {name: 'Solid', value: 'solid'},
        {name: 'Qwik', value: 'qwik'},
    ];

    const otherChoices = [
        ...commonChoices,
        {name: 'Angular', value: 'angular', disabled: 'Coming soon'},
    ];

    const choices = bundler === 'vite' ? viteChoices : otherChoices;

    return select({
        message: 'Which frontend framework would you like to use?',
        choices,
    });
}

// Fonction utilitaire pour sélectionner un bundler
async function selectBundler(): Promise<string> {
    return select({
        message: 'Which bundler would you like to use?',
        choices: [
            {name: 'Vite', value: 'vite'},
            {name: 'Webpack', value: 'webpack'},
            {name: 'Parcel', value: 'parcel'},
        ],
    });
}

export async function askProjectQuestions(listTools: ToolsInterface[]): Promise<Answers> {
    const nameProject = await input({
        message: 'What is the name of your project?',
        validate: (input) => {
            if (input.length === 0) {
                return 'Please enter a project name';
            }
            return true;
        },
    });

    const projectType = await select({
        message: 'What type of project do you want to create?',
        choices: [
            {name: 'Frontend', value: projectTypeEnum.frontend},
            {name: 'Backend', value: projectTypeEnum.backend},
            {name: 'Fullstack', value: projectTypeEnum.fullstack},
        ],
    });

    let frontendFramework: string | undefined;
    let backendFramework: string | undefined;
    let bundler: string | undefined;
    let compilerOptions: string[] | undefined;

    if (projectType === projectTypeEnum.frontend || projectType === projectTypeEnum.fullstack) {
        bundler = await selectBundler();
        frontendFramework = await selectFrontendFramework(bundler);

        if (bundler === 'vite') {
            compilerOptions = await checkbox({
                message: 'Select compiler options',
                choices: [
                    {name: 'TypeScript', value: 'ts'},
                ],
            });
        }
    }

    if (projectType === projectTypeEnum.backend || projectType === projectTypeEnum.fullstack) {
        backendFramework = await select({
            message: 'Which backend framework would you like to use?',
            choices: [
                {name: 'Express', value: 'express'},
                {name: 'NestJS', value: 'nest', disabled: 'Coming soon'},
                {name: 'Koa', value: 'koa', disabled: 'Coming soon'},
                {name: 'Fastify', value: 'fastify', disabled: 'Coming soon'},
            ],
        });
    }

    const packageManager = await select({
        message: 'Select a package manager',
        choices: [
            {
                name: 'npm',
                value: 'npm',
                description: 'npm is the most popular package manager',
                disabled: listTools.find(tool => tool.name === 'npm' && !tool.installed) ? 'is not installed' : false,
            },
            {
                name: 'yarn',
                value: 'yarn',
                description: 'yarn is an awesome package manager',
                disabled: listTools.find(tool => tool.name === 'yarn' && !tool.installed) ? 'is not installed' : false,
            },
            {
                name: 'pnpm',
                value: 'pnpm',
                description: 'pnpm is a fast, disk space efficient package manager',
                disabled: listTools.find(tool => tool.name === 'pnpm' && !tool.installed) ? 'is not installed' : false
            }
        ],
    });

    return {
        nameProject,
        projectType,
        frontendFramework,
        backendFramework,
        bundler,
        packageManager,
        compilerOptions,
    };
}
