import React, { useState } from 'react'
import * as Yup from "yup"
import { NavBar } from '../../components/partials/NavBar'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import { UserSidebar } from '../../components/partials/UserSidebar'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import axiosInstance from '../../utils/axiosInstance'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import type { PasswordFormState, ProfileFromState } from '../../interfaces/entities/FormState'
import { updateProfile } from '../../store/actions/profile/updateProfile'
import type { PasswordErrorState } from '../../interfaces/entities/ErrorState'
import { validatePassword } from '../../interfaces/validators/passwordValidator'
import { Footer } from '../../components/partials/Footer'


const ProfilePage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [userData, setUserData] = useState<ProfileFromState>({
        firstName: user?.firstName,
        lastName: user?.lastName,
        phoneNumber: user?.phoneNumber
    });

    const [passwordData, setPasswordData] = useState<PasswordFormState>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [errors, setErrors] = useState<PasswordErrorState>({});
    const dispatch = useAppDispatch();

    const handleForm = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    };

    const handlePasswords = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        })
    };


    const updateProfileData = () => {
        dispatch(updateProfile({ ...userData, email: user?.email }))
    }

    const updatePassword = async () => {
        setErrors({});
        try {
            await validatePassword(passwordData);
            const response = await axiosInstance.patch("/auth/change-password", passwordData);
            if (response.data) {
                toast.success(response.data.message);
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data.message);
            }

            if (error instanceof Yup.ValidationError) {
                const errorMap: PasswordErrorState = {};
                error.inner.forEach(e => {
                    if (e.path) errorMap[e.path] = e.message;
                });
                setErrors(errorMap);
            }
        }
    }
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} />
            <div className="flex justify-center items-center min-h-screen p-4 mt-15">
                <div className="flex w-full gap-2 md:gap-5 overflow-hidden p-0 md:px-10 md:py-6">
                    <UserSidebar user={user} section='profile' />
                    <div className="flex-1 bg-white py-10 px-6 md:px-20 rounded-2xl shadow-lg border border-gray-200">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12">
                            <div className="flex items-center">
                                <Link to="/" className="text-blue-500 hover:text-blue-600 transition-colors text-sm md:text-md font-medium">
                                    Home
                                </Link>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-gray-700 text-sm md:text-md font-medium">Account Settings</span>
                            </div>

                            <Link
                                to="/account/request-organizer-form"
                                className="bg-blue-500 hover:bg-blue-600 transition-colors text-sm md:text-md text-white px-5 py-2.5 rounded-lg shadow-sm flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Apply for organizer
                            </Link>
                        </div>

                        <div className="mb-12 bg-gray-50 p-6 rounded-xl">
                            <h3 className="text-sm md:text-lg font-semibold mb-6 text-gray-800 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">First Name</label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={userData.firstName}
                                        onChange={handleForm}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Last Name</label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={userData.lastName}
                                        onChange={handleForm}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={user?.email}
                                            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                                            disabled
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        value={userData.phoneNumber}
                                        onChange={handleForm}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-5 py-2.5 rounded-lg shadow-sm flex items-center cursor-pointer"
                                onClick={() => updateProfileData()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Save Changes
                            </button>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl">
                            <h3 className="text-sm md:text-lg font-semibold mb-6 text-gray-800 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                Change Password
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Current Password</label>
                                    <input
                                        id="currentPassword"
                                        name="currentPassword"
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswords}
                                        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all ${user?.authProvider === "google" && 'bg-gray-100 cursor-not-allowed'}`}
                                        disabled={user?.authProvider === "google"}
                                        readOnly={user?.authProvider === "google"}
                                    />
                                    {errors.currentPassword && (
                                        <p className="text-red-500 text-sm mt-1 text-center">{errors.currentPassword}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswords}
                                        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all ${user?.authProvider === "google" && 'bg-gray-100 cursor-not-allowed'}`}
                                        disabled={user?.authProvider === "google"}
                                        readOnly={user?.authProvider === "google"}
                                    />
                                    {errors.newPassword && (
                                        <p className="text-red-500 text-sm mt-1 text-center">{errors.newPassword}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswords}
                                        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all ${user?.authProvider === "google" && 'bg-gray-100 cursor-not-allowed'}`}
                                        disabled={user?.authProvider === "google"}
                                        readOnly={user?.authProvider === "google"}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-sm mt-1 text-center">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <button
                                    className={`bg-blue-500 text-white px-5 py-2.5 rounded-lg shadow-sm flex items-center ${user?.authProvider === "google" ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 cursor-pointer transition-colors'}`}
                                    onClick={() => updatePassword()}
                                    disabled={user?.authProvider === "google"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ProfilePage;