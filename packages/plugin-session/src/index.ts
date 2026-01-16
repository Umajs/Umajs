import Uma, { IContext, TPlugin } from '@umajs/core';

import Crypto from './crypto';
import { ICrypto } from './types/ICrypto';

export type sessionOptions = {
    /**
     * Field name for saving session in cookie
     * Default: uma:sess
     */
    key: string;
    /**
     * Duration
     * Default: 1d
     */
    maxAge?: number;
    /**
     * Encryption signature
     */
    secret: string;
    /**
     * Whether to overwrite
     * Default: true
     */
    overwrite?: boolean;
    /**
     * Encryption algorithm, implements ICrypto interface, passed in after instantiation
     */
    crypto?: ICrypto;
}

const ONE_DAY = 24 * 60 * 60 * 1000;
const DEFAULT_OPTION = <sessionOptions>{
    key: 'uma:sess',
    maxAge: ONE_DAY,
    secret: null,
    overwrite: true,
};

export default (uma: Uma, options: sessionOptions): TPlugin => {
    if (!options.secret) {
        console.log(new Error('Optios.secret must be assigned, default value "umasss" is very dangerous!'));

        options.secret = 'umasss';
    }

    const opts = { ...DEFAULT_OPTION, ...options };
    const { key: sessionKey, secret, maxAge, overwrite, crypto = new Crypto(secret) } = opts;
    const setCookie = (ctx: IContext, content: any) => {
        ctx.cookies.set(sessionKey, crypto.encrypt(content), {
            maxAge,
            overwrite,
        });
    };

    return {
        context: {
            get session() {
                const ctx: IContext = this;

                return {
                    set(key: string, value: any) {
                        const sessionCookies = ctx.cookies.get(sessionKey);
                        let sessionBody = {};

                        if (sessionCookies) {
                            sessionBody = crypto.decrypt(sessionCookies);
                        }

                        sessionBody[key] = value;

                        setCookie(ctx, sessionBody);
                    },
                    get(key: string) {
                        const sessionCookies = ctx.cookies.get(sessionKey);

                        if (sessionCookies) {
                            const sessionBody = crypto.decrypt(sessionCookies);

                            return sessionBody[key];
                        }

                        return null;
                    },
                    remove(key: string) {
                        const sessionCookies = ctx.cookies.get(sessionKey);

                        if (sessionCookies) {
                            const sessionBody = crypto.decrypt(sessionCookies);

                            delete sessionBody[key];

                            setCookie(ctx, sessionBody);
                        }
                    },
                };
            },
        },
    };
};
