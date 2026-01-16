import * as fs from 'fs';
import * as path from 'path';

/**
 * Load directory
 * @param dirPath folder path
 * @param loadFn load method
 * @param ignoreDirs ignored folders
 */
export default function loadDir(dirPath: string, loadFn: (filePath: string) => void, ignoreDirs: string[] = []) {
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.resolve(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                loadDir(filePath, loadFn, ignoreDirs);
            }
        } else if (stat.isFile()) {
            // Only load .ts, .js, .json files, ignore .d.ts and other files
            const ext = path.extname(file);

            if (['.ts', '.js', '.json'].includes(ext) && !file.endsWith('.d.ts')) {
                loadFn(filePath);
            }
        }
    }
}
