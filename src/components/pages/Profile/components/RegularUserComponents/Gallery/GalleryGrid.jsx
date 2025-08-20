"use client"
import { useState } from 'react'
import { useDeleteGalleryMutation, useUpdateGalleryMutation } from '@/redux/features/gallery/galleryApi'
import { ToastMessage } from '@/utils/ToastMessage'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import Image from 'next/image'
import GlobalModal from '@/components/antd/Modal/GlobalModal'

const GalleryGrid = ({ galleries, userData, onRefresh, isOwner = false }) => {
    const [deleteGallery, { isLoading: isDeleting }] = useDeleteGalleryMutation()
    const [updateGallery, { isLoading: isUpdating }] = useUpdateGalleryMutation()
    const [selectedImage, setSelectedImage] = useState(null)
    const [editingGallery, setEditingGallery] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const canManageGallery = checkUserPermission(userData.roles, PERMISSIONS.MANAGE_GALLERY)

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'inactive': return 'bg-gray-100 text-gray-800'
            case 'pending_approval': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const handleDelete = async (galleryId) => {
        try {
            await deleteGallery(galleryId).unwrap()
            ToastMessage.notifySuccess('Gallery image deleted successfully!')
            setDeleteConfirm(null)
            if (onRefresh) onRefresh()
        } catch (error) {
            console.error('Failed to delete gallery image:', error)
            ToastMessage.notifyError(error.message || 'Failed to delete gallery image')
        }
    }

    const handleEdit = async (galleryData) => {
        try {
            await updateGallery({
                galleryId: editingGallery.id,
                galleryData
            }).unwrap()
            ToastMessage.notifySuccess('Gallery image updated successfully!')
            setEditingGallery(null)
            if (onRefresh) onRefresh()
        } catch (error) {
            console.error('Failed to update gallery image:', error)
            ToastMessage.notifyError(error.message || 'Failed to update gallery image')
        }
    }

    if (!galleries || galleries.length === 0) {
        return (
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Images Yet</h4>
                    <p className="text-gray-600">
                        {isOwner ? "Start uploading images to create your gallery" : "No gallery images available"}
                    </p>
                </div>
            </ElegantCard>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {galleries.map((gallery) => (
                    <ElegantCard key={gallery.id} className="overflow-hidden group p-0">
                        <div className="relative">
                            <Image
                                src={gallery.image}
                                alt={gallery.title || `Gallery image ${gallery.id}`}
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => setSelectedImage(gallery)}
                            />

                            {/* Status Badge */}
                            <div className="absolute top-2 left-2">
                                <BlackTag size="xs" className={getStatusColor(gallery.status)}>
                                    {gallery.status === 'pending_approval' ? 'Pending' : gallery.status}
                                </BlackTag>
                            </div>

                            {/* Action Buttons Overlay */}
                            {(isOwner || canManageGallery) && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <BlackButton
                                        size="xs"
                                        variant="outline"
                                        className="text-white border-white hover:bg-white hover:text-black"
                                        onClick={() => setEditingGallery(gallery)}
                                        disabled={isUpdating}
                                    >
                                        Edit
                                    </BlackButton>
                                    <BlackButton
                                        size="xs"
                                        variant="outline"
                                        className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                                        onClick={() => setDeleteConfirm(gallery)}
                                        disabled={isDeleting}
                                    >
                                        Delete
                                    </BlackButton>
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            {gallery.title && (
                                <h4 className="font-semibold text-gray-900 truncate mb-1">{gallery.title}</h4>
                            )}
                            {gallery.description && (
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{gallery.description}</p>
                            )}
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>Year: {gallery.year}</span>
                                <span>{new Date(gallery.createdAt).toLocaleDateString()}</span>
                            </div>
                            {gallery.like_count > 0 && (
                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                                    </svg>
                                    {gallery.like_count} likes
                                </div>
                            )}
                        </div>
                    </ElegantCard>
                ))}
            </div>

            {/* Image Preview Modal */}
            {selectedImage && (
                <GlobalModal
                    isModalOpen={!!selectedImage}
                    setModalHandler={() => setSelectedImage(null)}
                    title={selectedImage.title || 'Gallery Image'}
                    width={800}
                    closeIcon={true}
                >
                    <div className="p-4">
                        <Image
                            src={selectedImage.image}
                            alt={selectedImage.title || 'Gallery image'}
                            width={800}
                            height={600}
                            className="w-full h-auto max-h-96 object-contain rounded-lg"
                        />
                        {selectedImage.description && (
                            <p className="mt-4 text-gray-700">{selectedImage.description}</p>
                        )}
                        <div className="mt-4 flex justify-between text-sm text-gray-500">
                            <span>Year: {selectedImage.year}</span>
                            <span>Uploaded: {new Date(selectedImage.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </GlobalModal>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <GlobalModal
                    isModalOpen={!!deleteConfirm}
                    setModalHandler={() => setDeleteConfirm(null)}
                    title="Delete Gallery Image"
                    width={500}
                    closeIcon={true}
                >
                    <div className="p-6">
                        <p className="text-gray-700 mb-4">
                            Are you sure you want to delete this gallery image? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <BlackButton
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteConfirm(null)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </BlackButton>
                            <BlackButton
                                size="sm"
                                loading={isDeleting}
                                disabled={isDeleting}
                                onClick={() => handleDelete(deleteConfirm.id)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete Image
                            </BlackButton>
                        </div>
                    </div>
                </GlobalModal>
            )}
        </>
    )
}

export default GalleryGrid
