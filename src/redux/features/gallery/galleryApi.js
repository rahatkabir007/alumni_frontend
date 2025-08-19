import { apiSlice } from '../api/apiSlice'

export const galleryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get user's own galleries
        getMyGalleries: builder.query({
            query: (params = {}) => {
                const { page = 1, limit = 12, year, sortBy = 'createdAt', sortOrder = 'desc' } = params

                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    sortBy,
                    sortOrder
                })

                if (year) queryParams.append('year', year)

                return `/gallery/my?${queryParams.toString()}`
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data
                }
                return {
                    galleries: [],
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 0,
                    itemsPerPage: 12,
                    hasNextPage: false,
                    hasPrevPage: false
                }
            },
            providesTags: ['Gallery'],
        }),

        // Get all galleries (for public view and admin management)
        getAllGalleries: builder.query({
            query: (params = {}) => {
                const { page = 1, limit = 24, status, year, sortBy = 'createdAt', sortOrder = 'desc' } = params

                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    sortBy,
                    sortOrder
                })

                // Only add status filter if it's provided and not empty
                if (status && status !== 'all' && status.trim() !== '') {
                    queryParams.append('status', status)
                }

                if (year) queryParams.append('year', year)

                return `/gallery?${queryParams.toString()}`
            },
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data
                }
                return {
                    galleries: [],
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 0,
                    itemsPerPage: 24,
                    hasNextPage: false,
                    hasPrevPage: false
                }
            },
            providesTags: ['Gallery'],
        }),

        // Create new gallery entry
        createGallery: builder.mutation({
            query: (galleryData) => ({
                url: '/gallery',
                method: 'POST',
                body: galleryData,
            }),
            invalidatesTags: ['Gallery'],
        }),

        // Update gallery entry
        updateGallery: builder.mutation({
            query: ({ galleryId, galleryData }) => ({
                url: `/gallery/${galleryId}`,
                method: 'PATCH',
                body: galleryData,
            }),
            invalidatesTags: ['Gallery'],
        }),

        // Update gallery status (admin only)
        updateGalleryStatus: builder.mutation({
            query: ({ galleryId, status }) => ({
                url: `/gallery/${galleryId}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Gallery'],
            // Optimistic update
            async onQueryStarted({ galleryId, status }, { dispatch, queryFulfilled, getState }) {
                try {
                    await queryFulfilled
                    // Force invalidate all gallery queries
                    dispatch(galleryApi.util.invalidateTags(['Gallery']))
                } catch (error) {
                    console.error('Failed to update gallery status:', error)
                }
            },
        }),

        // Delete gallery entry
        deleteGallery: builder.mutation({
            query: (galleryId) => ({
                url: `/gallery/${galleryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Gallery'],
        }),

        // Get gallery by ID
        getGalleryById: builder.query({
            query: (galleryId) => `/gallery/${galleryId}`,
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data
                }
                throw new Error(response.message || 'Failed to fetch gallery data')
            },
            providesTags: (result, error, galleryId) => [{ type: 'Gallery', id: galleryId }],
        }),
    }),
})

export const {
    useGetMyGalleriesQuery,
    useGetAllGalleriesQuery,
    useCreateGalleryMutation,
    useUpdateGalleryMutation,
    useUpdateGalleryStatusMutation,
    useDeleteGalleryMutation,
    useGetGalleryByIdQuery,
    useLazyGetGalleryByIdQuery,
} = galleryApi