"use client"
import React from 'react'
import GlobalModal from '@/components/antd/Modal/GlobalModal'
import Image from 'next/image'
import CommentsList from '@/components/common/Comments/CommentsList'
import LikeButton from '@/components/common/LikeButton/LikeButton'

const GalleryImageModal = ({ selectedImage, onClose }) => {
    const getInitials = (name) => {
        if (!name) return 'A'
        const parts = name.trim().split(' ')
        if (parts.length === 1) return parts[0][0]
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    if (!selectedImage) return null

    return (
        <GlobalModal
            isModalOpen={!!selectedImage}
            setModalHandler={onClose}
            title={selectedImage.title || 'Gallery Image'}
            width={900}
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
                </div>

                <div className="space-y-4">
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
                        <div className="flex items-center pt-4 border-t border-gray-200">
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
                    )}
                </div>
                <LikeButton
                    type="gallery"
                    id={selectedImage.id}
                    initialLikeCount={selectedImage.like_count}
                    initialIsLiked={selectedImage.isLikedByCurrentUser || false}
                    showCount={true}
                />
                <div className="p-6">
                    <CommentsList
                        type="gallery"
                        id={selectedImage.id}
                        title="Comments"
                    />
                </div>
            </div>
        </GlobalModal>
    )
}

export default GalleryImageModal
