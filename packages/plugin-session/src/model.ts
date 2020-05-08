
interface DEFAULT_OPTION{
    key: string;
    maxAge: number;
    secret: string;
    overWrite: boolean;
}

export class FormatOpts {
    public key: string;

    public maxAge: number;

    public secret: string;

    public overWrite: boolean;

    constructor(opts: DEFAULT_OPTION) {
        // 默认保存一天
        const ONE_DAY = 24 * 60 * 60 * 1000;

        // 设置cookie中，保存session的字段名称，默认为connect.sid
        this.key = opts.key || 'uma:sess';

        // 有效存放时间
        this.maxAge = opts.maxAge || ONE_DAY;

        // 通过设置的secret字符串，来计算hash值并放在cookie中，使产生的signedCookie防篡改
        this.secret = opts.secret || 'uma:sess';

        // 是否默认覆盖
        this.overWrite = opts.overWrite || true;
    }
}
