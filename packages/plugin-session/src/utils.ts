const crypto = require('crypto');

export function aseEncode(body, secret: string) {
    const data = JSON.stringify(body);

    // 使用指定的算法与密码来创建cipher对象
    const cipher = crypto.createCipher('aes192', secret);

    // 使用该对象的update方法来指定需要被加密的数据
    let crypted = cipher.update(data, 'utf-8', 'hex');

    crypted += cipher.final('hex');

    return crypted;
}

export function aseDecode(data, secret:string) {
    const decipher = crypto.createDecipher('aes192', secret);

    let decrypted = decipher.update(data, 'hex', 'utf-8');

    decrypted += decipher.final('utf-8');

    return JSON.parse(decrypted);
}
