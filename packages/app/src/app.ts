import * as Koa from 'koa';
import Uma, { TUmaOption } from '@umajs/core';
import { Router } from '@umajs/router';

const options: TUmaOption = {
    Router,
    bodyParser: { multipart: true },
    ROOT: __dirname,
    env: process.argv.indexOf('production') > -1 ? 'production' : 'development',
};

(async () => {
    if (process.argv.indexOf('--koa') > -1) {
        const app = new Koa();

        app.use(await Uma.middleware(options, app));

        app.listen(8058);
    } else {
        const uma = Uma.instance(options);

        uma.start(8058);
    }
})();
