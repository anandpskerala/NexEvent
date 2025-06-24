import { StatusCode } from "../constants/statusCode";
import { IRequest } from "./IRequest";
import { IUser } from "./IUser";

export interface UserReturnType {
    message: string;
    status: StatusCode;
    user?: IUser;
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