"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'
import { motion, AnimatePresence } from 'framer-motion'

const GalleryPage = () => {
    const router = useRouter()
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedImage, setSelectedImage] = useState(null)

    // Mock gallery data
    const galleryItems = [
        {
            id: 1,
            title: 'Annual Sports Day 1995',
            description: 'Memorable moments from the inter-house sports competition',
            image: '/images/gallery/sports-day-1995.jpg',
            category: 'Events',
            year: '1995',
            uploadedBy: 'Rahman Ahmed',
            userType: 'alumni',
            batch: '1985',
            likes: 45,
            comments: 12
        },
        {
            id: 2,
            title: 'Science Fair Winners',
            description: 'Our brilliant students showcasing their innovative projects',
            image: '/images/gallery/science-fair.jpg',
            category: 'Academic',
            year: '2010',
            uploadedBy: 'Dr. Abdul Karim',
            userType: 'teacher',
            department: 'Science',
            likes: 67,
            comments: 8
        },
        {
            id: 3,
            title: 'Golden Jubilee Celebration',
            description: 'Celebrating 50 years of CIHS excellence with alumni and faculty',
            image: '/images/gallery/golden-jubilee.jpg',
            category: 'Celebrations',
            year: '2015',
            uploadedBy: 'Fatima Khan',
            userType: 'alumni',
            batch: '1990',
            likes: 123,
            comments: 34
        },
        {
            id: 4,
            title: 'Class of 1988 Reunion',
            description: 'After 30 years, classmates reunite at their alma mater',
            image: '/images/gallery/reunion-1988.jpg',
            category: 'Reunions',
            year: '2018',
            uploadedBy: 'Nasir Uddin',
            userType: 'alumni',
            batch: '1988',
            likes: 89,
            comments: 27
        },
        {
            id: 5,
            title: 'Cultural Program Performance',
            description: 'Students performing traditional dance at annual cultural event',
            image: '/images/gallery/cultural-program.jpg',
            category: 'Cultural',
            year: '2020',
            uploadedBy: 'Mrs. Rashida Begum',
            userType: 'teacher',
            department: 'Languages',
            likes: 78,
            comments: 15
        },
        {
            id: 6,
            title: 'Morning Assembly',
            description: 'Daily morning assembly where values and discipline were instilled',
            image: '/images/gallery/morning-assembly.jpg',
            category: 'Daily Life',
            year: '2005',
            uploadedBy: 'Ayesha Begum',
            userType: 'alumni',
            batch: '1992',
            likes: 56,
            comments: 19
        },
        {
            id: 7,
            title: 'Computer Lab Opening',
            description: 'Inauguration of the new computer laboratory in 2000',
            image: '/images/gallery/computer-lab.jpg',
            category: 'Infrastructure',
            year: '2000',
            uploadedBy: 'Mrs. Salma Khatun',
            userType: 'teacher',
            department: 'Technology',
            likes: 43,
            comments: 9
        },
        {
            id: 8,
            title: 'Inter-House Debate Competition',
            description: 'Annual debate competition showcasing student eloquence',
            image: '/images/gallery/debate-competition.jpg',
            category: 'Academic',
            year: '2012',
            uploadedBy: 'Mohammad Karim',
            userType: 'alumni',
            batch: '1987',
            likes: 62,
            comments: 11
        }
    ]

    const categories = ['all', 'Events', 'Academic', 'Celebrations', 'Reunions', 'Cultural', 'Daily Life', 'Infrastructure']

    const filteredItems = galleryItems.filter(item =>
        selectedCategory === 'all' || item.category === selectedCategory
    )

    const openLightbox = (item) => {
        setSelectedImage(item)
    }

    const closeLightbox = () => {
        setSelectedImage(null)
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <BlackTag className="mb-4 bg-white text-black">Gallery</BlackTag>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Memory Lane
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto text-gray-300">
                            A collection of precious memories shared by our alumni and teachers.
                            Relive the golden moments and celebrate the legacy of CIHS through these cherished photographs.
                        </p>
                    </div>
                </section>
            </ScrollReveal>

            {/* Upload CTA */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-8 bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Share Your Memories</h2>
                                <p className="text-gray-600">Have photos from your CIHS days? Share them with the community!</p>
                            </div>
                            <BlackButton
                                onClick={() => router.push('/contact')}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                }
                            >
                                Upload Photos
                            </BlackButton>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Category Filter */}
            <ScrollReveal direction="up" delay={0.4}>
                <section className="py-8 bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-2 items-center justify-center">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                            ? 'bg-black text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {category === 'all' ? 'All Categories' : category}
                                </button>
                            ))}

                            <BlackTag size="sm" className="ml-4">
                                {filteredItems.length} photos
                            </BlackTag>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Gallery Grid */}
            <ScrollReveal direction="up" delay={0.5}>
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredItems.map((item) => (
                                <ElegantCard
                                    key={item.id}
                                    className="overflow-hidden group cursor-pointer"
                                    onClick={() => openLightbox(item)}
                                >
                                    <div className="relative">
                                        <div
                                            className="h-48 bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-105 transition-transform duration-300"
                                            style={{
                                                backgroundImage: `url(${item.image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        />
                                        <BlackTag className="absolute top-2 right-2" size="xs">
                                            {item.category}
                                        </BlackTag>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                            <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                                            <p className="text-gray-200 text-xs">{item.year}</p>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
                                                    {item.uploadedBy.charAt(0)}
                                                </div>
                                                <span>{item.uploadedBy}</span>
                                            </div>
                                            <BlackTag
                                                variant="subtle"
                                                size="xs"
                                                className={item.userType === 'teacher' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                                            >
                                                {item.userType === 'teacher' ? 'Teacher' : `Batch ${item.batch}`}
                                            </BlackTag>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex items-center space-x-3">
                                                <span className="flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    {item.likes}
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    {item.comments}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </ElegantCard>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>
            </ScrollReveal>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
                        onClick={closeLightbox}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="relative max-w-4xl max-h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closeLightbox}
                                className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="bg-white rounded-lg overflow-hidden">
                                <div
                                    className="h-96 bg-gray-300"
                                    style={{
                                        backgroundImage: `url(${selectedImage.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                />

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-2xl font-bold text-gray-900">{selectedImage.title}</h3>
                                        <BlackTag>{selectedImage.category}</BlackTag>
                                    </div>

                                    <p className="text-gray-600 mb-4">{selectedImage.description}</p>

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                                {selectedImage.uploadedBy.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{selectedImage.uploadedBy}</p>
                                                <p className="text-xs">
                                                    {selectedImage.userType === 'teacher'
                                                        ? `Teacher, ${selectedImage.department} Department`
                                                        : `Alumni, Batch ${selectedImage.batch}`
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-medium">{selectedImage.year}</p>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    {selectedImage.likes}
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    {selectedImage.comments}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CTA Section */}
            <ScrollReveal direction="up" delay={0.6}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Have More Memories to Share?
                        </h2>
                        <p className="text-lg text-gray-300 mb-8">
                            Help us build a comprehensive archive of CIHS memories. Your photos and stories matter to our community.
                        </p>
                        <BlackButton
                            onClick={() => router.push('/contact')}
                            size="lg"
                            className="bg-white text-black hover:bg-gray-200"
                        >
                            Contact Us to Upload
                        </BlackButton>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default GalleryPage
