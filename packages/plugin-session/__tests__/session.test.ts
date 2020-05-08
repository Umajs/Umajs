
import Uma from '@umajs/core';
import * as request from 'supertest';
import session from '../src/';

describe('session test', () => {
    
    it('should set cookie', (done) => {
        const app = initApp();
        const listen = app.listen();
        app.use(async (ctx) => {
            if (ctx.path === '/') {
                ctx.body = 'set cookie done';
            } else {
                ctx.body = 'not set cookie';
            }
        })

        request(listen)
            .get('/')
            .expect(200).
            expect('set cookie done', done)
    })


    it('should set session', (done) => {
        const app = initApp();
        const listen = app.listen();
        app.use(async (ctx) => {
            if (ctx.path === '/setsess') {
                ctx.session.set('test', 'wf-node test');
                ctx.status = 200;
                ctx.body = 'set session done';
            } else {
                ctx.body = 'not set session';
            }
        })

        request(listen)
            .get('/setsess')
            .expect(200)
            .expect('set session done', done);
    })


    it('should get session', (done) => {
        const app = initApp();
        const listen = app.listen();
        app.use(async (ctx) => {
            console.log(ctx.path, 'path');
            if (ctx.path === '/getsess') {
                if(ctx.cookies.get('wf-sess')) {
                    ctx.status = 200;
                    ctx.body = ctx.session.get('test');
                    return ;
                }
            } else {
                ctx.session.set('test', 'wf-node test');
            }
            ctx.body = 'hello, session';
        })

        request(listen)
            .get('/')
            .expect(200, (err, res) => {
                if(err) done(err);
                const cookies = res.header['set-cookie'][1];
                if(cookies) {
                    request(listen)
                    .get('/getsess')
                    .set('Cookie', cookies)
                    .expect('wf-node test', done);
                }
            })
    })
})

function initApp() {
    const app = new Uma();

    const sessionConfig = {
        key: 'wf-sess',
        maxAge: 1000000,
        secret: 'wf-sess',
        overWrite: true
    }
    session(app, sessionConfig);

    return app;
}

