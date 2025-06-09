import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { SavedEvent } from '../../interfaces/entities/SavedEvent';
import axiosInstance from '../../utils/axiosInstance';
import { Footer } from '../../components/partials/Footer';
import Pagination from '../../components/partials/Pagination';
import { Link } from 'react-router-dom';
import { CalendarX, MapPin } from 'lucide-react';
import { EventFormSkeleton } from '../../components/skeletons/EventsFormSkeleton';
import { NavBar } from '../../components/partials/NavBar';
import { UserSidebar } from '../../components/partials/UserSidebar';
import { formatDate } from '../../utils/stringUtils';

const SavedEvents = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [events, setEvent] = useState<SavedEvent[]>([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState<boolean>(true);

    const removeSaved = async (id: string) => {
        try {
            await axiosInstance.delete(`/event/saved/${id}`);
            setEvent((prevEvents: SavedEvent[]) => prevEvents.filter(event => event.eventId.id !== id));
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const fetchRequest = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/event/all-saved?page=${page}&limit=10}`);
                if (res.data) {
                    setEvent(res.data.events);
                    setPage(res.data.page);
                    setPages(res.data.pages);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchRequest();
    }, [page]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} />
            <div className="flex justify-center items-center min-h-screen p-4 mt-1 md:mt-10">
                <div className="flex w-full gap-2 md:gap-5 overflow-hidden p-0 md:px-10 md:py-6">
                    <UserSidebar user={user} section='saved' />
                    <div className="flex-1 bg-white py-10 px-6 md:px-20 rounded-2xl shadow-lg border border-gray-200">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12">
                            <div className="flex items-center">
                                <Link to="/" className="text-blue-500 hover:text-blue-600 transition-colors text-sm md:text-md font-medium">
                                    Home
                                </Link>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-gray-700 text-sm md:text-md font-medium">Saved Events</span>
                            </div>
                        </div>
                        {
                            loading ? <EventFormSkeleton /> : (
                                events.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                        <div className="bg-gray-50 rounded-full p-6 mb-6">
                                            <CalendarX size={64} className="text-gray-400" />
                                        </div>

                                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Saved Events Found</h2>

                                        <p className="text-gray-500 max-w-md mb-8">
                                            There are no saved events for you. Try to save some events.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {events.map(event => (
                                            <div key={event.eventId.id} className="border rounded-lg overflow-hidden flex">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={event.eventId.image as string}
                                                        alt={event.eventId.title}
                                                        className="h-full w-24 object-cover"
                                                    />
                                                </div>
                                                <div className="flex-grow flex justify-between items-center p-4">
                                                    <div>
                                                        <div className="text-blue-600 text-sm font-semibold">{formatDate(event.eventId.startDate as string)}</div>
                                                        <h2 className="font-semibold text-lg">{event.eventId.title}</h2>
                                                        <div className="flex items-center text-gray-600 text-sm mt-1">
                                                            <MapPin size={14} className="mr-1" />
                                                            <span>{event.eventId?.location?.place || "Virtual"}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Link to={`/event/${event.eventId.id}`} className="text-blue-600 border border-blue-600 rounded-md px-4 py-1 text-sm hover:bg-blue-50">
                                                            View Details
                                                        </Link>
                                                        <button
                                                            className="border border-red-600 px-4 py-1 text-sm text-red-500 rounded-md cursor-pointer"
                                                            onClick={() => removeSaved(event.eventId.id as string)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )

                            )
                        }

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
            <Footer />
        </div>
    )
}

export default SavedEvents