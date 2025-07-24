"use client"
import { useState } from 'react'
import { Formik, Form, FieldArray } from 'formik'
import * as Yup from 'yup'
import { useUpdateUserMutation } from '@/redux/features/user/userApi'
import { ToastMessage } from '@/utils/ToastMessage'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import InputComponent1 from '@/components/common/InputComponent1'
import TextareaComponent1 from '@/components/common/TextareaComponent1'

// Validation schema for additional information
const AdditionalInfoSchema = Yup.object().shape({
    // Student fields
    currentPosition: Yup.string().max(200, 'Current position cannot exceed 200 characters'),
    organization: Yup.string().max(200, 'Organization cannot exceed 200 characters'),
    joinedYear: Yup.number()
        .min(1998, 'Joined year must be after 1998')
        .max(new Date().getFullYear(), `Joined year cannot exceed ${new Date().getFullYear()}`)
        .nullable()
        .transform((value, originalValue) => originalValue === '' ? null : value),
    achievements: Yup.array().of(Yup.string().max(500, 'Achievement cannot exceed 500 characters')),
    education: Yup.array().of(
        Yup.object().shape({
            degree: Yup.string().max(200, 'Degree cannot exceed 200 characters'),
            institution: Yup.string().max(200, 'Institution cannot exceed 200 characters'),
            year: Yup.number()
                .min(1950, 'Year must be after 1950')
                .max(new Date().getFullYear(), `Year cannot exceed ${new Date().getFullYear()}`)
                .nullable()
                .transform((value, originalValue) => originalValue === '' ? null : value),
            grade: Yup.string().max(50, 'Grade cannot exceed 50 characters')
        })
    ),
    experience: Yup.array().of(
        Yup.object().shape({
            position: Yup.string().max(200, 'Position cannot exceed 200 characters'),
            organization: Yup.string().max(200, 'Organization cannot exceed 200 characters'),
            period: Yup.string().max(100, 'Period cannot exceed 100 characters'),
            description: Yup.string().max(1000, 'Description cannot exceed 1000 characters')
        })
    ),
    socialContributions: Yup.array().of(Yup.string().max(500, 'Social contribution cannot exceed 500 characters')),
    quotes: Yup.string().max(1000, 'Quote cannot exceed 1000 characters'),
    socialMedia: Yup.object().shape({
        linkedin: Yup.string().url('Invalid LinkedIn URL'),
        twitter: Yup.string().url('Invalid Twitter URL'),
        facebook: Yup.string().url('Invalid Facebook URL')
    }),

    // Teacher fields
    designation: Yup.string().max(200, 'Designation cannot exceed 200 characters'),
    department: Yup.string().max(200, 'Department cannot exceed 200 characters'),
    period: Yup.string().max(100, 'Period cannot exceed 100 characters'),
    teacherStatus: Yup.string().oneOf(['active', 'retired'], 'Invalid status'),
    subject: Yup.string().max(200, 'Subject cannot exceed 200 characters'),
    specialization: Yup.string().max(200, 'Specialization cannot exceed 200 characters'),
    publications: Yup.array().of(
        Yup.object().shape({
            title: Yup.string().max(300, 'Title cannot exceed 300 characters'),
            year: Yup.number()
                .min(1950, 'Year must be after 1950')
                .max(new Date().getFullYear(), `Year cannot exceed ${new Date().getFullYear()}`)
                .nullable()
                .transform((value, originalValue) => originalValue === '' ? null : value),
            publisher: Yup.string().max(200, 'Publisher cannot exceed 200 characters')
        })
    ),
    officeHours: Yup.string().max(200, 'Office hours cannot exceed 200 characters'),
    studentsFeedback: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().max(100, 'Name cannot exceed 100 characters'),
            batch: Yup.string().max(50, 'Batch cannot exceed 50 characters'),
            feedback: Yup.string().max(1000, 'Feedback cannot exceed 1000 characters')
        })
    )
})

const AdditionalInfo = ({ userData, onUpdate, refetch }) => {
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
    const [isEditing, setIsEditing] = useState(false)
    const [isDataLoading, setIsDataLoading] = useState(false)

    // Parse additional information from userData
    const additionalInfo = userData.additional_information ?
        (typeof userData.additional_information === 'string' ?
            JSON.parse(userData.additional_information) :
            userData.additional_information) : {}

    const isStudent = userData.alumni_type === 'student'
    const isTeacher = userData.alumni_type === 'teacher'

    const getInitialValues = () => {
        if (isStudent) {
            return {
                currentPosition: additionalInfo.currentPosition || '',
                organization: additionalInfo.organization || '',
                joinedYear: additionalInfo.joinedYear || '',
                achievements: additionalInfo.achievements || [''],
                education: additionalInfo.education || [{ degree: '', institution: '', year: '', grade: '' }],
                experience: additionalInfo.experience || [{ position: '', organization: '', period: '', description: '' }],
                socialContributions: additionalInfo.socialContributions || [''],
                quotes: additionalInfo.quotes || '',
                socialMedia: {
                    linkedin: additionalInfo.socialMedia?.linkedin || '',
                    twitter: additionalInfo.socialMedia?.twitter || '',
                    facebook: additionalInfo.socialMedia?.facebook || ''
                }
            }
        } else if (isTeacher) {
            return {
                designation: additionalInfo.designation || '',
                department: additionalInfo.department || '',
                period: additionalInfo.period || '',
                teacherStatus: additionalInfo.teacherStatus || 'active',
                subject: additionalInfo.subject || '',
                specialization: additionalInfo.specialization || '',
                achievements: additionalInfo.achievements || [''],
                education: additionalInfo.education || [{ degree: '', institution: '', year: '' }],
                experience: additionalInfo.experience || [{ position: '', institution: '', period: '', description: '' }],
                publications: additionalInfo.publications || [{ title: '', year: '', publisher: '' }],
                quotes: additionalInfo.quotes || '',
                officeHours: additionalInfo.officeHours || '',
                studentsFeedback: additionalInfo.studentsFeedback || [{ name: '', batch: '', feedback: '' }]
            }
        }
        return {}
    }

    const handleEdit = () => setIsEditing(true)
    const handleCancel = () => setIsEditing(false)

    const handleSave = async (values, { setSubmitting }) => {
        try {
            setIsDataLoading(true)

            // Clean up empty values
            const cleanedValues = JSON.parse(JSON.stringify(values))

            // Remove empty items from arrays
            if (cleanedValues.achievements) {
                cleanedValues.achievements = cleanedValues.achievements.filter(item => item.trim() !== '')
            }
            if (cleanedValues.socialContributions) {
                cleanedValues.socialContributions = cleanedValues.socialContributions.filter(item => item.trim() !== '')
            }
            if (cleanedValues.education) {
                cleanedValues.education = cleanedValues.education.filter(item =>
                    item.degree || item.institution || item.year || item.grade
                )
            }
            if (cleanedValues.experience) {
                cleanedValues.experience = cleanedValues.experience.filter(item =>
                    item.position || item.organization || item.institution || item.period || item.description
                )
            }
            if (cleanedValues.publications) {
                cleanedValues.publications = cleanedValues.publications.filter(item =>
                    item.title || item.year || item.publisher
                )
            }
            if (cleanedValues.studentsFeedback) {
                cleanedValues.studentsFeedback = cleanedValues.studentsFeedback.filter(item =>
                    item.name || item.batch || item.feedback
                )
            }

            const result = await updateUser({
                userId: userData.id,
                userData: {
                    additional_information: JSON.stringify(cleanedValues)
                }
            }).unwrap()

            onUpdate(result || { ...userData, additional_information: cleanedValues })
            setIsEditing(false)
            ToastMessage.notifySuccess('Additional information updated successfully!')
            refetch()
        } catch (error) {
            console.error('Failed to update additional information:', error)
            ToastMessage.notifyError(error.message || 'Failed to update additional information')
        } finally {
            setSubmitting(false)
            setIsDataLoading(false)
        }
    }

    const LoadingSkeleton = () => (
        <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
            ))}
        </div>
    )

    const renderStudentFields = (values, setFieldValue) => (
        <>
            {/* Current Position & Organization */}
            <div className="grid md:grid-cols-2 gap-6">
                <InputComponent1
                    name="currentPosition"
                    label="Current Position"
                    placeholder="e.g., Senior Software Engineer"
                    useFormik={true}
                    backgroundColor="bg-white"
                    borderColor="border-gray-300"
                    textColor="text-gray-900"
                    focusBorderColor="focus:border-black"
                    focusRingColor="focus:ring-black/10"
                />
                <InputComponent1
                    name="organization"
                    label="Organization"
                    placeholder="e.g., Google Inc."
                    useFormik={true}
                    backgroundColor="bg-white"
                    borderColor="border-gray-300"
                    textColor="text-gray-900"
                    focusBorderColor="focus:border-black"
                    focusRingColor="focus:ring-black/10"
                />
            </div>

            {/* Joined Year */}
            <InputComponent1
                name="joinedYear"
                type="number"
                label="Year Joined CIHS"
                placeholder="e.g., 2005"
                useFormik={true}
                backgroundColor="bg-white"
                borderColor="border-gray-300"
                textColor="text-gray-900"
                focusBorderColor="focus:border-black"
                focusRingColor="focus:ring-black/10"
            />

            {/* Achievements */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
                <FieldArray name="achievements">
                    {({ remove, push }) => (
                        <div className="space-y-2">
                            {values.achievements?.map((_, index) => (
                                <div key={index} className="flex gap-2">
                                    <TextareaComponent1
                                        name={`achievements.${index}`}
                                        placeholder="Describe your achievement..."
                                        useFormik={true}
                                        rows={2}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                        className="flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="self-start p-2 text-red-600 hover:text-red-800"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <BlackButton
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => push('')}
                            >
                                Add Achievement
                            </BlackButton>
                        </div>
                    )}
                </FieldArray>
            </div>

            {/* Education */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                <FieldArray name="education">
                    {({ remove, push }) => (
                        <div className="space-y-4">
                            {values.education?.map((_, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <InputComponent1
                                            name={`education.${index}.degree`}
                                            label="Degree"
                                            placeholder="e.g., Bachelor of Science"
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                        />
                                        <InputComponent1
                                            name={`education.${index}.institution`}
                                            label="Institution"
                                            placeholder="e.g., University of Dhaka"
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                        />
                                        <InputComponent1
                                            name={`education.${index}.year`}
                                            type="number"
                                            label="Year"
                                            placeholder="e.g., 2020"
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                        />
                                        <InputComponent1
                                            name={`education.${index}.grade`}
                                            label="Grade/Result"
                                            placeholder="e.g., First Class"
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                        />
                                    </div>
                                    <BlackButton
                                        type="button"
                                        variant="outline"
                                        size="xs"
                                        onClick={() => remove(index)}
                                        className="text-red-600 border-red-600 hover:bg-red-50"
                                    >
                                        Remove Education
                                    </BlackButton>
                                </div>
                            ))}
                            <BlackButton
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => push({ degree: '', institution: '', year: '', grade: '' })}
                            >
                                Add Education
                            </BlackButton>
                        </div>
                    )}
                </FieldArray>
            </div>

            {/* Experience */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Experience</label>
                <FieldArray name="experience">
                    {({ remove, push }) => (
                        <div className="space-y-4">
                            {values.experience?.map((_, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <InputComponent1
                                            name={`experience.${index}.position`}
                                            label="Position"
                                            placeholder="e.g., Software Engineer"
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                        />
                                        <InputComponent1
                                            name={`experience.${index}.organization`}
                                            label="Organization"
                                            placeholder="e.g., ABC Company Ltd."
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <InputComponent1
                                            name={`experience.${index}.period`}
                                            label="Period"
                                            placeholder="e.g., 2020 - Present"
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <TextareaComponent1
                                            name={`experience.${index}.description`}
                                            label="Description"
                                            placeholder="Describe your role and responsibilities..."
                                            useFormik={true}
                                            rows={3}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                        />
                                    </div>
                                    <BlackButton
                                        type="button"
                                        variant="outline"
                                        size="xs"
                                        onClick={() => remove(index)}
                                        className="text-red-600 border-red-600 hover:bg-red-50"
                                    >
                                        Remove Experience
                                    </BlackButton>
                                </div>
                            ))}
                            <BlackButton
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => push({ position: '', organization: '', period: '', description: '' })}
                            >
                                Add Experience
                            </BlackButton>
                        </div>
                    )}
                </FieldArray>
            </div>

            {/* Social Contributions */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Social Contributions</label>
                <FieldArray name="socialContributions">
                    {({ remove, push }) => (
                        <div className="space-y-2">
                            {values.socialContributions?.map((_, index) => (
                                <div key={index} className="flex gap-2">
                                    <TextareaComponent1
                                        name={`socialContributions.${index}`}
                                        placeholder="Describe your social contribution..."
                                        useFormik={true}
                                        rows={2}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                        className="flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="self-start p-2 text-red-600 hover:text-red-800"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <BlackButton
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => push('')}
                            >
                                Add Social Contribution
                            </BlackButton>
                        </div>
                    )}
                </FieldArray>
            </div>

            {/* Quote */}
            <TextareaComponent1
                name="quotes"
                label="Personal Quote"
                placeholder="Share an inspiring quote or message..."
                useFormik={true}
                rows={3}
                backgroundColor="bg-white"
                borderColor="border-gray-300"
                textColor="text-gray-900"
                focusBorderColor="focus:border-black"
                focusRingColor="focus:ring-black/10"
            />

            {/* Social Media */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Social Media Links</label>
                <div className="grid md:grid-cols-3 gap-4">
                    <InputComponent1
                        name="socialMedia.linkedin"
                        label="LinkedIn"
                        placeholder="https://linkedin.com/in/username"
                        useFormik={true}
                        backgroundColor="bg-white"
                        borderColor="border-gray-300"
                        textColor="text-gray-900"
                        focusBorderColor="focus:border-black"
                        focusRingColor="focus:ring-black/10"
                    />
                    <InputComponent1
                        name="socialMedia.twitter"
                        label="Twitter"
                        placeholder="https://twitter.com/username"
                        useFormik={true}
                        backgroundColor="bg-white"
                        borderColor="border-gray-300"
                        textColor="text-gray-900"
                        focusBorderColor="focus:border-black"
                        focusRingColor="focus:ring-black/10"
                    />
                    <InputComponent1
                        name="socialMedia.facebook"
                        label="Facebook"
                        placeholder="https://facebook.com/username"
                        useFormik={true}
                        backgroundColor="bg-white"
                        borderColor="border-gray-300"
                        textColor="text-gray-900"
                        focusBorderColor="focus:border-black"
                        focusRingColor="focus:ring-black/10"
                    />
                </div>
            </div>
        </>
    )

    const renderTeacherFields = (values) => (
        <>
            {/* Designation & Department */}
            <div className="grid md:grid-cols-2 gap-6">
                <InputComponent1
                    name="designation"
                    label="Designation"
                    placeholder="e.g., Senior Mathematics Teacher"
                    useFormik={true}
                    backgroundColor="bg-white"
                    borderColor="border-gray-300"
                    textColor="text-gray-900"
                    focusBorderColor="focus:border-black"
                    focusRingColor="focus:ring-black/10"
                />
                <InputComponent1
                    name="department"
                    label="Department"
                    placeholder="e.g., Mathematics"
                    useFormik={true}
                    backgroundColor="bg-white"
                    borderColor="border-gray-300"
                    textColor="text-gray-900"
                    focusBorderColor="focus:border-black"
                    focusRingColor="focus:ring-black/10"
                />
            </div>

            {/* Period & Status */}
            <div className="grid md:grid-cols-2 gap-6">
                <InputComponent1
                    name="period"
                    label="Service Period"
                    placeholder="e.g., 2000-2020"
                    useFormik={true}
                    backgroundColor="bg-white"
                    borderColor="border-gray-300"
                    textColor="text-gray-900"
                    focusBorderColor="focus:border-black"
                    focusRingColor="focus:ring-black/10"
                />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                        name="teacherStatus"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                    >
                        <option value="active">Active</option>
                        <option value="retired">Retired</option>
                    </select>
                </div>
            </div>

            {/* Subject & Specialization */}
            <div className="grid md:grid-cols-2 gap-6">
                <InputComponent1
                    name="subject"
                    label="Main Subject"
                    placeholder="e.g., Mathematics"
                    useFormik={true}
                    backgroundColor="bg-white"
                    borderColor="border-gray-300"
                    textColor="text-gray-900"
                    focusBorderColor="focus:border-black"
                    focusRingColor="focus:ring-black/10"
                />
                <InputComponent1
                    name="specialization"
                    label="Specialization"
                    placeholder="e.g., Pure Mathematics"
                    useFormik={true}
                    backgroundColor="bg-white"
                    borderColor="border-gray-300"
                    textColor="text-gray-900"
                    focusBorderColor="focus:border-black"
                    focusRingColor="focus:ring-black/10"
                />
            </div>

            {/* Office Hours */}
            <InputComponent1
                name="officeHours"
                label="Office Hours"
                placeholder="e.g., Monday-Friday, 9:00 AM - 4:00 PM"
                useFormik={true}
                backgroundColor="bg-white"
                borderColor="border-gray-300"
                textColor="text-gray-900"
                focusBorderColor="focus:border-black"
                focusRingColor="focus:ring-black/10"
            />

            {/* Achievements */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
                <FieldArray name="achievements">
                    {({ remove, push }) => (
                        <div className="space-y-2">
                            {values.achievements?.map((_, index) => (
                                <div key={index} className="flex gap-2">
                                    <TextareaComponent1
                                        name={`achievements.${index}`}
                                        placeholder="Describe your achievement..."
                                        useFormik={true}
                                        rows={2}
                                        backgroundColor="bg-white"
                                        borderColor="border-gray-300"
                                        textColor="text-gray-900"
                                        focusBorderColor="focus:border-black"
                                        focusRingColor="focus:ring-black/10"
                                        className="flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="self-start p-2 text-red-600 hover:text-red-800"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <BlackButton
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => push('')}
                            >
                                Add Achievement
                            </BlackButton>
                        </div>
                    )}
                </FieldArray>
            </div>

            {/* Education (same as student) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                <FieldArray name="education">
                    {({ remove, push }) => (
                        <div className="space-y-4">
                            {values.education?.map((_, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <InputComponent1
                                            name={`education.${index}.degree`}
                                            label="Degree"
                                            placeholder="e.g., PhD in Educational Leadership"
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                        />
                                        <InputComponent1
                                            name={`education.${index}.institution`}
                                            label="Institution"
                                            placeholder="e.g., University of Dhaka"
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                        />
                                        <InputComponent1
                                            name={`education.${index}.year`}
                                            type="number"
                                            label="Year"
                                            placeholder="e.g., 1995"
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                        />
                                    </div>
                                    <BlackButton
                                        type="button"
                                        variant="outline"
                                        size="xs"
                                        onClick={() => remove(index)}
                                        className="text-red-600 border-red-600 hover:bg-red-50"
                                    >
                                        Remove Education
                                    </BlackButton>
                                </div>
                            ))}
                            <BlackButton
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => push({ degree: '', institution: '', year: '' })}
                            >
                                Add Education
                            </BlackButton>
                        </div>
                    )}
                </FieldArray>
            </div>

            {/* Publications */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Publications</label>
                <FieldArray name="publications">
                    {({ remove, push }) => (
                        <div className="space-y-4">
                            {values.publications?.map((_, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <InputComponent1
                                            name={`publications.${index}.title`}
                                            label="Title"
                                            placeholder="Publication title"
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                        />
                                        <InputComponent1
                                            name={`publications.${index}.year`}
                                            type="number"
                                            label="Year"
                                            placeholder="e.g., 2020"
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <InputComponent1
                                            name={`publications.${index}.publisher`}
                                            label="Publisher/Journal"
                                            placeholder="Publisher or journal name"
                                            useFormik={true}
                                            backgroundColor="bg-white"
                                            borderColor="border-gray-300"
                                            textColor="text-gray-900"
                                            focusBorderColor="focus:border-black"
                                            focusRingColor="focus:ring-black/10"
                                        />
                                    </div>
                                    <BlackButton
                                        type="button"
                                        variant="outline"
                                        size="xs"
                                        onClick={() => remove(index)}
                                        className="text-red-600 border-red-600 hover:bg-red-50"
                                    >
                                        Remove Publication
                                    </BlackButton>
                                </div>
                            ))}
                            <BlackButton
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => push({ title: '', year: '', publisher: '' })}
                            >
                                Add Publication
                            </BlackButton>
                        </div>
                    )}
                </FieldArray>
            </div>

            {/* Quote */}
            <TextareaComponent1
                name="quotes"
                label="Personal Quote/Philosophy"
                placeholder="Share your educational philosophy or inspiring message..."
                useFormik={true}
                rows={3}
                backgroundColor="bg-white"
                borderColor="border-gray-300"
                textColor="text-gray-900"
                focusBorderColor="focus:border-black"
                focusRingColor="focus:ring-black/10"
            />
        </>
    )

    const renderViewMode = () => {
        if (!additionalInfo || Object.keys(additionalInfo).length === 0) {
            return (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">📝</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Additional Information</h4>
                    <p className="text-gray-600 mb-4">Add more details about your background and achievements.</p>
                    {/* <BlackButton size="sm" onClick={handleEdit}>
                        Add Information
                    </BlackButton> */}
                </div>
            )
        }

        return (
            <div className="space-y-6">
                {isStudent && (
                    <>
                        {/* Current Position & Organization */}
                        {(additionalInfo.currentPosition || additionalInfo.organization) && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {additionalInfo.currentPosition && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Position</label>
                                        <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{additionalInfo.currentPosition}</p>
                                    </div>
                                )}
                                {additionalInfo.organization && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                                        <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{additionalInfo.organization}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Joined Year */}
                        {additionalInfo.joinedYear && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year Joined CIHS</label>
                                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{additionalInfo.joinedYear}</p>
                            </div>
                        )}
                    </>
                )}

                {isTeacher && (
                    <>
                        {/* Designation & Department */}
                        {(additionalInfo.designation || additionalInfo.department) && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {additionalInfo.designation && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                                        <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{additionalInfo.designation}</p>
                                    </div>
                                )}
                                {additionalInfo.department && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                        <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{additionalInfo.department}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Period & Status */}
                        {(additionalInfo.period || additionalInfo.teacherStatus) && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {additionalInfo.period && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Period</label>
                                        <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{additionalInfo.period}</p>
                                    </div>
                                )}
                                {additionalInfo.teacherStatus && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg capitalize">{additionalInfo.teacherStatus}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Subject & Specialization */}
                        {(additionalInfo.subject || additionalInfo.specialization) && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {additionalInfo.subject && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Main Subject</label>
                                        <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{additionalInfo.subject}</p>
                                    </div>
                                )}
                                {additionalInfo.specialization && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                                        <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{additionalInfo.specialization}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Office Hours */}
                        {additionalInfo.officeHours && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Office Hours</label>
                                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{additionalInfo.officeHours}</p>
                            </div>
                        )}
                    </>
                )}

                {/* Achievements */}
                {additionalInfo.achievements && additionalInfo.achievements.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
                        <div className="space-y-2">
                            {additionalInfo.achievements.map((achievement, index) => (
                                <div key={index} className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                                    • {achievement}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {additionalInfo.education && additionalInfo.education.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                        <div className="space-y-3">
                            {additionalInfo.education.map((edu, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                                    <p className="text-gray-700">{edu.institution}</p>
                                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                                        <span>{edu.year}</span>
                                        {edu.grade && <span>{edu.grade}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience */}
                {additionalInfo.experience && additionalInfo.experience.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isStudent ? 'Work Experience' : 'Teaching Experience'}
                        </label>
                        <div className="space-y-3">
                            {additionalInfo.experience.map((exp, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                                    <p className="text-gray-700">{exp.organization || exp.institution}</p>
                                    <p className="text-sm text-gray-600">{exp.period}</p>
                                    {exp.description && <p className="text-gray-700 mt-2">{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Publications (Teachers only) */}
                {isTeacher && additionalInfo.publications && additionalInfo.publications.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Publications</label>
                        <div className="space-y-3">
                            {additionalInfo.publications.map((pub, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900">{pub.title}</h4>
                                    <p className="text-gray-700">{pub.publisher}</p>
                                    <p className="text-sm text-gray-600">{pub.year}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Social Contributions (Students only) */}
                {isStudent && additionalInfo.socialContributions && additionalInfo.socialContributions.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Social Contributions</label>
                        <div className="space-y-2">
                            {additionalInfo.socialContributions.map((contribution, index) => (
                                <div key={index} className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                                    • {contribution}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quote */}
                {additionalInfo.quotes && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isStudent ? 'Personal Quote' : 'Educational Philosophy'}
                        </label>
                        <div className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg italic">
                            "{additionalInfo.quotes}"
                        </div>
                    </div>
                )}

                {/* Social Media (Students only) */}
                {isStudent && additionalInfo.socialMedia && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Social Media</label>
                        <div className="grid md:grid-cols-3 gap-4">
                            {additionalInfo.socialMedia.linkedin && (
                                <div>
                                    <span className="text-sm text-gray-600">LinkedIn:</span>
                                    <a href={additionalInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer"
                                        className="block text-blue-600 hover:text-blue-800 truncate">
                                        {additionalInfo.socialMedia.linkedin}
                                    </a>
                                </div>
                            )}
                            {additionalInfo.socialMedia.twitter && (
                                <div>
                                    <span className="text-sm text-gray-600">Twitter:</span>
                                    <a href={additionalInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer"
                                        className="block text-blue-600 hover:text-blue-800 truncate">
                                        {additionalInfo.socialMedia.twitter}
                                    </a>
                                </div>
                            )}
                            {additionalInfo.socialMedia.facebook && (
                                <div>
                                    <span className="text-sm text-gray-600">Facebook:</span>
                                    <a href={additionalInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer"
                                        className="block text-blue-600 hover:text-blue-800 truncate">
                                        {additionalInfo.socialMedia.facebook}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    if (!isStudent && !isTeacher) {
        return (
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">ℹ️</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Alumni Type Required</h4>
                    <p className="text-gray-600">Please set your alumni type (Student or Teacher) in basic information first.</p>
                </div>
            </ElegantCard>
        )
    }

    return (
        <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                    Additional Information
                    <span className="text-sm font-normal text-gray-500 ml-2">
                        ({isStudent ? 'Student' : 'Teacher'} Profile)
                    </span>
                </h3>
                {!isEditing && !isDataLoading && (
                    <BlackButton size="sm" onClick={handleEdit}>
                        {Object.keys(additionalInfo).length === 0 ? 'Add Information' : 'Edit Information'}
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
                    initialValues={getInitialValues()}
                    validationSchema={AdditionalInfoSchema}
                    onSubmit={handleSave}
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form>
                            <div className="space-y-6">
                                {isStudent && renderStudentFields(values, setFieldValue)}
                                {isTeacher && renderTeacherFields(values)}
                            </div>

                            <div className="mt-8 flex gap-3 justify-end pt-6 border-t border-gray-200">
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
                                    {isDataLoading ? 'Updating...' : 'Save Additional Information'}
                                </BlackButton>
                            </div>
                        </Form>
                    )}
                </Formik>
            ) : (
                renderViewMode()
            )}
        </ElegantCard>
    )
}

export default AdditionalInfo
