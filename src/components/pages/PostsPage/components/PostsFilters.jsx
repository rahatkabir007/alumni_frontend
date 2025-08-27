"use client"
import React from 'react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'

const PostsFilters = ({
    visibilityFilter,
    onVisibilityChange,
    totalItems,
    onRefresh
}) => {
    const visibilityOptions = [
        { value: 'all', label: 'All Posts' },
        { value: 'public', label: 'Public' },
        { value: 'alumni_only', label: 'Alumni Only' }
    ]

    return (
        <ScrollReveal direction="up" delay={0.4}>
            <section className="py-6 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ElegantCard>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700">Filter:</label>
                                    <select
                                        value={visibilityFilter}
                                        onChange={(e) => onVisibilityChange(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                                    >
                                        {visibilityOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {visibilityFilter !== 'all' && (
                                    <BlackButton
                                        size="xs"
                                        variant="outline"
                                        onClick={() => onVisibilityChange('all')}
                                    >
                                        Clear Filter
                                    </BlackButton>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <BlackTag variant="subtle" size="sm">
                                    {totalItems} posts
                                </BlackTag>

                                {onRefresh && (
                                    <BlackButton
                                        size="xs"
                                        variant="outline"
                                        onClick={onRefresh}
                                        icon={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        }
                                    >
                                        Refresh
                                    </BlackButton>
                                )}
                            </div>
                        </div>
                    </ElegantCard>
                </div>
            </section>
        </ScrollReveal>
    )
}

export default PostsFilters
