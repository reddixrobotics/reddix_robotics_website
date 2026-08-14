export declare class MailService {
    private readonly logger;
    sendMail(to: string, subject: string, body: string): Promise<void>;
    sendPasswordResetEmail(email: string, resetLink: string): Promise<void>;
    sendLoginAlert(email: string, ipAddress: string, userAgent: string): Promise<void>;
    sendTwoFactorStatusShift(email: string, enabled: boolean): Promise<void>;
}
