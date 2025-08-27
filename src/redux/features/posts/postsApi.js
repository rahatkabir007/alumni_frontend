import { apiSlice } from '../api/apiSlice'

export const postsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get user's own posts
        getMyPosts: builder.query({
            query: (params = {}) => {
                const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = params

                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    sortBy,
                    sortOrder
                })

                if (status && status !== 'all') queryParams.append('status', status)

                return `/posts/my?${queryParams.toString()}`
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data
                }
                return {
                    posts: [],
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 0,
                    itemsPerPage: 10
                }
            },
            providesTags: ['Post'],
        }),

        // Get all posts (public view with optional auth)
        getAllPosts: builder.query({
            query: (params = {}) => {
                const { page = 1, limit = 10, status, visibility, sortBy = 'createdAt', sortOrder = 'desc' } = params

                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    sortBy,
                    sortOrder
                })

                if (status && status !== 'all') queryParams.append('status', status)
                if (visibility && visibility !== 'all') queryParams.append('visibility', visibility)

                return `/posts?${queryParams.toString()}`
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data
                }
                return {
                    posts: [],
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 0,
                    itemsPerPage: 10
                }
            },
            providesTags: ['Post'],
        }),

        // Get posts by user ID (public view with optional auth)
        getPostsByUserId: builder.query({
            query: ({ userId, ...params }) => {
                const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params

                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    sortBy,
                    sortOrder
                })

                return `/posts/user/${userId}?${queryParams.toString()}`
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data
                }
                return {
                    posts: [],
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 0,
                    itemsPerPage: 10
                }
            },
            providesTags: ['Post'],
        }),

        // Create new post
        createPost: builder.mutation({
            query: (postData) => ({
                url: '/posts',
                method: 'POST',
                body: postData,
            }),
            invalidatesTags: ['Post'],
        }),

        // Update post
        updatePost: builder.mutation({
            query: ({ postId, postData }) => ({
                url: `/posts/${postId}`,
                method: 'PATCH',
                body: postData,
            }),
            invalidatesTags: ['Post'],
        }),

        // Update post status (admin/moderator only)
        updatePostStatus: builder.mutation({
            query: ({ postId, status }) => ({
                url: `/posts/${postId}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Post'],
        }),

        // Delete post
        deletePost: builder.mutation({
            query: (postId) => ({
                url: `/posts/${postId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Post'],
        }),

        // Get post by ID
        getPostById: builder.query({
            query: ({ postId, includeDetails = false }) => {
                const queryParams = includeDetails ? '?includeDetails=true' : ''
                return `/posts/${postId}${queryParams}`
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data
                }
                throw new Error(response.message || 'Failed to fetch post data')
            },
            providesTags: (result, error, { postId }) => [{ type: 'Post', id: postId }],
        }),

        // Toggle like on post
        togglePostLike: builder.mutation({
            query: (postId) => ({
                url: `/posts/${postId}/like`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, postId) => [
                { type: 'Post', id: postId },
                'Post'
            ],
        }),

        // Get like status for post
        getPostLikeStatus: builder.query({
            query: (postId) => `/posts/${postId}/like-status`,
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data
                }
                return {
                    likeCount: 0,
                    isLiked: false
                }
            },
            providesTags: (result, error, postId) => [
                { type: 'PostLike', id: postId }
            ],
        }),
    }),
})

export const {
    useGetMyPostsQuery,
    useGetAllPostsQuery,
    useLazyGetAllPostsQuery,
    useGetPostsByUserIdQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useUpdatePostStatusMutation,
    useDeletePostMutation,
    useGetPostByIdQuery,
    useLazyGetPostByIdQuery,
    useTogglePostLikeMutation,
    useGetPostLikeStatusQuery,
} = postsApi
