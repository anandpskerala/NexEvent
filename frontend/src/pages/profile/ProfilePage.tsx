import React, { useState } from 'react'
import * as Yup from "yup"
import { NavBar } from '../../components/partials/NavBar'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import { UserSidebar } from '../../components/partials/UserSidebar'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { toast } from 'sonner'
import type { PasswordFormState, ProfileFromState } from '../../interfaces/entities/FormState'
import { updateProfile } from '../../store/actions/profile/updateProfile'
import type { PasswordErrorState } from '../../interfaces/entities/ErrorState'
import { validatePassword } from '../../interfaces/validators/passwordValidator'
import { Footer } from '../../components/partials/Footer'
import { changePassword } from '../../services/profileService'
import { User, Key, Lock, Plus, ChevronRight, Mail, Phone, Edit3, Save } from 'lucide-react'


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
    const [isEditing, setIsEditing] = useState(false);
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
        dispatch(updateProfile({ ...userData, email: user?.email }));
        setIsEditing(false);
    }

    const updatePassword = async () => {
        setErrors({});
        try {
            await validatePassword(passwordData);
            const response = await changePassword(passwordData);
            if (response) {
                toast.success(response.message);
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            }
        } catch (error) {
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

            <div className="flex flex-1 pt-4 lg:pt-6 mt-15">
                <div className="flex w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 gap-2 md:gap-4">

                    {/* <div className="hidden md:block md:w-64 lg:w-72 xl:w-80 flex-shrink-0 mt-5"> */}
                        <UserSidebar user={user} section='profile' />
                    {/* </div> */}

                    <div className="flex-1 min-w-0">
                        <div className="bg-transparent border-b border-slate-200/60 sticky top-0 z-40 -mx-2 sm:-mx-4 lg:-mx-6 xl:-mx-8 px-2 sm:px-4 lg:px-6 xl:px-8 mb-4 lg:mb-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 sm:py-4 gap-3 sm:gap-4">
                                <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600 ml-3">
                                    <span className="hover:text-blue-600 transition-colors cursor-pointer">Home</span>
                                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="text-slate-900 font-medium">Account Settings</span>
                                </div>

                                <Link
                                    to={"/account/request-organizer-form"}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center space-x-2 text-sm sm:text-base w-full sm:w-auto">
                                    <Plus className="h-4 w-4" />
                                    <span className="whitespace-nowrap">Apply for organizer</span>
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-1 sm:px-2 lg:px-8 py-4 sm:py-6 border-b border-slate-200/60">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                                <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Personal Information</h2>
                                                <p className="text-xs sm:text-sm text-slate-600">Manage your personal details and contact information</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer w-full sm:w-auto"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                            <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 lg:p-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-700">First Name</label>
                                            <div className="relative">
                                                <input
                                                    name="firstName"
                                                    type="text"
                                                    value={userData.firstName}
                                                    onChange={handleForm}
                                                    disabled={!isEditing}
                                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all duration-200 ${isEditing
                                                        ? 'border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white'
                                                        : 'border-slate-200 bg-slate-50 text-slate-600'
                                                        } outline-none font-medium text-sm sm:text-base`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-700">Last Name</label>
                                            <div className="relative">
                                                <input
                                                    name="lastName"
                                                    type="text"
                                                    value={userData.lastName}
                                                    onChange={handleForm}
                                                    disabled={!isEditing}
                                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all duration-200 ${isEditing
                                                        ? 'border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white'
                                                        : 'border-slate-200 bg-slate-50 text-slate-600'
                                                        } outline-none font-medium text-sm sm:text-base`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                                                <input
                                                    type="email"
                                                    value={user?.email}
                                                    disabled
                                                    className="w-full pl-10 sm:pl-11 pr-10 sm:pr-11 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium outline-none text-sm sm:text-base"
                                                />
                                                <div className="absolute right-3 top-2.5 sm:top-3.5">
                                                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-700">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-2.5 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                                                <input
                                                    name="phoneNumber"
                                                    type="tel"
                                                    value={userData.phoneNumber}
                                                    onChange={handleForm}
                                                    disabled={!isEditing}
                                                    className={`w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl border transition-all duration-200 ${isEditing
                                                        ? 'border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white'
                                                        : 'border-slate-200 bg-slate-50 text-slate-600'
                                                        } outline-none font-medium text-sm sm:text-base`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                            <button
                                                onClick={updateProfileData}
                                                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center space-x-2 cursor-pointer"
                                            >
                                                <Save className="h-4 w-4" />
                                                <span>Save Changes</span>
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 font-medium transition-colors cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-slate-200/60">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                                            <Key className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Security Settings</h2>
                                            <p className="text-xs sm:text-sm text-slate-600">Update your password and security preferences</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 lg:p-8">
                                    {user?.authProvider === "google" && (
                                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                                    <Lock className="h-4 w-4 text-amber-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-amber-800">Google Account</p>
                                                    <p className="text-xs text-amber-600">Password changes are managed through your Google account</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-700">Current Password</label>
                                            <input
                                                name="currentPassword"
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswords}
                                                disabled={user?.authProvider === "google"}
                                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all duration-200 outline-none font-medium text-sm sm:text-base ${user?.authProvider === "google"
                                                    ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                                                    : 'border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                                    }`}
                                                placeholder="Enter your current password"
                                            />
                                            {errors.currentPassword && (
                                                <p className="text-red-500 text-sm">{errors.currentPassword}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-700">New Password</label>
                                            <input
                                                name="newPassword"
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswords}
                                                disabled={user?.authProvider === "google"}
                                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all duration-200 outline-none font-medium text-sm sm:text-base ${user?.authProvider === "google"
                                                    ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                                                    : 'border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                                    }`}
                                                placeholder="Enter your new password"
                                            />
                                            {errors.newPassword && (
                                                <p className="text-red-500 text-sm">{errors.newPassword}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-700">Confirm New Password</label>
                                            <input
                                                name="confirmPassword"
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswords}
                                                disabled={user?.authProvider === "google"}
                                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all duration-200 outline-none font-medium text-sm sm:text-base ${user?.authProvider === "google"
                                                    ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                                                    : 'border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                                    }`}
                                                placeholder="Confirm your new password"
                                            />
                                            {errors.confirmPassword && (
                                                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                                            )}
                                        </div>

                                        <button
                                            onClick={updatePassword}
                                            disabled={user?.authProvider === "google"}
                                            className={`flex items-center justify-center w-full sm:w-auto space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${user?.authProvider === "google"
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 cursor-pointer'
                                                }`}
                                        >
                                            <Key className="h-4 w-4" />
                                            <span>Update Password</span>
                                        </button>
                                    </div>
                                </div>
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