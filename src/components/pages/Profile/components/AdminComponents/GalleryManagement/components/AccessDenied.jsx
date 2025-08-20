"use client"
import React from 'react'
import ElegantCard from '@/components/common/ElegantCard'

const AccessDenied = () => {
    return (
        <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
            <div className="text-center py-12">
                <div className="text-red-400 text-4xl mb-4">🔒</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h4>
                <p className="text-gray-600">You don't have permission to manage gallery.</p>
            </div>
        </ElegantCard>
    )
}

export default AccessDenied
