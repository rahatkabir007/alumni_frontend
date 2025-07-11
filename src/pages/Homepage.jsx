"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@/redux/features/auth/authSlice'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import AnimatedCard from '@/components/animations/AnimatedCard'
import CountUp from '@/components/animations/CountUp'
import FloatingElements from '@/components/animations/FloatingElements'
import HeroSlider from '@/components/HeroSlider'
import Link from 'next/link'

const Homepage = () => {
    const router = useRouter()
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const [isInitialized, setIsInitialized] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const timer = setTimeout(() => {
            setIsInitialized(true)
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    if (!isMounted) {
        return (
            <div className="bg-gray-50">
                {/* Static content for SSR */}
                <div className="h-[70vh] bg-blue-600 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">CIHS Alumni Network</h1>
                        <p className="text-xl">Chittagong Ideal High School</p>
                    </div>
                </div>
                {/* ...existing static sections... */}
            </div>
        )
    }

    return (
        <div className="bg-gray-50">
            {/* Hero Slider */}
            <HeroSlider />

            {/* School Brief Section */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <ScrollReveal direction="left" delay={0.3}>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                        About Chittagong Ideal High School
                                    </h2>
                                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                        Established in 1965, Chittagong Ideal High School (CIHS) has been a beacon of
                                        educational excellence in Chittagong. From nursery to class 10, we have nurtured
                                        thousands of students who have gone on to become leaders in various fields around the world.
                                    </p>
                                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                        Our commitment to quality education, moral values, and character building has
                                        produced graduates who are not only academically successful but also responsible
                                        citizens contributing to society.
                                    </p>
                                    <Link
                                        href="/about"
                                        className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                    >
                                        Learn More About CIHS
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal direction="right" delay={0.4}>
                                <div className="relative">
                                    <img
                                        src="/images/cihs-main-building.jpg"
                                        alt="CIHS Main Building"
                                        className="rounded-lg shadow-xl"
                                        style={{ backgroundColor: '#e5e7eb' }} // Fallback
                                    />
                                    <div className="absolute -bottom-4 -right-4 bg-yellow-500 text-blue-900 p-4 rounded-lg shadow-lg">
                                        <div className="text-2xl font-bold">58+</div>
                                        <div className="text-sm">Years of Excellence</div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Statistics Section */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white relative">
                    <FloatingElements count={6} className="opacity-10" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <ScrollReveal direction="fade" delay={0.1}>
                            <h2 className="text-3xl font-bold text-center mb-12">
                                CIHS Alumni Network by Numbers
                            </h2>
                        </ScrollReveal>

                        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { number: 5000, label: 'Alumni Members', suffix: '+' },
                                { number: 58, label: 'Years of Excellence', suffix: '+' },
                                { number: 25, label: 'Countries Worldwide', suffix: '+' },
                                { number: 200, label: 'Success Stories', suffix: '+' }
                            ].map((stat, index) => (
                                <AnimatedCard key={index} className="text-center">
                                    <CountUp
                                        to={stat.number}
                                        suffix={stat.suffix}
                                        duration={2 + index * 0.3}
                                        className="text-3xl md:text-4xl font-bold mb-2 block"
                                        threshold={0.3}
                                    />
                                    <div className="text-blue-100">{stat.label}</div>
                                </AnimatedCard>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>
            </ScrollReveal>

            {/* Testimonials Section */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal direction="scale" delay={0.1}>
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                                What Our Alumni & Teachers Say
                            </h2>
                        </ScrollReveal>

                        <StaggerContainer staggerDelay={0.2} className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: 'Dr. Rahman Ahmed',
                                    role: 'CIHS Alumni (Class of 1985) - Now Surgeon at Johns Hopkins',
                                    quote: 'CIHS gave me the foundation that led to my success in medicine. The values and discipline I learned here shaped my entire career.',
                                    avatar: 'RA',
                                    type: 'alumni'
                                },
                                {
                                    name: 'Mrs. Fatima Khatun',
                                    role: 'Mathematics Teacher at CIHS (1975-2010)',
                                    quote: 'Teaching at CIHS for 35 years was the most rewarding experience. Watching our students become global leaders fills my heart with pride.',
                                    avatar: 'FK',
                                    type: 'teacher'
                                },
                                {
                                    name: 'Eng. Karim Hassan',
                                    role: 'CIHS Alumni (Class of 1992) - Software Engineer at Google',
                                    quote: 'The analytical thinking and problem-solving skills I developed at CIHS directly contributed to my success in the tech industry.',
                                    avatar: 'KH',
                                    type: 'alumni'
                                }
                            ].map((testimonial, index) => (
                                <AnimatedCard
                                    key={index}
                                    className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500"
                                    hoverScale={1.03}
                                >
                                    <div className="flex items-center mb-4">
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold mr-4 ${testimonial.type === 'teacher' ? 'bg-green-600' : 'bg-blue-600'
                                                }`}
                                        >
                                            {testimonial.avatar}
                                        </motion.div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-600">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                                </AnimatedCard>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>
            </ScrollReveal>

            {/* Latest Announcements & Events */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-16 bg-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Announcements */}
                            <ScrollReveal direction="left" delay={0.3}>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Latest Announcements</h3>
                                    <div className="space-y-4">
                                        {[
                                            {
                                                title: 'Annual Alumni Reunion 2024',
                                                date: 'December 15, 2024',
                                                description: 'Join us for the biggest alumni gathering of the year at CIHS campus.'
                                            },
                                            {
                                                title: 'Scholarship Program Launch',
                                                date: 'January 1, 2024',
                                                description: 'New merit-based scholarship program for current CIHS students funded by alumni.'
                                            },
                                            {
                                                title: 'Alumni Achievement Awards',
                                                date: 'November 30, 2024',
                                                description: 'Nominate outstanding alumni for recognition in various categories.'
                                            }
                                        ].map((announcement, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                                                    <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">{announcement.date}</span>
                                                </div>
                                                <p className="text-gray-600 text-sm">{announcement.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <Link
                                        href="/events"
                                        className="inline-flex items-center mt-6 text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        View All Events
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </ScrollReveal>

                            {/* Latest Blogs */}
                            <ScrollReveal direction="right" delay={0.3}>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Latest Blog Posts</h3>
                                    <div className="space-y-4">
                                        {[
                                            {
                                                title: 'My Journey from CIHS to Silicon Valley',
                                                author: 'Ahmed Rahman',
                                                date: 'November 20, 2024',
                                                excerpt: 'How the foundation laid at CIHS helped me succeed in the tech industry...'
                                            },
                                            {
                                                title: 'Memories of Golden Days at CIHS',
                                                author: 'Nasir Uddin',
                                                date: 'November 15, 2024',
                                                excerpt: 'Nostalgic memories of school days and the teachers who shaped our lives...'
                                            },
                                            {
                                                title: 'Building a Startup: Lessons from CIHS',
                                                author: 'Fatima Sheikh',
                                                date: 'November 10, 2024',
                                                excerpt: 'How the entrepreneurial spirit was nurtured during my time at CIHS...'
                                            }
                                        ].map((blog, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
                                                <h4 className="font-semibold text-gray-900 mb-2">{blog.title}</h4>
                                                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                                                    <span>By {blog.author}</span>
                                                    <span>{blog.date}</span>
                                                </div>
                                                <p className="text-gray-600 text-sm">{blog.excerpt}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <Link
                                        href="/blogs"
                                        className="inline-flex items-center mt-6 text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Read All Blogs
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Call to Action Section */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white relative">
                    <FloatingElements count={5} />
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <ScrollReveal direction="scale" delay={0.1}>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Join the CIHS Alumni Community
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal direction="fade" delay={0.2}>
                            <p className="text-xl mb-8">
                                Connect with fellow alumni, share your success stories, and give back to your alma mater.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.3}>
                            <div className="space-x-4">
                                {!isAuthenticated ? (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => router.push('/register')}
                                            className="bg-yellow-500 text-blue-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-400 transition-colors"
                                        >
                                            Join Alumni Network
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => router.push('/login')}
                                            className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                                        >
                                            Sign In
                                        </motion.button>
                                    </>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.push('/dashboard')}
                                        className="bg-yellow-500 text-blue-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-400 transition-colors"
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