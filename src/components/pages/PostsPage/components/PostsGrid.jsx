"use client"
import React from 'react'
import PostCard from './PostCard'
import Pagination from '@/components/common/Pagination'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'

const PostsGrid = ({
    posts,
    isLoading,
    isFetching,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onPostClick,
    onRefetch
}) => {
    if (isLoading || isFetching) {
        return (
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading posts...</p>
                    </div>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

    if (posts.length === 0) {
        return (
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {posts.map((post, index) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onClick={onPostClick}
                            index={index}
                        />
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={onPageChange}
                            isLoading={isLoading || isFetching}
                        />
                    </div>
                )}
            </div>
        </section>
    )
}

export default PostsGrid
