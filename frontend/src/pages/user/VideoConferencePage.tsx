import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import type { RootState } from '../../store';
import { RoomProviderWrapper } from '../../components/videoConference/RoomProviderWrapper';
import { VideoConference } from '../../components/videoConference/VideoConference';

const VideoConferencePage = () => {
    const { id } = useParams();
    const { user } = useSelector((state: RootState) => state.auth);
    return (
        <RoomProviderWrapper identity={`${user?.firstName} ${user?.lastName}`} roomName={id as string}>
            <VideoConference />
        </RoomProviderWrapper>
    )
}

export default VideoConferencePage