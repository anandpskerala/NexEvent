import { container } from "tsyringe";
import { BookingController } from "../controllers/bookingController";
import { PaymentController } from "../controllers/paymentController";

export function registerControllers () {
    container.register<BookingController>(BookingController, {useClass: BookingController});
    container.register<PaymentController>(PaymentController, {useClass: PaymentController});
}