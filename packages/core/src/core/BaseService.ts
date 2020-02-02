import { IContext } from '../types/IContext';

export class BaseService {
    constructor(readonly ctx: IContext) {
    }
}
