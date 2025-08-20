"use client"
import { useState } from 'react'
import { useGetNestedRepliesQuery } from '@/redux/features/comments/commentsApi'

const DebugNestedReplies = ({ replyId }) => {
    const [enabled, setEnabled] = useState(false)

    const { data, isLoading, error } = useGetNestedRepliesQuery(
        { replyId, maxDepth: 3 },
        { skip: !enabled }
    )

    return (
        <div className="p-4 border border-red-200 bg-red-50 rounded">
            <h4>Debug Nested Replies for Reply ID: {replyId}</h4>
            <button
                onClick={() => setEnabled(!enabled)}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
            >
                {enabled ? 'Stop' : 'Test'} API Call
            </button>

            {enabled && (
                <div className="mt-2 text-xs">
                    <div>Loading: {isLoading.toString()}</div>
                    <div>Error: {error ? JSON.stringify(error) : 'none'}</div>
                    <div>Data: {JSON.stringify(data, null, 2)}</div>
                </div>
            )}
        </div>
    )
}

export default DebugNestedReplies
