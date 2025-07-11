"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const slides = [
        {
            id: 1,
            image: '/images/cihs-building.jpg',
            title: 'Welcome to CIHS Alumni Network',
            subtitle: 'Chittagong Ideal High School - Excellence in Education Since 1965',
            description: 'Connecting generations of students who have walked through our halls'
        },
        {
            id: 2,
            image: '/images/cihs-students.jpg',
            title: 'Our Distinguished Alumni',
            subtitle: 'From Nursery to Class 10 - A Journey of Growth',
            description: 'Celebrating the achievements of our graduates across the globe'
        },
        {
            id: 3,
            image: '/images/cihs-campus.jpg',
            title: 'Building Future Leaders',
            subtitle: 'Quality Education, Strong Values, Bright Future',
            description: 'Join our community of successful alumni making a difference worldwide'
        }
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)

        return () => clearInterval(timer)
    }, [slides.length])

    return (
        <div className="relative h-[70vh] overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url(${slides[currentSlide].image})`,
                            backgroundColor: '#1e40af' // Fallback color
                        }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-green-800/70" />

                    {/* Content */}
                    <div className="relative z-10 h-full flex items-center justify-center">
                        <div className="text-center text-white max-w-4xl mx-auto px-4">
                            <motion.h1
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="text-4xl md:text-6xl font-bold mb-4 text-shadow"
                            >
                                {slides[currentSlide].title}
                            </motion.h1>

                            <motion.h2
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="text-xl md:text-2xl mb-6 text-yellow-300 font-medium"
                            >
                                {slides[currentSlide].subtitle}
                            </motion.h2>

                            <motion.p
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto"
                            >
                                {slides[currentSlide].description}
                            </motion.p>

                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.8 }}
                                className="space-x-4"
                            >
                                <button className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-300">
                                    Join Alumni Network
                                </button>
                                <button className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-300">
                                    Learn More
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentSlide ? 'bg-yellow-400' : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-400 transition-colors duration-300"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-400 transition-colors duration-300"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    )
}

export default HeroSlider
