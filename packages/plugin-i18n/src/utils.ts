import * as fs from 'fs';
import * as path from 'path';
import * as ms from 'humanize-ms';
import { IContext } from '@umajs/core';

import { TI18nOptions } from './type';

export const i18nMap: Map<string, { [key: string]: any }> = new Map();

export function requireDefault(p: string) {
    /* eslint-disable global-require */
    const ex = require(p);

    return (ex && (typeof ex === 'object') && 'default' in ex) ? ex.default : ex;
}

/**
 * 多语言字符串模板处理
 * @param strings  字符串数组
 * @param keys  变量数组
 *
 * eg: template`HAHA, ${0} ${'name'}!`('Welcome', { name: 'xiaoming' })
 * ===> HAHA, Welcome xiaoming!
 */
export function template(strings: ReadonlyArray<string>, ...keys: (string | number)[]): Function {
    return (...values: Array<string | object>): string => {
        const dict = values[values.length - 1] || {};
        const result: Array<string | number> = [strings[0]];

        keys.forEach((key: number | string, i: number) => {
            let value: number | string;

            if (Number.isInteger(key as number)) {
                value = values[key] && !(values[key] instanceof Object) ? values[key] : '';
            } else {
                value = dict[key];
            }

            result.push(value, strings[i + 1]);
        });

        return result.join('');
    };
}

/**
 * 格式化语言名称代码
 * @param locale 语言名称代码
 * zh_CN, en_US => zh-cn, en-us
 */
export function formatLocale(locale: string): string {
    return locale.replace('_', '-').toLowerCase();
}


/**
 * 加载 i18n 配置
 * @param i18nDir 文件夹
 */
export function loadI18nDir(i18nDir: string) {
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
export function getLocale(ctx: IContext, opts: TI18nOptions): string {
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
