import type { NearestCity, OrganizerData } from "../entities/organizer";
import type { User } from "../entities/user";

export interface ImageUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  maxSizeMB?: number;
  allowedTypes?: string[];
  aspectRatio?: number;
  title?: string;
}

export type UploadStatus = 'idle' | 'loading' | 'success' | 'error';

export interface RequestDetailsProps {
  user?: User | null;
  request: OrganizerData;
  onReapply?: () => Promise<void>;
  onUpdateStatus: (status: 'accepted' | 'rejected') => void
}

export interface ReqConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  action: 'approve' | 'reject';
  organizationName: string;
}

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedUser: User) => void;
};

export const availableRoles = [
  { id: "user", label: "User" },
  { id: "organizer", label: "Organizer" },
  { id: "admin", label: "Admin" }
];

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}


export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  action: 'approve' | 'reject';
  organizationName: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface UseNearestCityResult {
  city?: NearestCity;
  loading: boolean;
  error: string | null;
}

export interface UserReportProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  reporter: string;
}