import { exec } from 'child_process';
import { stdout, stderr } from 'node:process';

export function executeCommand(command: string, cwd?: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const process = exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${command}`);
                console.error(`stderr: ${stderr}`);
                reject(error);
                return;
            }
            console.log(stdout);
            resolve();
        });

        // Propagation des sorties de processus vers la console
        process.stdout?.pipe(stdout);
        process.stderr?.pipe(stderr);
    });
}