import { Model } from "mongoose";
import { IForgotRequest } from "../../shared/types/IForgotRequest";
import { IForgotRepository } from "../interfaces/IForgotRepository";
import forgotModel from "../../models/forgotModel";

export class ForgotRepository implements IForgotRepository {
    private model: Model<IForgotRequest>;

    constructor() {
        this.model = forgotModel;
    }

    async findByUserId(userId: string): Promise<IForgotRequest | undefined> {
        const doc = await this.model.findOne({userId});
        return doc?.toJSON()
    }

    async findByID(id: string): Promise<IForgotRequest | undefined> {
        const doc = await this.model.findOne({_id: id});
        return doc?.toJSON()
    }

    async findByRequestId(id: string):  Promise<IForgotRequest | undefined> {
        const doc = await this.model.findOne({requestId: id});
        return doc?.toJSON();
    }

    async create(item: Partial<IForgotRequest>): Promise<IForgotRequest> {
        const doc = await this.model.create(item);
        return doc.toJSON();
    }

    async update(id: string, item: Partial<IForgotRequest>): Promise<void> {
        await this.model.updateOne({_id: id}, {$set: item});
    }

    async delete(id: string): Promise<void> {
        await this.model.deleteOne({_id: id});
    }
    
}