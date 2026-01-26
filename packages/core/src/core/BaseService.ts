import { IContext } from '../types/IContext';

/**
 * Base service class
 * Services should extend this class to access context
 */
export class BaseService {
    constructor(readonly ctx: IContext) {
    }
}
