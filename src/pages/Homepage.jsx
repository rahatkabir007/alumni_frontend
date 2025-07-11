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

const Homepage = () => {
    const router = useRouter()
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const [isInitialized, setIsInitialized] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    // Use react-intersection-observer for hero section
    const { ref: heroRef, inView: heroInView } = useInView({
        threshold: 0.1,
        triggerOnce: true
    })

    useEffect(() => {
        setIsMounted(true)
        const timer = setTimeout(() => {
            setIsInitialized(true)
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    const heroVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    }

    const heroItemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    }

    // Show static content during SSR
    if (!isMounted) {
        return (
            <div className="bg-gray-50">
                {/* Static Hero Section for SSR */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-16 sm:py-20">
                        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                            Welcome to Alumni Network
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Connect with fellow alumni, share experiences, and build lasting professional relationships.
                            Join our growing community of graduates making a difference.
                        </p>
                        <div className="space-x-4">
                            <div className="inline-block animate-pulse bg-gray-200 h-12 w-32 rounded-lg"></div>
                            <div className="inline-block animate-pulse bg-gray-200 h-12 w-24 rounded-lg"></div>
                        </div>
                    </div>
                </section>

                {/* ...existing static sections... */}
            </div>
        )
    }

    return (
        <div className="bg-gray-50 relative overflow-hidden">
            <FloatingElements count={8} />

            {/* Hero Section with react-intersection-observer */}
            <motion.section
                ref={heroRef}
                initial="hidden"
                animate={heroInView ? "visible" : "hidden"}
                variants={heroVariants}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
            >
                <div className="text-center py-16 sm:py-20">
                    <motion.h1
                        variants={heroItemVariants}
                        className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6"
                    >
                        Welcome to Alumni Network
                    </motion.h1>

                    <motion.p
                        variants={heroItemVariants}
                        className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
                    >
                        Connect with fellow alumni, share experiences, and build lasting professional relationships.
                        Join our growing community of graduates making a difference.
                    </motion.p>

                    <motion.div variants={heroItemVariants}>
                        {!isInitialized ? (
                            <div className="space-x-4">
                                <div className="inline-block animate-pulse bg-gray-200 h-12 w-32 rounded-lg"></div>
                                <div className="inline-block animate-pulse bg-gray-200 h-12 w-24 rounded-lg"></div>
                            </div>
                        ) : !isAuthenticated ? (
                            <div className="space-x-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.push('/login')}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Get Started
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.push('/register')}
                                    className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
                                >
                                    Sign Up
                                </motion.button>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/dashboard')}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Go to Dashboard
                            </motion.button>
                        )}
                    </motion.div>
                </div>
            </motion.section>

            {/* Features Section with improved ScrollReveal */}
            <ScrollReveal direction="up" delay={0.2} threshold={0.2}>
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal direction="fade" delay={0.1}>
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                                Why Join Our Alumni Network?
                            </h2>
                        </ScrollReveal>

                        <StaggerContainer staggerDelay={0.2} className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: '🤝', title: 'Network', description: 'Connect with alumni from your institution and build meaningful professional relationships.' },
                                { icon: '💼', title: 'Opportunities', description: 'Discover job opportunities, mentorship programs, and career advancement resources.' },
                                { icon: '🎓', title: 'Growth', description: 'Access exclusive events, workshops, and continuous learning opportunities.' }
                            ].map((feature, index) => (
                                <AnimatedCard key={index} className="text-center p-6" hoverScale={1.05} rotateOnHover>
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                        className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                    >
                                        <span className="text-2xl">{feature.icon}</span>
                                    </motion.div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </AnimatedCard>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>
            </ScrollReveal>

            {/* Statistics Section with CountUp animations */}
            <ScrollReveal direction="up" delay={0.3} threshold={0.3}>
                <section className="py-16 bg-blue-600 text-white relative">
                    <FloatingElements count={6} className="opacity-10" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { number: 10000, label: 'Alumni Members', suffix: '+' },
                                { number: 500, label: 'Companies', suffix: '+' },
                                { number: 50, label: 'Countries', suffix: '+' },
                                { number: 1000, label: 'Success Stories', suffix: '+' }
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

            {/* Testimonials Section with staggered animations */}
            <ScrollReveal direction="up" delay={0.2} threshold={0.2}>
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal direction="scale" delay={0.1}>
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                                What Our Alumni Say
                            </h2>
                        </ScrollReveal>

                        <StaggerContainer staggerDelay={0.2} className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: 'Sarah Johnson',
                                    role: 'Software Engineer at Google',
                                    quote: 'The Alumni Network helped me connect with mentors who guided my career path. I found my dream job through connections made here!',
                                    avatar: 'SJ'
                                },
                                {
                                    name: 'Michael Chen',
                                    role: 'Startup Founder',
                                    quote: 'I found my co-founder and early investors through this platform. The community support has been incredible for my entrepreneurial journey.',
                                    avatar: 'MC'
                                },
                                {
                                    name: 'Emily Rodriguez',
                                    role: 'Marketing Director',
                                    quote: 'The networking events and workshops have been invaluable for my professional development. Highly recommend joining!',
                                    avatar: 'ER'
                                }
                            ].map((testimonial, index) => (
                                <AnimatedCard
                                    key={index}
                                    className="bg-gray-50 p-6 rounded-lg"
                                    hoverScale={1.03}
                                    rotateOnHover
                                >
                                    <div className="flex items-center mb-4">
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4"
                                        >
                                            {testimonial.avatar}
                                        </motion.div>
                                        <div>
                                            <h4 className="font-semibold">{testimonial.name}</h4>
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

            {/* Call to Action Section with multiple reveal effects */}
            <ScrollReveal direction="up" delay={0.3} threshold={0.4}>
                <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative">
                    <FloatingElements count={5} />
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <ScrollReveal direction="scale" delay={0.1}>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to Connect with Your Alumni Community?
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal direction="fade" delay={0.2}>
                            <p className="text-xl mb-8">
                                Join thousands of alumni who are already building meaningful connections and advancing their careers.
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
                                            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
                                        >
                                            Join Now
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => router.push('/login')}
                                            className="border border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                                        >
                                            Sign In
                                        </motion.button>
                                    </>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.push('/dashboard')}
                                        className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
                                    >
                                        Explore Dashboard
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