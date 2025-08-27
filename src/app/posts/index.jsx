"use client"
import React, { useState } from 'react'
import { useGetPublicPostsQuery } from '@/redux/features/posts/postsApi'
import PostsHeader from '@/components/pages/PostsPage/components/PostsHeader'
import PostsFilters from '@/components/pages/PostsPage/components/PostsFilters'
import PostsGrid from '@/components/pages/PostsPage/components/PostsGrid'
import PostModal from '@/components/pages/PostsPage/components/PostModal'

const PostsPage = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [visibilityFilter, setVisibilityFilter] = useState('all')
    const [selectedPost, setSelectedPost] = useState(null)

    const {
        data: postsData,
        isLoading,
        isFetching,
        error,
        refetch
    } = useGetPublicPostsQuery({
        page: currentPage,
        limit: 12,
        visibility: visibilityFilter,
        sortBy: 'published_at',
        sortOrder: 'desc'
    })

    const posts = postsData?.posts || []
    const totalItems = postsData?.totalItems || 0
    const totalPages = postsData?.totalPages || 1

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleVisibilityChange = (visibility) => {
        setCurrentPage(1)
        setVisibilityFilter(visibility)
    }

    const handlePostClick = (post) => {
        setSelectedPost(post)
    }

    const closePostModal = () => {
        setSelectedPost(null)
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <PostsHeader />

            <PostsFilters
                visibilityFilter={visibilityFilter}
                onVisibilityChange={handleVisibilityChange}
                totalItems={totalItems}
                onRefresh={refetch}
            />

            <PostsGrid
                posts={posts}
                isLoading={isLoading}
                isFetching={isFetching}
                error={error}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={postsData?.itemsPerPage || 12}
                onPageChange={handlePageChange}
                onPostClick={handlePostClick}
                onRefetch={refetch}
            />

            <PostModal
                selectedPost={selectedPost}
                onClose={closePostModal}
            />
        </div>
    )
}

export default PostsPage