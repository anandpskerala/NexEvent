export interface INotification {
    id?: string;
    userId: string;
    title: string;
    type: string;
    message: string;
    read?: boolean;
    createdAt?: Date;
}