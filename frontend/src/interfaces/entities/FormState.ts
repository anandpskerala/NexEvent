export interface LoginFormState {
    email: string;
    password: string;
}

export interface RegisterFormState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    accepted: boolean;
}

export interface ResetFormState {
    password: string;
    confirmPassword: string;
};

export interface ProfileFromState {
    firstName?: string;
    lastName?: string,
    phoneNumber?: string;
}

export interface PasswordFormState {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface OrganizerFormState {
    userId?: string;
    phoneNumber?: string;
    organization?: string;
    website?: string;
    reason?: string;
    accepted?: boolean;
    documents?: File | null;
}

export interface CategoryFormData {
  name: string;
  description: string;
  icon: File | string| null;
}

export interface EventData {
    id?: string;
    title: string;
    description: string;
    eventType: string;
    category: string;
    image: File | string | null;
    tags: string[];
    eventFormat: string;
    location?: Location;
    startTime?: string;
    endTime?: string;
    startDate?: string;
    endDate?: string
}

export interface AllEventData {
    id?: string;
    title: string;
    description: string;
    eventType: string;
    category: string;
    image: File | string | null;
    tags: string[];
    eventFormat: string;
    location?: Location;
    status?: string;
    startTime?: string;
    endTime?: string;
    startDate?: string;
    endDate?: string;
    currency: string;
    entryType: string;
    showQuantity: boolean;
    refunds: boolean;
    tickets?: Ticket[];
    availableTickets?: number;
}

export interface Location {
    place?: string;
    coordinates: number[];
}

export interface Ticket {
    id: string;
    name: string;
    type: string;
    price?: number | string;
    quantity: number;
    description: string;
    startDate: Date;
    endDate: Date;
}

export interface FeatureRequestFormData {
    featureTitle: string;
    category: string;
    priority: string;
    description: string;
    useCase: string;
    additionalInfo: string;
}