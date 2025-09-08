import { StatusCode } from "../constants/statusCode";
import { IEvent } from "./IEvent";
import { ISavedEvents } from "./ISavedEvents";
import { RevenueAnalyticsGraphPoint, TopSelling } from "./RevenueAnalytics";

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

export interface StockReturnType {
    message: string;
    status: StatusCode;
    stock?: boolean
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

export interface BookingVerifyType {
    message: string;
    status: StatusCode;
    verified?: boolean;
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