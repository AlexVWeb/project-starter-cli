import {execa} from 'execa';

export async function installDependencies(packageManager: string, dependencies: string[]) {
    console.log(`Installing dependencies using ${packageManager}...`);

    try {
        await execa(packageManager, ['install', ...dependencies], { stdio: 'inherit' });
        console.log('Dependencies installed successfully.');
    } catch (error) {
        console.error('Failed to install dependencies:', error);
    }
}
