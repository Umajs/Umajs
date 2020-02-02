import ServiceLoader from '../loader/ServiceLoader';
import typeHelper from '../utils/typeHelper';


/**
 * 注入 service
 * @param serviceName 文件名
 */
export function Service(service: string | Function): Function {
    return function svc(): any {
        return {
            get() {
                const serviceClass = typeHelper.isString(service) ? ServiceLoader.getService(service) : service;

                return Reflect.construct(serviceClass, [this.ctx]);
            },
        };
    };
}
