import * as fs from 'fs';
import * as path from 'path';
import * as inquirer from 'inquirer';

import { download } from '../../api';
import { actionHelp, waitFnloading } from '../../utils/utils';
import { cp, reRender, mkdir } from '../../utils/file';
import { PLUGIN_PATH, PLUGIN_PROJECT_PATH } from '../../const/constants';
import packageConfig from '../../const/packageConfig';
import pluginConfig from '../../const/pluginConfig';

async function promptPluginType() {
    return await inquirer.prompt({
        name: 'pluginType',
        type: 'list',
        message: 'please select the plugin type',
        choices: pluginConfig,
    });
}

export default class Plugin {
    static async init(pluginName: string, ...props: string[]) {
        if (!pluginName) return actionHelp('plugin');

        const { type } = await inquirer.prompt({
            name: 'type',
            type: 'list',
            message: 'Please select the type to create the plugin',
            choices: [
                { name: '给当前 Uma 工程添加插件', value: 'local' },
                { name: '新建插件工程，一般用于发包至仓库', value: 'project' },
            ],
        });

        Plugin[type](pluginName, ...props);
    }

    // TODO 安装插件到工程
    static async install(pluginName: string) {
        // TODO 1.install 2 add plugin.config.ts 3.new pluginName.config.ts
        console.log(pluginName);
    }

    // 初始化插件工程
    static async project(pluginName: string) {
        const projectPath = path.resolve(process.cwd(), pluginName);
        const projectConfig: { [key: string]: string } = await inquirer.prompt(packageConfig);

        // cp project
        await cp(PLUGIN_PROJECT_PATH, projectPath, {
            callback: (dest) => reRender(dest, { pluginName, ...projectConfig }),
        });

        // 下载模板
        await waitFnloading(download, 'loading template')();

        const { pluginType } = await promptPluginType();

        mkdir(projectPath, 'src');
        await cp(path.resolve(PLUGIN_PATH, `${pluginType}/index.ts`), path.resolve(projectPath, 'src/index.ts'), {
            callback: (dest) => reRender(dest, { pluginName }),
        });

        console.log(`Project ["${pluginName}"] initialization completed.`);
    }

    // 初始化本地插件，用在 Uma.js 工程中
    static async local(pluginName: string) {
        const rootDir = path.resolve(process.cwd(), 'src');

        if (!fs.existsSync(rootDir)) return console.log(`Please execute the command in the "UMA_ROOT", now in "${rootDir}"`);

        const pluginsDir = mkdir(rootDir, 'plugins');
        const pluginDir = mkdir(pluginsDir, pluginName);

        // 下载模板
        await waitFnloading(download, 'loading template')();

        const { pluginType } = await promptPluginType();

        await cp(path.resolve(PLUGIN_PATH, `${pluginType}/index.ts`), path.resolve(pluginDir, 'index.ts'), {
            callback: (dest) => reRender(dest, { pluginName }),
        });

        console.log(`Plugin "${pluginName}" initialization completed.\n\n    Please add "{ pluginName: true, }" in "plugin.config.ts" to use this plugin.\n`);
    }
}
