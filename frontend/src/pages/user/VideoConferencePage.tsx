import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { RootState } from '../../store';
import { RoomProviderWrapper } from '../../components/videoConference/RoomProviderWrapper';
import { VideoConference } from '../../components/videoConference/VideoConference';
import axiosInstance from '../../utils/axiosInstance';
import { AxiosError } from 'axios';
import { LazyLoadingScreen } from '../../components/partials/LazyLoadingScreen';
import { toast } from 'sonner';
import { NavBar } from '../../components/partials/NavBar';

const VideoConferencePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    const [verified, setVerified] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyBooking = async () => {
            try {
                const res = await axiosInstance.get(`/event/verify/booking/${id}`);
                if (res.data?.verified) {
                    setVerified(true);
                } else {
                    setVerified(false);
                    setError("You are not authorized to access this event.");
                    toast.error("Access denied: You haven't booked this event.");
                    navigate('/events');
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    const message = error.response?.data?.message || "An error occurred while verifying your booking.";
                    setError(message);
                    toast.error(message);
                }
                setVerified(false);
            }
        };

        if (id) verifyBooking();
    }, [id, navigate]);

    if (verified === null) return <LazyLoadingScreen />;

    if (verified && user)
        return (
            <RoomProviderWrapper id={id as string} identity={`${user.firstName} ${user.lastName}`} roomName={id as string}>
                <VideoConference />
            </RoomProviderWrapper>
        );

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} section="home" />
            <div className="flex items-center justify-center mt-10 min-h-[100vh] px-4 w-full">
                <div className="flex flex-col w-full items-center justify-center bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8 text-center border border-red-200 dark:border-red-800 min-h-[80vh]">
                    <div className="flex justify-center mb-4">
                        <svg
                            className="w-12 h-12 text-red-500 animate-pulse"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Access Denied</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {error || "You do not have permission to join this meeting."}
                    </p>
                    <Link
                        to="/account/tickets"
                        className="inline-block mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                    >
                        Return to Events
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default VideoConferencePage;
