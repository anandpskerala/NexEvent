import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import config from '../config/config';

type SocketContextType = {
    socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider: React.FC<{ userId: string; children: React.ReactNode }> = ({ userId, children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!userId) return;

        const socketInstance = io(config.socket, {
            withCredentials: true,
            query: { userId },
        });

        socketInstance.emit('join', userId);

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [userId]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useGlobalSocket = () => useContext(SocketContext);