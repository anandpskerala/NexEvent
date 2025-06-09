import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import type { OrganizerProps } from '../interfaces/props/routeProps';

export const OrganizerRoutes: React.FC<OrganizerProps> = ({user}) => {
    if (user === undefined) {
        return null;
    }
    if (!user?.isVerified || user.isBlocked || !user.roles.includes("organizer")) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}