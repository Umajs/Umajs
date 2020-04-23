import * as fs from 'fs';
import * as path from 'path';
import * as inquirer from 'inquirer';

import { actionHelp } from '../../utils/utils';

export default class Plugin {
    static async init(pluginName: string, ...props: string[]) {
        if (!pluginName) return actionHelp(pluginName);

        const { type } = await inquirer.prompt({
            name: 'type',
            type: 'list',
            message: 'Please choise a type to create plugin',
            choices: ['local', 'project'],
        });

        Plugin[type](pluginName, ...props);
    }

    // 安装插件到工程
    static async install(pluginName: string) {
        // TODO 1.install 2 add plugin.config.ts 3.new pluginName.config.ts
        console.log(pluginName);
    }

    // 初始化插件工程
    static project(pluginName: string) {
        console.log(pluginName);
    }

    // 初始化本地插件
    static local(pluginName: string) {
        const rootDir = path.resolve(process.cwd(), 'src');

        if (!fs.existsSync(rootDir)) return console.log(`Please execute the command in the "URSA_ROOT", now in "${rootDir}"`);

        const pluginDir = path.resolve(rootDir, 'plugins');

        if (!fs.existsSync(pluginDir)) fs.mkdirSync(pluginDir);

        console.log(`Plugin "${pluginName}" initialization completed.\n\n    Please add "{ pluginName: true, }" in "plugin.config.ts" to use this plugin.\n`);
    }
}
