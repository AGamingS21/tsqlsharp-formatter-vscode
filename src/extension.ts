
'use strict';

import * as vscode from 'vscode';
import ServiceDownloadProvider, * as downlaodProvider from './ServiceDownloadProvider';
import SqlFormattingProvider, * as sqlFormattingProvider from './SqlFormattingProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "tsqlsharp" is now active!');
	const os = require('os'); 

	const link = "https://github.com/AGamingS21/tsqlsharp-formatter-cli/releases/download/0.0.2/tsqlsharp-formatter-0.0.2-linux-amd64.tar.gz";
	const installPath = context.globalStorageUri.fsPath + '/tsqlsharp';
	const zipFile = installPath + '/tsqlsharp-formatter-0.0.2-linux-amd64.tar.gz';
	const cliPath = installPath + '/tsqlsharp-formatter';
	// var test1 = new ServiceDownloadProvider();
	// var testing = await test1.downloadFile(link, installPath);
	// var t = await test1.decompressTar(zipFile, installPath);

	// var sql = new SqlFormattingProvider();
	// await sql.Test(cliPath);
	
	context.subscriptions.push(
		vscode.languages.registerDocumentFormattingEditProvider(
		'sql',
		new SqlFormattingProvider(),
		)
	);
	

  


}

// This method is called when your extension is deactivated
export function deactivate() {}
