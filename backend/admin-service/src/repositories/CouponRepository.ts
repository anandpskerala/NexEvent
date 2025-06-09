import { Model } from "mongoose";
import { ICoupon } from "../shared/types/ICoupon";
import { ICouponRepository } from "./interfaces/ICouponRepository";
import couponModel from "../models/couponModel";

export class CouponRepository implements ICouponRepository {
    private model: Model<ICoupon>;
    
    constructor() {
        this.model = couponModel;
    }

    async findByName(name: string): Promise<ICoupon | undefined> {
        const doc = await this.model.findOne({couponName: { $regex: name, $options: "i" }});
        return doc?.toJSON();
    }

    async findByCode(couponCode: string): Promise<ICoupon | undefined> {
        const doc = await this.model.findOne({couponCode: { $regex: couponCode, $options: "i" }});
        return doc?.toJSON();
    }

    async findByID(id: string): Promise<ICoupon | undefined> {
        const doc = await this.model.findOne({_id: id});
        return doc?.toJSON();
    }

    async findAll(name?: string, page?: number, limit?: number): Promise<{ items: ICoupon[]; total: number; }> {
        const query = this.model.find({couponName: { $regex: name, $options: "i" }});

        if (page && limit) {
            const skip = (page - 1) * limit;
            query.skip(skip).limit(limit);
        }

        const [docs, total] = await Promise.all([
            query.sort({ createdAt: -1 }),
            this.model.countDocuments({couponName: { $regex: name, $options: "i" }})
        ]);

        const items = docs.map(doc => doc.toJSON());

        return { items, total };
    }

    async create(item: Partial<ICoupon>): Promise<ICoupon> {
        const doc = await this.model.create(item);
        return doc.toJSON();
    }

    async update(id: string, item: Partial<ICoupon>): Promise<void> {
        await this.model.updateOne({_id: id}, {$set: item});
    }

    async delete(id: string): Promise<void> {
        await this.model.deleteOne({_id: id});
    }
}