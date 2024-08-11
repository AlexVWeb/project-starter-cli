#!/usr/bin/env node

import { Command } from 'commander';
import {createProject} from "../src/commands/create";
// import { installPackages } from '../src/commands/install';

const program = new Command();

program
    .version('1.0.0')
    .description('A robust CLI for creating, configuring, and deploying projects');

// Commande pour créer un nouveau projet
program
    .command('create')
    .description('Create a new project')
    .action(async () => {
        await createProject();
        // console.log('createProject');
    });

// Commande pour installer des packages manquants ou additionnels
program
    .command('install')
    .description('Install packages required for the project')
    .action(() => {
        // installPackages();
        console.log('installPackages');
    });

program.parse(process.argv);
