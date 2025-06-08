import { Types } from "mongoose";

export interface IForgotRequest {
  id: string;
  userId: Types.ObjectId;
  requestId: string;
  expiry: Date
}