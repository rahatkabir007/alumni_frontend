"use client"
import React from 'react'
import ElegantCard from '@/components/common/ElegantCard'

const GalleryManagementHeader = () => {
    return (
        <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
            <div>
                <h3 className="text-xl font-bold text-gray-900">Gallery Management</h3>
                <p className="text-gray-600 text-sm mt-1">
                    Review and moderate community gallery images
                </p>
            </div>
        </ElegantCard>
    )
}

export default GalleryManagementHeader
