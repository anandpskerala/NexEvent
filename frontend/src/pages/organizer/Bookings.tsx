import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
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
    ChevronDown,
    ChevronUp,
    Users,
    DollarSign
} from 'lucide-react';
import { EventFormSkeleton } from '../../components/skeletons/EventsFormSkeleton';
import axiosInstance from '../../utils/axiosInstance';
import Pagination from '../../components/partials/Pagination';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useDebounce } from '../../hooks/useDebounce';

interface GroupedBookings {
    eventId: string;
    eventTitle: string;
    eventDate: string;
    eventLocation: string;
    bookings: Booking[];
    totalRevenue: number;
    totalBookings: number;
    currency: string;
}

const Bookings = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [groupedBookings, setGroupedBookings] = useState<GroupedBookings[]>([]);
    const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
    const [selectedEvent, setSelectedEvent] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
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

    const toggleEventExpansion = (eventId: string) => {
        const newExpanded = new Set(expandedEvents);
        if (newExpanded.has(eventId)) {
            newExpanded.delete(eventId);
        } else {
            newExpanded.add(eventId);
        }
        setExpandedEvents(newExpanded);
    };

    const expandAllEvents = () => {
        const allEventIds = groupedBookings.map(group => group.eventId);
        setExpandedEvents(new Set(allEventIds));
    };

    const collapseAllEvents = () => {
        setExpandedEvents(new Set());
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
            const res = await axiosInstance.patch(`/event/booking/${id}`);
            setBookings(prev =>
                prev.map(booking =>
                    booking.id === id ? { ...booking, status: "cancelled" } : booking
                )
            );
            toast.success(res.data.message || "Booking cancelled");
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const message = err.response?.data?.message || "Something went wrong";
            toast.error(message);
        }
    };

    const groupBookingsByEvent = (bookings: Booking[]): GroupedBookings[] => {
        const grouped = bookings.reduce((acc, booking) => {
            const eventId = booking.eventId.id;
            if (!acc[eventId]) {
                acc[eventId] = {
                    eventId,
                    eventTitle: booking.eventId.title,
                    eventDate: booking.eventId.startDate,
                    eventLocation: booking.eventId?.location?.place || "Virtual",
                    bookings: [],
                    totalRevenue: 0,
                    totalBookings: 0,
                    currency: booking.eventId.currency
                };
            }
            acc[eventId].bookings.push(booking);
            if (booking.status === "paid") {
                acc[eventId].totalRevenue += booking.totalAmount;
            }
            acc[eventId].totalBookings += 1;
            return acc;
        }, {} as Record<string, GroupedBookings>);

        return Object.values(grouped).sort((a, b) =>
            new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        );
    };

    const filteredGroupedBookings = groupedBookings.filter(group => {
        if (selectedEvent !== 'all' && group.eventId !== selectedEvent) return false;
        if (statusFilter !== 'all') {
            return group.bookings.some(booking => booking.status === statusFilter);
        }
        return true;
    }).map(group => ({
        ...group,
        bookings: statusFilter === 'all'
            ? group.bookings
            : group.bookings.filter(booking => booking.status === statusFilter)
    }));

    const uniqueEvents = groupedBookings.map(group => ({
        id: group.eventId,
        title: group.eventTitle
    }));

    useEffect(() => {
        const fetchBookings = async (page: number, limit: number) => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/event/organizer/booking?search=${debouncedSearch}&page=${page}&limit=${limit}`);
                if (res.data) {
                    setBookings(res.data.bookings);
                    setGroupedBookings(groupBookingsByEvent(res.data.bookings));
                    setPage(Number(res.data.page));
                    setPages(Number(res.data.pages || Math.ceil(res.data.bookings.length / limit)));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings(page, 10);
    }, [page, debouncedSearch]);

    useEffect(() => {
        setGroupedBookings(groupBookingsByEvent(bookings));
    }, [bookings]);

    const totalStats = groupedBookings.reduce(
        (acc, group) => ({
            totalBookings: acc.totalBookings + group.totalBookings,
            totalRevenue: acc.totalRevenue + group.totalRevenue
        }),
        { totalBookings: 0, totalRevenue: 0 }
    );

    return (
        <div className="flex h-screen bg-gray-50">
            <OrganizerSideBar sidebarCollapsed={sidebarCollapsed} section='bookings' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title='Bookings Management' user={user} toggleSidebar={toggleSidebar} />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                                        {groupedBookings.length > 0 ? formatCurrency(totalStats.totalRevenue, groupedBookings[0].currency) : '$0'}
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
                                    <p className="text-sm font-medium text-gray-600">Active Events</p>
                                    <p className="text-3xl font-bold text-gray-900">{groupedBookings.length}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <Calendar className="w-6 h-6 text-purple-600" />
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

                            <div className="flex gap-2">
                                <button
                                    onClick={expandAllEvents}
                                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    Expand All
                                </button>
                                <button
                                    onClick={collapseAllEvents}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Collapse All
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {loading ? (
                            <EventFormSkeleton />
                        ) : filteredGroupedBookings.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            filteredGroupedBookings.map((eventGroup) => (
                                <div key={eventGroup.eventId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div
                                        className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
                                        onClick={() => toggleEventExpansion(eventGroup.eventId)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-semibold text-gray-900">{eventGroup.eventTitle}</h3>
                                                    {expandedEvents.has(eventGroup.eventId) ?
                                                        <ChevronUp className="w-5 h-5 text-gray-500" /> :
                                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                                    }
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(eventGroup.eventDate)}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {eventGroup.eventLocation}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-6 text-right">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Bookings</p>
                                                    <p className="text-2xl font-bold text-gray-900">{eventGroup.totalBookings}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                                                    <p className="text-2xl font-bold text-green-600">
                                                        {formatCurrency(eventGroup.totalRevenue, eventGroup.currency)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {expandedEvents.has(eventGroup.eventId) && (
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Booking Details
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
                                                    {eventGroup.bookings.map((booking) => (
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
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {booking.user?.firstName} {booking.user?.lastName}
                                                                </div>
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
                                                                    {booking.status !== "cancelled" && (
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
                            ))
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