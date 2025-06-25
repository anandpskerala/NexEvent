import { Calendar, LogOut, User as UserIcon, UserLock, Menu, Home, MessageCircle } from "lucide-react"
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logout } from '../../store/actions/auth/logout';
import type { AdminNavbarProps } from "../../interfaces/props/navBarProps";
import { NotificationBell } from "../messages/NotificationBell";
import { useNotification } from "../../hooks/useNotification";



export const AdminNavbar: React.FC<AdminNavbarProps> = ({ title, user, toggleSidebar }) => {
    const dispatch = useAppDispatch();
    const [showProfileOptions, setShowProfileOptions] = useState<boolean>(false);
    const { notifications } = useNotification(user?.id);
    const [showNotifications, setShowNotifications] = useState(false);

    const toggleProfileOptions = () => {
        setShowProfileOptions(!showProfileOptions);
    };

    const modalOption = async () => {
        if (!showNotifications) {
            setShowNotifications(true);
        } else {
            setShowNotifications(false);
        }
    };
    return (
        <div className="flex relative justify-between items-center mb-6">
            <div className="flex items-center">
                <button
                    className="p-2 mr-2 rounded hover:bg-gray-200 cursor-pointer"
                    onClick={toggleSidebar}
                >
                    <Menu size={20} />
                </button>
                <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>
            </div>

            <div className="flex relative items-center gap-5">
                <div className="relative">
                    <NotificationBell
                        count={notifications.length}
                        onClick={modalOption}
                    />
                    {showNotifications && notifications.length > 0 && (
                        <div className="absolute top-12 -right-15 w-80 max-h-96 overflow-y-auto bg-white shadow-lg border rounded-xl z-50">
                            <div
                                className="absolute flex w-full inset-0 bg-opacity-50 transition-opacity"
                                onClick={() => modalOption()}
                            />
                            <div className="p-3 border-b font-semibold">Notifications</div>
                            <ul className="divide-y">
                                {notifications.map((n) => (
                                    <li key={n.id} className="p-3 hover:bg-gray-50">
                                            <div className="flex items-center justify-between w-full">
                                                <span className={`font-medium ${n.read ? 'text-gray-500' : 'text-black'}`}>{n.title}</span>
                                                <span className={`p-1.5 rounded-4xl text-xs ${n.read ?'' :'bg-amber-300'}`}></span>
                                            </div>
                                            <div className="text-sm text-gray-500">{n.message}</div>
                                        </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <button
                    className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white cursor-pointer"
                    onClick={() => toggleProfileOptions()}
                >
                    {user?.firstName[0].toUpperCase()}
                </button>
            </div>

            {showProfileOptions && (
                <div className="absolute right-0 top-14 w-64 z-20 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <div className="flex items-center space-x-3">
                            {user?.image ? (
                                <img src={user.image} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white/30" />
                            ) : (
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-semibold">
                                    {user?.firstName[0].toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold">{user?.firstName}</h3>
                                <p className="text-sm text-blue-100 truncate">{user?.email || "user@nexevent.com"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="py-2">
                        <Link
                            to="/"
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 group"
                            onClick={() => setShowProfileOptions(false)}
                        >
                            <Home size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Home</span>
                        </Link>
                        <Link
                            to="/account/profile"
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 group"
                            onClick={() => setShowProfileOptions(false)}
                        >
                            <UserIcon size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Profile</span>
                        </Link>

                        <Link
                            to="/messages"
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 group"
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
                                    to="/organizer/events"
                                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-150 group"
                                    onClick={() => setShowProfileOptions(false)}
                                >
                                    <Calendar size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">My Events</span>
                                    <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Organizer</span>
                                </Link>
                            )}
                            {user?.roles?.includes("admin") && (
                                <Link
                                    to="/admin/users"
                                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150 group"
                                    onClick={() => setShowProfileOptions(false)}
                                >
                                    <UserLock size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Admin Dashboard</span>
                                    <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">Admin</span>
                                </Link>
                            )}
                        </div>
                    )}
                    <div className="py-1 border-t border-gray-100 bg-gray-50">
                        <button
                            className="px-4 py-2.5 hover:bg-red-100 text-red-600 flex items-center gap-2 transition-colors duration-150 w-full cursor-pointer"
                            onClick={() => {
                                dispatch(logout());
                                toggleProfileOptions();
                            }}
                        >
                            <LogOut size={16} />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}