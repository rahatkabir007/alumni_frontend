import { apiSlice } from '../api/apiSlice'

export const commentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get comments for a specific entity
        getComments: builder.query({
            query: ({ type, id, page = 1, limit = 10 }) => {
                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString()
                })
                return `/${type}/${id}/comments?${queryParams.toString()}`
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data
                }
                return {
                    comments: [],
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 0
                }
            },
            providesTags: (result, error, { type, id }) => [
                { type: 'Comment', id: `${type}-${id}` }
            ],
        }),

        // Create a new comment
        createComment: builder.mutation({
            query: ({ type, id, content }) => ({
                url: `/${type}/${id}/comments`,
                method: 'POST',
                body: { content },
            }),
            invalidatesTags: (result, error, { type, id }) => [
                { type: 'Comment', id: `${type}-${id}` },
                'Gallery'
            ],
        }),

        // Update a comment
        updateComment: builder.mutation({
            query: ({ commentId, content }) => ({
                url: `/comments/${commentId}`,
                method: 'PATCH',
                body: { content },
            }),
            invalidatesTags: ['Comment'],
        }),

        // Delete a comment
        deleteComment: builder.mutation({
            query: (commentId) => ({
                url: `/comments/${commentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Comment', 'Gallery'],
        }),

        // Create a reply (now supports nested replies)
        createReply: builder.mutation({
            query: ({ commentId, parentReplyId, content }) => {
                if (parentReplyId) {
                    // Nested reply to another reply
                    return {
                        url: `/replies/${parentReplyId}/replies`,
                        method: 'POST',
                        body: { content },
                    }
                } else {
                    // Direct reply to comment
                    return {
                        url: `/comments/${commentId}/replies`,
                        method: 'POST',
                        body: { content },
                    }
                }
            },
            invalidatesTags: ['Comment'],
        }),

        // Update a reply
        updateReply: builder.mutation({
            query: ({ replyId, content }) => ({
                url: `/replies/${replyId}`,
                method: 'PATCH',
                body: { content },
            }),
            invalidatesTags: ['Comment'],
        }),

        // Delete a reply
        deleteReply: builder.mutation({
            query: (replyId) => ({
                url: `/replies/${replyId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Comment'],
        }),

        // Get nested replies for a specific reply
        getNestedReplies: builder.query({
            query: ({ replyId, maxDepth = 3 }) => {
                const params = new URLSearchParams({
                    maxDepth: maxDepth.toString()
                })
                return `/replies/${replyId}/nested?${params.toString()}`
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    // The API returns data as an array directly, not nested in a replies property
                    return {
                        replies: Array.isArray(response.data) ? response.data : [],
                        totalCount: Array.isArray(response.data) ? response.data.length : 0
                    }
                }
                return {
                    replies: [],
                    totalCount: 0
                }
            },
            providesTags: (result, error, { replyId }) => [
                { type: 'Reply', id: `nested-${replyId}` }
            ],
        }),

        // Toggle like
        toggleLike: builder.mutation({
            query: ({ likeable_type, likeable_id }) => ({
                url: '/like',
                method: 'POST',
                body: { likeable_type, likeable_id },
            }),
            invalidatesTags: (result, error, { likeable_type, likeable_id }) => [
                { type: 'Like', id: `${likeable_type}-${likeable_id}` },
                'Gallery'
            ],
        }),

        // Get like status
        getLikeStatus: builder.query({
            query: ({ type, id }) => `/like-status/${type}/${id}`,
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data
                }
                return {
                    likeCount: 0,
                    isLiked: false
                }
            },
            providesTags: (result, error, { type, id }) => [
                { type: 'Like', id: `${type}-${id}` }
            ],
        }),
    }),
})

export const {
    useGetCommentsQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    useCreateReplyMutation,
    useUpdateReplyMutation,
    useDeleteReplyMutation,
    useToggleLikeMutation,
    useGetLikeStatusQuery,
    useGetNestedRepliesQuery,
} = commentsApi
