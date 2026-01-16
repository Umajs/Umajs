import typeHelper from '../utils/typeHelper';

export const ResourceClazzMap: Map<Function, any> = new Map();

/**
 * Decorate class
 * @param props instantiation parameters
 */
export function Resource(...props: any[]): Function {
    return function resource(target: Function): any {
        if (!typeHelper.isFunction(target)) throw new Error('@Resource only use on class.');

        ResourceClazzMap.set(target, Reflect.construct(target, props));
    };
}

/**
 * Inject the instantiated class for use
 * @param resourceName resource file name
 */
export function Inject(resource: Function): Function {
    return function inject(target: Function, property: string, desc: PropertyDescriptor): any {
        if (!typeHelper.isUndef(desc)) {
            throw new Error(`Please check @Inject()/${property} be used on Class's property.`);
        }

        return {
            get() {
                const resourceClass = ResourceClazzMap.get(resource);

                if (!resourceClass) throw new Error('Please check @Inject target is exists.');

                return resourceClass;
            },
        };
    };
}
