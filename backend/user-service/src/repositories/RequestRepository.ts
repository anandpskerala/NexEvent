import { Model } from "mongoose";
import { IRequestRepository } from "./interfaces/IRequestRepository";
import { IRequest } from "../types/organizerRequest";
import requestModel from "../models/requestModel";

export class RequestRepository implements IRequestRepository {
    private model: Model<IRequest>
    constructor() {
        this.model = requestModel;
    }

    public async findByUserID(userId: string): Promise<IRequest | undefined> {
        const doc = await this.model.findOne({userId}).populate("userId");
        return doc?.toJSON();
    }

    public async create(item: Partial<IRequest>): Promise<IRequest> {
        const doc = await this.model.create(item);
        return doc.toJSON();
    }

    public async countDocs(): Promise<number> {
        return await this.model.countDocuments();
    }

    public async getRequests(skip: number, limit: number): Promise<IRequest[]> {
        return await this.model.find().skip(skip).limit(limit).sort({createdAt: -1}).populate("userId");
    }

    public async updateRequest(userId: string, action: string, rejectionReason?: string): Promise<void> {
        await this.model.updateOne({userId}, {$set: {status: action, rejectionReason}});
    }

    public async update(id: string, item: Partial<IRequest>): Promise<void> {
        await this.model.updateOne({_id: id}, {$set: item});
    }

    public async delete(id: string): Promise<void> {
        await this.model.deleteOne({_id: id});
    }

    async findByID(id: string): Promise<IRequest | undefined> {
        const doc = await this.model.findOne({_id: id});
        return doc?.toJSON();
    }
}