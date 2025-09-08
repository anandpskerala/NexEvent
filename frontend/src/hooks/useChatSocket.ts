import { useEffect, useRef } from 'react';
import type { Message } from '../interfaces/entities/Message';
import { useGlobalSocket } from '../contexts/SocketContext';

export const useChatSocket = (
    onNewMessage: (msg: Message) => void
) => {
    const { socket } = useGlobalSocket();
    const handlerRef = useRef(onNewMessage);

    useEffect(() => {
        handlerRef.current = onNewMessage;
    }, [onNewMessage]);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (msg: Message) => {
            handlerRef.current(msg);
        };

        socket.on('new-message', handleMessage);

        return () => {
            socket.off('new-message', handleMessage);
        };
    }, [socket]);
};