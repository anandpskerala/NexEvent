import axiosInstance from "../utils/axiosInstance";

export const fetchNotifications = async (id: string, page: number, limit: number) => {
    try {
        const res = await axiosInstance.get(`/messages/notifications/all/${id}?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        console.error(error);
    }
}