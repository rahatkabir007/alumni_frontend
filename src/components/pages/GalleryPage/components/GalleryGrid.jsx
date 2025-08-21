"use client"
import React from 'react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import Pagination from '@/components/common/Pagination'
import GalleryImageCard from './GalleryImageCard'
import GalleryLoadingState from './GalleryLoadingState'
import GalleryErrorState from './GalleryErrorState'
import GalleryEmptyState from './GalleryEmptyState'

const GalleryGrid = ({
    galleries,
    isLoading,
    isFetching,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onImageClick
}) => {
    if (isLoading || isFetching) {
        return <GalleryLoadingState />
    }

    if (error) {
        return <GalleryErrorState />
    }

    if (galleries.length === 0) {
        return <GalleryEmptyState />
    }

    return (
        <ScrollReveal direction="up" delay={0.5}>
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Masonry/Staggered Grid */}
                    <StaggerContainer staggerDelay={0.05} className="columns-1 sm:columns-2 md:columns-3 lg:columns-5 gap-4 space-y-4">
                        {galleries.map((gallery) => (
                            <GalleryImageCard
                                key={gallery.id}
                                gallery={gallery}
                                onClick={() => onImageClick(gallery)}
                            />
                        ))}
                    </StaggerContainer>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-12">
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
                </div>
            </section>
        </ScrollReveal>
    )
}

export default GalleryGrid
