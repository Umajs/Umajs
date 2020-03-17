const mapAction = {
    project: {
        alias: 'p',
        description: 'create a project',
        examples: [
            'wf-node project <project-name>',
        ],
    },
    config: {
        alias: 'conf',
        description: 'config project variable',
        examples: [
            'wf-node config set <k> <v>',
            'wf-node config get <k>',
        ],
    },
    '*': {
        alias: '',
        description: 'command not found',
        examples: [],
    },
};

export default mapAction;
