import type { AxiosResponse } from "axios";
import axiosInstance from "../utils/axiosInstance";

export const getInteractedChats = async (userId: string, query?: string) => {
    let res: AxiosResponse;
    if (query) {
        res = await axiosInstance.get(`/user/users?query=${query}&myId=${userId}`);
    } else {
        res = await axiosInstance.post(`/messages/interactions`, { userId: userId });
    }

    return res.data;
}

export const getConversations = async (id: string, limit: number = 0, offset: number = 0) => {
    const res = await axiosInstance.get(
        `/messages/conversations/${id}?limit=${limit}&offset=${offset}`
    );
    return res.data;
}

export const readMessages = async (id: string) => {
    await axiosInstance.patch(`/messages/conversations/${id}`);
}

export const sendChatMessage = async (sender: string, receiver: string, content: string, media?: string) => {
    const response = await axiosInstance.post('/messages/chat', {
        sender,
        receiver,
        content,
        media,
    });

    return response.data;
}