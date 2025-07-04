import { FilterQuery } from "mongoose";
import { IBooking } from "../../shared/types/IBooking";
import { GroupBy, RevenueAnalyticsGraphPoint, TopSelling } from "../../shared/types/RevenueAnalytics";

export interface IBookingRepository {
    findBooking(id: string): Promise<IBooking | undefined>;
    findByUserID(userId: string, skip: number, limit: number): Promise<{items: IBooking[], total: number}>;
    cancelBooking(bookingId: string): Promise<void>;
    getBookingWithQuery(query: FilterQuery<IBooking>, skip: number, limit: number): Promise<{items: IBooking[], total: number}>;
    findBookingsByEventID(eventId: string): Promise<IBooking[]>;
    checkForPromoCode(couponCode: string, userId: string): Promise<boolean>;
    findByID(id: string): Promise<IBooking | undefined>;
    create(item: IBooking): Promise<IBooking>;
    update(id: string, item: Partial<IBooking>): Promise<void>;
    delete(id: string): Promise<void>;
    getRevenueAnalytics(groupBy: GroupBy, organizerId?: string): Promise<RevenueAnalyticsGraphPoint[]>;
    getTopBookings(groupBy: GroupBy, limit: number, organizerId?: string): Promise<TopSelling[]>;
    findWithUserIdAndEventId(userId: string, eventId: string): Promise<IBooking | undefined>;
    countBooking(userId: string, eventId: string): Promise<number>;
}