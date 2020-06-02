import * as path from 'path';
import * as ms from 'humanize-ms';
import Uma, { TPlugin, IContext } from '@umajs/core';

import { formatLocale, i18nMap, loadI18nDir } from './utils';

export type i18nOptions = {
    /**
     * 默认语言
     * 默认： en-US
     */
    defaultLocale?: string,
    /**
     * 接收的query字段
     * 默认：locale
     */
    queryField?: string,
    /**
     * 存储的cookie字段
     * 默认：locale
     */
    cookieField?: string,
    /**
     * 是否写入cookie
     * 默认：true
     */
    writeCookie?: boolean,
    /**
     * cookie最大存储时间
     * 默认：1y
     */
    cookieMaxAge?: string,
    /**
     * cookie的域名
     * 默认：''
     */
    cookieDomain?: string,
    /**
     * 多语言文件夹名
     * 默认：i18n
     */
    defaultDirName?: string,
    /**
     * 自定义函数名
     * 默认：i18n
     */
    functionName?: string,
}

// 默认配置
const DEFAULT_OPTIONS: i18nOptions = {
    defaultLocale: 'en-US',
    queryField: 'i18n',
    cookieField: 'i18n',
    writeCookie: true,
    cookieMaxAge: '1y',
    cookieDomain: '',
    defaultDirName: 'i18n',
    functionName: 'i18n',
};

export default (uma: Uma, options?: i18nOptions): TPlugin => {
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
