"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import LikeButton from '@/components/common/LikeButton/LikeButton'

const PostManagementCard = ({
    post,
    onStatusUpdate,
    onPostClick,
    isProcessing,
    getStatusColor,
    getVisibilityColor
}) => {
    const [imageErrors, setImageErrors] = useState({})

    const getInitials = (name) => {
        if (!name) return 'A'
        const parts = name.trim().split(' ')
        if (parts.length === 1) return parts[0][0]
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    const truncateText = (text, maxLength = 150) => {
        if (!text) return ''
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'pending_approval': return 'Pending'
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

    const handleImageError = (index) => {
        setImageErrors(prev => ({ ...prev, [index]: true }))
    }

    const renderImages = () => {
        if (!post.images || post.images.length === 0) return null

        const imagesToShow = post.images.slice(0, 2)
        const remainingCount = post.images.length - 2

        return (
            <div className="grid grid-cols-6 gap-2 mt-3">
                {imagesToShow.map((image, index) => (
                    <div key={index} className="relative h-24 rounded overflow-hidden">
                        {!imageErrors[index] ? (
                            <Image
                                src={image}
                                alt={`Post image ${index + 1}`}
                                fill
                                className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                onError={() => handleImageError(index)}
                                onClick={() => onPostClick(post)}
                                sizes="(max-width: 640px) 50vw, 150px"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center cursor-pointer" onClick={() => onPostClick(post)}>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}

                        {/* Show count on the second image if there are more */}
                        {index === 1 && remainingCount > 0 && (
                            <div
                                className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold cursor-pointer"
                                onClick={() => onPostClick(post)}
                            >
                                +{remainingCount}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    const renderActionButtons = () => {
        if (post.status === 'pending_approval') {
            return (
                <div className="flex gap-2">
                    <BlackButton
                        size="xs"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => onStatusUpdate(post.id, 'active')}
                        disabled={isProcessing}
                        loading={isProcessing}
                    >
                        Approve
                    </BlackButton>
                    <BlackButton
                        size="xs"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => onStatusUpdate(post.id, 'inactive')}
                        disabled={isProcessing}
                    >
                        Reject
                    </BlackButton>
                </div>
            )
        } else if (post.status === 'inactive') {
            return (
                <BlackButton
                    size="xs"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => onStatusUpdate(post.id, 'active')}
                    disabled={isProcessing}
                    loading={isProcessing}
                >
                    Approve
                </BlackButton>
            )
        } else if (post.status === 'active') {
            return (
                <BlackButton
                    size="xs"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => onStatusUpdate(post.id, 'inactive')}
                    disabled={isProcessing}
                >
                    Reject
                </BlackButton>
            )
        }
        return null
    }

    return (
        <ElegantCard className="overflow-hidden">
            <div className="p-4 space-y-3">
                {/* Author Info */}
                <div className="flex items-center gap-3">
                    {post.user?.profilePhoto ? (
                        <Image
                            src={post.user.profilePhoto}
                            alt={post.user.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                            {getInitials(post.user?.name)}
                        </div>
                    )}
                    <div className="flex-1">
                        <p className="font-medium text-gray-900">
                            {post.user?.name || 'Anonymous'}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{post.like_count || 0} likes</span>
                            <span>•</span>
                            <span>{post.comment_count || 0} comments</span>
                        </div>
                    </div>
                </div>

                {/* Status and Visibility Badges */}
                <div className="flex flex-wrap gap-2">
                    <BlackTag size="xs" className={getStatusColor(post.status)}>
                        {getStatusText(post.status)}
                    </BlackTag>
                    <BlackTag size="xs" className={getVisibilityColor(post.visibility)}>
                        {getVisibilityText(post.visibility)}
                    </BlackTag>
                </div>

                {/* Post Title */}
                {post.title && (
                    <h4 className="font-semibold text-gray-900 text-lg line-clamp-2">
                        {post.title}
                    </h4>
                )}

                {/* Post Content Preview */}
                <p className="text-gray-700 text-sm line-clamp-3">
                    {truncateText(post.body)}
                </p>

                {/* Post Images - Below description */}
                {renderImages()}

                {/* Tags Preview */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.slice(0, 3).map((tag, index) => (
                            <BlackTag key={index} size="xs" variant="subtle">
                                #{tag}
                            </BlackTag>
                        ))}
                        {post.tags.length > 3 && (
                            <BlackTag size="xs" variant="subtle">
                                +{post.tags.length - 3}
                            </BlackTag>
                        )}
                    </div>
                )}

                {/* Post Interactions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                        <LikeButton
                            type="post"
                            id={post.id}
                            initialLikeCount={post.like_count}
                            initialIsLiked={post.isLikedByCurrentUser || false}
                            size="sm"
                        />
                        <button
                            onClick={() => onPostClick(post)}
                            className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.906-1.239L3 21l1.239-4.906A9.863 9.863 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                            </svg>
                            <span className="text-xs font-medium">View Details</span>
                        </button>
                    </div>

                    {/* Management Actions */}
                    <div className="flex gap-2">
                        {renderActionButtons()}
                    </div>
                </div>
            </div>
        </ElegantCard>
    )
}

export default PostManagementCard
