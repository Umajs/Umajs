import * as fs from 'fs';
import * as path from 'path';

/**
 * 加载目录
 * @param dirPath 文件夹地址
 * @param checkFn 加载方法
 */
export default function loadDir(dirPath: string, loadFn: (filePath: string) => void, ignoreDirs: string[] = []) {
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.resolve(dirPath, file);

        if (fs.statSync(filePath).isDirectory()) {
            if (ignoreDirs.indexOf(file) === -1) {
                loadDir(filePath, loadFn);
            }
        } else {
            loadFn(filePath);
        }
    }
}
