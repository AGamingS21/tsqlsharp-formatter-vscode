import * as vscode from 'vscode';
import  FileProvider, * as fileProvider from './FileProvider';
import * as path from 'path';
import * as fs from 'fs';



export default class SqlFormattingProvider implements vscode.DocumentFormattingEditProvider 
{
  private cliPath: string;
  constructor(private cliPathString: string) {
        this.cliPath = cliPathString;        
    }
    public async Test(text: string) : Promise<string> {
     
        var fileProvider = new FileProvider();

	    var output =  await fileProvider.formatWithCliTool(text, this.cliPath);

        var parsed = JSON.parse(output);
        return parsed.Output;
    }



  async provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    formattingOptions: vscode.FormattingOptions,
  ): Promise<vscode.TextEdit[]> {
    try {
      return [
        vscode.TextEdit.replace(
          this.fullDocumentRange(document),
          await this.formatText(this.getAllText(document), document.uri),
        ),
      ];
    } catch (e) {
      vscode.window.showErrorMessage('Unable to format SQL:\n' + e);
      return [];
    }
  }

  private getAllText(document: vscode.TextDocument) {
    // extract all lines from document
    return [...new Array(document.lineCount)].map((_, i) => document.lineAt(i).text).join('\n');
  }

  private fullDocumentRange(document: vscode.TextDocument): vscode.Range {
    return new vscode.Range(
      document.positionAt(0),
      document.lineAt(document.lineCount - 1).range.end,
    );
  }

  private async formatText(text: string, uri: vscode.Uri): Promise<string> {
    // const extensionSettings = vscode.workspace.getConfiguration('SQL-Formatter-VSCode', uri);
    var output = this.Test(text);
    return output;
  }
}
