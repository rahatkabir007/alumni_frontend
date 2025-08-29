"use client"
import { useState, useRef } from 'react'
import Image from 'next/image'
import BlackButton from '@/components/common/BlackButton'
import { ToastMessage } from '@/utils/ToastMessage'
import imageUploadService from '@/utils/imageUploadService'

const MultiImageUploader = ({
    images = [],
    onImagesChange,
    maxImages = 10,
    acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    maxSizeMB = 10,
    className = ""
}) => {
    const [uploading, setUploading] = useState({})
    const [uploadProgress, setUploadProgress] = useState({})
    const fileInputRef = useRef(null)

    const handleFileSelect = async (event) => {
        const files = Array.from(event.target.files || [])
        if (files.length === 0) return

        // Check if adding new images would exceed the limit
        if (images.length + files.length > maxImages) {
            ToastMessage.notifyError(`You can only upload up to ${maxImages} images`)
            return
        }

        // Validate each file
        for (const file of files) {
            const { type, size } = file
            const fileSizeMB = size / (1024 * 1024)

            if (!acceptedTypes.includes(type)) {
                ToastMessage.notifyError(`Please select valid image files (${acceptedTypes.join(', ')})`)
                return
            }

            if (fileSizeMB > maxSizeMB) {
                ToastMessage.notifyError(`File size must be less than ${maxSizeMB}MB`)
                return
            }
        }

        // Upload files one by one
        const newImages = [...images]
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const uploadId = Date.now() + i

            try {
                setUploading(prev => ({ ...prev, [uploadId]: true }))
                ToastMessage.notifyInfo(`Uploading image ${i + 1} of ${files.length}...`)

                const result = await imageUploadService.uploadImage(file, (progress) => {
                    setUploadProgress(prev => ({
                        ...prev,
                        [uploadId]: {
                            provider: progress.provider,
                            status: progress.status
                        }
                    }))
                })

                newImages.push(result.url)
                onImagesChange(newImages)

                if (i === files.length - 1) {
                    ToastMessage.notifySuccess(`All images uploaded successfully!`)
                }

            } catch (error) {
                console.error('Upload error:', error)
                ToastMessage.notifyError(`Failed to upload image ${i + 1}: ${error.message}`)
            } finally {
                setUploading(prev => {
                    const updated = { ...prev }
                    delete updated[uploadId]
                    return updated
                })
                setUploadProgress(prev => {
                    const updated = { ...prev }
                    delete updated[uploadId]
                    return updated
                })
            }
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index)
        onImagesChange(newImages)
        ToastMessage.notifySuccess('Image removed')
    }

    const handleReorderImage = (fromIndex, toIndex) => {
        const newImages = [...images]
        const [movedImage] = newImages.splice(fromIndex, 1)
        newImages.splice(toIndex, 0, movedImage)
        onImagesChange(newImages)
    }

    const isUploading = Object.keys(uploading).length > 0

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Upload Button */}
            <div className="flex items-center gap-4">
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileSelect}
                    className="hidden"
                />
                
                <BlackButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || images.length >= maxImages}
                    loading={isUploading}
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    }
                >
                    {isUploading ? 'Uploading...' : 'Add Images'}
                </BlackButton>

                <span className="text-sm text-gray-500">
                    {images.length}/{maxImages} images
                </span>
            </div>

            {/* Upload Progress */}
            {isUploading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-blue-800">
                            Uploading images to Cloudinary...
                        </span>
                    </div>
                </div>
            )}

            {/* Images Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                            <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                <Image
                                    src={imageUrl}
                                    alt={`Post image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                                
                                {/* Overlay with controls */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                    <div className="flex gap-2">
                                        {/* Move Left */}
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => handleReorderImage(index, index - 1)}
                                                className="p-1 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                                                title="Move left"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                        )}
                                        
                                        {/* Remove */}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="p-1 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                                            title="Remove image"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        
                                        {/* Move Right */}
                                        {index < images.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleReorderImage(index, index + 1)}
                                                className="p-1 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                                                title="Move right"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Image position indicator */}
                                <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                                    {index + 1}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Guidelines */}
            <div className="text-xs text-gray-500 space-y-1">
                <p>• Maximum {maxImages} images, up to {maxSizeMB}MB each</p>
                <p>• Supported formats: {acceptedTypes.join(', ')}</p>
                <p>• Images will be uploaded to Cloudinary</p>
                <p>• First image will be used as the main image</p>
            </div>
        </div>
    )
}

export default MultiImageUploader
