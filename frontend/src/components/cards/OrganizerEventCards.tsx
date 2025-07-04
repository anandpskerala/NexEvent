import { MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import type { EventCardProps } from "../../interfaces/props/formProps";
import { AxiosError } from "axios";
import { toast } from "sonner";


const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const OrganizerEventCard: React.FC<EventCardProps> = ({ event }) => {
    const [category, setCategory] = useState<{ name: string }>();
    const imageUrl = event.image || "https://via.placeholder.com/400x200.png?text=Event+Banner";
    const navigate =  useNavigate();

    const cancelEvent = async (eventId: string) => {
        try {
            const res = await axiosInstance.put(`/event/booking/${eventId}`);
            if (res.data) {
                toast.success(res.data.message);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
    }

    const manageEvent = (eventId: string) => {
        navigate(`/organizer/edit-event/${eventId}`)
    }

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await axiosInstance.get(`/admin/category/${event.category}`)
                if (res.data) {
                    setCategory(res.data.category)
                }
                console.log(res)
            } catch (error) {
                console.error(error)
            }
        };
        fetchRequest();
    }, [event.category]);
    return (
        <div className="max-w-xs w-full rounded-2xl shadow-md bg-white overflow-hidden transition-transform hover:scale-[1.02] duration-200">
            <div className="relative">
                <img
                    className="w-full h-36 object-cover"
                    src={imageUrl as string}
                    alt="Event banner"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {capitalize(event.eventType)}
                </div>
            </div>

            <div className="p-5 space-y-3">
                <div className="flex items-center flex-wrap gap-2 text-sm font-medium text-gray-700">
                    <span className="text-red-600">{new Date(event.startDate as string).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">{capitalize(event.entryType)}</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">{category?.name}</span>
                </div>

                <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {event.title}
                </h2>

                <div className="flex items-center text-gray-500 text-sm">
                    <MapPin size={16} className="mr-1" />
                    <span>{event.location?.place || "Virtual Event"}</span>
                </div>

                <div className="flex flex-col md:flex-row w-full pt-3 gap-2">
                    <button 
                        className={`w-full ${event.status === 'upcoming'? 'bg-red-500 cursor-pointer': 'bg-gray-500 cursor-not-allowed'} text-white text-center p-2 rounded-md`}
                        onClick={() => cancelEvent(event.id as string)}
                        disabled={event.status !== "upcoming"}
                    >
                        {event.status === "upcoming" ? "Cancel": (event.status === "cancelled"? "Cancelled": "Cancel")}
                    </button>
                    <button
                        onClick={() => manageEvent(event.id as string)}
                        className={`w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold p-2 rounded-md transition ${event.status === "cancelled" ? 'cursor-not-allowed': 'cursor-pointer'}`}
                        disabled={event.status === "cancelled"} 
                    >
                        Manage Event
                    </button>
                </div>
            </div>
        </div >
    );
};