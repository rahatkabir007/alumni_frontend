"use client"
import { useState } from 'react'
import Image from 'next/image'
import BlackTag from '@/components/common/BlackTag'
import BlackButton from '@/components/common/BlackButton'
import LikeButton from '@/components/common/LikeButton/LikeButton'

const PostCard = ({ post, onEdit, onDelete, onView, isDeleting, canEdit }) => {
    const [imageError, setImageError] = useState(false)

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

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            {/* Post Images Preview */}
            {post.images && post.images.length > 0 && (
                <div className="relative h-32 overflow-hidden">
                    {!imageError ? (
                        <Image
                            src={post.images[0]}
                            alt={post.title || 'Post image'}
                            fill
                            className="object-cover"
                            onError={() => setImageError(true)}
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}

                    {/* Image Count Indicator */}
                    {post.images.length > 1 && (
                        <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                            +{post.images.length - 1}
                        </div>
                    )}
                </div>
            )}

            <div className="p-4 space-y-3">
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

                {/* Tags Preview */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
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

                {/* Post Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <LikeButton
                            type="post"
                            id={post.id}
                            initialLikeCount={post.like_count}
                            initialIsLiked={post.isLikedByCurrentUser || false}
                            size="sm"
                        />
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.906-1.239L3 21l1.239-4.906A9.863 9.863 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                            </svg>
                            {post.comment_count || 0}
                        </span>
                    </div>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Action Buttons */}
                {canEdit && (
                    <div className="flex gap-2 pt-2">
                        <BlackButton
                            size="xs"
                            variant="outline"
                            onClick={() => onView(post)}
                        >
                            View
                        </BlackButton>
                        <BlackButton
                            size="xs"
                            variant="outline"
                            onClick={() => onEdit(post)}
                        >
                            Edit
                        </BlackButton>
                        <BlackButton
                            size="xs"
                            variant="outline"
                            onClick={() => onDelete(post)}
                            disabled={isDeleting}
                            className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                        >
                            Delete
                        </BlackButton>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostCard
