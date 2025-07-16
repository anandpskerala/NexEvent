import { UserDTO } from "./userDTO";

export interface RequestDTO {
  id: string;
  user: UserDTO;
  organization: string;
  website?: string | null;
  reason: string;
  documents: string;
  status: 'pending' | 'accepted' | 'rejected';
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}
