import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { RootState } from '../../store';
import { OrganizerSideBar } from '../../components/partials/OrganizerSidebar';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import type { Booking } from '../../interfaces/entities/Booking';
import { formatCurrency, formatDate } from '../../utils/stringUtils';
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
    MapPin,
    Search,
    XCircle,
    Users,
    DollarSign,
} from 'lucide-react';
import { EventFormSkeleton } from '../../components/skeletons/EventsFormSkeleton';
import Pagination from '../../components/partials/Pagination';
import { toast } from 'sonner';
import { useDebounce } from '../../hooks/useDebounce';
import { cancelBooking, getBookings } from '../../services/bookingService';

const BookingDetails = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const urlParams = new URLSearchParams(location.search);
    const eventIdFromUrl = urlParams.get('eventId');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'text-green-700 bg-green-100 border-green-200';
            case 'pending': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
            case 'cancelled': return 'text-red-700 bg-red-100 border-red-200';
            case 'failed': return 'text-red-700 bg-red-100 border-red-200';
            default: return 'text-gray-700 bg-gray-100 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid': return <CheckCircle className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            default: return <AlertTriangle className="w-4 h-4" />;
        }
    };

    const handleCancel = async (id: string) => {
        try {
            const res = await cancelBooking(id);
            setBookings(prev =>
                prev.map(booking =>
                    booking.id === id ? { ...booking, status: "cancelled" } : booking
                )
            );
            toast.success(res.message || "Booking cancelled");
        } catch (error) {
            console.error(error);
            toast.error("Failed to cancel booking");
        }
    };



    useEffect(() => {
        let filtered = [...bookings];

        if (selectedEvent !== 'all') {
            filtered = filtered.filter(booking => booking.eventId.id === selectedEvent);
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }

        setFilteredBookings(filtered);
    }, [bookings, selectedEvent, statusFilter]);

    useEffect(() => {
        if (eventIdFromUrl) {
            setSelectedEvent(eventIdFromUrl);
        }
    }, [eventIdFromUrl]);

    useEffect(() => {
        const fetchBookings = async (page: number, limit: number) => {
            setLoading(true);
            try {
                const res = await getBookings(debouncedSearch, page, limit);
                if (res) {
                    setBookings(res.bookings);
                    setPage(Number(res.page));
                    setPages(Number(res.pages || Math.ceil(res.bookings.length / limit)));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings(page, 10);
    }, [page, debouncedSearch]);

    const uniqueEvents = Array.from(
        new Map(bookings.map(booking => [booking.eventId.id, booking.eventId])).values()
    ).map(event => ({
        id: event.id,
        title: event.title
    }));

    const stats = filteredBookings.reduce(
        (acc, booking) => {
            acc.totalBookings += 1;
            if (booking.status === 'paid') {
                acc.totalRevenue += booking.totalAmount;
                acc.paidBookings += 1;
            } else if (booking.status === 'pending') {
                acc.pendingBookings += 1;
            } else if (booking.status === 'cancelled') {
                acc.cancelledBookings += 1;
            }
            return acc;
        },
        { totalBookings: 0, totalRevenue: 0, paidBookings: 0, pendingBookings: 0, cancelledBookings: 0 }
    );


    const selectedEventDetails = selectedEvent !== 'all'
        ? bookings.find(booking => booking.eventId.id === selectedEvent)?.eventId
        : null;

    const pageTitle = selectedEventDetails
        ? `Bookings - ${selectedEventDetails.title}`
        : 'All Bookings';

    return (
        <div className="flex h-screen bg-gray-100">
            <OrganizerSideBar sidebarCollapsed={sidebarCollapsed} section='bookings' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title={pageTitle} user={user} toggleSidebar={toggleSidebar} />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
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
                                        {filteredBookings.length > 0 ? formatCurrency(stats.totalRevenue, filteredBookings[0].eventId.currency) : '$0'}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Paid Bookings</p>
                                    <p className="text-3xl font-bold text-green-600">{stats.paidBookings}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending</p>
                                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                <div className="relative">
                                    <input
                                        id="search"
                                        type="text"
                                        value={search}
                                        onChange={handleSearch}
                                        placeholder="Search by booking number or attendee name"
                                        className="w-full sm:w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        aria-label="Search bookings"
                                    />
                                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                </div>

                                {!eventIdFromUrl && (
                                    <select
                                        value={selectedEvent}
                                        onChange={(e) => setSelectedEvent(e.target.value)}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Events</option>
                                        {uniqueEvents.map(event => (
                                            <option key={event.id} value={event.id}>{event.title}</option>
                                        ))}
                                    </select>
                                )}

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {loading ? (
                            <div className="p-6">
                                <EventFormSkeleton />
                            </div>
                        ) : filteredBookings.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Booking Details
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Event
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Attendee
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredBookings.map((booking) => (
                                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">#{booking.orderId}</div>
                                                        <div className="text-sm text-gray-500">
                                                            Booked on {formatDate(booking.createdAt)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{booking.eventId.title}</div>
                                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(booking.eventId.startDate)}
                                                        </div>
                                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {booking.eventId?.location?.place || "Virtual"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {booking.user?.firstName} {booking.user?.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{booking.user?.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {formatCurrency(booking.totalAmount, booking.eventId.currency)}
                                                        </div>
                                                        <div className="text-sm text-gray-500">{booking.paymentMethod}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                                                        {getStatusIcon(booking.status)}
                                                        <span className="capitalize">{booking.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {booking.status !== "cancelled" && booking.status !== "failed" && (
                                                            <button
                                                                className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                                                                onClick={() => handleCancel(booking.id)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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

export default BookingDetails;