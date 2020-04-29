export default {
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
