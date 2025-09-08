import { Document } from "mongoose";
import { PaymentMethod, PaymentStatus } from "./Payments";

export interface IPayment extends Document {
  userId: string;
  eventId: string;
  bookingId: string;
  orderId?: string;
  paymentId?: string;
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}