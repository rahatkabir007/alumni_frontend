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

    const hasImages = selectedPost.images && selectedPost.images.length > 0

    return (
        <GlobalModal
            isModalOpen={!!selectedPost}
            setModalHandler={onClose}
            title={selectedPost.title || 'Post Details'}
            width={1200}
            closeIcon={true}
        >
            <div className="flex h-[80vh]">
                {/* Left Side - Images Slider */}
                {hasImages ? (
                    <div className="flex-1 bg-black flex items-center justify-center relative">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={selectedPost.images[currentImageIndex]}
                                alt={selectedPost.title || 'Post image'}
                                width={800}
                                height={600}
                                className="max-w-full max-h-full object-contain"
                                sizes="(max-width: 768px) 100vw, 600px"
                            />

                            {/* Image Navigation */}
                            {selectedPost.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    {/* Image Counter */}
                                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                                        {currentImageIndex + 1} / {selectedPost.images.length}
                                    </div>
                                </>
                            )}

                            {/* Image Thumbnails */}
                            {selectedPost.images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-xs overflow-x-auto">
                                    {selectedPost.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${currentImageIndex === index
                                                    ? 'border-white'
                                                    : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`Thumbnail ${index + 1}`}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 bg-gray-100 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-lg">No images in this post</p>
                        </div>
                    </div>
                )}

                {/* Right Side - Post Details */}
                <div className="w-96 bg-white overflow-y-auto border-l border-gray-200">
                    <div className="p-6 space-y-4">
                        {/* Status and Visibility Badges */}
                        <div className="flex gap-2">
                            <BlackTag className={getStatusColor(selectedPost.status)}>
                                {getStatusText(selectedPost.status)}
                            </BlackTag>
                            <BlackTag className={getVisibilityColor(selectedPost.visibility)}>
                                {getVisibilityText(selectedPost.visibility)}
                            </BlackTag>
                        </div>

                        {/* Post Title */}
                        {selectedPost.title && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {selectedPost.title}
                                </h3>
                            </div>
                        )}

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
                        <div className="text-sm text-gray-500 space-y-1 pt-4 border-t border-gray-200">
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
                        <div className="border-t border-gray-200 pt-4">
                            <CommentsList
                                type="post"
                                id={selectedPost.id}
                                title="Comments"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </GlobalModal>
    )
}

export default PostModal
