export interface SignupDataPayload {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export interface LoginDataPayload {
    email: string,
    password: string
}

export interface OtpDataPayload {
    otp: string
}

export interface ImageDataPayload {
    image?: string;
}

export interface ProfilePayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
}

export interface BrowsePayloadData {
    category?: string;
    eventType?: string;
    eventStatus?: string;
    location?: string;
    sortBy?: string;
    startDate?: string;
    endDate?: string;
}