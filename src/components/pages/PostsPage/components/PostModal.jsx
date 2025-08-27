"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import GlobalModal from '@/components/antd/Modal/GlobalModal'
import LikeButton from '@/components/common/LikeButton/LikeButton'
import CommentsList from '@/components/common/Comments/CommentsList'
import BlackTag from '@/components/common/BlackTag'

const PostModal = ({ selectedPost, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    if (!selectedPost) return null

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getInitials = (name) => {
        if (!name) return 'A'
        const parts = name.trim().split(' ')
        if (parts.length === 1) return parts[0][0]
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    const getVisibilityColor = (visibility) => {
        switch (visibility) {
            case 'public': return 'bg-green-100 text-green-800'
            case 'alumni_only': return 'bg-blue-100 text-blue-800'
            case 'private': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const nextImage = () => {
        if (selectedPost.images && selectedPost.images.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === selectedPost.images.length - 1 ? 0 : prev + 1
            )
        }
    }

    const prevImage = () => {
        if (selectedPost.images && selectedPost.images.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? selectedPost.images.length - 1 : prev - 1
            )
        }
    }

    return (
        <GlobalModal
            isModalOpen={!!selectedPost}
            setModalHandler={onClose}
            title={selectedPost.title || 'Post Details'}
            width={900}
            closeIcon={true}
        >
            <div className="p-6 max-h-[80vh] overflow-y-auto">
                {/* Post Images */}
                {selectedPost.images && selectedPost.images.length > 0 && (
                    <div className="relative mb-6">
                        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                            <Image
                                src={selectedPost.images[currentImageIndex]}
                                alt={selectedPost.title || 'Post image'}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 800px"
                            />

                            {/* Image Navigation */}
                            {selectedPost.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    {/* Image Counter */}
                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                                        {currentImageIndex + 1} / {selectedPost.images.length}
                                    </div>
                                </>
                            )}

                            {/* Visibility Badge */}
                            <div className="absolute top-3 right-3">
                                <BlackTag size="sm" className={getVisibilityColor(selectedPost.visibility)}>
                                    {selectedPost.visibility === 'alumni_only' ? 'Alumni Only' :
                                        selectedPost.visibility === 'public' ? 'Public' : 'Private'}
                                </BlackTag>
                            </div>
                        </div>
                    </div>
                )}

                {/* Post Content */}
                <div className="space-y-4">
                    {/* Author Info */}
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                        {selectedPost.user?.profilePhoto ? (
                            <Image
                                src={selectedPost.user.profilePhoto}
                                alt={selectedPost.user.name}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-lg font-bold">
                                {getInitials(selectedPost.user?.name)}
                            </div>
                        )}
                        <div>
                            <p className="font-medium text-gray-900">
                                {selectedPost.user?.name || 'Anonymous'}
                            </p>
                            <p className="text-sm text-gray-600">
                                {selectedPost.user?.alumni_type === 'student'
                                    ? `Alumni, Batch ${selectedPost.user?.batch}`
                                    : 'Faculty Member'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatDate(selectedPost.published_at || selectedPost.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Post Body */}
                    <div>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {selectedPost.body}
                        </p>
                    </div>

                    {/* Tags */}
                    {selectedPost.tags && selectedPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selectedPost.tags.map((tag, index) => (
                                <BlackTag key={index} size="sm" variant="subtle">
                                    #{tag}
                                </BlackTag>
                            ))}
                        </div>
                    )}

                    {/* Interactions */}
                    <div className="flex items-center justify-between py-4 border-t border-gray-200">
                        <div className="flex items-center gap-6">
                            <LikeButton
                                type="post"
                                id={selectedPost.id}
                                initialLikeCount={selectedPost.like_count}
                                initialIsLiked={selectedPost.isLikedByCurrentUser || false}
                                showCount={true}
                            />
                            <div className="flex items-center gap-1 text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.906-1.239L3 21l1.239-4.906A9.863 9.863 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                                </svg>
                                <span className="text-sm font-medium">{selectedPost.comment_count || 0} Comments</span>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <CommentsList
                        type="post"
                        id={selectedPost.id}
                        title="Comments"
                    />
                </div>
            </div>
        </GlobalModal>
    )
}

export default PostModal
