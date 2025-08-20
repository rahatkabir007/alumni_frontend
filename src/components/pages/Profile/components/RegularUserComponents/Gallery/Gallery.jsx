"use client"
import { useState, useEffect } from 'react'
import { useGetMyGalleriesQuery } from '@/redux/features/gallery/galleryApi'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import Pagination from '@/components/common/Pagination'
import GalleryUploadForm from './GalleryUploadForm'
import GalleryGrid from './GalleryGrid'

const Gallery = ({ userData }) => {
    const [showUploadForm, setShowUploadForm] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [yearFilter, setYearFilter] = useState('')

    const canUploadGallery = checkUserPermission(userData.roles, PERMISSIONS.UPLOAD_GALLERY)

    const {
        data: galleryData,
        isLoading,
        isFetching,
        error,
        refetch
    } = useGetMyGalleriesQuery({
        page: currentPage,
        limit: 12,
        year: yearFilter || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    })

    const galleries = galleryData?.galleries || []
    const totalItems = galleryData?.totalItems || 0
    const totalPages = galleryData?.totalPages || 1

    const handleUploadSuccess = () => {
        setShowUploadForm(false)
        refetch()
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleYearChange = (year) => {
        setCurrentPage(1)
        setYearFilter(year)
    }

    const getCurrentYearRange = () => {
        const currentYear = new Date().getFullYear()
        const years = []
        for (let year = currentYear; year >= 1998; year--) {
            years.push(year)
        }
        return years
    }

    if (showUploadForm) {
        return (
            <GalleryUploadForm
                onSuccess={handleUploadSuccess}
                onCancel={() => setShowUploadForm(false)}
            />
        )
    }

    return (
        <div className="space-y-6">
            {/* Header with Upload Button */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">My Gallery</h3>
                        <p className="text-gray-600 text-sm mt-1">
                            Manage your gallery images and memories
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <BlackTag variant="subtle" size="sm">
                            {totalItems} images
                        </BlackTag>
                        {canUploadGallery && (
                            <BlackButton
                                size="sm"
                                onClick={() => setShowUploadForm(true)}
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                }
                            >
                                Upload Image
                            </BlackButton>
                        )}
                    </div>
                </div>
            </ElegantCard>

            {/* Filters */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Year:</label>
                        <select
                            value={yearFilter}
                            onChange={(e) => handleYearChange(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
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
                </div>
            </ElegantCard>

            {/* Loading State */}
            {(isLoading || isFetching) && (
                <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your gallery...</p>
                    </div>
                </ElegantCard>
            )}

            {/* Error State */}
            {error && (
                <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                    <div className="text-center py-12">
                        <div className="text-red-400 text-4xl mb-4">⚠️</div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Gallery</h4>
                        <p className="text-gray-600 mb-4">There was an error loading your gallery images.</p>
                        <BlackButton size="sm" onClick={() => refetch()}>
                            Try Again
                        </BlackButton>
                    </div>
                </ElegantCard>
            )}

            {/* Gallery Grid */}
            {!isLoading && !error && (
                <>
                    <GalleryGrid
                        galleries={galleries}
                        userData={userData}
                        onRefresh={refetch}
                        isOwner={true}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                itemsPerPage={galleryData?.itemsPerPage || 12}
                                onPageChange={handlePageChange}
                                isLoading={isLoading || isFetching}
                            />
                        </div>
                    )}
                </>
            )}



        </div>
    )
}

export default Gallery

