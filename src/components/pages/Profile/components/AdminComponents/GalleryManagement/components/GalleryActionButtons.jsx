"use client"
import React from 'react'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'

const GalleryActionButtons = ({ gallery, processingIds, onStatusUpdate }) => {
    const isProcessing = processingIds.has(gallery.id)
    const currentStatus = gallery.status

    if (currentStatus === 'pending_approval') {
        return (
            <div className="flex gap-2">
                <BlackButton
                    size="xs"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onStatusUpdate(gallery.id, 'active')}
                    disabled={isProcessing}
                    loading={isProcessing}
                >
                    {isProcessing ? 'Processing...' : 'Approve'}
                </BlackButton>
                <BlackButton
                    size="xs"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => onStatusUpdate(gallery.id, 'inactive')}
                    disabled={isProcessing}
                >
                    Reject
                </BlackButton>
            </div>
        )
    } else if (currentStatus === 'inactive') {
        return (
            <BlackButton
                size="xs"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onStatusUpdate(gallery.id, 'active')}
                disabled={isProcessing}
                loading={isProcessing}
            >
                {isProcessing ? 'Processing...' : 'Approve'}
            </BlackButton>
        )
    } else if (currentStatus === 'active') {
        return (
            <div className="flex gap-2">
                <BlackTag size="xs" className="bg-green-100 text-green-800">
                    Approved
                </BlackTag>
                <BlackButton
                    size="xs"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => onStatusUpdate(gallery.id, 'inactive')}
                    disabled={isProcessing}
                >
                    Reject
                </BlackButton>
            </div>
        )
    }

    return null
}

export default GalleryActionButtons
