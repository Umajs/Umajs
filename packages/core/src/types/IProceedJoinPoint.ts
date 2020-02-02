import { IJoinPoint } from './IJoinPoint';

export interface IProceedJoinPoint<T = any> extends IJoinPoint<T> {
    proceed(...props: any[]): Promise<any>;
}
