import { Router } from "express";
import { PaymentController } from "../controllers/paymentController";
import { container } from "../containers";

const router = Router();

const paymentController = container.resolve(PaymentController);

router.post('/payment/razorpay/order', paymentController.creatOrderRPay);
router.post('/payment/razorpay/verify', paymentController.verifyRPayOrder);
router.post('/payment/stripe/order', paymentController.creatOrderStripe);
router.post('/payment/stripe/verify', paymentController.verifyStripeOrder);
router.post('/payment/wallet/pay', paymentController.walletPay);
router.get('/payment/wallet/:id', paymentController.walletDetails);

export default router;
