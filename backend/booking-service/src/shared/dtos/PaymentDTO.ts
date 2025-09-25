import { IPayment } from "../types/IPayment";
import { PaymentMethod, PaymentStatus } from "../types/Payments";


export interface PaymentDTO {
    id: string;
    userId: string;
    eventId: string;
    bookingId: string;
    orderId: string;
    paymentId: string;
    method: PaymentMethod;
    amount: number;
    currency: string;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
}

export const toPaymentDTO = (entity: IPayment): PaymentDTO => {
    return {
        id: entity.id as string,
        userId: entity.userId,
        eventId: entity.eventId,
        bookingId: entity.bookingId,
        orderId: entity.orderId as string,
        paymentId: entity.paymentId as string,
        method: entity.method,
        amount: entity.amount,
        currency: entity.currency,
        status: entity.status,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
    }
}