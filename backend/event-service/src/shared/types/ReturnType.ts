import { Orders } from "razorpay/dist/types/orders";
import { StatusCode } from "../constants/statusCode";
import { IBooking } from "./IBooking";
import { IEvent } from "./IEvent";
import { IPayment } from "./IPayment";
import { ISavedEvents } from "./ISavedEvents";
import { RevenueAnalyticsGraphPoint, TopSelling } from "./RevenueAnalytics";
import { IWallet } from "./IWallet";

export interface EventReturnType {
    message: string;
    status: StatusCode;
    event?: string;
}

export interface RawReturnType {
    message: string;
    status: StatusCode;
    event?: IEvent;
}

export interface EventsReturnType {
    message: string;
    status: StatusCode;
    events?: IEvent[];
}

export interface EventPaginationType {
    message: string;
    status: StatusCode;
    events?: IEvent[];
    total?: number;
    page?: number;
    pages?: number;
}

export interface AnalyticsReturnType {
    message: string;
    status: StatusCode;
    analytics?: RevenueAnalyticsGraphPoint[];
}

export interface AnalyticsTopSellingType {
    message: string;
    status: StatusCode;
    analytics?: TopSelling[];
}

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

export interface SavedEventPaginationType {
    message: string;
    status: StatusCode;
    events?: ISavedEvents[];
    total?: number;
    page?: number;
    pages?: number;
}

export interface SavedEventReturnType {
    message: string;
    status: StatusCode;
    saved?: boolean;
}

export interface StripeReturnType {
    message: string;
    status: StatusCode;
    checkoutUrl?: string | null;
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
