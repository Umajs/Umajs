import { TPluginConfig } from '@umajs/core';

export default <{[key: string]: boolean | TPluginConfig}>{
    status: true,
    session: true,
    i18n: {
        enable: true,
        name: 'i18n',
        options: {
            defaultLocale: 'zh-cn',
        },
    },
    static: {
        options: {
            root: './static',
            opts: {
            },
        },
    },
    test: true,
    views: {
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
