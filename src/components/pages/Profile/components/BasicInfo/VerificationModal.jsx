"use client"
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import GlobalModal from '@/components/antd/Modal/GlobalModal'
import InputComponent1 from '@/components/common/InputComponent1'
import BlackButton from '@/components/common/BlackButton'
import { useState, useEffect } from 'react'
import { ToastMessage } from '@/utils/ToastMessage'
import imageUploadService from '@/utils/imageUploadService'
import Image from 'next/image'

const VerificationSchema = Yup.object().shape({
    verification_images: Yup.array()
        .min(1, 'At least one verification image is required')
        .required('Verification images are required'),
    socialMedia: Yup.object().shape({
        linkedin: Yup.string().url('Invalid LinkedIn URL'),
        twitter: Yup.string().url('Invalid Twitter URL'),
        facebook: Yup.string().url('Invalid Facebook URL')
    })
});

const VerificationModal = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    viewMode = false,
    existingData = null,
    title = null
}) => {
    const [uploadingImages, setUploadingImages] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, provider: '' });

    // Transform existing verification_fields data to match form structure
    const getInitialValues = () => {
        if (existingData?.verification_fields) {
            const verificationFields = existingData.verification_fields;

            // Transform image URLs to image objects for display
            const imageObjects = (verificationFields.verification_images || []).map((url, index) => ({
                id: `existing_${index}`,
                url: url,
                name: `Verification Image ${index + 1}`,
                provider: 'Existing'
            }));

            return {
                verification_images: imageObjects,
                socialMedia: {
                    linkedin: verificationFields.socialMedia?.linkedin || '',
                    twitter: verificationFields.socialMedia?.twitter || '',
                    facebook: verificationFields.socialMedia?.facebook || ''
                }
            };
        }

        return {
            verification_images: [],
            socialMedia: {
                linkedin: '',
                twitter: '',
                facebook: ''
            }
        };
    };

    const handleImageUpload = async (files, setFieldValue, currentImages = []) => {
        if (viewMode) return; // Don't allow upload in view mode

        if (!files || files.length === 0) return;

        // Check if adding new images would exceed limit
        const totalImages = currentImages.length + files.length;
        if (totalImages > 5) {
            ToastMessage.notifyError('Maximum 5 images allowed');
            return;
        }

        setUploadingImages(true);
        setUploadProgress({ current: 0, total: files.length, provider: '' });

        try {
            const uploadPromises = Array.from(files).map(async (file, index) => {
                // Validate file size (25MB limit for largest provider)
                if (file.size > 25 * 1024 * 1024) {
                    throw new Error(`File ${file.name} is too large. Maximum size is 25MB.`);
                }

                try {
                    const result = await imageUploadService.uploadImage(file, (progress) => {
                        setUploadProgress(prev => ({
                            ...prev,
                            current: index + 1,
                            provider: progress.provider,
                            status: progress.status
                        }));
                    });

                    return {
                        url: result.url,
                        name: file.name,
                        id: Date.now() + index,
                        provider: result.provider,
                        deleteUrl: result.deleteUrl
                    };
                } catch (error) {
                    console.error(`Failed to upload ${file.name}:`, error);
                    throw new Error(`Failed to upload ${file.name}: ${error.message}`);
                }
            });

            const uploadedImages = await Promise.all(uploadPromises);
            const allImages = [...currentImages, ...uploadedImages];
            setFieldValue('verification_images', allImages);

            ToastMessage.notifySuccess(`Successfully uploaded ${uploadedImages.length} image(s)`);
        } catch (error) {
            console.error('Image upload failed:', error);
            ToastMessage.notifyError(error.message || 'Failed to upload images');
        } finally {
            setUploadingImages(false);
            setUploadProgress({ current: 0, total: 0, provider: '' });
        }
    };

    const handleImageRemove = (imageId, currentImages, setFieldValue) => {
        if (viewMode) return; // Don't allow removal in view mode

        const updatedImages = currentImages.filter(img => img.id !== imageId);
        setFieldValue('verification_images', updatedImages);
        ToastMessage.notifyInfo('Image removed');
    };

    // Prevent modal close during upload (only in edit mode)
    const handleModalClose = () => {
        if (uploadingImages && !viewMode) {
            ToastMessage.notifyWarning('Please wait for image upload to complete');
            return;
        }
        onClose();
    };

    const getModalTitle = () => {
        if (title) return title;
        if (viewMode) return 'Verification Details';
        return 'Apply for Verification';
    };

    if (!isOpen) return null;

    return (
        <GlobalModal
            isModalOpen={isOpen}
            onClose={handleModalClose}
            title={getModalTitle()}
            setModalHandler={handleModalClose}
            width={700}
            closable={!uploadingImages || viewMode}
            maskClosable={!uploadingImages || viewMode}
        >
            <div className="p-6">
                {/* Provider Status Info - Only show in edit mode */}
                {!viewMode && (
                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="text-xs text-gray-600">
                            <span className="font-medium">Available upload providers:</span>
                            {imageUploadService.getProviderStatus().map((provider, index) => (
                                <span key={provider.name} className="ml-2">
                                    {provider.name} ({provider.maxSizeMB}MB)
                                    {index < imageUploadService.getProviderStatus().length - 1 && ','}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Information Notice */}
                <div className={`mb-6 p-4 border rounded-lg ${viewMode ? 'bg-blue-50 border-blue-200' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                {viewMode ? 'Verification Information' : 'Verification Requirements'}
                            </h4>
                            <p className="text-sm text-blue-800">
                                {viewMode
                                    ? 'Below are the verification details submitted by the user.'
                                    : 'Please upload verification images (ID card, certificates, transcripts, etc.) to verify your identity. Social media links are optional but providing them will help speed up the verification process.'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <Formik
                    initialValues={getInitialValues()}
                    validationSchema={viewMode ? undefined : VerificationSchema}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        if (viewMode) return;

                        // Transform the data to match backend expectations
                        const submitData = {
                            verification_images: values.verification_images.map(img => img.url),
                            socialMedia: values.socialMedia
                        };
                        onSubmit(submitData, { setSubmitting, resetForm });
                    }}
                    enableReinitialize={true}
                >
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-6">
                            {/* Verification Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Images {!viewMode && <span className="text-red-500">*</span>}
                                    <span className="text-xs text-gray-500 ml-2">
                                        ({values.verification_images.length}/5 images)
                                    </span>
                                </label>

                                {/* Upload Area - Only show in edit mode */}
                                {!viewMode && (
                                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${uploadingImages
                                        ? 'border-blue-300 bg-blue-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e.target.files, setFieldValue, values.verification_images)}
                                            className="hidden"
                                            id="verification-images"
                                            disabled={uploadingImages || values.verification_images.length >= 5}
                                        />
                                        <label
                                            htmlFor="verification-images"
                                            className={`cursor-pointer ${uploadingImages ? 'opacity-50' : ''} ${values.verification_images.length >= 5 ? 'cursor-not-allowed opacity-50' : ''
                                                }`}
                                        >
                                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <div className="text-sm text-gray-600">
                                                {uploadingImages ? (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                            <span>Uploading images...</span>
                                                        </div>
                                                        <div className="text-xs space-y-1">
                                                            <div>Provider: {uploadProgress.provider}</div>
                                                            <div>Progress: {uploadProgress.current}/{uploadProgress.total}</div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2 mx-auto max-w-xs">
                                                                <div
                                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : values.verification_images.length >= 5 ? (
                                                    <>
                                                        <span className="font-medium text-gray-500">Maximum images reached</span>
                                                        <br />
                                                        <span className="text-xs text-gray-400">Remove some images to upload more</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                                                        <br />
                                                        <span className="text-xs text-gray-500">PNG, JPG, JPEG up to 25MB each (Max 5 images)</span>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                )}

                                {/* Display uploaded images */}
                                {values.verification_images.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600 mb-3">
                                            {viewMode ? 'Submitted images:' : 'Uploaded images:'}
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {values.verification_images.map((image, index) => (
                                                <div key={image.id} className="relative group">
                                                    <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                        <Image
                                                            width={400}
                                                            height={400}
                                                            src={image.url}
                                                            alt={`Verification ${index + 1}`}
                                                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                                            onClick={() => window.open(image.url, '_blank')}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                        <div className="hidden w-full h-full items-center justify-center bg-gray-100 text-gray-500 text-xs">
                                                            Failed to load
                                                        </div>
                                                    </div>
                                                    {!viewMode && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleImageRemove(image.id, values.verification_images, setFieldValue)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                                            disabled={uploadingImages}
                                                            title="Remove image"
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                    <div className="mt-1 text-xs text-gray-500 truncate" title={`${image.name} (${image.provider})`}>
                                                        {image.name}
                                                    </div>
                                                    {/* View in new tab icon for view mode */}
                                                    {viewMode && (
                                                        <button
                                                            type="button"
                                                            onClick={() => window.open(image.url, '_blank')}
                                                            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                            title="View in new tab"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!viewMode && errors.verification_images && touched.verification_images && (
                                    <div className="mt-1 text-sm text-red-600">{errors.verification_images}</div>
                                )}
                            </div>

                            {/* Social Media Links */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-4">
                                    Social Media Links {!viewMode && <span className="text-gray-500">(Optional)</span>}
                                </h4>
                                <div className="space-y-4">
                                    <InputComponent1
                                        name="socialMedia.linkedin"
                                        label="LinkedIn Profile"
                                        placeholder="https://linkedin.com/in/your-profile"
                                        useFormik={true}
                                        disabled={viewMode}
                                        backgroundColor={viewMode ? "bg-gray-50" : "bg-white"}
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                    />

                                    <InputComponent1
                                        name="socialMedia.twitter"
                                        label="Twitter Profile"
                                        placeholder="https://twitter.com/your-handle"
                                        useFormik={true}
                                        disabled={viewMode}
                                        backgroundColor={viewMode ? "bg-gray-50" : "bg-white"}
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                    />

                                    <InputComponent1
                                        name="socialMedia.facebook"
                                        label="Facebook Profile"
                                        placeholder="https://facebook.com/your-profile"
                                        useFormik={true}
                                        disabled={viewMode}
                                        backgroundColor={viewMode ? "bg-gray-50" : "bg-white"}
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                    />
                                </div>
                            </div>

                            {/* Upload Warning - Only show in edit mode */}
                            {!viewMode && uploadingImages && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <span className="text-sm text-amber-800">
                                            Please wait for image upload to complete before closing this modal.
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons - Only show in edit mode */}
                            {!viewMode && (
                                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                                    <BlackButton
                                        variant="outline"
                                        size="sm"
                                        onClick={handleModalClose}
                                        disabled={isSubmitting || isLoading || uploadingImages}
                                    >
                                        Cancel
                                    </BlackButton>
                                    <BlackButton
                                        type="submit"
                                        size="sm"
                                        loading={isSubmitting || isLoading}
                                        disabled={isSubmitting || isLoading || uploadingImages || values.verification_images.length === 0}
                                    >
                                        Submit for Verification
                                    </BlackButton>
                                </div>
                            )}

                            {/* View Mode Close Button */}
                            {viewMode && (
                                <div className="flex justify-end pt-4 border-t border-gray-200">
                                    <BlackButton
                                        variant="outline"
                                        size="sm"
                                        onClick={handleModalClose}
                                    >
                                        Close
                                    </BlackButton>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        </GlobalModal>
    )
}

export default VerificationModal
