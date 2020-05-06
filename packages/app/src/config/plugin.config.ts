import { TPluginConfig } from '@umajs/core';

export default <{[key: string]: TPluginConfig}>{
    'static': {
        options: {
            root: './static',
            opts: {
            },
        },
    },
    'test': true,
    'views': {
        enable: true,
        name: 'views',
        options: {
            root: './views',
            opts: {
                map: { html: 'nunjucks' },
            },
        },
    },
};
