
import Uma, { IContext } from '@umajs/core';

import { aseEncode, aseDecode } from './utils';
import { FormatOpts } from './model';

/**
 *  session参数options配置：
 *      key: 设置cookie中，保存session的字段名称，默认为connect.sid
 *      maxAge: 保存时长
 *      secret: 加密签名
 *      overWrite: 是否覆盖
 */

export default (uma: Uma, opts: any): void => {
    opts = new FormatOpts(opts);
    let appCtx;
    let sessionBody = { };

    uma.app.use((ctx: IContext, next: Function) => {
        appCtx = ctx;

        const cookieSession = aseEncode(sessionBody, opts.secret);

        ctx.cookies.set(opts.key, cookieSession, { maxAge: opts.maxAge });

        return next();
    });

    uma.app.context.session = {
        set(key: string, value: any) {
            sessionBody[key] = value;

            const sessionBodyAse = aseEncode(sessionBody, opts.secret);

            appCtx.cookies.set(opts.key, sessionBodyAse, { maxAge: opts.maxAge });
        },
        get(key: string) {
            const sessionCookies = appCtx.cookies.get(opts.key);

            // 如果有值：解密，返回正常数据
            if (sessionCookies) return aseDecode(sessionCookies, opts.secret)[key];

            return `${opts.key} expired`; // 过期
        },

        remove(key: string) {
            const sessionCookies = appCtx.cookies.get(opts.key);

            // 如果有值：解密，返回正常数据
            if (sessionCookies) {
                sessionBody = aseDecode(sessionCookies, opts.secret);
                delete sessionBody[key];
                // 再次保存
                saveBody(sessionBody);
            } else { // 过期
                return `${opts.key} expired`;
            }
        },
    };

    function saveBody(body: any) {
        const bodyAse = aseEncode(body, opts.secret);

        appCtx.cookies.set(opts.key, bodyAse, {
            maxAge: opts.maxAge,
            overwrite: opts.overwrite,
        });
    }
};
