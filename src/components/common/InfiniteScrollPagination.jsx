"use client"
import { useEffect, useRef, useState } from 'react'

const InfiniteScrollPagination = ({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    error,
    threshold = 300, // Distance from bottom to trigger next page
    className = ""
}) => {
    const [isVisible, setIsVisible] = useState(false)
    const loadingRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting)
            },
            {
                threshold: 0.1,
                rootMargin: `0px 0px ${threshold}px 0px`
            }
        )

        const currentRef = loadingRef.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [threshold])

    useEffect(() => {
        if (isVisible && hasNextPage && !isFetchingNextPage && !isLoading) {
            fetchNextPage()
        }
    }, [isVisible, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage])

    if (error) {
        return (
            <div className={`text-center py-8 ${className}`}>
                <div className="text-red-400 text-4xl mb-4">⚠️</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Posts</h4>
                <p className="text-gray-600 mb-4">There was an error loading more posts.</p>
                <button
                    onClick={() => fetchNextPage()}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div ref={loadingRef} className={`text-center py-8 ${className}`}>
            {isFetchingNextPage ? (
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
                    <p className="text-gray-600">Loading more posts...</p>
                </div>
            ) : hasNextPage ? (
                <div className="text-gray-500">
                    <p className="text-sm">Scroll down to load more posts</p>
                </div>
            ) : (
                <div className="text-gray-500">
                    <div className="w-16 h-0.5 bg-gray-300 mx-auto mb-4"></div>
                    <p className="text-sm font-medium">You've reached the end</p>
                    <p className="text-xs mt-1">No more posts to show</p>
                </div>
            )}
        </div>
    )
}

export default InfiniteScrollPagination
