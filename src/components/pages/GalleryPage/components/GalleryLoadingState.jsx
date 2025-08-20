"use client"
import React from 'react'

const GalleryLoadingState = () => {
    return (
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading gallery...</p>
                </div>
            </div>
        </section>
    )
}

export default GalleryLoadingState
