import { toast } from "sonner";
import axiosInstance from "../utils/axiosInstance";
import { AxiosError } from "axios";
import type { ICoupon } from "../interfaces/entities/Coupons";

export const getCoupons = async (search: string = "", page: number = 1, limit: number = 10) => {
    try {
        const res = await axiosInstance.get(`/admin/coupon?search=${search}&page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        console.error(error);
        toast.error('Failed to fetch coupons');
        return null;
    }
}

export const deleteCouponService = async (coupon: string) => {
    try {
        const res = await axiosInstance.delete(`/admin/coupon/${coupon}`);
        if (res.data) {
            toast.success(res.data.message);
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
}

export const getCouponDetails = async (id: string) => {
    try {
        const res = await axiosInstance.get(`/admin/coupon/${id}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const createCoupon = async (payload: Partial<ICoupon>) => {
    try {
        const res = await axiosInstance.post('/admin/coupon', payload);
        if (res.data) {
            toast.success(res.data.message);
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
}

export const editCoupon = async (id: string, payload: Partial<ICoupon>) => {
    try {
        const res = await axiosInstance.patch(`/admin/coupon/${id}`, payload);
        if (res.data) {
            toast.success(res.data.message);
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
}
