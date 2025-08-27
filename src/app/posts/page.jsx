"use client"
import React, { useState, useEffect } from 'react'
import { useLazyGetAllPostsQuery } from '@/redux/features/posts/postsApi'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import PostsHeader from '@/components/pages/PostsPage/components/PostsHeader'
import PostsFilters from '@/components/pages/PostsPage/components/PostsFilters'
import PostsGrid from '@/components/pages/PostsPage/components/PostsGrid'
import PostModal from '@/components/pages/PostsPage/components/PostModal'

const PostsPage = () => {
    const [visibilityFilter, setVisibilityFilter] = useState('all')
    const [selectedPost, setSelectedPost] = useState(null)

    const [getAllPostsQuery, { isLoading, error }] = useLazyGetAllPostsQuery()

    const queryParams = {
        limit: 10, // Smaller limit for better infinite scroll experience
        status: 'active',
        visibility: visibilityFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    }

    const {
        data: posts,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        refetch,
        totalItems
    } = useInfiniteScroll(getAllPostsQuery, queryParams)

    // Initial load
    useEffect(() => {
        fetchNextPage()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Refetch when visibility filter changes
    useEffect(() => {
        refetch()
        setTimeout(() => {
            fetchNextPage()
        }, 100)
    }, [visibilityFilter]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleVisibilityChange = (visibility) => {
        setVisibilityFilter(visibility)
    }

    const handlePostClick = (post) => {
        setSelectedPost(post)
    }

    const closePostModal = () => {
        setSelectedPost(null)
    }

    const handleRefresh = () => {
        refetch()
        setTimeout(() => {
            fetchNextPage()
        }, 100)
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <PostsHeader />

            <PostsFilters
                visibilityFilter={visibilityFilter}
                onVisibilityChange={handleVisibilityChange}
                totalItems={totalItems}
                onRefresh={handleRefresh}
            />

            <PostsGrid
                posts={posts}
                isLoading={isLoading}
                isFetching={isFetchingNextPage}
                error={error}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                onPostClick={handlePostClick}
                onRefetch={handleRefresh}
            />

            <PostModal
                selectedPost={selectedPost}
                onClose={closePostModal}
            />
        </div>
    )
}

export default PostsPage