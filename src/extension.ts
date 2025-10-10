
'use strict';

import * as vscode from 'vscode';
import ServiceDownloadProvider, * as downlaodProvider from './ServiceDownloadProvider';
import SqlFormattingProvider, * as sqlFormattingProvider from './SqlFormattingProvider';
import * as con from './constants';
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
	if (platform === 'win32' && arch === 'x64') {
		url = con.linkwindows;
		
	}
	else if (platform === 'linux' && arch === 'x64') {
		url = con.linklinux;
		
	}
	else{
		console.log(`ERROR: the platform ${platform} or architecture ${arch} is not valid. Currenlty windows and linux x64 are supported.`);
	}
	var dwnloadProv = new ServiceDownloadProvider();
	var currentCliVersion = await context.globalState.get('cliVersion');
	
	var latestVersion = await dwnloadProv.getLatestVersion(con.linklatestrelease);
	
	if(currentCliVersion === undefined || latestVersion !== currentCliVersion)
	{
		
		dwnloadProv.downloadFile(url, installPath);
		let pkg: IPackage = {
			installPath: installPath,
			url: url,
			tmpFile: undefined,
			isZipFile: false
		};
		dwnloadProv.decompress(pkg);
		context.globalState.update('cliVersion', latestVersion);
	}
	


	
	// download cli. 
	// How to make sure that its easy across multiple verions?
	

	
	// var testing = await test1.downloadFile(link, installPath);
	// var t = await test1.decompressTar(zipFile, installPath);
	
	// to do: 
	// push to vscode store or create vsix for me to trial out

	context.subscriptions.push(
		vscode.languages.registerDocumentFormattingEditProvider(
		'sql',
		new SqlFormattingProvider(),
		)
	);
	

  


}

// This method is called when your extension is deactivated
export function deactivate() {}
