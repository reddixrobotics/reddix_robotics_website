export declare class CryptoService {
    private readonly encryptionKey;
    constructor();
    hashPassword(password: string): Promise<string>;
    verifyPassword(hash: string, plain: string): Promise<boolean>;
    encrypt(plaintext: string): string;
    decrypt(encryptedPayload: string): string;
}
