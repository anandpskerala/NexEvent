import { useEffect, useState } from "react";
import type { GeoResult, Location, LocationModalProps } from "../../interfaces/props/locationModalProps";
import { Check, Loader2, MapPin, Navigation, Search, Star, X } from "lucide-react";
import config from "../../config/config";

export const LocationModal: React.FC<LocationModalProps> = ({
    isOpen,
    onClose,
    onLocationSelect,
    currentLocation
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isDetecting, setIsDetecting] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [popularCities, setPopularCities] = useState<Location[]>([
        {
            name: 'Mumbai',
            formatted: 'Mumbai, Maharashtra, India',
            lat: 19.0760,
            lng: 72.8777,
            components: { city: 'Mumbai', state: 'Maharashtra', country: 'India' }
        },
        {
            name: 'Delhi',
            formatted: 'Delhi, India',
            lat: 28.7041,
            lng: 77.1025,
            components: { city: 'Delhi', state: 'Delhi', country: 'India' }
        },
        {
            name: 'Bangalore',
            formatted: 'Bangalore, Karnataka, India',
            lat: 12.9716,
            lng: 77.5946,
            components: { city: 'Bangalore', state: 'Karnataka', country: 'India' }
        },
        {
            name: 'Chennai',
            formatted: 'Chennai, Tamil Nadu, India',
            lat: 13.0827,
            lng: 80.2707,
            components: { city: 'Chennai', state: 'Tamil Nadu', country: 'India' }
        },
        {
            name: 'Hyderabad',
            formatted: 'Hyderabad, Telangana, India',
            lat: 17.3850,
            lng: 78.4867,
            components: { city: 'Hyderabad', state: 'Telangana', country: 'India' }
        },
        {
            name: 'Pune',
            formatted: 'Pune, Maharashtra, India',
            lat: 18.5204,
            lng: 73.8567,
            components: { city: 'Pune', state: 'Maharashtra', country: 'India' }
        }
    ]);


    const searchLocations = async (query: string) => {
        if (!query.trim()) {
            setLocations([]);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const API_KEY = config.map.gecodeApi;
            const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${API_KEY}&limit=10&no_annotations=1&language=en`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch locations');
            }

            const data = await response.json();

            if (data.results) {
                const formattedLocations: Location[] = data.results.map((result: GeoResult) => ({
                    name: result.components.city || result.components.town || result.components.village || result.components.state || 'Unknown',
                    formatted: result.formatted,
                    lat: result.geometry.lat,
                    lng: result.geometry.lng,
                    components: {
                        city: result.components.city || result.components.town || result.components.village,
                        state: result.components.state,
                        country: result.components.country
                    }
                }));

                setLocations(formattedLocations);
            }
        } catch (err) {
            setError('Failed to search locations. Please check your API key and try again.');
            console.error('Error searching locations:', err);
        } finally {
            setLoading(false);
        }
    };

    const detectCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setIsDetecting(true);
                    setError('');

                    try {
                        const API_KEY = config.map.gecodeApi;
                        const response = await fetch(
                            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}&language=en`
                        );

                        if (response.ok) {
                            const data = await response.json();
                            if (data.results && data.results[0]) {
                                const result = data.results[0];
                                const location: Location = {
                                    name: result.components.city || result.components.town || result.components.village || 'Current Location',
                                    formatted: result.formatted,
                                    lat: result.geometry.lat,
                                    lng: result.geometry.lng,
                                    components: {
                                        city: result.components.city || result.components.town || result.components.village,
                                        state: result.components.state,
                                        country: result.components.country
                                    }
                                };
                                localStorage.setItem('user_location', JSON.stringify(location));
                                onLocationSelect(location);
                                onClose();
                            }
                        }
                    } catch (err) {
                        console.error('Error getting location details:', err);
                        setError('Unable to get current location. Please search manually.');
                    } finally {
                        setIsDetecting(false);
                    }
                },
                (error) => {
                    console.error('Error getting current location:', error);
                    setError('Unable to get current location. Please search manually.');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            searchLocations(searchQuery);
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [searchQuery]);

    useEffect(() => {
        const saved = localStorage.getItem('user_location');
        if (saved) {
            onLocationSelect(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (currentLocation) {
            setPopularCities(prev => {
                const exists = prev.some(city => city.name === currentLocation.name);
                return exists ? prev : [currentLocation, ...prev];
            });
        }
    }, [currentLocation]);


    const handleLocationSelect = (location: Location) => {
        localStorage.setItem('user_location', JSON.stringify(location));
        onLocationSelect(location);
        setSearchQuery("");
        setShowResults(false);
        onClose();
    };

    const handleClose = () => {
        setSearchQuery("");
        setShowResults(false);
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl border border-white/20 animate-in slide-in-from-bottom-4 duration-300">
                <div className="relative p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">Choose Location</h2>
                            <p className="text-blue-100 text-sm mt-1">Find your city or detect automatically</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search for your city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                        />
                    </div>

                    <button
                        onClick={detectCurrentLocation}
                        disabled={isDetecting}
                        className="flex items-center gap-3 w-full p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
                    >
                        {isDetecting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Navigation className="w-5 h-5" />
                        )}
                        <span className="font-medium">
                            {isDetecting ? 'Detecting...' : 'Use Current Location'}
                        </span>
                    </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {error && (
                        <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-in slide-in-from-top-2 duration-200">
                            <p className="text-red-600 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {loading && (
                        <div className="p-8 text-center animate-in fade-in duration-200">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">Searching locations...</p>
                        </div>
                    )}

                    {showResults && locations.length > 0 && (
                        <div className="px-6 pb-4 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                <h3 className="font-semibold text-gray-900">Search Results</h3>
                            </div>
                            <div className="space-y-2">
                                {locations.map((location, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleLocationSelect(location)}
                                        className="w-full text-left p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center gap-4 group hover:scale-[1.01] active:scale-[0.99] border border-transparent hover:border-gray-200 cursor-pointer"
                                    >
                                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {location.name}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">{location.formatted}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!showResults && (
                        <div className="px-6 pb-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <h3 className="font-semibold text-gray-900">Popular Cities</h3>
                            </div>
                            <div className="space-y-2">
                                {popularCities.map((city, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleLocationSelect(city)}
                                        className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center gap-4 group hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${currentLocation?.name === city.name
                                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md'
                                            : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg transition-colors ${currentLocation?.name === city.name
                                            ? 'bg-blue-100'
                                            : 'bg-gray-100 group-hover:bg-gray-200'
                                            }`}>
                                            <MapPin className={`w-4 h-4 ${currentLocation?.name === city.name ? 'text-blue-600' : 'text-gray-600'
                                                }`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className={`font-semibold transition-colors ${currentLocation?.name === city.name ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'
                                                }`}>
                                                {city.name}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">{city.formatted}</div>
                                        </div>
                                        {currentLocation?.name === city.name && (
                                            <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
                                                <Check className="w-4 h-4" />
                                                Selected
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
