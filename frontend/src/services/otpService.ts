import { AxiosError } from "axios";
import { toast } from "sonner";
import axiosInstance from "../utils/axiosInstance";

export const requestOtp = async () => {
    try {
        const response = await axiosInstance.patch("/user/otp");
        if (response.data) {
            toast.success(response.data.message);
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
}

export const getOtpTimer = async () => {
    const response = await axiosInstance.get("/user/otp");
    return response.data;
}