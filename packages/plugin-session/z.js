const CryptoJS = require('crypto-js');

const secret = 'abc';

const crypto = {
    encrypt(obj) {
        return CryptoJS.AES.encrypt(JSON.stringify(obj), secret).toString();
    },
    decrypt(str) {
        const bytes = CryptoJS.AES.decrypt(str, secret);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    },
};

const rt = crypto.decrypt(crypto.encrypt({a: 1}));

console.log(rt);