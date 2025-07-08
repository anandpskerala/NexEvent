import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import config from "../config/config";
import axiosInstance from "./axiosInstance";

export const uploadToCloudinary = async (file: File) => {
    try {
        const { data } = await axiosInstance.post("/admin/upload/signature");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", data.apiKey);
        formData.append("timestamp", data.timestamp);
        formData.append("signature", data.signature);
        formData.append("upload_preset", config.cloudinary.cloudPreset);

        const cloudName = config.cloudinary.cloudName;

        const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        return res.data.secure_url;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Upload Error:", error.response?.data || error.message);
            toast.error("Something went wrong");
        }
        return null;
    }
};