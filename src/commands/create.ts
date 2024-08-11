import {askProjectQuestions} from '../prompts/projectPrompts';
import {generateFrontend} from '../generators/frontend';
import {generateBackend} from '../generators/backend';
import {projectTypeEnum} from '../enums/projectType';
import chalk from 'chalk';
import {listTools} from "../services/listTools";  // Assurez-vous que le chemin est correct

export async function createProject() {
    console.log(chalk.blue('Starting project creation process...'));
    const toolsList = listTools();

    const answers = await askProjectQuestions(toolsList);
    console.log(chalk.green('Project configuration complete.'));
    console.log(chalk.yellow('Selected options:'));
    console.log(chalk.cyan(JSON.stringify(answers, null, 2)));

    if (answers.projectType === projectTypeEnum.frontend) {
        await generateFrontend(answers, toolsList);
    } else if (answers.projectType === projectTypeEnum.backend) {
        console.log(chalk.blue('Generating backend...'));
        generateBackend(answers);
        console.log(chalk.green('Backend generation complete.'));
    } else if (answers.projectType === projectTypeEnum.fullstack) {
        console.log(chalk.blue('Generating frontend...'));
        await generateFrontend(answers, toolsList);
        console.log(chalk.green('Frontend generation complete.'));

        console.log(chalk.blue('Generating backend...'));
        generateBackend(answers);
        console.log(chalk.green('Backend generation complete.'));
    }

    console.log(chalk.magenta('All components generated successfully!'));
}
