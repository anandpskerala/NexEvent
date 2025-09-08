import type { OrganizerFormState } from "../interfaces/entities/FormState";
import axiosInstance from "../utils/axiosInstance";

export const getRequestDetails = async (id: string) => {
    try {
        const res = await axiosInstance.get(`/user/request/${id}`);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch requests", error);
        return null;
    }
}

export const getRequests = async (page: number, limit: number = 10) => {
    try {
        const res = await axiosInstance.get(`/user/requests?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch requests", error);
        return null;
    }
}

export const manageOrganizerRequest = async (userId: string, action: string, reason?: string) => {
    const res = await axiosInstance.patch(`/user/request/${userId}`, {
        action,
        rejectionReason: reason
    });
    return res.data;
}

export const submitOrganiserRequestForm = async (userId: string, data: OrganizerFormState) => {
    const res = await axiosInstance.post(`/user/request/${userId}`, data);
    return res.data;
}