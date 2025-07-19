import { container } from "tsyringe";
import { IBookingService } from "../services/interfaces/IBookingService";
import { BookingService } from "../services/implementation/bookingService";
import { IPaymentService } from "../services/interfaces/IPaymentService";
import { PaymentService } from "../services/implementation/paymentService";


export function registerServices() {
    container.register<IBookingService>("IBookingService", {useClass: BookingService});
    container.register<IPaymentService>("IPaymentService", {useClass: PaymentService});
}