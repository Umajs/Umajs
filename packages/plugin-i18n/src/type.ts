
export interface I18nOptions {
    defaultLocale?: string,
    queryField?: string,
    cookieField?: string,
    writeCookie?: boolean,
    cookieMaxAge?: string,
    cookieDomain?: string,
    dirs?: Array<string>,
    defaultDirName?: string,
    functionName?: string,
}

export interface I18nModule {
    [propName: string]: any
}

export interface CookieOptions {
    httpOnly: boolean,
    maxAge: number,
    signed: boolean,
    domain: string,
    overwrite: boolean,
}
