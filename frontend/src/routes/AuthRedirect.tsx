import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { RedirectProps } from "../interfaces/props/routeProps";


export const AuthRedirect: React.FC<RedirectProps> = ({user}) => {
    if (user && user.isVerified && !user.isBlocked) {
        return <Navigate to="/" replace />;
    } 
    return <Outlet />;
}