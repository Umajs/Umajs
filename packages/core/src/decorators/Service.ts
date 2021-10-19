import { BaseController } from '../core/BaseController';
import { BaseService } from '../core/BaseService';
import typeHelper from '../utils/typeHelper';

/**
 * 注入 service
 * @param serviceName 文件名
 */
export function Service<T extends typeof BaseService>(service: T): Function {
    return function s(target: T, property: string, desc: PropertyDescriptor): any {
        if (!(target instanceof BaseController) || !typeHelper.isUndef(desc)) {
            throw new Error(`Please check @Service(${service.name})/${property} used on Controller's property, and Controller extends BaseController.`);
        }

        return {
            get() {
                return Reflect.construct(service, [this.ctx]);
            },
        };
    };
}
