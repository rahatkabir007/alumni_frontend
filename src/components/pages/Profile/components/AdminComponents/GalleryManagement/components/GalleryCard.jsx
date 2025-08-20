"use client"
import React from 'react'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'
import Image from 'next/image'
import GalleryActionButtons from './GalleryActionButtons'

const GalleryCard = ({ gallery, processingIds, onStatusUpdate, onImageClick, getStatusColor, getInitials }) => {
    return (
        <ElegantCard key={gallery.id} className="overflow-hidden p-0">
            <div className="relative">
                <Image
                    src={gallery.image}
                    alt={gallery.title || `Gallery image`}
                    width={300}
                    height={200}
                    className="w-full h-32 object-cover cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => onImageClick(gallery)}
                />

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                    <BlackTag size="xs" className={getStatusColor(gallery.status)}>
                        {gallery.status}
                    </BlackTag>
                </div>
            </div>

            <div className="p-3">
                {gallery.title && (
                    <h4 className="font-medium text-gray-900 truncate text-sm mb-1">
                        {gallery.title}
                    </h4>
                )}

                <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold mr-2">
                        {getInitials(gallery.user?.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 truncate">
                            {gallery.user?.name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500">
                            {gallery.year} • {new Date(gallery.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="mt-2">
                    <GalleryActionButtons
                        gallery={gallery}
                        processingIds={processingIds}
                        onStatusUpdate={onStatusUpdate}
                    />
                </div>
            </div>
        </ElegantCard>
    )
}

export default GalleryCard
