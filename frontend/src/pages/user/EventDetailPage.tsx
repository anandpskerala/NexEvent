import { useEffect, useMemo, useState } from 'react';
import { MapPin, Calendar, Clock, Share2, User, Heart } from 'lucide-react';
import { NavBar } from '../../components/partials/NavBar';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { EventFormSkeleton } from '../../components/skeletons/EventsFormSkeleton';
import { captialize, formatPrice } from '../../utils/stringUtils';
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';
import type { AllEventData } from '../../interfaces/entities/FormState';
import type { OrganizerData } from '../../interfaces/entities/organizer';
import type { AxiosResponse } from 'axios';
import config from '../../config/config';
import { ReviewCard } from '../../components/cards/ReviewCard';
import { LazyLoadingScreen } from '../../components/partials/LazyLoadingScreen';


const EventDetailPage = () => {
    const { id } = useParams();
    const { user } = useSelector((state: RootState) => state.auth);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState<boolean>(true);
    const [event, setEvent] = useState<AllEventData>();
    const [organizer, setOrganizer] = useState<OrganizerData>();
    const [isSaved, setSaved] = useState<boolean>(false);
    const navigate = useNavigate();

    const mapCenter = useMemo(() => {
        const lat = Number(event?.location?.coordinates[1]);
        const lng = Number(event?.location?.coordinates[0]);
        if (!isNaN(lat) && !isNaN(lng)) {
            return { lat, lng };
        }
        return { lat: 12.073057115312984, lng: 75.57390941383983 };
    }, [event]);

    const isEventNotActive = useMemo(() => {
        const now = new Date();
        const eventDate = new Date(event?.startDate as string);
        if (event?.availableTickets === 0 || now > eventDate || event?.status === "cancelled" || event?.status === "ended") {
            return true;
        }
        return false;
    }, [event]);


    const bookTicket = (id: string) => {
        navigate(`/event/bookings/${id}`);
    }

    const updateSaved = async () => {
        try {
            let res: AxiosResponse;
            if (isSaved) {
                res = await axiosInstance.delete(`/event/saved/${event?.id}`);
            } else {
                res = await axiosInstance.post(`/event/saved/${user?.id}`, { eventId: event?.id })
            }
            if (res.data) {
                setSaved(res.data.saved);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const fetchRequest = async () => {
            setLoading(true);

            try {
                const [eventRes, savedRes] = await Promise.all([
                    axiosInstance.get(`/event/event/${id}`),
                    axiosInstance.get(`/event/saved/${id}`)
                ]);

                const eventData = eventRes.data?.event;
                setEvent(eventData);
                setSaved(savedRes.data?.saved ?? false);

                if (eventData?.userId) {
                    const orgRes = await axiosInstance.get(`/user/request/${eventData.userId}`);
                    setOrganizer(orgRes.data?.request);
                }

            } catch (error) {
                console.error("Error fetching event data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchRequest();
    }, [id]);

    if (loading) return <LazyLoadingScreen />;
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} section="event" />
            <div className="max-w-5xl w-full mt-20 md:mt-25 mx-auto bg-white">

                {loading ? <EventFormSkeleton /> : (
                    <>
                        <APIProvider apiKey={config.map.apiKey}>
                            <div className="flex items-center my-5 px-5 md:px-0">
                                <Link to="/" className="text-blue-500 hover:text-blue-600 transition-colors text-sm md:text-md font-medium">
                                    Home
                                </Link>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <Link to="/events/browse" className="text-blue-500 hover:text-blue-600 transition-colors text-sm md:text-md font-medium">
                                    Events
                                </Link>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-gray-700 text-sm md:text-md font-medium">{event?.title}</span>
                            </div>
                            <div className="rounded-xl overflow-hidden shadow-md border border-gray-100 mb-6">
                                <div className="relative">
                                    <img
                                        src={event?.image as string}
                                        alt={event?.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                                        {captialize(event?.eventType ?? '')}
                                    </div>
                                    <button className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white transition-colors">
                                        <Share2 className="h-5 w-5 text-gray-700" />
                                    </button>
                                </div>

                                <div className="p-6">
                                    <div className="relative flex justify-between items-center">
                                        <h1 className="text-2xl font-bold text-gray-900 mb-4">{event?.title}</h1>
                                        <button
                                            className="absolute z-10 right-0 md:right-5 -top-1 p-2 bg-gray-300 rounded-full"
                                            onClick={() => updateSaved()}
                                        >
                                            <Heart className={`text-white ${isSaved ? 'fill-red-500' : 'fill-white/50'} hover:fill-red-500 cursor-pointer`} />
                                        </button>
                                    </div>


                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-6">
                                        <div className="space-y-3">
                                            <div className="flex items-start">
                                                <Calendar className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                                <span className="text-gray-700">{new Date(event?.startDate as string).toDateString()}</span>
                                                <span className="mx-2 text-gray-400">•</span>
                                                <Clock className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                                <span className="text-gray-700">{event?.startTime}</span>
                                            </div>

                                            <div className="flex items-start">
                                                <MapPin className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                                <span className="text-gray-700">{event?.location?.place || 'Virtual Event'}</span>
                                            </div>

                                            <div className="flex items-start">
                                                <User className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                                <span className="text-gray-700">By {organizer?.organization}</span>
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-lg">
                                            <div className="flex flex-col items-center md:items-end gap-2">
                                                <div className="flex items-center justify-between w-full gap-5">
                                                    {event?.entryType === "paid" ? (
                                                        <>
                                                            <span className="text-sm text-gray-500">Price starts from</span>
                                                            <span className="text-center md:text-start text-lg md:text-xl font-bold text-gray-900">{formatPrice(event?.currency as string, event?.entryType as string, event?.tickets ? event.tickets[0].price?.toString() : "Free")}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-center w-full md:text-start text-lg md:text-xl font-bold text-gray-900">{formatPrice(event?.currency as string, event?.entryType as string, event?.tickets ? event.tickets[0].price?.toString() : "Free")}</span>
                                                    )}

                                                </div>
                                                <button
                                                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors ${isEventNotActive ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                    disabled={isEventNotActive}
                                                    onClick={() => bookTicket(event?.id as string)}
                                                >
                                                    Book Now
                                                </button>
                                                <div className="text-sm text-gray-600 flex items-center justify-center">
                                                    <span className={`inline-block w-2 h-2 rounded-full bg-${isEventNotActive ? 'red' : 'green'}-500 mr-2`}></span>
                                                    <span className="text-sm text-gray-600">{isEventNotActive ? 'Event expired' : `${event?.availableTickets} tickets available`}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-b border-gray-200 mb-6 px-2">
                                <div className="flex space-x-8">
                                    <button
                                        onClick={() => setActiveTab('overview')}
                                        className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'overview'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 cursor-pointer'
                                            }`}
                                    >
                                        Overview
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('reviews')}
                                        className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'reviews'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 cursor-pointer'
                                            }`}
                                    >
                                        Reviews
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
                                <div className="md:col-span-2">
                                    {activeTab === 'overview' ? (
                                        <>
                                            <section className="mb-8">
                                                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Event</h2>
                                                <div className="prose text-gray-700 w-full max-w-full">
                                                    <p className="break-words">{event?.description}</p>
                                                </div>
                                            </section>

                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center py-8">
                                            <ReviewCard />
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-1">
                                    <div className="mb-8 bg-gray-200 rounded-lg shadow-md">
                                        <h3 className="text-lg font-bold text-gray-900 px-4 py-2">Organizer</h3>
                                        <div className="bg-white p-4 rounded-b-lg flex flex-col items-center">
                                            <div className="w-14 h-14 flex items-center justify-center bg-gray-200 rounded-full text-gray-500 font-bold mb-3">
                                                {typeof organizer?.userId !== "string" ? organizer?.userId.firstName.slice(0, 2).toUpperCase() : organizer?.organization?.slice(0, 2).toUpperCase()}
                                            </div>
                                            <Link to={`/profile/${typeof organizer?.userId !== "string" ? organizer?.userId.id : organizer?.userId}`} className="font-medium text-gray-900">{typeof organizer?.userId !== "string" ? organizer?.userId.firstName + " " + organizer?.userId.lastName : organizer.organization}</Link>
                                            <p className="text-sm text-gray-500 mb-4">Event Organizer</p>
                                            <Link to={`/messages?user=${typeof organizer?.userId !== "string" ? organizer?.userId.id : organizer?.userId}`} className="w-full bg-gray-900 hover:bg-black text-white py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                Contact Organizer
                                            </Link>
                                        </div>
                                    </div>

                                    {event?.eventType === "offline" && (
                                        <div className="bg-gray-100 px-4 py-2 rounded-lg shadow-md">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Venue Location</h3>
                                            <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 mb-3">
                                                <Map
                                                    defaultCenter={mapCenter}
                                                    defaultZoom={10}
                                                    gestureHandling="greedy"
                                                    disableDefaultUI={false}
                                                    clickableIcons={true}
                                                    mapTypeControl={true}
                                                    className='w-full h-[25vh]'
                                                    mapId="default"
                                                >
                                                    {event?.location && <AdvancedMarker position={mapCenter} />}
                                                </Map>
                                            </div>
                                            <div className="text-sm text-gray-700 mb-4">
                                                <p className="font-medium">{event?.location?.place}</p>
                                            </div>
                                            <button className="w-full bg-gray-800 hover:bg-black text-white py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Get Directions
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </APIProvider>
                    </>
                )}
            </div>
        </div>
    );
};

export default EventDetailPage;