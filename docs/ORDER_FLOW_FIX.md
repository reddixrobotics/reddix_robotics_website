# E-Commerce Order Flow Fix Plan

## 1. Inspection & Analysis

### Existing Flow
1. **Frontend `CheckoutPage/PaymentPage`**: When the user enters their address and clicks to proceed, the frontend immediately calls `POST /api/orders` to create an `Order` in the database.
2. **Backend `OrdersController`**: Creates the order with default `status = ORDER_PLACED` and `paymentStatus = PENDING`.
3. **Frontend**: Calls `/api/payments/create-order` to generate a Razorpay order ID, and opens the Razorpay popup.
4. **My Orders Page (`DashboardOrders`)**: Calls `GET /api/orders` (mapped to `UserOrdersController` calling `OrdersService.findByUser`), which blindly returns all orders for that user ID, including abandoned checkouts (where payment failed or was cancelled).

### Webhook Analysis
I checked the backend for a Razorpay webhook (`payments.controller.ts`) and found no existing webhook implementation. The system currently relies entirely on the frontend callback calling `POST /api/payments/verify` with the Razorpay signature.

## 2. Implementation Plan

To satisfy the requirement of not showing abandoned/failed checkouts in "My Orders" while preserving the database architecture (idempotency, no duplicate orders):

1. **Modify `OrdersService.findByUser`**: Add a filter to exclude orders where `status: 'ORDER_PLACED'`. This ensures that abandoned checkouts (which naturally stop at this status) are never shown to the user on the frontend, fulfilling the requirement.
2. **Modify `PaymentsService.verifyPayment`**: When the backend verifies the Razorpay signature successfully, update the order `status` to `ORDER_CONFIRMED`.
3. **Idempotency**: `verifyPayment` already contains a check (`if (payment.status === 'SUCCESS') return`) which guarantees that if the frontend repeats the verification call (or if a webhook is added later), duplicate orders are not created.
4. **Refresh Handling**: Because the order is created before the Razorpay popup opens, refreshing the `OrderSuccessPage` simply fetches the existing confirmed order without creating duplicates.

## 3. Changes Made

I have already implemented the required backend changes:
1. Updated `src/orders/orders.service.ts` to filter out pending orders in the `findByUser` query.
2. Updated `src/payments/payments.service.ts` to set `status: 'ORDER_CONFIRMED'` alongside the existing `paymentStatus` update during verification.

## 4. Verification

*   **Successful Payment:** Triggers the verify endpoint, updates the status to `ORDER_CONFIRMED`, and exactly one order appears in My Orders.
*   **Failed/Cancelled Payment:** Leaves the status as `ORDER_PLACED`, meaning 0 completed orders appear in My Orders.
*   **Duplicate Callbacks:** The `verifyPayment` function halts early if the payment status is already `SUCCESS`.
*   **Security:** Unrelated logic and production keys were left untouched.
