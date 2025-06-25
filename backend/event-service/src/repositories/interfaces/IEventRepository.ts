import { FilterQuery, SortOrder } from "mongoose";
import { IEvent } from "../../shared/types/IEvent";
import { ITicket } from "../../shared/types/ITicket";
import { ISavedEvents } from "../../shared/types/ISavedEvents";

export interface IEventRepository {
    createEvent(event: IEvent): Promise<IEvent>;
    findByTitle(title: string): Promise<IEvent | undefined>;
    findByID(id: string): Promise<IEvent | undefined>
    createTicket(id: string, currency: string, entryType: string, showQuantity: boolean, refunds: boolean, tickets: ITicket[]): Promise<void>;
    getEvent(id: string): Promise<IEvent | undefined>;
    getAllEvents(query: FilterQuery<IEvent>, skip: number, limit: number, sortFilter?: Record<string, SortOrder>): Promise<IEvent[]>;
    getNearByEvents(latitude: number, longitude: number, maxDistanceInKm?: number): Promise<IEvent[]>;
    countDocs(query: FilterQuery<IEvent>): Promise<number>;
    checkStock(eventId: string, ticketId: string, stock: number): Promise<boolean>;
    updateTickets(eventId: string, ticketId: string, quantity: number): Promise<void>;
    getSavedEvent(eventId: string, userId: string): Promise<ISavedEvents | undefined>;
    saveEvent(eventId: string, userId: string): Promise<ISavedEvents>;
    removeEvent(id: string, userId: string): Promise<void>;
    getSavedEvents(userId: string, skip: number, limit: number): Promise<{events: ISavedEvents[], total: number}>
}