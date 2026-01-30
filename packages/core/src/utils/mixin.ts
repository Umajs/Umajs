import typeHelper from './typeHelper';

/**
 * Mixin target, Map & Set are not considered for now
 * @param target target
 * @param source source
 */
// eslint-disable-next-line default-param-last
export default function mixin<T>(deep: boolean, target: T): T;
export default function mixin<T, U>(deep: boolean, target: T, source: U): T & U;
export default function mixin<T, U, V>(deep: boolean, target: T, source1: U, source2: V): T & U & V;
export default function mixin<T, U, V, W>(deep: boolean, target: T, source1: U, source2: V, source3: W): T & U & V & W;
// eslint-disable-next-line default-param-last
export default function mixin(deep: boolean = false, target: any, ...sources: any[]) {
    // If target is neither object nor array, return as is
    if (!typeHelper.isObject(target) && !typeHelper.isArray(target)) {
        return target;
    }

    // Use a WeakMap to track visited objects to handle circular references
    return deepMixin(deep, target, sources, new WeakMap());
}

function deepMixin(deep: boolean, target: any, sources: any[], visited: WeakMap<any, any>) {
    for (const source of sources) {
        if (!typeHelper.isObject(source) && !typeHelper.isArray(source)) continue;

        // Map source to target to handle circular references where source refers to itself
        visited.set(source, target);

        const keys = Reflect.ownKeys(source);

        for (const key of keys) {
            // Prevent prototype pollution
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;

            const descriptor = Reflect.getOwnPropertyDescriptor(source, key);
            const { get, set, value } = descriptor;

            if (get || set) {
                const desc: PropertyDescriptor = { configurable: true };

                if (get) desc.get = get;
                if (set) desc.set = set;

                Reflect.defineProperty(target, key, desc);
            } else if (Reflect.has(descriptor, 'value')) {
                const srcValue = value;
                const isSrcArr = typeHelper.isArray(srcValue);
                const isSrcObj = typeHelper.isObject(srcValue);

                if (deep && (isSrcArr || isSrcObj)) {
                    // Check for circular reference in source value
                    if (visited.has(srcValue)) {
                        Reflect.set(target, key, visited.get(srcValue));
                        continue;
                    }

                    const targetValue = Reflect.get(target, key);
                    let destValue;

                    if (isSrcArr) {
                        destValue = typeHelper.isArray(targetValue) ? targetValue : [];
                    } else {
                        destValue = typeHelper.isObject(targetValue) ? targetValue : {};
                    }

                    // Record mapping before recursion
                    visited.set(srcValue, destValue);

                    // Recursive call
                    deepMixin(true, destValue, [srcValue], visited);
                    Reflect.set(target, key, destValue);
                } else {
                    Reflect.set(target, key, srcValue);
                }
            }
        }
    }

    return target;
}
