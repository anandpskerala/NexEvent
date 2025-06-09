import React, { useState } from 'react'
import { NavBar } from '../../components/partials/NavBar'
import { PasswordInput } from '../../components/partials/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from "yup"
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { Footer } from '../../components/partials/Footer'
import { googleAuth } from '../../store/actions/auth/googleAuth'
import type { RegisterFormState } from '../../interfaces/entities/FormState'
import type { RegisterErrorState } from '../../interfaces/entities/ErrorState'
import { validateSignup } from '../../interfaces/validators/signupValidator'
import { signupUser } from '../../store/actions/auth/signupUser'


const SignUp = () => {
    const [formdata, setFormdata] = useState<RegisterFormState>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        accepted: false
    });
    const [errors, setErrors] = useState<RegisterErrorState>({});
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.type == "checkbox") {
            setFormdata({ ...formdata, [e.target.name]: e.target.checked });
        } else {
            setFormdata({ ...formdata, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        setErrors({});
        try {
            e.preventDefault();
            await validateSignup(formdata);
            const req = await dispatch(signupUser({firstName: formdata.firstName, lastName: formdata.lastName, email: formdata.email, password: formdata.password}));
            if (req.meta.requestStatus === "fulfilled") {
                navigate("/otp-verification");
            }
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errorMap: RegisterErrorState = {};
                error.inner.forEach(e => {
                    if (e.path) errorMap[e.path] = e.message;
                });
                setErrors(errorMap);
            }
        }

    }
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <NavBar isLogged={false} />

            <div className="flex mt-25 w-full justify-center items-stretch px-2 py-2 min-h-[600px]">
                <div className="hidden md:flex flex-col w-lg p-12 rounded-bl-2xl rounded-tl-2xl shadow-2xl justify-between bg-linear-120 from-[#000428] to-[#004E92]">
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <h1 className="text-2xl text-white font-bold mb-4">
                                Join the NexEvent Community
                            </h1>
                            <p className="text-md text-white max-w-sm">
                                Discover and connect with amazing events tailored to your interests.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 mb-10">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/40 bg-opacity-50 rounded-full p-2 flex-shrink-0">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-100 max-w-[250px]">Discover events matching your interests</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="bg-white/40 bg-opacity-50 rounded-full p-2 flex-shrink-0">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-100 max-w-[250px]">Easy booking and secure payments</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="bg-white/40 bg-opacity-50 rounded-full p-2 flex-shrink-0">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-100 max-w-[250px]">Get personalized event recommendations</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/15 bg-opacity-30 rounded-2xl p-8 mt-10">
                        <p className="text-sm text-white italic mb-8">
                            " NexEvent completely changed how I discover local events. I've made amazing connections and memories thanks to their curated experiences. "
                        </p>
                        <div className="flex items-center">
                            <div className="bg-white/30 rounded-full p-3 mr-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-md text-white font-semibold">Sarah Johnson</h3>
                                <p className="text-xs text-blue-200">Event Enthusiast</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-lg min-h-[600px] items-center justify-center bg-white rounded-2xl md:rounded-tl-none md:rounded-bl-none shadow-2xl border-2 border-gray-200">
                    <div className="w-full p-8 flex items-center justify-center">
                        <div className="w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-2 text-center">Create Your Account</h2>
                            <p className="text-gray-600 mb-6 text-center">Join thousands of event lovers today</p>
                            <button 
                            className="w-full flex items-center justify-center py-2 px-4 mb-4 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                            onClick={() => dispatch(googleAuth())}
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </button>

                            <div className="flex items-center my-4">
                                <div className="flex-1 border-t border-gray-300"></div>
                                <p className="mx-4 text-sm text-gray-500">or signup with email</p>
                                <div className="flex-1 border-t border-gray-300"></div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="flex gap-2 md:gap-7">
                                    <div className="flex flex-col mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor='firstName'>First Name</label>
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your First Name"
                                            onChange={handleForm}
                                            aria-invalid={!!errors.firstName}
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor='lastName'>Last Name</label>
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your Last Name"
                                            onChange={handleForm}
                                            aria-invalid={!!errors["email"]}
                                            required
                                        />
                                    </div>
                                </div>
                                {(errors.firstName || errors.lastName) && (
                                    <div className="text-red-500 text-sm mt-1 text-center">
                                        {errors.firstName && <p>{errors.firstName}</p>}
                                        {errors.lastName && <p>{errors.lastName}</p>}
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor='email'>Email Address</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your email address"
                                        onChange={handleForm}
                                        aria-invalid={!!errors["email"]}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1 text-center">{errors.email}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <PasswordInput name="password" label="Password" errors={errors} handleForm={handleForm} />
                                </div>

                                <div className="mb-4">
                                    <PasswordInput name="confirmPassword" label="Confirm Password" errors={errors} handleForm={handleForm} />
                                </div>

                                <div className="flex items-center text-sm text-gray-500">
                                    <input id='accepted' name='accepted' type="checkbox" className="mr-2" onChange={handleForm} />
                                    <span>
                                        I agree to the{" "}
                                        <a href="#" className="text-blue-500 underline">
                                            Terms of Service
                                        </a>{" "}
                                        and{" "}
                                        <a href="#" className="text-blue-500 underline">
                                            Privacy Policy
                                        </a>
                                    </span>
                                </div>
                                {errors.accepted && (
                                    <p className="text-red-500 text-sm mt-1 text-center">{errors.accepted}</p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 mt-5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 cursor-pointer"
                                >
                                    Create Account
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link to="/login" className="text-blue-600 hover:underline">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default SignUp;