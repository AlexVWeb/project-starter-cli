import path from "path";
import fs from "fs-extra";
import {Answers} from "../interfaces/Answers";
import * as os from "node:os";

export function generateProjectName(answers: Answers): { projectPath: string, projectName: string } {
    let projectName = answers.nameProject;
    projectName = projectName.replace(/\s+/g, '-').toLowerCase();

    if (!projectName) {
        console.error('Project name is required');
        process.exit(1);
    }
    let projectPath = path.resolve(process.cwd(), answers.nameProject);
    const homeDir = os.homedir();
    projectPath = projectPath.replace(homeDir, '~');


    if (fs.existsSync(projectPath)) {
        console.error('Project already exists');
        process.exit(1);
    }

    // fs.ensureDirSync(projectPath);

    console.log(`Project structure generated at ${projectPath}`);
    return {
        projectPath,
        projectName
    };
}