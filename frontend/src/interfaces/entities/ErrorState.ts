export interface LoginErrorState {
    email?: string;
    password?: string;
    [key: string]: string | undefined;
}

export interface RegisterErrorState {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    accepted?: boolean;
    [key: string]: string | undefined | boolean;
}

export interface ResetErrorState {
    password?: string;
    confirmPassword?: string;
    [key: string]: string | undefined;
}

export interface PasswordErrorState {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    [key: string]: string | undefined | boolean;
}

export interface RequestErrorState {
    phoneNumber?: string;
    organization?: string;
    [key: string]: string | undefined;
}

export interface CategoryErrorState {
  name?: string;
  description?: string;
  [key: string]: string | undefined;
}

export interface EventErrorState {
    title?: string;
    description?: string;
    location?: string;
    category?: string;
    image?: string;
    [key: string]: string | undefined;
}

export interface TicketErrorState {
    name?: string;
    type?: string;
    price?: string;
    quantity?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    [key: string]: string | undefined;
}

export interface CouponErrorState {
    id?: string;
    couponCode?: string;
    couponName?: string;
    description?: string;
    discount?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    minAmount?: string;
    maxAmount?: string;
    [key: string]: string | undefined;
}

export interface FeatureFormErrors {
    [key: string]: string;
}