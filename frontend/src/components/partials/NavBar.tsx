import { Calendar, Home, LogOut, MapPin, MessageCircle, User as UserIcon, UserLock, Bell, X, Check, Menu, Sparkles } from "lucide-react"
import React, { useState, useEffect } from "react"
import { Link, NavLink } from "react-router-dom"
import type { NavBarProps } from "../../interfaces/props/navBarProps"
import { logout } from "../../store/actions/auth/logout"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useNotification } from "../../hooks/useNotification"
import type { Location } from "../../interfaces/props/locationModalProps"
import { LocationModal } from "../modals/LocationModal"
import { useUserLocation } from "../../hooks/useUserLocation"
import { CustomLogo } from "./CustomLogo"


export const NavBar: React.FC<NavBarProps> = ({ isLogged = false, name = "guest", user, section }) => {
    const [showProfileOptions, setShowProfileOptions] = useState<boolean>(false);
    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
    const [scrolled, setScrolled] = useState(false);
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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showProfileOptions || showNotifications || showMobileMenu) {
                const target = event.target as Element;
                if (!target.closest('.profile-menu') && !target.closest('.notification-menu') && !target.closest('.mobile-menu')) {
                    setShowProfileOptions(false);
                    setShowNotifications(false);
                    setShowMobileMenu(false);
                }
            }
        };

        const handleResize = () => {
            if (window.innerWidth >= 1024 && showMobileMenu) {
                setShowMobileMenu(false);
            }
            setShowProfileOptions(false);
            setShowNotifications(false);
        };

        document.addEventListener('click', handleClickOutside);
        window.addEventListener('resize', handleResize);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('resize', handleResize);
        };
    }, [showProfileOptions, showNotifications, showMobileMenu]);


    const unreadCount = notifications.filter(n => !n.read).length;
    const recentNotifications = notifications.slice(0, 5);

    const navLinks = [
        { to: "/", label: "Home", section: "home" },
        { to: "/events/browse", label: "Discover", section: "browse" },
        { to: "/messages", label: "Messages", section: "messages" },
        { to: "/about", label: "About", section: "about" }
    ];

    return (
        <>
            <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled 
                ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200' 
                : 'bg-white/90 backdrop-blur-md shadow-md'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
                            <div className="relative">
                                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                                    <CustomLogo className="w-11 h-11" />
                                </div>
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <span className="text-xl font-bold text-gray-900">
                                    NexEvent
                                </span>
                                <span className="text-xs text-gray-500 font-medium -mt-1">Premium Events</span>
                            </div>
                        </Link>

                        <div className="hidden lg:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) => `
                                        relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg
                                        ${isActive || section === link.section
                                            ? 'text-blue-600 bg-blue-50 shadow-sm border border-blue-200' 
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-3">
                            {isLogged ? (
                                <>
                                    <div className="hidden md:block">
                                        <button
                                            onClick={() => setIsLocationModalOpen(true)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 cursor-pointer"
                                        >
                                            <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                                            <span className="max-w-20 lg:max-w-28 truncate">
                                                {selectedLocation?.name || 'Select Location'}
                                            </span>
                                        </button>
                                    </div>

                                    <div className="relative notification-menu">
                                        <button
                                            onClick={modalOption}
                                            className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 cursor-pointer"
                                        >
                                            <Bell className="w-5 h-5" />
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                                    {unreadCount > 9 ? '9+' : unreadCount}
                                                </span>
                                            )}
                                        </button>

                                        {showNotifications && (
                                            <div className="absolute -right-25 mt-2 w-96 max-w-[calc(100vw-2rem)] sm:max-w-96 bg-white shadow-xl border border-gray-200 rounded-xl z-50 overflow-hidden">
                                                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                            <Bell className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                                                            {unreadCount > 0 && (
                                                                <span className="text-xs text-gray-500">
                                                                    {unreadCount} new
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {unreadCount > 0 && (
                                                            <button
                                                                onClick={handleMarkAllRead}
                                                                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded-md transition-all duration-200 cursor-pointer"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                                Mark all read
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => setShowNotifications(false)}
                                                            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-md transition-all duration-200 cursor-pointer"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="max-h-80 overflow-y-auto">
                                                    {recentNotifications.length > 0 ? (
                                                        <div className="divide-y divide-gray-100">
                                                            {recentNotifications.map((notification) => (
                                                                <div
                                                                    key={notification.id}
                                                                    className={`p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
                                                                        !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                                                    }`}
                                                                >
                                                                    <div className="flex items-start justify-between gap-3">
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <h4 className={`font-medium text-sm ${
                                                                                    !notification.read ? 'text-gray-900' : 'text-gray-700'
                                                                                }`}>
                                                                                    {notification.title}
                                                                                </h4>
                                                                                {!notification.read && (
                                                                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                                                )}
                                                                            </div>
                                                                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                                                                {notification.message}
                                                                            </p>
                                                                            <div className="flex items-center justify-between">
                                                                                <span className="text-xs text-gray-500">
                                                                                    {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'Today'}
                                                                                </span>
                                                                                {notification.type && (
                                                                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                                                                        notification.type === 'event' ? 'bg-green-100 text-green-700' :
                                                                                        notification.type === 'message' ? 'bg-blue-100 text-blue-700' :
                                                                                        'bg-gray-100 text-gray-700'
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
                                                            <div className="p-4 bg-gray-100 rounded-xl w-fit mx-auto mb-4">
                                                                <Bell className="w-8 h-8 text-gray-400" />
                                                            </div>
                                                            <p className="font-medium text-gray-700">No notifications yet</p>
                                                            <p className="text-sm">We'll notify you when something happens</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {notifications.length > 5 && (
                                                    <div className="border-t border-gray-100 bg-gray-50 p-3">
                                                        <Link
                                                            to="/notifications"
                                                            className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 py-2 rounded-lg transition-all duration-200"
                                                            onClick={() => setShowNotifications(false)}
                                                        >
                                                            View all notifications ({notifications.length})
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative profile-menu">
                                        {user?.image ? (
                                            <button
                                                onClick={toggleProfileOptions}
                                                className="relative group cursor-pointer"
                                            >
                                                <div className="p-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full group-hover:shadow-md transition-all duration-300">
                                                    <img
                                                        src={user.image}
                                                        alt="User Avatar"
                                                        className="w-9 h-9 rounded-full object-cover"
                                                    />
                                                </div>
                                            </button>
                                        ) : (
                                            <button
                                                className="relative w-9 h-9 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-semibold hover:shadow-md transition-all duration-300 cursor-pointer"
                                                onClick={toggleProfileOptions}
                                            >
                                                {name[0].toUpperCase()}
                                            </button>
                                        )}

                                        {showProfileOptions && (
                                            <div className="absolute -right-10 mt-2 w-80 max-w-[calc(100vw-2rem)] sm:max-w-80 bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
                                                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                                    <div className="flex items-center space-x-3">
                                                        {user?.image ? (
                                                            <div className="p-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                                                                <img src={user.image} alt="Profile" className="w-10 h-10 rounded-full" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                                                                {name[0].toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-white truncate">{user?.firstName || name}</h3>
                                                            <p className="text-sm text-blue-100 truncate">{user?.email || "user@nexevent.com"}</p>
                                                        </div>
                                                        <Sparkles className="w-4 h-4 text-yellow-500" />
                                                    </div>
                                                </div>

                                                <div className="py-2">
                                                    <Link
                                                        to="/"
                                                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 group"
                                                        onClick={() => setShowProfileOptions(false)}
                                                    >
                                                        <Home size={16} className="mr-3" />
                                                        <span className="font-medium">Home</span>
                                                    </Link>
                                                    <Link
                                                        to="/account/profile"
                                                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 group"
                                                        onClick={() => setShowProfileOptions(false)}
                                                    >
                                                        <UserIcon size={16} className="mr-3" />
                                                        <span className="font-medium">Profile</span>
                                                    </Link>
                                                    <Link
                                                        to="/messages"
                                                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 group"
                                                        onClick={() => setShowProfileOptions(false)}
                                                    >
                                                        <MessageCircle size={16} className="mr-3" />
                                                        <span className="font-medium">Messages</span>
                                                    </Link>
                                                    <Link
                                                        to="/notifications"
                                                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 group"
                                                        onClick={() => setShowProfileOptions(false)}
                                                    >
                                                        <Bell size={16} className="mr-3" />
                                                        <span className="font-medium">Notifications</span>
                                                        {unreadCount > 0 && (
                                                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
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
                                                                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 group"
                                                                onClick={() => setShowProfileOptions(false)}
                                                            >
                                                                <Calendar size={16} className="mr-3" />
                                                                <span className="font-medium">My Events</span>
                                                                <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                                    Organizer
                                                                </span>
                                                            </Link>
                                                        )}
                                                        {user?.roles?.includes("admin") && (
                                                            <Link
                                                                to="/admin/users"
                                                                className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 group"
                                                                onClick={() => setShowProfileOptions(false)}
                                                            >
                                                                <UserLock size={16} className="mr-3" />
                                                                <span className="font-medium">Admin Dashboard</span>
                                                                <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                                                    Admin
                                                                </span>
                                                            </Link>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="py-2 border-t border-gray-100 bg-gray-50">
                                                    <button
                                                        className="px-4 py-2.5 hover:bg-red-50 text-red-600 hover:text-red-700 flex items-center gap-3 transition-all duration-200 w-full"
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

                                    <button
                                        className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200 mobile-menu border border-gray-200 cursor-pointer"
                                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                                    >
                                        <Menu className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <Link 
                                        to="/login" 
                                        className="px-3 sm:px-4 py-2 text-gray-700 font-medium bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
                                    >
                                        Sign In
                                    </Link>
                                    <Link 
                                        to="/signup" 
                                        className="px-3 sm:px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md font-medium"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {showMobileMenu && isLogged && (
                    <div className="lg:hidden border-t border-gray-200 bg-white mobile-menu">
                        <div className="px-4 py-3 space-y-2">
                            <button
                                onClick={() => {
                                    setIsLocationModalOpen(true);
                                    setShowMobileMenu(false);
                                }}
                                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200"
                            >
                                <MapPin className="w-4 h-4 text-red-500" />
                                <span className="truncate">
                                    {selectedLocation?.name || 'Select Location'}
                                </span>
                            </button>

                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) => `
                                        block px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                                        ${isActive || section === link.section
                                            ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }
                                    `}
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onLocationSelect={handleLocationSelect}
                currentLocation={selectedLocation}
            />
        </>
    );
}