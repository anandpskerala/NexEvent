import { Request, Response } from "express";
import { IPaymentService } from "../services/interfaces/IPaymentService";
import { inject, injectable } from "tsyringe";

@injectable()
export class PaymentController {
    constructor(@inject("IPaymentService") private _paymentService: IPaymentService) {}

    public creatOrderRPay = async (req: Request, res: Response): Promise<void> => {
        const { amount, currency } = req.body;
        const result = await this._paymentService.createRPayOrder(amount, currency);
        res.status(result.status).json({ message: result.message, order: result.order });
    }

    public creatOrderStripe = async (req: Request, res: Response): Promise<void> => {
        const { eventId, tickets, promoCode, paymentMethod, currency, amount, bookingId, orderId } = req.body;
        const result = await this._paymentService.createStripeOrder(eventId, tickets, amount, currency, promoCode, paymentMethod, bookingId, orderId);
        res.status(result.status).json({ message: result.message, order: result.checkoutUrl });
    }


    public verifyRPayOrder = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId, bookingId, amount, currency } = req.body;
        const verify = await this._paymentService.verifyRPayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, eventId, bookingId, currency, amount);
        res.status(verify.status).json({message: verify.message, paymentId: verify.payment?.orderId})
    }

    public verifyStripeOrder = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { sessionId } = req.body;
        const verify = await this._paymentService.verifyStripeOrder(userId, sessionId);
        res.status(verify.status).json({message: verify.message, paymentId: verify.orderId});
    }

    public walletPay = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { eventId, currency, amount, bookingId } = req.body;
        const result = await this._paymentService.pay(userId, eventId, currency, Number(amount), bookingId);
        res.status(result.status).json({message: result.message, paymentId: result.payment?.id})
    }

    public walletDetails = async (req: Request, res: Response): Promise<void> => {
        const walletId = req.params.id;
        const result = await this._paymentService.getWalletDetails(walletId);
        res.status(result.status).json({message: result.message, wallet: result.wallet});
    }
}