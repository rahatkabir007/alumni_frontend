"use client"
import { useState, useRef } from 'react'
import BlackButton from '@/components/common/BlackButton'
import { ToastMessage } from '@/utils/ToastMessage'
import imageUploadService from '@/utils/imageUploadService'

const ImageUploader = ({
    onUpload,
    acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg'],
    maxSizeMB = 25, // Increased to match highest provider limit
    buttonText = "Upload Image",
    buttonVariant = "filled",
    size = "md",
    disabled = false,
    className = "",
    icon = false
}) => {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({ provider: '', status: '' })
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
        ToastMessage.notifyInfo('Uploading image...');

        try {
            const result = await imageUploadService.uploadImage(file, (progress) => {
                setUploadProgress({
                    provider: progress.provider,
                    status: progress.status
                });
            });

            ToastMessage.notifySuccess(`Image uploaded successfully via ${result.provider}`);
            await onUpload(result.url);
        } catch (error) {
            console.error('Upload error:', error);
            ToastMessage.notifyError(error.message || 'Failed to upload image');
        } finally {
            setIsUploading(false);
            setUploadProgress({ provider: '', status: '' });
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
                <button
                    onClick={handleButtonClick}
                    disabled={disabled || isUploading}
                    className="inline-flex items-center justify-center w-8 h-8 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title={isUploading ? `Uploading via ${uploadProgress.provider}...` : buttonText}
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
                <BlackButton
                    variant={buttonVariant}
                    size={size}
                    onClick={handleButtonClick}
                    disabled={disabled || isUploading}
                    loading={isUploading}
                    className="w-full"
                >
                    {isUploading ?
                        `Uploading${uploadProgress.provider ? ` via ${uploadProgress.provider}` : ''}...` :
                        buttonText
                    }
                </BlackButton>
            )}
        </div>
    )
}

export default ImageUploader
