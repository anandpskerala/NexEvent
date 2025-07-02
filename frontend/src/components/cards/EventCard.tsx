import React from 'react'
import { Clock, Heart, MapPin } from 'lucide-react'
import { formatPrice } from '../../utils/stringUtils'
import { Link } from 'react-router-dom'
import type { EventCardProps } from '../../interfaces/props/formProps'

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
    return (
        <div className="bg-white rounded-lg shadow-md h-full overflow-hidden relative w-full md:max-w-sm mx-auto">

            <div className="absolute top-2 right-2">
                <Heart className={`${event.isSaved ? 'fill-red-500': 'fill-white/50'} text-white hover:fill-red-500 cursor-pointer`} />
            </div>

            <div className="h-26 bg-gray-200 flex items-center justify-center">
                {event.image ? (
                    <img src={event.image as string} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-gray-500">{event.title}</div>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-md font-semibold mb-2 truncate" title={event.title}>{event.title}</h3>

                <div className="space-y-2">
                    <div className="flex items-center text-gray-600 overflow-hidden">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm truncate">
                            {event.location?.place || "Virtual"}
                        </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">
                            {new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            }).format(new Date(event.startDate as string))}
                        </span>
                    </div>
                </div>


                <div className="mt-5 flex justify-between items-center">
                    <span className="text-sm font-bold">{formatPrice(event.currency, event.entryType, event.tickets ? event.tickets[0].price?.toString() : "Free")}</span>
                    <Link to={`/event/${event.id}`} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition">
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    )
}