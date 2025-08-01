"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { testimonials } from '@/datas/homepage'

const TestimonialSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % testimonials.length)
        }, 5000)

        return () => clearInterval(timer)
    }, [])

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    return (
        <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="bg-black border border-gray-800 p-8 rounded-xl shadow-2xl text-white"
                    >
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
                            {/* Avatar/Image */}
                            <div className="flex-shrink-0">
                                <div
                                    className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                                    style={{
                                        backgroundImage: `url(${testimonials[currentSlide].image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    {!testimonials[currentSlide].image && testimonials[currentSlide].avatar}
                                </div>
                                <div className={`mt-2 text-center px-3 py-1 rounded-full text-xs font-medium ${testimonials[currentSlide].type === 'teacher'
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-blue-500 text-white'
                                    }`}>
                                    {testimonials[currentSlide].type === 'teacher' ? 'Teacher' : 'Alumni'}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-center md:text-left">
                                <blockquote className="text-lg md:text-xl text-gray-200 italic mb-6 leading-relaxed">
                                    &ldquo;{testimonials[currentSlide].quote}&rdquo;
                                </blockquote>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-1">
                                        {testimonials[currentSlide].name}
                                    </h4>
                                    <p className="text-gray-400 text-sm">
                                        {testimonials[currentSlide].role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Arrows - Updated with black theme */}
            <button
                onClick={prevSlide}
                className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 bg-black text-white border border-gray-700 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-800 transition-all z-10"
                aria-label="Previous testimonial"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-[-24px] top-1/2 transform -translate-y-1/2 bg-black text-white border border-gray-700 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-800 transition-all z-10"
                aria-label="Next testimonial"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Indicators - Updated with black theme */}
            <div className="flex justify-center space-x-2 mt-6">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentSlide
                            ? 'bg-black'
                            : 'bg-gray-400 hover:bg-gray-600'
                            }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default TestimonialSlider
