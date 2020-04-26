export default {
    project: {
        alias: 'p',
        description: 'ursa project',
        examples: [
            'ursa [project | p] <project-name>',
        ],
    },
    plugin: {
        alias: 'pg',
        description: 'ursa plugin',
        examples: [
            'ursa [plugin | pg] init <plugin-name>',
            'ursa [plugin | pg] install <plugin-name>',
        ],
    },
    config: {
        alias: 'c',
        description: 'ursa config',
        examples: [
            'ursa [config | c] init <config-name>',
        ],
    },
    controller: {
        alias: 'ctrl',
        description: 'ursa controller',
        examples: [
            'ursa [controller | ctrl] init <controller-name>',
        ],
    },
    service: {
        alias: 's',
        description: 'ursa service',
        examples: [
            'ursa [service | s] init <service-name>',
        ],
    },
    '*': {
        alias: '',
        description: 'command not found',
        examples: [],
    },
};
