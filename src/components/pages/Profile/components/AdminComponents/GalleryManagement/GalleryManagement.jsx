"use client"
import React from 'react'
import { useGetAllGalleriesQuery, useUpdateGalleryStatusMutation } from '@/redux/features/gallery/galleryApi'
import { useGalleryManagement } from '@/hooks/useGalleryManagement'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'
import { ToastMessage } from '@/utils/ToastMessage'
import GalleryManagementHeader from './components/GalleryManagementHeader'
import GalleryTabs from './components/GalleryTabs'
import GalleryGrid from './components/GalleryGrid'
import GalleryImageModal from './components/GalleryImageModal'
import AccessDenied from './components/AccessDenied'

const GalleryManagement = ({ userData }) => {
    const {
        activeTab,
        currentPage,
        yearFilter,
        selectedImage,
        processingIds,
        handleTabChange,
        handlePageChange,
        handleYearChange,
        handleImageClick,
        closeImageModal,
        startProcessing,
        stopProcessing,
        isProcessing
    } = useGalleryManagement()

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
        status: activeTab,
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
            'pending_approval': ['active', 'inactive'],
            'inactive': ['active'],
            'active': ['inactive']
        }

        if (!validTransitions[currentStatus]?.includes(newStatus)) {
            ToastMessage.notifyError(`Cannot change status from ${currentStatus} to ${newStatus}`)
            return
        }

        startProcessing(galleryId)

        try {
            await updateGalleryStatus({
                galleryId,
                status: newStatus
            }).unwrap()

            const actionText = newStatus === 'active' ? 'approved' : 'inactive'
            ToastMessage.notifySuccess(`Gallery ${actionText} successfully!`)

            setTimeout(() => {
                refetch()
            }, 500)

            if (selectedImage && selectedImage.id === galleryId) {
                closeImageModal()
            }

        } catch (error) {
            console.error('Failed to update gallery status:', error)
            const errorMessage = error?.data?.message || error?.message || 'Failed to update gallery status'
            ToastMessage.notifyError(errorMessage)
        } finally {
            stopProcessing(galleryId)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'inactive': return 'bg-red-100 text-red-800'
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

    if (!canManageGallery) {
        return <AccessDenied />
    }

    return (
        <div className="space-y-6">
            <GalleryManagementHeader />

            <GalleryTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                yearFilter={yearFilter}
                onYearChange={handleYearChange}
                totalItems={totalItems}
                filteredCount={galleries.length}
            />

            <GalleryGrid
                galleries={galleries}
                isLoading={isLoading}
                isFetching={isFetching}
                error={error}
                activeTab={activeTab}
                processingIds={processingIds}
                onStatusUpdate={handleStatusUpdate}
                onImageClick={handleImageClick}
                getStatusColor={getStatusColor}
                getInitials={getInitials}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={galleryData?.itemsPerPage || 15}
                onPageChange={handlePageChange}
                onRefetch={refetch}
            />

            <GalleryImageModal
                selectedImage={selectedImage}
                onClose={closeImageModal}
                processingIds={processingIds}
                onStatusUpdate={handleStatusUpdate}
                getStatusColor={getStatusColor}
                getInitials={getInitials}
            />
        </div>
    )
}

export default GalleryManagement