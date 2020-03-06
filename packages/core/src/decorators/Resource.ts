import ResourceLoader from '../loader/ResourceLoader';

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
export function Inject(resourceName: string): Function {
    return function resource(): any {
        return {
            get() {
                return ResourceLoader.getResource(resourceName);
            },
        };
    };
}
