export default {
    project: {
        alias: 'p',
        description: 'ursa project',
        examples: [
            'ursa project <project-name>',
        ],
    },
    config: {
        alias: 'c',
        description: 'ursa config',
        examples: [
            'ursa config init <config-name>',
        ],
    },
    plugin: {
        alias: 'pg',
        description: 'ursa plugin',
        examples: [
            'ursa plugin init <plugin-name>',
            'ursa plugin install <plugin-name>',
        ],
    },
    '*': {
        alias: '',
        description: 'command not found',
        examples: [],
    },
};
