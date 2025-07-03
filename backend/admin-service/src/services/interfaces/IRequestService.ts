import { IRequests } from "../../shared/types/IRequests";
import { RequestPaginationType, RequestReturnType } from "../../shared/types/ReturnType";

export interface IRequestService {
    createRequest(data: IRequests): Promise<RequestReturnType>;
    getRequest(id: string): Promise<RequestReturnType>;
    getAllRequest(page: number, limit: number): Promise<RequestPaginationType>;
    updateRequest(id: string, status: "pending" | "accepted" | "rejected"): Promise<RequestReturnType>;
    deleteRequest(id: string): Promise<RequestReturnType>;
}