import { ConfigChecker, ToolsInterface } from '../../services/checkConfig';
import { execSync } from 'child_process';

// Mock `execSync`
jest.mock('child_process', () => ({
    execSync: jest.fn(),
}));

describe('ConfigChecker', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return correct tool info when tool is installed', () => {
        (execSync as jest.Mock).mockReturnValueOnce('6.14.8');

        const checker = new ConfigChecker(['npm']);
        const result = checker.check();

        const expected: ToolsInterface = {
            name: 'npm',
            installed: true,
            version: '6.14.8',
        };

        expect(result).toEqual([expected]);
        expect(execSync).toHaveBeenCalledWith('npm --version', { stdio: 'pipe' });
    });

    test('should return error info when tool is not installed', () => {
        const errorMessage = 'command not found: npm';
        (execSync as jest.Mock).mockImplementationOnce(() => {
            throw new Error(errorMessage);
        });

        const checker = new ConfigChecker(['npm']);
        const result = checker.check();

        const expected: ToolsInterface = {
            name: 'npm',
            installed: false,
            error: errorMessage,
        };

        expect(result).toEqual([expected]);
        expect(execSync).toHaveBeenCalledWith('npm --version', { stdio: 'pipe' });
    });

    test('should check multiple tools and return correct status', () => {
        (execSync as jest.Mock)
            .mockReturnValueOnce('6.14.8')  // npm
            .mockImplementationOnce(() => {
                throw new Error('command not found: yarn');
            })  // yarn
            .mockReturnValueOnce('6.9.0');  // pnpm

        const checker = new ConfigChecker(['npm', 'yarn', 'pnpm']);
        const result = checker.check();

        const expected: ToolsInterface[] = [
            { name: 'npm', installed: true, version: '6.14.8' },
            { name: 'yarn', installed: false, error: 'command not found: yarn' },
            { name: 'pnpm', installed: true, version: '6.9.0' },
        ];

        expect(result).toEqual(expected);
    });
});
