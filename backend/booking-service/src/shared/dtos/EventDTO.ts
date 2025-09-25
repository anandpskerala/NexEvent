import { Types } from "mongoose";
import { ITicket } from "../types/ITicket";
import { IEvent, ILocation } from "../types/IEvent";

export interface EventDTO {
    id: string;
    title: string;
    description: string;
    userId: string;
    image: string;
    category: typeof Types.ObjectId;
    eventType: string;
    tags: string[];
    eventFormat: string;
    entryType: string;
    currency: string;
    status: string;
    tickets: ITicket[]
    location: ILocation;
    showQuantity: boolean;
    refunds: boolean;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
}

export const toEventDTO = (entity: IEvent): EventDTO => {
    return {
        id: entity.id as string,
        title: entity.title,
        description: entity.description,
        userId: entity.userId as string,
        image: entity.image,
        category: entity.category,
        eventType: entity.eventType,
        tags: entity.tags,
        eventFormat: entity.eventFormat,
        entryType: entity.entryType as string,
        currency: entity.currency as string,
        status: entity.status as string,
        tickets: entity.tickets as ITicket[],
        location: entity.location,
        showQuantity: entity.showQuantity as boolean,
        refunds: entity.refunds as boolean,
        startDate: entity.startDate as string,
        endDate: entity.endDate as string,
        startTime: entity.startTime as string,
        endTime: entity.endTime as string
    }
}