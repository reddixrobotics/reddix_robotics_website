export declare class MailService {
    private readonly logger;
    private transporter;
    constructor();
    private initTransporter;
    sendMail(to: string, subject: string, body: string): Promise<void>;
    sendPasswordResetEmail(email: string, resetLink: string): Promise<void>;
    sendLoginAlert(email: string, ipAddress: string, userAgent: string): Promise<void>;
    sendEmailOtp(email: string, otp: string): Promise<void>;
    sendTwoFactorStatusShift(email: string, enabled: boolean): Promise<void>;
}
