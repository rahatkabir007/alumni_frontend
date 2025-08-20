"use client"
import React from 'react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'

const GalleryFilters = ({ yearFilter, onYearChange, totalItems }) => {
    const getCurrentYearRange = () => {
        const currentYear = new Date().getFullYear()
        const years = []
        for (let year = currentYear; year >= 1998; year--) {
            years.push(year)
        }
        return years
    }

    return (
        <ScrollReveal direction="up" delay={0.4}>
            <section className="py-8 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-4 items-center justify-center">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Filter by Year:</label>
                            <select
                                value={yearFilter}
                                onChange={(e) => onYearChange(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
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

                        <BlackTag size="sm" className="ml-4">
                            {totalItems} photos
                        </BlackTag>
                    </div>
                </div>
            </section>
        </ScrollReveal>
    )
}

export default GalleryFilters
