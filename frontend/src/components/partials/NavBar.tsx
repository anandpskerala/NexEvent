import { Calendar, Home, LogOut, MessageCircle, User as UserIcon, UserLock } from "lucide-react"
import React, { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import type { NavBarProps } from "../../interfaces/props/navBarProps"
import { logout } from "../../store/actions/auth/logout"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useNotification } from "../../hooks/useNotification"
import { NotificationBell } from "../messages/NotificationBell"


export const NavBar: React.FC<NavBarProps> = ({ isLogged = false, name = "guest", user, section }) => {
    const [showProfileOptions, setShowProfileOptions] = useState<boolean>(false);
    const { notifications } = useNotification(user?.id);
    const [showNotifications, setShowNotifications] = useState(false);

    const toggleProfileOptions = () => {
        setShowProfileOptions(!showProfileOptions);
    };

    const dispatch = useAppDispatch();


    return (
        <nav className="flex items-center justify-between px-6 py-5 shadow-md fixed w-full bg-white z-30">
            <Link to="/" className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-md">
                    <span className="text-lg font-bold text-white">N</span>
                </div>
                <span className="text-lg text-blue-500 font-bold">NexEvent</span>
            </Link>

            <div className="hidden md:flex space-x-6">
                <NavLink to="/" className={`${section === "home" ? 'text-blue-700 font-bold' : 'text-gray-600'} hover:text-gray-900`}>Home</NavLink>
                <NavLink to="/events/browse" className={`${section === "browse" ? 'text-blue-700 font-bold' : 'text-gray-600'} hover:text-gray-900`}>Browse</NavLink>
                <NavLink to="/messages" className={`${section === "messages" ? 'text-blue-700 font-bold' : 'text-gray-600'} hover:text-gray-900`}>Messages</NavLink>
                <NavLink to="/about" className={`${section === "about" ? 'text-blue-700 font-bold' : 'text-gray-600'} hover:text-gray-900`}>About</NavLink>
            </div>

            {isLogged ? (
                <div className="flex relative items-center gap-5">
                    <div className="relative">
                        <NotificationBell
                            count={notifications.length}
                            onClick={() => setShowNotifications(!showNotifications)}
                        />
                        {showNotifications && notifications.length > 0 && (
                            <div className="absolute top-12 -right-15 w-80 max-h-96 overflow-y-auto bg-white shadow-lg border rounded-xl z-50">
                                <div className="p-3 border-b font-semibold">Notifications</div>
                                <ul className="divide-y">
                                    {notifications.map((n) => (
                                        <li key={n.id} className="p-3 hover:bg-gray-50">
                                            <div className="font-medium">{n.title}</div>
                                            <div className="text-sm text-gray-500">{n.message}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {user?.image ? (
                        <img
                            src={user.image}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full object-cover cursor-pointer"
                            onClick={toggleProfileOptions}
                        />
                    ) : (
                        <button
                            className="w-10 h-10 text-white border border-blue-600 bg-blue-600 rounded-full cursor-pointer flex items-center justify-center"
                            onClick={toggleProfileOptions}
                        >
                            {name[0].toUpperCase()}
                        </button>
                    )}

                    {showProfileOptions && (
                        <div className="absolute right-0 top-14 w-64 z-20 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform animate-in slide-in-from-top-2 duration-200">
                            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                <div className="flex items-center space-x-3">
                                    {user?.image ? (
                                        <img src={user.image} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white/30" />
                                    ) : (
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-semibold">
                                            {name[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold">{user?.firstName || name}</h3>
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
            ) :
                (
                    <div className="flex items-center space-x-3">
                        <Link to="/login" className="px-2 md:px-4 py-1 md:py-1.5 text-gray-700 font-medium bg-white border border-gray-400 rounded-lg hover:bg-black hover:text-white">
                            Log In
                        </Link>
                        <Link to="/signup" className="px-2 md:px-4 py-1 md:py-1.5 text-white border border-blue-600 bg-blue-600 rounded-lg hover:bg-white hover:text-blue-600">
                            Sign Up
                        </Link>
                    </div>
                )}
        </nav>
    )
}