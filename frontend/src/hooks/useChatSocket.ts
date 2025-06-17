import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Message } from '../interfaces/entities/Message';
import config from '../config/config';

export const useChatSocket = (
    userId: string,
    onNewMessage: (msg: Message) => void
) => {
    const socketRef = useRef<Socket | null>(null);
    const handlerRef = useRef(onNewMessage);

    useEffect(() => {
        handlerRef.current = onNewMessage;
    }, [onNewMessage]);

    useEffect(() => {
        if (socketRef.current) return;
        
        const socket = io(config.socket, {
            withCredentials: true,
            query: { userId },
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            socket.emit('join', userId);
        });

        socket.on('new-message', (message: Message) => {
            handlerRef.current(message);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [userId]);
};
