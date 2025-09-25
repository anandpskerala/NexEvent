import { StatusCode } from "../constants/statusCode";
import { MessageDTO } from "../dtos/MessageDTO";
import { NotificationDTO } from "../dtos/NotificationDTO";
import { UserResponseDTO } from "../dtos/UserResponseDTO";

export interface MessageReturnType {
    message: string;
    status: StatusCode;
    chat?: MessageDTO;
}

export interface UserReturnType {
    message: string;
    status: StatusCode;
    users?: UserResponseDTO[];
}

export interface MessagePaginationType {
    message: string;
    status: StatusCode;
    messages?: MessageDTO[];
    total?: number;
}

export interface UnreadReturnType {
    message: string;
    status: StatusCode;
    result?: NotificationDTO[];
}

export interface UnreadPaginationType {
    message: string;
    status: StatusCode;
    notifications?: NotificationDTO[];
    total?: number;
    page?: number;
    pages?: number;
}

export interface ConferenceReturnType {
    message: string;
    status: StatusCode;
    token?: string;
}