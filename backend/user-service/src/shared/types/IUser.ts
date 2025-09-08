import { IRequest } from "./IRequest";

export interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string | null;
  googleId: string | null;
  phoneNumber?: number | bigint | null;
  image?: string | null;
  authProvider: "google" | "email";
  roles: ("user" | "organizer" | "admin")[];
  isBlocked: boolean;
  isVerified: boolean;
  organizer?: IRequest | null;
  organizerId?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface AllUsers {
  users: IUser[];
  total: number;
}
