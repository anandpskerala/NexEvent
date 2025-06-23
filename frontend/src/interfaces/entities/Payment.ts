import type { AllEventData } from "./FormState";
import type { User } from "./User";

export type PaymentMethod = "razorpay" | "stripe" | "wallet";

export interface UsePaymentProps {
  event: AllEventData | null;
  user: User | null;
  total: number;
  tickets: {
        [ticketId: string]: {
            quantity: number;
            price: number;
            name: string;
        };
    }[];
  promoCode?: string;
}