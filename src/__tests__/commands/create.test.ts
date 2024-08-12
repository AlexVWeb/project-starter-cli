import { askProjectQuestions } from '../../prompts/projectPrompts';
import { generateFrontend } from '../../generators/frontend';
import { generateBackend } from '../../generators/backend';
import { listTools } from '../../services/listTools';
import { projectTypeEnum } from '../../enums/projectType';
import chalk from 'chalk';
import {createProject} from "../../commands/create";

// Mocking des dépendances
jest.mock('../../prompts/projectPrompts');
jest.mock('../../generators/frontend');
jest.mock('../../generators/backend');
jest.mock('../../services/listTools');

describe('createProject', () => {
    const mockToolsList = [
        { name: 'npm', installed: true, version: '6.14.8' },
        { name: 'yarn', installed: false },
        { name: 'pnpm', installed: true, version: '6.9.0' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (listTools as jest.Mock).mockReturnValue(mockToolsList);
    });

    test('should create a frontend project', async () => {
        const mockAnswers = {
            projectType: projectTypeEnum.frontend,
            frontendFramework: 'react',
            bundler: 'vite',
            packageManager: 'npm',
            nameProject: 'frontend-project',
            compilerOptions: ['ts'],
        };
        (askProjectQuestions as jest.Mock).mockResolvedValue(mockAnswers);

        await createProject();

        expect(askProjectQuestions).toHaveBeenCalledWith(mockToolsList);
        expect(generateFrontend).toHaveBeenCalledWith(mockAnswers, mockToolsList);
        expect(generateBackend).not.toHaveBeenCalled();
    });

    test('should create a backend project', async () => {
        const mockAnswers = {
            projectType: projectTypeEnum.backend,
            backendFramework: 'express',
            nameProject: 'backend-project',
        };
        (askProjectQuestions as jest.Mock).mockResolvedValue(mockAnswers);

        await createProject();

        expect(askProjectQuestions).toHaveBeenCalledWith(mockToolsList);
        expect(generateBackend).toHaveBeenCalledWith(mockAnswers);
        expect(generateFrontend).not.toHaveBeenCalled();
    });

    test('should create a fullstack project', async () => {
        const mockAnswers = {
            projectType: projectTypeEnum.fullstack,
            frontendFramework: 'react',
            backendFramework: 'express',
            bundler: 'vite',
            packageManager: 'npm',
            nameProject: 'fullstack-project',
            compilerOptions: ['ts'],
        };
        (askProjectQuestions as jest.Mock).mockResolvedValue(mockAnswers);

        await createProject();

        expect(askProjectQuestions).toHaveBeenCalledWith(mockToolsList);
        expect(generateFrontend).toHaveBeenCalledWith(mockAnswers, mockToolsList);
        expect(generateBackend).toHaveBeenCalledWith(mockAnswers);
    });

    test('should log the selected options and tools used', async () => {
        const mockAnswers = {
            projectType: projectTypeEnum.fullstack,
            frontendFramework: 'react',
            backendFramework: 'express',
            bundler: 'vite',
            packageManager: 'npm',
            nameProject: 'fullstack-project',
            compilerOptions: ['ts'],
        };
        (askProjectQuestions as jest.Mock).mockResolvedValue(mockAnswers);

        const logSpy = jest.spyOn(console, 'log');

        await createProject();

        expect(logSpy).toHaveBeenCalledWith(chalk.green('Project configuration complete.'));
        expect(logSpy).toHaveBeenCalledWith(chalk.yellow('Selected options:'));
        expect(logSpy).toHaveBeenCalledWith(chalk.cyan(JSON.stringify(mockAnswers, null, 2)));
    });
});
