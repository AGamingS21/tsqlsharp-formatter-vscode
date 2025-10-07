import * as vscode from 'vscode';
import * as fs from 'fs';
import * as DecompressTar from "tar";
import * as yauzl from "yauzl";
import * as path from "path";
import fetch from 'node-fetch';
import extract from 'extract-zip';
import { Console } from 'console';
export default class ServiceDownloadProvider {


    
    async  downloadFile(url: string, dest: string): Promise<void> {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to download: ${res.statusText}`);
        
        if(await fs.existsSync(dest))
        {
            await fs.rmSync(dest, { recursive: true, force: true });
            await fs.mkdirSync(dest, { recursive: true }); // recursive: true creates nested directories if needed
        }
        else
        {
            await fs.mkdirSync(dest, { recursive: true }); // recursive: true creates nested directories if needed
        }

        const fileStream = await fs.createWriteStream(dest + '/tsqlsharp-formatter-0.0.2-linux-amd64.tar.gz');
        
        console.log(fileStream.path);

        return await new Promise((resolve, reject) => {
            res.body.pipe(fileStream);
            res.body.on("error", reject);
            fileStream.on("finish", resolve);
        });
    }

        public async decompressTar(tmpFileName: string, installPath: string): Promise<void> {
        let totalFiles = 0;
        console.log(installPath);
        return await DecompressTar.extract(
            {
                file: tmpFileName,
                cwd: installPath,
                onentry: () => {
                    totalFiles++;
                },
                onwarn: (warn) => {
                    console.log(`[ERROR] ${warn}`);
                },
            },
            () => {
                console.log(`Done! ${totalFiles} files unpacked.\n`);
            },
        );
    }

    // public decompress(tmpFileName: string, installPath: string): Promise<void> {
    //     if (pkg.isZipFile) {
    //         return decompressZip(pkg, logger);
    //     } else {
    //         return this.decompressTar(pkg, logger);
    //     }
    // }


}