import type { Organization } from "./Organizer";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
    isVerified: boolean;
    isBlocked: boolean;
    phoneNumber?: string;
    authProvider?: string;
    organizer: Organization;
    image?: string;
    unreadCount?: number;
    lastMessage?: string;
    lastMessageAt?: string;
    createdAt: string;
}