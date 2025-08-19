"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGetAllGalleriesQuery } from '@/redux/features/gallery/galleryApi'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import IntroSection from '@/components/common/IntroSection'
import Pagination from '@/components/common/Pagination'
import GlobalModal from '@/components/antd/Modal/GlobalModal'
import Image from 'next/image'

const GalleryPage = () => {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1)
    const [yearFilter, setYearFilter] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)

    const {
        data: galleryData,
        isLoading,
        isFetching,
        error
    } = useGetAllGalleriesQuery({
        page: currentPage,
        limit: 24,
        status: 'active',
        year: yearFilter || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    })

    const galleries = galleryData?.galleries || []
    const totalItems = galleryData?.totalItems || 0
    const totalPages = galleryData?.totalPages || 1

    const getCurrentYearRange = () => {
        const currentYear = new Date().getFullYear()
        const years = []
        for (let year = currentYear; year >= 1998; year--) {
            years.push(year)
        }
        return years
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleYearChange = (year) => {
        setCurrentPage(1)
        setYearFilter(year)
    }

    const openImageModal = (gallery) => {
        setSelectedImage(gallery)
    }

    const closeImageModal = () => {
        setSelectedImage(null)
    }

    const getInitials = (name) => {
        if (!name) return 'A'
        const parts = name.trim().split(' ')
        if (parts.length === 1) return parts[0][0]
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
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
                                <p className="text-gray-600">Have photos from your CIHS days? Login and share them with the community!</p>
                            </div>
                            <BlackButton
                                onClick={() => router.push('/profile')}
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

            {/* Year Filter */}
            <ScrollReveal direction="up" delay={0.4}>
                <section className="py-8 bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Filter by Year:</label>
                                <select
                                    value={yearFilter}
                                    onChange={(e) => handleYearChange(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                                >
                                    <option value="">All Years</option>
                                    {getCurrentYearRange().map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {yearFilter && (
                                <BlackButton
                                    size="xs"
                                    variant="outline"
                                    onClick={() => handleYearChange('')}
                                >
                                    Clear Filter
                                </BlackButton>
                            )}

                            <BlackTag size="sm" className="ml-4">
                                {totalItems} photos
                            </BlackTag>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Gallery Grid */}
            <ScrollReveal direction="up" delay={0.5}>
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {isLoading || isFetching ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading gallery...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <div className="text-red-400 text-4xl mb-4">⚠️</div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Gallery</h4>
                                <p className="text-gray-600">There was an error loading the gallery images.</p>
                            </div>
                        ) : galleries.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Images Found</h4>
                                <p className="text-gray-600">No gallery images match your search criteria.</p>
                            </div>
                        ) : (
                            <>
                                {/* Masonry/Staggered Grid */}
                                <StaggerContainer staggerDelay={0.05} className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                                    {galleries.map((gallery, index) => (
                                        <div
                                            key={gallery.id}
                                            className="break-inside-avoid relative group cursor-pointer"
                                            onClick={() => openImageModal(gallery)}
                                        >
                                            <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                                                <Image
                                                    src={gallery.image}
                                                    alt={gallery.title || `Gallery image`}
                                                    width={400}
                                                    height={Math.floor(Math.random() * 200) + 300} // Random height for masonry effect
                                                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                                                    style={{ height: 'auto' }}
                                                />

                                                {/* Overlay with title and year */}
                                                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end">
                                                    <div className="p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                                                        {gallery.title && (
                                                            <h3 className="font-semibold text-lg mb-1">{gallery.title}</h3>
                                                        )}
                                                        <p className="text-sm opacity-90">{gallery.year}</p>
                                                        {gallery.user && (
                                                            <p className="text-xs opacity-75 mt-1">
                                                                By {gallery.user.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </StaggerContainer>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center mt-12">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            totalItems={totalItems}
                                            itemsPerPage={galleryData?.itemsPerPage || 24}
                                            onPageChange={handlePageChange}
                                            isLoading={isLoading || isFetching}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </ScrollReveal>

            {/* Image Preview Modal */}
            {selectedImage && (
                <GlobalModal
                    isModalOpen={!!selectedImage}
                    setModalHandler={closeImageModal}
                    title={selectedImage.title || 'Gallery Image'}
                    width={900}
                    closeIcon={true}
                >
                    <div className="p-6">
                        <div className="relative mb-6">
                            <Image
                                src={selectedImage.image}
                                alt={selectedImage.title || 'Gallery image'}
                                width={800}
                                height={600}
                                className="w-full h-auto max-h-96 object-contain rounded-lg"
                            />
                        </div>

                        <div className="space-y-4">
                            {selectedImage.description && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                                    <p className="text-gray-700">{selectedImage.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-900">Year:</span>
                                    <span className="ml-2 text-gray-700">{selectedImage.year}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-900">Uploaded:</span>
                                    <span className="ml-2 text-gray-700">
                                        {new Date(selectedImage.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {selectedImage.user && (
                                <div className="flex items-center pt-4 border-t border-gray-200">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold mr-3">
                                        {getInitials(selectedImage.user.name)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{selectedImage.user.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {selectedImage.user.alumni_type === 'student'
                                                ? `Alumni, Batch ${selectedImage.user.batch}`
                                                : 'Faculty Member'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </GlobalModal>
            )}

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
                                onClick={() => router.push('/profile')}
                                size="lg"
                                className="bg-white text-black hover:bg-gray-200"
                            >
                                Upload Your Photos
                            </BlackButton>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default GalleryPage
