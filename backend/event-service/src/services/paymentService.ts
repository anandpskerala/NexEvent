import Stripe from "stripe";
import RPay from "razorpay";
import crypto from "crypto";
import { PaymentRepository } from "../repositories/PaymentRepository";
import { WalletRepository } from "../repositories/WalletRepository";
import { config } from "../config";
import { PaymentMethod, PaymentStatus } from "../shared/types/Payments";
import { StatusCode } from "../shared/constants/statusCode";
import { BookingRepository } from "../repositories/BookingRepository";
import { EventRepository } from "../repositories/EventRepository";
import logger from "../shared/utils/logger";


export class PaymentService {
    private stripe: Stripe;
    private razorpay: RPay;

    constructor(private repo: PaymentRepository, private walletRepo: WalletRepository, private bookingRepo: BookingRepository, private eventRepo: EventRepository) {
        this.razorpay = new RPay({
            key_id: config.payment.razorpayID,
            key_secret: config.payment.razorpaySecret
        });

        this.stripe = new Stripe(config.payment.stripeSecret as string, {
            typescript: true
        })
    }

    public async createStripeOrder(eventId: string, tickets: Record<string, { ticketId: string, name: string; price: number, quantity: number }>, amount: number, currency: string, promoCode: string, paymentMethod: string, bookingId: string, orderId: string) {
        try {
            const lineItems = Object.entries(tickets)
                .filter(([, ticket]) => ticket.quantity > 0)
                .map(([ticketType, ticket]) => ({
                    price_data: {
                        currency,
                        product_data: {
                            name: `Event Ticket - ${ticketType}`,
                        },
                        unit_amount: amount,
                    },
                    quantity: ticket.quantity,
                }));


            const order = await this.stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: lineItems,
                success_url: `${config.app.frontendUrl}/event/bookings/${eventId}?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${config.app.frontendUrl}/event/${eventId}`,
                metadata: {
                    eventId,
                    bookingId,
                    amount,
                    currency,
                    orderId,
                    tickets: JSON.stringify(tickets),
                    promoCode: promoCode || '',
                    paymentMethod
                }
            })

            return {
                message: "Initiating payment",
                status: StatusCode.CREATED,
                checkoutUrl: order.url
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Failed to initiate payment",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async verifyStripeOrder(userId: string, sessionId: string) {
        try {
            if (!sessionId) {
                return {
                    message: "Missing session ID",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const session = await this.stripe.checkout.sessions.retrieve(sessionId);

            if (session.payment_status != "paid") {
                return {
                    message: "Payment not successful",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const booked = await this.repo.upsert(session.metadata?.bookingId as string, {
                userId: userId,
                eventId: session.metadata?.eventId,
                bookingId: session.metadata?.bookingId,
                orderId: session.id,
                paymentId: session.payment_intent as string,
                amount: Number(session.metadata?.amount) / 100,
                currency: session.metadata?.currency,
                method: PaymentMethod.STRIPE,
                status: PaymentStatus.SUCCESS,
            })

            await this.bookingRepo.update(booked?.bookingId as string, {
                paymentId: booked?.id,
                paymentMethod: booked?.method,
                status: 'paid'
            })

            const booking = await this.bookingRepo.findByID(booked?.bookingId as string);
            if (!booking) {
                return {
                    message: "Booking not found",
                    status: StatusCode.BAD_REQUEST,
                }
            }

            const event = await this.eventRepo.findByID(booking.eventId.toString());
            if (!event) {
                return {
                    message: "event not found",
                    status: StatusCode.BAD_REQUEST,
                }
            }

            if (event.tickets) {
                for (const bookedTicket of booking.tickets) {
                    await this.eventRepo.updateTickets(event.id?.toString() as string, bookedTicket.ticketId, bookedTicket.quantity);
                }
            }
            return {
                message: "Payment succesfull",
                status: StatusCode.CREATED,
                payment: booked,
                orderId: session.metadata?.orderId
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Failed to initiate payment",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async createRPayOrder(amount: number, currency: string) {
        try {
            const options = {
                amount: amount * 100,
                currency: currency || 'INR',
                receipt: `receipt_${crypto.randomUUID().slice(0, 5) + Date.now()}`,
                payment_capture: 1
            };

            const order = await this.razorpay.orders.create(options);
            return {
                message: "Initiating payment",
                status: StatusCode.CREATED,
                order
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Failed to initiate payment",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }


    public async verifyRPayPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string, userId: string, eventId: string, bookingId: string, currency: string, amount: number) {
        try {

            const body = `${razorpay_order_id}|${razorpay_payment_id}`;
            const expectedSignature = crypto
                .createHmac('sha256', config.payment.razorpaySecret as string)
                .update(body.toString())
                .digest('hex');

            if (expectedSignature === razorpay_signature) {
                const booked = await this.repo.upsert(bookingId, {
                    userId,
                    eventId,
                    bookingId,
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    method: PaymentMethod.RAZORPAY,
                    amount: amount / 100,
                    currency,
                    status: PaymentStatus.SUCCESS
                });

                await this.bookingRepo.update(booked?.bookingId as string, {
                    paymentId: booked?.id as string,
                    paymentMethod: booked?.method,
                    status: 'paid'
                })

                const booking = await this.bookingRepo.findByID(booked?.bookingId as string);
                if (!booking) {
                    return {
                        message: "Booking not found",
                        status: StatusCode.BAD_REQUEST,
                    }
                }

                const event = await this.eventRepo.findByID(booking.eventId.toString());
                if (!event) {
                    return {
                        message: "event not found",
                        status: StatusCode.BAD_REQUEST,
                    }
                }

                if (event.tickets) {
                    for (const bookedTicket of booking.tickets) {
                        await this.eventRepo.updateTickets(event.id?.toString() as string, bookedTicket.ticketId, bookedTicket.quantity);
                    }
                }
                return {
                    message: "Payment verified successfully",
                    status: StatusCode.OK,
                    payment: booked,
                    orderId: razorpay_order_id
                };
            } else {
                return {
                    message: "Payment verification failed",
                    status: StatusCode.BAD_REQUEST
                }
            }
        } catch (error) {
            logger.error(error);
            return {
                message: "Failed to initiate payment",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async pay(userId: string, eventId: string, currency: string, amount: number, bookingId: string) {
        try {
            const wallet = await this.walletRepo.findByUserID(userId);
            if (!wallet) {
                return {
                    message: "Wallet doesn't exist for this user",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const checkBalance = await this.walletRepo.checkBalance(userId, amount);
            if (!checkBalance) {
                return {
                    message: "Insufficent balance in your wallet",
                    status: StatusCode.BAD_REQUEST
                }
            }

            const paymentId = await this.walletRepo.debit(wallet.id as string, amount);
            const booked = await this.repo.upsert(bookingId, {
                userId,
                eventId,
                amount,
                currency,
                paymentId,
                bookingId,
                method: PaymentMethod.WALLET,
                status: PaymentStatus.SUCCESS
            })

            await this.bookingRepo.update(booked?.bookingId as string, {
                paymentId: booked?.id,
                paymentMethod: booked?.method,
                status: 'paid'
            })

            const booking = await this.bookingRepo.findByID(booked?.bookingId as string);
            if (!booking) {
                return {
                    message: "Booking not found",
                    status: StatusCode.BAD_REQUEST,
                }
            }

            const event = await this.eventRepo.findByID(booking.eventId.toString());
            if (!event) {
                return {
                    message: "event not found",
                    status: StatusCode.BAD_REQUEST,
                }
            }

            if (event.tickets) {
                for (const bookedTicket of booking.tickets) {
                    await this.eventRepo.updateTickets(event.id?.toString() as string, bookedTicket.ticketId, bookedTicket.quantity);
                }
            }

            return {
                message: "Payment verified successfully",
                status: StatusCode.OK,
                payment: booked,
                orderId: booked?.id
            };
        } catch (error) {
            logger.error(error)
            return {
                message: "Internal Server Error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getWalletDetails(userId: string) {
        try {
            const wallet = await this.walletRepo.findByUserID(userId);
            if (!wallet) {
                return {
                    message: "Wallet doesn't exist for this user",
                    status: StatusCode.BAD_REQUEST
                }
            }

            return {
                message: "Wallet fetched",
                status: StatusCode.OK,
                wallet
            }
        } catch (error) {
            logger.error(error)
            return {
                message: "Internal Server Error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}