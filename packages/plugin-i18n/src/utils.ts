import * as fs from 'fs';
import * as path from 'path';

type paramType = string | number;
type templateParamsType = [...paramType[], paramType | Record<string, paramType>];

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
 * return Function;
 * eg:
 *  const tmp = template`HAHA, ${0} ${'name'}!`;
 *  const str = temp('Welcome', { name: 'xiaoming' });
 *  console.log(str); // ===> HAHA, Welcome xiaoming!
 */
export function template(strings: ReadonlyArray<string>, ...keys: paramType[]): Function {
    return (...values: templateParamsType): string => {
        const lastValue = values[values.length - 1];
        const dict = typeof lastValue === 'object' ? lastValue : {};
        const result: Array<paramType> = [strings[0]];

        keys.forEach((key: paramType, i: number) => {
            let value: paramType;

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
