import {
    ControlBar,
    GridLayout,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';

export const VideoConference = () => {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false }
    );

    return (
        <div data-lk-theme="default" style={{ height: '100vh' }} className='bg-gray-600'>
            <GridLayout
                tracks={tracks}
                style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}
            >
                <ParticipantTile />
            </GridLayout>
            <RoomAudioRenderer />
            <ControlBar />
        </div>
    );
};
