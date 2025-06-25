import type { Category } from "../entities/Category";
import type { ICoupon } from "../entities/Coupons";
import type { TicketErrorState } from "../entities/ErrorState";
import type { AllEventData, EventData, Ticket } from "../entities/FormState";
import type { OrganizerData } from "../entities/Organizer";
import type { User } from "../entities/User";

export interface RequestFormProps {
    userId?: string
}

export interface RequestDetailsProps {
    user?: User | null;
    request: OrganizerData;
    onReapply?: () => Promise<void>;
    onUpdateStatus: (status: 'accepted' | 'rejected') => void
}

export interface CategoryFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    image?: string;
  };
  isEditMode?: boolean;
}

export interface EventFormProps {
    user: User;
    initialData?: EventData;
    isEdit?: boolean;
}

export interface EventCardProps {
    event: AllEventData
}

export interface CategoryCardProps {
    category: Category
}

export interface TicketProps {
    ticket: Ticket,
    index: number;
    errors: TicketErrorState,
    onChange: (index: number, field: keyof Ticket, value: unknown) => void;
    canDelete?: boolean;
    onDelete: (index: number) => void;
}

export interface TicketFormProps {
    initialData?: AllEventData;
    isEdit?: boolean;
}

export interface CouponFormProps {
    initialData?: ICoupon;
    isEdit?: boolean;
}