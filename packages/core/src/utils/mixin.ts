import typeHelper from './typeHelper';

/**
 * Mixin target, Map & Set are not considered for now
 * @param target target
 * @param source source
 */
// eslint-disable-next-line default-param-last
export default function mixin<T>(deep: boolean, target: T): T;
export default function mixin<T, U>(deep: boolean, target: T, source?: U): T & U;
export default function mixin<T, U, V>(deep: boolean, target: T, source1: U, source2: V): T & U & V;
export default function mixin<T, U, V, W>(deep: boolean, target: T, source1: U, source2: V, source3: W): T & U & V & W;
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
                Reflect.set(target, key, deep && typeHelper.isObject(value) ? mixin(true, Reflect.get(target, key) || {}, value) : value);
            }
        }
    }

    return target;
}
