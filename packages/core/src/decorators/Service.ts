import { BaseController } from '../core/BaseController';
import ServiceLoader from '../loader/ServiceLoader';
import typeHelper from '../utils/typeHelper';


/**
 * 注入 service
 * @param serviceName 文件名
 */
export function Service(service: string | Function): Function {
    return function s(target: Function, property: string, desc: PropertyDescriptor): any {
        const serviceName = typeHelper.isString(service) ? service : service.name;

        if (!(target instanceof BaseController) || !typeHelper.isUndef(desc)) {
            throw new Error(`Please check @Service(${serviceName})/${property} used on Controller's property, and Controller extends BaseController.`);
        }

        return {
            get() {
                const serviceClass = typeHelper.isString(service) ? ServiceLoader.getService(service) : service;

                if (!serviceClass) throw new Error(`Please check ${service}.service.ts is exists and extends BaseService.`);

                return Reflect.construct(serviceClass, [this.ctx]);
            },
        };
    };
}
