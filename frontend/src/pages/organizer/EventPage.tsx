import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { OrganizerSideBar } from '../../components/partials/OrganizerSidebar';
import { AdminNavbar } from '../../components/partials/AdminNavbar';
import { Calendar, PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { EventFormSkeleton } from '../../components/skeletons/EventsFormSkeleton';
import Pagination from '../../components/partials/Pagination';
import type { AllEventData } from '../../interfaces/entities/FormState';
import { OrganizerEventCard } from '../../components/cards/OrganizerEventCards';


const EmptyState = () => (
    <div className="flex flex-col w-full h-3/4 items-center justify-center p-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <Calendar className="w-12 h-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
        <p className="text-sm text-gray-500 mb-4">No events have been created yet.</p>
        <Link to="/organizer/create-event" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors">
            Create New Event
        </Link>
    </div>
);

const EventPage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [sidebarCollapsed, setSidebarCollapse] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [events, setEvents] = useState<AllEventData[]>([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>(search);

    const toggleSidebar = () => {
        setSidebarCollapse(!sidebarCollapsed);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    const fetchRequest = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/event/events?search=${debouncedSearch}&page=${page}&userId=${user?.id}&limit=10`);
            if (res.data) {
                setEvents(res.data.events);
                setPage(Number(res.data.page));
                setPages(Number(res.data.pages));
            }
            console.log(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, user?.id]);

    useEffect(() => {
        fetchRequest();
    }, [fetchRequest, page, debouncedSearch]);

    return (
        <div className="flex h-screen bg-gray-50">
            <OrganizerSideBar sidebarCollapsed={sidebarCollapsed} section='events' />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <AdminNavbar title='Events' user={user} toggleSidebar={toggleSidebar} />
                    <div className="flex flex-col md:flex-row justify-between mb-6 mt-10 gap-4 px-2">
                        <div className="relative">
                            <input
                                id="search"
                                type="text"
                                placeholder="Search users by event"
                                className="w-full md:w-80 pl-3 pr-10 py-2 border rounded-md"
                                onChange={handleSearch}
                            />
                            <button className="absolute right-0 top-0 h-full px-3 text-white bg-blue-600 rounded-r-md">
                                <Search size={20} />
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <Link to="/organizer/create-event" className="px-4 py-2 rounded-md flex items-center font-bold gap-2 justify-center bg-indigo-600 hover:bg-indigo-700 text-white">
                                <PlusCircle size={16} />
                                <span>Create Event</span>
                            </Link>
                        </div>
                    </div>

                    <div className="flex gap-5 flex-wrap">
                        {
                            loading ? (
                                <EventFormSkeleton />
                            ) : (
                                <>
                                    {events.length === 0 ? (
                                        <EmptyState />
                                    ) : (
                                        events.map((event) => (
                                            <OrganizerEventCard key={event.id} event={event} />
                                        ))
                                    )}
                                </>
                            )
                        }
                    </div>
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
    )
}

export default EventPage;