import {packageManager} from "../enums/tools";
import {ConfigChecker, ToolsInterface} from "./checkConfig";

export function listTools(): ToolsInterface[] {
    const toolsToCheck = [packageManager.NPM, packageManager.YARN, packageManager.PNPM];
    const configChecker = new ConfigChecker(toolsToCheck);

    return configChecker.check();
}
