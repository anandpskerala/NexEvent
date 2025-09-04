import { io, Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';
import config from '../config/config';

let socket: Socket | null = null;

export const useSocket = (userId: string) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!userId || socket) return;

        socket = io(config.socket, {
            withCredentials: true,
            query: { userId },
        });

        socket.emit('join', userId);

        socketRef.current = socket;

        return () => {
            socket?.disconnect();
            socket = null;
        };
    }, [userId]);

    return socket;
};