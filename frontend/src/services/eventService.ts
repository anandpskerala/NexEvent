import { AxiosError } from "axios";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";
import type { EventData, Ticket } from "../interfaces/entities/FormState";

export const saveEvent = async (id: string, userId: string) => {
    try {
        const res = await axiosInstance.post(`/event/saved/${userId}`, { eventId: id });
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const removeSaveEvent = async (id: string) => {
    try {
        const res = await axiosInstance.delete(`/event/saved/${id}`);
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const cancelEventService = async (eventId: string) => {
    try {
        const res = await axiosInstance.put(`/bookings/booking/${eventId}`);
        if (res.data) {
            toast.success(res.data.message);
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
    }
}

export const eventManagement = async (payload: EventData & { userId: string }, isEdit: boolean = false) => {
    try {
        let method = axiosInstance.post;
        let url = "/event/event";
        if (isEdit) {
            method = axiosInstance.patch;
            url = `event/event/${payload.id}`;
        }
        const res = await method(url, payload);
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
        return null;
    }
}

export const manageTickets = async (id: string, payload: {
    id: string;
    currency: string;
    entryType: string;
    showQuantity: true;
    refunds: boolean;
    tickets: Ticket[]}, isEdit: boolean = false) => {
    try {
        let method = axiosInstance.post;
        let url = "/event/ticket"
        if (isEdit) {
            method = axiosInstance.patch;
            url = `/event/ticket/${id}`;
        }
        const res = await method(url, payload);
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data.message);
        }
        return null;
    }
}


export const getEventDetails = async (id: string) => {
    try {
        const res = await axiosInstance.get(`/event/event/${id}`)
        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
}


export const getEventList = async (
    search: string = "", 
    page: number = 1, 
    userId: string = "", 
    limit: number = 10,
    isOrganizer: boolean = false,
    category: string = "",
    eventType: string = "",
    eventStatus: string = "",
    startDate: string = "",
    endDate: string = "",
    sortBy: string = "createdAt"
) => {
    try {
        const res = await axiosInstance.get(`/event/all?search=${search}&page=${page}&userId=${userId}&limit=${limit}&category=${category}&eventType=${eventType}&eventStatus=${eventStatus}&startDate=${startDate}&endDate=${endDate}&sortBy=${sortBy}&isOrganizer=${isOrganizer}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const getSavedEvents = async (page: number = 1, limit: number = 10) => {
    try {
        const res = await axiosInstance.get(`/event/all-saved?page=${page}&limit=${limit}}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getNearbyEvents = async (lat: number, lng: number) => {
    try {
        const res = await axiosInstance.get(`/event/nearbyevents?lat=${lat}&lng=${lng}`);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}