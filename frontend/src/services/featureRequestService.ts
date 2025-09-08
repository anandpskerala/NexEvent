import { AxiosError } from "axios";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";
import type { FeatureRequest } from "../interfaces/entities/FeatureRequest";
import type { FeatureRequestFormData } from "../interfaces/entities/FormState";

export const getFeatureRequests = async (page: number = 1, limit: number = 10) => {
    try {
        const res = await axiosInstance.get(`/admin/request?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const deleteFeatureRequest = async (id: string) => {
    try {
        const res = await axiosInstance.delete(`/admin/request/${id}`);
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
        return null;
    }
}

export const updateFeatureRequest = async (id: string, data: FeatureRequest) => {
    try {
        await axiosInstance.patch(`/admin/request/${id}`, data);
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        } else {
            toast.error("Something went wrong");
        }
    }
}

export const createFeatureRequest = async (formData: FeatureRequestFormData) => {
    try {
        const res = await axiosInstance.post(`/admin/request`, formData);
        return res.data;
    } catch (error) {
        console.error('Submission error:', error);
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
}