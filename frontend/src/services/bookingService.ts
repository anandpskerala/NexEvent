import { AxiosError, type AxiosResponse } from "axios";
import { toast } from "sonner";
import axiosInstance from "../utils/axiosInstance";
import type { RazorpayResponse } from "../interfaces/entities/RazorPay";
import type { AllEventData } from "../interfaces/entities/FormState";

export const applyCoupon = async (promoCode: string) => {
    try {
        await axiosInstance.get(`/bookings/coupon/check?couponCode=${promoCode}`);
        const res = await axiosInstance.get(`/admin/coupon/${promoCode}`);
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
        return null;
    }
}


export const handleBooking = async (
    eventId: string,
    tickets: {
        [ticketId: string]: {
            quantity: number;
            price: number;
            name: string;
        };
    },
    totalAmount: number,
    paymentMethod: string | null,
    promoCode?: string
) => {
    try {
        const res = await axiosInstance.post("/bookings/booking", {
            eventId,
            tickets: Object.entries(tickets).map(([ticketId, ticketData]) => ({
                ticketId,
                quantity: ticketData.quantity,
                price: ticketData.price,
                name: ticketData.name
            })),
            totalAmount,
            paymentMethod,
            couponCode: promoCode
        });
        return res.data.booking
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
        return null;
    }
}

export const getRPayOrder = async (total: number, currency: string) => {
    const res: AxiosResponse<{
        order: {
            id: string;
            amount: number;
            currency: string;
        };
    }> = await axiosInstance.post("/bookings/payment/razorpay/order", {
        amount: total,
        currency: currency || "INR",
    });
    return res.data;
}

export const handleRPayPayment = async (
    response: RazorpayResponse,
    bookingId: string,
    eventId: string,
    order: {
        id: string;
        amount: number;
        currency: string;
    }
) => {
    await axiosInstance.post("/bookings/payment/razorpay/verify", {
        ...response,
        bookingId: bookingId,
        eventId: eventId,
        amount: order.amount,
        currency: order.currency
    });
}

export const failedBookings = async (bookingId: string, eventId: string, amount: number, currency: string) => {
    await axiosInstance.post(`/bookings/failed/booking`, {
        bookingId: bookingId,
        eventId: eventId,
        amount: amount,
        currency: currency,
        status: 'failed'
    });
}

export const createStripOrder = async (
    eventId: string,
    promoCode: string,
    total: number,
    bookingId: string,
    currency: string,
    orderId: string,
    tickets: {
        [ticketId: string]: {
            quantity: number;
            price: number;
            name: string;
        };
    },
) => {
    const res: AxiosResponse<{ order: string }> = await axiosInstance.post(
        "/bookings/payment/stripe/order",
        {
            eventId, tickets, promoCode, amount: total * 100,
            bookingId, currency: currency || "INR", orderId
        }
    );
    return res.data;
}

export const createRetryStripOrder = async (
    eventId: string,
    promoCode: string,
    total: number,
    bookingId: string,
    currency: string,
    orderId: string,
    tickets: {
        ticketId: string;
        quantity: number;
        price: number;
        name: string;
    }[],
) => {
    const res: AxiosResponse<{ order: string }> = await axiosInstance.post(
        "/bookings/payment/stripe/order",
        {
            eventId, tickets, promoCode, amount: total * 100,
            bookingId, currency: currency || "INR", orderId
        }
    );
    return res.data;
}

export const verifyStripe = async (sessionId: string) => {
    const res = await axiosInstance.post("/bookings/payment/stripe/verify", { sessionId });
    return res.data;
}

export const payByWallet = async (event: AllEventData, total: number, bookingId: string) => {
    const res = await axiosInstance.post(
        "/bookings/payment/wallet/pay",
        { eventId: event.id, currency: event.currency, amount: total, bookingId }
    );
    return res.data;
}

export const downloadTicket = async (bookingId: string) => {
    try {
        const res = await axiosInstance.get(`/bookings/ticket/download/${bookingId}`, {
            responseType: 'blob',
        });

        const blob = new Blob([res.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `ticket-${bookingId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Download failed', error);
    }
};


export const cancelBooking = async (id: string) => {
    try {
        const res = await axiosInstance.patch(`/bookings/booking/${id}`);
        return res.data;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message || "Something went wrong";
        toast.error(message);
        return null;
    }
}

export const getBookings = async (search: string, page: number, limit: number = 10) => {
    const res = await axiosInstance.get(`/bookings/organizer/booking?search=${search}&page=${page}&limit=${limit}`);
    return res.data;
}

export const getUserBookings = async (userId: string, page: number, limit: number = 10) => {
    const res = await axiosInstance.get(`/bookings/bookings/${userId}?page=${page}&limit=${limit}`);
    return res.data;
}


export const getWalletDetails = async (userId: string) => {
    const res = await axiosInstance.get(`/event/payment/wallet/${userId}`);
    return res.data;
}

export const getBooking = async (id: string) => {
    const res = await axiosInstance.get(`/bookings/booking/${id}`);
    return res.data;
}

export const verifyBookingData = async (id: string) => {
    const res = await axiosInstance.get(`/bookings/verify/booking/${id}`);
    return res.data;
}