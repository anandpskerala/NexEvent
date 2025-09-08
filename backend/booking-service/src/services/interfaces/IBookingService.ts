import { Response } from "express";
import { IBooking } from "../../shared/types/IBooking";
import { BookingReturnType, BookingPaginationType, BookingVerifyType } from "../../shared/types/ReturnType";

export interface IBookingService {
    createBooking(data: IBooking): Promise<BookingReturnType>;
    getBooking(id: string): Promise<BookingReturnType>;
    getBookings(userId: string, page: number, limit: number): Promise<BookingPaginationType>;
    cancelBooking(bookingId: string): Promise<BookingReturnType>;
    cancelAllBookings(eventId: string): Promise<BookingReturnType>;
    failedBooking(bookingId: string, eventId: string, amount: number, currency: string, userId: string): Promise<BookingReturnType>;
    downloadTicket(bookingId: string, res: Response): Promise<void>;
    getOrganizerBookings(userId: string, search: string, page: number, limit: number): Promise<BookingPaginationType>;
    verifyBooking(userId: string, eventId: string): Promise<BookingVerifyType>;
    checkCouponApplied(promoCode: string, userId: string): Promise<BookingReturnType>;
}