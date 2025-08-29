"use client"
import React, { useState } from 'react'
import { useGetMyPostsQuery } from '@/redux/features/posts/postsApi'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import Pagination from '@/components/common/Pagination'
import PostUploadForm from './PostUploadForm'
import PostsGrid from './PostsGrid'

const Posts = ({ userData }) => {
    const [showUploadForm, setShowUploadForm] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState('all')

    const canCreatePost = checkUserPermission(userData.roles, PERMISSIONS.CREATE_POST)

    const {
        data: postsData,
        isLoading,
        isFetching,
        error,
        refetch
    } = useGetMyPostsQuery({
        page: currentPage,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    })

    const posts = postsData?.posts || []
    const totalItems = postsData?.totalItems || 0
    const totalPages = postsData?.totalPages || 1

    const handleUploadSuccess = () => {
        setShowUploadForm(false)
        refetch()
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleStatusChange = (status) => {
        setCurrentPage(1)
        setStatusFilter(status)
    }

    if (showUploadForm) {
        return (
            <PostUploadForm
                onSuccess={handleUploadSuccess}
                onCancel={() => setShowUploadForm(false)}
            />
        )
    }

    return (
        <div className="space-y-6">
            {/* Header with Create Button */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">My Posts</h3>
                        <p className="text-gray-600 text-sm mt-1">
                            Manage your posts and share your stories
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <BlackTag variant="subtle" size="sm">
                            {totalItems} posts
                        </BlackTag>
                        <BlackButton
                            size="sm"
                            onClick={() => setShowUploadForm(true)}
                            icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            }
                        >
                            Create Post
                        </BlackButton>
                    </div>
                </div>
            </ElegantCard>

            {/* Filters */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Status:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        >
                            <option value="all">All Status</option>
                            <option value="pending_approval">Pending Approval</option>
                            <option value="active">Published</option>
                            <option value="inactive">Rejected</option>
                        </select>
                    </div>

                    {statusFilter !== 'all' && (
                        <BlackButton
                            size="xs"
                            variant="outline"
                            onClick={() => handleStatusChange('all')}
                        >
                            Clear Filter
                        </BlackButton>
                    )}
                </div>
            </ElegantCard>

            {/* Loading State */}
            {(isLoading || isFetching) && (
                <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your posts...</p>
                    </div>
                </ElegantCard>
            )}

            {/* Error State */}
            {error && (
                <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                    <div className="text-center py-12">
                        <div className="text-red-400 text-4xl mb-4">⚠️</div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Posts</h4>
                        <p className="text-gray-600 mb-4">There was an error loading your posts.</p>
                        <BlackButton size="sm" onClick={() => refetch()}>
                            Try Again
                        </BlackButton>
                    </div>
                </ElegantCard>
            )}

            {/* Posts Grid */}
            {!isLoading && !error && (
                <>
                    <PostsGrid
                        posts={posts}
                        userData={userData}
                        onRefresh={refetch}
                        isOwner={true}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                itemsPerPage={postsData?.itemsPerPage || 10}
                                onPageChange={handlePageChange}
                                isLoading={isLoading || isFetching}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Posts