"use client"
import React from 'react'
import GlobalModal from '@/components/antd/Modal/GlobalModal'
import BlackTag from '@/components/common/BlackTag'
import Image from 'next/image'
import GalleryActionButtons from './GalleryActionButtons'

const GalleryImageModal = ({
    selectedImage,
    onClose,
    processingIds,
    onStatusUpdate,
    getStatusColor,
    getInitials
}) => {
    if (!selectedImage) return null

    return (
        <GlobalModal
            isModalOpen={!!selectedImage}
            setModalHandler={onClose}
            title={`Gallery Image - ${selectedImage.status}`}
            width={800}
            closeIcon={true}
        >
            <div className="p-6">
                <div className="relative mb-6">
                    <Image
                        src={selectedImage.image}
                        alt={selectedImage.title || 'Gallery image'}
                        width={800}
                        height={600}
                        className="w-full h-auto max-h-96 object-contain rounded-lg"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                        <BlackTag className={getStatusColor(selectedImage.status)}>
                            {selectedImage.status}
                        </BlackTag>
                    </div>
                </div>

                <div className="space-y-4">
                    {selectedImage.title && (
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Title</h4>
                            <p className="text-gray-700">{selectedImage.title}</p>
                        </div>
                    )}

                    {selectedImage.description && (
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                            <p className="text-gray-700">{selectedImage.description}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-900">Year:</span>
                            <span className="ml-2 text-gray-700">{selectedImage.year}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-900">Uploaded:</span>
                            <span className="ml-2 text-gray-700">
                                {new Date(selectedImage.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {selectedImage.user && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold mr-3">
                                    {getInitials(selectedImage.user.name)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{selectedImage.user.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {selectedImage.user.alumni_type === 'student'
                                            ? `Alumni, Batch ${selectedImage.user.batch}`
                                            : 'Faculty Member'}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <GalleryActionButtons
                                    gallery={selectedImage}
                                    processingIds={processingIds}
                                    onStatusUpdate={onStatusUpdate}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </GlobalModal>
    )
}

export default GalleryImageModal
