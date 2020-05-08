import * as path from 'path';
import * as fs from 'fs';
import * as ms from 'humanize-ms';
import Uma, { IContext, TPlugin } from '@umajs/core';

import { I18nOptions, I18nModule, CookieOptions } from './type';
import { formatLocale, requireDefault, template } from './utils';

const i18nMap: Map<string, I18nModule> = new Map();

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
const DEFAULT_OPTIONS: I18nOptions = {
    defaultLocale: 'en-US',
    queryField: 'i18n',
    cookieField: 'i18n',
    writeCookie: true,
    cookieMaxAge: '1y',
    cookieDomain: '',
    defaultDirName: 'i18n',
    functionName: 'i18n',
};

/**
 * 加载 i18n 配置
 * @param i18nDir 文件夹
 */
function loadI18nDir(i18nDir: string) {
    if (!fs.existsSync(i18nDir)) {
        console.log(`I18n dir is not exists. dir path is "${i18nDir}"`);

        return;
    }

    const files: string[] = fs.readdirSync(i18nDir);

    files.forEach((file) => {
        const filepath = path.join(i18nDir, file);
        const locale = formatLocale(file.split('.')[0]);

        i18nMap.set(locale, requireDefault(filepath)(template));
    });
}

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
function getLocale(ctx: IContext, options: I18nOptions): string {
    const opts = Object.assign({}, DEFAULT_OPTIONS, options);
    const {
        queryField, cookieField, cookieDomain, writeCookie, defaultLocale, cookieMaxAge,
    } = opts;
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
        const COOKIE_OPTIONS: CookieOptions = {
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

export default (uma: Uma, options?: I18nOptions): TPlugin => {
    const opts = Object.assign({}, DEFAULT_OPTIONS, options);
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
