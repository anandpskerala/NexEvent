import { FilterQuery, SortOrder, Types } from "mongoose";
import { StatusCode } from "../../shared/constants/statusCode";
import { CloudinaryService } from "../../shared/utils/cloudinary";
import { IEvent } from "../../shared/types/IEvent";
import { EventPaginationType, EventReturnType, EventsReturnType, RawReturnType, SavedEventPaginationType, SavedEventReturnType } from "../../shared/types/ReturnType";
import { ITicket } from "../../shared/types/ITicket";
import logger from "../../shared/utils/logger";
import { IEventRepository } from "../../repositories/interfaces/IEventRepository";
import { HttpResponse } from "../../shared/constants/httpResponse";

export class EventService {
    private cloudinary: CloudinaryService;
    constructor(private eventRepo: IEventRepository) {
        this.cloudinary = new CloudinaryService();
    }

    public async createEvent(event: IEvent): Promise<EventReturnType> {
        try {
            const existing = await this.eventRepo.findByTitle(event.title);
            if (existing) {
                this.cloudinary.deleteImage(event.image);
                return {
                    message: HttpResponse.EVENT_ALREADY_EXISTS,
                    status: StatusCode.BAD_REQUEST
                }
            }

            if (!event.endDate && event.eventFormat == 'single') {
                event.endDate = event.startDate;
            }

            const newEvent = await this.eventRepo.createEvent(event);
            return {
                message: HttpResponse.EVENT_CREATED,
                status: StatusCode.CREATED,
                event: newEvent.id
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async createTicket(id: string, currency: string, entryType: string, showQuantity: boolean, refunds: boolean, tickets: ITicket[], isEdit: boolean = false): Promise<EventReturnType> {
        try {
            if (!id || !currency || currency.trim() == "" || !entryType || entryType.trim() == "" || showQuantity == undefined || refunds == undefined || !tickets || tickets.length == 0) {
                return {
                    message: HttpResponse.MISSING_FIELDS,
                    status: StatusCode.BAD_REQUEST
                }
            }

            const existing = await this.eventRepo.findByID(id);
            if (!existing) {
                return {
                    message: HttpResponse.EVENT_DOESNT_EXISTS,
                    status: StatusCode.NOT_FOUND
                }
            }

            await this.eventRepo.createTicket(id, currency, entryType, showQuantity, refunds, tickets);
            return {
                message: isEdit ? HttpResponse.TICKET_UPDATED : HttpResponse.TICKET_CREATED,
                status: StatusCode.CREATED
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getEvent(id: string, userId: string): Promise<RawReturnType> {
        try {
            const event = await this.eventRepo.getEvent(id);
            if (!event) {
                return {
                    message: HttpResponse.EVENT_DOESNT_EXISTS,
                    status: StatusCode.NOT_FOUND
                }
            }

            const saved = await this.eventRepo.getSavedEvent(id, userId);
            const enrichedEvent = {
                ...event,
                isSaved: saved ? true : false
            }

            return {
                message: HttpResponse.FETCHED_EVENT,
                status: StatusCode.OK,
                event: enrichedEvent
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }


    public async getAllEvents(userId: string, search: string, page: number, limit: number, category?: string, eventStatus?: string, eventType?: string, sortBy?: string): Promise<EventPaginationType> {
        try {
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
            }

            if (eventType) {
                filter.eventType = eventType;
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
                this.eventRepo.countDocs(filter),
                this.eventRepo.getAllEvents(filter, skip, limit, sortFilter)
            ]);

            const enrichedEvents = await Promise.all(
                events.map(async (event) => {
                    const saved = await this.eventRepo.getSavedEvent(event?.id as string, userId);
                    return {
                        ...event,
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

        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR,
            };
        }
    }

    public async getNearbyEvents(userId: string, latitude: number, longitude: number): Promise<EventsReturnType> {
        try {
            if (!latitude || !longitude) {
                return {
                    message: HttpResponse.FETCHED_EVENT,
                    status: StatusCode.OK,
                    events: []
                }
            }
            const events = await this.eventRepo.getNearByEvents(latitude, longitude);
            const enrichedEvents = await Promise.all(
                events.map(async (event) => {
                    const saved = await this.eventRepo.getSavedEvent(event?.id as string, userId);
                    return {
                        ...event,
                        isSaved: !!saved
                    };
                })
            );
            return {
                message: HttpResponse.FETCHED_EVENT,
                status: StatusCode.OK,
                events: enrichedEvents
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR,
            };
        }
    }


    public async getEvents(userId: string, search: string, page: number, limit: number): Promise<EventPaginationType> {
        try {
            const baseConditions: FilterQuery<IEvent> = {
                userId: new Types.ObjectId(userId),
                status: { $nin: ["cancelled", "ended"] }
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
            const total = await this.eventRepo.countDocs(query);
            const events = await this.eventRepo.getAllEvents(query, skip, limit);
            return {
                message: HttpResponse.FETCHED_EVENT,
                status: StatusCode.OK,
                total,
                page,
                pages: Math.ceil(total / limit),
                events
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async updateEvent(event: IEvent): Promise<EventReturnType> {
        try {
            const existing = await this.eventRepo.findByID(event.id as string);
            if (!existing) {
                this.cloudinary.deleteImage(event.image);
                return {
                    message: HttpResponse.EVENT_ALREADY_EXISTS,
                    status: StatusCode.BAD_REQUEST
                }
            }

            if (existing.image !== event.image) {
                this.cloudinary.deleteImage(existing.image);
            }

            if (!event.endDate && event.eventFormat == 'single') {
                event.endDate = event.startDate;
            }

            await this.eventRepo.updateEvent(event.id as string, event);
            return {
                message: HttpResponse.EVENT_UPDATED,
                status: StatusCode.OK,
                event: existing.id
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async isSavedEvent(userId: string, eventId: string): Promise<SavedEventReturnType> {
        try {
            const res = await this.eventRepo.getSavedEvent(eventId, userId);
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
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async saveEvent(userId: string, eventId: string): Promise<SavedEventReturnType> {
        try {
            await this.eventRepo.saveEvent(eventId, userId);
            return {
                message: HttpResponse.EVENT_SAVED,
                status: StatusCode.CREATED,
                saved: true
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async removeSavedEvent(id: string, userId: string): Promise<SavedEventReturnType> {
        try {
            await this.eventRepo.removeEvent(id, userId);
            return {
                message: HttpResponse.EVENT_REMOVED,
                status: StatusCode.OK,
                saved: false
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }

    public async getAllSaved(userId: string, page: number, limit: number): Promise<SavedEventPaginationType> {
        try {
            const skip = (page - 1) * limit;
            const docs = await this.eventRepo.getSavedEvents(userId, skip, limit);
            return {
                message: HttpResponse.FETCHED_EVENT,
                status: StatusCode.OK,
                total: docs.total,
                page,
                pages: Math.ceil(docs.total / limit),
                events: docs.events
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}