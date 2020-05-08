import Uma, { IContext, TPlugin } from '@umajs/core';

import { FormatOpts } from './model';
import { cryptoJS } from './crypto';

/**
 *  session参数options配置：
 *      key: 设置cookie中，保存session的字段名称，默认为connect.sid
 *      maxAge: 保存时长
 *      secret: 加密签名
 *      overWrite: 是否覆盖
 */

export default (uma: Uma, options: any): TPlugin => {
    const opts = new FormatOpts(options);
    const { key: sessionKey, secret, maxAge, overWrite: overwrite } = opts;
    const crypto = cryptoJS(secret);
    const setCookie = (ctx: IContext, content: any) => {
        ctx.cookies.set(sessionKey, crypto.encrypt(content), {
            maxAge,
            overwrite,
        });
    };

    return {
        context: {
            get session() {
                const that: IContext = this;

                return {
                    set(key: string, value: any) {
                        const sessionCookies = that.cookies.get(sessionKey);
                        let sessionBody = {};

                        if (sessionCookies) {
                            sessionBody = crypto.decrypt(sessionCookies);
                        }

                        sessionBody[key] = value;

                        setCookie(that, sessionBody);
                    },
                    get(key: string) {
                        const sessionCookies = that.cookies.get(sessionKey);

                        if (sessionCookies) {
                            const sessionBody = crypto.decrypt(sessionCookies);

                            return sessionBody[key];
                        }

                        return null;
                    },
                    remove(key: string) {
                        const sessionCookies = that.cookies.get(sessionKey);

                        if (sessionCookies) {
                            const sessionBody = crypto.decrypt(sessionCookies);

                            delete sessionBody[key];

                            setCookie(that, sessionBody);
                        }
                    },
                };
            },
        },
    };
};
