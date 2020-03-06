import typeHelper from './typeHelper';

/**
 * 混入目标，暂不考虑 Map & Set
 * @param target 目标
 * @param source 资源
 */
export default function mixin(deep: boolean = false, target: any, ...sources: any[]) {
    if (!typeHelper.isObject(target)) return target;

    for (const source of sources) {
        if (!typeHelper.isObject(source)) continue;

        const keys = Reflect.ownKeys(source);

        for (const key of keys) {
            const descriptor = Reflect.getOwnPropertyDescriptor(source, key);
            const { get, set, value } = descriptor;

            if (get || set) {
                const desc: PropertyDescriptor = { configurable: true };

                if (get) desc.get = get;
                if (set) desc.set = set;

                Reflect.defineProperty(target, key, desc);
            } else if (Reflect.has(descriptor, 'value')) {
                Reflect.set(target, key, deep && typeHelper.isObject(value) ? mixin(true, {}, value) : value);
            }
        }
    }

    return target;
}
