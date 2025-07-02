import { StatusCode } from "../constants/statusCode";
import { INotification } from "./INotfication";
import { IUser } from "./IUser";
import { Message } from "./Message";

export interface MessageReturnType {
    message: string;
    status: StatusCode;
    chat?: Message;
}

export interface UserReturnType {
    message: string;
    status: StatusCode;
    users?: IUser[];
}

export interface MessagePaginationType {
    message: string;
    status: StatusCode;
    messages?: Message[];
    total?: number;
}

export interface UnreadReturnType {
    message: string;
    status: StatusCode;
    result?: INotification[];
}

export interface UnreadPaginationType {
    message: string;
    status: StatusCode;
    notifications?: INotification[];
    total?: number;
    page?: number;
    pages?: number;
}