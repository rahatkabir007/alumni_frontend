import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import ElegantCard from '@/components/common/ElegantCard'
import { formatDate } from '@/utils/dateUtils'
import React from 'react'

const EventCard = ({ event }) => {

    return (
        <ElegantCard key={event.id} className="overflow-hidden">
            <div className="relative">
                <div
                    className="h-48 bg-gradient-to-br from-purple-400 to-pink-400"
                    style={{
                        backgroundImage: `url(${event.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <BlackTag
                    className={`absolute top-4 right-4 ${event.status === 'upcoming'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 text-white'
                        }`}
                    size="xs"
                >
                    {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                </BlackTag>
                <BlackTag className="absolute top-4 left-4" size="xs">
                    {event.category}
                </BlackTag>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                    </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{event.description}</p>

                <div className="flex justify-between items-center mb-4">
                    <BlackTag variant="subtle" size="xs">{event.price}</BlackTag>
                    <span className="text-xs text-gray-500">{event.capacity}</span>
                </div>

                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Event Highlights:</h4>
                    <div className="flex flex-wrap gap-1">
                        {event.highlights.slice(0, 2).map((highlight, index) => (
                            <BlackTag key={index} variant="outline" size="xs">
                                {highlight}
                            </BlackTag>
                        ))}
                        {event.highlights.length > 2 && (
                            <BlackTag variant="subtle" size="xs">
                                +{event.highlights.length - 2} more
                            </BlackTag>
                        )}
                    </div>
                </div>

                <div className="mt-4">
                    {event.status === 'upcoming' ? (
                        <BlackButton
                            size="sm"
                            className="w-full"
                            icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            }
                        >
                            Register Now
                        </BlackButton>
                    ) : (
                        <BlackButton
                            size="sm"
                            variant="outline"
                            className="w-full"
                            icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            }
                        >
                            View Details
                        </BlackButton>
                    )}
                </div>
            </div>
        </ElegantCard>
    )
}

export default EventCard