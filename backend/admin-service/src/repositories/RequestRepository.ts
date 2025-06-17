import { Model } from "mongoose";
import { IRequestRepository } from "./interfaces/IRequestRepository";
import { AllIRequests, IRequests } from "../shared/types/IRequests";
import requestModel from "../models/requestModel";

export class RequestRepository implements IRequestRepository {
    private readonly model: Model<IRequests>;

    constructor() {
        this.model = requestModel;
    }

    async createRequest(data: Partial<IRequests>): Promise<IRequests> {
        const doc = await this.model.create(data);
        return doc.toJSON();
    }

    async updateRequest(id: string, data: Partial<IRequests>): Promise<IRequests | undefined> {
        const doc = await this.model.findOneAndUpdate({_id: id}, {$set: data}, {new: true});
        return doc?.toJSON()
    }

    async deleteRequest(id: string): Promise<boolean> {
        const doc = await this.model.findByIdAndDelete(id);
        return !!doc;
    }

    async getRequest(id: string): Promise<IRequests | undefined> {
        const doc = await this.model.findOne({_id: id});
        return doc?.toJSON();
    }

    async getRequests(skip: number, limit: number): Promise<AllIRequests> {
        const [total, docs] = await Promise.all([
            this.model.countDocuments(),
            this.model.find({}).skip(skip).limit(limit)
        ]);
        const items = docs.map(doc => doc.toJSON());
        return {
            items,
            total
        }
    }
}