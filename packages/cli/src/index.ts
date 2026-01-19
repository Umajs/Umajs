import { program } from 'commander';

import mapActions from './const/mapAction';
import project from './command/project';
import config from './command/config';
import plugin from './command/plugin';
import controller from './command/controller';
import service from './command/service';
import { packageInfo } from './const/constants';

// Register commands
const command = {
    project, config, plugin, controller, service,
};

Reflect.ownKeys(mapActions).forEach((action:string) => {
    program
        .command(action) // Configure command name
        .alias(mapActions[action].alias) // Command alias
        .description(mapActions[action].description)// Command description
        .action(async () => {
            if (action === '*' || !command[action]) { // If the corresponding command is not found, print command not found
                console.log(` ${process.argv[2]} ${mapActions[action].description}, more command "uma -h"`);
            } else {
                await command[action](...process.argv.slice(3));
            }
        });
});

// Listen for user help events
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

// Parse parameters passed by the user
program.version(packageInfo.version).parse(process.argv);

process.on('unhandledRejection', async (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    process.exit();
});
