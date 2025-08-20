"use client"
import { useState } from 'react'
import { useDeleteGalleryMutation } from '@/redux/features/gallery/galleryApi'
import { ToastMessage } from '@/utils/ToastMessage'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import Image from 'next/image'
import GlobalModal from '@/components/antd/Modal/GlobalModal'
import GalleryUploadForm from './GalleryUploadForm'
import GalleryInteractions from '@/components/common/GalleryInteractions/GalleryInteractions'
import LikeButton from '@/components/common/LikeButton/LikeButton'
import CommentsList from '@/components/common/Comments/CommentsList'

const GalleryGrid = ({ galleries, userData, onRefresh, isOwner = false }) => {
    const [deleteGallery, { isLoading: isDeleting }] = useDeleteGalleryMutation()
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

    const handleEditSuccess = (result) => {
        setEditingGallery(null)
        if (onRefresh) onRefresh()
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
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                {/* View Button */}
                                <button
                                    onClick={() => setSelectedImage(gallery)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                                    title="View image"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>

                                {/* Edit and Delete buttons for owner/admin */}
                                {(isOwner || canManageGallery) && (
                                    <>
                                        {/* Edit Button */}
                                        <button
                                            onClick={() => setEditingGallery(gallery)}
                                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
                                            title="Edit image"
                                            disabled={isDeleting}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => setDeleteConfirm(gallery)}
                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                                            title="Delete image"
                                            disabled={isDeleting}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="p-4">
                            {gallery.title && (
                                <h4 className="font-semibold text-gray-900 truncate mb-1">{gallery.title}</h4>
                            )}
                            {gallery.description && (
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{gallery.description}</p>
                            )}
                            <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                                <span>Year: {gallery.year}</span>
                                <span>{new Date(gallery.createdAt).toLocaleDateString()}</span>
                            </div>

                            {/* Gallery Interactions */}
                            <GalleryInteractions gallery={gallery} showInline={false} />
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
                    width={900}
                    closeIcon={true}
                >
                    <div className="p-4">
                        <Image
                            src={selectedImage.image}
                            alt={selectedImage.title || 'Gallery image'}
                            width={800}
                            height={600}
                            className="w-full h-auto max-h-96 object-contain rounded-lg mb-4"
                        />
                        {selectedImage.description && (
                            <p className="mb-4 text-gray-700">{selectedImage.description}</p>
                        )}
                        <div className="mb-4 flex justify-between text-sm text-gray-500">
                            <span>Year: {selectedImage.year}</span>
                            <span>Uploaded: {new Date(selectedImage.createdAt).toLocaleDateString()}</span>
                        </div>

                        {/* Interactions in Modal */}
                        <LikeButton
                            type="gallery"
                            id={selectedImage.id}
                            initialLikeCount={selectedImage.like_count}
                            initialIsLiked={selectedImage.isLikedByCurrentUser || false}
                            showCount={true}
                        />
                        <CommentsList
                            type="gallery"
                            id={selectedImage.id}
                            title="Comments"
                        />
                    </div>
                </GlobalModal>
            )}

            {/* Edit Gallery Modal */}
            {editingGallery && (
                <GlobalModal
                    isModalOpen={!!editingGallery}
                    setModalHandler={() => setEditingGallery(null)}
                    title="Edit Gallery Image"
                    width={800}
                    closeIcon={true}
                >
                    <div className="p-6">
                        <GalleryUploadForm
                            editData={editingGallery}
                            isEditMode={true}
                            onSuccess={handleEditSuccess}
                            onCancel={() => setEditingGallery(null)}
                        />
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
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">Are you sure?</h3>
                                <p className="text-gray-700">
                                    This will permanently delete "{deleteConfirm.title}" from your gallery. This action cannot be undone.
                                </p>
                            </div>
                        </div>
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
