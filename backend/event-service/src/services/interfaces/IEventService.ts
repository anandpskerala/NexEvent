import { IEvent } from "../../shared/types/IEvent";
import { ITicket } from "../../shared/types/ITicket";
import { EventReturnType, RawReturnType, EventPaginationType, EventsReturnType, SavedEventReturnType, SavedEventPaginationType } from "../../shared/types/ReturnType";

export interface IEventService {
    createEvent(event: IEvent): Promise<EventReturnType>;
    createTicket(id: string, currency: string, entryType: string, showQuantity: boolean, refunds: boolean, tickets: ITicket[], isEdit?: boolean): Promise<EventReturnType>;
    getEvent(id: string, userId: string): Promise<RawReturnType>;
    getAllEvents(userId: string, search: string, page: number, limit: number, category?: string, eventStatus?: string, eventType?: string, sortBy?: string): Promise<EventPaginationType>;
    getNearbyEvents(userId: string, latitude: number, longitude: number): Promise<EventsReturnType>;
    getEvents(userId: string, search: string, page: number, limit: number): Promise<EventPaginationType>;
    updateEvent(event: IEvent): Promise<EventReturnType>;
    saveEvent(userId: string, eventId: string): Promise<SavedEventReturnType>;
    isSavedEvent(userId: string, eventId: string): Promise<SavedEventReturnType>;
    removeSavedEvent(id: string, userId: string): Promise<SavedEventReturnType>;
    getAllSaved(userId: string, page: number, limit: number): Promise<SavedEventPaginationType>;
    
}