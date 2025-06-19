import { AxiosError } from "axios"
import { toast } from "sonner"
import axiosInstance from "./axiosInstance";

export const fetchToken = async (identity: string, room: string) => {
    try {
        const res = await axiosInstance.post("/messages/conference/token", {identity, room});
        console.log(res.data)
        return res.data.token;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
}