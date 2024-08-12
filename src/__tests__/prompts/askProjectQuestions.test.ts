import { askProjectQuestions } from '../../prompts/projectPrompts';
import { projectTypeEnum } from '../../enums/projectType';
import { ToolsInterface } from "../../services/checkConfig";
import { input, select, checkbox } from '@inquirer/prompts';

jest.mock('@inquirer/prompts', () => ({
    input: jest.fn(),
    select: jest.fn(),
    checkbox: jest.fn(),
}));

describe('askProjectQuestions', () => {
    const mockToolsList: ToolsInterface[] = [
        { name: 'npm', installed: true, version: '6.14.8' },
        { name: 'yarn', installed: false },
        { name: 'pnpm', installed: true, version: '6.9.0' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should correctly gather frontend project information with Vite as bundler', async () => {
        (input as jest.Mock).mockResolvedValueOnce('my-project');
        (select as jest.Mock)
            .mockResolvedValueOnce(projectTypeEnum.frontend)  // Project type
            .mockResolvedValueOnce('vite')  // Bundler
            .mockResolvedValueOnce('react');  // Frontend framework
        (checkbox as jest.Mock).mockResolvedValueOnce(['ts']);  // Compiler options
        (select as jest.Mock).mockResolvedValueOnce('npm');  // Package manager

        const answers = await askProjectQuestions(mockToolsList);

        expect(answers).toEqual({
            nameProject: 'my-project',
            projectType: projectTypeEnum.frontend,
            frontendFramework: 'react',
            backendFramework: undefined,
            bundler: 'vite',
            packageManager: 'npm',
            compilerOptions: ['ts'],
        });

        expect(input).toHaveBeenCalledWith({
            message: 'What is the name of your project?',
            validate: expect.any(Function),
        });

        expect(select).toHaveBeenNthCalledWith(1, {
            message: 'What type of project do you want to create?',
            choices: expect.any(Array),
        });

        expect(select).toHaveBeenNthCalledWith(2, {
            message: 'Which bundler would you like to use?',
            choices: expect.any(Array),
        });

        expect(select).toHaveBeenNthCalledWith(3, {
            message: 'Which frontend framework would you like to use?',
            choices: expect.any(Array),
        });

        expect(checkbox).toHaveBeenCalledWith({
            message: 'Select compiler options',
            choices: expect.any(Array),
        });
    });

    test('should correctly gather fullstack project information with npm as package manager', async () => {
        (input as jest.Mock).mockResolvedValueOnce('fullstack-project');
        (select as jest.Mock)
            .mockResolvedValueOnce(projectTypeEnum.fullstack)  // Project type
            .mockResolvedValueOnce('webpack')  // Bundler
            .mockResolvedValueOnce('vue')  // Frontend framework
            .mockResolvedValueOnce('express')  // Backend framework
            .mockResolvedValueOnce('npm');  // Package manager

        const answers = await askProjectQuestions(mockToolsList);

        expect(answers).toEqual({
            nameProject: 'fullstack-project',
            projectType: projectTypeEnum.fullstack,
            frontendFramework: 'vue',
            backendFramework: 'express',
            bundler: 'webpack',
            packageManager: 'npm',
            compilerOptions: undefined,
        });

        expect(select).toHaveBeenNthCalledWith(4, {
            message: 'Which backend framework would you like to use?',
            choices: expect.any(Array),
        });

        expect(select).toHaveBeenNthCalledWith(5, {
            message: 'Select a package manager',
            choices: expect.any(Array),
        });
    });

    test('should disable package managers that are not installed', async () => {
        (input as jest.Mock).mockResolvedValueOnce('disabled-package-manager');
        (select as jest.Mock).mockResolvedValueOnce(projectTypeEnum.frontend)  // Project type
            .mockResolvedValueOnce('vite')  // Bundler
            .mockResolvedValueOnce('react')  // Frontend framework
            .mockResolvedValueOnce('npm');  // Package manager

        const answers = await askProjectQuestions(mockToolsList);

        const selectMock = select as jest.Mock;
        const packageManagerChoices = selectMock.mock.calls[3][0].choices;

        expect(packageManagerChoices.find((choice: any) => choice.name === 'yarn').disabled).toBe('is not installed');
        expect(packageManagerChoices.find((choice: any) => choice.name === 'npm').disabled).toBeFalsy();
        expect(packageManagerChoices.find((choice: any) => choice.name === 'pnpm').disabled).toBeFalsy();
    });
});
