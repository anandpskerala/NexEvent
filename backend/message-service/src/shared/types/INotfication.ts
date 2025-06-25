export interface INotification {
    id?: string;
    userId: string;
    title: string;
    message: string;
    read?: boolean;
    createdAt?: Date;
}