import * as fs from 'fs';
import * as path from 'path';

/**
 * 加载目录
 * @param dirPath 文件夹地址
 * @param loadFn 加载方法
 * @param ignoreDirs 忽略的文件夹
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
            // 仅加载 .ts, .js, .json 文件，忽略 .d.ts 和其他文件
            const ext = path.extname(file);
            if (['.ts', '.js', '.json'].includes(ext) && !file.endsWith('.d.ts')) {
                loadFn(filePath);
            }
        }
    }
}
