import { Request, Response } from "express";
import { IPaymentService } from "../services/interfaces/IPaymentService";

export class PaymentController {
    constructor(private paymentService: IPaymentService) {}

    public creatOrderRPay = async (req: Request, res: Response): Promise<void> => {
        const { amount, currency } = req.body;
        const result = await this.paymentService.createRPayOrder(amount, currency);
        res.status(result.status).json({ message: result.message, order: result.order });
    }

    public creatOrderStripe = async (req: Request, res: Response): Promise<void> => {
        const { eventId, tickets, promoCode, paymentMethod, currency, amount, bookingId, orderId } = req.body;
        const result = await this.paymentService.createStripeOrder(eventId, tickets, amount, currency, promoCode, paymentMethod, bookingId, orderId);
        res.status(result.status).json({ message: result.message, order: result.checkoutUrl });
    }


    public verifyRPayOrder = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId, bookingId, amount, currency } = req.body;
        const verify = await this.paymentService.verifyRPayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, eventId, bookingId, currency, amount);
        res.status(verify.status).json({message: verify.message, paymentId: verify.payment?.orderId})
    }

    public verifyStripeOrder = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { sessionId } = req.body;
        const verify = await this.paymentService.verifyStripeOrder(userId, sessionId);
        res.status(verify.status).json({message: verify.message, paymentId: verify.orderId});
    }

    public walletPay = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { eventId, currency, amount, bookingId } = req.body;
        const result = await this.paymentService.pay(userId, eventId, currency, Number(amount), bookingId);
        res.status(result.status).json({message: result.message, paymentId: result.payment?.id})
    }

    public walletDetails = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const result = await this.paymentService.getWalletDetails(id);
        res.status(result.status).json({message: result.message, wallet: result.wallet});
    }
}