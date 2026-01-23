export class UmaError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'UmaError';
    }
}
