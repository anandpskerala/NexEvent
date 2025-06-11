import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '../../utils/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { toast } from 'sonner'
import { AxiosError } from 'axios';
import type { RootState } from '../../store';
import { NavBar } from '../../components/partials/NavBar'
import { Footer } from '../../components/partials/Footer'
import { verifyOtp } from '../../store/actions/auth/verifyOtp'

const OtpPage = () => {
    const [code, setCode] = useState(Array(6).fill(''));
    const [timeLeft, setTimeLeft] = useState<number>(10);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getTimer = async () => {
            try {
                const response = await axiosInstance.get("/user/otp");
                console.log(response.data)
                const backendTimeLeft = response.data?.timeLeft ?? 0;
                setTimeLeft(backendTimeLeft);
            } catch (error) {
                console.log(error);
                setTimeLeft(0);
            }
        };

        getTimer();
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) clearInterval(timer);
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${paddedMinutes}:${paddedSeconds}`;
    };

    const handleChange = (index: number, value: string) => {
        if (value && !/^\d+$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);

        if (!pastedData) return;

        const newCode = [...code];
        for (let i = 0; i < pastedData.length; i++) {
            if (i < 6) newCode[i] = pastedData[i];
        }

        setCode(newCode);

        if (pastedData.length < 6) {
            inputRefs.current[pastedData.length]?.focus();
        }
    };

    const verify = async () => {
        const res = await dispatch(verifyOtp({otp: code.join("")}));
        if (res.meta.requestStatus === "fulfilled") {
            navigate("/")
        }
    };

    const resendCode = async () => {
        try {
            const response = await axiosInstance.patch("/auth/otp");
            if (response.data) {
                toast.success(response.data.message);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
        setTimeLeft(120);
        setCode(['', '', '', '', '', '']);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <NavBar isLogged={user?.isVerified} name={`${user?.firstName}`} />
            <div className="flex-1 flex items-center justify-center p-0 md:p-4 mt-25">
                <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-full md:max-w-lg border-1 border-gray-300">
                    <h1 className="text-2xl font-bold text-center mb-4">Verification Code</h1>

                    <p className="text-center text-gray-600 mb-6">
                        We've sent a verification code to your mail
                    </p>

                    <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                maxLength={1}
                                className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                disabled={timeLeft === 0}
                            />
                        ))}
                    </div>

                    {
                        timeLeft > 0 ? (
                            <p className="text-center text-gray-600 mb-6">
                                Code expires in <span className="font-medium">{formatTime(timeLeft)}</span>
                            </p>
                        ) : (
                            <p className="text-center text-red-600 mb-6">
                                Code Expired
                            </p>
                        )
                    }

                    <button
                        onClick={verify}
                        className={`w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors ${timeLeft !== 0 ? 'cursor-pointer': 'cursor-not-allowed'}`}
                        disabled={timeLeft === 0}
                    >
                        Verify
                    </button>

                    <p className="text-center mt-4 text-gray-600">
                        Didn't receive the code?
                        <button
                            onClick={resendCode}
                            className={`font-medium ml-1 ${timeLeft === 0 ? 'cursor-pointer text-blue-600': 'cursor-not-allowed text-gray-400'}`}
                            
                        >
                            Resend
                        </button>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default OtpPage;