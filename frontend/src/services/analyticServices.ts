import axiosInstance from "../utils/axiosInstance";

export const getAnalyticData = async (mode: string, organizer?: string, limit: number = 10) => {
    try {
        const [revenueRes, topRes] = await Promise.all([
            axiosInstance.get(`/event/analytics/revenue?mode=${mode}${organizer ? `&organizerId=${organizer}`: ''}`),
            axiosInstance.get(`/event/analytics/topselling?mode=${mode}${organizer ? `&organizerId=${organizer}`: ''}&limit=${limit}`)
        ]);
        return [revenueRes.data, topRes.data]
    } catch (error) {
        console.error(error);
        return [null, null]
    }
}