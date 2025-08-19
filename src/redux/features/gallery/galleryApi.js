import { apiSlice } from '../api/apiSlice'

export const galleryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllGalleries: builder.query({
            query: (params = {}) => {
                const { page = 1, limit = 12, status = 'active', year, userId, sortBy = 'createdAt', sortOrder = 'desc' } = params

                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    sortBy,
                    sortOrder
                })

                if (status !== 'all') queryParams.append('status', status)
                if (year) queryParams.append('year', year)
                if (userId) queryParams.append('userId', userId)

                return `/galleries?${queryParams.toString()}`
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

        getUserGalleries: builder.query({
            query: ({ userId, ...params }) => {
                const { page = 1, limit = 12, status = 'all', year, sortBy = 'createdAt', sortOrder = 'desc' } = params

                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    sortBy,
                    sortOrder
                })

                if (status !== 'all') queryParams.append('status', status)
                if (year) queryParams.append('year', year)

                return `/galleries/user/${userId}?${queryParams.toString()}`
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

        getMyGalleries: builder.query({
            query: (params = {}) => {
                const { page = 1, limit = 12, status = 'all', year, sortBy = 'createdAt', sortOrder = 'desc' } = params

                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    sortBy,
                    sortOrder
                })

                if (status !== 'all') queryParams.append('status', status)
                if (year) queryParams.append('year', year)

                return `/galleries/my/galleries?${queryParams.toString()}`
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

        getGalleryById: builder.query({
            query: ({ galleryId, includeDetails = false }) =>
                `/galleries/${galleryId}?includeDetails=${includeDetails}`,
            transformResponse: (response) => {
                if (response.success && response.data) {
                    return response.data
                }
                throw new Error(response.message || 'Failed to fetch gallery data')
            },
            providesTags: (result, error, galleryId) => [{ type: 'Gallery', id: galleryId }],
        }),

        createGallery: builder.mutation({
            query: (galleryData) => ({
                url: '/galleries',
                method: 'POST',
                body: galleryData,
            }),
            invalidatesTags: ['Gallery'],
        }),

        updateGallery: builder.mutation({
            query: ({ galleryId, galleryData }) => ({
                url: `/galleries/${galleryId}`,
                method: 'PATCH',
                body: galleryData,
            }),
            invalidatesTags: ['Gallery'],
        }),

        updateGalleryStatus: builder.mutation({
            query: ({ galleryId, status }) => ({
                url: `/galleries/${galleryId}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Gallery'],
        }),

        deleteGallery: builder.mutation({
            query: (galleryId) => ({
                url: `/galleries/${galleryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Gallery'],
        }),
    }),
})

export const {
    useGetAllGalleriesQuery,
    useGetUserGalleriesQuery,
    useGetMyGalleriesQuery,
    useGetGalleryByIdQuery,
    useLazyGetGalleryByIdQuery,
    useCreateGalleryMutation,
    useUpdateGalleryMutation,
    useUpdateGalleryStatusMutation,
    useDeleteGalleryMutation,
} = galleryApi