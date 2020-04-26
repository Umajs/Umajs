import * as fs from 'fs';
import * as path from 'path';

/**
 * 新建目录
 * @param dir 目录绝对地址
 */
export function mkdir(...pathSegments: string[]) {
    const fullPath: string = path.resolve(...pathSegments);

    if (fs.existsSync(fullPath)) {
        return fullPath;
    }

    fs.mkdirSync(fullPath);

    return fullPath;
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

/**
 * Synchronously copies src to dest. By default, dest is overwritten if it already exists.
 * @param src — A path to the source file.
 * @param dest — A path to the destination file.
 */
export async function cp(src: string, dest: string, options: {
    callback?: (dest: string) => void,
    flags?: number,
} = {}) {
    if (!fs.existsSync(src)) {
        return console.log(`Source file is not exists. "${src}"`);
    }

    if (fs.statSync(src).isFile()) {
        fs.copyFileSync(src, dest);

        if (options.callback) {
            await Promise.resolve(options.callback(dest));
        }

        return;
    }

    fs.mkdirSync(dest);

    const files: string[] = fs.readdirSync(src);

    if (files && files.length > 0) {
        for (const file of files) {
            await cp(path.resolve(src, file), path.resolve(dest, file), options);
        }
    }
}

export function reRender(dest: string, params: { [key: string]: string }) {
    const content = fs.readFileSync(dest, 'UTF-8');

    fs.writeFileSync(dest, content.replace(/<%=(.*)%>/g, (str, name) => params[name]), 'UTF-8');
}
