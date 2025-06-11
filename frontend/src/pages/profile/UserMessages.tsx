import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { NavBar } from '../../components/partials/NavBar';
import { LazyLoadingScreen } from '../../components/partials/LazyLoadingScreen';
import { MessageComponent } from '../../components/messages/MessageComponent';
import type { User } from '../../interfaces/entities/user';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const UserMessages = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [searchParams] = useSearchParams();
    const chatId = searchParams.get("user");
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedChat, setSelectedChat] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async (id: string) => {
            setLoading(true)
            try {
                const res = await axiosInstance.get(`/user/${id}`);
                if (res.data) {
                    setSelectedChat(res.data.user);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (chatId) {
            fetchUser(chatId as string);
        }
    }, [chatId])
    if (loading) return <LazyLoadingScreen />
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} />
            <div className="flex justify-center items-center p-4 mt-5 md:mt-10">
                <div className="flex w-full gap-2 md:gap-5 overflow-hidden p-0 md:px-10 md:py-6">
                    <div className="flex-1 bg-white py-2 rounded-2xl shadow-lg border border-gray-200">
                        <MessageComponent user={user as User} selected={selectedChat}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserMessages