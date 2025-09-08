import { AxiosError } from "axios";
import type { PasswordFormState } from "../interfaces/entities/FormState";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";
import type { User } from "../interfaces/entities/User";

export const getUserDetails = async (id: string) => {
    try {
        const res = await axiosInstance.get(`/user/${id}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const changePassword = async (passwordData: PasswordFormState) => {
    try {
        const response = await axiosInstance.patch("/user/auth/change-password", passwordData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            toast.error(error.response.data.message);
        }
        return null;
    }
}

export const forgotPassword = async (email: string) => {
    try {
        const res = await axiosInstance.post("/user/auth/forgot-password", { email })
        if (res.data) {
            toast.success(res.data.message);
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }
}

export const resetPassword = async (requestId: string, newPassword: string) => {
    try {
        const response = await axiosInstance.patch("/user/auth/reset-password", { requestId, newPassword });
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
        return null;
    }
}

export const reApplyRequestForOrganizer = async (id: string) => {
    try {
        const res = await axiosInstance.delete(`/user/request/${id}`);
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
        console.error(error)
        return null;
    }
}

export const getOrganizerRequest = async (id: string) => {
    try {
        const res = await axiosInstance.get(`/user/request/${id}`)
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const updateUserDetails = async (user: User) => {
    try {
        const res = await axiosInstance.patch(`/user/${user.id}`, user);
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message || "Failed to update user.");
        }
        return null;
    }
}

export const deleteUserDetails = async (id: string) => {
    try {
        const res = await axiosInstance.delete(`/user/${id}`);
        return res.data
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message || "Failed to delete user.");
        } else {
            toast.error("An unexpected error occurred.");
        }
    }
    return null;
}

export const getUsers = async (
    query: string = "",
    page: number = 1,
    status: string = "",
    role: string = ""
) => {
    try {
        const res = await axiosInstance.get(
            `/user/users?query=${query}&page=${page}&limit=10&status=${status}&role=${role}`
        );
        return res.data;
    } catch (error) {
        toast.error("Failed to fetch users. Please try again.");
        console.error("Failed to fetch users", error);
        return null;
    }
}