import React, { useState } from 'react'
import { LogOut, MessageSquare, Wallet, Heart, Ticket, Settings, Camera } from 'lucide-react'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { logout } from '../../store/actions/auth/logout'
import type { User } from '../../interfaces/entities/user'
import { Link } from 'react-router-dom'
import { ImageUploadModal } from '../modals/ImageUploadModal'
import { uploadToCloudinary } from '../../utils/cloudinary'
import { updateProfileImage } from '../../store/actions/profile/updateImage'


export const UserSidebar: React.FC<{ user?: User | null | undefined, section: string }> = ({ user, section }) => {
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUpload = async (file: File) => {
        const image = await uploadToCloudinary(file)
        if (image) {
            dispatch(updateProfileImage({image}));
        }
    };

    return (
        <div className="w-20 md:w-64 bg-white p-2 md:p-6 flex flex-col items-center shadow-xl rounded-2xl border-1 border-gray-200">
            <div className="mt-10 md:mt-0 relative group w-10 h-10 md:w-24 md:h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm md:text-3xl font-bold mb-3">
                {user?.image ? (
                    <img src={user.image} alt="Profile pic" className="w-full h-full rounded-full" />
                ): (
                    <span>{user?.firstName[0].toUpperCase()}</span>
                )}
                {section === "profile" && (
                    <button
                        className="hidden inset-0 group-hover:flex absolute w-full h-full bg-black/50 rounded-full cursor-pointer justify-center items-center"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Camera className="" />
                    </button>
                )}
            </div>

            <h2 className="text-sm md:text-xl font-bold mb-6 hidden md:flex">{user?.firstName + " " + user?.lastName}</h2>

            <div className="flex flex-col w-full space-y-2 gap-1 justify-center items-center mt-10 md:mt-0">
                <Link to="/account/profile" className={`w-1/2 md:w-full ${section == "profile" ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'} py-2 px-2 md:px-4 rounded flex items-center justify-center md:justify-start`}>
                    <Settings size={18} className="mr-0 md:mr-2" />
                    <span className="hidden md:flex">Account Settings</span>
                </Link>

                <Link to="/account/tickets" className={`w-1/2 md:w-full ${section == "tickets" ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'} py-2 px-2 md:px-4 rounded flex items-center justify-center md:justify-start`}>
                    <Ticket size={18} className="mr-0 md:mr-2" />
                    <span className="hidden md:flex">My Tickets</span>
                </Link>

                <Link to="/account/saved-events" className={`w-1/2 md:w-full ${section == "saved" ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'} py-2 px-2 md:px-4 rounded flex items-center justify-center md:justify-start`}>
                    <Heart size={18} className="mr-0 md:mr-2" />
                    <span className="hidden md:flex">Saved Events</span>
                </Link>

                <Link to="/messages" className={`w-1/2 md:w-full ${section == "messages" ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'} py-2 px-2 md:px-4 rounded flex items-center justify-center md:justify-start`}>
                    <MessageSquare size={18} className="mr-0 md:mr-2" />
                    <span className="hidden md:flex">Messages</span>
                </Link>

                <Link to="/account/wallet" className={`w-1/2 md:w-full ${section == "wallet" ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'} py-2 px-2 md:px-4 rounded flex items-center justify-center md:justify-start`}>
                    <Wallet size={18} className="mr-0 md:mr-2" />
                    <span className="hidden md:flex">Wallet</span>
                </Link>

                <button
                    className="w-1/2 md:w-full bg-red-500 text-white py-2 px-2 md:px-4 rounded-md flex items-center justify-center md:justify-start mt-10 cursor-pointer"
                    onClick={() => dispatch(logout())}
                >
                    <LogOut size={18} className="mr-0 md:mr-2" />
                    <span className="hidden md:flex">Logout</span>
                </button>
            </div>
            <ImageUploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpload={handleUpload}
                maxSizeMB={10}
                allowedTypes={['image/jpeg', 'image/png']}
                aspectRatio={1}
            />
        </div>
    )
}