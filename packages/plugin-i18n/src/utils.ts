
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
export function template(strings: ReadonlyArray<string>, ...keys: ReadonlyArray<string | number>): Function {
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
