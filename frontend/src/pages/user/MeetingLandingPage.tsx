import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import type { Review } from '../../interfaces/entities/Review';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import type { AllEventData } from '../../interfaces/entities/FormState';
import { formatDate } from '../../utils/stringUtils';
import type { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { NavBar } from '../../components/partials/NavBar';
import { toast } from 'sonner';
import { AxiosError } from 'axios';


const MeetingLandingPage: React.FC = () => {
    const { id } = useParams();
    const { user } = useSelector((state: RootState) => state.auth);
    const [step, setStep] = useState<'review' | 'submitted'>('review');
    const [review, setReview] = useState<Omit<Review, 'id' | 'userId' | 'createdAt'>>({
        rating: 0,
        title: '',
        eventId: id as string,
        message: ''
    });
    const [event, setEvent] = useState<AllEventData>();
    const [hoveredStar, setHoveredStar] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (review.rating === 0) {
            newErrors.rating = 'Please provide a rating';
        }
        if (review.title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        }
        if (review.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleStarClick = (rating: number) => {
        setReview(prev => ({ ...prev, rating }));
        if (errors.rating) {
            setErrors(prev => ({ ...prev, rating: '' }));
        }
    };

    const handleInputChange = (field: 'title' | 'message', value: string) => {
        setReview(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const res = await axiosInstance.post("/user/review", {
                rating: review.rating,
                title: review.title,
                message: review.message,
                eventId: id
            });
            if (res.data) {
                toast.success(res.data.message);
                setStep('submitted');
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
        setIsSubmitting(false);
    };

    const getRatingText = (rating: number): string => {
        const ratingTexts = {
            1: 'Poor - Event did not meet expectations',
            2: 'Fair - Event had some issues',
            3: 'Good - Event was satisfactory',
            4: 'Very Good - Event exceeded expectations',
            5: 'Excellent - Outstanding event experience'
        };
        return ratingTexts[rating as keyof typeof ratingTexts] || 'Select a rating';
    };

    useEffect(() => {
        const fetchEvent = async (id: string) => {
            try {
                const res = await axiosInstance.get(`/event/event/${id}`);
                if (res.data) {
                    setEvent(res.data.event);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchEvent(id as string);
    }, [id])

    const StarRating: React.FC = () => (
        <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                    <Star
                        className={`w-10 h-10 transition-colors duration-200 ${star <= (hoveredStar || review.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-300'
                            }`}
                    />
                </button>
            ))}
        </div>
    );

    if (step === 'submitted') {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} section="home" />
                <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
                    <div className="max-w-lg w-full">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center transform">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                Review Submitted Successfully!
                            </h1>
                            <p className="text-gray-600 mb-2">
                                Thank you for taking the time to review
                            </p>
                            <p className="text-lg font-semibold text-blue-600 mb-8">
                                "{event?.title}"
                            </p>
                            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                                <h3 className="font-semibold text-gray-800 mb-2">Your Review Summary</h3>
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-5 h-5 ${star <= review.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">({review.rating}/5)</span>
                                </div>
                                <p className="font-medium text-gray-800 mb-1">"{review.title}"</p>
                            </div>
                            <button
                                onClick={() => navigate("/")}
                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer"
                            >
                                Close Window
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} section="home" />
            <div className="min-h-screen mt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-3xl w-full">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                        <Calendar className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold mb-2">Event Completed</h1>
                                        <p className="text-blue-100 text-lg">Share your experience with others</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                <h2 className="text-xl font-semibold mb-4">{event?.title}</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(event?.startDate || '')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    How would you rate this event?
                                </h2>
                                <p className="text-gray-600 mb-6">Your honest feedback helps improve future events</p>

                                <StarRating />

                                <p className="text-sm font-medium text-gray-700 min-h-[20px]">
                                    {getRatingText(review.rating)}
                                </p>

                                {errors.rating && (
                                    <p className="text-red-500 text-sm mt-2">{errors.rating}</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-lg font-semibold text-gray-900 mb-3">
                                    Review Title *
                                </label>
                                <input
                                    type="text"
                                    value={review.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Summarize your experience in a few words..."
                                    className={`w-full p-4 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        }`}
                                    maxLength={100}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    {errors.title && (
                                        <p className="text-red-500 text-sm">{errors.title}</p>
                                    )}
                                    <p className="text-sm text-gray-500 ml-auto">
                                        {review.title.length}/100
                                    </p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                    <MessageSquare className="w-5 h-5" />
                                    Detailed Review *
                                </label>
                                <textarea
                                    value={review.message}
                                    onChange={(e) => handleInputChange('message', e.target.value)}
                                    placeholder="Tell others about your experience... What did you like? What could be improved? Would you recommend this event?"
                                    className={`w-full h-40 p-4 border rounded-xl resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        }`}
                                    maxLength={1000}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    {errors.message && (
                                        <p className="text-red-500 text-sm">{errors.message}</p>
                                    )}
                                    <p className="text-sm text-gray-500 ml-auto">
                                        {review.message.length}/1000
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => navigate("/")}
                                    className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 cursor-pointer"
                                >
                                    Skip Review
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Review
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-6 space-y-2">
                        <p className="text-sm text-gray-500">
                            Your review will be public and help other users discover great events
                        </p>
                        <p className="text-xs text-gray-400">
                            Reviews are moderated and may take up to 24 hours to appear
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeetingLandingPage;