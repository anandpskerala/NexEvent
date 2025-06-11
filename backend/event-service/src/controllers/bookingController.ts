import { Request, Response } from "express";
import { BookingService } from "../services/bookingService";
import { IBooking } from "../shared/types/IBooking";

export class BookingController {
    constructor(private bookingService: BookingService) { }

    public create = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { eventId, tickets, totalAmount, paymentMethod, couponCode } = req.body;
        const data: IBooking = {
            userId,
            eventId,
            tickets,
            totalAmount,
            paymentMethod,
            couponCode
        };

        const result = await this.bookingService.createBooking(data);
        res.status(result.status).json({ message: result.message, booking: result.booking });
    }

    public getBooking = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const result = await this.bookingService.getBooking(id);
        res.status(result.status).json({ message: result.message, booking: result.booking });
    }

    public getBookings = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { page, limit } = req.query;
        const result = await this.bookingService.getBookings(id as string, Number(page), Number(limit));
        res.status(result.status).json(
            {
                message: result.message,
                bookings: result.bookings,
                page,
                total: result.total,
                pages: result.pages
            }
        )
    }

    public cancelBooking = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const result = await this.bookingService.cancelBooking(id);
        res.status(result.status).json({ message: result.message });
    }

    public failedBooking = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { eventId, bookingId, amount, currency } = req.body;
        const result = await this.bookingService.failedBooking(bookingId, eventId, amount, currency, userId);
        res.status(result.status).json({message: result.message});
    }

    public downloadTicket = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        await this.bookingService.downloadTicket(id, res);
    }

    public getOrganizerBookings = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { search = "", page = 1, limit = 10 } = req.query;
        const result = await this.bookingService.getOrganizerBookings(userId, search as string, Number(page), Number(limit));
        res.status(result.status).json(
            {
                message: result.message,
                bookings: result.bookings,
                page,
                total: result.total,
                pages: result.pages
            }
        );
    }

    public checkCoupon = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { couponCode } = req.query;
        console.log(couponCode, userId)
        const result = await this.bookingService.checkCouponApplied(couponCode as string, userId);
        res.status(result.status).json({ message: result.message });
    }
}