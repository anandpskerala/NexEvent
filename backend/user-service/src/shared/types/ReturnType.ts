import { StatusCode } from "../constants/statusCode";
import { RequestDTO } from "../dtos/requestDTO";
import { ReviewDTO } from "../dtos/reviewDTO";
import { UserDTO } from "../dtos/userDTO";

export interface UserReturnType {
    message: string;
    status: StatusCode;
    user?: UserDTO;
}

export interface UsersReturnType {
    message: string;
    status: StatusCode;
    users?: UserDTO[];
}

export interface OtpReturnType {
    message: string;
    status: StatusCode;
    timeLeft?: number
}

export interface UserPaginationType {
    message: string;
    status: StatusCode;
    users?: UserDTO[];
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

export interface ReviewType {
    message: string;
    status: StatusCode;
}

export interface ReviewPaginationType {
    message: string;
    status: StatusCode;
    total?: number;
    reviews?: ReviewDTO[];
    avgRating?: number;
    page?: number; 
    pages?: number;
}