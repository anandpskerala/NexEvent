import { StatusCode } from "../constants/statusCode";
import { ICategory } from "./ICategory";
import { ICoupon } from "./ICoupon";
import { IReport } from "./IReport";
import { IRequests } from "./IRequests";

export interface CategoryReturnType {
    message: string;
    status: StatusCode;
    category?: ICategory
}

export interface CategoryPaginationType {
    message: string;
    status: StatusCode;
    categories?: ICategory[];
    total?: number;
    page?: number;
    pages?: number; 
}

export interface CouponReturnType {
    message: string;
    status: StatusCode;
    coupon?: ICoupon
}

export interface CouponPaginationType {
    message: string;
    status: StatusCode;
    coupons?: ICoupon[];
    total?: number;
    page?: number;
    pages?: number; 
}

export interface ReportReturnType {
    message: string;
    status: StatusCode;
    data?: IReport;
}

export interface ReportPaginationType {
    message: string;
    status: StatusCode;
    reports?: IReport[];
    total?: number;
    page?: number;
    pages?: number; 
}

export interface RequestReturnType {
    message: string;
    status: StatusCode;
    request?: IRequests;
}

export interface RequestPaginationType {
    message: string;
    status: StatusCode;
    requests?: IRequests[];
    total?: number;
    page?: number;
    pages?: number; 
}