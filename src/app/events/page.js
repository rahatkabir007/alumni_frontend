"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'

const EventsPage = () => {
    const router = useRouter()
    const [selectedType, setSelectedType] = useState('all')

    // Mock events data
    const events = [
        {
            id: 1,
            title: 'Annual Alumni Reunion 2024',
            description: 'Join us for the biggest alumni gathering of the year at CIHS campus. Reconnect with old friends, meet new ones, and celebrate our shared heritage.',
            date: '2024-12-15',
            time: '10:00 AM - 8:00 PM',
            location: 'CIHS Main Campus, Chittagong',
            type: 'Reunion',
            status: 'upcoming',
            image: '/images/events/reunion-2024.jpg',
            attendees: 250,
            maxAttendees: 300,
            featured: true,
            organizer: 'CIHS Alumni Association',
            highlights: [
                'Welcome Reception',
                'Alumni Achievement Awards',
                'Cultural Program',
                'Networking Dinner',
                'Campus Tour'
            ]
        },
        {
            id: 2,
            title: 'Career Guidance Workshop',
            description: 'Interactive workshop for current students featuring successful CIHS alumni sharing career insights and opportunities.',
            date: '2024-11-30',
            time: '2:00 PM - 5:00 PM',
            location: 'CIHS Auditorium',
            type: 'Workshop',
            status: 'upcoming',
            image: '/images/events/career-workshop.jpg',
            attendees: 85,
            maxAttendees: 100,
            featured: false,
            organizer: 'Career Development Committee',
            highlights: [
                'Industry Expert Panels',
                'CV Review Sessions',
                'Mock Interviews',
                'Networking Opportunities'
            ]
        },
        {
            id: 3,
            title: 'CIHS Science Fair Alumni Judging',
            description: 'Alumni experts invited to judge and mentor students in the annual science fair, sharing expertise across various fields.',
            date: '2024-11-25',
            time: '9:00 AM - 4:00 PM',
            location: 'CIHS Science Laboratories',
            type: 'Academic',
            status: 'upcoming',
            image: '/images/events/science-fair.jpg',
            attendees: 25,
            maxAttendees: 30,
            featured: false,
            organizer: 'Science Department',
            highlights: [
                'Project Evaluation',
                'Student Mentoring',
                'Awards Ceremony',
                'Alumni-Student Interaction'
            ]
        },
        {
            id: 4,
            title: 'Golden Jubilee Celebration',
            description: 'Celebrating 60 years of CIHS excellence with a grand ceremony honoring the school\'s legacy and achievements.',
            date: '2024-10-15',
            time: '6:00 PM - 10:00 PM',
            location: 'Chittagong Convention Center',
            type: 'Celebration',
            status: 'completed',
            image: '/images/events/golden-jubilee.jpg',
            attendees: 500,
            maxAttendees: 500,
            featured: true,
            organizer: 'CIHS Administration',
            highlights: [
                'Historical Presentation',
                'Alumni Recognition',
                'Cultural Performances',
                'Documentary Screening'
            ]
        },
        {
            id: 5,
            title: 'Alumni Scholarship Fund Gala',
            description: 'Fundraising gala to support the CIHS scholarship program, helping deserving students pursue their educational dreams.',
            date: '2025-01-20',
            time: '7:00 PM - 11:00 PM',
            location: 'Chittagong Club',
            type: 'Fundraising',
            status: 'upcoming',
            image: '/images/events/scholarship-gala.jpg',
            attendees: 120,
            maxAttendees: 150,
            featured: true,
            organizer: 'Scholarship Committee',
            highlights: [
                'Dinner & Entertainment',
                'Silent Auction',
                'Scholarship Presentations',
                'Alumni Testimonials'
            ]
        },
        {
            id: 6,
            title: 'Tech Innovation Summit',
            description: 'Alumni working in technology share latest trends, innovations, and opportunities in the digital world.',
            date: '2025-02-10',
            time: '1:00 PM - 6:00 PM',
            location: 'Virtual Event (Zoom)',
            type: 'Conference',
            status: 'upcoming',
            image: '/images/events/tech-summit.jpg',
            attendees: 180,
            maxAttendees: 200,
            featured: false,
            organizer: 'Tech Alumni Network',
            highlights: [
                'Keynote Presentations',
                'Panel Discussions',
                'Startup Showcase',
                'Networking Sessions'
            ]
        }
    ]

    const eventTypes = ['all', 'Reunion', 'Workshop', 'Academic', 'Celebration', 'Fundraising', 'Conference']

    const filteredEvents = events.filter(event =>
        selectedType === 'all' || event.type === selectedType
    )

    const upcomingEvents = filteredEvents.filter(event => event.status === 'upcoming')
    const pastEvents = filteredEvents.filter(event => event.status === 'completed')

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
                            Stay connected with the CIHS community through our exciting events, workshops, and celebrations.
                            Join us as we continue to build lasting relationships and support our alma mater.
                        </p>
                    </div>
                </section>
            </ScrollReveal>

            {/* Event Type Filter */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-8 bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-2 items-center justify-center">
                            {eventTypes.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedType === type
                                            ? 'bg-black text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {type === 'all' ? 'All Events' : type}
                                </button>
                            ))}

                            <BlackTag size="sm" className="ml-4">
                                {filteredEvents.length} events
                            </BlackTag>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
                <ScrollReveal direction="up" delay={0.4}>
                    <section className="py-12 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center gap-4 mb-8">
                                <BlackTag>Upcoming</BlackTag>
                                <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
                            </div>

                            <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {upcomingEvents.map((event) => (
                                    <ElegantCard key={event.id} className="overflow-hidden">
                                        <div className="relative">
                                            <div
                                                className="h-48 bg-gradient-to-br from-blue-400 to-green-400"
                                                style={{
                                                    backgroundImage: `url(${event.image})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            />
                                            <BlackTag className="absolute top-4 right-4" size="xs">
                                                {event.type}
                                            </BlackTag>
                                            {event.featured && (
                                                <BlackTag className="absolute top-4 left-4 bg-yellow-500 text-black" size="xs">
                                                    Featured
                                                </BlackTag>
                                            )}
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {event.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {event.description}
                                            </p>

                                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {formatDate(event.date)}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {event.time}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {event.location}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-medium">{event.attendees}</span> / {event.maxAttendees} attending
                                                </div>
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <BlackButton size="sm" className="w-full">
                                                Register Now
                                            </BlackButton>
                                        </div>
                                    </ElegantCard>
                                ))}
                            </StaggerContainer>
                        </div>
                    </section>
                </ScrollReveal>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
                <ScrollReveal direction="up" delay={0.5}>
                    <section className="py-12">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center gap-4 mb-8">
                                <BlackTag variant="subtle">Past Events</BlackTag>
                                <h2 className="text-2xl font-bold text-gray-900">Past Events</h2>
                            </div>

                            <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {pastEvents.map((event) => (
                                    <ElegantCard key={event.id} className="overflow-hidden opacity-75">
                                        <div className="relative">
                                            <div
                                                className="h-48 bg-gradient-to-br from-gray-400 to-gray-600"
                                                style={{
                                                    backgroundImage: `url(${event.image})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            />
                                            <BlackTag className="absolute top-4 right-4" size="xs">
                                                {event.type}
                                            </BlackTag>
                                            <BlackTag className="absolute top-4 left-4 bg-gray-600 text-white" size="xs">
                                                Completed
                                            </BlackTag>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {event.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {event.description}
                                            </p>

                                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {formatDate(event.date)}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    {event.attendees} attended
                                                </div>
                                            </div>

                                            <BlackButton size="sm" variant="outline" className="w-full">
                                                View Highlights
                                            </BlackButton>
                                        </div>
                                    </ElegantCard>
                                ))}
                            </StaggerContainer>
                        </div>
                    </section>
                </ScrollReveal>
            )}

            {/* CTA Section */}
            <ScrollReveal direction="up" delay={0.6}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Want to Organize an Event?
                        </h2>
                        <p className="text-lg text-gray-300 mb-8">
                            Have an idea for an alumni event? We'd love to hear from you and help make it happen.
                        </p>
                        <BlackButton
                            onClick={() => router.push('/contact')}
                            size="lg"
                            className="bg-white text-black hover:bg-gray-200"
                        >
                            Contact Event Committee
                        </BlackButton>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default EventsPage
