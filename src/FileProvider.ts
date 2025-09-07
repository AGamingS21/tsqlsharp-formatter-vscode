
import { spawn } from 'child_process';
import { promisify } from 'util';
import * as vscode from 'vscode';




export class FileProvider {

    formatWithCliTool(content: string): string {
        var output = '';
        try {
            var child =  spawn('/home/$USER/.local/bin/tsqlsharp-formatter', ['text ', '--input ', content], {
            });
            child.stdout.on('data',
            function (data) {
                console.log('ls command output: ' + data);
                output = data;
            });
            child.stderr.on('data', function (data) {
            //throw errors
            console.log('stderr: ' + data);
            });
        }

        catch (error) {
            // vscode.window.showErrorMessage('Formatting failed: ' + error.message);
            console.log(error);
            output = 'error';
        }
        // this will need to return the content
        return output;
    }

   
}
