import { Calendar, LogOut, User as UserIcon, UserLock, Menu, Home, MessageCircle, Bell, X } from "lucide-react"
import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logout } from '../../store/actions/auth/logout';
import type { AdminNavbarProps } from "../../interfaces/props/navBarProps";
import { useNotification } from "../../hooks/useNotification";

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ title, user, toggleSidebar }) => {
    const dispatch = useAppDispatch();
    const [showProfileOptions, setShowProfileOptions] = useState<boolean>(false);
    const { notifications } = useNotification(user?.id);
    const [showNotifications, setShowNotifications] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);


    const toggleProfileOptions = () => {
        setShowProfileOptions(!showProfileOptions);
        if (showNotifications) setShowNotifications(false);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (showProfileOptions) setShowProfileOptions(false);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="flex relative justify-between items-center z-50 mb-6 p-4 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 rounded-2xl shadow-sm">
            <div className="flex items-center">
                <button
                    className="p-3 mr-3 rounded-xl hover:bg-gray-100/80 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                    onClick={toggleSidebar}
                >
                    <Menu size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {title}
                    </h1>
                    <div className="hidden md:block text-sm text-gray-500 mt-1">
                        Welcome back, {user?.firstName}
                    </div>
                </div>
            </div>

            <div className="flex relative items-center gap-3">
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={toggleNotifications}
                        className="relative p-3 rounded-xl hover:bg-gray-100/80 transition-all duration-200 hover:scale-105 active:scale-95 group cursor-pointer"
                    >
                        <Bell size={20} className="text-gray-600 group-hover:text-gray-800" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-semibold animate-pulse">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute top-14 -right-4 w-96 max-h-[500px] bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-200/50 rounded-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                            <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                    <p className="text-sm text-gray-500">{unreadCount} unread</p>
                                </div>
                                <button
                                    onClick={toggleNotifications}
                                    className="p-2 hover:bg-gray-200/50 rounded-lg transition-colors"
                                >
                                    <X size={16} className="text-gray-500" />
                                </button>
                            </div>
                            
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <Bell size={32} className="mx-auto mb-3 text-gray-300" />
                                        <p>No notifications yet</p>
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-100">
                                        {notifications.map((n) => (
                                            <li key={n.id} className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-2 h-2 rounded-full mt-2 ${n.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <span className={`font-medium truncate ${n.read ? 'text-gray-600' : 'text-gray-900'}`}>
                                                                {n.title}
                                                            </span>
                                                            <span className="text-xs text-gray-400 ml-2">2h</span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative" ref={profileRef}>
                    <button
                        className="relative w-11 h-11 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 ring-2 ring-white/50 cursor-pointer"
                        onClick={toggleProfileOptions}
                    >
                        {user?.image ? (
                            <img src={user.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span className="text-sm">{user?.firstName[0]?.toUpperCase()}</span>
                        )}
                    </button>
                </div>
            </div>

            {showProfileOptions && (
                <div className="absolute right-0 top-16 w-72 z-20 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                    <div className="p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                        <div className="relative flex items-center space-x-4">
                            {user?.image ? (
                                <img src={user.image} alt="Profile" className="w-14 h-14 rounded-full border-3 border-white/30 shadow-lg" />
                            ) : (
                                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                                    {user?.firstName[0]?.toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg truncate">{user?.firstName} {user?.lastName}</h3>
                                <p className="text-sm text-blue-100 truncate">{user?.email || "user@nexevent.com"}</p>
                                <div className="flex gap-1 mt-2">
                                    {user?.roles?.map((role) => (
                                        <span key={role} className="text-xs bg-white/20 px-2 py-1 rounded-full capitalize">
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="py-2">
                        <Link
                            to="/"
                            className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                            onClick={() => setShowProfileOptions(false)}
                        >
                            <Home size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Home</span>
                        </Link>
                        
                        <Link
                            to="/account/profile"
                            className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                            onClick={() => setShowProfileOptions(false)}
                        >
                            <UserIcon size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Profile</span>
                        </Link>

                        <Link
                            to="/messages"
                            className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                            onClick={() => setShowProfileOptions(false)}
                        >
                            <MessageCircle size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Messages</span>
                        </Link>
                    </div>

                    {(user?.roles?.includes("organizer") || user?.roles?.includes("admin")) && (
                        <div className="border-t border-gray-100 py-2">
                            {user?.roles?.includes("organizer") && (
                                <Link
                                    to="/organizer/dashboard"
                                    className="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 group"
                                    onClick={() => setShowProfileOptions(false)}
                                >
                                    <Calendar size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">My Events</span>
                                    <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                                        Organizer
                                    </span>
                                </Link>
                            )}
                            {user?.roles?.includes("admin") && (
                                <Link
                                    to="/admin/dashboard"
                                    className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 group"
                                    onClick={() => setShowProfileOptions(false)}
                                >
                                    <UserLock size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Admin Dashboard</span>
                                    <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
                                        Admin
                                    </span>
                                </Link>
                            )}
                        </div>
                    )}


                    <div className="border-t border-gray-100 p-2">
                        <button
                            className="w-full px-6 py-3 hover:bg-red-50 text-red-600 flex items-center gap-3 transition-all duration-200 rounded-lg group"
                            onClick={() => {
                                dispatch(logout());
                                setShowProfileOptions(false);
                            }}
                        >
                            <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};