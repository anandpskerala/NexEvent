import React, { useState } from 'react'
import { NavBar } from '../../components/partials/NavBar'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import { Footer } from '../../components/partials/Footer'
import { Link } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { toast } from 'sonner'
import { AxiosError } from 'axios'


const ForgotPassword = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState<string>("");

    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const res = await axiosInstance.post("/user/auth/forgot-password", {email})
            if (res.data) {
                toast.success(res.data.message);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Something went wrong")
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} />
            <div className="flex-1 flex items-center justify-center p-0 md:p-4 mt-25">
                <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-full md:max-w-lg border-1 border-gray-300">
                    <h1 className="text-2xl font-bold text-center mb-4">Forgot Password</h1>

                    <p className="text-center text-gray-600 mb-6 px-6">
                        Enter your email address and we'll send you a link to reset your password
                    </p>

                    <form onSubmit={handleForm}>
                        <div className="mt-12">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor='email'>Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email address"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-5 cursor-pointer"
                        >
                            Send Reset Email
                        </button>
                    </form>

                    <Link to="/login" className="flex w-full text-blue-600 font-medium text-center justify-center mt-5">Back to login</Link>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ForgotPassword;