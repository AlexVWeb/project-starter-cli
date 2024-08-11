import {Answers} from '../interfaces/Answers';
import {generateProjectName} from "./projectName";
import {exec} from "child_process";
import {ToolsInterface} from "../services/checkConfig";
import chalk from "chalk";

export async function generateFrontend(answers: Answers, toolsList: ToolsInterface[]) {
    const {projectPath, projectName} = generateProjectName(answers);

    switch (answers.bundler) {
        case 'vite':
            console.log(chalk.yellow('Checking for required tools...'));
            if (!toolsList.find(tool => tool.name === answers.packageManager && tool.installed)) {
                console.error(chalk.red(`${answers.packageManager} is not installed`));
                process.exit(1);
            }
            console.log(chalk.green('Tools check complete.'));
            console.log(chalk.yellow('Creating frontend project...'));
            const commandsToRun = [
                `${answers.packageManager} create vite@latest ${projectName} -- --template ${answers.frontendFramework}${answers.compilerOptions?.includes('ts') ? '-ts': ''}`,
            ]
            for (const command of commandsToRun) {
                exec(command, (err, stdout) => {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    console.log(stdout);
                });
            }
            break;
        default:
            console.error('Bundler not supported');
            process.exit(1);
    }
    console.log(chalk.green('Frontend project created successfully at ' + projectPath));
}
