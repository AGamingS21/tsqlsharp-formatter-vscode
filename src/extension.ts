
'use strict';

import * as vscode from 'vscode';
import * as fileProvider from './FileProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "tsqlsharp" is now active!');
	const os = require('os'); 

	const test = os.platform() === 'win32';
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('tsqlsharp.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from tsqlsharp-formatter!');
	});

	var files = new fileProvider.FileProvider();

	var content = files.formatWithCliTool('select * from #test');

	 // 👍 formatter implemented using API
    // vscode.languages.registerDocumentFormattingEditProvider('sql', {
    //     provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
    //         const firstLine = document.lineAt(0);
    //         if (firstLine.text !== '42') {
    //             return [vscode.TextEdit.insert(firstLine.range.start, '42\n')];
    //         }
    //     }
    // });

		context.subscriptions.push(disposable);

}

// This method is called when your extension is deactivated
export function deactivate() {}
