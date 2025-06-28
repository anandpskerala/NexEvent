import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { NavBar } from '../../components/partials/NavBar';
import type { Notification } from '../../interfaces/entities/Notification';
import { AlertCircle, Bell, Check, CheckCheck, Heart, Info, MessageCircle, UserPlus, X } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { formatTimeAgo } from '../../utils/stringUtils';
import Pagination from '../../components/partials/Pagination';

const NotificationsPage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />;
            case 'message':
                return <MessageCircle className="w-5 h-5 text-green-500" />;
            case 'success':
                return <Check className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'like':
                return <Heart className="w-5 h-5 text-red-500" />;
            case 'follow':
                return <UserPlus className="w-5 h-5 text-purple-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };


    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await axiosInstance.get(`/messages/notifications/all/${user?.id}?page=${page}&limit=10`)
                if (res.data) {
                    setNotifications(res.data.notifications);
                    setPage(res.data.page);
                    setPages(res.data.pages);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchRequest();
    }, [filter, page, user?.id]);


    return (
        <div className="flex flex-col min-h-screen bg-white">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} section="home" />

            <div className="w-full mt-17 px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex bg-white rounded-lg border shadow-sm">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${filter === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                All ({notifications.length})
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${filter === 'unread'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Unread ({unreadCount})
                            </button>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <CheckCheck className="w-4 h-4" />
                            Mark all as read
                        </button>
                    )}
                </div>

                <div className="space-y-2">
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-12">
                            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                            </h3>
                            <p className="text-gray-500">
                                {filter === 'unread'
                                    ? 'You\'re all caught up! Check back later for new updates.'
                                    : 'You don\'t have any notifications yet.'}
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow ${!notification.read ? 'border-l-4 border-l-blue-500' : ''
                                    }`}
                            >
                                <div className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'
                                                        }`}>
                                                        {notification.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs text-gray-500">
                                                            {notification.createdAt ? formatTimeAgo(String(notification.createdAt)) : 'Just now'}
                                                        </span>
                                                        {!notification.read && (
                                                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 ml-4">
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id!)}
                                                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id!)}
                                                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete notification"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex justify-center mt-6">
                    <Pagination
                        currentPage={page}
                        totalPages={pages}
                        onPageChange={setPage}
                    />
                </div>
            </div>
        </div>
    )
}

export default NotificationsPage