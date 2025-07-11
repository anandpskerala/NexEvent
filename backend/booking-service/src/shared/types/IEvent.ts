import { Types } from "mongoose";
import { ITicket } from "./ITicket";

export interface IEvent {
    id?: string;
    title: string;
    description: string;
    userId?: typeof Types.ObjectId;
    image: string;
    category: typeof Types.ObjectId;
    eventType: string;
    tags: string[];
    eventFormat: string;
    entryType?: string;
    currency?: string;
    status?: string;
    tickets?: ITicket[]
    location: ILocation;
    showQuantity?: boolean;
    refunds?: boolean;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
}

export interface ILocation {
    type: "Point";
    coordinates: [number, number];
    place?: string;
}