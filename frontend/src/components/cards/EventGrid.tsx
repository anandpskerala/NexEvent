import React from 'react'
import { Calendar, MapPin } from 'lucide-react'
import { captialize } from '../../utils/stringUtils'
import { Link } from 'react-router-dom'
import type { EventCardProps } from '../../interfaces/props/formProps'



export const EventGrid: React.FC<EventCardProps> = ({ event }) => {
    return (
        <Link to={`/event/${event.id}`} className={`flex p-4 hover:bg-gray-50 border border-gray-500 rounded-md`}>
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                    src={event.image as string || "/api/placeholder/100/100"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="ml-4 flex-grow">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {captialize(event.eventType)}
                    </span>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center text-gray-600 text-sm mt-1">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="mr-1" />
                        <span className="mr-4">{new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        }).format(new Date(event.startDate as string))}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{event.location?.place || "Virtual"}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}