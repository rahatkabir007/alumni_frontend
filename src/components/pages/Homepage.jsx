"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@/redux/features/auth/authSlice'
import { motion } from 'framer-motion'
import Image from 'next/image'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import AnimatedCard from '@/components/animations/AnimatedCard'
import CountUp from '@/components/animations/CountUp'
import FloatingElements from '@/components/animations/FloatingElements'
import HeroSlider from '@/components/HeroSlider'
import TestimonialSlider from '@/components/TestimonialSlider'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'
import Link from 'next/link'

const Homepage = () => {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    // Safely get auth state only on client side
    const authState = useSelector((state) => {
        if (typeof window === 'undefined') return false
        return selectIsAuthenticated(state)
    })

    useEffect(() => {
        setIsMounted(true)
        setIsAuthenticated(authState)
        const timer = setTimeout(() => {
            setIsInitialized(true)
        }, 100)
        return () => clearTimeout(timer)
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

            {/* School Brief Section */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-8 sm:py-12 lg:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            <ScrollReveal direction="left" delay={0.3}>
                                <div className="order-2 lg:order-1">
                                    <BlackTag className="mb-3 sm:mb-4">Established 1998</BlackTag>
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                                        About Chittagong Ideal High School
                                    </h2>
                                    <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                                        Established in 1998, Chittagong Ideal High School (CIHS) has been a beacon of
                                        educational excellence in Chittagong. From nursery to class 10, we have nurtured
                                        thousands of students who have gone on to become leaders in various fields around the world.
                                    </p>
                                    <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                                        Our commitment to quality education, moral values, and character building has
                                        produced graduates who are not only academically successful but also responsible
                                        citizens contributing to society.
                                    </p>
                                    <BlackButton
                                        onClick={() => router.push('/about')}
                                        className="w-full sm:w-auto"
                                        icon={
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        }
                                    >
                                        Learn More About CIHS
                                    </BlackButton>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal direction="right" delay={0.4}>
                                <ElegantCard className="relative overflow-hidden order-1 lg:order-2">
                                    <Image
                                        src="/images/cihs-main-building.jpg"
                                        alt="CIHS Main Building"
                                        width={500}
                                        height={256}
                                        className="rounded-lg w-full h-48 sm:h-56 lg:h-64 object-cover"
                                        style={{ backgroundColor: '#e5e7eb' }}
                                    />
                                    <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-black text-white p-2 sm:p-4 rounded-lg shadow-lg">
                                        <div className="text-lg sm:text-2xl font-bold">27+</div>
                                        <div className="text-xs sm:text-sm">Years of Excellence</div>
                                    </div>
                                </ElegantCard>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Statistics Section */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-12 sm:py-16 bg-black text-white relative">
                    <FloatingElements count={6} className="opacity-10" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <ScrollReveal direction="fade" delay={0.1}>
                            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 px-4">
                                CIHS Alumni Network by Numbers
                            </h2>
                        </ScrollReveal>

                        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                            {[
                                { number: 5000, label: 'Alumni Members', suffix: '+' },
                                { number: 27, label: 'Years of Excellence', suffix: '+' },
                                { number: 25, label: 'Countries Worldwide', suffix: '+' },
                                { number: 200, label: 'Success Stories', suffix: '+' }
                            ].map((stat, index) => (
                                <AnimatedCard key={index} className="text-center">
                                    <CountUp
                                        to={stat.number}
                                        suffix={stat.suffix}
                                        duration={2 + index * 0.3}
                                        className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 block"
                                        threshold={0.3}
                                    />
                                    <div className="text-gray-300 text-xs sm:text-sm lg:text-base px-1">{stat.label}</div>
                                </AnimatedCard>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>
            </ScrollReveal>

            {/* Testimonials Section with Slider */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-12 sm:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal direction="scale" delay={0.1}>
                            <div className="text-center mb-8 sm:mb-12">
                                <BlackTag className="mb-3 sm:mb-4">Testimonials</BlackTag>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 px-4">
                                    What Our Alumni & Teachers Say
                                </h2>
                            </div>
                        </ScrollReveal>

                        <TestimonialSlider />
                    </div>
                </section>
            </ScrollReveal>

            {/* Latest Announcements & Events */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-12 sm:py-16 bg-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Announcements */}
                            <ScrollReveal direction="left" delay={0.3}>
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
                                        <BlackTag>Latest</BlackTag>
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Announcements</h3>
                                    </div>
                                    <div className="space-y-3 sm:space-y-4">
                                        {[{
                                            title: 'Annual Alumni Reunion 2024',
                                            date: 'December 15, 2024',
                                            description: 'Join us for the biggest alumni gathering of the year at CIHS campus.',
                                            type: 'Event'
                                        },
                                        {
                                            title: 'Scholarship Program Launch',
                                            date: 'January 1, 2024',
                                            description: 'New merit-based scholarship program for current CIHS students funded by alumni.',
                                            type: 'Program'
                                        },
                                        {
                                            title: 'Alumni Achievement Awards',
                                            date: 'November 30, 2024',
                                            description: 'Nominate outstanding alumni for recognition in various categories.',
                                            type: 'Award'
                                        }
                                        ].map((announcement, index) => (
                                            <ElegantCard key={index} padding="md" className="hover:shadow-lg">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                                                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{announcement.title}</h4>
                                                    <BlackTag size="xs" className="self-start">{announcement.type}</BlackTag>
                                                </div>
                                                <p className="text-xs sm:text-sm text-blue-600 mb-2">{announcement.date}</p>
                                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{announcement.description}</p>
                                            </ElegantCard>
                                        ))}
                                    </div>
                                    <div className="mt-4 sm:mt-6">
                                        <BlackButton
                                            variant="outline"
                                            onClick={() => router.push('/events')}
                                            className="w-full sm:w-auto"
                                            icon={
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            }
                                        >
                                            View All Events
                                        </BlackButton>
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Latest Blogs */}
                            <ScrollReveal direction="right" delay={0.3}>
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
                                        <BlackTag>Featured</BlackTag>
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Blog Posts</h3>
                                    </div>
                                    <div className="space-y-3 sm:space-y-4">
                                        {[{
                                            title: 'My Journey from CIHS to Silicon Valley',
                                            author: 'Ahmed Rahman',
                                            date: 'November 20, 2024',
                                            excerpt: 'How the foundation laid at CIHS helped me succeed in the tech industry...',
                                            category: 'Career'
                                        },
                                        {
                                            title: 'Memories of Golden Days at CIHS',
                                            author: 'Nasir Uddin',
                                            date: 'November 15, 2024',
                                            excerpt: 'Nostalgic memories of school days and the teachers who shaped our lives...',
                                            category: 'Memories'
                                        },
                                        {
                                            title: 'Building a Startup: Lessons from CIHS',
                                            author: 'Fatima Sheikh',
                                            date: 'November 10, 2024',
                                            excerpt: 'How the entrepreneurial spirit was nurtured during my time at CIHS...',
                                            category: 'Business'
                                        }].map((blog, index) => (
                                            <ElegantCard key={index} padding="md" className="hover:shadow-lg">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                                                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{blog.title}</h4>
                                                    <BlackTag size="xs" className="self-start">{blog.category}</BlackTag>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm text-gray-500 mb-2 gap-1">
                                                    <span>By {blog.author}</span>
                                                    <span>{blog.date}</span>
                                                </div>
                                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{blog.excerpt}</p>
                                            </ElegantCard>
                                        ))}
                                    </div>
                                    <div className="mt-4 sm:mt-6">
                                        <BlackButton
                                            variant="outline"
                                            onClick={() => router.push('/blogs')}
                                            className="w-full sm:w-auto"
                                            icon={
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            }
                                        >
                                            Read All Blogs
                                        </BlackButton>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Call to Action Section */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-12 sm:py-16 bg-black text-white relative">
                    <FloatingElements count={5} />
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <ScrollReveal direction="scale" delay={0.1}>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-4">
                                Join the CIHS Alumni Community
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal direction="fade" delay={0.2}>
                            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-300 px-4">
                                Connect with fellow alumni, share your success stories, and give back to your alma mater.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.3}>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                                {!isAuthenticated ? (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => router.push('/register')}
                                            className="bg-white text-black px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-100 transition-colors w-full sm:w-auto"
                                        >
                                            Join Alumni Network
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => router.push('/login')}
                                            className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-white hover:text-black transition-colors w-full sm:w-auto"
                                        >
                                            Sign In
                                        </motion.button>
                                    </>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.push('/dashboard')}
                                        className="bg-white text-black px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-100 transition-colors w-full sm:w-auto max-w-xs"
                                    >
                                        Go to Dashboard
                                    </motion.button>
                                )}
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default Homepage