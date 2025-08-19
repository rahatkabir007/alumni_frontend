"use client"
import React, { useState, useEffect } from 'react'
import { useGetAllGalleriesQuery, useUpdateGalleryStatusMutation } from '@/redux/features/gallery/galleryApi'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'
import { ToastMessage } from '@/utils/ToastMessage'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import Pagination from '@/components/common/Pagination'
import GlobalModal from '@/components/antd/Modal/GlobalModal'
import Image from 'next/image'

const GalleryManagement = ({ userData }) => {
    const [activeTab, setActiveTab] = useState('pending_approval')
    const [currentPage, setCurrentPage] = useState(1)
    const [yearFilter, setYearFilter] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [processingIds, setProcessingIds] = useState(new Set())

    const canManageGallery = checkUserPermission(userData.roles, PERMISSIONS.MANAGE_GALLERY)

    const [updateGalleryStatus] = useUpdateGalleryStatusMutation()

    const {
        data: galleryData,
        isLoading,
        isFetching,
        error,
        refetch
    } = useGetAllGalleriesQuery({
        page: currentPage,
        limit: 15,
        status: activeTab, // Always pass the activeTab as status
        year: yearFilter || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    })

    // Filter galleries on frontend as additional safety
    const galleries = (galleryData?.galleries || []).filter(gallery => {
        return gallery.status === activeTab
    })

    const totalItems = galleryData?.totalItems || 0
    const totalPages = galleryData?.totalPages || 1

    const tabs = [
        { id: 'pending_approval', label: 'Pending Approval', count: 0 },
        { id: 'active', label: 'Approved', count: 0 },
        { id: 'rejected', label: 'Rejected', count: 0 }
    ]

    const getCurrentYearRange = () => {
        const currentYear = new Date().getFullYear()
        const years = []
        for (let year = currentYear; year >= 1998; year--) {
            years.push(year)
        }
        return years
    }

    const handleTabChange = (tabId) => {
        setActiveTab(tabId)
        setCurrentPage(1)
        setSelectedImage(null)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleYearChange = (year) => {
        setCurrentPage(1)
        setYearFilter(year)
    }

    const handleStatusUpdate = async (galleryId, newStatus) => {
        if (!canManageGallery) {
            ToastMessage.notifyError('You do not have permission to manage gallery')
            return
        }

        const gallery = galleries.find(g => g.id === galleryId)
        if (!gallery) {
            ToastMessage.notifyError('Gallery item not found')
            return
        }

        const currentStatus = gallery.status

        // Validate status transitions
        const validTransitions = {
            'pending_approval': ['active', 'rejected'],
            'rejected': ['active'],
            'active': ['rejected'] // Allow rejecting approved items if needed
        }

        if (!validTransitions[currentStatus]?.includes(newStatus)) {
            ToastMessage.notifyError(`Cannot change status from ${currentStatus} to ${newStatus}`)
            return
        }

        setProcessingIds(prev => new Set(prev).add(galleryId))

        try {
            await updateGalleryStatus({
                galleryId,
                status: newStatus
            }).unwrap()

            const actionText = newStatus === 'active' ? 'approved' : 'rejected'
            ToastMessage.notifySuccess(`Gallery ${actionText} successfully!`)

            // Force refetch to update the data
            setTimeout(() => {
                refetch()
            }, 500)

            if (selectedImage && selectedImage.id === galleryId) {
                setSelectedImage(null)
            }

        } catch (error) {
            console.error('Failed to update gallery status:', error)
            const errorMessage = error?.data?.message || error?.message || 'Failed to update gallery status'
            ToastMessage.notifyError(errorMessage)
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev)
                newSet.delete(galleryId)
                return newSet
            })
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'rejected': return 'bg-red-100 text-red-800'
            case 'pending_approval': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getInitials = (name) => {
        if (!name) return 'A'
        const parts = name.trim().split(' ')
        if (parts.length === 1) return parts[0][0]
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    const renderActionButtons = (gallery) => {
        const isProcessing = processingIds.has(gallery.id)
        const currentStatus = gallery.status

        if (currentStatus === 'pending_approval') {
            return (
                <div className="flex gap-2">
                    <BlackButton
                        size="xs"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleStatusUpdate(gallery.id, 'active')}
                        disabled={isProcessing}
                        loading={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Approve'}
                    </BlackButton>
                    <BlackButton
                        size="xs"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleStatusUpdate(gallery.id, 'rejected')}
                        disabled={isProcessing}
                    >
                        Reject
                    </BlackButton>
                </div>
            )
        } else if (currentStatus === 'rejected') {
            return (
                <BlackButton
                    size="xs"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleStatusUpdate(gallery.id, 'active')}
                    disabled={isProcessing}
                    loading={isProcessing}
                >
                    {isProcessing ? 'Processing...' : 'Approve'}
                </BlackButton>
            )
        } else if (currentStatus === 'active') {
            return (
                <div className="flex gap-2">
                    <BlackTag size="xs" className="bg-green-100 text-green-800">
                        Approved
                    </BlackTag>
                    <BlackButton
                        size="xs"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleStatusUpdate(gallery.id, 'rejected')}
                        disabled={isProcessing}
                    >
                        Reject
                    </BlackButton>
                </div>
            )
        }

        return null
    }

    if (!canManageGallery) {
        return (
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="text-center py-12">
                    <div className="text-red-400 text-4xl mb-4">🔒</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h4>
                    <p className="text-gray-600">You don't have permission to manage gallery.</p>
                </div>
            </ElegantCard>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Gallery Management</h3>
                    <p className="text-gray-600 text-sm mt-1">
                        Manage and moderate gallery images uploaded by users
                    </p>
                </div>
            </ElegantCard>

            {/* Tabs */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                                {totalItems > 0 && activeTab === tab.id && (
                                    <BlackTag size="xs" className="ml-2">
                                        {totalItems}
                                    </BlackTag>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Filters */}
                <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
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

                    {/* Debug info - remove in production */}
                    <div className="text-xs text-gray-500">
                        Status Filter: {activeTab} | Total: {totalItems} | Filtered: {galleries.length}
                    </div>
                </div>
            </ElegantCard>

            {/* Content */}
            {isLoading || isFetching ? (
                <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading gallery images...</p>
                    </div>
                </ElegantCard>
            ) : error ? (
                <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                    <div className="text-center py-12">
                        <div className="text-red-400 text-4xl mb-4">⚠️</div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Gallery</h4>
                        <p className="text-gray-600 mb-4">There was an error loading gallery images.</p>
                        <BlackButton size="sm" onClick={() => refetch()}>
                            Try Again
                        </BlackButton>
                    </div>
                </ElegantCard>
            ) : galleries.length === 0 ? (
                <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No Images Found</h4>
                        <p className="text-gray-600">No gallery images with {activeTab} status.</p>
                    </div>
                </ElegantCard>
            ) : (
                <>
                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {galleries.map((gallery) => (
                            <ElegantCard key={gallery.id} className="overflow-hidden p-0">
                                <div className="relative">
                                    <Image
                                        src={gallery.image}
                                        alt={gallery.title || `Gallery image`}
                                        width={300}
                                        height={200}
                                        className="w-full h-32 object-cover cursor-pointer hover:scale-105 transition-transform"
                                        onClick={() => setSelectedImage(gallery)}
                                    />

                                    {/* Status Badge */}
                                    <div className="absolute top-2 left-2">
                                        <BlackTag size="xs" className={getStatusColor(gallery.status)}>
                                            {gallery.status}
                                        </BlackTag>
                                    </div>
                                </div>

                                <div className="p-3">
                                    {gallery.title && (
                                        <h4 className="font-medium text-gray-900 truncate text-sm mb-1">
                                            {gallery.title}
                                        </h4>
                                    )}

                                    <div className="flex items-center mb-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold mr-2">
                                            {getInitials(gallery.user?.name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-600 truncate">
                                                {gallery.user?.name || 'Unknown User'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {gallery.year} • {new Date(gallery.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-2">
                                        {renderActionButtons(gallery)}
                                    </div>
                                </div>
                            </ElegantCard>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                itemsPerPage={galleryData?.itemsPerPage || 15}
                                onPageChange={handlePageChange}
                                isLoading={isLoading || isFetching}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Image Preview Modal */}
            {selectedImage && (
                <GlobalModal
                    isModalOpen={!!selectedImage}
                    setModalHandler={() => setSelectedImage(null)}
                    title={`Gallery Image - ${selectedImage.status}`}
                    width={800}
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

                            {/* Status Badge */}
                            <div className="absolute top-4 right-4">
                                <BlackTag className={getStatusColor(selectedImage.status)}>
                                    {selectedImage.status}
                                </BlackTag>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {selectedImage.title && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Title</h4>
                                    <p className="text-gray-700">{selectedImage.title}</p>
                                </div>
                            )}

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
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <div className="flex items-center">
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

                                    <div>
                                        {renderActionButtons(selectedImage)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </GlobalModal>
            )}
        </div>
    )
}

export default GalleryManagement