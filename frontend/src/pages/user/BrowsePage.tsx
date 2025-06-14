import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { NavBar } from '../../components/partials/NavBar';
import { Calendar, CalendarX, ChevronDown, Filter, Grid, List, Search, X } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { EventCard } from '../../components/cards/EventCard';
import { EventFormSkeleton } from '../../components/skeletons/EventsFormSkeleton';
import { EventGrid } from '../../components/cards/EventGrid';
import { Footer } from '../../components/partials/Footer';
import Pagination from '../../components/partials/Pagination';
import type { Category } from '../../interfaces/entities/category';
import type { AllEventData } from '../../interfaces/entities/FormState';
import type { BrowsePayloadData } from '../../interfaces/entities/Payload';
import { useSearchParams } from 'react-router-dom';

const BrowsePage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("search");
    const [loading, setLoading] = useState<boolean>(true);
    const [categories, setCatgories] = useState<Category[]>([]);
    const [payload, setPayload] = useState<BrowsePayloadData>({
        category: "",
        location: "",
    });
    const [tempPayload, setTempPayload] = useState<BrowsePayloadData>(payload);
    const [search, setSearch] = useState<string>(query ? query : "");
    const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
    const [events, setEvents] = useState<AllEventData[]>([]);
    const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');
    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const handlePayload = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.target.name === "search") {
            setSearch(e.target.value);
        } else {
            setTempPayload((prev: BrowsePayloadData) => (
                {
                    ...prev,
                    [e.target.name]: e.target.value
                }
            ))
        }
    }


    const resetFilters = () => {
        setTempPayload({
            category: '',
            location: '',
            startDate: '',
            endDate: ''
        });
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    useEffect(() => {
        const newParams = new URLSearchParams(searchParams);
        if (search === "") {
            newParams.delete("search");
        } else {
            newParams.set("search", search);
        }

        Object.entries(payload).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
        });
        setSearchParams(newParams);
    }, [search, payload, searchParams, setSearchParams]);

    useEffect(() => {
        const fetchCatgories = async () => {
            try {
                const res = await axiosInstance.get("/admin/categories");
                if (res.data) {
                    setCatgories(res.data.categories);
                }
            } catch (error) {
                console.error(error)
            }
        } 

        fetchCatgories();
    }, [])

    useEffect(() => {
        const fetchRequest = async () => {
            setLoading(true);
            try {
                const eventRes = await axiosInstance.get(`/event/all?search=${debouncedSearch}&category=${payload.category}&startDate=${payload.startDate}&endDate=${payload.endDate}&page=${page}&limit=15`);
                if (eventRes.data) {
                    setEvents(eventRes.data.events);
                    setPage(Number(eventRes.data.page));
                    setPages(Number(eventRes.data.pages));
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        }

        fetchRequest();
    }, [debouncedSearch, payload, page])

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} section="browse" />

            <div className="flex flex-col mt-15 px-4 py-12 w-full justify-center items-center">
                <h1 className="text-xl md:text-3xl font-bold text-center mb-2">Browse Events</h1>
                <p className="text-center text-sm md:text-lg text-gray-500 mb-6">
                    Find the perfect event that matches your interests and preferences
                </p>

                <div className="mb-6 flex flex-col sm:flex-row gap-4 w-full max-w-6xl">
                    <div className="relative flex-grow">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            name="search"
                            placeholder="Search events..."
                            value={search}
                            onChange={handlePayload}
                            className="pl-10 pr-4 py-2.5 border border-gray-400 shadow rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex gap-2 justify-between">
                        <button
                            className="flex items-center gap-1 px-3 py-2.5 border border-gray-300 shadow cursor-pointer rounded-lg bg-white hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(true)}
                        >
                            <Filter size={16} />
                            <span className="hidden sm:inline">Filters</span>
                        </button>

                        <div className="flex rounded-lg overflow-hidden border border-gray-300 shadow">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`flex items-center justify-center p-2.5 ${viewMode === 'card' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'} cursor-pointer`}
                            >
                                <Grid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center justify-center p-2.5 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'} cursor-pointer`}
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div
                            className="fixed inset-0 bg-black/80 bg-opacity-50 transition-opacity duration-300"
                            onClick={() => setIsOpen(false)}
                        ></div>

                        <div className="flex items-center justify-center min-h-screen p-4">
                            <div
                                className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-3xl p-0 transform transition-all duration-300 ease-out"
                                style={{
                                    opacity: 1,
                                    transform: 'scale(1)',
                                    animation: 'modalFadeIn 0.3s ease-out'
                                }}
                            >
                                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-xl font-semibold text-gray-800">Filter Events</h2>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={resetFilters}
                                            className="text-blue-500 hover:text-gray-700 text-sm font-medium cursor-pointer"
                                        >
                                            Reset all filters
                                        </button>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="text-gray-500 hover:text-gray-700 rounded-md p-1 transition-colors cursor-pointer"
                                        >
                                            <X size={20} className='text-red-500' />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex flex-col w-full gap-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex flex-col col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                                                <div className="relative">
                                                    <select
                                                        name="category"
                                                        value={tempPayload.category}
                                                        className="w-full bg-gray-50 border border-gray-400 rounded-lg py-2.5 px-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        onChange={handlePayload}
                                                    >
                                                        <option value="">All Categories</option>
                                                        {categories.map((category) => (
                                                            <option key={category.id} value={category.id}>{category.name}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown
                                                        size={16}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                                                    />
                                                </div>
                                            </div>

                                            {/* <div className="flex flex-col">
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                                                <div className="relative">
                                                    <select
                                                        name="location"
                                                        value={payload.location}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        onChange={handlePayload}
                                                    >
                                                        <option value="">All Locations</option>
                                                    </select>
                                                    <ChevronDown
                                                        size={16}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                                                    />
                                                </div>
                                            </div> */}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date Range</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                        <Calendar size={16} />
                                                    </div>
                                                    <input
                                                        name="startDate"
                                                        type="date"
                                                        value={tempPayload.startDate}
                                                        placeholder="Start date"
                                                        className="w-full bg-gray-50 border border-gray-400 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                                                        onChange={handlePayload}
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                        <Calendar size={16} />
                                                    </div>
                                                    <input
                                                        name="endDate"
                                                        type="date"
                                                        value={tempPayload.endDate}
                                                        placeholder="End date"
                                                        className="w-full bg-gray-50 border border-gray-400 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                                                        onChange={handlePayload}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 border-2 border-red-500 rounded-lg text-red-600 font-medium hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={() => {
                                            setPayload(tempPayload);
                                            setIsOpen(false);
                                        }}
                                        className="px-4 py-2 border-2 border-blue-500 rounded-lg text-blue-600 font-medium hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="bg-gray-50 rounded-full p-6 mb-6">
                            <CalendarX size={64} className="text-gray-400" />
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Events Found</h2>

                        <p className="text-gray-500 max-w-md mb-8">
                            There are no events related to your search. Search for a different event.
                        </p>
                    </div>
                ) : (
                    loading ? <EventFormSkeleton /> : (
                        <div className="p-6 max-w-7xl mx-auto w-full">
                            {viewMode === "card" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    {events.map((event: AllEventData) => (
                                        <EventCard key={event.id} event={event} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    {
                                        events.map((event: AllEventData) => (
                                            <EventGrid key={event.id} event={event} />
                                        ))
                                    }
                                </div>
                            )}

                        </div>
                    )
                )}

                <div className="flex justify-center mt-6">
                    <Pagination
                        currentPage={page}
                        totalPages={pages}
                        onPageChange={setPage}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BrowsePage;