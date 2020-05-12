import * as path from 'path';
import * as ms from 'humanize-ms';
import Uma, { TPlugin, IContext } from '@umajs/core';

import { TI18nOptions } from './type';
import { formatLocale, i18nMap, loadI18nDir } from './utils';

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
    const { defaultLocale: dl, functionName, defaultDirName, queryField, cookieField, cookieDomain, writeCookie, cookieMaxAge } = opts;
    const defaultLocale = formatLocale(dl);

    loadI18nDir(path.resolve(uma.options.ROOT, defaultDirName));

    if (typeof uma.context[functionName] !== 'undefined') {
        console.warn('[i18n warning]: The variable "%s" will be replaced by i18n on app.context', functionName);
    }

    return {
        context: {
            [functionName]: i18nMap.get(defaultLocale),

            /**
             * 更改当前国际化，仅对当前访问有效
             * @param newlocale 新国际化
             */
            setLocale(locale: string) {
                let newlocale = formatLocale(locale);

                if (!i18nMap.get(newlocale)) {
                    /* eslint-disable */
                    console.warn('[i18n warning]: There is no configuration file "%s" and it will be replaced with process (query | cookie | header | defaultLocale:"%s")', locale, defaultLocale);
                    newlocale = this.getLocale();
                }

                this[functionName] = i18nMap.get(newlocale);
            },

            /**
             * 获取一次请求的语言信息
             * @return {string} locale
             *
             * 1. query: /?i18n=zh-CN
             * 2. cookie: i18n=zn-CN
             * 3. header: Accept-Language: zh-CN,zh;q=0.5
             * 4. defaultLocale: 'en-us'
             * ===> zh-cn
             */
            getLocale(): string {
                const ctx: IContext = this;
                const cookieLocale: string = ctx.cookies.get(cookieField, { signed: false });

                // query or cookie
                let locale = ctx.query[queryField]
                    ? ctx.query[queryField]
                    : cookieLocale;

                // header or defaultLocale
                if (!locale) {
                    // ctx.header['accept-language'] = 'fr-CH, fr;q=0.9, zh-CN;q=0.8, de;q=0.7, *;q=0.5';
                    const languages = ctx.acceptsLanguages();

                    if (typeof languages === 'boolean') return;

                    locale = languages.find((language) => {
                        language = formatLocale(language);

                        return !!i18nMap.get(language);
                    }) || defaultLocale;
                }

                locale = formatLocale(locale);

                // no exist
                if (!i18nMap.get(locale)) {
                    console.warn('[i18n warning]: There is no configuration file "%s"', locale);
                    // throw new Error(`[i18n warning]: There is no configuration file "${locale}"`);
                }

                // write cookie
                if (writeCookie && cookieLocale !== locale && !ctx.headerSent) {
                    const COOKIE_OPTIONS = {
                        httpOnly: false,
                        maxAge: ms(cookieMaxAge),
                        signed: false,
                        domain: cookieDomain,
                        overwrite: true,
                    };

                    ctx.cookies.set(cookieField, locale, COOKIE_OPTIONS);
                }

                return locale;
            }
        }
    };
};
