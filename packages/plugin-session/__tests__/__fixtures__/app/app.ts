import * as path from 'path';
import * as request from 'supertest';
import { Uma, IResponse } from '@umajs/core';
import { Router } from '@umajs/router';

import session from '../../../src/';

const uma = Uma.instance({
    Router,
    ROOT: path.join(__dirname, '../app'),
});

export const start = () => new Promise((resolve, reject) => {
    const { context } = session(uma, {
        key: 'uma:sess',
        maxAge: 1000000,
        secret: 'uma:sess',
        overWrite: true
    });

    Object.defineProperty(uma.context, 'session', {
        get: Object.getOwnPropertyDescriptor(context, 'session').get,
    });

    uma.start(8053, (e) => {
        if (e) return reject();
        resolve();
    });
});

export const stop = () => new Promise((resolve, reject) => {
    uma.server.close((e) => {
        if (e) return reject();
        resolve();
    });
});

export const send = (path: string): any => new Promise((resolve, reject) => {
    const req = request(uma.app.listen())

    req.get(path)
        .end((err: Error, res: IResponse) => {
            if (err) reject(err);

            req.get(path)
                .end((err: Error, res: IResponse) => {
                    if (err) reject(err);
                    resolve(res);
                });
        });
});

export const post = (path: string, data?: Object): any => new Promise((resolve, reject) => {
    request(uma.app.listen())
        .post(path)
        .send(data)
        .end((err: Error, res: Response) => {
            if (err) reject(err);
            resolve(res);
        });
});


// start().then(async () => {
//     const result = await send('/');

//     console.log(Object.keys(result), );
//     console.log(result.text);
// });
