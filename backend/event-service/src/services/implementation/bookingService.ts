import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { StatusCode } from '../../shared/constants/statusCode';
import { IBooking } from '../../shared/types/IBooking';
import { Response } from 'express';
import { fetchUsers } from '../../shared/utils/getUsers';
import { PaymentMethod, PaymentStatus } from '../../shared/types/Payments';
import logger from '../../shared/utils/logger';
import { IBookingRepository } from '../../repositories/interfaces/IBookingRepository';
import { IEventRepository } from '../../repositories/interfaces/IEventRepository';
import { IPaymentRepository } from '../../repositories/interfaces/IPaymentRepository';
import { IWalletRepository } from '../../repositories/interfaces/IWalletRepository';
import { BookingPaginationType, BookingReturnType, BookingVerifyType } from '../../shared/types/ReturnType';
import { config } from '../../config';
import { HttpResponse } from '../../shared/constants/httpResponse';

export class BookingService {
    constructor(
        private repo: IBookingRepository, 
        private eventRepo: IEventRepository, 
        private paymentRepo: IPaymentRepository, 
        private walletRepo: IWalletRepository
    ) { }

    public async createBooking(data: IBooking): Promise<BookingReturnType> {
        try {
            const count = await this.repo.countBooking(data.userId, typeof data.eventId === 'string' ? data.eventId: data.eventId.id as string);
            console.log(count)
            if (count > config.maxTicketLimit) {
                return {
                    message: HttpResponse.MAX_TICKET_LIMIT,
                    status: StatusCode.BAD_REQUEST
                }
            }
            let outOfStock = false;
            if (data?.tickets && data?.eventId && data?.tickets) {
                data.tickets.forEach(async (ticketData) => {
                    const check = await this.eventRepo.checkStock(data.eventId.toString(), ticketData.ticketId, ticketData.quantity);
                    if (!check) {
                        outOfStock = true;
                    }
                })
            } else {
                return {
                    message: HttpResponse.MISSING_FIELDS,
                    status: StatusCode.BAD_REQUEST
                }
            }

            if (outOfStock) {
                return {
                    message: HttpResponse.OUT_OF_STOCK,
                    status: StatusCode.BAD_REQUEST
                }
            }

            if (!data.paymentMethod) {
                data.paymentMethod = "wallet";
                data.status = "paid";

                const event = await this.eventRepo.findByID(typeof data.eventId == "string" ? String(data.eventId): String(data.eventId.id));
                if (event?.tickets) {
                    for (const bookedTicket of data.tickets) {
                        await this.eventRepo.updateTickets(event.id?.toString() as string, bookedTicket.ticketId, bookedTicket.quantity);
                    }
                }
            }
            const booking = await this.repo.create(data);
            return {
                message: HttpResponse.BOOKING_INITIATED,
                status: StatusCode.CREATED,
                booking
            }

        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getBooking(id: string): Promise<BookingReturnType> {
        try {
            const booking = await this.repo.findBooking(id);
            return {
                message: HttpResponse.BOOKING_FETCHED,
                status: StatusCode.OK,
                booking
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getBookings(userId: string, page: number, limit: number): Promise<BookingPaginationType> {
        try {
            const skip = (page - 1) * limit;
            const res = await this.repo.findByUserID(userId, skip, limit);
            return {
                message: HttpResponse.BOOKING_FETCHED,
                status: StatusCode.OK,
                bookings: res.items,
                total: res.total,
                pages: Math.ceil(res.total / limit)
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async cancelBooking(bookingId: string): Promise<BookingReturnType> {
        try {
            await this.repo.cancelBooking(bookingId);
            const doc = await this.paymentRepo.changeStatus(bookingId, PaymentStatus.REFUNDED);
            if (!doc?.amount &&  Number(doc?.amount) > 0) {
                await this.walletRepo.credit(doc?.userId as string, doc?.amount as number);
            }
            return {
                message: HttpResponse.TICKETS_CANCELLED,
                status: StatusCode.OK
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async cancelAllBookings(eventId: string): Promise<BookingReturnType> {
        try {
            const bookings = await this.repo.findBookingsByEventID(eventId);
            await this.eventRepo.updateEvent(eventId, {status: "cancelled"})
            if (!bookings || bookings.length === 0) {
                return {
                    message: HttpResponse.ALL_CANCELLED,
                    status: StatusCode.OK
                };
            }

            for (const booking of bookings) {
                const bookingId = booking.id;
                await this.repo.cancelBooking(bookingId as string);
                const paymentDoc = await this.paymentRepo.changeStatus(bookingId as string, PaymentStatus.REFUNDED);

                if (paymentDoc && paymentDoc.amount > 0) {
                    await this.walletRepo.credit(paymentDoc.userId, paymentDoc.amount);
                }
            }

            return {
                message: HttpResponse.ALL_CANCELLED,
                status: StatusCode.OK
            };
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async failedBooking(bookingId: string, eventId: string, amount: number, currency: string, userId: string): Promise<BookingReturnType> {
        try {
            const booked = await this.paymentRepo.upsert(bookingId, {
                userId,
                eventId,
                bookingId,
                method: PaymentMethod.RAZORPAY,
                amount: amount / 100,
                currency,
                status: PaymentStatus.FAILED
            });

            if (booked) {
                await this.repo.update(booked.bookingId, {
                    paymentId: booked.id,
                    paymentMethod: booked.method,
                    status: PaymentStatus.FAILED
                })
            }

            return {
                message: HttpResponse.PAYMENT_FAILED,
                status: StatusCode.OK
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }


    public async downloadTicket(bookingId: string, res: Response): Promise<void> {
        try {
            const booking = await this.repo.findBooking(bookingId);
            if (!booking) {
                res.status(StatusCode.NOT_FOUND).json({
                    message: HttpResponse.BOOKING_NOT_FOUND
                });
                return;
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=ticket-${bookingId}.pdf`);

            const doc = new PDFDocument();
            doc.pipe(res);

            doc.fontSize(24).text('Event Ticket', { align: 'center' });
            doc.moveDown();
            doc.fontSize(16).text(`Event: ${booking.eventId.title}`);
            doc.text(`Date: ${new Date(booking.eventId.startDate as string).toDateString()}`);
            doc.text(`Location: ${booking.eventId?.location?.place || "Virtual"}`);
            doc.text(`Total Amount: ₹${booking.totalAmount}`);
            doc.text(`Order ID: ${booking.orderId}`);
            doc.moveDown().text(`Thank you for your booking!`);

            const qrData = `OrderID:${booking.orderId},Event:${booking.eventId.title}`;
            const qrImage = await QRCode.toDataURL(qrData);
            doc.image(qrImage, { fit: [100, 100], align: 'center' });

            doc.end();
        } catch (error) {
            logger.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                message: HttpResponse.INTERNAL_SERVER_ERROR
            });
        }
    }

    public async getOrganizerBookings(userId: string, search: string, page: number, limit: number): Promise<BookingPaginationType> {
        try {
            const skip = (page - 1) * limit;
            const events = await this.eventRepo.getAllEvents({ userId }, skip, 0);
            const eventIds = events.map(event => event.id);

            if (eventIds.length === 0) {
                return {
                    message: HttpResponse.NO_BOOKINGS,
                    status: StatusCode.OK,
                    bookings: []
                }
            }

            const bookings = await this.repo.getBookingWithQuery({
                $or: [
                    { orderId: { $regex: search, $options: "i" } }
                ], eventId: { $in: eventIds }
            }, skip, limit);
            const userIds = [...new Set(bookings.items.map(b => b.userId))];

            const userMap = await fetchUsers(userIds);
            const enrichedBookings = bookings.items.map(booking => ({
                ...booking,
                user: userMap[booking.userId] || null
            }));

            return {
                message: HttpResponse.BOOKINGS_FOUND,
                status: StatusCode.OK,
                bookings: enrichedBookings,
                total: bookings.total,
                page,
                pages: Math.ceil(bookings.total / limit)
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async verifyBooking(userId: string, eventId: string): Promise<BookingVerifyType> {
        try {
            const result = await this.repo.findWithUserIdAndEventId(userId, eventId);
            if (!result) {
                return {
                    message: HttpResponse.NOT_PURCHASED,
                    status: StatusCode.NOT_FOUND
                }
            }
            return {
                message: HttpResponse.BOOKING_FETCHED,
                status: StatusCode.OK,
                verified: true
            };
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }


    public async checkCouponApplied(promoCode: string, userId: string): Promise<BookingReturnType> {
        try {
            const applied = await this.repo.checkForPromoCode(promoCode, userId);
            if (!applied) {
                return {
                    message: HttpResponse.COUPON_ELIGIBLE,
                    status: StatusCode.OK
                }
            }

            return {
                message: HttpResponse.ALREADY_APPLIED,
                status: StatusCode.BAD_REQUEST
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}