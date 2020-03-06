import { IAspect, IJoinPoint, IProceedJoinPoint, Result } from '@ursajs/core';

export default class implements IAspect {
    before() {
        console.log('method: this is before');
    }
    after() {
        console.log('method: this is after');
    }
    async around(proceedPoint: IProceedJoinPoint<any>) {
        console.log('method: this is around');
        const result = await proceedPoint.proceed();
        console.log('method: this is around after');

        return result;
    }
    afterThrowing(e: Error) {
        console.log('method: this is afterThrowing', e);
    }
    afterReturning(point: IJoinPoint<any>, result: any) {
        console.log('method: this is afterReturning:', result);
    }
}