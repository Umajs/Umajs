import { IAspect, IJoinPoint } from '@ursajs/core';

export default class implements IAspect {
    before() {
        console.log('test: this is before');
    }
    after() {
        console.log('test: this is after');
    }
    async around({ proceed }) {
        console.log('test: this is around before');
        const result = await proceed();
        console.log('test: this is around after');

        return result;
    }
    afterThrowing() {
        console.log('test: this is afterThrowing');
    }
    afterReturning(point:IJoinPoint<any>, result: any) {
        console.log('test: this is afterReturning:', result);
    }
}