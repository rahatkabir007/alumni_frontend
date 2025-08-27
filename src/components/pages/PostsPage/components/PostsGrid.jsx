"use client"
import React from 'react'
import PostCard from './PostCard'
import InfiniteScrollPagination from '@/components/common/InfiniteScrollPagination'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'

const PostsGrid = ({
    posts,
    isLoading,
    isFetching,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    onPostClick,
    onRefetch
}) => {
    if (isLoading && (!posts || posts.length === 0)) {
        return (
            <section className="py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <ElegantCard className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-48 bg-gray-200 rounded"></div>
                                    </div>
                                </ElegantCard>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (error && (!posts || posts.length === 0)) {
        return (
            <section className="py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ElegantCard>
                        <div className="text-center py-12">
                            <div className="text-red-400 text-4xl mb-4">⚠️</div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Posts</h4>
                            <p className="text-gray-600 mb-4">There was an error loading posts.</p>
                            {onRefetch && (
                                <BlackButton size="sm" onClick={onRefetch}>
                                    Try Again
                                </BlackButton>
                            )}
                        </div>
                    </ElegantCard>
                </div>
            </section>
        )
    }

    if (!posts || posts.length === 0) {
        return (
            <section className="py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ElegantCard>
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Posts Found</h4>
                            <p className="text-gray-600">No posts available at the moment.</p>
                        </div>
                    </ElegantCard>
                </div>
            </section>
        )
    }

    return (
        <section className="py-6">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Posts Feed - Single Column */}
                <div className="space-y-0">
                    {posts.map((post, index) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onClick={onPostClick}
                            index={index}
                        />
                    ))}
                </div>

                {/* Infinite Scroll Pagination */}
                <InfiniteScrollPagination
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
        </section>
    )
}

export default PostsGrid
