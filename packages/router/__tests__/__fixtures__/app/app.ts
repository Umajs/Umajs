import * as path from 'path';
import * as request from 'supertest';
import { WF, IResponse } from '@wf-node/core';

import { Router } from '../../../src/index';

const wf = WF.instance({
    Router,
    WF_ROOT: path.join(__dirname, '../app'),
});

export const start = () => new Promise((resolve, reject) => {
    wf.start(8053, (e) => {
        if (e) return reject();
        resolve();
    });
});

export const stop = () => new Promise((resolve, reject) => {
    wf.server.close((e) => {
        if (e) return reject();
        resolve();
    });
});

export const send = (path: string): any => new Promise((resolve, reject) => {
    request(wf.app.callback())
        .get(path)
        .end((err: Error, res: IResponse) => {
            if (err) reject(err);
            resolve(res);
        });
});

export const post = (path: string, data?: Object): any => new Promise((resolve, reject) => {
    request(wf.app.callback())
        .post(path)
        .send(data)
        .end((err: Error, res: Response) => {
            if (err) reject(err);
            resolve(res);
        });
});
