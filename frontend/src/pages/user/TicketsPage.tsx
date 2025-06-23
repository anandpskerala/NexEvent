import { useEffect, useState } from 'react'
import type { Booking } from '../../interfaces/entities/Booking';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { LazyLoadingScreen } from '../../components/partials/LazyLoadingScreen';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { NavBar } from '../../components/partials/NavBar';
import { formatCurrency, formatDate } from '../../utils/stringUtils';
import { ArrowLeft, Calendar, Check, Download, MapPin } from 'lucide-react';

const TicketsPage = () => {
    const { id } = useParams();
    const { user } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState<boolean>(true);
    const [booking, setBooking] = useState<Booking | null>();
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
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Check className="w-3 h-3 mr-1" />
                {config.label}
            </span>
        );
    };

    const calculateSubtotal = () => {
        return booking?.tickets.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0);
    };

    const handleBackToTickets = () => {
        navigate(-1);
    };

    const handleDownloadAllTickets = async (bookingId: string) => {
        try {
            const res = await axiosInstance.get(`/event/ticket/download/${bookingId}`, {
                responseType: 'blob',
            });

            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ticket-${bookingId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Download failed', error);
        }
    };

    const getTicketDescription = (ticketId: string) => {
        const eventTicket = booking?.eventId?.tickets?.find(t => t.id === ticketId);
        return eventTicket?.description || '';
    };


    const subtotal = calculateSubtotal();
    useEffect(() => {
        const fetchRequest = async (id: string) => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/event/booking/${id}`);
                if (res.data) {
                    setBooking(res.data.booking);
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        };

        fetchRequest(id as string);
    }, [id]);

    if (loading) return <LazyLoadingScreen />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} />

            <div className="min-h-screen bg-gray-50">
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center py-4">
                            <button
                                onClick={handleBackToTickets}
                                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                <span className="text-sm">Back to My Tickets</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow-sm border mt-5">
                        <div className="p-6 border-b">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Ticket Details</h1>

                            <div className="flex items-start gap-4">
                                <img
                                    src={booking?.eventId.image}
                                    alt={booking?.eventId.title}
                                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-grow">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        {booking?.eventId.title}
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(booking?.eventId.startDate as string)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{booking?.eventId?.location?.place || "Virtual"}</span>
                                        </div>
                                    </div>
                                    {getStatusBadge(booking?.status as Status)}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-b">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-sm font-medium text-gray-500 border-b">
                                            <th className="pb-3">Ticket Type</th>
                                            <th className="pb-3 text-right">Price</th>
                                            <th className="pb-3 text-center">Quantity</th>
                                            <th className="pb-3 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {booking?.tickets.map((ticket, index) => (
                                            <tr key={`${ticket.ticketId}-${index}`} className="text-sm">
                                                <td className="py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{ticket.name}</div>
                                                        <div className="text-gray-500 text-xs mt-1">
                                                            {getTicketDescription(ticket.ticketId)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-right font-medium text-gray-900">
                                                    {formatCurrency(ticket.price, booking.eventId.currency)}
                                                </td>
                                                <td className="py-4 text-center text-gray-900">
                                                    {ticket.quantity}
                                                </td>
                                                <td className="py-4 text-center">
                                                    {getStatusBadge(booking.status)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="p-6 mb-5">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Order Number</span>
                                        <span className="font-medium text-gray-900">{booking?.orderId}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Purchase Date</span>
                                        <span className="font-medium text-gray-900">{formatDate(booking?.createdAt as string)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Payment Method</span>
                                        <div className="flex items-center">
                                            <span className="font-medium text-gray-900 capitalize">
                                                {booking?.paymentMethod === 'razorpay' ? 'RazorPay' :
                                                    booking?.paymentMethod === 'stripe' ? 'Stripe' : 'Wallet'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(subtotal as number, booking?.eventId.currency)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Service Fee</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(booking?.eventId.entryType === "free" ? 0: 5, booking?.eventId.currency)}</span>
                                    </div>
                                    <div className="flex justify-between text-base font-semibold border-t pt-3">
                                        <span className="text-gray-900">Total</span>
                                        <span className="text-blue-600">{formatCurrency(booking?.totalAmount as number, booking?.eventId.currency)}</span>
                                    </div>
                                </div>
                            </div>

                            {booking?.status === "paid" && (
                                <div className="mt-8 flex justify-end">
                                    {booking.eventId.eventType !== "virtual" ? (
                                        <button
                                        onClick={() => handleDownloadAllTickets(id as string)}
                                        className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Ticket
                                    </button>
                                    ): (
                                        <Link 
                                            to={`/meeting/${booking.eventId.id}`}
                                            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                                        >
                                            Get Virtual Link
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TicketsPage