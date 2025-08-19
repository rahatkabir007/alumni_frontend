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
import ImageUploader from '../../ImageUploader'
import Image from 'next/image'

const GalleryUploadSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Title must be at least 3 characters')
        .max(255, 'Title cannot exceed 255 characters'),
    description: Yup.string()
        .max(1000, 'Description cannot exceed 1000 characters'),
    year: Yup.number()
        .min(1998, 'Year must be after 1998')
        .max(new Date().getFullYear(), `Year cannot exceed ${new Date().getFullYear()}`)
        .required('Year is required'),
    image: Yup.string()
        .url('Invalid image URL')
        .required('Image is required')
})

const GalleryUploadForm = ({ onSuccess, onCancel }) => {
    const [createGallery, { isLoading }] = useCreateGalleryMutation()
    const [uploadedImageUrl, setUploadedImageUrl] = useState('')
    const [isImageUploading, setIsImageUploading] = useState(false)

    const handleImageUpload = async (imageUrl) => {
        setUploadedImageUrl(imageUrl)
        ToastMessage.notifySuccess('Image uploaded successfully!')
    }

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const result = await createGallery({
                ...values,
                image: uploadedImageUrl
            }).unwrap()

            ToastMessage.notifySuccess('Gallery image uploaded successfully!')
            resetForm()
            setUploadedImageUrl('')
            if (onSuccess) onSuccess(result)
        } catch (error) {
            console.error('Failed to upload gallery image:', error)
            ToastMessage.notifyError(error.message || 'Failed to upload gallery image')
        } finally {
            setSubmitting(false)
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
                        disabled={isLoading || isImageUploading}
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
                    image: uploadedImageUrl
                }}
                validationSchema={GalleryUploadSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ isSubmitting, setFieldValue, values }) => {
                    // Update form value when image is uploaded
                    if (uploadedImageUrl && values.image !== uploadedImageUrl) {
                        setFieldValue('image', uploadedImageUrl)
                    }

                    return (
                        <Form className="space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gallery Image <span className="text-red-500">*</span>
                                </label>

                                {!uploadedImageUrl ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-gray-600 mb-4">Upload an image for your gallery</p>
                                        <ImageUploader
                                            onUpload={handleImageUpload}
                                            buttonText={isImageUploading ? "Uploading..." : "Choose Image"}
                                            acceptedTypes={['image/jpeg', 'image/png', 'image/jpg']}
                                            maxSizeMB={10}
                                            disabled={isImageUploading}
                                            onUploadStart={() => setIsImageUploading(true)}
                                            onUploadEnd={() => setIsImageUploading(false)}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Image
                                                src={uploadedImageUrl}
                                                alt="Uploaded image"
                                                width={400}
                                                height={300}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setUploadedImageUrl('')
                                                    setFieldValue('image', '')
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                disabled={isImageUploading || isLoading}
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <p className="text-sm text-green-600">✓ Image uploaded successfully</p>
                                    </div>
                                )}
                            </div>

                            {/* Form Fields */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputComponent1
                                    name="title"
                                    label="Title (Optional)"
                                    placeholder="Enter image title"
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
                                label="Description (Optional)"
                                placeholder="Describe this image..."
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
                                        disabled={isSubmitting || isLoading || isImageUploading}
                                    >
                                        Cancel
                                    </BlackButton>
                                )}
                                <BlackButton
                                    type="submit"
                                    size="sm"
                                    loading={isSubmitting || isLoading}
                                    disabled={isSubmitting || isLoading || isImageUploading || !uploadedImageUrl}
                                >
                                    Upload to Gallery
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
