import type { Location } from "./FormState";
import type { User } from "./user";

export interface Booking {
    id: string;
    userId: string;
    user?: User;
    eventId: IEvent;
    paymentId: string;
    orderId: string;
    tickets: { ticketId: string; quantity: number, name: string, price: number }[];
    totalAmount: number;
    paymentMethod: 'razorpay' | 'stripe' | 'wallet';
    status: 'pending' | 'paid' | 'failed' | 'cancelled';
    couponCode?: string;
    createdAt: string;
    updatedAt: string;
}

export interface IEvent {
    id: string;
    title: string;
    description: string;
    userId: string;
    image: string;
    category: string;
    eventType: string;
    tags: string[];
    eventFormat: string;
    entryType: string;
    currency: string;
    status: string;
    tickets: ITicket[]
    location: Location;
    showQuantity: boolean;
    refunds: boolean;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
}

export interface ITicket {
    id: string;
    name: string;
    type: string;
    price: number;
    quantity: number;
    description: string;
    startDate: Date;
    endDate: Date;
}