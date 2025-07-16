import { AxiosError } from "axios";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";

export const getUserReports = async (page: number, limit: number) => {
    try {
        const res = await axiosInstance.get(`/admin/report?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const deleteUserReport = async (id: string) => {
    try {
        const res = await axiosInstance.delete(`/admin/request/${id}`);
        if (res.data) {
            toast.success(res.data.message);
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
}

export const updateUserReport = async (id: string, status: string) => {
    const res = await axiosInstance.put(`/admin/report/${id}/status`, {
        status
    });

    return res.data;
}