"use client"
import React, { useState } from 'react'
import { useCreatePostMutation, useUpdatePostMutation } from '@/redux/features/posts/postsApi'
import { ToastMessage } from '@/utils/ToastMessage'
import ElegantCard from '@/components/common/ElegantCard'
import PostForm from './components/PostForm'

const PostUploadForm = ({ onSuccess, onCancel, editData = null, isEditMode = false }) => {
    const [createPost, { isLoading: isCreating }] = useCreatePostMutation()
    const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()

    const isLoading = isCreating || isUpdating

    const initialValues = {
        title: editData?.title || '',
        body: editData?.body || '',
        tags: editData?.tags || [''],
        visibility: editData?.visibility || 'public',
        images: editData?.images?.length > 0 ? editData.images : ['']
    }

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Filter out empty image URLs and tags
            const filteredImages = values.images.filter(url => url.trim() !== '')
            const filteredTags = values.tags.filter(tag => tag.trim() !== '')

            const postData = {
                ...values,
                images: filteredImages,
                tags: filteredTags
            }

            if (isEditMode && editData) {
                await updatePost({
                    postId: editData.id,
                    postData
                }).unwrap()
                ToastMessage.notifySuccess('Post updated successfully!')
            } else {
                await createPost(postData).unwrap()
                ToastMessage.notifySuccess('Post created successfully!')
            }

            if (onSuccess) onSuccess()
        } catch (error) {
            console.error(`Failed to ${isEditMode ? 'update' : 'create'} post:`, error)
            const errorMessage = error?.data?.message || error?.message || `Failed to ${isEditMode ? 'update' : 'create'} post`
            ToastMessage.notifyError(errorMessage)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {isEditMode ? 'Edit Post' : 'Create New Post'}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                            Share your story with the CIHS community
                        </p>
                    </div>
                </div>

                {/* Form */}
                <PostForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    onCancel={onCancel}
                    isLoading={isLoading}
                    isEditMode={isEditMode}
                />
            </div>
        </ElegantCard>
    )
}

export default PostUploadForm