import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { Response } from "express";
import { IBooking } from "../../shared/types/IBooking";
import { BookingReturnType, BookingPaginationType, BookingVerifyType } from "../../shared/types/ReturnType";
import { IBookingService } from "../interfaces/IBookingService";
import { IBookingRepository } from "../../repositories/interfaces/IBookingRepository";
import { IPaymentRepository } from "../../repositories/interfaces/IPaymentRepository";
import { IWalletRepository } from "../../repositories/interfaces/IWalletRepository";
import logger from "../../shared/utils/logger";
import { HttpResponse } from "../../shared/constants/httpResponse";
import { StatusCode } from "../../shared/constants/statusCode";
import { config } from "../../config";
import { PaymentMethod, PaymentStatus } from "../../shared/types/Payments";
import { fetchUsers } from "../../shared/utils/getUsers";
import mongoose from 'mongoose';
import { inject, injectable } from 'tsyringe';
import { INotification } from '../../shared/types/INotification';
import { TOPICS } from '../../kafka/topics';
import { TransactionType } from '../../shared/types/IWallet';
import { IKafkaProducer } from '../../kafka/producer/IKafkaProducer';
import { toBookingDTO } from '../../shared/dtos/BookingDTO';

@injectable()
export class BookingService implements IBookingService {
    constructor(
        @inject("IBookingRepository") private _repo: IBookingRepository,
        @inject("IPaymentRepository") private _paymentRepo: IPaymentRepository,
        @inject("IWalletRepository") private _walletRepo: IWalletRepository,
        @inject("IKafkaProducer") private _producer: IKafkaProducer
    ) {
    }


    public async createBooking(data: IBooking): Promise<BookingReturnType> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const eventId = typeof data.eventId === 'string' ? data.eventId : data.eventId.id as string;

            const count = await this._repo.countBooking(data.userId, eventId);
            if (count > config.maxTicketLimit) {
                await session.abortTransaction();
                return {
                    message: HttpResponse.MAX_TICKET_LIMIT,
                    status: StatusCode.BAD_REQUEST
                };
            }

            for (const ticketData of data.tickets) {
                const isAvailable = await this._repo.checkStock(eventId, ticketData.ticketId, ticketData.quantity);
                if (!isAvailable) {
                    await session.abortTransaction();
                    return {
                        message: HttpResponse.OUT_OF_STOCK,
                        status: StatusCode.BAD_REQUEST
                    };
                }
            }

            const event = await this._repo.findByEventID(eventId);
            if (event?.tickets) {
                for (const bookedTicket of data.tickets) {
                    await this._repo.updateTickets(eventId, bookedTicket.ticketId, -bookedTicket.quantity, session);
                }
            }

            if (!data.paymentMethod) {
                data.paymentMethod = "wallet";
                data.status = "paid";
            }

            const booking = await this._repo.create(data, session);

            await session.commitTransaction();
            return {
                message: HttpResponse.BOOKING_INITIATED,
                status: StatusCode.CREATED,
                booking: toBookingDTO(booking)
            };

        } catch (error) {
            logger.error(error);
            await session.abortTransaction();
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            };
        } finally {
            session.endSession();
        }
    }

    public async getBooking(id: string): Promise<BookingReturnType> {
        const booking = await this._repo.findBooking(id);
        return {
            message: HttpResponse.BOOKING_FETCHED,
            status: StatusCode.OK,
            booking: booking ? toBookingDTO(booking) : booking
        }
    }

    public async getBookings(userId: string, page: number, limit: number): Promise<BookingPaginationType> {
        const skip = (page - 1) * limit;
        const res = await this._repo.findByUserID(userId, skip, limit);
        return {
            message: HttpResponse.BOOKING_FETCHED,
            status: StatusCode.OK,
            bookings: res.items.map(item => toBookingDTO(item)),
            total: res.total,
            pages: Math.ceil(res.total / limit)
        }
    }

    public async cancelBooking(bookingId: string): Promise<BookingReturnType> {
        try {
            await this._repo.cancelBooking(bookingId);
            const doc = await this._paymentRepo.changeStatus(bookingId, PaymentStatus.REFUNDED);
            if (doc?.amount && Number(doc?.amount) > 0) {
                await this._walletRepo.credit(doc?.userId as string, doc?.amount as number);
            }

            const booking = await this._repo.findByID(bookingId);

            if (booking) {
                this._producer.sendData<INotification>(TOPICS.NEW_NOTIFICATION, {
                    userId: booking?.userId,
                    title: `Booking #${booking.orderId} cancelled`,
                    type: "booking",
                    message: `Your booking no #${booking.orderId} has been cancelled`
                })
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
        const MAX_RETRIES = 3;
        let attempt = 0;

        while (attempt < MAX_RETRIES) {
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                const bookings = await this._repo.findBookingsByEventID(eventId);

                await this._repo.updateEvent(eventId, { status: "cancelled" }, session);

                if (!bookings || bookings.length === 0) {
                    await session.commitTransaction();
                    session.endSession();
                    return { message: HttpResponse.ALL_CANCELLED, status: StatusCode.OK };
                }

                for (const booking of bookings) {
                    await this._repo.cancelBooking(booking.id as string, session);

                    const paymentDoc = await this._paymentRepo.changeStatus(
                        booking.id as string,
                        PaymentStatus.REFUNDED,
                        session
                    );

                    if (paymentDoc && paymentDoc?.amount > 0) {
                        await this._walletRepo.credit(
                            paymentDoc.userId,
                            paymentDoc.amount,
                            TransactionType.REFUND,
                            session
                        );
                    }
                }

                await session.commitTransaction();
                session.endSession();
                return { message: HttpResponse.ALL_CANCELLED, status: StatusCode.OK };
            } catch (error) {
                await session.abortTransaction();
                session.endSession();

                attempt++;

                logger.error(`Attempt ${attempt} failed for cancelAllBookings:`, error);

                if (attempt >= MAX_RETRIES) {
                    return {
                        message: HttpResponse.INTERNAL_SERVER_ERROR,
                        status: StatusCode.INTERNAL_SERVER_ERROR
                    };
                }

                await new Promise(resolve => setTimeout(resolve, 200 * attempt));
                return { message: HttpResponse.INTERNAL_SERVER_ERROR, status: StatusCode.INTERNAL_SERVER_ERROR };
            }
        }

        return { message: HttpResponse.INTERNAL_SERVER_ERROR, status: StatusCode.INTERNAL_SERVER_ERROR };
    }

    public async failedBooking(bookingId: string, eventId: string, amount: number, currency: string, userId: string): Promise<BookingReturnType> {
        const booked = await this._paymentRepo.upsert(bookingId, {
            userId,
            eventId,
            bookingId,
            method: PaymentMethod.RAZORPAY,
            amount: amount / 100,
            currency,
            status: PaymentStatus.FAILED
        });

        if (booked) {
            await this._repo.update(booked.bookingId, {
                paymentId: booked.id,
                paymentMethod: booked.method,
                status: PaymentStatus.FAILED
            })
        }

        return {
            message: HttpResponse.PAYMENT_FAILED,
            status: StatusCode.OK
        }
    }


    public async downloadTicket(bookingId: string, res: Response): Promise<void> {
        const booking = await this._repo.findBooking(bookingId);
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
    }

    public async getOrganizerBookings(userId: string, search: string, page: number, limit: number): Promise<BookingPaginationType> {
        const skip = (page - 1) * limit;
        const events = await this._repo.getAllEvents({ userId: String(userId) }, skip, 0);
        const eventIds = events.map(event => event.id);

        if (eventIds.length === 0) {
            return {
                message: HttpResponse.NO_BOOKINGS,
                status: StatusCode.OK,
                bookings: []
            }
        }

        const bookings = await this._repo.getBookingWithQuery({
            $or: [
                { orderId: { $regex: search, $options: "i" } }
            ], eventId: { $in: eventIds }
        }, skip, limit);
        const userIds = [...new Set(bookings.items.map(b => b.userId))];

        const userMap = await fetchUsers(userIds);
        const enrichedBookings = bookings.items.map(booking => ({
            ...toBookingDTO(booking),
            user: userMap[booking.userId] || null
        }));

        return {
            message: HttpResponse.BOOKINGS_FOUND,
            status: StatusCode.OK,
            bookings: enrichedBookings,
            total: eventIds.length,
            page,
            pages: Math.ceil(eventIds.length / limit),
        }
    }

    public async verifyBooking(userId: string, eventId: string): Promise<BookingVerifyType> {
        const result = await this._repo.findWithUserIdAndEventId(userId, eventId);
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
    }


    public async checkCouponApplied(promoCode: string, userId: string): Promise<BookingReturnType> {
        const applied = await this._repo.checkForPromoCode(promoCode, userId);
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
    }
}