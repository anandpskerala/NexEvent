import { StripeReturnType, PaymentReturnType, RPayReturnType, WalletReturnType } from "../../shared/types/returnTypes";

export interface IPaymentService {
    createStripeOrder(
        eventId: string,
        tickets: Record<string, { ticketId: string, name: string; price: number, quantity: number }>,
        amount: number,
        currency: string,
        promoCode: string,
        paymentMethod: string,
        bookingId: string,
        orderId: string
    ): Promise<StripeReturnType>;
    verifyStripeOrder(userId: string, sessionId: string): Promise<PaymentReturnType>;
    createRPayOrder(amount: number, currency: string): Promise<RPayReturnType>;
    verifyRPayPayment(
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string,
        userId: string,
        eventId: string,
        bookingId: string,
        currency: string,
        amount: number
    ): Promise<PaymentReturnType>;
    pay(
        userId: string,
        eventId: string,
        currency: string,
        amount: number,
        bookingId: string
    ): Promise<PaymentReturnType>;
    getWalletDetails(userId: string): Promise<WalletReturnType>
}