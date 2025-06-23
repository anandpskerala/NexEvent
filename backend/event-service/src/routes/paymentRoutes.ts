import { Router } from "express";
import { PaymentRepository } from "../repositories/PaymentRepository";
import { WalletRepository } from "../repositories/WalletRepository";
import { BookingRepository } from "../repositories/BookingRepository";
import { EventRepository } from "../repositories/EventRepository";
import { PaymentService } from "../services/paymentService";
import { PaymentController } from "../controllers/paymentController";

const router = Router();

const paymentRepo = new PaymentRepository();
const walletRepo = new WalletRepository();
const bookingRepo = new BookingRepository();
const eventRepo = new EventRepository();

const paymentService = new PaymentService(paymentRepo, walletRepo, bookingRepo, eventRepo);
const paymentController = new PaymentController(paymentService);

router.post('/payment/razorpay/order', paymentController.creatOrderRPay);
router.post('/payment/razorpay/verify', paymentController.verifyRPayOrder);
router.post('/payment/stripe/order', paymentController.creatOrderStripe);
router.post('/payment/stripe/verify', paymentController.verifyStripeOrder);
router.post('/payment/wallet/pay', paymentController.walletPay);
router.get('/payment/wallet/:id', paymentController.walletDetails);

export default router;
