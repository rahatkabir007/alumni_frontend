"use client"
import React from 'react'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import Image from 'next/image'

const PostManagementCard = ({
    post,
    onStatusUpdate,
    onPostClick,
    isProcessing,
    getStatusColor,
    getVisibilityColor
}) => {
    const getInitials = (name) => {
        if (!name) return 'A'
        const parts = name.trim().split(' ')
        if (parts.length === 1) return parts[0][0]
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    const truncateText = (text, maxLength = 200) => {
        if (!text) return ''
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    return (
        <ElegantCard className="overflow-hidden">
            <div className="space-y-4">
                {/* Post Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        {post.title && (
                            <h4 className="font-semibold text-gray-900 text-lg mb-2">
                                {post.title}
                            </h4>
                        )}
                        <div className="flex flex-wrap gap-2 mb-3">
                            <BlackTag size="xs" className={getStatusColor(post.status)}>
                                {post.status === 'pending_approval' ? 'Pending' :
                                    post.status === 'active' ? 'Published' : 'Rejected'}
                            </BlackTag>
                            <BlackTag size="xs" className={getVisibilityColor(post.visibility)}>
                                {post.visibility === 'alumni_only' ? 'Alumni Only' :
                                    post.visibility === 'public' ? 'Public' : 'Private'}
                            </BlackTag>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <BlackButton
                            size="xs"
                            variant="outline"
                            onClick={() => onPostClick(post)}
                        >
                            View
                        </BlackButton>
                        {post.status === 'pending_approval' && (
                            <>
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
                            </>
                        )}
                    </div>
                </div>

                {/* Post Images Preview */}
                {post.images && post.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                        {post.images.slice(0, 3).map((image, index) => (
                            <div key={index} className="relative h-20 rounded overflow-hidden">
                                <Image
                                    src={image}
                                    alt={`Post image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 33vw, 100px"
                                />
                                {index === 2 && post.images.length > 3 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-semibold">
                                        +{post.images.length - 3}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Post Content Preview */}
                <div className="space-y-3">
                    <p className="text-gray-700 text-sm">
                        {truncateText(post.body)}
                    </p>

                    {/* Tags Preview */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 5).map((tag, index) => (
                                <BlackTag key={index} size="xs" variant="subtle">
                                    #{tag}
                                </BlackTag>
                            ))}
                            {post.tags.length > 5 && (
                                <BlackTag size="xs" variant="subtle">
                                    +{post.tags.length - 5}
                                </BlackTag>
                            )}
                        </div>
                    )}

                    {/* Author Info */}
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                            {getInitials(post.user?.name)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {post.user?.name || 'Anonymous'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()} • {post.like_count || 0} likes • {post.comment_count || 0} comments
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ElegantCard>
    )
}

export default PostManagementCard
