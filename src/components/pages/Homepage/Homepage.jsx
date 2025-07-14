"use client"
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@/redux/features/auth/authSlice'
import HeroSlider from '@/components/pages/Homepage/HeroSlider'
import AboutSection from './AboutSection'
import StatisticsSection from './StatisticsSection'
import TestimonialsSection from './TestimonialsSection'
import AnnouncementsAndBlogsSection from './AnnouncementsAndBlogsSection'
import JoinTheAlumniSection from './JoinTheAlumniSection'

const Homepage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    // Safely get auth state only on client side
    const authState = useSelector((state) => {
        if (typeof window === 'undefined') return false
        return selectIsAuthenticated(state)
    })

    useEffect(() => {
        setIsMounted(true)
        setIsAuthenticated(authState)
    }, [authState])

    // Show loading state during SSR and initial hydration
    if (!isMounted) {
        return (
            <div className="bg-gray-50">
                {/* Static content for SSR */}
                <div className="h-[50vh] sm:h-[60vh] lg:h-[70vh] bg-gradient-to-r from-black to-gray-800 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4">CIHS Alumni Network</h1>
                        <p className="text-sm sm:text-lg lg:text-xl">Chittagong Ideal High School</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50">
            {/* Hero Slider */}
            <HeroSlider />

            {/* About School Section */}

            <AboutSection />

            {/* Statistics Section */}
            <StatisticsSection />

            {/* Testimonials Section with Slider */}
            <TestimonialsSection />

            {/* Latest Announcements & Events */}
            <AnnouncementsAndBlogsSection />

            {/* Call to Action Section */}
            <JoinTheAlumniSection isAuthenticated={isAuthenticated} />
        </div>
    )
}

export default Homepage