# Commerce System

## Pricing
The course table is the single source of truth for pricing. The client only passes `courseId`.

## Coupon System
Coupons are evaluated entirely server-side.
- Fields: `code`, `discountPercent`, `isActive`, `expiresAt`.
- Validation checks: Expiration date, active status, validity.

## Database Models
- **Order**: Tracks user, course, total amount, applied coupon, and overarching status (`PENDING`, `PAID`, `FAILED`, `REFUNDED`).
- **Payment**: Tracks individual transaction attempts with a gateway provider (`Razorpay`, `Stripe`) including provider reference IDs.
- **Coupon**: Defines promotional discounts.
