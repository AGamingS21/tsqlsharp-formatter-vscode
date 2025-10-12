
'use strict';

import * as vscode from 'vscode';
import ServiceDownloadProvider, * as downlaodProvider from './ServiceDownloadProvider';
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
	var pkg;
	var url = '';
	var installPath = context.globalStorageUri.fsPath + con.installPath;
	var cliPath = '';
	var zipFile = url;
	if (platform === 'win32' && arch === 'x64') {
		url = con.linkwindows;
		zipFile = installPath + '/tsqlsharp-formatter-windows-x64.tar.gz';
		cliPath = installPath + con.cliWindows;
	}
	else if (platform === 'linux' && arch === 'x64') {
		url = con.linklinux;
		zipFile = installPath + '/tsqlsharp-formatter-linux-x64.tar.gz';
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
		
		await dwnloadProv.downloadFile(url, installPath);
		let pkg: IPackage = {
			installPath: installPath,
			url: url,
			tmpFileName: zipFile,
			isZipFile: false
		};
		await dwnloadProv.decompress(pkg);
		context.globalState.update('cliVersion', latestVersion);
	}
	
	// to do: 
	// push to vscode store or create vsix for me to trial out
	// clean up activate function code and constant code. Also remo

	context.subscriptions.push(
		vscode.languages.registerDocumentFormattingEditProvider(
		'sql',
		new SqlFormattingProvider(),
		)
	);
	

  


}

// This method is called when your extension is deactivated
export function deactivate() {}
