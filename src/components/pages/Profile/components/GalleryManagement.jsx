"use client"
import { useState } from 'react'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import ImageUploader from './ImageUploader'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'
import Image from 'next/image'

const GalleryManagement = ({ userData }) => {
    const [uploadedImages, setUploadedImages] = useState([])
    const canUploadGallery = checkUserPermission(userData.roles, PERMISSIONS.UPLOAD_GALLERY)

    const handleImageUpload = (newImages) => {
        // If it's a single image, convert to array
        const imagesToAdd = Array.isArray(newImages) ? newImages : [newImages]
        setUploadedImages(prev => [...prev, ...imagesToAdd])
    }

    const handleRemoveImage = (indexToRemove) => {
        setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove))
    }

    return (
        <div className="space-y-6">
            {/* Upload Section */}
            {canUploadGallery && (
                <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Upload Images</h3>
                        <BlackTag variant="outline">Gallery Upload</BlackTag>
                    </div>

                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600 mb-4">Upload images to your gallery</p>
                        <ImageUploader
                            onUpload={handleImageUpload}
                            multiple={true}
                            buttonText="Upload Images"
                            acceptedTypes={['image/jpeg', 'image/png', 'image/jpg', 'image/gif']}
                            maxSizeMB={10}
                        />
                    </div>
                </ElegantCard>
            )}

            {/* Gallery Display */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">My Gallery</h3>
                    <BlackTag variant="subtle" size="sm">
                        {uploadedImages.length} images
                    </BlackTag>
                </div>

                {uploadedImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {uploadedImages.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                                <Image
                                    src={imageUrl}
                                    alt={`Gallery image ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                    <BlackButton
                                        size="sm"
                                        variant="outline"
                                        className="text-white border-white hover:bg-white hover:text-black"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        Remove
                                    </BlackButton>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No Images Yet</h4>
                        <p className="text-gray-600 mb-4">
                            {canUploadGallery
                                ? "Start uploading images to create your gallery"
                                : "You don't have permission to upload images"}
                        </p>

                        {canUploadGallery && <BlackTag variant="outline">Can Upload Images</BlackTag>}
                    </div>
                )}
            </ElegantCard>
        </div>
    )
}

export default GalleryManagement
