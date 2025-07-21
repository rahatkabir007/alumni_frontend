"use client"
import React from 'react'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@/redux/features/auth/authSlice'
import HeroSlider from '@/components/pages/Homepage/HeroSlider'
import StatisticsSection from '@/components/common/StatisticsSection'
import AboutSection from './AboutSection'
import TestimonialsSection from './TestimonialsSection'
import AnnouncementsAndBlogsSection from './AnnouncementsAndBlogsSection'
import JoinTheAlumniSection from './JoinTheAlumniSection'
import { statistics } from '@/datas/homepage'

const Homepage = () => {
    // Simply use the auth state from Redux - no local state needed
    const isAuthenticated = useSelector(selectIsAuthenticated)

    return (
        <div className="bg-gray-50">
            {/* Hero Slider */}
            <HeroSlider />

            {/* About School Section */}
            <AboutSection />

            {/* Statistics Section */}
            <StatisticsSection statistics={statistics} />

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