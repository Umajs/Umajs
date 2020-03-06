import Result from '../core/Result';

import { IJoinPoint } from './IJoinPoint';
import { IProceedJoinPoint } from './IProceedJoinPoint';

export interface IAspect {
    before?(point: IJoinPoint): void;
    after?(point: IJoinPoint): void;
    around?(proceedPoint: IProceedJoinPoint): Promise<Result>;
    afterReturning?(point: IJoinPoint, val: any): void;
    afterThrowing?(err: Error): void;
}
