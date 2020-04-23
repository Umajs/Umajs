import * as fs from 'fs';
import * as path from 'path';
import * as inquirer from 'inquirer';

import { download } from '../../api';
import { waitFnloading, actionHelp } from '../../utils/utils';
import { readDesc } from '../../utils/writeReadFile';
import { DOWNLOAD_DIR } from '../../const/constants';
import packageConfig from '../../const/packageConfig';
import { cp, reRender } from '../../utils/file';

export default async (...props: string[]) => {
    const [projectName] = props;

    if (!projectName) return actionHelp(projectName);

    const targetDir = path.resolve(process.cwd(), projectName);

    if (fs.existsSync(targetDir)) return console.log(`\nPROJECT ["${projectName}"] is exists, please check your project name.\n`);

    // 下载模板
    await waitFnloading(download, 'loading template')();

    const templateDesc = readDesc();

    const { templaeName } = await inquirer.prompt({
        name: 'templaeName',
        type: 'list',
        message: 'please choise a template to create project',
        choices: Object.keys(templateDesc).map((key) => ({ name: `${key},${templateDesc[key]}`, value: key })),
    });

    const projectConfig: { [key: string]: string } = await inquirer.prompt(packageConfig); // 弹出消息

    cp(path.resolve(DOWNLOAD_DIR, templaeName), path.resolve(projectName), {
        callback: (dest) => reRender(dest, projectConfig),
    });

    console.log(`Project ["${projectName}"] initialization completed, please run

        cd ${projectName}
        npm install
        npm start

    `);

    process.exit();
};
