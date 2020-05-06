export default {
    project: {
        alias: 'p',
        description: 'uma project',
        examples: [
            'uma [project | p] <project-name>',
        ],
    },
    plugin: {
        alias: 'pg',
        description: 'uma plugin',
        examples: [
            'uma [plugin | pg] init <plugin-name>',
            'uma [plugin | pg] install <plugin-name>',
        ],
    },
    config: {
        alias: 'c',
        description: 'uma config',
        examples: [
            'uma [config | c] init <config-name>',
        ],
    },
    controller: {
        alias: 'ctrl',
        description: 'uma controller',
        examples: [
            'uma [controller | ctrl] init <controller-name>',
        ],
    },
    service: {
        alias: 's',
        description: 'uma service',
        examples: [
            'uma [service | s] init <service-name>',
        ],
    },
    '*': {
        alias: '',
        description: 'command not found',
        examples: [],
    },
};
