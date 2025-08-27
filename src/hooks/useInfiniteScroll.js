"use client"
import { useState, useEffect, useMemo } from 'react'

export const useInfiniteScroll = (query, params = {}) => {
    const [pages, setPages] = useState([])
    const [hasNextPage, setHasNextPage] = useState(true)
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)

    // Flatten all posts from all pages
    const allPosts = useMemo(() => {
        return pages.flatMap(page => page.posts || [])
    }, [pages])

    const fetchNextPage = async () => {
        if (!hasNextPage || isFetchingNextPage) return

        setIsFetchingNextPage(true)

        try {
            const nextPage = pages.length + 1
            const result = await query({
                ...params,
                page: nextPage
            }).unwrap()

            if (result.posts && result.posts.length > 0) {
                setPages(prev => [...prev, result])
                setHasNextPage(nextPage < result.totalPages)
            } else {
                setHasNextPage(false)
            }
        } catch (error) {
            console.error('Failed to fetch next page:', error)
        } finally {
            setIsFetchingNextPage(false)
        }
    }

    const refetch = () => {
        setPages([])
        setHasNextPage(true)
        setIsFetchingNextPage(false)
    }

    return {
        data: allPosts,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        refetch,
        totalItems: pages[pages.length - 1]?.totalItems || 0
    }
}
