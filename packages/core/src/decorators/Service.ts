import ServiceLoader from '../loader/ServiceLoader';

/**
 * 注入 service
 * @param serviceName 文件名
 */
export function Service(serviceName: string): Function {
    return function service(): any {
        return {
            get() {
                return Reflect.construct(ServiceLoader.getService(serviceName), [this.ctx]);
            },
        };
    };
}
