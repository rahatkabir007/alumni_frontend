"use client"
import React, { useState } from 'react'
import { useGetAllGalleriesQuery } from '@/redux/features/gallery/galleryApi'
import GalleryHeader from './components/GalleryHeader'
import GalleryFilters from './components/GalleryFilters'
import GalleryGrid from './components/GalleryGrid'
import GalleryImageModal from './components/GalleryImageModal'
import GalleryCTA from './components/GalleryCTA'

const GalleryPage = () => {
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

    return (
        <div className="bg-gray-50 min-h-screen">
            <GalleryHeader />

            <GalleryFilters
                yearFilter={yearFilter}
                onYearChange={handleYearChange}
                totalItems={totalItems}
            />

            <GalleryGrid
                galleries={galleries}
                isLoading={isLoading}
                isFetching={isFetching}
                error={error}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={galleryData?.itemsPerPage || 24}
                onPageChange={handlePageChange}
                onImageClick={openImageModal}
            />

            <GalleryImageModal
                selectedImage={selectedImage}
                onClose={closeImageModal}
            />

            <GalleryCTA />
        </div>
    )
}

export default GalleryPage
