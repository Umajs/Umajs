import { IProceedJoinPoint } from '@umajs/core';

export async function method(proceedPoint: IProceedJoinPoint<any>) {
    console.log('method: this is around');
    const result = await proceedPoint.proceed();
    console.log('method: this is around after');

    return result;
}