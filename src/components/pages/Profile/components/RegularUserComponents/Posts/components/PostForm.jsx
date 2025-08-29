"use client"
import { useState } from 'react'
import { Formik, Form, Field, FieldArray } from 'formik'
import * as Yup from 'yup'
import InputComponent1 from '@/components/common/InputComponent1'
import BlackButton from '@/components/common/BlackButton'
import MultiImageUploader from './MultiImageUploader'

const PostForm = ({ initialValues, onSubmit, onCancel, isLoading, isEditMode = false }) => {
    const PostSchema = Yup.object().shape({
        title: Yup.string().min(3, 'Title must be at least 3 characters'),
        body: Yup.string().required('Post content is required').min(10, 'Post content must be at least 10 characters'),
        tags: Yup.array().of(Yup.string().trim()),
        visibility: Yup.string().required('Visibility is required'),
        images: Yup.array().of(Yup.string().url('Must be a valid URL'))
    })

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={PostSchema}
            onSubmit={onSubmit}
        >
            {({ values, errors, touched, setFieldValue }) => (
                <Form className="space-y-6">
                    {/* Title */}
                    <InputComponent1
                        name="title"
                        label="Post Title (Optional)"
                        placeholder="Enter a title for your post"
                        useFormik={true}
                    />

                    {/* Body */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Post Content *
                        </label>
                        <Field
                            as="textarea"
                            name="body"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                            rows={6}
                            placeholder="What's on your mind? Share your thoughts, memories, achievements..."
                        />
                        {errors.body && touched.body && (
                            <p className="mt-1 text-sm text-red-600">{errors.body}</p>
                        )}
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Images (Optional)
                        </label>
                        <MultiImageUploader
                            images={values.images}
                            onImagesChange={(newImages) => setFieldValue('images', newImages)}
                            maxImages={10}
                            acceptedTypes={['image/jpeg', 'image/png', 'image/jpg', 'image/webp']}
                            maxSizeMB={10}
                        />
                        {errors.images && touched.images && (
                            <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                        )}
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags (Optional)
                        </label>
                        <FieldArray name="tags">
                            {({ push, remove }) => (
                                <div className="space-y-3">
                                    {values.tags.map((tag, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Field
                                                name={`tags.${index}`}
                                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                                                placeholder="Enter tag (e.g., memories, achievement, batch2020)"
                                            />
                                            {values.tags.length > 1 && (
                                                <BlackButton
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                >
                                                    Remove
                                                </BlackButton>
                                            )}
                                        </div>
                                    ))}
                                    <BlackButton
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => push('')}
                                        icon={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        }
                                    >
                                        Add Tag
                                    </BlackButton>
                                </div>
                            )}
                        </FieldArray>
                    </div>

                    {/* Visibility */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Visibility *
                        </label>
                        <Field
                            as="select"
                            name="visibility"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        >
                            <option value="public">Public - Visible to everyone</option>
                            <option value="alumni_only">Alumni Only - Visible to CIHS alumni</option>
                            <option value="private">Private - Only you can see</option>
                        </Field>
                        {errors.visibility && touched.visibility && (
                            <p className="mt-1 text-sm text-red-600">{errors.visibility}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3">
                        <BlackButton
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            Cancel
                        </BlackButton>
                        <BlackButton
                            type="submit"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Post' : 'Create Post')}
                        </BlackButton>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default PostForm
