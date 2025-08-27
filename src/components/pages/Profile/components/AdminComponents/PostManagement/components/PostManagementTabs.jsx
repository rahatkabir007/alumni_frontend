"use client"
import React from 'react'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'

const PostManagementTabs = ({
    activeTab,
    onTabChange,
    visibilityFilter,
    onVisibilityChange
}) => {
    const tabs = [
        { id: 'pending_approval', label: 'Pending Approval' },
        { id: 'active', label: 'Published' },
        { id: 'inactive', label: 'Rejected' }
    ]

    return (
        <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Visibility:</label>
                    <select
                        value={visibilityFilter}
                        onChange={(e) => onVisibilityChange(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                    >
                        <option value="all">All Visibility</option>
                        <option value="public">Public</option>
                        <option value="alumni_only">Alumni Only</option>
                        <option value="private">Private</option>
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
        </ElegantCard>
    )
}

export default PostManagementTabs
