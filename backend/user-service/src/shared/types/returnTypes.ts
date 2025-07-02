import { StatusCode } from "../constants/statusCode";
import { IRequest } from "./IRequest";
import { IReview } from "./IReview";
import { IUser } from "./IUser";

export interface UserReturnType {
    message: string;
    status: StatusCode;
    user?: IUser;
}

export interface UsersReturnType {
    message: string;
    status: StatusCode;
    users?: IUser[];
}

export interface OtpReturnType {
    message: string;
    status: StatusCode;
    timeLeft?: number
}

export interface UserPaginationType {
    message: string;
    status: StatusCode;
    users?: IUser[];
    total?: number;
    page?: number;
    pages?: number;
}

export interface RequestReturnType {
    message: string;
    status: StatusCode;
    request?: IRequest;
}

export interface RequestPaginationType {
    message: string;
    status: StatusCode;
    requests?: IRequest[];
    total?: number;
    page?: number;
    pages?: number;
}

export interface ReviewType {
    message: string;
    status: StatusCode;
}

export interface ReviewPaginationType {
    message: string;
    status: StatusCode;
    total?: number;
    reviews?: IReview[];
    avgRating?: number;
    page?: number; 
    pages?: number;
}