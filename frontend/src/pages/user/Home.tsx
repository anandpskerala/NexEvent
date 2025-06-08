import { useSelector } from "react-redux";
import { NavBar } from "../../components/partials/NavBar"
import type { RootState } from "../../store";
import { Footer } from "../../components/partials/Footer";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { EventCard } from "../../components/cards/EventCard";
import { EventFormSkeleton } from "../../components/skeletons/EventsFormSkeleton";
import { CategoryCard } from "../../components/cards/CategoryCard";
import type { Category } from "../../interfaces/entities/category";
import type { AllEventData } from "../../interfaces/entities/FormState";
import { Link, useNavigate } from "react-router-dom";


const Home = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<AllEventData[]>([]);
  const [categories, setCatgories] = useState<Category[]>([]);
  const [search, setSearch] = useState<string>("");

  const navigate = useNavigate();


  const handleSearch = () => {
    const query = search !== ""? `?search=${search}`: "";
    navigate(`/events/browse${query}`);
  }

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await axiosInstance.get(`/event/all?limit=5`);
        if (res.data) {
          setEvents(res.data.events);
        }

        const catRes = await axiosInstance.get("/admin/categories?limit=5");
        if (catRes.data) {
          setCatgories(catRes.data.categories);
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} section="home" />

      <div className="flex flex-col mt-16 md:mt-22 w-full justify-center items-center">
        <div className="flex flex-col w-full md:w-7xl bg-gradient-to-br from-[#000428] via-[#002856] to-[#004E92] min-h-72 rounded-none md:rounded-3xl items-center justify-center gap-12 px-6 py-12 md:px-12 shadow-2xl">
          <div className="flex flex-col gap-4 justify-center items-center text-center max-w-3xl">
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Discover Exceptional
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300"> Events</span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl leading-relaxed opacity-90">
              Explore curated experiences that match your interests and create unforgettable memories
            </p>
          </div>

          <div className="relative w-full max-w-3xl mx-auto">
            <div className="relative flex items-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <input
                type="text"
                value={search}
                placeholder="Search events, categories, or locations..."
                className="w-full bg-transparent py-4 px-6 pr-32 rounded-2xl text-gray-800 text-lg placeholder-gray-500 focus:outline-none focus:ring-0"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => (e.key == 'Enter' && handleSearch())}
              />
              <button 
                className="absolute right-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <EventFormSkeleton />
        ) : (
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
            <section className="py-16">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full"></div>
                    <span className="text-orange-600 font-semibold text-xs uppercase tracking-wider">Trending Now</span>
                  </div>
                  <h2 className="text-xl md:text-3xl font-black text-gray-900 mb-2">
                    Featured Events
                  </h2>
                  <p className="text-gray-600 text-md">Hand-picked experiences just for you</p>
                </div>
                <Link to="/events/browse" className="hidden md:flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold group cursor-pointer">
                  View All
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {events.map((event, index) => (
                  <div key={index} className="group cursor-pointer">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </section>

            <section className="py-10 bg-gradient-to-br from-gray-50 to-blue-50/50 -mx-4 md:-mx-6 px-4 md:px-6 rounded-3xl shadow">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                    <span className="text-green-600 font-semibold text-xs uppercase tracking-wider">Explore</span>
                  </div>
                  <h2 className="text-xl md:text-3xl font-black text-gray-900 mb-2">
                    Event Categories
                  </h2>
                  <p className="text-gray-600 text-md">Find your perfect match from our diverse collection</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      <Footer />
    </div >
  )
}

export default Home;