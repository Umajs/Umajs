import * as CryptoJS from 'crypto-js';

import { ICrypto } from './types/ICrypto';

export default class Crypto implements ICrypto {
    constructor(readonly secret: string) { }

    encrypt(obj: any): string {
        return CryptoJS.AES.encrypt(JSON.stringify(obj), this.secret).toString();
    }

    decrypt(str: string): { [key: string]: any; } {
        const bytes = CryptoJS.AES.decrypt(str, this.secret);

        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
}
