import mongoose, { FilterQuery, Model, SortOrder } from "mongoose";
import { IBookingRepository } from "../interfaces/IBookingRepository";
import { IBooking } from "../../shared/types/IBooking";
import bookingModel from "../../models/bookingModel";
import { PaymentStatus } from "../../shared/types/Payments";
import { IEvent } from "../../shared/types/IEvent";
import eventModel from "../../models/eventModel";
import { injectable } from "tsyringe";

@injectable()
export class BookingRepository implements IBookingRepository {
    private model: Model<IBooking>;
    private eventModel = Model<IEvent>;

    constructor() {
        this.model = bookingModel;
        this.eventModel = eventModel;
    }

    async findBooking(id: string) {
        const doc = await this.model.findOne({ orderId: id }).populate("eventId");
        return doc?.toJSON();
    }

    async findByUserID(userId: string, skip: number, limit: number): Promise<{ items: IBooking[]; total: number; }> {
        const doc = (await this.model.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("eventId")).map(d => d.toJSON());
        const pages = await this.model.countDocuments({ userId });

        return {
            items: doc,
            total: pages
        }
    }

    async cancelBooking(bookingId: string) {
        await this.update(bookingId, {
            status: 'cancelled'
        })
    }

    async getBookingWithQuery(query: FilterQuery<IBooking>, skip: number, limit: number): Promise<{ items: IBooking[]; total: number; }> {
        const docs = (await this.model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).populate("eventId")).map(doc => doc.toJSON());
        const pages = await this.model.countDocuments(query);
        return {
            items: docs,
            total: pages
        };
    }

    async findBookingsByEventID(eventId: string): Promise<IBooking[]> {
        const docs = (await this.model.find({ eventId, status: PaymentStatus.SUCCESS })).map(doc => doc.toJSON());
        return docs;
    }

    async checkForPromoCode(couponCode: string, userId: string): Promise<boolean> {
        const doc = await this.model.findOne({ userId, couponCode });
        return doc ? true : false;
    }

    async create(item: Partial<IBooking>, session?: mongoose.ClientSession): Promise<IBooking> {
        const doc = await this.model.create([item], { session });
        return doc[0].toJSON();
    }

    async update(id: string, item: Partial<IBooking>): Promise<void> {
        await this.model.updateOne({ _id: id }, { $set: item });
    }

    async delete(id: string): Promise<void> {
        await this.model.deleteOne({ _id: id });
    }

    async findByID(id: string): Promise<IBooking | undefined> {
        const doc = await this.model.findOne({ _id: id });
        return doc?.toJSON();
    }

    async findWithUserIdAndEventId(userId: string, eventId: string): Promise<IBooking | undefined> {
        const doc = await this.model.findOne({ userId, eventId });
        return doc?.toJSON();
    }

    async countBooking(userId: string, eventId: string): Promise<number> {
        const result = await bookingModel.aggregate([
            {
                $match: {
                    userId: userId,
                    eventId: new mongoose.Types.ObjectId(eventId),
                    status: "paid"
                }
            },
            { $unwind: "$tickets" },
            {
                $group: {
                    _id: null,
                    totalTickets: { $sum: "$tickets.quantity" }
                }
            }
        ]);

        return result[0]?.totalTickets || 0;
    }

    async findByEventID(id: string): Promise<IEvent | undefined> {
        const doc = await this.eventModel.findOne({ _id: id });
        return doc?.toJSON();
    }

    async updateTickets(eventId: string, ticketId: string, quantity: number, session?: mongoose.ClientSession): Promise<void> {
        await this.eventModel.updateOne(
            {
                _id: eventId,
                "tickets._id": ticketId
            },
            {
                $inc: { "tickets.$.quantity": quantity }
            },
            { session }
        );
    }


    async updateEvent(id: string, event: Partial<IEvent>): Promise<void> {
        await this.eventModel.updateOne({ _id: id }, { $set: { ...event } });
    }

    async getAllEvents(query: FilterQuery<IEvent>, skip: number, limit: number, sortFilter?: Record<string, SortOrder>): Promise<IEvent[]> {
        const docs = (await this.eventModel.find(query).sort(sortFilter ? sortFilter : { createdAt: -1 }).skip(skip).limit(limit)).map(doc => doc.toJSON());
        return docs;
    }

    async checkStock(eventId: string, ticketId: string, stock: number): Promise<boolean> {
        const event = await this.findByEventID(eventId);
        if (event) {
            const ticket = event.tickets?.find(ticket => ticket.id === ticketId);
            if (ticket) {
                return ticket.quantity >= stock;
            }
        }
        return false;
    }

    async getExpiredBookings(timeStamp: Date): Promise<IBooking[]> {
        const bookings = await this.model.find({
            status: "pending",
            expiresAt: { $lte: timeStamp }
        });
        return bookings.map(d => d.toJSON());
    }
}