"use client"
import { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useUpdateUserMutation } from '@/redux/features/user/userApi'
import { ToastMessage } from '@/utils/ToastMessage'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import InputComponent1 from '@/components/common/InputComponent1'
import TextareaComponent1 from '@/components/common/TextareaComponent1'

// Enhanced validation schema based on backend model
const ProfileSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, 'Name is required')
        .max(100, 'Name cannot exceed 100 characters')
        .test('no-harmful-chars', 'Name contains invalid characters', (value) => {
            if (!value) return true;
            return !/<script|javascript:|on\w+=/i.test(value);
        })
        .required('Name is required'),
    phone: Yup.string()
        .max(20, 'Phone number cannot exceed 20 characters')
        .matches(/^[\d\s\-\(\)\+]*$/, 'Phone number contains invalid characters'),
    location: Yup.string()
        .max(500, 'Location cannot exceed 500 characters')
        .test('no-harmful-chars', 'Location contains invalid characters', (value) => {
            if (!value) return true;
            return !/<script|javascript:|on\w+=/i.test(value);
        }),
    profession: Yup.string()
        .max(255, 'Profession cannot exceed 255 characters')
        .test('no-harmful-chars', 'Profession contains invalid characters', (value) => {
            if (!value) return true;
            return !/<script|javascript:|on\w+=/i.test(value);
        }),
    graduationYear: Yup.number()
        .min(1950, 'Graduation year must be after 1950')
        .max(new Date().getFullYear() + 10, `Graduation year cannot exceed ${new Date().getFullYear() + 10}`)
        .nullable()
        .transform((value, originalValue) => {
            // Transform empty string to null
            return originalValue === '' ? null : value;
        }),
    batch: Yup.string()
        .max(100, 'Batch cannot exceed 100 characters')
        .test('no-harmful-chars', 'Batch contains invalid characters', (value) => {
            if (!value) return true;
            return !/<script|javascript:|on\w+=/i.test(value);
        }),
    bio: Yup.string()
        .max(2000, 'Bio cannot exceed 2000 characters')
        .test('no-harmful-chars', 'Bio contains invalid characters', (value) => {
            if (!value) return true;
            return !/<script|javascript:|on\w+=/i.test(value);
        }),
    isGraduated: Yup.boolean(),
    leftAt: Yup.number()
        .min(1998, 'Left at year must be after 1998')
        .max(new Date().getFullYear(), `Left at year cannot exceed ${new Date().getFullYear()}`)
        .nullable()
        .transform((value, originalValue) => {
            return originalValue === '' ? null : value;
        })
        .when('isGraduated', {
            is: false,
            then: (schema) => schema.required('Left at year is required when not graduated'),
            otherwise: (schema) => schema.nullable()
        })
});

const BasicInfo = ({ userData, onUpdate }) => {
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
    const [isEditing, setIsEditing] = useState(false)
    const [isDataLoading, setIsDataLoading] = useState(false)

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
    }

    const handleSave = async (values, { setSubmitting }) => {
        try {
            setIsDataLoading(true)

            // Transform data to match backend expectations
            const transformedValues = {
                ...values,
                email: values.email || userData.email,
                graduation_year: values.graduationYear || null,
                left_at: values.leftAt || null,
                // Remove camelCase versions for backend
                graduationYear: undefined,
                leftAt: undefined
            };

            // Clean up undefined values
            Object.keys(transformedValues).forEach(key => {
                if (transformedValues[key] === undefined) {
                    delete transformedValues[key];
                }
            });

            const result = await updateUser({
                userId: userData.id,
                userData: transformedValues
            }).unwrap()

            // Update local state with new data
            onUpdate(result || { ...userData, ...values })

            setIsEditing(false)
            ToastMessage.notifySuccess('Profile updated successfully!')
        } catch (error) {
            console.error('Failed to update profile:', error)
            ToastMessage.notifyError(error.message || 'Failed to update profile')
        } finally {
            setSubmitting(false)
            setIsDataLoading(false)
        }
    }

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className={index === 6 ? "md:col-span-2" : ""}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className={`h-10 bg-gray-200 rounded animate-pulse ${index === 6 ? 'h-20' : ''}`}></div>
                </div>
            ))}
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
                    {!isEditing && !isDataLoading && (
                        <BlackButton size="sm" onClick={handleEdit}>
                            Edit Information
                        </BlackButton>
                    )}
                    {isDataLoading && (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                            <span className="text-sm text-gray-600">Updating...</span>
                        </div>
                    )}
                </div>

                {isDataLoading ? (
                    <LoadingSkeleton />
                ) : isEditing ? (
                    <Formik
                        initialValues={{
                            name: userData.name || '',
                            phone: userData.phone || '',
                            location: userData.location || '',
                            profession: userData.profession || '',
                            graduationYear: userData.graduationYear || userData.graduation_year || '',
                            batch: userData.batch || '',
                            bio: userData.bio || '',
                            isGraduated: userData.isGraduated !== undefined ? userData.isGraduated : true,
                            leftAt: userData.leftAt || userData.left_at || ''
                        }}
                        validationSchema={ProfileSchema}
                        onSubmit={handleSave}
                    >
                        {({ isSubmitting, values, setFieldValue }) => (
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
                                        label="Phone Number"
                                        placeholder="+880-XXX-XXXXXXX"
                                        useFormik={true}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                    />

                                    <InputComponent1
                                        name="location"
                                        label="Location/Address"
                                        placeholder="Your current location"
                                        useFormik={true}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                    />

                                    <InputComponent1
                                        name="profession"
                                        label="Current Profession/Job"
                                        placeholder="Your current job or profession"
                                        useFormik={true}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                    />

                                    <InputComponent1
                                        name="batch"
                                        label="Batch/Class"
                                        placeholder="e.g., Batch 2020, Class of 2020"
                                        useFormik={true}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                    />

                                    {/* Graduation Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Education Status
                                        </label>
                                        <div className="flex items-center space-x-6">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="isGraduated"
                                                    checked={values.isGraduated === true}
                                                    onChange={() => setFieldValue('isGraduated', true)}
                                                    className="mr-2 text-black focus:ring-black"
                                                />
                                                <span className="text-sm text-gray-900">Graduated</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="isGraduated"
                                                    checked={values.isGraduated === false}
                                                    onChange={() => setFieldValue('isGraduated', false)}
                                                    className="mr-2 text-black focus:ring-black"
                                                />
                                                <span className="text-sm text-gray-900">Left Early</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Conditional Year Fields */}
                                    {values.isGraduated ? (
                                        <InputComponent1
                                            name="graduationYear"
                                            type="number"
                                            label="Graduation Year"
                                            placeholder="Year you graduated"
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                        />
                                    ) : (
                                        <InputComponent1
                                            name="leftAt"
                                            type="number"
                                            label="Year Left School"
                                            placeholder="Year you left school"
                                            required
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                        />
                                    )}

                                    <div className="md:col-span-2">
                                        <TextareaComponent1
                                            name="bio"
                                            label="Bio/About Me"
                                            useFormik={true}
                                            rows={4}
                                            maxLength={2000}
                                            showCharCount={true}
                                            placeholder="Tell us about yourself, your achievements, current work, etc..."
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
                                        disabled={isSubmitting || isUpdating || isDataLoading}
                                    >
                                        Cancel
                                    </BlackButton>
                                    <BlackButton
                                        type="submit"
                                        size="sm"
                                        loading={isSubmitting || isUpdating || isDataLoading}
                                        disabled={isSubmitting || isUpdating || isDataLoading}
                                    >
                                        {isDataLoading ? 'Updating...' : 'Save Changes'}
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
                            label="Phone Number"
                            value={userData.phone || 'Not provided'}
                            disabled={true}
                            backgroundColor="bg-gray-50"
                            borderColor="border-transparent"
                            textColor="text-gray-900"
                            className="cursor-default"
                        />

                        <InputComponent1
                            name="location"
                            label="Location/Address"
                            value={userData.location || 'Not provided'}
                            disabled={true}
                            backgroundColor="bg-gray-50"
                            borderColor="border-transparent"
                            textColor="text-gray-900"
                            className="cursor-default"
                        />

                        <InputComponent1
                            name="profession"
                            label="Current Profession"
                            value={userData.profession || 'Not provided'}
                            disabled={true}
                            backgroundColor="bg-gray-50"
                            borderColor="border-transparent"
                            textColor="text-gray-900"
                            className="cursor-default"
                        />

                        <InputComponent1
                            name="batch"
                            label="Batch/Class"
                            value={userData.batch || 'Not provided'}
                            disabled={true}
                            backgroundColor="bg-gray-50"
                            borderColor="border-transparent"
                            textColor="text-gray-900"
                            className="cursor-default"
                        />

                        <InputComponent1
                            name="educationStatus"
                            label="Education Status"
                            value={userData.isGraduated ? 'Graduated' : 'Left Early'}
                            disabled={true}
                            backgroundColor="bg-gray-50"
                            borderColor="border-transparent"
                            textColor="text-gray-900"
                            className="cursor-default"
                        />

                        <InputComponent1
                            name="year"
                            label={userData.isGraduated ? "Graduation Year" : "Year Left School"}
                            value={userData.isGraduated
                                ? (userData.graduationYear || userData.graduation_year || 'Not provided')
                                : (userData.leftAt || userData.left_at || 'Not provided')
                            }
                            disabled={true}
                            backgroundColor="bg-gray-50"
                            borderColor="border-transparent"
                            textColor="text-gray-900"
                            className="cursor-default"
                        />

                        <div className="md:col-span-2">
                            <TextareaComponent1
                                name="bio"
                                label="Bio/About Me"
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
                        <div>
                            <span className="text-gray-500">Account Status:</span>
                            <span className={`ml-2 ${userData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                {userData.isActive ? 'Active' : 'Inactive'}
                            </span>
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
                                {userData.createdAt || userData.created_at ?
                                    new Date(userData.createdAt || userData.created_at).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">Last Updated:</span>
                            <span className="ml-2 text-gray-900">
                                {userData.updatedAt || userData.updated_at ?
                                    new Date(userData.updatedAt || userData.updated_at).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </ElegantCard>
        </div>
    )
}

export default BasicInfo