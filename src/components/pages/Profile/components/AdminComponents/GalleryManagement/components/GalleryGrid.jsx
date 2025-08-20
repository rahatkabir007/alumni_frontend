"use client"
import React from 'react'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import Pagination from '@/components/common/Pagination'
import GalleryCard from './GalleryCard'

const GalleryGrid = ({
    galleries,
    isLoading,
    isFetching,
    error,
    activeTab,
    processingIds,
    onStatusUpdate,
    onImageClick,
    getStatusColor,
    getInitials,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onRefetch
}) => {
    if (isLoading || isFetching) {
        return (
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading gallery images...</p>
                </div>
            </ElegantCard>
        )
    }

    if (error) {
        return (
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="text-center py-12">
                    <div className="text-red-400 text-4xl mb-4">⚠️</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Gallery</h4>
                    <p className="text-gray-600 mb-4">There was an error loading gallery images.</p>
                    <BlackButton size="sm" onClick={onRefetch}>
                        Try Again
                    </BlackButton>
                </div>
            </ElegantCard>
        )
    }

    if (galleries.length === 0) {
        return (
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Images Found</h4>
                    <p className="text-gray-600">No gallery images with {activeTab} status.</p>
                </div>
            </ElegantCard>
        )
    }

    return (
        <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {galleries.map((gallery) => (
                    <GalleryCard
                        key={gallery.id}
                        gallery={gallery}
                        processingIds={processingIds}
                        onStatusUpdate={onStatusUpdate}
                        onImageClick={onImageClick}
                        getStatusColor={getStatusColor}
                        getInitials={getInitials}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={onPageChange}
                        isLoading={isLoading || isFetching}
                    />
                </div>
            )}
        </>
    )
}

export default GalleryGrid
