import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import type { AdminProps } from '../interfaces/props/routeProps'


export const AdminRoutes: React.FC<AdminProps> = ({user}) => {
    if (user === undefined) {
        return null;
    }
    if (!user?.isVerified || user.isBlocked || !user.roles.includes("admin")) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}