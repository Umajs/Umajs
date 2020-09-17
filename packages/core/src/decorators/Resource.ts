import ResourceLoader from '../loader/ResourceLoader';
import typeHelper from '../utils/typeHelper';

export const ResourceClazzMap: Map<Function, any[]> = new Map();

/**
 * 修饰 class
 * @param props 实例化参数
 */
export function Resource(...props: any[]): Function {
    return function resource(target: Function): any {
        ResourceClazzMap.set(target, props);
    };
}

/**
 * 将实例化后的类注入使用
 * @param resourceName 资源文件名
 */
export function Inject(resource: string | Function): Function {
    return function inject(target: Function, property: string, desc: PropertyDescriptor): any {
        const resourceName = typeHelper.isString(resource) ? resource : resource.name;

        if (!typeHelper.isUndef(desc)) {
            throw new Error(`Please check @Inject(${resourceName})/${property} used on Class's property.`);
        }

        return {
            get() {
                const resourceClass = ResourceLoader.getResource(resource);

                if (!resourceClass) throw new Error(`Please check ${resource}.*.ts is exists.`);

                return resourceClass;
            },
        };
    };
}
