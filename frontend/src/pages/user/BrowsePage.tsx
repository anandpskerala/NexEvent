import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { NavBar } from '../../components/partials/NavBar';
import { Calendar, CalendarX, ChevronDown, Grid, List, Search, X, SlidersHorizontal, MapPin, Clock, Tag, ArrowUpDown } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { EventCard } from '../../components/cards/EventCard';
import { EventFormSkeleton } from '../../components/skeletons/EventsFormSkeleton';
import { EventGrid } from '../../components/cards/EventGrid';
import { Footer } from '../../components/partials/Footer';
import Pagination from '../../components/partials/Pagination';
import type { Category } from '../../interfaces/entities/Category';
import type { AllEventData } from '../../interfaces/entities/FormState';
import type { BrowsePayloadData } from '../../interfaces/entities/Payload';
import { useSearchParams } from 'react-router-dom';

const eventTypeData = [
    { name: "All Types", value: "" },
    { name: "Virtual", value: "virtual" },
    { name: "In-Person", value: "offline" }
];

const eventStatusData = [
    { name: "All Events", value: "" },
    { name: "Live Now", value: "ongoing" },
    { name: "Upcoming", value: "upcoming" },
    { name: "Ended", value: "ended" },
    { name: "Cancelled", value: "cancelled" }
];

const sortByData = [
    { name: "Most Recent", value: "createdAt" },
    { name: "Event Date", value: "startDate" },
    { name: "Name (A-Z)", value: "a-z" },
    { name: "Name (Z-A)", value: "z-a" },
];

const BrowsePage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("search");
    const [loading, setLoading] = useState<boolean>(true);
    const [categories, setCatgories] = useState<Category[]>([]);
    const [payload, setPayload] = useState<BrowsePayloadData>({
        category: "",
        eventType: "",
        eventStatus: "",
        location: "",
        sortBy: "startDate"
    });
    const [tempPayload, setTempPayload] = useState<BrowsePayloadData>(payload);
    const [search, setSearch] = useState<string>(query ? query : "");
    const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
    const [events, setEvents] = useState<AllEventData[]>([]);
    const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState<string>("startDate");
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);

    const handlePayload = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.target.name === "search") {
            setSearch(e.target.value);
        } else {
            setTempPayload((prev: BrowsePayloadData) => ({
                ...prev,
                [e.target.name]: e.target.value
            }));
        }
    };

    const resetFilters = () => {
        setTempPayload({
            category: '',
            eventType: '',
            eventStatus: '',
            location: '',
            startDate: '',
            endDate: '',
            sortBy: 'createdAt'
        });
    };

    const applyFilters = () => {
        setPayload(tempPayload);
        setSortBy(tempPayload.sortBy || "createdAt");
        setIsFilterOpen(false);
        setPage(1);
    };


    useEffect(() => {
        const count = Object.entries(payload).filter(([key, value]) =>
            key !== 'sortBy' && value && value !== ''
        ).length;
        setActiveFiltersCount(count);
    }, [payload]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsFilterOpen(false);
            }
        };

        if (isFilterOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isFilterOpen]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

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
                const res = await axiosInstance.get("/admin/category");
                if (res.data) {
                    setCatgories(res.data.categories);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchCatgories();
    }, []);

    useEffect(() => {
        const fetchRequest = async () => {
            setLoading(true);
            try {
                const eventRes = await axiosInstance.get(`/event/all?search=${debouncedSearch}&category=${payload.category}&eventType=${payload.eventType}&eventStatus=${payload.eventStatus}&startDate=${payload.startDate}&endDate=${payload.endDate}&sortBy=${payload.sortBy}&page=${page}&limit=25`);
                if (eventRes.data) {
                    setEvents(eventRes.data.events);
                    setPage(Number(eventRes.data.page));
                    setPages(Number(eventRes.data.pages));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
        console.log(payload)
    }, [debouncedSearch, payload, sortBy, page]);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} section="browse" />

            <div className="flex flex-col mt-16 md:mt-22 w-full justify-center items-center">
                <div className="flex flex-col w-full md:w-7xl bg-gradient-to-br from-[#000428] via-[#002856] to-[#004E92] min-h-72 rounded-none md:rounded-3xl items-center justify-center gap-12 px-6 py-12 md:px-12 shadow-2xl">
                    <div className="relative px-4 py-16 sm:py-24 lg:py-4 max-w-7xl mx-auto text-center">
                        <h1 className="text-2xl md:text-4xl font-bold mb-6 text-white">
                            Discover Amazing Events
                        </h1>
                        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                            Find events that match your passion, connect with like-minded people, and create unforgettable memories
                        </p>

                        <div className="max-w-2xl mx-auto">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                                <div className="relative bg-white rounded-2xl p-1 shadow-2xl">
                                    <div className="flex items-center">
                                        <Search size={20} className="text-gray-400 ml-4" />
                                        <input
                                            type="text"
                                            name="search"
                                            placeholder="Search for events, topics, or locations..."
                                            value={search}
                                            onChange={handlePayload}
                                            className="flex-1 px-4 py-4 text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none text-lg"
                                        />
                                        <button
                                            onClick={() => setIsFilterOpen(true)}
                                            className="relative mr-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl transition-all duration-200 flex items-center gap-2 text-gray-700 font-medium cursor-pointer"
                                        >
                                            <SlidersHorizontal size={18} />
                                            <span className="hidden sm:inline">Filters</span>
                                            {activeFiltersCount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                    {activeFiltersCount}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {loading ? 'Loading...' : `${events.length} Events Found`}
                        </h2>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={() => {
                                    setPayload({
                                        category: "",
                                        eventType: "",
                                        eventStatus: "",
                                        location: "",
                                        sortBy: "createdAt"
                                    });
                                    setTempPayload({
                                        category: "",
                                        eventType: "",
                                        eventStatus: "",
                                        location: "",
                                        sortBy: "createdAt"
                                    });
                                    setSortBy("createdAt");
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setTempPayload(prev => ({ ...prev, sortBy: e.target.value }));
                                    setPayload(prev => ({ ...prev, sortBy: e.target.value }));
                                    setPage(1);
                                }}
                                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
                            >
                                {sortByData.map((sort) => (
                                    <option key={sort.value} value={sort.value}>
                                        {sort.name}
                                    </option>
                                ))}
                            </select>
                            <ArrowUpDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 shadow-sm p-1">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`flex items-center justify-center p-3 rounded-lg transition-all duration-200 cursor-pointer ${viewMode === 'card'
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center justify-center p-3 rounded-lg transition-all duration-200 cursor-pointer ${viewMode === 'grid'
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {events.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 mb-8">
                            <CalendarX size={80} className="text-gray-400 mx-auto" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">No Events Found</h3>
                        <p className="text-gray-500 max-w-md mb-8 text-lg">
                            We couldn't find any events matching your criteria. Try adjusting your search or filters.
                        </p>
                        <button
                            onClick={() => {
                                setSearch('');
                                resetFilters();
                                setPayload({
                                    category: "",
                                    eventType: "",
                                    eventStatus: "",
                                    location: "",
                                    sortBy: "createdAt"
                                });
                                setSortBy("createdAt");
                            }}
                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors cursor-pointer"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : loading ? (
                    <EventFormSkeleton />
                ) : (
                    <>
                        {viewMode === "card" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                {events.map((event: AllEventData) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {events.map((event: AllEventData) => (
                                    <EventGrid key={event.id} event={event} />
                                ))}
                            </div>
                        )}

                        {pages > 1 && (
                            <div className="flex justify-center mt-12">
                                <Pagination
                                    currentPage={page}
                                    totalPages={pages}
                                    onPageChange={setPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {isFilterOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsFilterOpen(false)}
                    />

                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-4xl transform transition-all duration-300 ease-out scale-100 opacity-100 max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-8 py-6 rounded-t-3xl">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                            <SlidersHorizontal className="text-blue-500" size={28} />
                                            Filter Events
                                        </h2>
                                        <p className="text-gray-500 mt-1">Refine your search to find the perfect events</p>
                                    </div>
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="text-gray-400 hover:text-gray-600 rounded-xl p-2 hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Tag size={16} className="text-blue-500" />
                                            Category
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="category"
                                                value={tempPayload.category}
                                                onChange={handlePayload}
                                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            >
                                                <option value="">All Categories</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <MapPin size={16} className="text-green-500" />
                                            Event Type
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="eventType"
                                                value={tempPayload.eventType}
                                                onChange={handlePayload}
                                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            >
                                                {eventTypeData.map((eventType) => (
                                                    <option key={eventType.value} value={eventType.value}>
                                                        {eventType.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Clock size={16} className="text-purple-500" />
                                            Event Status
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="eventStatus"
                                                value={tempPayload.eventStatus}
                                                onChange={handlePayload}
                                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            >
                                                {eventStatusData.map((eventStatus) => (
                                                    <option key={eventStatus.value} value={eventStatus.value}>
                                                        {eventStatus.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                </div>

                                <div className="mt-8 space-y-3">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Calendar size={16} className="text-indigo-500" />
                                        Date Range
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <input
                                                name="startDate"
                                                type="date"
                                                value={tempPayload.startDate}
                                                onChange={handlePayload}
                                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                                            />
                                            <span className="absolute left-4 -top-2 bg-white px-2 text-xs text-gray-500">From</span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                name="endDate"
                                                type="date"
                                                value={tempPayload.endDate}
                                                onChange={handlePayload}
                                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                                            />
                                            <span className="absolute left-4 -top-2 bg-white px-2 text-xs text-gray-500">To</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-gray-50/95 backdrop-blur-sm border-t border-gray-100 px-8 py-6 rounded-b-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
                                <button
                                    onClick={resetFilters}
                                    className="text-gray-500 hover:text-gray-700 font-medium flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                    Reset all filters
                                </button>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={applyFilters}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default BrowsePage;