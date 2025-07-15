"use client"
import { useState, useRef } from 'react'
import BlackButton from '@/components/common/BlackButton'
import { ToastMessage } from '@/utils/ToastMessage'

const ImageUploader = ({
    onUpload,
    acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
    maxSizeMB = 10,
    buttonText = 'Upload Image',
    buttonVariant = 'solid',
    buttonSize = 'sm',
    multiple = false,
    className = ''
}) => {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef(null)

    const uploadToImgBB = async (file) => {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY)

        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            throw new Error('Upload failed')
        }

        const data = await response.json()
        return data.data.url
    }

    const handleFileSelect = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files || [])

        if (files.length === 0) return

        // Validate file types and sizes
        for (const file of files) {
            if (!acceptedTypes.includes(file.type)) {
                ToastMessage.notifyError(`Invalid file type: ${file.name}. Please upload ${acceptedTypes.join(', ')} files.`)
                return
            }

            if (file.size > maxSizeMB * 1024 * 1024) {
                ToastMessage.notifyError(`File too large: ${file.name}. Maximum size is ${maxSizeMB}MB.`)
                return
            }
        }

        setIsUploading(true)

        try {
            if (multiple) {
                // Upload multiple files
                const uploadPromises = files.map(file => uploadToImgBB(file))
                const urls = await Promise.all(uploadPromises)
                onUpload(urls)
                ToastMessage.notifySuccess(`${files.length} images uploaded successfully!`)
            } else {
                // Upload single file
                const url = await uploadToImgBB(files[0])
                onUpload(url)
                ToastMessage.notifySuccess('Image uploaded successfully!')
            }
        } catch (error) {
            console.error('Upload error:', error)
            ToastMessage.notifyError('Failed to upload image. Please try again.')
        } finally {
            setIsUploading(false)
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    return (
        <div className={className}>
            <input
                ref={fileInputRef}
                type="file"
                accept={acceptedTypes.join(',')}
                multiple={multiple}
                onChange={handleFileChange}
                className="hidden"
            />

            <BlackButton
                variant={buttonVariant}
                size={buttonSize}
                onClick={handleFileSelect}
                loading={isUploading}
                disabled={isUploading}
                icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                }
            >
                {isUploading ? 'Uploading...' : buttonText}
            </BlackButton>
        </div>
    )
}

export default ImageUploader
