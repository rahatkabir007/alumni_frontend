"use client"
import React from 'react'
import GlobalModal from '@/components/antd/Modal/GlobalModal'
import Image from 'next/image'
import LikeButton from '@/components/common/LikeButton/LikeButton'
import CommentsList from '@/components/common/Comments/CommentsList'

const GalleryImageModal = ({ selectedImage, onClose }) => {
    if (!selectedImage) return null

    const getInitials = (name) => {
        if (!name) return 'A'
        const parts = name.trim().split(' ')
        if (parts.length === 1) return parts[0][0]
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
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
                    </div>
                </div>

                {/* Right Side - Details */}
                <div className="w-96 bg-white overflow-y-auto border-l border-gray-200">
                    <div className="p-6 space-y-4">
                        {/* Author Info */}
                        {selectedImage.user && (
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                {selectedImage.user.profilePhoto ? (
                                    <Image
                                        src={selectedImage.user.profilePhoto}
                                        alt={selectedImage.user.name}
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-lg font-bold">
                                        {getInitials(selectedImage.user.name)}
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {selectedImage.user.name || 'Anonymous'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {selectedImage.user.alumni_type === 'student'
                                            ? `Alumni, Batch ${selectedImage.user.batch}`
                                            : 'Faculty Member'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Uploaded on {new Date(selectedImage.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )}

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

export default GalleryImageModal
