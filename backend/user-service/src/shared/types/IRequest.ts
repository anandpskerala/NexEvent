import { Types } from "mongoose";

export interface IRequest {
    id: string;
    userId: Types.ObjectId;
    organization: string;
    website: string;
    reason: string;
    documents: string;
    status: string;
    rejectionReason?: string;
}