"use client"
import React from 'react'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'

const PostManagementHeader = ({ totalItems }) => {
    return (
        <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Post Management</h3>
                    <p className="text-gray-600 text-sm mt-1">
                        Review and moderate community posts
                    </p>
                </div>
                <BlackTag variant="subtle" size="sm">
                    {totalItems} posts
                </BlackTag>
            </div>
        </ElegantCard>
    )
}

export default PostManagementHeader
