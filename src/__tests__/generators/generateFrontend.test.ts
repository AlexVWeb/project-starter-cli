import { generateFrontend } from '../../generators/frontend';
import { exec } from 'child_process';
import { generateProjectName } from '../../generators/projectName';
import { ToolsInterface } from "../../services/checkConfig";
import { Answers } from '../../interfaces/Answers';
import chalk from 'chalk';

jest.mock('child_process', () => ({
    exec: jest.fn(),
}));

jest.mock('../../generators/projectName', () => ({
    generateProjectName: jest.fn(),
}));

describe('generateFrontend', () => {
    const mockAnswers: Answers = {
        nameProject: 'my-project',
        projectType: 'frontend',
        frontendFramework: 'react',
        backendFramework: undefined,
        bundler: 'vite',
        packageManager: 'npm',
        compilerOptions: ['ts'],
    };

    const mockToolsList: ToolsInterface[] = [
        { name: 'npm', installed: true, version: '6.14.8' },
        { name: 'yarn', installed: false },
        { name: 'pnpm', installed: true, version: '6.9.0' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (generateProjectName as jest.Mock).mockReturnValue({
            projectPath: '/path/to/my-project',
            projectName: 'my-project',
        });
    });

/*
    test('should create a frontend project with Vite', async () => {
        (exec as unknown as jest.Mock).mockImplementation((command, callback) => {
            callback(null, 'Project created successfully');
        });

        await generateFrontend(mockAnswers, mockToolsList);

        expect(generateProjectName).toHaveBeenCalledWith(mockAnswers);
        expect(exec).toHaveBeenCalledWith(
            'npm create vite@latest my-project -- --template react-ts',
            expect.any(Function)
        );
        expect(console.log).toHaveBeenCalledWith(chalk.green('Frontend project created successfully at /path/to/my-project'));
    });
*/

    test('should fail if package manager is not installed', async () => {
        const mockAnswersWithMissingPM: Answers = {
            ...mockAnswers,
            packageManager: 'yarn',
        };

        const logSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('process.exit'); });

        await expect(generateFrontend(mockAnswersWithMissingPM, mockToolsList)).rejects.toThrow('process.exit');

        expect(logSpy).toHaveBeenCalledWith(chalk.red('yarn is not installed'));
        expect(exitSpy).toHaveBeenCalledWith(1);
        expect(exec).not.toHaveBeenCalled();
    });

    test('should handle exec errors gracefully', async () => {
        (exec as unknown as jest.Mock).mockImplementation((command, callback) => {
            callback(new Error('Something went wrong'), '');
        });

        const logSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('process.exit'); });

        await expect(generateFrontend(mockAnswers, mockToolsList)).rejects.toThrow('process.exit');

        expect(logSpy).toHaveBeenCalledWith(new Error('Something went wrong'));
        expect(exitSpy).toHaveBeenCalledWith(1);
    });
});
