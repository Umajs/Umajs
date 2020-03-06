export default class typeHelper {
    static type(target: any): string {
        return Object.prototype.toString.call(target).slice(8, -1);
    }

    static get undef(): undefined {
        return (undef => undef)();
    }

    static isUndef(obj: any): obj is undefined {
        return obj === typeHelper.undef;
    }

    static isString(target: any): target is string {
        return typeHelper.type(target) === 'String';
    }

    static isObject(target: any): target is object {
        return typeHelper.type(target) === 'Object';
    }

    static isFunction(target: any): target is Function {
        return typeof target === 'function';
    }

    static isBoolean(target: any): target is boolean {
        return typeHelper.type(target) === 'Boolean';
    }

    static isArray(target: any): target is [] {
        return typeHelper.type(target) === 'Array';
    }
}
