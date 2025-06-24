import { Types } from "mongoose";

export interface IOtp {
  id: string;
  userId: Types.ObjectId;
  otp: number;
  expiry: Date
}