import { StatusCode } from "../constants/statusCode";
import { CategoryDTO } from "../dtos/CategoryDTO";
import { CouponDTO } from "../dtos/CouponDTO";
import { ReportDTO } from "../dtos/ReportDTO";
import { RequestDTO } from "../dtos/RequestDTO";

export interface CategoryReturnType {
    message: string;
    status: StatusCode;
    category?: CategoryDTO
}

export interface CategoryPaginationType {
    message: string;
    status: StatusCode;
    categories?: CategoryDTO[];
    total?: number;
    page?: number;
    pages?: number; 
}

export interface CouponReturnType {
    message: string;
    status: StatusCode;
    coupon?: CouponDTO
}

export interface CouponPaginationType {
    message: string;
    status: StatusCode;
    coupons?: CouponDTO[];
    total?: number;
    page?: number;
    pages?: number; 
}

export interface ReportReturnType {
    message: string;
    status: StatusCode;
    data?: ReportDTO;
}

export interface ReportPaginationType {
    message: string;
    status: StatusCode;
    reports?: ReportDTO[];
    total?: number;
    page?: number;
    pages?: number; 
}

export interface RequestReturnType {
    message: string;
    status: StatusCode;
    request?: RequestDTO;
}

export interface RequestPaginationType {
    message: string;
    status: StatusCode;
    requests?: RequestDTO[];
    total?: number;
    page?: number;
    pages?: number; 
}