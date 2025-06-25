import type { User } from "./User";

export interface FeatureRequest {
    id?: string;
    userId: string;
    user?: User;
    featureTitle: string;
    category: string;
    priority: string;
    description: string;
    useCase: string;
    additionalInfo: string;
    status?: "pending" | "accepted" | "rejected";
    createdAt?: string;
    updatedAt?: string;
}