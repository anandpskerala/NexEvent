import { useSelector } from "react-redux";
import { NavBar } from "../../components/partials/NavBar"
import type { RootState } from "../../store";
import { Footer } from "../../components/partials/Footer";
import { useEffect, useMemo, useRef, useState } from "react";
import { EventCard } from "../../components/cards/EventCard";
import { EventFormSkeleton } from "../../components/skeletons/EventsFormSkeleton";
import { CategoryCard } from "../../components/cards/CategoryCard";
import type { Category } from "../../interfaces/entities/Category";
import type { AllEventData } from "../../interfaces/entities/FormState";
import { useNavigate } from "react-router-dom";
import { useUserLocation } from "../../hooks/useUserLocation";
import { getEventList, getNearbyEvents } from "../../services/eventService";
import { getCategories } from "../../services/categoryService";

const Home = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<AllEventData[]>([]);
  const [nearByEvents, setNearByEvents] = useState<AllEventData[]>([]);
  const [categories, setCatgories] = useState<Category[]>([]);
  const [search, setSearch] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { location } = useUserLocation();

  const navigate = useNavigate();

  const handleSearch = () => {
    const query = search !== "" ? `?search=${search}` : "";
    navigate(`/events/browse${query}`);
  };


  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return events;
    return events.filter(event =>
      event.category?.toLowerCase().includes(activeFilter.toLowerCase()) ||
      event.title?.toLowerCase().includes(activeFilter.toLowerCase())
    );
  }, [events, activeFilter]);


  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);

      try {
        const [eventRes, nearbyEvent, categoryRes] = await Promise.all([
          getEventList("", 1, "", 4),
          getNearbyEvents(location?.lat as number, location?.lng as number),
          getCategories("", 1, 10),
        ]);

        if (eventRes) {
          setEvents(eventRes.events);
        }

        if (nearbyEvent) {
          setNearByEvents(nearbyEvent.events);
        }

        if (categoryRes) {
          setCatgories(categoryRes.categories);
        }
      } catch (error) {
        console.error("Error fetching events or categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [location]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} section="home" />

      <div
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(139, 92, 246, 0.25) 0%, 
              rgba(59, 130, 246, 0.15) 40%, 
              rgba(255, 255, 255, 0.95) 80%
            ),
            linear-gradient(
              120deg, 
              #fdfbfb 0%, 
              #ebedee 40%, 
              #dbeafe 70%, 
              #f0f9ff 100%
            )
          `
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-gradient-to-r from-pink-300/20 to-red-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 mt-20 md:mt-15 max-w-7xl mx-auto px-6 text-center">

          <h1 className="flex flex-col md:flex-row gap-1 md:gap-5 text-3xl md:text-5xl lg:text-6xl font-black mb-8 leading-none w-full">
            <span className="block bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent">
              DISCOVER
            </span>
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent animate-gradient">
              EXCEPTIONAL
            </span>
            <span className="block bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 bg-clip-text text-transparent">
              EVENTS
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Step into a world of curated experiences that ignite your passion and create unforgettable memories
          </p>

          <div className="relative max-w-4xl mx-auto mb-12">
            <div className={`relative bg-white/80 backdrop-blur-2xl border rounded-2xl shadow-lg transition-all duration-500 ${isSearchFocused ? 'border-purple-300 shadow-2xl shadow-purple-200/50' : 'border-gray-200'
              }`}>
              <div className="flex items-center p-2">
                <div className="flex-1 flex items-center gap-4 px-4">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    placeholder="Search events, categories, or locations..."
                    className="w-full bg-transparent py-4 text-gray-900 text-lg placeholder-gray-500 focus:outline-none"
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onKeyDown={(e) => (e.key === 'Enter' && handleSearch())}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group cursor-pointer"
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">Search</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { label: "Active Events", value: `${events.length}+`, icon: "🎯" },
              { label: "Categories", value: `${categories.length}+`, icon: "🎨" },
              { label: "Happy Users", value: "50K+", icon: "❤️" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 hover:bg-white/80 hover:shadow-lg transition-all duration-300 group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-gray-50">
          <EventFormSkeleton />
        </div>
      ) : (
        <div className="bg-gray-50">
          <section className="py-24 relative">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-100 to-pink-100 backdrop-blur-sm border border-orange-200 rounded-full px-6 py-3 mb-6">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full animate-pulse"></div>
                  <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Trending Now</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                  Featured Events
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Handpicked experiences that will transform your world
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center mb-16">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 cursor-pointer ${activeFilter === "all"
                    ? 'bg-gradient-to-r from-blue-500 to-blue-900 text-white shadow-lg shadow-purple-200'
                    : 'bg-white/70 backdrop-blur-sm border-2 border-gray-300 text-gray-700 hover:bg-white/90 hover:shadow-md'
                    }`}
                >
                  All Events
                </button>
                {categories.slice(0, 4).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 cursor-pointer ${activeFilter === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-blue-900 text-white shadow-lg shadow-purple-200'
                      : 'bg-white/70 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-white/90 hover:shadow-md'
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredEvents.map((event, index) => (
                    !["ended", "cancelled"].includes(event.status as string) && (
                      <div key={index} className="group cursor-pointer">
                        <div className="transform hover:scale-105 transition-all duration-500">
                          <EventCard event={event} setEvents={setEvents} user={user} />
                        </div>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-24">
                  <div className="text-8xl mb-8 animate-bounce">🎪</div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">No events found</h3>
                  <p className="text-gray-600 text-lg">Try adjusting your filter or explore different categories</p>
                </div>
              )}
            </div>
          </section>

          {nearByEvents.length > 0 && (
            <section className="py-24 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50"></div>
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-100 to-blue-100 backdrop-blur-sm border border-emerald-200 rounded-full px-6 py-3 mb-6">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Near You</span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                    Events Nearby
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Discover amazing experiences happening right in your neighborhood
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {nearByEvents.map((event, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div className="transform hover:scale-105 transition-all duration-500">
                        <EventCard event={event} setEvents={setNearByEvents} user={user} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="py-24 relative">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 backdrop-blur-sm border border-purple-200 rounded-full px-6 py-3 mb-6">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                  <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">Explore</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                  Event Categories
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Find your passion in our carefully curated collection of experiences
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="group cursor-pointer">
                    <div className="transform hover:scale-110 transition-all duration-500 hover:rotate-3">
                      <CategoryCard category={category} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 rounded-full shadow-lg shadow-purple-200 hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group cursor-pointer"
        >
          <svg className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      <Footer />

      <style>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;