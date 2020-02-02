export type TJsonpBody = {
    limit?: number,
    replacer?: (this: any, key: string, value: any) => any,
    space?: string | number,
};
