"use client"
import React from 'react'
import Image from 'next/image'
import GalleryInteractions from '@/components/common/GalleryInteractions/GalleryInteractions'

const GalleryImageCard = ({ gallery, onClick }) => {
    return (
        <div className="break-inside-avoid relative group cursor-pointer mb-4">
            <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <Image
                    src={gallery.image}
                    alt={gallery.title || `Gallery image`}
                    width={400}
                    height={Math.floor(Math.random() * 200) + 300} // Random height for masonry effect
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    style={{ height: 'auto' }}

                />

                {/* Overlay with title and year */}
                <div onClick={onClick} className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end">
                    <div className="p-4 bg-[rgba(0,0,0,0.8)] w-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                        {gallery.title && (
                            <h3 className="font-semibold text-lg mb-1">{gallery.title}</h3>
                        )}
                        <p className="text-sm opacity-90">{gallery.year}</p>
                        {gallery.user && (
                            <p className="text-xs opacity-75 mt-1">
                                By {gallery.user.name}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Interactions Section */}
            <div className="mt-3 px-2">
                <GalleryInteractions gallery={gallery} showInline={false} />
            </div>
        </div>
    )
}

export default GalleryImageCard
