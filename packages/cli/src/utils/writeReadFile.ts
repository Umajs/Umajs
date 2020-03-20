import * as fs from 'fs';

/**
 * 写入文件
 * @param path  用户下载路径
 * @param params  版本号
 */
export const writeJson = async (path: fs.PathLike, params: string) => {
    if (!fs.existsSync(path)) return false;
    fs.readFile(`${path}/desc.json`, (err, data) => {
        if (err) return console.log(err);
        let jsonData:any = data.toString();

        jsonData = JSON.parse(jsonData);
        const result = Reflect.set(jsonData, 'commit_sha', params);
        const str = JSON.stringify(result);

        fs.writeFile(`${path}/desc.json`, str, (error) => {
            if (error) return console.error(error);
        });
    });
};

/**
 * 读文件
 */

export const readJson = (path: fs.PathLike) => {
    if (!fs.existsSync(path)) return { commit_sha: '' };
    const resData = fs.readFileSync(`${path}/desc.json`, 'utf8');

    return JSON.parse(resData);
};
