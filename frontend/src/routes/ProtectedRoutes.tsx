import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import type { ProtectedProps } from '../interfaces/props/routeProps';


export const ProtectedRoute: React.FC<ProtectedProps> = ({user}) => {
    if (user === undefined) {
        return null;
    }

    if (!user?.isVerified || user.isBlocked) {
        return <Navigate to="/login" replace />
    }
    return <Outlet />
}