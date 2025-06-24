import type { User } from "./User";

export interface Review {
    id: string;
    userId: User,
    eventId: string;
    rating: number;
    title: string;
    message: string;
    createdAt: string;
}