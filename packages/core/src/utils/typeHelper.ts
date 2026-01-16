export default class typeHelper {
    static type(target: any): string {
        return Object.prototype.toString.call(target).slice(8, -1);
    }

    static isUndef(obj: any): obj is undefined {
        return obj === undefined;
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

    static isPromise(target: any): target is Promise<any> {
        return !!target && (typeof target === 'object' || typeof target === 'function') && typeof target.then === 'function';
    }

    static isBoolean(target: any): target is boolean {
        return typeHelper.type(target) === 'Boolean';
    }

    static isArray(target: any): target is [] {
        return typeHelper.type(target) === 'Array';
    }
}
