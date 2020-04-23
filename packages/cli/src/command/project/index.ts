import * as fs from 'fs';
import * as path from 'path';
import * as inquirer from 'inquirer';
import * as MetalSmith from 'MetalSmith';

import { download } from '../../api';
import { render } from '../../utils/ejs';
import { waitFnloading } from '../../utils/utils';
import { readDesc } from '../../utils/writeReadFile';
import { DOWNLOAD_DIR } from '../../const/constants';
import packageConfig from '../../const/packageConfig';

export default async (...props: string[]) => {
    const [projectName] = props;

    const targetDir = path.resolve(process.cwd(), projectName);

    if (fs.existsSync(targetDir)) return console.log(`\nPROJECT ["${projectName}"] is exists, please check your project name.\n`);

    await waitFnloading(download, 'loading template')();

    const templateDesc = readDesc();

    const { templaeName } = await inquirer.prompt({
        name: 'templaeName',
        type: 'list',
        message: 'please choise a template to create project',
        choices: Object.keys(templateDesc).map((key) => ({ name: `${key},${templateDesc[key]}`, value: key })),
    });

    await new Promise((resolve, reject) => {
        MetalSmith(__dirname) // 传入路径 他默认会遍历当前路径下的src文件夹
            .source(path.resolve(DOWNLOAD_DIR, templaeName))
            .destination(path.resolve(projectName))
            .use(async (files: MetalSmith.Files, metal: MetalSmith, callback: MetalSmith.Callback) => {
                const obj = await inquirer.prompt(packageConfig); // 弹出消息
                const meta = metal.metadata();

                Object.assign(meta, obj);
                callback(null, files, metal);
            })
            .use((files: object, metal: MetalSmith, callback: MetalSmith.Callback) => {
                const obj: any = metal.metadata();

                Reflect.ownKeys(files).forEach(async (file: string) => {
                    // 这个是要处理的  <%
                    if (file.includes('js') || file.includes('json')) {
                        let content = files[file].contents.toString(); // 文件的内容

                        if (content.includes('<%')) {
                            content = await render(content, obj);
                            files[file].contents = Buffer.from(content); // 渲染
                        }
                    }
                });

                // 根据用户的输入 下载模板
                callback(null, files, null);
            })
            .build((err: Error) => {
                if (err) return reject(err);

                resolve();
            });
    });

    console.log(`Project ["${projectName}"] initialization completed, please run

        cd ${projectName}

        npm install

        npm start

    `);

    process.exit();
};
