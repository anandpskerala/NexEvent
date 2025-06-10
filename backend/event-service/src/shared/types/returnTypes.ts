import { StatusCode } from "../constants/statusCode";
import { IEvent } from "./IEvent";

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

export interface EventPaginationType {
    message: string;
    status: StatusCode;
    events?: IEvent[];
    total?: number;
    page?: number;
    pages?: number; 
}