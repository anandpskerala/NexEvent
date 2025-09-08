import { toast } from "sonner";
import axiosInstance from "../utils/axiosInstance";
import { AxiosError } from "axios";
import type { Category } from "../interfaces/entities/Category";

export const getCategories = async (search?: string, page?: number, limit: number = 10) => {
    try {
        const res = await axiosInstance.get(`/admin/category?search=${search}&page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch categories", error);
        return null;
    }
}


export const deleteCategoryService = async (category: string) => {
    try {
        const res = await axiosInstance.delete(`/admin/category/${category}`);
        if (res.data) {
            toast.success(res.data.message);
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
}

export const createCategory = async (payload: Partial<Category>) => {
    try {
        const res = await axiosInstance.post('/admin/category', payload);
        if (res.data) {
            toast.success(res.data.message);
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
}

export const editCategory = async (id: string, payload: Partial<Category>) => {
    try {
        const res = await axiosInstance.patch(`/admin/category/${id}`, payload);
        if (res.data) {
            toast.success(res.data.message);
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
}

export const getCategoryDetails = async (id: string) => {
    try {
        const res = await axiosInstance.get(`/admin/category/${id}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}