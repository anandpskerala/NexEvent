import { FilterQuery, SortOrder, Types } from "mongoose";
import { StatusCode } from "../../shared/constants/statusCode";
import { IEvent } from "../../shared/types/IEvent";
import { EventPaginationType, EventReturnType, EventsReturnType, RawReturnType, SavedEventPaginationType, SavedEventReturnType, StockReturnType } from "../../shared/types/ReturnType";
import { ITicket } from "../../shared/types/ITicket";
import { IEventRepository } from "../../repositories/interfaces/IEventRepository";
import { HttpResponse } from "../../shared/constants/httpResponse";
import { inject, injectable } from "tsyringe";
import { IEventService } from "../interfaces/IEventService";
import { ICloudinaryService } from "../interfaces/ICloudinaryService";
import { toEventDTO } from "../../shared/dtos/EventDTOS";
import { toSavedDTO } from "../../shared/dtos/SavedEventDTO";

@injectable()
export class EventService implements IEventService {
    constructor(
        @inject("IEventRepository") private _eventRepo: IEventRepository,
        @inject("ICloudinaryService") private _cloudinary: ICloudinaryService
    ) { }

    public async createEvent(event: IEvent): Promise<EventReturnType> {
        const existing = await this._eventRepo.findByTitle(event.title);
        if (existing) {
            this._cloudinary.deleteImage(event.image);
            return {
                message: HttpResponse.EVENT_ALREADY_EXISTS,
                status: StatusCode.BAD_REQUEST
            }
        }

        if (!event.endDate && event.eventFormat == 'single') {
            event.endDate = event.startDate;
        }

        const newEvent = await this._eventRepo.createEvent(event);
        return {
            message: HttpResponse.EVENT_CREATED,
            status: StatusCode.CREATED,
            event: newEvent.id
        }
    }

    public async createTicket(id: string, currency: string, entryType: string, showQuantity: boolean, refunds: boolean, tickets: ITicket[], isEdit: boolean = false): Promise<EventReturnType> {
        if (!id || !currency || currency.trim() == "" || !entryType || entryType.trim() == "" || showQuantity == undefined || refunds == undefined || !tickets || tickets.length == 0) {
            return {
                message: HttpResponse.MISSING_FIELDS,
                status: StatusCode.BAD_REQUEST
            }
        }

        const existing = await this._eventRepo.findByID(id);
        if (!existing) {
            return {
                message: HttpResponse.EVENT_DOESNT_EXISTS,
                status: StatusCode.NOT_FOUND
            }
        }

        await this._eventRepo.createTicket(id, currency, entryType, showQuantity, refunds, tickets);
        return {
            message: isEdit ? HttpResponse.TICKET_UPDATED : HttpResponse.TICKET_CREATED,
            status: StatusCode.CREATED
        }
    }

    public async getEvent(id: string, userId: string): Promise<RawReturnType> {
        const event = await this._eventRepo.getEvent(id);
        if (!event) {
            return {
                message: HttpResponse.EVENT_DOESNT_EXISTS,
                status: StatusCode.NOT_FOUND
            }
        }

        const saved = await this._eventRepo.getSavedEvent(id, userId);
        const enrichedEvent = {
            ...toEventDTO(event),
            isSaved: saved ? true : false
        }

        return {
            message: HttpResponse.FETCHED_EVENT,
            status: StatusCode.OK,
            event: enrichedEvent
        }
    }


    public async getAllEvents(userId: string, search: string, page: number, limit: number, category?: string, eventStatus?: string, eventType?: string, sortBy?: string, isOrganizer?: boolean): Promise<EventPaginationType> {
        const filter: FilterQuery<IEvent> = {};
        if (search?.trim()) {
            filter.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { 'location.place': { $regex: search.trim(), $options: 'i' } }
            ];
        }

        if (category && Types.ObjectId.isValid(category)) {
            filter.category = new Types.ObjectId(category);
        }

        if (eventStatus) {
            filter.status = eventStatus;
        } else {
            filter.status = "upcoming";
        }

        if (eventType) {
            filter.eventType = eventType;
        }

        if (isOrganizer === true) {
            filter.userId = userId;
        }

        let sortFilter: Record<string, SortOrder> = { createdAt: -1 };
        if (sortBy) {
            if (sortBy === "a-z") {
                sortFilter = { title: 1 };
            } else if (sortBy === "z-a") {
                sortFilter = { title: -1 };
            } else {
                sortFilter = { [sortBy]: -1 };
            }
        }

        const currentPage = Math.max(1, page || 1);
        const currentLimit = Math.max(1, limit || 10);
        const skip = (currentPage - 1) * currentLimit;

        const [total, events] = await Promise.all([
            this._eventRepo.countDocs(filter),
            this._eventRepo.getAllEvents(filter, skip, limit, sortFilter)
        ]);

        const enrichedEvents = await Promise.all(
            events.map(async (event) => {
                const saved = await this._eventRepo.getSavedEvent(event?.id as string, userId);
                return {
                    ...toEventDTO(event),
                    isSaved: !!saved
                };
            })
        );

        return {
            message: HttpResponse.FETCHED_EVENT,
            status: StatusCode.OK,
            total,
            page,
            pages: Math.ceil(total / limit),
            events: enrichedEvents
        };

    }

    public async getNearbyEvents(userId: string, latitude: number, longitude: number): Promise<EventsReturnType> {
        if (!latitude || !longitude) {
            return {
                message: HttpResponse.FETCHED_EVENT,
                status: StatusCode.OK,
                events: []
            }
        }
        const events = await this._eventRepo.getNearByEvents(latitude, longitude);
        const enrichedEvents = await Promise.all(
            events.map(async (event) => {
                const saved = await this._eventRepo.getSavedEvent(event?.id as string, userId);
                return {
                    ...toEventDTO(event),
                    isSaved: !!saved
                };
            })
        );
        return {
            message: HttpResponse.FETCHED_EVENT,
            status: StatusCode.OK,
            events: enrichedEvents
        }
    }


    public async getEvents(userId: string, search: string, page: number, limit: number, getExpired: boolean = false): Promise<EventPaginationType> {
        const baseConditions: FilterQuery<IEvent> = {
            userId: new Types.ObjectId(userId),
            ...(getExpired ? {} : { status: { $nin: ["cancelled", "ended"] } })
        };

        let query: FilterQuery<IEvent>;

        if (search) {
            query = {
                $and: [
                    baseConditions,
                    {
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { 'location.place': { $regex: search, $options: 'i' } }
                        ]
                    }
                ]
            };
        } else {
            query = baseConditions;
        }

        const skip = (page - 1) * limit;
        const total = await this._eventRepo.countDocs(query);
        const events = await this._eventRepo.getAllEvents(query, skip, limit);
        return {
            message: HttpResponse.FETCHED_EVENT,
            status: StatusCode.OK,
            total,
            page,
            pages: Math.ceil(total / limit),
            events: events.map(item => toEventDTO(item))
        }
    }

    public async updateEvent(event: IEvent): Promise<EventReturnType> {
        const existing = await this._eventRepo.findByID(event.id as string);
        if (!existing) {
            this._cloudinary.deleteImage(event.image);
            return {
                message: HttpResponse.EVENT_ALREADY_EXISTS,
                status: StatusCode.BAD_REQUEST
            }
        }

        if (existing.image !== event.image) {
            this._cloudinary.deleteImage(existing.image);
        }

        if (!event.endDate && event.eventFormat == 'single') {
            event.endDate = event.startDate;
        }

        await this._eventRepo.updateEvent(event.id as string, event);
        return {
            message: HttpResponse.EVENT_UPDATED,
            status: StatusCode.OK,
            event: existing.id
        }
    }

    public async isSavedEvent(userId: string, eventId: string): Promise<SavedEventReturnType> {
        const res = await this._eventRepo.getSavedEvent(eventId, userId);
        if (!res) {
            return {
                message: HttpResponse.NOT_SAVED,
                status: StatusCode.OK,
                saved: false
            }
        }

        return {
            message: HttpResponse.IS_SAVED,
            status: StatusCode.OK,
            saved: true
        }
    }

    public async saveEvent(userId: string, eventId: string): Promise<SavedEventReturnType> {
        await this._eventRepo.saveEvent(eventId, userId);
        return {
            message: HttpResponse.EVENT_SAVED,
            status: StatusCode.CREATED,
            saved: true
        }
    }

    public async removeSavedEvent(id: string, userId: string): Promise<SavedEventReturnType> {
        await this._eventRepo.removeEvent(id, userId);
        return {
            message: HttpResponse.EVENT_REMOVED,
            status: StatusCode.OK,
            saved: false
        }
    }

    public async getAllSaved(userId: string, page: number, limit: number): Promise<SavedEventPaginationType> {
        const skip = (page - 1) * limit;
        const docs = await this._eventRepo.getSavedEvents(userId, skip, limit);
        return {
            message: HttpResponse.FETCHED_EVENT,
            status: StatusCode.OK,
            total: docs.total,
            page,
            pages: Math.ceil(docs.total / limit),
            events: docs.events.map(item => toSavedDTO(item))
        }
    }

    public async getStock(eventId: string, tickets: { ticketId: string, quantity: number }[]): Promise<StockReturnType> {
        let outOfStock = true;
        if (tickets && eventId) {
            tickets.forEach(async (ticketData) => {
                const check = await this._eventRepo.checkStock(eventId.toString(), ticketData.ticketId, ticketData.quantity);
                if (!check) {
                    outOfStock = false;
                    return {
                        message: HttpResponse.NO_STOCKS,
                        status: StatusCode.OK,
                        stock: outOfStock
                    }
                }
            })
        } else {
            return {
                message: HttpResponse.MISSING_FIELDS,
                status: StatusCode.BAD_REQUEST,
                stock: outOfStock
            }
        }
        return {
            message: HttpResponse.STOCKS_AVAILABLE,
            status: StatusCode.OK,
            stock: outOfStock
        }
    }
}