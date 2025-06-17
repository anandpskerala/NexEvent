import { AllIRequests, IRequests } from "../../shared/types/IRequests";

export interface IRequestRepository {
    createRequest(data: Partial<IRequests>): Promise<IRequests>;
    updateRequest(id: string, data: Partial<IRequests>): Promise<IRequests | undefined>;
    deleteRequest(id: string): Promise<boolean>;
    getRequest(id: string): Promise<IRequests | undefined>;
    getRequests(skip: number, limit: number): Promise<AllIRequests>;
}