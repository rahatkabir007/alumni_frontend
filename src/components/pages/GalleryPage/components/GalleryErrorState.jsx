"use client"
import React from 'react'

const GalleryErrorState = () => {
    return (
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center py-12">
                    <div className="text-red-400 text-4xl mb-4">⚠️</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Gallery</h4>
                    <p className="text-gray-600">There was an error loading the gallery images.</p>
                </div>
            </div>
        </section>
    )
}

export default GalleryErrorState
