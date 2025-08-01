"use client"
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import GlobalModal from '@/components/antd/Modal/GlobalModal'
import InputComponent1 from '@/components/common/InputComponent1'
import BlackButton from '@/components/common/BlackButton'
import { useState } from 'react'

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

const VerificationModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const [uploadingImages, setUploadingImages] = useState(false);

    const handleImageUpload = async (files, setFieldValue) => {
        setUploadingImages(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);

                // Replace with your actual upload endpoint
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error('Upload failed');
                const data = await response.json();
                return data.url;
            });

            const imageUrls = await Promise.all(uploadPromises);
            setFieldValue('verification_images', imageUrls);
        } catch (error) {
            console.error('Image upload failed:', error);
        } finally {
            setUploadingImages(false);
        }
    };

    if (!isOpen) return null;

    return (
        <GlobalModal
            isModalOpen={isOpen}
            onClose={onClose}
            title='Apply for Verification'
            setModalHandler={onClose}
            width={700}
        >
            <div className="p-6">
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h4 className="text-sm font-semibold text-blue-900 mb-1">Verification Requirements</h4>
                            <p className="text-sm text-blue-800">
                                Please upload verification images (ID card, certificates, etc.) to verify your identity.
                                Social media links are optional but providing them will help speed up the verification process.
                            </p>
                        </div>
                    </div>
                </div>

                <Formik
                    initialValues={{
                        verification_images: [],
                        socialMedia: {
                            linkedin: '',
                            twitter: '',
                            facebook: ''
                        }
                    }}
                    validationSchema={VerificationSchema}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        onSubmit(values, { setSubmitting, resetForm });
                    }}
                >
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-6">
                            {/* Verification Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Images <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e.target.files, setFieldValue)}
                                        className="hidden"
                                        id="verification-images"
                                        disabled={uploadingImages}
                                    />
                                    <label
                                        htmlFor="verification-images"
                                        className={`cursor-pointer ${uploadingImages ? 'opacity-50' : ''}`}
                                    >
                                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <div className="text-sm text-gray-600">
                                            {uploadingImages ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                    <span>Uploading images...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                                                    <br />
                                                    <span className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB each</span>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>

                                {/* Display uploaded images */}
                                {values.verification_images.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600 mb-2">Uploaded images ({values.verification_images.length}):</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {values.verification_images.map((url, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={url}
                                                        alt={`Verification ${index + 1}`}
                                                        className="w-full h-20 object-cover rounded border"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newImages = values.verification_images.filter((_, i) => i !== index);
                                                            setFieldValue('verification_images', newImages);
                                                        }}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {errors.verification_images && touched.verification_images && (
                                    <div className="mt-1 text-sm text-red-600">{errors.verification_images}</div>
                                )}
                            </div>

                            {/* Social Media Links */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-4">
                                    Social Media Links <span className="text-gray-500">(Optional)</span>
                                </h4>
                                <div className="space-y-4">
                                    <InputComponent1
                                        name="socialMedia.linkedin"
                                        label="LinkedIn Profile"
                                        placeholder="https://linkedin.com/in/your-profile"
                                        useFormik={true}
                                        backgroundColor="bg-white"
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
                                        backgroundColor="bg-white"
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
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                                <BlackButton
                                    variant="outline"
                                    size="sm"
                                    onClick={onClose}
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
                        </Form>
                    )}
                </Formik>
            </div>
        </GlobalModal>
    )
}

export default VerificationModal
