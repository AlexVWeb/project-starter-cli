import {execSync} from 'child_process';

export interface ToolsInterface {
    name: string;
    installed: boolean;
    version?: string;
    error?: string;
}

export class ConfigChecker {
    private tools: string[];

    constructor(tools: string[]) {
        this.tools = tools;
    }

    public check(): ToolsInterface[] {
        return this.tools.map(tool => this.checkTool(tool));
    }

    private checkTool(tool: string): ToolsInterface {
        try {
            const versionCommand = `${tool} --version`;
            const version = execSync(versionCommand, {stdio: 'pipe'}).toString().trim();
            return {name: tool, installed: true, version};
        } catch (error) {
            return {name: tool, installed: false, error: (error as Error).message};
        }
    }
}

