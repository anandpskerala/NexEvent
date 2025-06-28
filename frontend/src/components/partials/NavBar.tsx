import { Calendar, Home, LogOut, MapPin, MessageCircle, User as UserIcon, UserLock, Bell, X, Check } from "lucide-react"
import React, { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import type { NavBarProps } from "../../interfaces/props/navBarProps"
import { logout } from "../../store/actions/auth/logout"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useNotification } from "../../hooks/useNotification"
import type { Location } from "../../interfaces/props/locationModalProps"
import { LocationModal } from "../modals/LocationModal"
import { useUserLocation } from "../../hooks/useUserLocation"

export const NavBar: React.FC<NavBarProps> = ({ isLogged = false, name = "guest", user, section }) => {
    const [showProfileOptions, setShowProfileOptions] = useState<boolean>(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
    const { setLocation } = useUserLocation();
    const { notifications, markAllAsRead } = useNotification(user?.id);
    const [showNotifications, setShowNotifications] = useState(false);

    const toggleProfileOptions = () => {
        setShowProfileOptions(!showProfileOptions);
    };

    const dispatch = useAppDispatch();

    const modalOption = async () => {
        setShowNotifications(!showNotifications);
    };

    const handleLocationSelect = (location: Location) => {
        setSelectedLocation(location);
        setLocation(location);
    };


    const handleMarkAllRead = () => {
        markAllAsRead(user?.id as string);
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const recentNotifications = notifications.slice(0, 5);

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
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsLocationModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
                        >
                            <MapPin className="w-4 h-4" />
                            <span>{selectedLocation?.name || 'Select Location'}</span>
                        </button>
                    </div>

                    <div className="relative">
                        <button
                            onClick={modalOption}
                            className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                            <Bell className="w-6 h-6" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium cursor-pointer">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute top-12 -right-4 w-96 max-h-[32rem] bg-white shadow-xl border rounded-2xl z-50 overflow-hidden">
                                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-gray-600" />
                                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={handleMarkAllRead}
                                                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
                                            >
                                                <Check className="w-3 h-3" />
                                                Mark all read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setShowNotifications(false)}
                                            className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="max-h-80 overflow-y-auto">
                                    {recentNotifications.length > 0 ? (
                                        <div className="divide-y">
                                            {recentNotifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className={`font-medium text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-600'
                                                                    }`}>
                                                                    {notification.title}
                                                                </h4>
                                                                {!notification.read && (
                                                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                                                                {notification.message}
                                                            </p>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs text-gray-400">
                                                                    {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'Today'}
                                                                </span>
                                                                {notification.type && (
                                                                    <span className={`text-xs px-2 py-1 rounded-full ${notification.type === 'event' ? 'bg-green-100 text-green-600' :
                                                                            notification.type === 'message' ? 'bg-blue-100 text-blue-600' :
                                                                                'bg-gray-100 text-gray-600'
                                                                        }`}>
                                                                        {notification.type}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-gray-500">
                                            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p className="font-medium">No notifications yet</p>
                                            <p className="text-sm">We'll notify you when something happens</p>
                                        </div>
                                    )}
                                </div>

                                {notifications.length > 5 && (
                                    <div className="border-t bg-gray-50 p-3">
                                        <Link
                                            to="/notifications"
                                            className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                                            onClick={() => setShowNotifications(false)}
                                        >
                                            View all notifications ({notifications.length})
                                        </Link>
                                    </div>
                                )}
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

                                <Link
                                    to="/notifications"
                                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 group"
                                    onClick={() => setShowProfileOptions(false)}
                                >
                                    <Bell size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
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
            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onLocationSelect={handleLocationSelect}
                currentLocation={selectedLocation}
            />
        </nav>
    )
}