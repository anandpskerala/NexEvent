import { Calendar, Home, LogOut, MessageCircle, User as UserIcon, UserLock } from "lucide-react"
import React, { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import type { NavBarProps } from "../../interfaces/props/navBarProps"
import { logout } from "../../store/actions/auth/logout"
import { useAppDispatch } from "../../hooks/useAppDispatch"


export const NavBar: React.FC<NavBarProps> = ({ isLogged = false, name = "guest", user, section }) => {
    const [showProfileOptions, setShowProfileOptions] = useState<boolean>(false);

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
                <NavLink to="#" className={`${section === "category" ? 'text-blue-700 font-bold' : 'text-gray-600'} hover:text-gray-900`}>Categories</NavLink>
                <NavLink to="#" className={`${section === "about" ? 'text-blue-700 font-bold' : 'text-gray-600'} hover:text-gray-900`}>About</NavLink>
            </div>

            {isLogged ? (
                <div className="flex relative items-center gap-5">
                    <Link to="#" className="">
                        <svg width="37" height="38" viewBox="0 0 37 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M27.3584 22.6797C27.5928 22.9141 27.71 23.2266 27.71 23.5C27.6709 24.1641 27.2021 24.75 26.4209 24.75H11.46C10.6787 24.75 10.21 24.1641 10.21 23.5C10.1709 23.2266 10.2881 22.9141 10.5225 22.6797C11.2646 21.8594 12.71 20.6484 12.71 16.625C12.71 13.6172 14.8193 11.1953 17.71 10.5703V9.75C17.71 9.08594 18.2568 8.5 18.96 8.5C19.624 8.5 20.1709 9.08594 20.1709 9.75V10.5703C23.0615 11.1953 25.1709 13.6172 25.1709 16.625C25.1709 20.6484 26.6162 21.8594 27.3584 22.6797ZM12.8271 22.875H25.0537C24.2334 21.8203 23.335 19.9844 23.2959 16.6641C23.2959 16.6641 23.335 16.6641 23.335 16.625C23.335 14.2422 21.3428 12.25 18.96 12.25C16.5381 12.25 14.585 14.2422 14.585 16.625C14.585 16.6641 14.585 16.6641 14.585 16.6641C14.5459 19.9844 13.6475 21.8203 12.8271 22.875ZM18.96 28.5C17.5537 28.5 16.46 27.4062 16.46 26H21.4209C21.4209 27.4062 20.3271 28.5 18.96 28.5Z" fill="#4B5563" />
                        </svg>

                    </Link>
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