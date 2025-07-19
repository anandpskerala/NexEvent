import { IForgotRequest } from "../../shared/types/IForgotRequest";
import { IForgotRepository } from "../interfaces/IForgotRepository";
import forgotModel from "../../models/forgotModel";
import { BaseRepository } from "../BaseRepository";
import { injectable } from "tsyringe";

@injectable()
export class ForgotRepository extends BaseRepository<IForgotRequest> implements IForgotRepository {

    constructor() {
        super(forgotModel);
    }

    async findByUserId(userId: string): Promise<IForgotRequest | undefined> {
        const doc = await this.model.findOne({userId});
        return doc?.toJSON()
    }

    async findByRequestId(id: string):  Promise<IForgotRequest | undefined> {
        const doc = await this.model.findOne({requestId: id});
        return doc?.toJSON();
    }
}