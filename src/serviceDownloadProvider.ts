import * as fs from 'fs';
import * as DecompressTar from "tar";
import * as yauzl from "yauzl";
import * as path from "path";
import fetch from 'node-fetch';
import { IPackage } from './interfaces';

export default class ServiceDownloadProvider {


    public async getLatestVersion(url: string)
    {

        try {
            const response = await fetch(url);
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);
            return result.tag_name;
        } catch (error) {
            console.log(error);
        }
    }
    public async downloadFile(url: string, dest: string, zipFileName: string): Promise<void> {
        const res = await fetch(url);
        if (!res.ok) {throw new Error(`Failed to download: ${res.statusText}`);}
        
        if(await fs.existsSync(dest))
        {
            await fs.rmSync(dest, { recursive: true, force: true });
            await fs.mkdirSync(dest, { recursive: true }); // recursive: true creates nested directories if needed
        }
        else
        {
            await fs.mkdirSync(dest, { recursive: true }); // recursive: true creates nested directories if needed
        }

        const fileStream = await fs.createWriteStream(dest + zipFileName);
        
        console.log(fileStream.path);

        return await new Promise((resolve, reject) => {
            res.body.pipe(fileStream);
            res.body.on("error", reject);
            fileStream.on("finish", resolve);
        });
    }

    private decompressTar(pkg: IPackage): Promise<void> {
        let totalFiles = 0;
        return DecompressTar.extract(
            {
                file: pkg.tmpFileName,
                cwd: pkg.installPath,
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

    public decompress(pkg: IPackage): Promise<void> {
        if (pkg.isZipFile) {
            return this.decompressZip(pkg);
        } else {
            return this.decompressTar(pkg);
        }
    }

    private decompressZip(pkg: IPackage): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            yauzl.open(pkg.tmpFileName, { lazyEntries: true }, (err, zipfile) => {
                if (err) {
                    console.log(`[ERROR] ${err}`);
                    reject(err);
                    return;
                }

                zipfile.readEntry();

                zipfile.on("entry", (entry) => {
                    if (/\/$/.test(entry.fileName)) {
                        // Directory file names end with '/'
                        const dirPath = path.join(pkg.installPath, entry.fileName);

                        // Create directory
                        fs.mkdir(dirPath, { recursive: true }, (err) => {
                            if (err) {
                                console.log(
                                    `[ERROR] Failed to create directory ${dirPath}: ${err}`,
                                );
                                reject(err);
                                return;
                            }
                            zipfile.readEntry();
                        });
                    } else {
                        // File entry
                        const filePath = path.join(pkg.installPath, entry.fileName);
                        const dirPath = path.dirname(filePath);

                        // Ensure parent directory exists first
                        fs.mkdir(dirPath, { recursive: true }, (err) => {
                            if (err) {
                                console.log(
                                    `[ERROR] Failed to create directory ${dirPath}: ${err}`,
                                );
                                reject(err);
                                return;
                            }

                            // Now extract the file
                            zipfile.openReadStream(entry, (err, readStream) => {
                                if (err) {
                                    console.log(`[ERROR] ${err}`);
                                    reject(err);
                                    return;
                                }

                                const writeStream = fs.createWriteStream(filePath);

                                // Handle write stream errors
                                writeStream.on("error", (err) => {
                                    console.log(
                                        `[ERROR] Failed to write ${filePath}: ${err}`,
                                    );
                                    reject(err);
                                });

                                // Wait for write stream to finish, not just read stream
                                writeStream.on("close", () => {
                                    console.log(`Extracted: ${entry.fileName}`);
                                    zipfile.readEntry();
                                });

                                // Handle read stream errors
                                readStream.on("error", (err) => {
                                    console.log(
                                        `[ERROR] Read error for ${entry.fileName}: ${err}`,
                                    );
                                    reject(err);
                                });

                                readStream.pipe(writeStream);
                            });
                        });
                    }
                });

                zipfile.on("end", () => {
                    console.log(`Done! Files unpacked.\n`);
                    resolve();
                });

                zipfile.on("error", (err) => {
                    console.log(`[ERROR] Zipfile error: ${err}`);
                    reject(err);
                });
            });
        });
    }


}