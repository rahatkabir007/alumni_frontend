"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'
import { motion, AnimatePresence } from 'framer-motion'
import IntroSection from '@/components/common/IntroSection'
import { categories } from '@/datas/blogsPage'
import GalleryCard from './GalleryCard'
import { galleryItems } from '@/datas/galleryPage'

const GalleryPage = () => {
    const router = useRouter()
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedImage, setSelectedImage] = useState(null)

    const filteredItems = galleryItems?.filter(item =>
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
            <IntroSection
                tag='Gallery'
                title='Memory Lane'
                description='Explore the rich history and vibrant memories of CIHS through our alumni gallery. From events to daily life, relive the moments that shaped our community.'
            />


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
                            {categories?.map(category => (
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
                            {filteredItems?.map((item) => (
                                <GalleryCard key={item?.id} item={item} />
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
                        <div className='flex justify-center items-center'>
                            <BlackButton
                                onClick={() => router.push('/contact')}
                                size="lg"
                                className="bg-white text-black hover:bg-gray-200"
                            >
                                Contact Us to Upload
                            </BlackButton>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default GalleryPage
