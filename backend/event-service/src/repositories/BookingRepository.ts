import { FilterQuery, Model } from "mongoose";
import { IBookingRepository } from "./interfaces/IBookingRepository";
import { IBooking } from "../shared/types/IBooking";
import bookingModel from "../models/bookingModel";

export class BookingRepository implements IBookingRepository {
    private model: Model<IBooking>;
    
    constructor() {
        this.model = bookingModel;
    }

    async findBooking(id: string) {
        const doc = await this.model.findOne({orderId: id}).populate("eventId");
        return doc?.toJSON();
    }

    async findByUserID(userId: string, skip: number, limit: number): Promise<{ items: IBooking[]; total: number; }> {
        const doc = (await this.model.find({userId}).sort({createdAt: -1}).skip(skip).limit(limit).populate("eventId")).map(d => d.toJSON());
        const pages = await this.model.countDocuments({userId});

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

    async checkForPromoCode(couponCode: string, userId: string): Promise<boolean> {
        const doc = await this.model.findOne({userId, couponCode});
        return doc ? true: false;
    }

    async create(item: Partial<IBooking>): Promise<IBooking> {
        const doc = await this.model.create(item);
        return doc.toJSON();
    }

    async update(id: string, item: Partial<IBooking>): Promise<void> {
        await this.model.updateOne({_id: id}, {$set: item});
    }

    async delete(id: string): Promise<void> {
        await this.model.deleteOne({_id: id});
    }

    async findByID(id: string): Promise<IBooking | undefined> {
        const doc = await this.model.findOne({_id: id});
        return doc?.toJSON();
    }
}