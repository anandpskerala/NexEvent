import React, { useEffect, useState } from 'react'
import { nanoid } from '@reduxjs/toolkit';
import { Star, X } from 'lucide-react';
import type { Review } from '../../interfaces/entities/Review';
import type { User } from '../../interfaces/entities/User';
import { formatTimeAgo } from '../../utils/stringUtils';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import axiosInstance from '../../utils/axiosInstance';
import Pagination from '../partials/Pagination';

export const ReviewCard = ({ id, user }: { id: string, user: User }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [avgRating, setAvgRating] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newReview, setNewReview] = useState<Review>({
        id: nanoid(),
        rating: 0,
        title: "",
        message: "",
        eventId: id,
        userId: user,
        createdAt: new Date().toISOString()
    });
    const [hoverRating, setHoverRating] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    const renderInteractiveStars = (rating: number, onRate: ((rating: number) => void), onHover: ((rating: number) => void), onLeave: (() => void)) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onRate(star)}
                        onMouseEnter={() => onHover(star)}
                        onMouseLeave={onLeave}
                        className="p-1 hover:scale-110 transition-transform"
                    >
                        <Star
                            className={`w-6 h-6 ${star <= (hoverRating || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-300'
                                }`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    const handleSubmitReview = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/user/review", { rating: newReview.rating, title: newReview.title, message: newReview.message, eventId: newReview.eventId });
            if (res.data) {
                setReviews([...reviews, newReview])

                setNewReview({ id: nanoid(), rating: 0, title: "", message: "", eventId: id, userId: user, createdAt: new Date().toISOString() });
                setIsModalOpen(false);
                toast.success(res.data.message);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "Something went wrong");
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewReview((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewReview({ id: nanoid(), rating: 0, title: "", message: "", eventId: id, userId: user, createdAt: new Date().toISOString() });
        setHoverRating(0);
    };

    useEffect(() => {
        const fetchReviews = async (pageNumber: number, limit: number = 20) => {
            try {
                const res = await axiosInstance.get(`/user/review/${id}?page=${pageNumber}&limit=${limit}`);
                if (res.data) {
                    setReviews(res.data.reviews);
                    setPage(Number(res.data.page));
                    setPages(Number(res.data.pages));
                    setAvgRating(Number(res.data.avgRating))
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchReviews(page, 20);
    }, [id, page])

    return (
        <div className="w-full bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">Reviews</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-900">{avgRating}</span>
                        <span className="text-sm text-gray-500">{reviews.length} Reviews</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Write a review
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {
                    reviews.length === 0 ? (
                        <div className="flex w-full text-center items-center justify-center">No reviews</div>
                    ) :
                        (reviews.map((review) => (
                            <div key={review.id} className="flex gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    {
                                        review.userId.image ? (
                                            <img className="w-full h-full rounded-full" src={`${review.userId.image}`} />
                                        ) : (
                                            <span className="text-sm font-medium text-blue-600">
                                                {review.userId.firstName.slice(0, 1).toUpperCase()}
                                            </span>
                                        )
                                    }
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{review.userId.firstName} {review.userId.lastName}</h4>
                                            <p className="text-xs text-gray-500 font-medium tracking-wide">
                                                {formatTimeAgo(review.createdAt)}
                                            </p>
                                        </div>

                                        {renderStars(review.rating)}
                                    </div>
                                    <span className="font-medium text-sm">{review.title}</span>
                                    <p className="font-normal text-xs text-gray-700 leading-relaxed">
                                        {review.message}
                                    </p>
                                </div>
                            </div>
                        ))
                        )
                }
            </div>

            {/* Load More Button */}
            {/* <div className="flex justify-center mt-8">
                <button className="bg-black text-white px-6 py-2 text-sm font-medium rounded hover:bg-gray-800 transition-colors">
                    Load more reviews
                </button>
            </div> */}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating *
                                </label>
                                {renderInteractiveStars(
                                    newReview.rating,
                                    (rating: number) => setNewReview(prev => ({ ...prev, rating })),
                                    (rating: number) => setHoverRating(rating),
                                    () => setHoverRating(0)
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Click to rate this product
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Review Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={newReview.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Give your review a title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Review *
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    name="message"
                                    value={newReview.message}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Tell others about your experience..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Minimum 10 characters required
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newReview.rating || newReview.message.length < 10}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex justify-center mt-6 mb-6">
                <Pagination
                    currentPage={page}
                    totalPages={pages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}
