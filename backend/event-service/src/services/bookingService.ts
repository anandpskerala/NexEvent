import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { StatusCode } from '../shared/constants/statusCode';
import { BookingRepository } from '../repositories/BookingRepository';
import { EventRepository } from '../repositories/EventRepository';
import { IBooking } from '../shared/types/IBooking';
import { Response } from 'express';
import { fetchUsers } from '../shared/utils/getUsers';
import { PaymentRepository } from '../repositories/PaymentRepository';
import { PaymentMethod, PaymentStatus } from '../shared/types/Payments';
import { WalletRepository } from '../repositories/WalletRepository';

export class BookingService {
    constructor(private repo: BookingRepository, private eventRepo: EventRepository, private paymentRepo: PaymentRepository, private walletRepo: WalletRepository) { }

    public async createBooking(data: IBooking) {
        try {
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
                    message: "Fill all the required fields",
                    status: StatusCode.BAD_REQUEST
                }
            }

            if (outOfStock) {
                return {
                    message: "Ticket for the event is currently out of stock",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const booking = await this.repo.create(data);
            return {
                message: "Booking initiated",
                status: StatusCode.CREATED,
                booking
            }

        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getBooking(id: string) {
        try {
            const booking = await this.repo.findBooking(id);
            return {
                message: "Booking fetched",
                status: StatusCode.OK,
                booking
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getBookings(userId: string, page: number, limit: number) {
        try {
            const skip = (page - 1) * limit;
            const res = await this.repo.findByUserID(userId, skip, limit);
            return {
                message: "Fetched bookings",
                status: StatusCode.OK,
                bookings: res.items,
                total: res.total,
                pages: Math.ceil(res.total / limit)
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async cancelBooking(bookingId: string) {
        try {
            await this.repo.cancelBooking(bookingId);
            const doc = await this.paymentRepo.changeStatus(bookingId, PaymentStatus.REFUNDED);
            await this.walletRepo.credit(doc?.userId as string, doc?.amount as number);
            return {
                message: "Tickets cancelled",
                status: StatusCode.OK
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async failedBooking(bookingId: string, eventId: string, amount: number, currency: string, userId: string) {
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
                message: "Payment Failed",
                status: StatusCode.OK
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }


    public async downloadTicket(bookingId: string, res: Response) {
        try {
            const booking = await this.repo.findBooking(bookingId);
            if (!booking) {
                return res.status(StatusCode.NOT_FOUND).json({
                    message: "Booking not found"
                });
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=ticket-${bookingId}.pdf`);

            const doc = new PDFDocument();
            doc.pipe(res);

            doc.fontSize(24).text('Event Ticket', { align: 'center' });
            doc.moveDown();
            doc.fontSize(16).text(`Event: ${booking.eventId.title}`);
            doc.text(`Date: ${new Date(booking.eventId.startDate as string).toDateString()}`);
            doc.text(`Location: ${booking.eventId.location.place}`);
            doc.text(`Total Amount: ₹${booking.totalAmount}`);
            doc.text(`Order ID: ${booking.orderId}`);
            doc.moveDown().text(`Thank you for your booking!`);

            const qrData = `OrderID:${booking.orderId},Event:${booking.eventId.title}`;
            const qrImage = await QRCode.toDataURL(qrData);
            doc.image(qrImage, { fit: [100, 100], align: 'center' });

            doc.end();
        } catch (error) {
            console.error(error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error"
            });
        }
    }

    public async getOrganizerBookings(userId: string, search: string, page: number, limit: number) {
        try {
            const skip = (page - 1) * limit;
            const events = await this.eventRepo.getAllEvents({ userId }, skip, limit);
            const eventIds = events.map(event => event.id);

            if (eventIds.length === 0) {
                return {
                    message: "No Bookings",
                    status: StatusCode.OK,
                    bookings: []
                }
            }

            const bookings = await this.repo.getBookingWithQuery({ $or: [
                {orderId: {$regex: search, $options: "i"}}
            ], eventId: { $in: eventIds } }, skip, limit);
            const userIds = [...new Set(bookings.items.map(b => b.userId))];

            const userMap = await fetchUsers(userIds);
            const enrichedBookings = bookings.items.map(booking => ({
                ...booking,
                user: userMap[booking.userId] || null
            }));

            return {
                message: "Bookings found",
                status: StatusCode.OK,
                bookings: enrichedBookings,
                total: bookings.total,
                page,
                pages: Math.ceil(bookings.total / limit)
            }
        } catch (error) {
            console.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }


    public async checkCouponApplied(promoCode: string, userId: string) {
        try {
            const applied = await this.repo.checkForPromoCode(promoCode, userId);
            if (!applied) {
                return {
                    message: "Eligibile for applying",
                    status: StatusCode.OK
                }
            }

            return {
                message: "You have already applied this coupon",
                status: StatusCode.BAD_REQUEST
            }
        } catch (error) {
            console.error(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}