import * as path from 'path';
import { ms } from 'humanize-ms';
import Uma, { TPlugin, IContext } from '@umajs/core';

import { formatLocale, i18nMap, loadI18nDir } from './utils';

export type i18nOptions = {
    /**
     * Default language
     * Default: en-US
     */
    defaultLocale?: string,
    /**
     * Received query field
     * Default: locale
     */
    queryField?: string,
    /**
     * Stored cookie field
     * Default: locale
     */
    cookieField?: string,
    /**
     * Whether to write cookie
     * Default: true
     */
    writeCookie?: boolean,
    /**
     * Cookie max age
     * Default: 1y
     */
    cookieMaxAge?: string,
    /**
     * Cookie domain
     * Default: ''
     */
    cookieDomain?: string,
    /**
     * Multilingual folder name
     * Default: i18n
     */
    defaultDirName?: string,
    /**
     * Custom function name
     * Default: i18n
     */
    functionName?: string,
}

// Default configuration
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

    const LOCAL = Symbol('local');

    return {
        context: {
            [LOCAL]: null,

            get [functionName]() {
                if (!this[LOCAL]) {
                    this[LOCAL] = this.getLocale();
                }

                return i18nMap.get(this.getLocale());
            },

            /**
             * Change current internationalization, valid only for current access
             * @param locale new internationalization
             */
            setLocale(locale: string) {
                this[LOCAL] = null;

                let newlocale = formatLocale(locale);

                if (!i18nMap.has(newlocale)) {
                    /* eslint-disable */
                    console.warn('[i18n warning]: There is no configuration file "%s" and it will be replaced with process (query | cookie | header | defaultLocale:"%s")', locale, defaultLocale);
                    newlocale = this.getLocale();
                }

                Reflect.defineProperty(this, functionName, {
                    writable: true,
                    value: i18nMap.get(newlocale),
                });
            },

            /**
             * Get language information for a request
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
                    ? <string>ctx.query[queryField]
                    : cookieLocale;

                // header or defaultLocale
                if (!locale) {
                    // ctx.header['accept-language'] = 'fr-CH, fr;q=0.9, zh-CN;q=0.8, de;q=0.7, *;q=0.5';
                    const languages = ctx.acceptsLanguages();

                    if (typeof languages === 'boolean') return;

                    locale = languages.find((language) => {
                        language = formatLocale(language);

                        return i18nMap.has(language);
                    }) || defaultLocale;
                }

                locale = formatLocale(locale);

                // no exist
                if (!i18nMap.has(locale)) {
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
