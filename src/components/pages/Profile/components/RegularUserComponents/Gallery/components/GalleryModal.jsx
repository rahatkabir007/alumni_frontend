"use client"
import React from 'react'
import GlobalModal from '@/components/antd/Modal/GlobalModal'
import Image from 'next/image'
import BlackTag from '@/components/common/BlackTag'
import LikeButton from '@/components/common/LikeButton/LikeButton'
import CommentsList from '@/components/common/Comments/CommentsList'

const GalleryModal = ({ selectedImage, onClose }) => {
    if (!selectedImage) return null

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'inactive': return 'bg-red-100 text-red-800'
            case 'pending_approval': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'pending_approval': return 'Pending Approval'
            case 'active': return 'Published'
            case 'inactive': return 'Rejected'
            default: return status
        }
    }

    return (
        <GlobalModal
            isModalOpen={!!selectedImage}
            setModalHandler={onClose}
            title={selectedImage.title || 'Gallery Image'}
            width={1200}
            closeIcon={true}
        >
            <div className="flex h-[80vh]">
                {/* Left Side - Image */}
                <div className="flex-1 bg-black flex items-center justify-center relative">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                            src={selectedImage.image}
                            alt={selectedImage.title || 'Gallery image'}
                            width={800}
                            height={600}
                            className="max-w-full max-h-full object-contain"
                            sizes="(max-width: 768px) 100vw, 600px"
                        />

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                            <BlackTag className={getStatusColor(selectedImage.status)}>
                                {getStatusText(selectedImage.status)}
                            </BlackTag>
                        </div>
                    </div>
                </div>

                {/* Right Side - Details */}
                <div className="w-96 bg-white overflow-y-auto border-l border-gray-200">
                    <div className="p-6 space-y-4">
                        {/* Image Title */}
                        {selectedImage.title && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {selectedImage.title}
                                </h3>
                            </div>
                        )}

                        {/* Image Description */}
                        {selectedImage.description && (
                            <div>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {selectedImage.description}
                                </p>
                            </div>
                        )}

                        {/* Image Meta */}
                        <div className="text-sm text-gray-500 space-y-1 pt-4 border-t border-gray-200">
                            <p>Year: {selectedImage.year}</p>
                            <p>Uploaded: {new Date(selectedImage.createdAt).toLocaleDateString()}</p>
                            {selectedImage.updatedAt && selectedImage.updatedAt !== selectedImage.createdAt && (
                                <p>Last updated: {new Date(selectedImage.updatedAt).toLocaleDateString()}</p>
                            )}
                        </div>

                        {/* Interactions */}
                        <div className="flex items-center justify-between py-4 border-t border-gray-200">
                            <div className="flex items-center gap-6">
                                <LikeButton
                                    type="gallery"
                                    id={selectedImage.id}
                                    initialLikeCount={selectedImage.like_count}
                                    initialIsLiked={selectedImage.isLikedByCurrentUser || false}
                                    showCount={true}
                                />
                                <div className="flex items-center gap-1 text-gray-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.906-1.239L3 21l1.239-4.906A9.863 9.863 0 103 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                                    </svg>
                                    <span className="text-sm font-medium">{selectedImage.comment_count || 0} Comments</span>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="border-t border-gray-200 pt-4">
                            <CommentsList
                                type="gallery"
                                id={selectedImage.id}
                                title="Comments"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </GlobalModal>
    )
}

export default GalleryModal
