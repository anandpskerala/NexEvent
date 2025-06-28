import { useEffect, useRef, useState } from "react";
import config from "../config/config";
import type { Notification } from "../interfaces/entities/Notification";
import { fetchAccessToken } from "../utils/fetchRefreshToken";
import axiosInstance from "../utils/axiosInstance";

export const useNotification = (userId: string | undefined) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const eventSourceRef = useRef<EventSource | null>(null);
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const retryCountRef = useRef<number>(0);

    const connectToSSE = () => {
        if (!userId) return;

        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const eventSource = new EventSource(`${config.backendUrl}/messages/notifications/stream/${userId}`, {
            withCredentials: true,
        });

        eventSource.addEventListener("init", (event) => {
            const unread: Notification[] = JSON.parse(event.data);
            setNotifications((prev) => [...unread, ...prev]);
        });


        eventSource.onmessage = (event) => {
            retryCountRef.current = 0;
            const data: Notification = JSON.parse(event.data);
            console.log(data);
            setNotifications((prev) => [data, ...prev]);
        };

        eventSource.onerror = async () => {
            eventSource.close();
            retryCountRef.current += 1;
            await fetchAccessToken();
            const delay = Math.min(30000, 1000 * Math.pow(2, retryCountRef.current));
            console.warn(`SSE error, retrying in ${delay / 1000}s`);

            retryTimeoutRef.current = setTimeout(() => {
                connectToSSE();
            }, delay);
        };

        eventSourceRef.current = eventSource;
    };

    const markAllAsRead = async (userId: string) => {
        try {
            await axiosInstance.patch(`${config.backendUrl}/messages/notifications/markallread/${userId}`)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (!userId) return;
        connectToSSE();

        return () => {
            eventSourceRef.current?.close();
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
        };
    }, [userId]);

    return { notifications, setNotifications, markAllAsRead };
};
