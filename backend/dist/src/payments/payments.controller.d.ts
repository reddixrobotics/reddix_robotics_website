import { PaymentsService } from './payments.service';
import { Request } from 'express';
interface RequestWithUser extends Request {
    user: {
        id: string;
        email: string;
        role: string;
    };
}
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createOrder(req: RequestWithUser, orderId: string): Promise<{
        orderId: any;
        amount: any;
        currency: any;
        keyId: string | undefined;
    }>;
    verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, signature: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};
