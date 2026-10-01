# Payment Architecture

## Order Lifecycle
1. **Creation**: Client calls `POST /api/checkout/create-order` with `courseId` and optional `couponCode`.
2. **Server Validation**: The server validates the course status, price, and coupon validity. Never trust client-provided amounts.
3. **Local Order**: A pending order is created in the database.
4. **Gateway Order**: A corresponding order is initiated with the Payment Gateway (e.g., Razorpay).

## Payment Verification
1. **Client Callback**: Client receives success from Gateway SDK and calls `POST /api/payments/verify`.
2. **Idempotent Verification**: The server verifies the transaction, ensures it hasn't been processed, updates order status, and logs a `Payment` record.
3. **Enrollment**: Once verified, the `Enrollment` record is created.

## Webhooks
- **Endpoint**: `POST /api/payments/webhook`
- **Security**: Validates `x-razorpay-signature` against `RAZORPAY_WEBHOOK_SECRET`.
- **Functionality**: Catches edge cases where the client drops off before reaching the success page. Ensures exactly-once enrollment creation.

## Refund Architecture
- Admin can invoke `POST /api/admin/orders/[id]/refund`.
- The order status is transitioned to `REFUNDED` and the associated `Enrollment` is deleted.
