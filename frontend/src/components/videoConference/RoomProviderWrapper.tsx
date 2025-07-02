import { RoomContext } from '@livekit/components-react';
import { Room, RoomEvent } from 'livekit-client';
import { useEffect, useState } from 'react';
import type { RoomProviderWrapperProps } from '../../interfaces/props/RoomProviderProps';
import { fetchToken } from '../../utils/liveKitToken';
import config from '../../config/config';
import { useNavigate } from 'react-router-dom';


export const RoomProviderWrapper = ({ id, identity, roomName, children }: RoomProviderWrapperProps) => {
    const [room] = useState(() => new Room({ adaptiveStream: true, dynacast: true }));
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;

        const connect = async () => {
            const token = await fetchToken(identity, roomName);
            if (mounted) await room.connect(config.liveKit.url, token);
        };

        connect();

        room.on(RoomEvent.Disconnected, () => {
            navigate(`/landing/${id}`);
        });
        return () => {
            mounted = false;
            room.disconnect();
        };
    }, [identity, roomName]);

    return <RoomContext.Provider value={room}>{children}</RoomContext.Provider>;
};
