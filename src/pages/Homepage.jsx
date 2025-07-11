"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@/redux/features/auth/authSlice'

const Homepage = () => {
    const router = useRouter()
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const [isInitialized, setIsInitialized] = useState(false)
    const [visibleSections, setVisibleSections] = useState(new Set())

    const heroRef = useRef(null)
    const featuresRef = useRef(null)
    const statsRef = useRef(null)
    const testimonialsRef = useRef(null)
    const ctaRef = useRef(null)

    useEffect(() => {
        // Small delay to ensure auth state is properly initialized
        const timer = setTimeout(() => {
            setIsInitialized(true)
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        }

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setVisibleSections(prev => new Set([...prev, entry.target.id]))
                }
            })
        }

        const observer = new IntersectionObserver(observerCallback, observerOptions)

        const refs = [heroRef, featuresRef, statsRef, testimonialsRef, ctaRef]
        refs.forEach(ref => {
            if (ref.current) {
                observer.observe(ref.current)
            }
        })

        return () => {
            refs.forEach(ref => {
                if (ref.current) {
                    observer.unobserve(ref.current)
                }
            })
        }
    }, [])

    const isVisible = (sectionId) => visibleSections.has(sectionId)

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section
                ref={heroRef}
                id="hero"
                className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
            >
                <div className="text-center py-16 sm:py-20">
                    <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
                        Welcome to Alumni Network
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
                        Connect with fellow alumni, share experiences, and build lasting professional relationships.
                        Join our growing community of graduates making a difference.
                    </p>

                    <div className="animate-fade-in-up animation-delay-400">
                        {!isInitialized ? (
                            <div className="space-x-4">
                                <div className="inline-block animate-pulse bg-gray-200 h-12 w-32 rounded-lg"></div>
                                <div className="inline-block animate-pulse bg-gray-200 h-12 w-24 rounded-lg"></div>
                            </div>
                        ) : !isAuthenticated ? (
                            <div className="space-x-4">
                                <button
                                    onClick={() => router.push('/login')}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                                >
                                    Get Started
                                </button>
                                <button
                                    onClick={() => router.push('/register')}
                                    className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                                >
                                    Sign Up
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                ref={featuresRef}
                id="features"
                className={`py-16 transition-all duration-1000 ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Why Join Our Alumni Network?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: '🤝', title: 'Network', description: 'Connect with alumni from your institution and build meaningful professional relationships.', delay: '0' },
                            { icon: '💼', title: 'Opportunities', description: 'Discover job opportunities, mentorship programs, and career advancement resources.', delay: '200' },
                            { icon: '🎓', title: 'Growth', description: 'Access exclusive events, workshops, and continuous learning opportunities.', delay: '400' }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className={`text-center p-6 transform transition-all duration-700 ${isVisible('features')
                                    ? 'opacity-100 translate-y-0 scale-100'
                                    : 'opacity-0 translate-y-10 scale-95'
                                    }`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-transform duration-300 hover:scale-110">
                                    <span className="text-2xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section
                ref={statsRef}
                id="stats"
                className={`py-16 bg-blue-600 text-white transition-all duration-1000 ${isVisible('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { number: '10,000+', label: 'Alumni Members' },
                            { number: '500+', label: 'Companies' },
                            { number: '50+', label: 'Countries' },
                            { number: '1,000+', label: 'Success Stories' }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className={`text-center transform transition-all duration-700 ${isVisible('stats')
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: `${index * 150}ms` }}
                            >
                                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                                <div className="text-blue-100">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section
                ref={testimonialsRef}
                id="testimonials"
                className={`py-16 bg-white transition-all duration-1000 ${isVisible('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        What Our Alumni Say
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
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
                            <div
                                key={index}
                                className={`bg-gray-50 p-6 rounded-lg transform transition-all duration-700 hover:shadow-lg ${isVisible('testimonials')
                                    ? 'opacity-100 translate-y-0 rotate-0'
                                    : 'opacity-0 translate-y-10 rotate-3'
                                    }`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section
                ref={ctaRef}
                id="cta"
                className={`py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-1000 ${isVisible('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 ${isVisible('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                        }`}>
                        Ready to Connect with Your Alumni Community?
                    </h2>
                    <p className={`text-xl mb-8 transition-all duration-700 ${isVisible('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                        }`} style={{ transitionDelay: '200ms' }}>
                        Join thousands of alumni who are already building meaningful connections and advancing their careers.
                    </p>
                    <div className={`space-x-4 transition-all duration-700 ${isVisible('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                        }`} style={{ transitionDelay: '400ms' }}>
                        {!isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => router.push('/register')}
                                    className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                                >
                                    Join Now
                                </button>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="border border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
                                >
                                    Sign In
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                            >
                                Explore Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Homepage