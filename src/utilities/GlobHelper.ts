// import * as glob from "glob";
import glob from "glob";
import path from "path";

export function pathResolver(file: string): string {
    return path.resolve(file).normalize()
}

export class GlobHelper {
    static files(pattern: string, resolvedPath?: boolean): Promise<string[]> {
        return new Promise((resolve, reject) => {
            glob(pattern, (err: Error | null, matches: string[]) => {
                if (err) return reject(err);
                if (resolvedPath) return resolve(matches.map(pathResolver));

                resolve(matches);
            });
        })
    }
}