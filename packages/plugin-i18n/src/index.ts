import * as path from 'path';
import Uma, { IContext, TPlugin } from '@umajs/core';

import { TI18nOptions } from './type';
import { formatLocale, i18nMap, getLocale, loadI18nDir } from './utils';

/**
 * 默认配置 DEFAULT_OPTIONS
 * @property {String} defaultLocale 默认语言 en-US
 * @property {String} queryField 接收的query字段 locale
 * @property {String} cookieField 存储的cookie字段 locale
 * @property {Boolean} writeCookie 是否写入cookie true
 * @property {String} cookieMaxAge cookie最大存储时间 1y
 * @property {String} cookieDomain cookie的域名 ''
 * @property {String} defaultDirName 多语言文件夹名(当指定dirs时，该参数无效) i18n
 * @property {String} functionName 自定义函数名 i18n
 *
 */
const DEFAULT_OPTIONS: TI18nOptions = {
    defaultLocale: 'en-US',
    queryField: 'i18n',
    cookieField: 'i18n',
    writeCookie: true,
    cookieMaxAge: '1y',
    cookieDomain: '',
    defaultDirName: 'i18n',
    functionName: 'i18n',
};

export default (uma: Uma, options?: TI18nOptions): TPlugin => {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const { defaultLocale: dl, functionName, defaultDirName } = opts;
    const defaultLocale = formatLocale(dl);

    loadI18nDir(path.resolve(uma.options.ROOT, defaultDirName));

    if (typeof uma.context[functionName] !== 'undefined') {
        console.warn('[i18n warning]: The variable "%s" will be replaced by i18n on app.context', functionName);
    }

    return {
        context: {
            setLocale(locale: string) {
                let newlocale = formatLocale(locale);

                if (!i18nMap.get(newlocale)) {
                    /* eslint-disable */
                    console.warn('[i18n warning]: There is no configuration file "%s" and it will be replaced with process (query | cookie | header | defaultLocale:"%s")', locale, defaultLocale);
                    newlocale = getLocale(this, opts);
                }
                this[functionName] = i18nMap.get(newlocale);
            },
        },
        use: {
            handler(ctx: IContext, next: Function) {
                const locale = getLocale(ctx, opts);

                ctx[functionName] = i18nMap.get(locale);

                return next();
            }
        },
    };
};
