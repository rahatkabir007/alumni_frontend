"use client"
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/redux/features/auth/authSlice'
import { useUpdateCommentMutation, useDeleteCommentMutation } from '@/redux/features/comments/commentsApi'
import { ToastMessage } from '@/utils/ToastMessage'
import LikeButton from '../LikeButton/LikeButton'
import ReplyItem from './ReplyItem'
import ReplyForm from './ReplyForm'
import Image from 'next/image'

const CommentItem = ({ comment, onUpdate }) => {
    const currentUser = useSelector(selectCurrentUser)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.content)
    const [showReplies, setShowReplies] = useState(false)
    const [showReplyForm, setShowReplyForm] = useState(false)

    const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation()
    const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation()

    const isOwner = currentUser?.id === comment.userId
    const canEdit = isOwner || currentUser?.roles?.some(role =>
        ['admin', 'super_admin', 'moderator'].includes(role.name)
    )



    const handleUpdate = async () => {
        if (!editContent.trim()) {
            ToastMessage.notifyError('Comment cannot be empty')
            return
        }

        try {
            await updateComment({
                commentId: comment.id,
                content: editContent.trim()
            }).unwrap()

            ToastMessage.notifySuccess('Comment updated successfully')
            setIsEditing(false)
            if (onUpdate) onUpdate()
        } catch (error) {
            console.error('Failed to update comment:', error)
            ToastMessage.notifyError(error.message || 'Failed to update comment')
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return
        }

        try {
            await deleteComment(comment.id).unwrap()
            ToastMessage.notifySuccess('Comment deleted successfully')
            if (onUpdate) onUpdate()
        } catch (error) {
            console.error('Failed to delete comment:', error)
            ToastMessage.notifyError(error.message || 'Failed to delete comment')
        }
    }

    const handleReplySuccess = () => {
        setShowReplyForm(false)
        setShowReplies(true)
        if (onUpdate) onUpdate()
    }

    return (
        <div className="border-b border-gray-100 pb-4">
            <div className="flex gap-3">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                    {comment.user?.profilePhoto ? (
                        <Image
                            src={comment.user.profilePhoto}
                            alt={comment.user.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                            {comment.user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Comment Header */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-gray-900">
                            {comment.user?.name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    {/* Comment Content */}
                    {isEditing ? (
                        <div className="space-y-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Write your comment..."
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleUpdate}
                                    disabled={isUpdating}
                                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {isUpdating ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false)
                                        setEditContent(comment.content)
                                    }}
                                    className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {comment.content}
                            </p>

                            {/* Comment Actions */}
                            <div className="flex items-center gap-4 mt-2">
                                <LikeButton
                                    type="comment"
                                    id={comment.id}
                                    initialLikeCount={comment.like_count}
                                    initialIsLiked={comment.isLikedByCurrentUser || false}
                                    size="sm"
                                />

                                <button
                                    onClick={() => setShowReplyForm(!showReplyForm)}
                                    className="text-xs text-gray-500 hover:text-blue-500"
                                >
                                    Reply
                                </button>

                                {comment.reply_count > 0 && (
                                    <button
                                        onClick={() => setShowReplies(!showReplies)}
                                        className="text-xs text-blue-500 hover:text-blue-600"
                                    >
                                        {showReplies ? 'Hide' : 'Show'} {comment.reply_count} replies
                                    </button>
                                )}

                                {canEdit && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-xs text-gray-500 hover:text-blue-500"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="text-xs text-gray-500 hover:text-red-500"
                                        >
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Reply Form */}
                    {showReplyForm && (
                        <div className="mt-3">
                            <ReplyForm
                                commentId={comment.id}
                                parentReplyId={null}
                                onSuccess={handleReplySuccess}
                                onCancel={() => setShowReplyForm(false)}
                            />
                        </div>
                    )}

                    {/* Replies */}
                    {showReplies && comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 space-y-3">
                            {comment.replies.map((reply) => (
                                <ReplyItem
                                    key={reply.id}
                                    reply={reply}
                                    commentId={comment.id}
                                    depth={0}
                                    maxDepth={3}
                                    onUpdate={onUpdate}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CommentItem
