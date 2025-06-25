import { IEvent } from "./IEvent";

export type PaymentMethod = 'razorpay' | 'stripe' | 'wallet'

export interface IBooking {
    id?: string;
    userId: string;
    eventId: IEvent;
    paymentId?: string;
    orderId?: string;
    tickets: { ticketId: string; quantity: number, name: string, price: number }[];
    totalAmount: number;
    paymentMethod: PaymentMethod;
    status?: 'pending' | 'paid' | 'failed' | 'cancelled';
    couponCode?: string;
    createdAt?: Date;
    updatedAt?: Date;
}