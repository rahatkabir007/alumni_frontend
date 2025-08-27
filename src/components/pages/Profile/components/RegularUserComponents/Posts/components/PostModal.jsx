"use client"
import { useState } from 'react'
import Image from 'next/image'
import GlobalModal from '@/components/antd/Modal/GlobalModal'
import LikeButton from '@/components/common/LikeButton/LikeButton'
import CommentsList from '@/components/common/Comments/CommentsList'
import BlackTag from '@/components/common/BlackTag'

const PostModal = ({ selectedPost, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    if (!selectedPost) return null

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'inactive': return 'bg-red-100 text-red-800'
            case 'pending_approval': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getVisibilityColor = (visibility) => {
        switch (visibility) {
            case 'public': return 'bg-green-100 text-green-800'
            case 'alumni_only': return 'bg-blue-100 text-blue-800'
            case 'private': return 'bg-gray-100 text-gray-800'
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

    const getVisibilityText = (visibility) => {
        switch (visibility) {
            case 'alumni_only': return 'Alumni Only'
            case 'public': return 'Public'
            case 'private': return 'Private'
            default: return visibility
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
                {/* Status and Visibility Badges */}
                <div className="flex gap-2 mb-4">
                    <BlackTag className={getStatusColor(selectedPost.status)}>
                        {getStatusText(selectedPost.status)}
                    </BlackTag>
                    <BlackTag className={getVisibilityColor(selectedPost.visibility)}>
                        {getVisibilityText(selectedPost.visibility)}
                    </BlackTag>
                </div>

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
                        </div>
                    </div>
                )}

                {/* Post Content */}
                <div className="space-y-4">
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

                    {/* Post Meta */}
                    <div className="text-sm text-gray-500 space-y-1">
                        <p>Created: {new Date(selectedPost.createdAt).toLocaleDateString()}</p>
                        {selectedPost.published_at && (
                            <p>Published: {new Date(selectedPost.published_at).toLocaleDateString()}</p>
                        )}
                    </div>

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
