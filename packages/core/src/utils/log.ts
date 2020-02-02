import * as util from 'util';
import * as fmt from 'dateformat';

enum colors {
    info= '36',
    error= '31;1',
    warn= '33',
    debug= '90'
}

function log(msg: string, level: string): void {
    const m = `${color(fmt('HH:MM:ss'), '30;1')} ${msg}`;
    const c = colors[level.toLowerCase()] || '32';

    console.log(`[${color(level.toUpperCase(), c)}] ${m}`);
}

/**
 * @param s text
 * @param c color
 * @returns msg with color info
 */
function color(s: string, c: string): string {
    if (process.stdout.isTTY) {
        return `\x1B[${c}m${s}\x1B[0m`;
    }

    return s;
}

/**
 * Logs a message to the console. The level is displayed in ANSI colors,
 * either bright red in case of an error or green otherwise.
 */
export default class Log {
    useDebug: boolean

    constructor(config = { debug: false }) {
        this.useDebug = config.debug;
    }

    debug(...ops: string[]) {
        if (!this.useDebug) return;
        log(util.format.call(util, ...ops), 'debug');
    }

    info(...ops: string[]) {
        log(util.format.call(util, ...ops), 'info');
    }

    warn(...ops: string[]) {
        log(util.format.call(util, ...ops), 'warn');
    }

    error(...ops: string[]) {
        log(util.format.call(util, ...ops), 'error');
    }
}
