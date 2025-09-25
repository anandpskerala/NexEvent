import { IRequests } from "../types/IRequests";
import { IUser } from "../types/IUser";

export interface RequestDTO {
    id: string;
    userId: string;
    user?: IUser;
    featureTitle: string;
    category: string;
    priority: string;
    description: string;
    useCase: string;
    additionalInfo: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
    updatedAt: string;
}
export const toRequestDTO = (entity: IRequests): RequestDTO => {
    return {
        id: entity.id as string,
        userId: entity.userId,
        featureTitle: entity.featureTitle,
        category: entity.category,
        priority: entity.priority,
        description: entity.description,
        useCase: entity.useCase,
        additionalInfo: entity.additionalInfo,
        status: entity.status as "pending" | "accepted" | "rejected",
        createdAt: entity.createdAt as string,
        updatedAt: entity.updatedAt as string
    };
}