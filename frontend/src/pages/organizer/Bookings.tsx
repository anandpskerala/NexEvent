import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { OrganizerSideBar } from '../../components/partials/OrganizerSidebar';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import type { Booking } from '../../interfaces/entities/Booking';
import { formatCurrency, formatDate } from '../../utils/stringUtils';
import { AlertTriangle, Calendar, CheckCircle, Clock, MapPin, Search, XCircle } from 'lucide-react';
import { EventFormSkeleton } from '../../components/skeletons/EventsFormSkeleton';
import axiosInstance from '../../utils/axiosInstance';
import Pagination from '../../components/partials/Pagination';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useDebounce } from '../../hooks/useDebounce';

const Bookings = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [bookings, setBookings] = useState<Booking[]>([]);
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'text-green-700 bg-green-100';
            case 'pending': return 'text-yellow-700 bg-yellow-100';
            case 'cancelled': return 'text-red-700 bg-red-100';
            case 'failed': return 'text-red-700 bg-red-100';
            default: return 'text-gray-700 bg-gray-100';
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
    }

    useEffect(() => {
        const fetchBookings = async (page: number, limit: number) => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/event/organizer/booking?search=${debouncedSearch}&page=${page}&limit=${limit}`);
                if (res.data) {
                    console.log(res.data)
                    setBookings(res.data.bookings);
                    setPage(Number(res.data.page));
                    setPages(Number(res.data.pages | Math.ceil(res.data.bookings.length / limit)));
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        };

        fetchBookings(page, 10);
    }, [page, debouncedSearch]);

    return (
        <div className="flex h-screen bg-gray-50">
            <OrganizerSideBar sidebarCollapsed={sidebarCollapsed} section='bookings' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title='Bookings' user={user} toggleSidebar={toggleSidebar} />

                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                        <div className="relative">
                            <input
                                id="search"
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search by booking number"
                                className="w-full md:w-80 pl-3 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                aria-label="Search by name"
                            />
                            <button
                                className="absolute right-0 top-0 h-full px-3 text-white bg-blue-600 rounded-r-lg"
                                aria-label="Search"
                            >
                                <Search size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            {loading ? (<EventFormSkeleton />) : (
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Booking Number
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Event
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Attendee
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {
                                            bookings.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                                        No bookings found
                                                    </td>
                                                </tr>
                                            ) : (
                                                bookings.map((booking) => (
                                                    <tr key={booking.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{booking.orderId}</div>
                                                                <div className="text-sm text-gray-500">{formatDate(booking.createdAt)}</div>
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
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{booking.user?.firstName} {booking.user?.lastName}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{formatCurrency(booking.totalAmount, booking.eventId.currency)}</div>
                                                                <div className="text-sm text-gray-500">{booking.paymentMethod}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="space-y-1">
                                                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                                    {getStatusIcon(booking.status)}
                                                                    <span className="capitalize">{booking.status}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            {booking.status !== "cancelled" && (
                                                                <button
                                                                    className="bg-white border-2 border-red-500 text-red-500 rounded-md p-1 cursor-pointer"
                                                                    onClick={() => handleCancel(booking.id)}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )
                                        }
                                    </tbody>
                                </table>
                            )}

                            <div className="flex justify-center mt-6 mb-6">
                                <Pagination
                                    currentPage={page}
                                    totalPages={pages}
                                    onPageChange={setPage}
                                />
                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    )
}

export default Bookings