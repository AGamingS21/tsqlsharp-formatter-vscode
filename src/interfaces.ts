import * as tmp from "tmp";

export interface IPackage {
    url: string;
    installPath: string;
    tmpFileName?: string;
    // tmpFile: tmp.SynchrounousResult;
    isZipFile: boolean;
}