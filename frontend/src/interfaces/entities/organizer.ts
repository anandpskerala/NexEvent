import type { User } from "./User";

export interface OrganizerData {
    id: string;
    user?: User;
    userId: User | string;
    organization: string;
    website: string;
    reason: string;
    status: string;
    documents: string;
    rejectionReason?: string;
    createdAt: string;
}

export interface Organization {
    id: string;
    user: User;
    userId: string;
    organization: string;
    website?: string;
    reason: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    updatedAt: string;
    name: string;
    email: string;
}

export interface UserPosition {
    lat: number;
    lng: number;
}