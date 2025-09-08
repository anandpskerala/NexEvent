import { Types } from "mongoose";
import { OrganizerDTO } from "./organizerDTO";

export interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: number | string | null;
  image?: string | null;
  authProvider: "google" | "email";
  roles: ("user" | "organizer" | "admin")[];
  isBlocked: boolean;
  isVerified: boolean;
  organizer: Types.ObjectId | OrganizerDTO | null;
  createdAt: string | Date;
}
