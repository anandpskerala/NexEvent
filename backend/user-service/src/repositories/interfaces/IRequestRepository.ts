import { IRequest } from "../../shared/types/IRequest";

export interface IRequestRepository {
    create(item: Partial<IRequest>): Promise<IRequest>;
    findByID(id: string): Promise<IRequest | undefined>;
    update(id: string, item: Partial<IRequest>): Promise<void>;
    delete(id: string): Promise<void>;
    findByUserID(userId: string): Promise<IRequest | undefined>;
    countDocs(): Promise<number>;
    getRequests(skip: number, limit: number): Promise<IRequest[]>;
    updateRequest(userId: string, action: string, rejectionReason?: string): Promise<void>
}