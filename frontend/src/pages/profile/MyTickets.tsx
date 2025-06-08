import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { NavBar } from '../../components/partials/NavBar';
import { UserSidebar } from '../../components/partials/UserSidebar';
import { Calendar, Clock, MapPin, Tag, } from 'lucide-react';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Pagination from '../../components/partials/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import { EventFormSkeleton } from '../../components/skeletons/EventsFormSkeleton';
import { formatDate, formatTime } from '../../utils/stringUtils';
import type { Booking } from '../../interfaces/entities/Booking';
import { LazyLoadingScreen } from '../../components/partials/LazyLoadingScreen';
import { CancelConfirmationModal } from '../../components/modals/CancelConfirmationModal';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Footer } from '../../components/partials/Footer';

const MyTickets = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [events, setEvents] = useState<Booking[]>([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [isConfirmModal, setConfirmModal] = useState<boolean>(false);
    const [selected, setSelected] = useState<Booking | null>();
    const navigate = useNavigate();

    type Status = 'paid' | 'pending' | 'failed' | 'cancelled';

    const getStatusBadge = (status: Status) => {
        const statusConfig: Record<Status, { color: string; label: string }> = {
            paid: { color: 'bg-green-100 text-green-800', label: 'Confirmed' },
            pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
            failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
            cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <span className={`flex items-center max-h-7 px-1.5 py-0 rounded-full text-xs font-medium ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const handleViewDetails = (eventId: string) => {
        navigate(`/booking/${eventId}`);
    };

    const handleContactOrganizer = (eventId: string) => {
        console.log('Contact organizer for event:', eventId);
        // Open contact modal or navigate to contact page
    };

    const handleCancel = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.patch(`/event/booking/${selected?.id}`);
            if (res.data) {
                setEvents((prev) =>
                    prev.map((booking) =>
                        booking.id === selected?.id ? { ...booking, status: 'cancelled' } : booking
                    )
                );
                toast.success(res.data.message);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        } finally {
            setLoading(false);
            setConfirmModal(false);
            setSelected(null);
        }
    };

    useEffect(() => {
        setLoading(true);
        try {
            const fetchRequest = async (pageNumber = 1) => {
                const res = await axiosInstance.get(`/event/bookings/${user?.id}?page=${pageNumber}&limit=10`)
                if (res.data) {
                    console.log(res.data.bookings)
                    setEvents(res.data.bookings);
                    setPage(res.data.page);
                    setPages(res.data.pages);
                }
            }
            fetchRequest(page);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }, [page, user?.id]);

    if (loading) return <LazyLoadingScreen />;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} />
            <div className="flex justify-center items-center p-4 mt-18">
                <div className="flex w-full gap-2 md:gap-5 overflow-hidden p-0 md:px-10 md:py-6">
                    <UserSidebar user={user} section='tickets' />
                    <div className="flex-1 bg-white py-10 px-6 md:px-20 rounded-2xl shadow-lg border border-gray-200">
                        <div className="flex items-center mb-4">
                            <Link to="/" className="text-blue-500 hover:text-blue-600 transition-colors text-sm md:text-md font-medium">
                                Home
                            </Link>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-gray-700 text-sm md:text-md font-medium">My Tickets</span>
                        </div>

                        <div className="flex items-center justify-between mb-8">

                            {/* Filter Tabs */}
                            {/* <div className="flex bg-white rounded-lg border shadow-sm">
                                {filters.map((filter, index) => (
                                    <button
                                        key={filter}
                                        onClick={() => {
                                            setCurrentFilter(filter);
                                            setCurrentPage(1);
                                        }}
                                        className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${index === 0 ? 'rounded-l-lg' : ''
                                            } ${index === filters.length - 1 ? 'rounded-r-lg' : ''
                                            } ${currentFilter === filter
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div> */}
                        </div>

                        {loading ? (<EventFormSkeleton />) : (
                            <div className="space-y-6">
                                {events.map((event) => (
                                    <div key={event.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
                                        <div className="p-6">
                                            <div className="flex flex-col lg:flex-row gap-6">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={event.eventId.image as string}
                                                        alt={event.eventId.title}
                                                        className="w-full lg:w-24 h-48 lg:h-24 object-cover rounded-lg"
                                                    />
                                                </div>

                                                <div className="flex-grow">
                                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                                        <div className="flex-grow">
                                                            <div className="flex gap-2">
                                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                                    {event.eventId.title}
                                                                </h3>

                                                                {getStatusBadge(event.status)}
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-4 h-4" />
                                                                    <span>{formatDate(event.eventId.startDate as string)}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="w-4 h-4" />
                                                                    <span>{formatTime(event.eventId.startTime as string)}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="w-4 h-4" />
                                                                    <span>{event.eventId?.location?.place}</span>
                                                                </div>
                                                            </div>

                                                            {event.eventId.tags && event.eventId.tags.length > 0 && (
                                                                <div className="flex flex-wrap gap-2 mb-4">
                                                                    {event.eventId.tags.slice(0, 3).map((tag: string, index: number) => (
                                                                        <span
                                                                            key={index}
                                                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                                                        >
                                                                            <Tag className="w-3 h-3" />
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-col gap-3 lg:ml-6">

                                                            <div className="flex flex-col sm:flex-row gap-2">
                                                                <button
                                                                    onClick={() => handleViewDetails(event.orderId as string)}
                                                                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                                                                >
                                                                    View Details
                                                                </button>
                                                                <button
                                                                    onClick={() => handleContactOrganizer(event.id as string)}
                                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                                                >
                                                                    Contact Organizer
                                                                </button>
                                                                {event.status === "paid" && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setConfirmModal(true);
                                                                            setSelected(event);
                                                                        }}
                                                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700 transition-colors duration-200 cursor-pointer"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {events.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <Calendar className="w-16 h-16 mx-auto" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                                <p className="text-gray-500">
                                    There are no events matching your current filter. Try selecting a different time period.
                                </p>
                            </div>
                        )}

                        <div className="flex justify-center mt-6">
                            <Pagination
                                currentPage={page}
                                totalPages={pages}
                                onPageChange={setPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <CancelConfirmationModal
                isOpen={isConfirmModal}
                onClose={() => setConfirmModal(false)}
                onConfirm={handleCancel}
                itemName={`${selected?.eventId.title}'s ticket`}
            />
            <Footer />
        </div>
    )
}

export default MyTickets