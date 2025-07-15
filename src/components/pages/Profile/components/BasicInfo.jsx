"use client"
import { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useUpdateProfileMutation, useUpdateProfilePhotoMutation } from '@/redux/features/auth/authApi'
import { ToastMessage } from '@/utils/ToastMessage'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import InputComponent1 from '@/components/common/InputComponent1'
import TextareaComponent1 from '@/components/common/TextareaComponent1'
import ImageUploader from './ImageUploader'

const ProfileSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .required('Name is required'),
    phone: Yup.string()
        .matches(/^[\+]?[0-9\s\-\(\)]*$/, 'Invalid phone number format')
        .min(10, 'Phone number must be at least 10 digits'),
    bio: Yup.string()
        .max(500, 'Bio must be less than 500 characters'),
    location: Yup.string()
        .max(100, 'Location must be less than 100 characters'),
    profession: Yup.string()
        .max(100, 'Profession must be less than 100 characters'),
    graduationYear: Yup.number()
        .min(1950, 'Graduation year must be after 1950')
        .max(new Date().getFullYear(), 'Graduation year cannot be in the future'),
    batch: Yup.string()
        .max(20, 'Batch must be less than 20 characters')
});

const BasicInfo = ({ userData, onUpdate }) => {
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
    const [updateProfilePhoto, { isLoading: isUpdatingPhoto }] = useUpdateProfilePhotoMutation()
    const [isEditing, setIsEditing] = useState(false)

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
    }

    const handleSave = async (values, { setSubmitting }) => {
        try {
            const result = await updateProfile(values).unwrap()

            // Update local state with new data
            onUpdate(result.data || { ...userData, ...values })

            setIsEditing(false)
            ToastMessage.notifySuccess('Profile updated successfully!')
        } catch (error) {
            console.error('Failed to update profile:', error)
            ToastMessage.notifyError(error.data?.message || 'Failed to update profile')
        } finally {
            setSubmitting(false)
        }
    }

    const handleProfilePhotoUpdate = async (newPhotoUrl) => {
        try {
            const result = await updateProfilePhoto({ profilePhoto: newPhotoUrl }).unwrap()
            onUpdate({ ...userData, profilePhoto: newPhotoUrl })
            ToastMessage.notifySuccess('Profile photo updated!')
        } catch (error) {
            console.error('Failed to update profile photo:', error)
            ToastMessage.notifyError('Failed to update profile photo')
        }
    }

    return (
        <div className="space-y-6">
            {/* Profile Photo Section */}
            <ElegantCard>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Profile Photo</h3>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                        {userData.profilePhoto ? (
                            <img
                                src={userData.profilePhoto}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            userData.name?.charAt(0).toUpperCase() || 'A'
                        )}
                    </div>

                    <div className="flex-1">
                        <ImageUploader
                            onUpload={handleProfilePhotoUpdate}
                            acceptedTypes={['image/jpeg', 'image/png', 'image/jpg']}
                            maxSizeMB={5}
                            buttonText={isUpdatingPhoto ? "Updating..." : "Change Profile Photo"}
                            buttonVariant="outline"
                            disabled={isUpdatingPhoto}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Recommended: Square image, at least 200x200px, max 5MB
                        </p>
                    </div>
                </div>
            </ElegantCard>

            {/* Basic Information */}
            <ElegantCard>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
                    {!isEditing && (
                        <BlackButton size="sm" onClick={handleEdit}>
                            Edit Information
                        </BlackButton>
                    )}
                </div>

                {isEditing ? (
                    <Formik
                        initialValues={{
                            name: userData.name || '',
                            phone: userData.phone || '',
                            bio: userData.bio || '',
                            location: userData.location || '',
                            profession: userData.profession || '',
                            graduationYear: userData.graduationYear || '',
                            batch: userData.batch || '',
                        }}
                        validationSchema={ProfileSchema}
                        onSubmit={handleSave}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputComponent1
                                        name="name"
                                        label="Full Name"
                                        required
                                        useFormik={true}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                    />

                                    <div>
                                        <InputComponent1
                                            name="email"
                                            label="Email"
                                            value={userData.email}
                                            disabled={true}
                                            backgroundColor="bg-gray-50"
                                            borderColor="border-transparent"
                                            textColor="text-gray-900"
                                            className="cursor-default"
                                        />
                                        <span className="text-xs text-gray-500">Email cannot be changed</span>
                                    </div>

                                    <InputComponent1
                                        name="phone"
                                        type="tel"
                                        label="Phone"
                                        useFormik={true}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                    />

                                    <InputComponent1
                                        name="location"
                                        label="Location"
                                        useFormik={true}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                    />

                                    <InputComponent1
                                        name="profession"
                                        label="Profession"
                                        useFormik={true}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                    />

                                    <InputComponent1
                                        name="graduationYear"
                                        type="number"
                                        label="Graduation Year"
                                        useFormik={true}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                    />

                                    <InputComponent1
                                        name="batch"
                                        label="Batch"
                                        useFormik={true}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                    />

                                    <div className="md:col-span-2">
                                        <TextareaComponent1
                                            name="bio"
                                            label="Bio"
                                            useFormik={true}
                                            rows={4}
                                            maxLength={500}
                                            showCharCount={true}
                                            placeholder="Tell us about yourself..."
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                            resize="resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3 justify-end">
                                    <BlackButton
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancel}
                                        disabled={isSubmitting || isUpdating}
                                    >
                                        Cancel
                                    </BlackButton>
                                    <BlackButton
                                        type="submit"
                                        size="sm"
                                        loading={isSubmitting || isUpdating}
                                        disabled={isSubmitting || isUpdating}
                                    >
                                        Save Changes
                                    </BlackButton>
                                </div>
                            </Form>
                        )}
                    </Formik>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Read-only view */}
                        <InputComponent1
                            name="name"
                            label="Full Name"
                            value={userData.name || 'Not provided'}
                            disabled={true}
                            backgroundColor="bg-gray-50"
                            borderColor="border-transparent"
                            textColor="text-gray-900"
                            className="cursor-default"
                        />

                        <InputComponent1
                            name="email"
                            label="Email"
                            value={userData.email}
                            disabled={true}
                            backgroundColor="bg-gray-50"
                            borderColor="border-transparent"
                            textColor="text-gray-900"
                            className="cursor-default"
                        />

                        <InputComponent1
                            name="phone"
                            label="Phone"
                            value={userData.phone || 'Not provided'}
                            disabled={true}
                            backgroundColor="bg-gray-50"
                            borderColor="border-transparent"
                            textColor="text-gray-900"
                            className="cursor-default"
                        />

                        <InputComponent1
                            name="location"
                            label="Location"
                            value={userData.location || 'Not provided'}
                            disabled={true}
                            backgroundColor="bg-gray-50"
                            borderColor="border-transparent"
                            textColor="text-gray-900"
                            className="cursor-default"
                        />

                        <InputComponent1
                            name="profession"
                            label="Profession"
                            value={userData.profession || 'Not provided'}
                            disabled={true}
                            backgroundColor="bg-gray-50"
                            borderColor="border-transparent"
                            textColor="text-gray-900"
                            className="cursor-default"
                        />

                        <InputComponent1
                            name="graduationYear"
                            label="Graduation Year"
                            value={userData.graduationYear || 'Not provided'}
                            disabled={true}
                            backgroundColor="bg-gray-50"
                            borderColor="border-transparent"
                            textColor="text-gray-900"
                            className="cursor-default"
                        />

                        <InputComponent1
                            name="batch"
                            label="Batch"
                            value={userData.batch || 'Not provided'}
                            disabled={true}
                            backgroundColor="bg-gray-50"
                            borderColor="border-transparent"
                            textColor="text-gray-900"
                            className="cursor-default"
                        />

                        <div className="md:col-span-2">
                            <TextareaComponent1
                                name="bio"
                                label="Bio"
                                value={userData.bio || 'No bio provided'}
                                disabled={true}
                                rows={4}
                                backgroundColor="bg-gray-50"
                                borderColor="border-transparent"
                                textColor="text-gray-900"
                                className="cursor-default"
                                resize="resize-none"
                            />
                        </div>
                    </div>
                )}

                {/* Account Information */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
                    <div className="grid md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <span className="text-gray-500">User ID:</span>
                            <span className="ml-2 text-gray-900">{userData.id}</span>
                        </div>
                        {userData.provider && (
                            <div>
                                <span className="text-gray-500">Login Provider:</span>
                                <span className="ml-2 text-gray-900 capitalize">{userData.provider}</span>
                            </div>
                        )}
                        <div>
                            <span className="text-gray-500">Member Since:</span>
                            <span className="ml-2 text-gray-900">
                                {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">Last Updated:</span>
                            <span className="ml-2 text-gray-900">
                                {userData.updatedAt ? new Date(userData.updatedAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </ElegantCard>
        </div>
    )
}

export default BasicInfo
