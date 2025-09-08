import { Orders } from "razorpay/dist/types/orders";
import { StatusCode } from "../constants/statusCode";
import { IBooking } from "./IBooking";
import { IPayment } from "./IPayment";
import { IWallet } from "./IWallet";

export interface BookingReturnType {
    message: string;
    status: StatusCode;
    booking?: IBooking;
}

export interface BookingVerifyType {
    message: string;
    status: StatusCode;
    verified?: boolean;
}

export interface BookingPaginationType {
    message: string;
    status: StatusCode;
    bookings?: IBooking[];
    total?: number;
    page?: number;
    pages?: number;
}

export interface StripeReturnType {
    message: string;
    status: StatusCode;
    checkoutUrl?: string | null;
    sessionId?: string | null;
}

export interface RPayReturnType {
    message: string;
    status: StatusCode;
    order?: Orders.RazorpayOrder
}

export interface PaymentReturnType {
    message: string;
    status: StatusCode;
    payment?: IPayment;
    orderId?: string;
}

export interface WalletReturnType {
    message: string;
    status: StatusCode;
    wallet?: IWallet
}
