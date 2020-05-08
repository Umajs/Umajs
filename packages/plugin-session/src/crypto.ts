import * as CryptoJS from 'crypto-js';

export const cryptoJS = (secret: string) => ({
    encrypt(obj: any) {
        return CryptoJS.AES.encrypt(JSON.stringify(obj), secret).toString();
    },
    decrypt(str: string) {
        const bytes = CryptoJS.AES.decrypt(str, secret);

        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    },
});
