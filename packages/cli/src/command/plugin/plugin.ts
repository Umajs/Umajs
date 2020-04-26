import * as fs from 'fs';
import * as path from 'path';
import * as inquirer from 'inquirer';

import { download } from '../../api';
import { actionHelp, waitFnloading } from '../../utils/utils';
import { cp, reRender, mkdir } from '../../utils/file';
import { PLUGIN_PATH, PLUGIN_PROJECT_PATH } from '../../const/constants';
import packageConfig from '../../const/packageConfig';
import pluginConfig from '../../const/pluginConfig';

export default class Plugin {
    static async init(pluginName: string, ...props: string[]) {
        if (!pluginName) return actionHelp('plugin');

        const { type } = await inquirer.prompt({
            name: 'type',
            type: 'list',
            message: 'Please choise a type to create plugin',
            choices: [
                { name: '给当前 Ursa 工程添加插件', value: 'local' },
                { name: '新建插件工程，一般用于发包至仓库', value: 'project' },
            ],
        });

        Plugin[type](pluginName, ...props);
    }

    // 安装插件到工程
    static async install(pluginName: string) {
        // TODO 1.install 2 add plugin.config.ts 3.new pluginName.config.ts
        console.log(pluginName);
    }

    // 初始化插件工程
    static async project(pluginName: string) {
        // 下载模板
        await waitFnloading(download, 'loading template')();

        const projectPath = path.resolve(process.cwd(), pluginName);
        const projectConfig: { [key: string]: string } = await inquirer.prompt(packageConfig);

        // cp project
        await cp(PLUGIN_PROJECT_PATH, projectPath, {
            callback: (dest) => reRender(dest, { pluginName, ...projectConfig }),
        });

        const { pluginType } = await inquirer.prompt({
            name: 'pluginType',
            type: 'list',
            message: 'please choise a plugin type',
            choices: pluginConfig,
        });

        mkdir(projectPath, 'src');
        await cp(path.resolve(PLUGIN_PATH, `${pluginType}/index.ts`), path.resolve(projectPath, 'src/index.ts'), {
            callback: (dest) => reRender(dest, { pluginName }),
        });

        console.log(`Project ["${pluginName}"] initialization completed.`);
    }

    // 初始化本地插件
    static async local(pluginName: string) {
        const rootDir = path.resolve(process.cwd(), 'src');

        if (!fs.existsSync(rootDir)) return console.log(`Please execute the command in the "URSA_ROOT", now in "${rootDir}"`);

        const pluginsDir = mkdir(rootDir, 'plugins');
        const pluginDir = mkdir(pluginsDir, pluginName);

        // 下载模板
        await waitFnloading(download, 'loading template')();

        const { pluginType } = await inquirer.prompt({
            name: 'pluginType',
            type: 'list',
            message: 'please choise a plugin type',
            choices: pluginConfig,
        });

        await cp(path.resolve(PLUGIN_PATH, `${pluginType}/index.ts`), path.resolve(pluginDir, 'index.ts'), {
            callback: (dest) => reRender(dest, { pluginName }),
        });

        console.log(`Plugin "${pluginName}" initialization completed.\n\n    Please add "{ pluginName: true, }" in "plugin.config.ts" to use this plugin.\n`);
    }
}
