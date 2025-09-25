import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { OrganizerSideBar } from '../../components/partials/OrganizerSidebar';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import type { Booking, EventSummary } from '../../interfaces/entities/Booking';
import { formatCurrency, formatDate } from '../../utils/stringUtils';
import {
    Calendar,
    MapPin,
    Search,
    Users,
    DollarSign,
    Eye,
    MoreVertical
} from 'lucide-react';
import { EventFormSkeleton } from '../../components/skeletons/EventsFormSkeleton';
import Pagination from '../../components/partials/Pagination';
import { useDebounce } from '../../hooks/useDebounce';
import { getBookings } from '../../services/bookingService';
import { useNavigate } from 'react-router-dom';


const Bookings = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [eventSummaries, setEventSummaries] = useState<EventSummary[]>([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };

    const handleViewBookings = (eventId: string) => {
        navigate(`/organizer/bookings/details?eventId=${eventId}`);
    };

    const createEventSummaries = (bookings: Booking[]): EventSummary[] => {
        const grouped = bookings.reduce((acc, booking) => {
            const eventId = booking.eventId.id;
            if (!acc[eventId]) {
                acc[eventId] = {
                    eventId,
                    eventTitle: booking.eventId.title,
                    eventDate: booking.eventId.startDate,
                    eventLocation: booking.eventId?.location?.place || "Virtual",
                    totalRevenue: 0,
                    totalBookings: 0,
                    paidBookings: 0,
                    pendingBookings: 0,
                    cancelledBookings: 0,
                    currency: booking.eventId.currency
                };
            }
            
            acc[eventId].totalBookings += 1;
            
            if (booking.status === "paid") {
                acc[eventId].totalRevenue += booking.totalAmount;
                acc[eventId].paidBookings += 1;
            } else if (booking.status === "pending") {
                acc[eventId].pendingBookings += 1;
            } else if (booking.status === "cancelled") {
                acc[eventId].cancelledBookings += 1;
            }
            
            return acc;
        }, {} as Record<string, EventSummary>);

        return Object.values(grouped).sort((a, b) =>
            new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        );
    };

    useEffect(() => {
        const fetchEventSummaries = async (page: number, limit: number) => {
            setLoading(true);
            try {
                const res = await getBookings(debouncedSearch, page, limit);
                if (res) {
                    const summaries = createEventSummaries(res.bookings);
                    setEventSummaries(summaries);
                    setPage(Number(res.page));
                    setPages(Number(res.pages));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventSummaries(page, 10);
    }, [page, debouncedSearch]);

    const totalStats = eventSummaries.reduce(
        (acc, event) => ({
            totalEvents: acc.totalEvents + 1,
            totalBookings: acc.totalBookings + event.totalBookings,
            totalRevenue: acc.totalRevenue + event.totalRevenue
        }),
        { totalEvents: 0, totalBookings: 0, totalRevenue: 0 }
    );

    return (
        <div className="flex h-screen bg-gray-100">
            <OrganizerSideBar sidebarCollapsed={sidebarCollapsed} section='bookings' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title='Bookings Overview' user={user} toggleSidebar={toggleSidebar} />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Events</p>
                                    <p className="text-3xl font-bold text-gray-900">{totalStats.totalEvents}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <Calendar className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                    <p className="text-3xl font-bold text-gray-900">{totalStats.totalBookings}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {eventSummaries.length > 0 ? formatCurrency(totalStats.totalRevenue, eventSummaries[0].currency) : '$0'}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full lg:w-auto">
                                <input
                                    id="search"
                                    type="text"
                                    value={search}
                                    onChange={handleSearch}
                                    placeholder="Search events by title"
                                    className="w-full sm:w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    aria-label="Search events"
                                />
                                <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {loading ? (
                            <EventFormSkeleton />
                        ) : eventSummaries.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                                <p className="text-gray-500">Try adjusting your search terms.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {eventSummaries.map((event) => (
                                    <div key={event.eventId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.eventTitle}</h3>
                                                    <div className="flex flex-col gap-2 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            {formatDate(event.eventDate)}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" />
                                                            {event.eventLocation}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <MoreVertical className="w-4 h-4 text-gray-500" />
                                                </button>
                                            </div>

                                            {/* Event Stats */}
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                    <p className="text-sm font-medium text-blue-600">Total Bookings</p>
                                                    <p className="text-2xl font-bold text-blue-900">{event.totalBookings}</p>
                                                </div>
                                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                                    <p className="text-sm font-medium text-green-600">Revenue</p>
                                                    <p className="text-2xl font-bold text-green-900">
                                                        {formatCurrency(event.totalRevenue, event.currency)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Booking Status Breakdown */}
                                            <div className="flex justify-between text-sm text-gray-600 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    Paid: {event.paidBookings}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                    Pending: {event.pendingBookings}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                    Cancelled: {event.cancelledBookings}
                                                </span>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleViewBookings(event.eventId)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View Bookings
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {pages > 1 && (
                        <div className="flex justify-center mt-8">
                            <Pagination
                                currentPage={page}
                                totalPages={pages}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Bookings;