export interface IRequest {
  id: string;
  userId: string;
  organization: string;
  website?: string | null;
  reason: string;
  documents: string;
  status: 'pending' | 'accepted' | 'rejected';
  rejectionReason?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
