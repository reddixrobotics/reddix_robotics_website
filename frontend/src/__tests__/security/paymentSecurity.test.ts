import { describe, it, expect } from 'vitest';

export function validatePaymentPayload(payload: {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}): { valid: boolean; error?: string } {
  if (!payload.razorpay_order_id || !payload.razorpay_payment_id || !payload.razorpay_signature) {
    return { valid: false, error: 'Missing required payment verification fields' };
  }

  // Regex checks for standard Razorpay identifiers
  if (!payload.razorpay_order_id.startsWith('order_')) {
    return { valid: false, error: 'Invalid order ID format' };
  }

  if (!payload.razorpay_payment_id.startsWith('pay_')) {
    return { valid: false, error: 'Invalid payment ID format' };
  }

  if (payload.razorpay_signature.length < 32) {
    return { valid: false, error: 'Invalid signature format' };
  }

  return { valid: true };
}

export function constructHmacPayload(orderId: string, paymentId: string): string {
  return `${orderId}|${paymentId}`;
}

describe('Razorpay Payment Verification Security', () => {
  it('rejects incomplete payment callback payloads', () => {
    expect(validatePaymentPayload({}).valid).toBe(false);
    expect(validatePaymentPayload({ razorpay_order_id: 'order_123' }).valid).toBe(false);
    expect(validatePaymentPayload({ razorpay_order_id: 'order_123', razorpay_payment_id: 'pay_123' }).valid).toBe(false);
  });

  it('rejects spoofed or malformed order/payment IDs', () => {
    const invalidOrder = validatePaymentPayload({
      razorpay_order_id: 'fake_order_123',
      razorpay_payment_id: 'pay_1234567890',
      razorpay_signature: 'abcdef1234567890abcdef1234567890abcdef1234567890',
    });
    expect(invalidOrder.valid).toBe(false);
    expect(invalidOrder.error).toBe('Invalid order ID format');

    const invalidPay = validatePaymentPayload({
      razorpay_order_id: 'order_1234567890',
      razorpay_payment_id: 'fake_pay_1234567890',
      razorpay_signature: 'abcdef1234567890abcdef1234567890abcdef1234567890',
    });
    expect(invalidPay.valid).toBe(false);
    expect(invalidPay.error).toBe('Invalid payment ID format');
  });

  it('validates genuine Razorpay payload structure correctly', () => {
    const valid = validatePaymentPayload({
      razorpay_order_id: 'order_LkJ987HgtF4567',
      razorpay_payment_id: 'pay_Mno654Pqr32109',
      razorpay_signature: '9b87c6e5d4a3b2c19b87c6e5d4a3b2c19b87c6e5d4a3b2c19b87c6e5d4a3b2c1',
    });
    expect(valid.valid).toBe(true);
  });

  it('constructs standard HMAC string matching razorpay specification', () => {
    const body = constructHmacPayload('order_123', 'pay_456');
    expect(body).toBe('order_123|pay_456');
  });
});
