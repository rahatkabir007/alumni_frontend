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
    const [statusFilter, setStatusFilter] = useState('all')
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
        status: statusFilter,
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

    const handleFilterChange = (newFilters) => {
        setCurrentPage(1) // Reset to first page when filters change
        if (newFilters.status !== undefined) setStatusFilter(newFilters.status)
        if (newFilters.year !== undefined) setYearFilter(newFilters.year)
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
                        <label className="text-sm font-medium text-gray-700">Status:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => handleFilterChange({ status: e.target.value })}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="pending_approval">Pending Approval</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Year:</label>
                        <select
                            value={yearFilter}
                            onChange={(e) => handleFilterChange({ year: e.target.value })}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        >
                            <option value="">All Years</option>
                            {getCurrentYearRange().map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    {(statusFilter !== 'all' || yearFilter) && (
                        <BlackButton
                            size="xs"
                            variant="outline"
                            onClick={() => handleFilterChange({ status: 'all', year: '' })}
                        >
                            Clear Filters
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

            {/* Empty State for Users Without Upload Permission */}
            {!canUploadGallery && !isLoading && !error && galleries.length === 0 && (
                <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No Gallery Images</h4>
                        <p className="text-gray-600">
                            You don't have permission to upload gallery images or haven't uploaded any yet.
                        </p>
                    </div>
                </ElegantCard>
            )}
        </div>
    )
}

export default Gallery
