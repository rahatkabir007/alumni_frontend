"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TestimonialSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const testimonials = [
        {
            id: 1,
            name: 'Dr. Rahman Ahmed',
            role: 'CIHS Alumni (Class of 1985) - Surgeon at Johns Hopkins',
            quote: 'CIHS gave me the foundation that led to my success in medicine. The values and discipline I learned here shaped my entire career.',
            avatar: 'RA',
            type: 'alumni',
            image: '/images/alumni/dr-rahman.jpg'
        },
        {
            id: 2,
            name: 'Mrs. Fatima Khatun',
            role: 'Mathematics Teacher at CIHS (1975-2010)',
            quote: 'Teaching at CIHS for 35 years was the most rewarding experience. Watching our students become global leaders fills my heart with pride.',
            avatar: 'FK',
            type: 'teacher',
            image: '/images/teachers/fatima-khatun.jpg'
        },
        {
            id: 3,
            name: 'Eng. Karim Hassan',
            role: 'CIHS Alumni (Class of 1992) - Software Engineer at Google',
            quote: 'The analytical thinking and problem-solving skills I developed at CIHS directly contributed to my success in the tech industry.',
            avatar: 'KH',
            type: 'alumni',
            image: '/images/alumni/karim-hassan.jpg'
        },
        {
            id: 4,
            name: 'Prof. Nasir Uddin',
            role: 'Former Principal of CIHS (1980-2005)',
            quote: 'Leading CIHS for 25 years, I witnessed countless young minds transform into responsible global citizens. The legacy continues.',
            avatar: 'NU',
            type: 'teacher',
            image: '/images/teachers/nasir-uddin.jpg'
        },
        {
            id: 5,
            name: 'Dr. Ayesha Begum',
            role: 'CIHS Alumni (Class of 1990) - Pediatrician & Humanitarian',
            quote: 'The compassion and service mindset instilled at CIHS drives my work in providing healthcare to underprivileged children.',
            avatar: 'AB',
            type: 'alumni',
            image: '/images/alumni/ayesha-begum.jpg'
        }
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % testimonials.length)
        }, 5000)

        return () => clearInterval(timer)
    }, [testimonials.length])

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
                        className="bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-2xl"
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
                                <div className={`mt-2 text-center px-3 py-1 rounded-full text-xs font-medium ${
                                    testimonials[currentSlide].type === 'teacher' 
                                        ? 'bg-emerald-500/20 text-emerald-400' 
                                        : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                    {testimonials[currentSlide].type === 'teacher' ? 'Teacher' : 'Alumni'}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-center md:text-left">
                                <blockquote className="text-lg md:text-xl text-slate-200 italic mb-6 leading-relaxed">
                                    "{testimonials[currentSlide].quote}"
                                </blockquote>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-1">
                                        {testimonials[currentSlide].name}
                                    </h4>
                                    <p className="text-slate-400 text-sm">
                                        {testimonials[currentSlide].role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="slider-nav prev"
                aria-label="Previous testimonial"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                className="slider-nav next"
                aria-label="Next testimonial"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                            index === currentSlide 
                                ? 'bg-blue-400' 
                                : 'bg-slate-600 hover:bg-slate-500'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default TestimonialSlider
