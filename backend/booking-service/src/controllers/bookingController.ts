import { Request, Response } from "express";
import { IBooking } from "../shared/types/IBooking";
import { IBookingService } from "../services/interfaces/IBookingService";
import { inject, injectable } from "tsyringe";

@injectable()
export class BookingController {
    constructor(@inject("IBookingService") private _bookingService: IBookingService) { }

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

        const result = await this._bookingService.createBooking(data);
        res.status(result.status).json({ message: result.message, booking: result.booking });
    }

    public getBooking = async (req: Request, res: Response): Promise<void> => {
        const bookingId = req.params.id;
        const result = await this._bookingService.getBooking(bookingId);
        res.status(result.status).json({ message: result.message, booking: result.booking });
    }

    public getBookings = async (req: Request, res: Response): Promise<void> => {
        const bookingId = req.params.id;
        const { page, limit } = req.query;
        const result = await this._bookingService.getBookings(bookingId as string, Number(page), Number(limit));
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
        const bookingId = req.params.id;
        const result = await this._bookingService.cancelBooking(bookingId);
        res.status(result.status).json({ message: result.message });
    }

    public cancelAllBookings = async(req: Request, res: Response): Promise<void> => {
        const bookingId = req.params.id;
        const result = await this._bookingService.cancelAllBookings(bookingId);
        res.status(result.status).json({message: result.message});
    }

    public failedBooking = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { eventId, bookingId, amount, currency } = req.body;
        const result = await this._bookingService.failedBooking(bookingId, eventId, amount, currency, userId);
        res.status(result.status).json({message: result.message});
    }

    public downloadTicket = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        await this._bookingService.downloadTicket(id, res);
    }

    public getOrganizerBookings = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { search = "", page = 1, limit = 10 } = req.query;
        const result = await this._bookingService.getOrganizerBookings(userId, search as string, Number(page), Number(limit));
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
        const result = await this._bookingService.checkCouponApplied(couponCode as string, userId);
        res.status(result.status).json({ message: result.message });
    }

    public verifyBooking =  async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { id } = req.params;
        const result = await this._bookingService.verifyBooking(userId, id);
        res.status(result.status).json({message: result.message, verified: result.verified});
    }
}