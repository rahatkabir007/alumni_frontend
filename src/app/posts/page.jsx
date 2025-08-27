"use client"
import React, { useState, useEffect, useMemo } from 'react'
import { useGetAllPostsQuery } from '@/redux/features/posts/postsApi'
import PostsHeader from '@/components/pages/PostsPage/components/PostsHeader'
import PostsFilters from '@/components/pages/PostsPage/components/PostsFilters'
import PostsGrid from '@/components/pages/PostsPage/components/PostsGrid'
import PostModal from '@/components/pages/PostsPage/components/PostModal'

const PostsPage = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [visibilityFilter, setVisibilityFilter] = useState('all')
    const [selectedPost, setSelectedPost] = useState(null)
    const [allPosts, setAllPosts] = useState([])
    const [hasNextPage, setHasNextPage] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const {
        data: postsData,
        isLoading,
        isFetching,
        error,
        refetch
    } = useGetAllPostsQuery({
        page: currentPage,
        limit: 10,
        status: 'active',
        visibility: visibilityFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    })

    // Deduplicate posts by ID to prevent duplicates
    const uniquePosts = useMemo(() => {
        const seen = new Set()
        return allPosts.filter(post => {
            if (seen.has(post.id)) {
                return false
            }
            seen.add(post.id)
            return true
        })
    }, [allPosts])

    // Handle new data
    useEffect(() => {
        if (postsData?.posts && !isLoading) {
            if (currentPage === 1) {
                // Reset for first page or filter change
                setAllPosts(postsData.posts)
            } else {
                // Append new posts for pagination
                setAllPosts(prev => {
                    const newPosts = postsData.posts.filter(
                        newPost => !prev.some(existingPost => existingPost.id === newPost.id)
                    )
                    return [...prev, ...newPosts]
                })
            }

            setHasNextPage(currentPage < (postsData.totalPages || 1))
        }
    }, [postsData, currentPage, isLoading])

    // Reset when visibility filter changes
    useEffect(() => {
        setCurrentPage(1)
        setAllPosts([])
        setHasNextPage(true)
    }, [visibilityFilter])

    const handleVisibilityChange = (visibility) => {
        setVisibilityFilter(visibility)
    }

    const handlePostClick = (post) => {
        setSelectedPost(post)
    }

    const closePostModal = () => {
        setSelectedPost(null)
    }

    const fetchNextPage = () => {
        if (!hasNextPage || isLoadingMore || isFetching) return

        setIsLoadingMore(true)
        setCurrentPage(prev => prev + 1)

        // Reset loading state after a delay
        setTimeout(() => {
            setIsLoadingMore(false)
        }, 1000)
    }

    const handleRefresh = () => {
        setCurrentPage(1)
        setAllPosts([])
        setHasNextPage(true)
        refetch()
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <PostsHeader />

            <PostsFilters
                visibilityFilter={visibilityFilter}
                onVisibilityChange={handleVisibilityChange}
                totalItems={postsData?.totalItems || 0}
                onRefresh={handleRefresh}
            />

            <PostsGrid
                posts={uniquePosts}
                isLoading={isLoading && currentPage === 1}
                isFetching={isFetching}
                error={error}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isLoadingMore}
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