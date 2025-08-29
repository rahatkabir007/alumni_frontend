"use client"
import { useState } from 'react'
import Image from 'next/image'
import GlobalModal from '@/components/antd/Modal/GlobalModal'
import LikeButton from '@/components/common/LikeButton/LikeButton'
import CommentsList from '@/components/common/Comments/CommentsList'
import BlackTag from '@/components/common/BlackTag'
import BlackButton from '@/components/common/BlackButton'

const PostManagementModal = ({
    selectedPost,
    onClose,
    onStatusUpdate,
    isProcessing,
    getStatusColor,
    getVisibilityColor
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    if (!selectedPost) return null

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

    const getInitials = (name) => {
        if (!name) return 'A'
        const parts = name.trim().split(' ')
        if (parts.length === 1) return parts[0][0]
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
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

    const renderManagementActions = () => {
        if (selectedPost.status === 'pending_approval') {
            return (
                <div className="flex gap-3">
                    <BlackButton
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => onStatusUpdate(selectedPost.id, 'active')}
                        disabled={isProcessing}
                        loading={isProcessing}
                    >
                        Approve Post
                    </BlackButton>
                    <BlackButton
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => onStatusUpdate(selectedPost.id, 'inactive')}
                        disabled={isProcessing}
                    >
                        Reject Post
                    </BlackButton>
                </div>
            )
        } else if (selectedPost.status === 'inactive') {
            return (
                <BlackButton
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => onStatusUpdate(selectedPost.id, 'active')}
                    disabled={isProcessing}
                    loading={isProcessing}
                >
                    Approve Post
                </BlackButton>
            )
        } else if (selectedPost.status === 'active') {
            return (
                <BlackButton
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => onStatusUpdate(selectedPost.id, 'inactive')}
                    disabled={isProcessing}
                >
                    Reject Post
                </BlackButton>
            )
        }
        return null
    }

    return (
        <GlobalModal
            isModalOpen={!!selectedPost}
            setModalHandler={onClose}
            title={selectedPost.title || 'Post Management'}
            width={hasImages ? 1200 : 800}
            closeIcon={true}
        >
            {hasImages ? (
                <div className="flex h-[80vh]">
                    {/* Left Side - Images Slider */}
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

                    {/* Right Side - Post Details */}
                    <div className="w-96 bg-white overflow-y-auto border-l border-gray-200">
                        <div className="p-6 space-y-4">
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
                                        {new Date(selectedPost.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

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

                            {/* Management Actions */}
                            <div className="pt-4 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Management Actions</h4>
                                {renderManagementActions()}
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
            ) : (
                /* Full Width Layout - No Images */
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Author Info */}
                        <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                            {selectedPost.user?.profilePhoto ? (
                                <Image
                                    src={selectedPost.user.profilePhoto}
                                    alt={selectedPost.user.name}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold">
                                    {getInitials(selectedPost.user?.name)}
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="font-semibold text-lg text-gray-900">
                                    {selectedPost.user?.name || 'Anonymous'}
                                </p>
                                <p className="text-gray-600">
                                    {selectedPost.user?.alumni_type === 'student'
                                        ? `Alumni, Batch ${selectedPost.user?.batch}`
                                        : 'Faculty Member'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Posted on {new Date(selectedPost.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Status and Visibility Badges */}
                        <div className="flex gap-3">
                            <BlackTag size="md" className={getStatusColor(selectedPost.status)}>
                                {getStatusText(selectedPost.status)}
                            </BlackTag>
                            <BlackTag size="md" className={getVisibilityColor(selectedPost.visibility)}>
                                {getVisibilityText(selectedPost.visibility)}
                            </BlackTag>
                        </div>

                        {/* Post Title */}
                        {selectedPost.title && (
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    {selectedPost.title}
                                </h1>
                            </div>
                        )}

                        {/* Post Body */}
                        <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
                                {selectedPost.body}
                            </p>
                        </div>

                        {/* Tags */}
                        {selectedPost.tags && selectedPost.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {selectedPost.tags.map((tag, index) => (
                                    <BlackTag key={index} size="md" variant="subtle">
                                        #{tag}
                                    </BlackTag>
                                ))}
                            </div>
                        )}

                        {/* Management Actions */}
                        <div className="pt-6 border-t border-gray-200">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Management Actions</h4>
                            {renderManagementActions()}
                        </div>

                        {/* Interactions */}
                        <div className="flex items-center justify-between py-6 border-t border-gray-200">
                            <div className="flex items-center gap-8">
                                <LikeButton
                                    type="post"
                                    id={selectedPost.id}
                                    initialLikeCount={selectedPost.like_count}
                                    initialIsLiked={selectedPost.isLikedByCurrentUser || false}
                                    showCount={true}
                                    size="lg"
                                />
                                <div className="flex items-center gap-2 text-gray-500">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.906-1.239L3 21l1.239-4.906A9.863 9.863 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                                    </svg>
                                    <span className="text-base font-medium">{selectedPost.comment_count || 0} Comments</span>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="border-t border-gray-200 pt-6">
                            <CommentsList
                                type="post"
                                id={selectedPost.id}
                                title="Comments"
                            />
                        </div>
                    </div>
                </div>
            )}
        </GlobalModal>
    )
}

export default PostManagementModal
