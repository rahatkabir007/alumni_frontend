"use client"
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useGetAllPostsQuery, useUpdatePostStatusMutation } from '@/redux/features/posts/postsApi'
import {
    selectPostManagement,
    setPostManagementTab,
    setPostManagementPage,
    setPostVisibilityFilter,
    setSelectedPostManagement,
    addPostProcessingId,
    removePostProcessingId
} from '@/redux/features/posts/postsSlice'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'
import { ToastMessage } from '@/utils/ToastMessage'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import Pagination from '@/components/common/Pagination'
import PostModal from '@/components/pages/PostsPage/components/PostModal'
import PostManagementHeader from './components/PostManagementHeader'
import PostManagementTabs from './components/PostManagementTabs'
import PostManagementCard from './components/PostManagementCard'

const PostManagement = ({ userData }) => {
    const dispatch = useDispatch()
    const postManagement = useSelector(selectPostManagement)
    const canManagePosts = checkUserPermission(userData.roles, PERMISSIONS.MANAGE_POSTS)

    const [updatePostStatus] = useUpdatePostStatusMutation()

    const {
        data: postsData,
        isLoading,
        isFetching,
        error,
        refetch
    } = useGetAllPostsQuery({
        page: postManagement.currentPage,
        limit: 10,
        status: postManagement.statusFilter,
        visibility: postManagement.visibilityFilter !== 'all' ? postManagement.visibilityFilter : undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    })

    const posts = postsData?.posts || []
    const totalItems = postsData?.totalItems || 0
    const totalPages = postsData?.totalPages || 1

    const handleTabChange = (tabId) => {
        dispatch(setPostManagementTab(tabId))
    }

    const handlePageChange = (page) => {
        dispatch(setPostManagementPage(page))
    }

    const handleVisibilityFilterChange = (visibility) => {
        dispatch(setPostVisibilityFilter(visibility))
    }

    const handlePostClick = (post) => {
        dispatch(setSelectedPostManagement(post))
    }

    const closePostModal = () => {
        dispatch(setSelectedPostManagement(null))
    }

    const handleStatusUpdate = async (postId, newStatus) => {
        if (!canManagePosts) {
            ToastMessage.notifyError('You do not have permission to manage posts')
            return
        }

        dispatch(addPostProcessingId(postId))

        try {
            await updatePostStatus({
                postId,
                status: newStatus
            }).unwrap()

            const actionText = newStatus === 'active' ? 'approved' : 'rejected'
            ToastMessage.notifySuccess(`Post ${actionText} successfully!`)

            setTimeout(() => {
                refetch()
            }, 500)

        } catch (error) {
            console.error('Failed to update post status:', error)
            const errorMessage = error?.data?.message || error?.message || 'Failed to update post status'
            ToastMessage.notifyError(errorMessage)
        } finally {
            dispatch(removePostProcessingId(postId))
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'inactive': return 'bg-red-100 text-red-800'
            case 'pending_approval': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getVisibilityColor = (visibility) => {
        switch (visibility) {
            case 'public': return 'bg-green-100 text-green-800'
            case 'alumni_only': return 'bg-blue-100 text-blue-800'
            case 'private': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    if (!canManagePosts) {
        return (
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="text-center py-12">
                    <div className="text-red-400 text-4xl mb-4">🔒</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h4>
                    <p className="text-gray-600">You don't have permission to manage posts.</p>
                </div>
            </ElegantCard>
        )
    }

    return (
        <div className="space-y-6">
            <PostManagementHeader totalItems={totalItems} />

            <PostManagementTabs
                activeTab={postManagement.activeTab}
                onTabChange={handleTabChange}
                visibilityFilter={postManagement.visibilityFilter}
                onVisibilityChange={handleVisibilityFilterChange}
            />

            {/* Posts List */}
            {isLoading || isFetching ? (
                <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading posts...</p>
                    </div>
                </ElegantCard>
            ) : error ? (
                <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                    <div className="text-center py-12">
                        <div className="text-red-400 text-4xl mb-4">⚠️</div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Posts</h4>
                        <p className="text-gray-600 mb-4">There was an error loading posts.</p>
                        <BlackButton size="sm" onClick={() => refetch()}>
                            Try Again
                        </BlackButton>
                    </div>
                </ElegantCard>
            ) : posts.length === 0 ? (
                <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No Posts Found</h4>
                        <p className="text-gray-600">No posts with {postManagement.activeTab} status.</p>
                    </div>
                </ElegantCard>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {posts.map((post) => (
                        <PostManagementCard
                            key={post.id}
                            post={post}
                            onStatusUpdate={handleStatusUpdate}
                            onPostClick={handlePostClick}
                            isProcessing={postManagement.processingIds.includes(post.id)}
                            getStatusColor={getStatusColor}
                            getVisibilityColor={getVisibilityColor}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center">
                    <Pagination
                        currentPage={postManagement.currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={postsData?.itemsPerPage || 10}
                        onPageChange={handlePageChange}
                        isLoading={isLoading || isFetching}
                    />
                </div>
            )}

            {/* Post Modal */}
            <PostModal
                selectedPost={postManagement.selectedPost}
                onClose={closePostModal}
            />
        </div>
    )
}

export default PostManagement
