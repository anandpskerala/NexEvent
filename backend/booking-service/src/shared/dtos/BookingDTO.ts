import { IBooking, PaymentMethod } from "../types/IBooking";
import { EventDTO, toEventDTO } from "./EventDTO";

export interface BookingDTO {
    id: string;
    userId: string;
    eventId: EventDTO;
    paymentId: string;
    orderId: string;
    tickets: { ticketId: string; quantity: number, name: string, price: number }[];
    totalAmount: number;
    paymentMethod: PaymentMethod;
    status: 'pending' | 'paid' | 'failed' | 'cancelled';
    couponCode?: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export const toBookingDTO = (entity: IBooking): BookingDTO => {
    return {
        id: entity.id as string,
        userId: entity.userId,
        eventId: toEventDTO(entity.eventId),
        paymentId: entity.paymentId as string,
        orderId: entity.orderId as string,
        tickets: entity.tickets,
        totalAmount: entity.totalAmount,
        paymentMethod: entity.paymentMethod,
        status: entity.status as 'pending' | 'paid' | 'failed' | 'cancelled',
        couponCode: entity.couponCode,
        expiresAt: entity.expiresAt as Date,
        createdAt: entity.createdAt as Date,
        updatedAt: entity.updatedAt as Date
    }
}