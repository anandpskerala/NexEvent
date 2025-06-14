import type { User } from "./user";

export interface OrganizerData {
    id: string;
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
    userId: User;
    organization: string;
    website?: string;
    reason: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    updatedAt: string;
    name: string;
    email: string;
}

export interface NearestCity {
    city: string;
    district: string;
    state: string;
    country: string;
    lat: number;
    lng: number;
}