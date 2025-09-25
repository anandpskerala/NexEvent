import { Orders } from "razorpay/dist/types/orders";
import { StatusCode } from "../constants/statusCode";
import { BookingDTO } from "../dtos/BookingDTO";
import { PaymentDTO } from "../dtos/PaymentDTO";
import { WalletDTO } from "../dtos/WalletDTO";

export interface BookingReturnType {
    message: string;
    status: StatusCode;
    booking?: BookingDTO;
}

export interface BookingVerifyType {
    message: string;
    status: StatusCode;
    verified?: boolean;
}

export interface BookingPaginationType {
    message: string;
    status: StatusCode;
    bookings?: BookingDTO[];
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
    payment?: PaymentDTO;
    orderId?: string;
}

export interface WalletReturnType {
    message: string;
    status: StatusCode;
    wallet?: WalletDTO
}
