
import * as program from 'commander';

import mapActions from './const/mapAction';
import project from './command/project';
import config from './command/config';
import plugin from './command/plugin';
import controller from './command/controller';
import service from './command/service';
import { packageInfo } from './const/constants';

// 注册命令
const command = {
    project, config, plugin, controller, service,
};

Reflect.ownKeys(mapActions).forEach((action:string) => {
    program
        .command(action) // 配置命令的名字
        .alias(mapActions[action].alias) // 命令的别名
        .description(mapActions[action].description)// 命令对应的描述
        .action(async () => {
            if (action === '*' || !command[action]) { // 访问不到对应的命令 就打印找不到命令
                console.log(` ${process.argv[2]} ${mapActions[action].description}, more command "uma -h"`);
            } else {
                await command[action](...process.argv.slice(3));
            }
        });
});

// 监听用户的help 事件
program.on('--help', () => {
    console.log('\nExamples:');
    Reflect.ownKeys(mapActions).forEach((action) => {
        mapActions[action].examples.forEach((example) => {
            console.log(`  ${example}`);
        });
    });
});

if (process.argv.length === 2) {
    console.log('uma command "uma -h"');
}

// 解析用户传递过来的参数
program.version(packageInfo.version).parse(process.argv);

process.on('unhandledRejection', async (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    process.exit();
});
