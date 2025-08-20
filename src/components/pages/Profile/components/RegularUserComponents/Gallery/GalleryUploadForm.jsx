"use client"
import { useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useCreateGalleryMutation, useUpdateGalleryMutation } from '@/redux/features/gallery/galleryApi'
import { ToastMessage } from '@/utils/ToastMessage'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import InputComponent1 from '@/components/common/InputComponent1'
import TextareaComponent1 from '@/components/common/TextareaComponent1'
import Image from 'next/image'
import imageUploadService from '@/utils/imageUploadService'

const GalleryUploadSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Title must be at least 3 characters')
        .max(255, 'Title cannot exceed 255 characters')
        .required('Title is required'),

    description: Yup.string()
        .max(1000, 'Description cannot exceed 1000 characters')
        .required('Description is required'),
    year: Yup.number()
        .min(1998, 'Year must be after 1998')
        .max(new Date().getFullYear(), `Year cannot exceed ${new Date().getFullYear()}`)
        .required('Year is required'),
    image: Yup.mixed()
        .required('Image is required')
})

const GalleryUploadForm = ({ onSuccess, onCancel, editData = null, isEditMode = false }) => {
    const [createGallery, { isLoading: isCreating }] = useCreateGalleryMutation()
    const [updateGallery, { isLoading: isUpdating }] = useUpdateGalleryMutation()
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [imageChanged, setImageChanged] = useState(false)

    const isLoading = isCreating || isUpdating

    // Set initial values for edit mode
    useEffect(() => {
        if (isEditMode && editData) {
            setPreviewUrl(editData.image)
            setImageChanged(false)
        }
    }, [isEditMode, editData])

    const handleFileSelect = (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        const { type, size } = file
        const fileSizeMB = size / (1024 * 1024)

        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(type)) {
            return ToastMessage.notifyError('Please select a valid image file (JPEG, PNG, JPG)')
        }

        if (fileSizeMB > 25) {
            return ToastMessage.notifyError('File size must be less than 25MB')
        }

        setSelectedFile(file)
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        setImageChanged(true)
    }

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            setIsUploading(true)
            let imageUrl = values.image

            // Upload new image if file was changed
            if (selectedFile && imageChanged) {
                ToastMessage.notifyInfo('Uploading image...')
                const uploadResult = await imageUploadService.uploadImage(selectedFile)
                imageUrl = uploadResult.url
            } else if (isEditMode && !imageChanged) {
                // Keep existing image URL for edit mode
                imageUrl = editData.image
            }

            const galleryData = {
                ...values,
                image: imageUrl
            }

            let result
            if (isEditMode) {
                result = await updateGallery({
                    id: editData.id,
                    ...galleryData
                }).unwrap()
                ToastMessage.notifySuccess('Gallery image updated successfully!')
            } else {
                result = await createGallery(galleryData).unwrap()
                ToastMessage.notifySuccess('Gallery image uploaded successfully!')
            }

            if (!isEditMode) {
                resetForm()
                setSelectedFile(null)
                setPreviewUrl('')
                setImageChanged(false)
            }

            if (onSuccess) onSuccess(result)
        } catch (error) {
            console.error(`Failed to ${isEditMode ? 'update' : 'upload'} gallery image:`, error)
            ToastMessage.notifyError(error.message || `Failed to ${isEditMode ? 'update' : 'upload'} gallery image`)
        } finally {
            setSubmitting(false)
            setIsUploading(false)
        }
    }

    const removeImage = () => {
        setSelectedFile(null)
        if (isEditMode) {
            setPreviewUrl(editData?.image || '')
            setImageChanged(false)
        } else {
            setPreviewUrl('')
        }
        if (previewUrl && imageChanged) {
            URL.revokeObjectURL(previewUrl)
        }
    }

    const getInitialValues = () => {
        if (isEditMode && editData) {
            return {
                title: editData.title || '',
                description: editData.description || '',
                year: editData.year || new Date().getFullYear(),
                image: editData.image || null
            }
        }
        return {
            title: '',
            description: '',
            year: new Date().getFullYear(),
            image: null
        }
    }

    return (
        <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }} shadow={isEditMode && "none"} border={isEditMode && false}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                    {isEditMode ? '' : 'Upload Gallery Image'}
                </h3>
                {(!isEditMode && onCancel) && (
                    <button
                        onClick={onCancel}
                        disabled={isLoading || isUploading}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                        title="Cancel"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <Formik
                initialValues={getInitialValues()}
                validationSchema={GalleryUploadSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ isSubmitting, setFieldValue, values }) => {
                    // Update form value when image is selected
                    if (selectedFile && values.image !== selectedFile) {
                        setFieldValue('image', selectedFile)
                    }

                    return (
                        <Form className="space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gallery Image <span className="text-red-500">*</span>
                                </label>

                                {!previewUrl ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-gray-600 mb-4">Select an image for your gallery</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            id="image-upload"
                                            disabled={isUploading || isLoading}
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                                        >
                                            Choose Image
                                        </label>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Image
                                                src={previewUrl}
                                                alt="Preview"
                                                width={400}
                                                height={300}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                {/* Change Image Button */}
                                                <label
                                                    htmlFor="image-change"
                                                    className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer"
                                                    title="Change image"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileSelect}
                                                    className="hidden"
                                                    id="image-change"
                                                    disabled={isUploading || isLoading}
                                                />

                                                {/* Remove Image Button */}
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                    disabled={isUploading || isLoading}
                                                    title="Remove image"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-green-600 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {imageChanged ? 'New image selected' : 'Image ready'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Form Fields */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputComponent1
                                    name="title"
                                    label="Title"
                                    placeholder="Enter image title"
                                    required
                                    useFormik={true}
                                    backgroundColor="bg-white"
                                    borderColor="border-gray-300"
                                    textColor="text-gray-900"
                                    focusBorderColor="focus:border-black"
                                    focusRingColor="focus:ring-black/10"
                                />

                                <InputComponent1
                                    name="year"
                                    type="number"
                                    label="Year"
                                    placeholder="Year when this image was taken"
                                    required
                                    useFormik={true}
                                    backgroundColor="bg-white"
                                    borderColor="border-gray-300"
                                    textColor="text-gray-900"
                                    focusBorderColor="focus:border-black"
                                    focusRingColor="focus:ring-black/10"
                                />
                            </div>

                            <TextareaComponent1
                                name="description"
                                label="Description"
                                placeholder="Describe this image..."
                                required
                                useFormik={true}
                                rows={3}
                                maxLength={1000}
                                showCharCount={true}
                                backgroundColor="bg-white"
                                borderColor="border-gray-300"
                                textColor="text-gray-900"
                                focusBorderColor="focus:border-black"
                                focusRingColor="focus:ring-black/10"
                            />

                            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                                {onCancel && (
                                    <BlackButton
                                        variant="outline"
                                        size="sm"
                                        onClick={onCancel}
                                        disabled={isSubmitting || isLoading || isUploading}
                                    >
                                        Cancel
                                    </BlackButton>
                                )}
                                <BlackButton
                                    type="submit"
                                    size="sm"
                                    loading={isSubmitting || isLoading || isUploading}
                                    disabled={isSubmitting || isLoading || isUploading || (!selectedFile && !isEditMode)}
                                >
                                    {isUploading ? 'Processing...' : isEditMode ? 'Update Gallery' : 'Upload to Gallery'}
                                </BlackButton>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </ElegantCard>
    )
}

export default GalleryUploadForm
