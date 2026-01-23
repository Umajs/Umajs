export interface ILogger {
    debug(message: string, ...args: any[]): void;

    info(message: string, ...args: any[]): void;

    warn(message: string, ...args: any[]): void;

    error(message: string | Error, ...args: any[]): void;
}

export class ConsoleLogger implements ILogger {
    debug(message: string, ...args: any[]): void {
        console.debug(message, ...args);
    }

    info(message: string, ...args: any[]): void {
        console.log(message, ...args);
    }

    warn(message: string, ...args: any[]): void {
        console.warn(message, ...args);
    }

    error(message: string | Error, ...args: any[]): void {
        console.error(message, ...args);
    }
}
