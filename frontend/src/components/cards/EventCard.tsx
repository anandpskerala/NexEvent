import React from 'react';
import { Clock, Heart, MapPin } from 'lucide-react';
import { formatPrice } from '../../utils/stringUtils';
import { Link } from 'react-router-dom';
import type { EventCardProps } from '../../interfaces/props/formProps';
import type { AxiosResponse } from 'axios';
import { removeSaveEvent, saveEvent } from '../../services/eventService';

export const EventCard: React.FC<EventCardProps> = ({ event, setEvents, user }) => {
    const updateSaved = async () => {
        let res: AxiosResponse | null;
        if (event?.isSaved) {
            res = await removeSaveEvent(event.id as string);
        } else {
            res = await saveEvent(event.id as string, user?.id as string);
        }
        if (res) {
            const saved = res.data.saved as boolean;
            setEvents(prev =>
                prev.map(ev => (ev.id === event.id ? { ...ev, isSaved: saved } : ev))
            );
        }
    };

    return (
        <div className="relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 overflow-hidden w-full max-w-sm mx-auto group">
            <div
                className="absolute top-3 right-3 z-10 cursor-pointer"
            >
                <button
                    onClick={updateSaved}
                    className="bg-white/20 backdrop-blur-md rounded-full p-2.5 hover:bg-white/30 transition-all duration-200 transform hover:scale-110 cursor-pointer"
                    aria-label={event.isSaved ? "Remove from saved" : "Save event"}
                >
                    <Heart
                        className={`w-5 h-5 transition-all duration-300 ${event.isSaved
                                ? 'fill-red-500 text-red-500 scale-110'
                                : 'text-white hover:text-red-400'
                            }`}
                    />
                </button>
            </div>

            <div className="h-48 bg-gray-100">
                {event.image ? (
                    <img
                        src={event.image as string}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm p-4 text-center">
                        {event.title}
                    </div>
                )}
            </div>

            <div className="p-4 space-y-2">
                <h3
                    className="text-lg font-semibold text-gray-900 truncate"
                    title={event.title}
                >
                    {event.title}
                </h3>

                <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="truncate">
                        {event.location?.place || 'Virtual'}
                    </span>
                </div>

                <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                        {new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        }).format(new Date(event.startDate as string))}
                    </span>
                </div>

                <div className="flex justify-between items-center pt-4">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                        {formatPrice(
                            event.currency,
                            event.entryType,
                            event.tickets?.[0]?.price?.toString() || 'Free'
                        )}
                    </span>
                    <Link
                        to={`/event/${event.id}`}
                        className="px-4 py-1.5 text-sm rounded-lg font-medium bg-gradient-to-r from-blue-500 to-blue-800 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    );
};
