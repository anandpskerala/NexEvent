import type { User } from "../entities/User";

export interface AdminProps {
    user?: User | null
}

export interface RedirectProps {
    user?: User | null;
}

export interface ProtectedProps {
    user?: User | null;
}

export interface OrganizerProps {
    user?: User | null
}