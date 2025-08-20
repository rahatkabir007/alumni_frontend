"use client"
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/redux/features/auth/authSlice'
import { useUpdateReplyMutation, useDeleteReplyMutation, useGetNestedRepliesQuery } from '@/redux/features/comments/commentsApi'
import { ToastMessage } from '@/utils/ToastMessage'
import LikeButton from '../LikeButton/LikeButton'
import ReplyForm from './ReplyForm'
import Image from 'next/image'

const ReplyItem = ({ reply, commentId, depth = 0, maxDepth = 3, onUpdate }) => {
    const currentUser = useSelector(selectCurrentUser)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(reply.content)
    const [showNestedReplies, setShowNestedReplies] = useState(false)
    const [showReplyForm, setShowReplyForm] = useState(false)

    const [updateReply, { isLoading: isUpdating }] = useUpdateReplyMutation()
    const [deleteReply, { isLoading: isDeleting }] = useDeleteReplyMutation()

    // Fetch nested replies if they exist and are requested
    const {
        data: nestedRepliesData,
        isLoading: isLoadingNested,
        error: nestedError,
        refetch: refetchNested
    } = useGetNestedRepliesQuery(
        { replyId: reply.id, maxDepth: maxDepth - depth },
        {
            skip: !showNestedReplies || depth >= maxDepth,
            // Add debug logging
            onCompleted: (data) => {
                console.log('✅ Nested replies loaded:', data)
            },
            onError: (error) => {
                console.error('❌ Failed to load nested replies:', error)
            }
        }
    )

    const isOwner = currentUser?.id === reply.userId
    const canEdit = isOwner || currentUser?.roles?.some(role =>
        ['admin', 'super_admin'].includes(role.name)
    )


    const canNestReply = depth < maxDepth
    const hasNestedReplies = reply.reply_count > 0

    const handleUpdate = async () => {
        if (!editContent.trim()) {
            ToastMessage.notifyError('Reply cannot be empty')
            return
        }

        try {
            await updateReply({
                replyId: reply.id,
                content: editContent.trim()
            }).unwrap()

            ToastMessage.notifySuccess('Reply updated successfully')
            setIsEditing(false)
            if (onUpdate) onUpdate()
        } catch (error) {
            console.error('Failed to update reply:', error)
            ToastMessage.notifyError(error.message || 'Failed to update reply')
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this reply?')) {
            return
        }

        try {
            await deleteReply(reply.id).unwrap()
            ToastMessage.notifySuccess('Reply deleted successfully')
            if (onUpdate) onUpdate()
        } catch (error) {
            console.error('Failed to delete reply:', error)
            ToastMessage.notifyError(error.message || 'Failed to delete reply')
        }
    }

    const handleNestedReplySuccess = () => {
        setShowReplyForm(false)
        setShowNestedReplies(true)
        refetchNested()
        if (onUpdate) onUpdate()
    }

    const handleShowNestedReplies = () => {
        setShowNestedReplies(!showNestedReplies)
    }

    // Debug logging
    console.log("🚀 ~ ReplyItem Debug:", {
        replyId: reply.id,
        hasNestedReplies,
        showNestedReplies,
        depth,
        maxDepth,
        nestedRepliesData,
        nestedError,
        isLoadingNested,
        skipQuery: !showNestedReplies || depth >= maxDepth
    })

    return (
        <div className="ml-4 pl-4 border-l-2 border-gray-100">
            <div className="flex gap-3">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                    {reply.user?.profilePhoto ? (
                        <Image
                            src={reply.user.profilePhoto}
                            alt={reply.user.name}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                            {reply.user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Reply Header */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-xs text-gray-900">
                            {reply.user?.name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500">
                            {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    {/* Reply Content */}
                    {isEditing ? (
                        <div className="space-y-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={2}
                                placeholder="Write your reply..."
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleUpdate}
                                    disabled={isUpdating}
                                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {isUpdating ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false)
                                        setEditContent(reply.content)
                                    }}
                                    className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-xs text-gray-700 whitespace-pre-wrap mb-2">
                                {reply.content}
                            </p>

                            {/* Reply Actions */}
                            <div className="flex items-center gap-3 text-xs">
                                <LikeButton
                                    type="reply"
                                    id={reply.id}
                                    initialLikeCount={reply.like_count}
                                    initialIsLiked={reply.isLikedByCurrentUser || false}
                                    size="sm"
                                />

                                {canNestReply && (
                                    <button
                                        onClick={() => setShowReplyForm(!showReplyForm)}
                                        className="text-gray-500 hover:text-blue-500 transition-colors"
                                    >
                                        Reply
                                    </button>
                                )}

                                {hasNestedReplies && depth < maxDepth && (
                                    <button
                                        onClick={handleShowNestedReplies}
                                        className="text-blue-500 hover:text-blue-600 transition-colors"
                                    >
                                        {showNestedReplies ? '▼ Hide' : '▶ Show'} {reply.reply_count} {reply.reply_count === 1 ? 'reply' : 'replies'}
                                    </button>
                                )}

                                {canEdit && (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-gray-500 hover:text-blue-500 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                                        >
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Nested Reply Form */}
                    {showReplyForm && canNestReply && (
                        <div className="mt-3">
                            <ReplyForm
                                commentId={commentId}
                                parentReplyId={reply.id}
                                onSuccess={handleNestedReplySuccess}
                                onCancel={() => setShowReplyForm(false)}
                                placeholder={`Reply to ${reply.user?.name || 'this comment'}...`}
                            />
                        </div>
                    )}

                    {/* Nested Replies */}
                    {showNestedReplies && depth < maxDepth && (
                        <div className="mt-3">
                            {isLoadingNested ? (
                                <div className="flex items-center justify-center py-4">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                    <span className="ml-2 text-xs text-gray-500">Loading replies...</span>
                                </div>
                            ) : nestedError ? (
                                <div className="text-xs text-red-500 py-2">
                                    Error loading replies: {nestedError.message}
                                    <button
                                        onClick={() => refetchNested()}
                                        className="text-blue-500 hover:text-blue-600 ml-1"
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : nestedRepliesData?.replies?.length > 0 ? (
                                <div className="space-y-4">
                                    {nestedRepliesData.replies.map((nestedReply) => (
                                        <ReplyItem
                                            key={nestedReply.id}
                                            reply={nestedReply}
                                            commentId={commentId}
                                            depth={depth + 1}
                                            maxDepth={maxDepth}
                                            onUpdate={() => {
                                                refetchNested()
                                                if (onUpdate) onUpdate()
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : hasNestedReplies ? (
                                <div className="text-xs text-gray-500 italic py-2">
                                    Failed to load replies.
                                    <button
                                        onClick={() => refetchNested()}
                                        className="text-blue-500 hover:text-blue-600 ml-1"
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-500 italic py-2">
                                    No replies yet
                                </div>
                            )}
                        </div>
                    )}

                    {/* Max depth reached indicator */}
                    {depth >= maxDepth && hasNestedReplies && (
                        <div className="mt-2 text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
                            Maximum depth reached. There are {reply.reply_count} more replies that can't be shown.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ReplyItem
