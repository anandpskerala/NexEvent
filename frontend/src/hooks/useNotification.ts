import { useEffect, useState } from 'react';
import type { Notification } from '../interfaces/entities/Notification';
import axiosInstance from '../utils/axiosInstance';
import config from '../config/config';
import { useGlobalSocket } from '../contexts/SocketContext';
import { fetchNotifications } from '../services/notificationService';

export const useNotification = (userId: string | undefined) => {
    const { socket } = useGlobalSocket();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const markAllAsRead = async () => {
        try {
            await axiosInstance.patch(
                `${config.backendUrl}/messages/notifications/markallread/${userId}`
            );
            setNotifications([]);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!userId) return;

        const fetchInitialNotifications = async () => {
            try {
                const response = await fetchNotifications(userId as string, 1, 10, false);
                setNotifications(response.notifications);
            } catch (err) {
                console.error("Failed to fetch initial notifications", err);
            }
        };

        fetchInitialNotifications();
    }, [userId]);

    useEffect(() => {
        if (!socket || !userId) return;

        const handleNotification = (data: Notification) => {
            setNotifications((prev) => [data, ...prev]);
        };

        socket.on('notification:new', handleNotification);

        return () => {
            socket.off('notification:new', handleNotification);
        };
    }, [socket, userId]);

    return { notifications, setNotifications, markAllAsRead };
};