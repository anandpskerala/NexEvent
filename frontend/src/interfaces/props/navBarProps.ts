import type { JSX } from "react";
import type { User } from "../entities/user"

export interface NavBarProps {
    isLogged: boolean | undefined,
    name?: string
    user?: User | null
    section?: string
}

export interface AdminNavbarProps {
    title: string;
    user?: User | null;
    toggleSidebar: () => void
}

export interface SideBarProps {
    icon: JSX.Element;
    text: string;
    href: string;
    active?: boolean;
    collapsed?: boolean;
}