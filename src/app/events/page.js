"use client"
import React, { useState } from 'react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'

const EventsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')

    const events = [
        {
            id: 1,
            title: 'Annual Alumni Reunion 2024',
            date: 'December 15, 2024',
            time: '10:00 AM - 6:00 PM',
            location: 'CIHS Campus, Chittagong',
            category: 'Reunion',
            status: 'upcoming',
            description: 'Join us for the biggest alumni gathering of the year! Reconnect with old friends, meet teachers, and celebrate our shared memories.',
            image: '/images/events/reunion-2024.jpg',
            organizer: 'CIHS Alumni Association',
            capacity: '500 attendees',
            price: 'Free',
            highlights: ['Welcome Reception', 'Campus Tour', 'Cultural Program', 'Dinner & Dance']
        },
        {
            id: 2,
            title: 'Career Guidance Seminar',
            date: 'January 20, 2025',
            time: '2:00 PM - 5:00 PM',
            location: 'CIHS Auditorium',
            category: 'Educational',
            status: 'upcoming',
            description: 'A seminar focused on career guidance for current students, featuring successful alumni speakers from various industries.',
            image: '/images/events/career-seminar.jpg',
            organizer: 'Career Development Committee',
            capacity: '200 attendees',
            price: 'Free',
            highlights: ['Industry Expert Talks', 'Q&A Session', 'Networking', 'Career Resources']
        },
        {
            id: 3,
            title: 'CIHS Foundation Day Celebration',
            date: 'March 15, 2025',
            time: '9:00 AM - 4:00 PM',
            location: 'CIHS Campus',
            category: 'Celebration',
            status: 'upcoming',
            description: 'Celebrating 60 years of educational excellence at CIHS. Join us for a day of festivities, achievements showcase, and community spirit.',
            image: '/images/events/foundation-day.jpg',
            organizer: 'CIHS Administration',
            capacity: '1000 attendees',
            price: 'Free',
            highlights: ['Award Ceremony', 'Cultural Performance', 'Exhibition', 'Alumni Recognition']
        },
        {
            id: 4,
            title: 'Tech Talk: Innovation in Education',
            date: 'November 10, 2024',
            time: '3:00 PM - 5:00 PM',
            location: 'Virtual Event (Zoom)',
            category: 'Educational',
            status: 'completed',
            description: 'A virtual discussion on how technology is transforming education, featuring CIHS alumni working in the tech industry.',
            image: '/images/events/tech-talk.jpg',
            organizer: 'Tech Alumni Network',
            capacity: '100 attendees',
            price: 'Free',
            highlights: ['Expert Panel', 'Tech Demos', 'Future Trends', 'Networking Session']
        },
        {
            id: 5,
            title: 'Sports Day & Family Picnic',
            date: 'February 25, 2025',
            time: '8:00 AM - 6:00 PM',
            location: 'CIHS Sports Ground',
            category: 'Recreation',
            status: 'upcoming',
            description: 'A fun-filled day of sports activities and family picnic for alumni and their families. Bring your loved ones for a day of joy and recreation.',
            image: '/images/events/sports-picnic.jpg',
            organizer: 'Alumni Recreation Committee',
            capacity: '300 families',
            price: 'BDT 500 per family',
            highlights: ['Sports Competitions', 'Kids Activities', 'Food Stalls', 'Prize Distribution']
        },
        {
            id: 6,
            title: 'Scholarship Fundraising Gala',
            date: 'May 20, 2025',
            time: '7:00 PM - 11:00 PM',
            location: 'Grand Ballroom, Chittagong',
            category: 'Fundraising',
            status: 'upcoming',
            description: 'An elegant evening dedicated to raising funds for student scholarships. Join us for dinner, entertainment, and meaningful contributions.',
            image: '/images/events/fundraising-gala.jpg',
            organizer: 'CIHS Development Office',
            capacity: '150 attendees',
            price: 'BDT 2000 per person',
            highlights: ['Formal Dinner', 'Live Entertainment', 'Auction', 'Award Presentations']
        }
    ]

    const categories = ['all', 'Reunion', 'Educational', 'Celebration', 'Recreation', 'Fundraising']
    const statuses = ['all', 'upcoming', 'completed']

    const filteredEvents = events.filter(event =>
        (selectedCategory === 'all' || event.category === selectedCategory) &&
        (selectedStatus === 'all' || event.status === selectedStatus)
    )

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <BlackTag className="mb-4 bg-white text-black">Events</BlackTag>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Alumni Events & Activities
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto text-gray-300">
                            Stay connected with the CIHS community through our exciting events. From reunions to professional development,
                            there&apos;s always something happening in our alumni network.
                        </p>
                    </div>
                </section>
            </ScrollReveal>

            {/* Filters */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-8 bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">Category:</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="border-2 border-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category === 'all' ? 'All Categories' : category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">Status:</label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="border-2 border-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    {statuses.map(status => (
                                        <option key={status} value={status}>
                                            {status === 'all' ? 'All Events' : status === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <BlackTag size="sm">
                                {filteredEvents.length} events
                            </BlackTag>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Events Grid */}
            <ScrollReveal direction="up" delay={0.4}>
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.map((event) => (
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
                            ))}
                        </StaggerContainer>
                    </div>
                </section>
            </ScrollReveal>

            {/* Organize Event CTA */}
            <ScrollReveal direction="up" delay={0.5}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Want to Organize an Event?
                        </h2>
                        <p className="text-lg text-gray-300 mb-8">
                            Have an idea for an alumni event? We&apos;d love to help you bring the community together.
                            Contact our events team to discuss your proposal.
                        </p>
                        <BlackButton
                            size="lg"
                            className="bg-white text-black hover:bg-gray-200"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            }
                        >
                            Propose an Event
                        </BlackButton>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default EventsPage
