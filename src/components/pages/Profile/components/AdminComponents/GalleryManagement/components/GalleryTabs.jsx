"use client"
import React from 'react'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'

const GalleryTabs = ({
    activeTab,
    onTabChange,
    yearFilter,
    onYearChange,
    totalItems,
    filteredCount
}) => {
    const tabs = [
        { id: 'pending_approval', label: 'Pending Approval', count: 0 },
        { id: 'active', label: 'Approved', count: 0 },
        { id: 'inactive', label: 'Rejected', count: 0 }
    ]

    const getCurrentYearRange = () => {
        const currentYear = new Date().getFullYear()
        const years = []
        for (let year = currentYear; year >= 1998; year--) {
            years.push(year)
        }
        return years
    }

    return (
        <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
            <div className="border-b border-gray-200">
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
                            {totalItems > 0 && activeTab === tab.id && (
                                <BlackTag size="xs" className="ml-2">
                                    {totalItems}
                                </BlackTag>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Filters */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Year:</label>
                    <select
                        value={yearFilter}
                        onChange={(e) => onYearChange(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                    >
                        <option value="">All Years</option>
                        {getCurrentYearRange().map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {yearFilter && (
                    <BlackButton
                        size="xs"
                        variant="outline"
                        onClick={() => onYearChange('')}
                    >
                        Clear Filter
                    </BlackButton>
                )}

                {/* Debug info - remove in production */}
                <div className="text-xs text-gray-500">
                    Status Filter: {activeTab} | Total: {totalItems} | Filtered: {filteredCount}
                </div>
            </div>
        </ElegantCard>
    )
}

export default GalleryTabs
