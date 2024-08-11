import fs from 'fs-extra';
import path from 'path';

export function generateBackend(answers: any) {
    const projectPath = path.join(process.cwd(), 'backend');
    fs.ensureDirSync(projectPath);

    // Copie des templates en fonction du framework
    const frameworkTemplatePath = path.join(__dirname, `../templates/${answers.backendFramework}`);
    fs.copySync(frameworkTemplatePath, projectPath);

    console.log(`Backend project structure generated at ${projectPath}`);
}
