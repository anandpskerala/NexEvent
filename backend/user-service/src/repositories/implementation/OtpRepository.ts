import { Model } from "mongoose";
import { IOtp } from "../../shared/types/IOtp";
import { IOtpRepository } from "../interfaces/IOtpRepository";
import otpModel from "../../models/otpModel";

export class OtpRepository implements IOtpRepository {
    public model: Model<IOtp>;
    constructor () {
        this.model = otpModel;
    }
    
    async findOtp(userId: string, otp?: number): Promise<IOtp | undefined> {
        const query: Partial<Record<keyof IOtp, unknown>> = { userId };
        if (otp !== undefined) {
            query.otp = otp;
        }

        const otpDoc = await this.model.findOne(query);
        return otpDoc?.toJSON();
    }

    async findByID(id: string): Promise<IOtp | undefined> {
        const doc = await this.model.findOne({ _id: id });
        return doc?.toJSON();
    }

    async create(item: Partial<IOtp>): Promise<IOtp> {
        const doc = await this.model.create(item);
        return doc?.toJSON();
    }

    async update(id: string, item: Partial<IOtp>): Promise<void> {
        await this.model.updateOne({_id: id}, {$set: item});
    }

    async delete(id: string): Promise<void> {
        await this.model.deleteOne({_id: id})
    }
}