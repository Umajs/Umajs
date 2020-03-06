import * as path from 'path';
import * as request from 'supertest';
import { Ursa, IResponse } from '@ursa/core';

import { Router } from '../../../src/index';

const ursa = Ursa.instance({
    Router,
    bodyParser: false,
    ROOT: path.join(__dirname, '../app'),
});

export const start = () => new Promise((resolve, reject) => {
    ursa.start(8053, (e) => {
        if (e) return reject();
        resolve();
    });
});

export const stop = () => new Promise((resolve, reject) => {
    ursa.server.close((e) => {
        if (e) return reject();
        resolve();
    });
});

export const send = (path: string): any => new Promise((resolve, reject) => {
    request(ursa.app.callback())
        .get(path)
        .end((err: Error, res: IResponse) => {
            if (err) reject(err);
            resolve(res);
        });
});

export const post = (path: string, data?: Object): any => new Promise((resolve, reject) => {
    request(ursa.app.callback())
        .post(path)
        .send(data)
        .end((err: Error, res: Response) => {
            if (err) reject(err);
            resolve(res);
        });
});
