"use client"
import { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useCreateGalleryMutation } from '@/redux/features/gallery/galleryApi'
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

const GalleryUploadForm = ({ onSuccess, onCancel }) => {
    const [createGallery, { isLoading }] = useCreateGalleryMutation()
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')
    const [isUploading, setIsUploading] = useState(false)

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
    }

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        if (!selectedFile) {
            ToastMessage.notifyError('Please select an image')
            return
        }

        try {
            setIsUploading(true)
            ToastMessage.notifyInfo('Uploading image...')

            // Upload image first
            const uploadResult = await imageUploadService.uploadImage(selectedFile)

            // Then create gallery entry with uploaded image URL
            const result = await createGallery({
                ...values,
                image: uploadResult.url
            }).unwrap()

            ToastMessage.notifySuccess('Gallery image uploaded successfully!')
            resetForm()
            setSelectedFile(null)
            setPreviewUrl('')
            if (onSuccess) onSuccess(result)
        } catch (error) {
            console.error('Failed to upload gallery image:', error)
            ToastMessage.notifyError(error.message || 'Failed to upload gallery image')
        } finally {
            setSubmitting(false)
            setIsUploading(false)
        }
    }

    const removeImage = () => {
        setSelectedFile(null)
        setPreviewUrl('')
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }
    }

    return (
        <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Upload Gallery Image</h3>
                {onCancel && (
                    <BlackButton
                        variant="outline"
                        size="sm"
                        onClick={onCancel}
                        disabled={isLoading || isUploading}
                    >
                        Cancel
                    </BlackButton>
                )}
            </div>

            <Formik
                initialValues={{
                    title: '',
                    description: '',
                    year: new Date().getFullYear(),
                    image: null
                }}
                validationSchema={GalleryUploadSchema}
                onSubmit={handleSubmit}
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
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                disabled={isUploading || isLoading}
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <p className="text-sm text-green-600">✓ Image selected for upload</p>
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
                                    disabled={isSubmitting || isLoading || isUploading || !selectedFile}
                                >
                                    {isUploading ? 'Uploading...' : 'Upload to Gallery'}
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
