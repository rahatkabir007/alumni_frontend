"use client"
import { useState } from 'react'
import { useCreateReplyMutation } from '@/redux/features/comments/commentsApi'
import { ToastMessage } from '@/utils/ToastMessage'

const ReplyForm = ({
    commentId,
    parentReplyId = null,
    onSuccess,
    onCancel,
    placeholder = "Write a reply..."
}) => {
    const [content, setContent] = useState('')
    const [createReply, { isLoading }] = useCreateReplyMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!content.trim()) {
            ToastMessage.notifyError('Reply cannot be empty')
            return
        }

        try {
            await createReply({
                commentId,
                parentReplyId,
                content: content.trim()
            }).unwrap()

            ToastMessage.notifySuccess('Reply added successfully')
            setContent('')
            if (onSuccess) onSuccess()
        } catch (error) {
            console.error('Failed to create reply:', error)
            ToastMessage.notifyError(error.message || 'Failed to create reply')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                maxLength={500}
            />
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                    {content.length}/500 characters
                </span>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !content.trim()}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isLoading ? 'Posting...' : 'Reply'}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default ReplyForm
