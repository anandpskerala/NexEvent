import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { IBooking } from "../../shared/types/IBooking";
import { IEvent } from "../../shared/types/IEvent";

export interface IBookingRepository {
    findBooking(id: string): Promise<IBooking | undefined>;
    findByUserID(userId: string, skip: number, limit: number): Promise<{items: IBooking[], total: number}>;
    cancelBooking(bookingId: string): Promise<void>;
    getBookingWithQuery(query: FilterQuery<IBooking>, skip: number, limit: number): Promise<{items: IBooking[], total: number}>;
    findBookingsByEventID(eventId: string): Promise<IBooking[]>;
    checkForPromoCode(couponCode: string, userId: string): Promise<boolean>;
    findByID(id: string): Promise<IBooking | undefined>;
    create(item: Partial<IBooking>, session?: mongoose.ClientSession): Promise<IBooking>;
    update(id: string, item: Partial<IBooking>): Promise<void>;
    delete(id: string): Promise<void>;
    findWithUserIdAndEventId(userId: string, eventId: string): Promise<IBooking | undefined>;
    countBooking(userId: string, eventId: string): Promise<number>;
    findByEventID(id: string): Promise<IEvent | undefined>;
    updateTickets(eventId: string, ticketId: string, quantity: number, session?: mongoose.ClientSession): Promise<void>;
    updateEvent(id: string, event: Partial<IEvent>): Promise<void>;
    getAllEvents(query: FilterQuery<IEvent>, skip: number, limit: number, sortFilter?: Record<string, SortOrder>): Promise<IEvent[]>;
    checkStock(eventId: string, ticketId: string, stock: number): Promise<boolean>
}