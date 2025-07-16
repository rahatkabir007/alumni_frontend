"use client"
import { useState, useRef } from 'react'
import BlackButton from '@/components/common/BlackButton'
import { ToastMessage } from '@/utils/ToastMessage'

const ImageUploader = ({
    onUpload,
    acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg'],
    maxSizeMB = 5,
    buttonText = "Upload Image",
    buttonVariant = "filled",
    size = "md",
    disabled = false,
    className = "",
    icon = false // New prop to show edit icon instead of button
}) => {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef(null)

    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const { type, size } = file;
        const fileSizeMB = size / (1024 * 1024);

        if (!acceptedTypes.includes(type)) {
            return ToastMessage.notifyError(`Please select a valid image file (${acceptedTypes.join(', ')})`);
        }

        if (fileSizeMB > maxSizeMB) {
            return ToastMessage.notifyError(`File size must be less than ${maxSizeMB}MB`);
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY);

            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            const { data } = await response.json();
            await onUpload(data?.url || data?.display_url); // Use actual field returned by imgbb
        } catch (error) {
            console.error('Upload error:', error);
            ToastMessage.notifyError('Failed to upload image');
        } finally {
            setIsUploading(false);
            fileInputRef.current && (fileInputRef.current.value = '');
        }
    };


    const handleButtonClick = () => {
        if (!disabled && !isUploading) {
            fileInputRef.current?.click()
        }
    }

    return (
        <div className={className}>
            <input
                ref={fileInputRef}
                type="file"
                accept={acceptedTypes.join(',')}
                onChange={handleFileSelect}
                className="hidden"
            />

            {icon ? (
                // Edit icon version
                <button
                    onClick={handleButtonClick}
                    disabled={disabled || isUploading}
                    className="inline-flex items-center justify-center w-8 h-8 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title={isUploading ? 'Uploading...' : buttonText}
                >
                    {isUploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    )}
                </button>
            ) : (
                // Button version
                <BlackButton
                    variant={buttonVariant}
                    size={size}
                    onClick={handleButtonClick}
                    disabled={disabled || isUploading}
                    loading={isUploading}
                    className="w-full"
                >
                    {isUploading ? 'Uploading...' : buttonText}
                </BlackButton>
            )}
        </div>
    )
}

export default ImageUploader
