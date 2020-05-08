import Uma from '@umajs/core';
import { Router } from '@umajs/router';
import * as request from 'supertest';

import { start, stop, send } from './__fixtures__/app/app';

describe('session test', () => {
    beforeAll(async () => {
        await start();
    });

    afterAll(async () => {
        await stop();
    });

    it('should set cookie', async () => {
        const result = await send('/');
        expect(result.text).toEqual('set cookie done');
    });

    // it('should set session', async () => {
    //     const result = await send('http://localhost:8053/index/setsess');
    //     expect(result.text).toEqual('set session done');
    // });


    // it('should set session', (done) => {
    //     const app = initApp();
    //     const listen = app.listen();
    //     app.use(async (ctx) => {
    //         if (ctx.path === '/setsess') {
    //             ctx.session.set('test', 'node test');
    //             ctx.status = 200;
    //             ctx.body = 'set session done';
    //         } else {
    //             ctx.body = 'not set session';
    //         }
    //     })

    //     request(listen)
    //         .get('/setsess')
    //         .expect(200)
    //         .expect('set session done', done);
    // })


    // it('should get session', (done) => {
    //     app.use(async (ctx) => {
    //         console.log(ctx.path, 'path');
    //         if (ctx.path === '/getsess') {
    //             if (ctx.cookies.get('sess')) {
    //                 ctx.status = 200;
    //                 ctx.body = ctx.session.get('test');
    //                 return;
    //             }
    //         } else {
    //             ctx.session.set('test', 'node test');
    //         }
    //         ctx.body = 'hello, session';
    //     })

    //     request(listen)
    //         .get('/')
    //         .expect(200, (err, res) => {
    //             if (err) done(err);
    //             const cookies = res.header['set-cookie'][1];
    //             if (cookies) {
    //                 request(listen)
    //                     .get('/getsess')
    //                     .set('Cookie', cookies)
    //                     .expect('node test', done);
    //             }
    //         })
    // })
})
