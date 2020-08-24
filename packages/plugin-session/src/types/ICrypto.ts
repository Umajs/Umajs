export interface ICrypto {
    encrypt(obj: any): string

    decrypt(str: string): { [key: string]: any }
}
