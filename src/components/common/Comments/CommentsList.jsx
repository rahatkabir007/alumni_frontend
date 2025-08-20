"use client"
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@/redux/features/auth/authSlice'
import { useGetCommentsQuery, useCreateCommentMutation } from '@/redux/features/comments/commentsApi'
import { ToastMessage } from '@/utils/ToastMessage'
import ElegantCard from '../ElegantCard'
import CommentItem from './CommentItem'

const CommentsList = ({ type, id, title = "Comments" }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const [newComment, setNewComment] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const {
        data: commentsData,
        isLoading,
        error,
        refetch
    } = useGetCommentsQuery({ type, id, page: currentPage, limit: 10 })

    const [createComment, { isLoading: isCreating }] = useCreateCommentMutation()

    const comments = commentsData?.comments || []
    const totalPages = commentsData?.totalPages || 1

    const handleSubmitComment = async (e) => {
        e.preventDefault()

        if (!isAuthenticated) {
            ToastMessage.notifyError('Please login to comment')
            return
        }

        if (!newComment.trim()) {
            ToastMessage.notifyError('Comment cannot be empty')
            return
        }

        try {
            await createComment({
                type,
                id,
                content: newComment.trim()
            }).unwrap()

            ToastMessage.notifySuccess('Comment posted successfully')
            setNewComment('')
            refetch()
        } catch (error) {
            console.error('Failed to create comment:', error)
            ToastMessage.notifyError(error.message || 'Failed to post comment')
        }
    }

    if (error) {
        return (
            <ElegantCard border={false} shadow="none">
                <div className="text-center py-8">
                    <p className="text-red-500">Failed to load comments</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-2 text-blue-500 hover:text-blue-600"
                    >
                        Try again
                    </button>
                </div>
            </ElegantCard>
        )
    }

    return (
        <ElegantCard border={false} shadow="none" hover={false}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {title} ({commentsData?.totalItems || 0})
                    </h3>
                </div>

                {/* Comment Form */}
                {isAuthenticated ? (
                    <form onSubmit={handleSubmitComment} className="space-y-3">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            maxLength={1000}
                        />
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                                {newComment.length}/1000 characters
                            </span>
                            <button
                                type="submit"
                                disabled={isCreating || !newComment.trim()}
                                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                                {isCreating ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">Please login to post a comment</p>
                    </div>
                )}

                {/* Comments List */}
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Loading comments...</p>
                    </div>
                ) : comments.length > 0 ? (
                    <div className="space-y-4  max-h-[190px] overflow-auto">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onUpdate={refetch}
                            />
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 pt-4">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 text-sm rounded ${currentPage === page
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                    </div>
                )}
            </div>
        </ElegantCard>
    )
}

export default CommentsList
