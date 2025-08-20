"use client"
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@/redux/features/auth/authSlice'
import { useToggleLikeMutation, useGetLikeStatusQuery } from '@/redux/features/comments/commentsApi'
import { ToastMessage } from '@/utils/ToastMessage'

const LikeButton = ({
    type,
    id,
    initialLikeCount = 0,
    initialIsLiked = false,
    size = 'md',
    showCount = true,
    className = ''
}) => {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const [optimisticLikeCount, setOptimisticLikeCount] = useState(initialLikeCount)
    const [optimisticIsLiked, setOptimisticIsLiked] = useState(initialIsLiked)

    // const { data: likeStatus, refetch } = useGetLikeStatusQuery(
    //     { type, id },
    //     { skip: !isAuthenticated }
    // )

    const [toggleLike, { isLoading }] = useToggleLikeMutation()

    // Update optimistic state when real data comes in or initial props change
    // useEffect(() => {
    //     if (likeStatus) {
    //         setOptimisticLikeCount(likeStatus.likeCount || initialLikeCount)
    //         setOptimisticIsLiked(likeStatus.isLiked || initialIsLiked)
    //     } else {
    //         // Use initial props if no server data
    //         setOptimisticLikeCount(initialLikeCount)
    //         setOptimisticIsLiked(initialIsLiked)
    //     }
    // }, [likeStatus, initialLikeCount, initialIsLiked])

    const handleLike = async () => {
        if (!isAuthenticated) {
            ToastMessage.notifyError('Please login to like this item')
            return
        }

        // Optimistic update
        const newIsLiked = !optimisticIsLiked
        const newLikeCount = newIsLiked
            ? optimisticLikeCount + 1
            : Math.max(0, optimisticLikeCount - 1)

        setOptimisticIsLiked(newIsLiked)
        setOptimisticLikeCount(newLikeCount)

        try {
            await toggleLike({
                likeable_type: type,
                likeable_id: id
            }).unwrap()

            // Refetch to ensure consistency
            // setTimeout(() => {
            //     refetch()
            // }, 500)
        } catch (error) {
            // Revert optimistic update on error
            setOptimisticIsLiked(!newIsLiked)
            setOptimisticLikeCount(optimisticLikeCount)

            console.error('Failed to toggle like:', error)
            ToastMessage.notifyError(error.message || 'Failed to toggle like')
        }
    }

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'w-4 h-4'
            case 'lg':
                return 'w-6 h-6'
            default:
                return 'w-5 h-5'
        }
    }

    const getTextSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'text-xs'
            case 'lg':
                return 'text-base'
            default:
                return 'text-sm'
        }
    }

    return (
        <button
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center gap-1 transition-all duration-200 ${optimisticIsLiked
                ? 'text-red-500 hover:text-red-600 scale-105'
                : 'text-gray-500 hover:text-red-500'
                } disabled:opacity-50 ${className}`}
            title={isAuthenticated ? (optimisticIsLiked ? 'Unlike' : 'Like') : 'Login to like'}
        >
            <svg
                className={`${getSizeClasses()} transition-all duration-200 ${optimisticIsLiked ? 'fill-current scale-110' : 'fill-none'
                    } ${isLoading ? 'animate-pulse' : ''}`}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={optimisticIsLiked ? 1 : 2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
            {showCount && (
                <span className={`${getTextSizeClasses()} font-medium transition-colors duration-200`}>
                    {optimisticLikeCount}
                </span>
            )}
        </button>
    )
}

export default LikeButton
