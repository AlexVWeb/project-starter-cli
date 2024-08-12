import { listTools } from '../../services/listTools';
import { packageManager } from '../../enums/tools';
import { execSync } from 'child_process';

// Mock `execSync`
jest.mock('child_process', () => ({
    execSync: jest.fn(),
}));

describe('listTools', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should correctly list all tools with their status', () => {
        (execSync as jest.Mock)
            .mockReturnValueOnce('6.14.8')  // npm
            .mockImplementationOnce(() => {
                throw new Error('command not found: yarn');
            })  // yarn
            .mockReturnValueOnce('6.9.0');  // pnpm

        const result = listTools();

        const expected = [
            { name: packageManager.NPM, installed: true, version: '6.14.8' },
            { name: packageManager.YARN, installed: false, error: 'command not found: yarn' },
            { name: packageManager.PNPM, installed: true, version: '6.9.0' },
        ];

        expect(result).toEqual(expected);
    });
});
