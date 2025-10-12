
import { spawn } from 'child_process';
import { promisify } from 'util';
import * as vscode from 'vscode';




export default class FileProvider {

    async formatWithCliTool(content: string, cliPath: string): Promise<string> {
        var output = '';
        console.log(cliPath);
        const child = spawn(cliPath, [`text`, `--input`, `"${content}"`], { shell: true });
        return new Promise((resolve, reject) => {

            let stdout = '';
            let stderr = '';

            // Capture stdout
            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            // Capture stderr
            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            // Error starting the process
            child.on('error', (error) => {
                reject(error);
            });

            // Process exited
            child.on('close', (code) => {
                if (code === 0) {
                    resolve(stdout.trim()); // Return only stdout as string
                } else {
                    reject(new Error(`Command failed with code ${code}: ${stderr.trim()}`));
                }
            });
        });
        
        

    }

   
}
