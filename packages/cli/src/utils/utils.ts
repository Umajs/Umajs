import * as ora from 'ora';
import * as URL from 'url';
import * as http from 'http';
import * as https from 'https';
import mapAction from '../const/mapAction';

// 封装loading效果
export const waitFnloading = (fn: Function, message: string) => async (...args: any) => {
    const spinner = ora(message);

    spinner.start();
    const result = await fn(...args);

    spinner.succeed();

    return result;
};

export const actionHelp = (actionName: string) => {
    const { description, examples } = mapAction[actionName];

    return console.log(`${description} usage:\n\n   ${examples.join('\n')}\n`);
};

const getHeaders = () => {
    const headers = {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4,es;q=0.2',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    };

    return headers;
};

// 封装ajax
export const xhr = (method: string, url: string) => {
    const urlObj = URL.parse(url);
    const { protocol } = urlObj;
    const options = {
        hostname: urlObj.host,
        port: urlObj.port,
        path: urlObj.path,
        method: method,
        headers: getHeaders(),
    };

    return new Promise((resolve, reject) => {
        const req = (protocol === 'http:' ? http : https).request(options, (res) => {
            const chunks = [];

            res.on('data', (data) => {
                chunks.push(data);
            });
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);

                resolve(buffer.toString());
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    });
};
