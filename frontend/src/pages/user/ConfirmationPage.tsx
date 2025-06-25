import { useEffect, useState } from 'react';
import QRcode from "qrcode";
import axiosInstance from '../../utils/axiosInstance';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosError, type AxiosResponse } from 'axios';
import { Calendar, CheckCircle, Clock, Download, Eye, MapPin, QrCode, XCircle } from 'lucide-react';
import { EventFormSkeleton } from '../../components/skeletons/EventsFormSkeleton';
import type { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { NavBar } from '../../components/partials/NavBar';
import type { Booking } from '../../interfaces/entities/Booking';
import { LazyLoadingScreen } from '../../components/partials/LazyLoadingScreen';
import { formatCurrency, formatDate } from '../../utils/stringUtils';
import config from '../../config/config';
import type { RazorpayOptions, RazorpayResponse } from '../../interfaces/entities/RazorPay';

const ConfirmationPage = () => {
    const { id } = useParams();
    const { user } = useSelector((state: RootState) => state.auth);
    const [booking, setBooking] = useState<Booking | null>();
    const [loading, setLoading] = useState<boolean>(true);
    const [qrcode, setQrCode] = useState<string>("");
    const navigate = useNavigate();

    const downloadTicket = async (bookingId: string) => {
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

    const handlePayment = async (): Promise<void> => {
        try {
            if (!booking) return;
            console.log(booking);
            if (booking.paymentMethod === "razorpay") {
                const res: AxiosResponse<{
                    order: {
                        id: string;
                        amount: number;
                        currency: string;
                    };
                }> = await axiosInstance.post("/event/payment/razorpay/order", {
                    amount: booking.totalAmount,
                    currency: booking.eventId.currency || "INR",
                });

                const options: RazorpayOptions = {
                    key: config.payment.RPayKey,
                    amount: res.data.order.amount,
                    currency: res.data.order.currency,
                    name: booking.eventId.title,
                    description: "Ticket Booking",
                    order_id: res.data.order.id,
                    handler: async (response: RazorpayResponse) => {
                        await axiosInstance.post("/event/payment/razorpay/verify", {
                            ...response,
                            bookingId: booking.id,
                            eventId: booking.eventId.id,
                            amount: res.data.order.amount,
                            currency: res.data.order.currency
                        });
                        toast.success("Payment successfull");
                        navigate(`/payment/${booking.orderId}`);
                    },
                    prefill: {
                        name: user?.firstName || "",
                        email: user?.email || "",
                    },
                    theme: {
                        color: "#0193ff",
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', async () => {
                    await axiosInstance.post(`/event/failed/booking`, {
                        bookingId: booking.id,
                        eventId: booking.eventId.id,
                        amount: res.data.order.amount,
                        currency: res.data.order.currency,
                        status: 'failed'
                    });
                    window.location.reload();
                })
                rzp.open();
            }

            else if (booking.paymentMethod === "stripe") {
                const res: AxiosResponse<{ order: string }> = await axiosInstance.post(
                    "/event/payment/stripe/order",
                    {
                        eventId: booking.eventId.id, tickets: booking.tickets, promoCode: booking.couponCode, amount: booking.totalAmount * 100,
                        bookingId: booking.id, currency: booking.eventId.currency || "INR", orderId: booking.orderId
                    }
                );

                window.open(
                    res.data.order,
                    "_blank",
                    "width=500,height=700"
                );

                const handleMessage = async (event: MessageEvent) => {
                    if (event.origin !== window.location.origin) return;

                    const { sessionId } = event.data;
                    if (sessionId) {
                        try {
                            const res = await axiosInstance.post("/event/payment/stripe/verify", { sessionId });
                            if (res.data) {
                                toast.success(res.data.message);
                                navigate(`/payment/${res.data.paymentId}`);
                            }
                        } catch (err) {
                            console.log(err)
                            toast.error("Stripe verification failed");
                        }
                    }
                };

                window.addEventListener("message", handleMessage, { once: true });
            }

            else if (booking.paymentMethod === "wallet") {
                const res = await axiosInstance.post(
                    "/event/payment/wallet/pay",
                    { eventId: booking.eventId.id, currency: booking.eventId.currency, amount: booking.totalAmount, bookingId: booking.id }
                );
                if (res.data.paymentId) {
                    toast.success("Payment successful via Wallet!");
                    navigate(`/payment/${booking.orderId}`)
                } else {
                    toast.error("Insufficient wallet balance.");
                }
            }

        } catch (err) {
            console.error("Payment error:", err);
            toast.error("Payment failed. Please try again.");
        }
    };


    useEffect(() => {
        const getBookingDetails = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/event/booking/${id}`);

                if (res.data) {
                    setBooking(res.data.booking);
                    const qr = await QRcode.toDataURL(JSON.stringify({ eventId: booking?.eventId.id, booking: booking?.id }));
                    setQrCode(qr);
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data.message);
                }
            } finally {
                setLoading(false);
            }
        };

        getBookingDetails();
    }, [id]);

    if (!booking) return <LazyLoadingScreen />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} />
            {
                loading ? (
                    <EventFormSkeleton />
                ) : (
                    <div className="max-w-4xl mx-auto px-4 py-24">
                        < div className={`rounded-lg p-8 text-center mb-8 ${booking.status === "paid"
                            ? 'bg-green-100 border border-green-200'
                            : 'bg-red-100 border border-red-200'
                            }`
                        }>
                            {
                                booking.status === "paid" ? (
                                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                ) : (
                                    <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                                )
                            }

                            < h1 className={`text-2xl font-bold mb-2 ${booking.status === "paid" ? 'text-green-800' : 'text-red-800'
                                }`}>
                                {booking.status === "paid" ? 'Purchase Successful!' : 'Booking Failed'}
                            </h1 >

                            <p className={`${booking.status === "paid" ? 'text-green-700' : 'text-red-700'
                                }`}>
                                {booking.status === "paid"
                                    ? `Your tickets for ${booking.eventId.title} have been confirmed.`
                                    : 'We were unable to process your booking.'
                                }
                            </p>
                        </div >

                        {
                            booking.status === "paid" ? (
                                <>
                                    <div className="bg-white rounded-lg shadow-sm border mb-6">
                                        <div className="px-6 py-4 border-b">
                                            <h2 className="text-lg font-semibold text-gray-900">Order Information</h2>
                                        </div>
                                        <div className="px-6 py-4 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Order Number</span>
                                                    <span className="font-medium text-gray-900">{booking.orderId}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Order Date</span>
                                                    <span className="font-medium text-gray-900">{formatDate(booking.createdAt)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Event Date</span>
                                                    <span className="font-medium text-gray-900">{formatDate(booking.eventId.startDate)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Event Type</span>
                                                    <span className="font-medium text-gray-900">{booking.eventId.eventType}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow-sm border mb-6">
                                        <div className="px-6 py-4 border-b">
                                            <h2 className="text-lg font-semibold text-gray-900">Event Details</h2>
                                        </div>
                                        <div className="px-6 py-4">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{booking.eventId.title}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div className="flex items-center text-gray-600">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    {formatDate(booking.eventId.startDate)}
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <Clock className="w-4 h-4 mr-2" />
                                                    {booking.eventId.startTime}
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <MapPin className="w-4 h-4 mr-2" />
                                                    {booking.eventId?.location?.place || 'Virtual'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow-sm border mb-6">
                                        <div className="px-6 py-4 border-b">
                                            <h2 className="text-lg font-semibold text-gray-900">Ticket Details</h2>
                                        </div>
                                        <div className="px-6 py-4">
                                            {booking.tickets.map((ticket, index) => (
                                                <div key={index} className="flex justify-between items-center py-2">
                                                    <div>
                                                        <span className="font-medium text-gray-900">{ticket.name} x {ticket.quantity}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-medium text-gray-900">
                                                            {formatCurrency(ticket.price, booking.eventId.currency)}
                                                        </span>
                                                        {ticket.quantity > 1 && (
                                                            <p className="text-sm text-gray-500">Qty: {ticket.quantity}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
                                        <div className="text-center">
                                            <QrCode className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                                            <p className="text-blue-800 mb-4">
                                                You can enter the event by scanning the QR Code given below or you can obtain the physical
                                                tickets by downloading the ticket and make a hard copy of it
                                            </p>

                                            <div className="w-32 h-32 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
                                                <div className="w-24 h-24 bg-black" style={{
                                                    backgroundImage: `url("${qrcode}")`,
                                                    backgroundSize: 'cover'
                                                }}>
                                                    {/* <div className="w-full h-full bg-gradient-to-br from-black via-gray-800 to-black opacity-90 flex items-center justify-center">
                                                        <div className="grid grid-cols-8 gap-px">
                                                            {Array.from({ length: 64 }).map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow-sm border mb-6">
                                        <div className="px-6 py-4 border-b">
                                            <h2 className="text-lg font-semibold text-gray-900">Payment Summary</h2>
                                        </div>
                                        <div className="px-6 py-4 space-y-3">
                                            {booking.tickets.map((ticket, index) => (
                                                <div key={index} className="flex justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        {ticket.quantity} × {ticket.name}
                                                    </span>
                                                    <span className="text-gray-900">
                                                        {formatCurrency(ticket.price * ticket.quantity, booking.eventId.currency)}
                                                    </span>
                                                </div>
                                            ))}

                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Processing Fee</span>
                                                <span className="text-gray-900">
                                                    {formatCurrency(5, booking.eventId.currency)}
                                                </span>
                                            </div>

                                            <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                                                <span className="text-gray-900">Total Paid</span>
                                                <span className="text-gray-900">
                                                    {formatCurrency(booking.totalAmount, booking.eventId.currency)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        {booking.eventId.eventType !== "virtual" ? (
                                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                            onClick={() => downloadTicket(id as string)}
                                        >
                                            <Download className="w-4 h-4" />
                                            Download Ticket
                                        </button>) : (
                                            <Link 
                                            to={`/meeting/${booking.eventId.id}`}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            Get Virtual Link
                                        </Link>
                                        )}
                                        <Link to="/account/tickets" className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                                            <Eye className="w-4 h-4" />
                                            View My Tickets
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">What went wrong?</h2>
                                    <p className="text-gray-600 mb-6">
                                        {'Your payment could not be processed. Please check your payment details and try again.'}
                                    </p>
                                    <div className="space-y-3">
                                        {booking?.status === "failed" && (
                                            <button
                                                onClick={() => handlePayment()}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                                            >
                                                Try Again
                                            </button>
                                        )}
                                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors">
                                            Contact Support
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    </div >
                )}
        </div>
    )
}

export default ConfirmationPage