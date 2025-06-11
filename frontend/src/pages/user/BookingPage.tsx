import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { NavBar } from '../../components/partials/NavBar';
import axiosInstance from '../../utils/axiosInstance';
import { TicketCard } from '../../components/cards/TicketCard';
import { EventFormSkeleton } from '../../components/skeletons/EventsFormSkeleton';
import type { AllEventData } from '../../interfaces/entities/FormState';
import config from '../../config/config';
import { AxiosError, type AxiosResponse } from 'axios';
import type { RazorpayOptions, RazorpayResponse } from '../../interfaces/entities/RazorPay';
import { toast } from 'sonner';
import type { ICoupon } from '../../interfaces/entities/Coupons';

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => {
            open: () => void;
            on(event: "payment.failed", handler: () => void): void;
        };
    }
}

const BookingPage = () => {
    const { id } = useParams();
    const { user } = useSelector((state: RootState) => state.auth);
    const [event, setEvent] = useState<AllEventData>();
    const [tickets, setTickets] = useState<{
        [ticketId: string]: {
            quantity: number;
            price: number;
            name: string;
        };
    }>({});
    const [paymentMethod, setPaymentMethod] = useState("razorpay");
    const [promoCode, setPromoCode] = useState("");
    const [promoApplied, setPromoApplied] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [couponData, setCouponData] = useState<ICoupon | null>(null);
    const [params] = useSearchParams();
    const sessionId = params.get("session_id");
    const navigate = useNavigate();
    // const hasRun = useRef(false);

    const processingFee = 5;
    const { subtotal, discount, total } = useMemo(() => {
        const subtotal = Object.values(tickets).reduce((acc, ticket) => acc + ticket.price * ticket.quantity, 0);
        const discount = couponData?.discount || 0
        const total = subtotal + (subtotal > 0 ? 5 : 0) - discount;
        return { subtotal, discount, total };
    }, [tickets, couponData?.discount]);

    const updateTicketQuantity = (
        ticketId: string,
        quantity: number,
        price: number,
        name: string
    ) => {
        setTickets(prev => ({
            ...prev,
            [ticketId]: {
                quantity,
                price,
                name,
            },
        }));
    };

    const handlePromoApply = async () => {
        try {
            const check = await axiosInstance.get(`/event/coupon/check?couponCode=${promoCode}`);
            console.log(check.data)
            const res = await axiosInstance.get(`/admin/coupon/${promoCode}`);
            if (res.data.coupon && res.data.coupon.status == "Active") {
                setCouponData(res.data.coupon);
                setPromoApplied(true);
            } else {
                toast.error("Invalid coupon")
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
        }
    };

    const handleBooking = async (
        eventId: string,
        tickets: {
            [ticketId: string]: {
                quantity: number;
                price: number;
                name: string;
            };
        },
        totalAmount: number,
        paymentMethod: string) => {
        try {
            const res = await axiosInstance.post("/event/booking", {
                eventId,
                tickets: Object.entries(tickets).map(([ticketId, ticketData]) => ({
                    ticketId,
                    quantity: ticketData.quantity,
                    price: ticketData.price,
                    name: ticketData.name
                })),
                totalAmount,
                paymentMethod,
                couponCode: promoCode
            });
            return res.data.booking
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message);
            }
            return null;
        }
    }

    const handlePayment = async (): Promise<void> => {
        try {
            if (!event) return;
            const booking = await handleBooking(event.id as string, tickets, total, paymentMethod);
            console.log(booking);
            if (paymentMethod === "razorpay") {
                const res: AxiosResponse<{
                    order: {
                        id: string;
                        amount: number;
                        currency: string;
                    };
                }> = await axiosInstance.post("/event/payment/razorpay/order", {
                    amount: total,
                    currency: event.currency || "INR",
                });

                const options: RazorpayOptions = {
                    key: config.payment.RPayKey,
                    amount: res.data.order.amount,
                    currency: res.data.order.currency,
                    name: event.title,
                    description: "Ticket Booking",
                    order_id: res.data.order.id,
                    handler: async (response: RazorpayResponse) => {
                        await axiosInstance.post("/event/payment/razorpay/verify", {
                            ...response,
                            bookingId: booking.id,
                            eventId: event.id,
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
                        eventId: event.id,
                        amount: res.data.order.amount,
                        currency: res.data.order.currency,
                        status: 'failed'
                    });
                    window.location.href = `/payment/${booking.orderId}`;
                })
                rzp.open();
            }

            else if (paymentMethod === "stripe") {
                const res: AxiosResponse<{ order: string }> = await axiosInstance.post(
                    "/event/payment/stripe/order",
                    {
                        eventId: event.id, tickets, promoCode, amount: total * 100,
                        bookingId: booking.id, currency: event.currency || "INR", orderId: booking.orderId
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

            else if (paymentMethod === "wallet") {
                const res = await axiosInstance.post(
                    "/event/payment/wallet/pay",
                    { eventId: event.id, currency: event.currency, amount: total, bookingId: booking.id }
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
        if (window.opener && sessionId) {
            window.opener.postMessage({ sessionId }, window.location.origin);
            window.close();
        }
    }, [sessionId]);

    useEffect(() => {
        const fetchRequest = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/event/event/${id}`);
                if (res.data) {
                    setEvent(res.data.event);
                }
            } catch (error) {
                setEvent(undefined);
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchRequest();
    }, [id]);

    const getCurrencySymbol = () => event?.currency === "INR" ? '₹' : '$';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} />

            <div className="max-w-7xl w-full mx-auto p-4 font-sans">
                <nav className="flex items-center space-x-2 mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-200 font-medium group">
                        <svg className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Home
                    </Link>
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <Link to="/events/browse" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
                        Events
                    </Link>
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-700 font-medium truncate">{event?.title}</span>
                </nav>

                {loading ? <EventFormSkeleton /> : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                                    <h2 className="text-2xl font-bold flex items-center">
                                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                        </svg>
                                        Select Your Tickets
                                    </h2>
                                    <p className="text-blue-100 mt-2">Choose the perfect tickets for your experience</p>
                                </div>

                                <div className="p-6 space-y-4">
                                    {(event?.tickets && event.tickets.length > 0) ? (
                                        event.tickets.map((ticket) => (
                                            <div key={ticket.id} className="transform transition-all duration-200 hover:scale-[1.02]">
                                                <TicketCard
                                                    id={ticket.id as string}
                                                    name={ticket.name}
                                                    description={ticket.description}
                                                    price={ticket.price as number || 0}
                                                    tickets={tickets[ticket?.id as string]?.quantity ?? 0}
                                                    quantity={ticket.quantity}
                                                    currency={event.currency}
                                                    onChange={updateTicketQuantity}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-gray-500">
                                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                            </svg>
                                            <p className="text-lg font-medium">No tickets available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                                        <h2 className="text-xl font-bold flex items-center">
                                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            Order Summary
                                        </h2>
                                    </div>

                                    <div className="p-6">
                                        <div className="space-y-3 mb-6">
                                            {event?.tickets?.map((ticket) => {
                                                const count = tickets[ticket.id as string]?.quantity ?? 0;
                                                return count > 0 ? (
                                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg" key={ticket.id}>
                                                        <div>
                                                            <span className="font-medium text-gray-900">{count} × {ticket.name}</span>
                                                            <div className="text-sm text-gray-500">{getCurrencySymbol()}{ticket.price} each</div>
                                                        </div>
                                                        <span className="font-semibold text-gray-900">{getCurrencySymbol()}{(ticket.price as number * count).toFixed(2)}</span>
                                                    </div>
                                                ) : null;
                                            })}
                                            {subtotal === 0 && (
                                                <div className="text-center py-6 text-gray-500">
                                                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                    <p>No tickets selected</p>
                                                </div>
                                            )}
                                        </div>

                                        {subtotal > 0 && (
                                            <div className="space-y-3 pt-4 border-t border-gray-200">
                                                <div className="flex justify-between text-gray-600">
                                                    <span>Subtotal</span>
                                                    <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-gray-600">
                                                    <span>Processing Fee</span>
                                                    <span>{getCurrencySymbol()}{processingFee.toFixed(2)}</span>
                                                </div>
                                                {promoApplied && (
                                                    <div className="flex justify-between text-green-600">
                                                        <span>Discount</span>
                                                        <span>-{getCurrencySymbol()}{discount.toFixed(2)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
                                                    <span>Total</span>
                                                    <span className="text-green-600">{getCurrencySymbol()}{total.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                    <div className="p-6">
                                        <h3 className="font-bold text-lg mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            Payment Method
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                { id: 'razorpay', label: 'RazorPay', icon: '💳', color: 'blue' },
                                                { id: 'stripe', label: 'Stripe', icon: '💰', color: 'indigo' },
                                                { id: 'wallet', label: 'Wallet', icon: '🏦', color: 'purple' }
                                            ].map((method) => (
                                                <label key={method.id} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${paymentMethod === method.id
                                                    ? `border-${method.color}-500 bg-${method.color}-50 shadow-sm`
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value={method.id}
                                                        checked={paymentMethod === method.id}
                                                        onChange={() => setPaymentMethod(method.id)}
                                                        className="sr-only"
                                                    />
                                                    <span className="text-2xl mr-3">{method.icon}</span>
                                                    <span className="font-medium text-gray-900">{method.label}</span>
                                                    {paymentMethod === method.id && (
                                                        <svg className="w-5 h-5 ml-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                    <div className="p-6">
                                        <h3 className="font-bold text-lg mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            Promo Code
                                        </h3>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder="Enter promo code"
                                                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors"
                                            />
                                            <button
                                                onClick={handlePromoApply}
                                                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 cursor-pointer"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {promoApplied && (
                                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <p className="text-green-700 text-sm font-medium">✅ Promo code applied! You saved {getCurrencySymbol()}{discount.toFixed(2)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* <Elements stripe={stripePromise}> */}
                                <button
                                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform ${subtotal > 0
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    onClick={handlePayment}
                                    disabled={subtotal === 0}
                                >
                                    {subtotal > 0 ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Pay {getCurrencySymbol()}{total.toFixed(2)} Now
                                        </span>
                                    ) : (
                                        'Select tickets to continue'
                                    )}
                                </button>
                                {/* </Elements> */}

                                <div className="text-center text-sm text-gray-500 flex items-center justify-center">
                                    <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Secure payment protected by SSL encryption
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookingPage;