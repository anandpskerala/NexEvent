import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { NavBar } from '../../components/partials/NavBar';
import { LazyLoadingScreen } from '../../components/partials/LazyLoadingScreen';
import { MessageComponent } from '../../components/messages/MessageComponent';
import type { User } from '../../interfaces/entities/User';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const UserMessages = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [searchParams] = useSearchParams();
    const chatId = useMemo(() => searchParams.get("user"), [searchParams]);

    const [loading, setLoading] = useState(false);
    const [selectedChat, setSelectedChat] = useState<User | null>(null);

    useEffect(() => {
        if (!chatId || chatId === user?.id) {
            setSelectedChat(null);
            return;
        }

        let isMounted = true;

        const fetchUser = async () => {
            setLoading(true);
            try {
                const { data } = await axiosInstance.get(`/user/${chatId}`);
                if (isMounted && data?.user) {
                    setSelectedChat(data.user);
                }
            } catch (err) {
                console.error("Failed to fetch chat user", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchUser();

        return () => {
            isMounted = false;
        };
    }, [chatId, user?.id]);

    if (loading) return <LazyLoadingScreen />
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} section='messages' />
            <div className="flex justify-center items-center p-4 mt-15 md:mt-10">
                <div className="flex w-full gap-2 md:gap-5 overflow-hidden p-0 md:px-10 md:py-6">
                    <div className="flex-1 bg-white py-2 rounded-2xl shadow-lg border border-gray-200">
                        <MessageComponent user={user as User} selected={selectedChat} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserMessages