"use client"
import { useState, useRef } from 'react'
import Image from 'next/image'
import BlackButton from '@/components/common/BlackButton'
import { ToastMessage } from '@/utils/ToastMessage'

const MultiImageUploader = ({
    images = [],
    onImagesChange,
    maxImages = 10,
    acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    maxSizeMB = 10,
    className = ""
}) => {
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

        // Create preview URLs for local display
        const newImages = [...images]
        for (const file of files) {
            const previewUrl = URL.createObjectURL(file)
            newImages.push({
                file: file,
                preview: previewUrl,
                isUploaded: false
            })
        }

        onImagesChange(newImages)
        ToastMessage.notifySuccess(`${files.length} image(s) added for preview`)

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleRemoveImage = (index) => {
        const imageToRemove = images[index]

        // Clean up preview URL if it's a local file
        if (imageToRemove?.preview && !imageToRemove?.isUploaded) {
            URL.revokeObjectURL(imageToRemove.preview)
        }

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

    const getImageSrc = (image) => {
        // If it's a string, it's already uploaded (edit mode)
        if (typeof image === 'string') {
            return image
        }
        // If it's an object with preview, use preview URL
        if (image?.preview) {
            return image.preview
        }
        // If it's an object with url (uploaded), use the URL
        if (image?.url) {
            return image.url
        }
        return null
    }

    const getImageStatus = (image) => {
        if (typeof image === 'string') return 'uploaded'
        if (image?.isUploaded) return 'uploaded'
        return 'preview'
    }

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
                    disabled={images.length >= maxImages}
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    }
                >
                    Select Images
                </BlackButton>

                <span className="text-sm text-gray-500">
                    {images.length}/{maxImages} images
                </span>
            </div>

            {/* Images Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => {
                        const imageSrc = getImageSrc(image)
                        const status = getImageStatus(image)

                        if (!imageSrc) return null

                        return (
                            <div key={index} className="relative group">
                                <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                    <Image
                                        src={imageSrc}
                                        alt={`Post image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    />

                                    {/* Status indicator */}
                                    <div className="absolute top-2 right-2">
                                        {status === 'preview' ? (
                                            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                Preview
                                            </div>
                                        ) : (
                                            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                ✓
                                            </div>
                                        )}
                                    </div>

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
                        )
                    })}
                </div>
            )}

            {/* Guidelines */}
            <div className="text-xs text-gray-500 space-y-1">
                <p>• Maximum {maxImages} images, up to {maxSizeMB}MB each</p>
                <p>• Supported formats: {acceptedTypes.join(', ')}</p>
                <p>• Images will be uploaded when you submit the post</p>
                <p>• First image will be used as the main image</p>
            </div>
        </div>
    )
}

export default MultiImageUploader
