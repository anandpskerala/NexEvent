import { useEffect, useState } from "react";
import type { GeoResult, Location, LocationModalProps } from "../../interfaces/props/locationModalProps";
import { MapPin, Navigation, Search, Star, X } from "lucide-react";
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
                                onLocationSelect(location);
                                onClose();
                            }
                        }
                    } catch (err) {
                        console.error('Error getting location details:', err);
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
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Select Location</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for your city"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        onClick={detectCurrentLocation}
                        className="flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                    >
                        <Navigation className="w-4 h-4" />
                        Detect my location
                    </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {error && (
                        <div className="p-4 text-red-600 text-sm bg-red-50">
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="p-4 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2">Searching locations...</p>
                        </div>
                    )}

                    {locations.length > 0 && (
                        <div className="p-4">
                            <h3 className="font-medium text-gray-900 mb-3">Search Results</h3>
                            <div className="space-y-2">
                                {locations.map((location, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleLocationSelect(location)}
                                        className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 cursor-pointer"
                                    >
                                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-gray-900">{location.name}</div>
                                            <div className="text-sm text-gray-500">{location.formatted}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!searchQuery && (
                        <div className="p-4">
                            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                Popular Cities
                            </h3>
                            <div className="space-y-2">
                                {popularCities.map((city, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleLocationSelect(city)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 cursor-pointer ${currentLocation?.name === city.name
                                            ? 'bg-red-50 border border-red-200'
                                            : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <MapPin className={`w-4 h-4 flex-shrink-0 ${currentLocation?.name === city.name ? 'text-red-600' : 'text-gray-400'
                                            }`} />
                                        <div>
                                            <div className={`font-medium ${currentLocation?.name === city.name ? 'text-red-600' : 'text-gray-900'
                                                }`}>
                                                {city.name}
                                            </div>
                                            <div className="text-sm text-gray-500">{city.formatted}</div>
                                        </div>
                                        {currentLocation?.name === city.name && (
                                            <div className="ml-auto text-red-600 text-sm font-medium">Selected</div>
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
