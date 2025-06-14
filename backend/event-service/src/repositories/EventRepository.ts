import { FilterQuery, Model, Types } from "mongoose";
import { IEventRepository } from "./interfaces/IEventRepository";
import { IEvent } from "../shared/types/IEvent";
import { ISavedEvents } from "../shared/types/ISavedEvents";
import eventModel from "../models/eventModel";
import savedEventsModel from "../models/savedEventsModel";
import { ITicket } from "../shared/types/ITicket";

export class EventRepository implements IEventRepository {
    private model: Model<IEvent>;
    private savedModel: Model<ISavedEvents>;

    constructor() {
        this.model = eventModel;
        this.savedModel = savedEventsModel;
    }

    async createEvent(event: IEvent): Promise<IEvent> {
        const doc = await this.model.create(event);
        return doc.toJSON();
    }

    async findByTitle(title: string): Promise<IEvent | undefined> {
        const doc = await this.model.findOne({ title: { $regex: title, $options: "i" } });
        return doc?.toJSON();
    }

    async findByID(id: string): Promise<IEvent | undefined> {
        const doc = await this.model.findOne({ _id: id });
        return doc?.toJSON();
    }

    async createTicket(id: string, currency: string, entryType: string, showQuantity: boolean, refunds: boolean, tickets: ITicket[]): Promise<void> {
        await this.model.updateOne({ _id: id }, { $set: { currency, entryType, showQuantity, refunds, tickets } });
    }

    async getEvent(id: string): Promise<IEvent | undefined> {
        const doc = await this.model.aggregate([
            { $match: { _id: new Types.ObjectId(id) } },
            {
                $addFields: {
                    availableTickets: {
                        $sum: {
                            $map: {
                                input: "$tickets",
                                as: "ticket",
                                in: "$$ticket.quantity"
                            }
                        }
                    }
                }
            }
        ]);

        return this.model.hydrate(doc[0])?.toJSON();
    }

    async getAllEvents(query: FilterQuery<IEvent>, skip: number, limit: number): Promise<IEvent[]> {
        const docs = (await this.model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 })).map(doc => doc.toJSON());
        return docs;
    }

    async getNearByEvents(latitude: number, longitude: number, maxDistanceInKm: number = 100): Promise<IEvent[]> {
        const maxDistanceInMeters = maxDistanceInKm * 1000;

        const events = await eventModel.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: maxDistanceInMeters,
                }
            }
        });

        return events.map(event => event.toJSON());
    }

    async countDocs(query: FilterQuery<IEvent>): Promise<number> {
        const count = await this.model.countDocuments(query);
        return count;
    }

    async updateEvent(event: IEvent): Promise<void> {
        await this.model.updateOne({ _id: event.id }, { $set: { ...event } });
    }

    async checkStock(eventId: string, ticketId: string, stock: number): Promise<boolean> {
        const event = await this.findByID(eventId);
        if (event) {
            const ticket = event.tickets?.find(ticket => ticket.id === ticketId);
            if (ticket) {
                return ticket.quantity >= stock ? true : false;
            }
        }
        return false;
    }

    async updateTickets(eventId: string, ticketId: string, quantity: number): Promise<void> {
        await this.model.updateOne(
            {
                _id: eventId,
                "tickets._id": ticketId
            },
            {
                $inc: { "tickets.$.quantity": -quantity }
            }
        );
    }

    async getSavedEvent(eventId: string, userId: string): Promise<ISavedEvents | undefined> {
        const doc = await this.savedModel.findOne({ eventId, userId }).populate("eventId");
        return doc?.toJSON();
    }

    async saveEvent(eventId: string, userId: string): Promise<ISavedEvents> {
        const doc = await this.savedModel.create({
            userId,
            eventId
        });

        return doc.toJSON();
    }

    async removeEvent(id: string, userId: string): Promise<void> {
        await this.savedModel.deleteOne({ eventId: id, userId });
    }

    async getSavedEvents(userId: string, skip: number, limit: number): Promise<{ events: ISavedEvents[], total: number }> {
        const docs = (await this.savedModel.find({ userId }).populate("eventId").sort({ createdAt: -1 }).skip(skip).limit(limit)).map(e => e.toJSON());
        const total = await this.savedModel.countDocuments({ userId });
        return {
            events: docs,
            total
        }
    }
}