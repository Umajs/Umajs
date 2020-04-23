const mapAction = {
    project: {
        alias: 'p',
        description: 'create a project',
        examples: [
            'ursa project <project-name>',
        ],
    },
    config: {
        alias: 'conf',
        description: 'config project variable',
        examples: [
            'ursa config set <k> <v>',
            'ursa config get <k>',
        ],
    },
    '*': {
        alias: '',
        description: 'command not found',
        examples: [],
    },
};

export default mapAction;
