import * as fs from 'fs';

export const delPath = (path: string) => {
    if (!fs.existsSync(path)) {
        return false;
    }

    const info = fs.statSync(path);

    if (info.isDirectory()) {
        const data = fs.readdirSync(path);

        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                delPath(`${path}/${data[i]}`);
                // 删了目录里的内容就删掉这个目录
                if (i === data.length - 1) {
                    delPath(`${path}`);
                }
            }
        } else {
            fs.rmdirSync(path);// 删除空目录
        }
    } else if (info.isFile()) {
        fs.unlinkSync(path);// 删除文件
    }
};
