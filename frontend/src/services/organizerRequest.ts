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