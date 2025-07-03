import { IRequest } from "../../shared/types/IRequest";
import { RequestReturnType, RequestPaginationType, UserReturnType } from "../../shared/types/ReturnType";

export interface IRequestService {
    createRequest(data: Partial<IRequest>): Promise<RequestReturnType>;
    getRequest(userId: string): Promise<RequestReturnType>;
    deleteRequest(reqId: string): Promise<RequestReturnType>;
    getAllRequests(page: number, limit: number): Promise<RequestPaginationType>;
    updateRequest(userId: string, action: string, rejectionReason?: string): Promise<UserReturnType>;
    
}