export interface IRequests {
    id?: string;
    userId: string;
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

export interface AllIRequests {
    items: IRequests[],
    total: number
}