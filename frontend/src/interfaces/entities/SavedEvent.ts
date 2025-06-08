import type { AllEventData } from "./FormState";

export interface SavedEvent {
    id: string;
    eventId: AllEventData;
    userId: string;
    createdAt: string;
}