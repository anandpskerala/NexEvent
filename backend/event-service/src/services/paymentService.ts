import Stripe from "stripe";
import RPay from "razorpay";
import { PaymentRepository } from "../repositories/PaymentRepository";
import { WalletRepository } from "../repositories/WalletRepository";
import { config } from "../config";

export class PaymentService {
    private stripe: Stripe;
    private razorpay: RPay;
    constructor(private repo: PaymentRepository, private walletRepo: WalletRepository) {
        this.razorpay = new RPay({
            key_id: config.payment.razorpayID,
            key_secret: config.payment.razorpaySecret
        });

        this.stripe = new Stripe(config.payment.stripeSecret as string, {
            typescript: true
        })
    }
}