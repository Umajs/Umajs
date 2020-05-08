
const Koa = require('koa');
const path = require('path');
const i18n = require('../lib/index').default;

const app = new Koa()
i18n({app}, { dirs: [path.join(process.cwd(), '__tests__/i18n'), path.join(process.cwd(), '__tests__/i19n')] });
