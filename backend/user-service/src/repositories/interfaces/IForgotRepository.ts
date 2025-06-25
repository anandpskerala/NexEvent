import { IForgotRequest } from "../../shared/types/IForgotRequest";

export interface IForgotRepository {
    findByUserId(userId: string): Promise<IForgotRequest | undefined>;
    findByID(id: string): Promise<IForgotRequest| undefined>;
    findByRequestId(id: string):  Promise<IForgotRequest | undefined>;
    create(item: IForgotRequest): Promise<IForgotRequest>;
    update(id: string, item: Partial<IForgotRequest>): Promise<void>;
    delete(id: string): Promise<void>;
}