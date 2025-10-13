
'use strict';

import * as vscode from 'vscode';
import ServiceDownloadProvider, * as downloadProvider from './serviceDownloadProvider';
import SqlFormattingProvider, * as sqlFormattingProvider from './SqlFormattingProvider';
import * as con from './constants';
import * as fs from 'fs';
import { IPackage } from './interfaces';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {


	// determine the version required to be installed	
	const os = require('os'); 
	const platform = os.platform();
	const arch = os.arch();
	var url = '';
	var installPath = context.globalStorageUri.fsPath + con.installPath;
	var cliPath = '';
	var zipFile = url;
	var zipFileName = '';
	var isZipFile = false;
	if (platform === 'win32' && arch === 'x64') {
		url = con.linkwindows;
		isZipFile = true;
		zipFileName = con.zipFileNameWindows;
		zipFile = installPath + con.zipFileNameWindows;
		cliPath = installPath + con.cliWindows;
	}
	else if (platform === 'linux' && arch === 'x64') {
		url = con.linklinux;
		isZipFile = false;
		zipFileName = con.zipFileNameLinux;
		zipFile = installPath + con.zipFileNameLinux;
		cliPath = installPath + con.cliLinux;
	}
	else{
		console.log(`ERROR: the platform ${platform} or architecture ${arch} is not valid. Currenlty windows and linux x64 are supported.`);
	}
	var dwnloadProv = new ServiceDownloadProvider();
	var currentCliVersion = await context.globalState.get('cliVersion');
	
	var latestVersion = await dwnloadProv.getLatestVersion(con.linklatestrelease);
	
	var cliExists = fs.existsSync(cliPath);
	if(currentCliVersion === undefined || latestVersion !== currentCliVersion || !cliExists)
	{
		
		await dwnloadProv.downloadFile(url, installPath, zipFileName);
		let pkg: IPackage = {
			installPath: installPath,
			url: url,
			tmpFileName: zipFile,
			isZipFile: isZipFile
		};
		await dwnloadProv.decompress(pkg);
		context.globalState.update('cliVersion', latestVersion);
	}
	
	// to do: 
	// update cli to be a json input instead of string. This may resolve issues of windows not accepting it??.
	// Better logging on what the output is from the results. output keeps disappearing?? Seems to only happen on windows version??
	// clean up activate function code and constant code. Also remove external references
	// make an ilogger
	// once working on linux and windows push to vscode store and setup pipeline.

	const logChannel = vscode.window.createOutputChannel("tsqlsharp-formatter", { log: true });
	
	

	context.subscriptions.push(
		vscode.languages.registerDocumentFormattingEditProvider(
		'sql',
		new SqlFormattingProvider(cliPath, logChannel),
		)
	);
	

  


}

// This method is called when your extension is deactivated
export function deactivate() {}
