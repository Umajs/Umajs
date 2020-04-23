import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

/**
 * 新建目录
 * @param dir 目录绝对地址
 */
export function mkdir(dir: string) {
    const fullPath: string = path.resolve(process.cwd(), dir);

    if (fs.existsSync(fullPath)) {
        return true;
    }

    return fs.mkdirSync(fullPath);
}

/**
 * 删除目录
 * @param dir 目录绝对地址
 */
export function rm(dir: string) {
    if (!fs.existsSync(dir)) {
        return true;
    }

    if (fs.statSync(dir).isFile()) {
        return fs.unlinkSync(dir);
    }

    const files: string[] = fs.readdirSync(dir);

    if (files && files.length > 0) {
        files.forEach((file) => {
            const filePath = path.resolve(dir, file);

            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            } else {
                rm(path.resolve(dir, file));
            }
        });
    }

    return fs.rmdirSync(dir);
}
