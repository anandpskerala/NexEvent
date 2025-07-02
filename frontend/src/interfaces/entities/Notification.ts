export interface Notification {
    id?: string;
    userId: string;
    title: string;
    type: string;
    message: string;
    read?: boolean;
    createdAt?: Date;
}