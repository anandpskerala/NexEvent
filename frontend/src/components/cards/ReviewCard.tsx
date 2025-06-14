import React, { useState } from 'react'
import { ChevronDown, Star, X } from 'lucide-react';

export const ReviewCard = () => {
    const [reviews] = useState([
        {
            id: 1,
            name: "Emily Davis",
            avatar: "ED",
            timeAgo: "1 WEEK AGO",
            rating: 4,
            comment: "This company always goes above and beyond to satisfy their customers."
        },
        {
            id: 2,
            name: "Daniel Smith",
            avatar: "DS",
            timeAgo: "2 MONTHS AGO",
            rating: 4,
            comment: "I can't believe how affordable and high-quality this item is!"
        }
    ]);

    const [sortBy, setSortBy] = useState("SORT BY");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 0,
        title: "",
        comment: "",
        name: ""
    });
    const [hoverRating, setHoverRating] = useState(0);

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

    const handleSubmitReview = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle review submission logic here
        console.log('New review:', newReview);

        // Reset form and close modal
        setNewReview({ rating: 0, title: "", comment: "", name: "" });
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewReview({ rating: 0, title: "", comment: "", name: "" });
        setHoverRating(0);
    };

    return (
        <div className="w-full bg-white p-6 rounded-lg border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">Reviews</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-900">4.2</span>
                        <span className="text-sm text-gray-500">54 Reviews</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Write a review
                    </button>

                    <div className="relative">
                        <button
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            onClick={() => {/* Handle sort dropdown */ }}
                        >
                            {sortBy}
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="flex gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-blue-600">
                                {review.avatar}
                            </span>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h4 className="font-medium text-gray-900">{review.name}</h4>
                                    <p className="text-xs text-gray-500 font-medium tracking-wide">
                                        {review.timeAgo}
                                    </p>
                                </div>

                                {renderStars(review.rating)}
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            <div className="flex justify-center mt-8">
                <button className="bg-black text-white px-6 py-2 text-sm font-medium rounded hover:bg-gray-800 transition-colors">
                    Load more reviews
                </button>
            </div>

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
                                    value={newReview.title}
                                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
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
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
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
                                    disabled={!newReview.rating || !newReview.name || !newReview.comment || newReview.comment.length < 10}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
