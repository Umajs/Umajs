
import * as path from 'path';
// 解析用户的参数
import * as program from 'commander';

import mapActions from './utils/mapAction';
import project from './command/project';
import config from './command/config';
import { version } from './utils/constants';

// 注册命令
const command = {
    project, config,
};

Reflect.ownKeys(mapActions).forEach((action:string) => {
    console.log(action);
    program
        .command(action) // 配置命令的名字
        .alias(mapActions[action].alias) // 命令的别名
        .description(mapActions[action].description)// 命令对应的描述
        .action(() => {
            if (action === '*') { // 访问不到对应的命令 就打印找不到命令
                console.log(` ${process.argv[2]} ${mapActions[action].description},more command 'wf-node -h'`);
            } else { // create config ....
                console.log(path.resolve(__dirname, action));
                // eslint-disable-next-line import/no-dynamic-require
                command[action](...process.argv.slice(3));
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

// 解析用户传递过来的参数
program.version(version).parse(process.argv);
