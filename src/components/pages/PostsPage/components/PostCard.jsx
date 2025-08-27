"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import LikeButton from '@/components/common/LikeButton/LikeButton'
import BlackTag from '@/components/common/BlackTag'

const PostCard = ({ post, onClick, index = 0 }) => {
    const [imageError, setImageError] = useState(false)

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

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

    const getVisibilityColor = (visibility) => {
        switch (visibility) {
            case 'public': return 'bg-green-100 text-green-800'
            case 'alumni_only': return 'bg-blue-100 text-blue-800'
            case 'private': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            onClick={() => onClick(post)}
        >
            {/* Post Images */}
            {post.images && post.images.length > 0 && (
                <div className="relative h-48 overflow-hidden">
                    {!imageError ? (
                        <Image
                            src={post.images[0]}
                            alt={post.title || 'Post image'}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={() => setImageError(true)}
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}

                    {/* Visibility Badge */}
                    <div className="absolute top-3 right-3">
                        <BlackTag size="xs" className={getVisibilityColor(post.visibility)}>
                            {post.visibility === 'alumni_only' ? 'Alumni Only' :
                                post.visibility === 'public' ? 'Public' : 'Private'}
                        </BlackTag>
                    </div>

                    {/* Multiple Images Indicator */}
                    {post.images.length > 1 && (
                        <div className="absolute top-3 left-3">
                            <div className="bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {post.images.length}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="p-6">
                {/* Post Title */}
                {post.title && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                    </h3>
                )}

                {/* Post Body */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {truncateText(post.body)}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
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

                {/* Author Info */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {post.user?.profilePhoto ? (
                            <Image
                                src={post.user.profilePhoto}
                                alt={post.user.name}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                                {getInitials(post.user?.name)}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {post.user?.name || 'Anonymous'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatDate(post.published_at || post.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interactions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                        <LikeButton
                            type="post"
                            id={post.id}
                            initialLikeCount={post.like_count}
                            initialIsLiked={post.isLikedByCurrentUser || false}
                            size="sm"
                        />
                        <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.906-1.239L3 21l1.239-4.906A9.863 9.863 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                            </svg>
                            <span className="text-xs font-medium">{post.comment_count || 0}</span>
                        </button>
                    </div>

                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default PostCard
