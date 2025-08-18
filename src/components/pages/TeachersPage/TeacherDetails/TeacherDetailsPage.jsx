"use client"
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import ScrollReveal from '@/components/animations/ScrollReveal'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'
import { useGetTeacherManagementByIdQuery } from '@/redux/features/teacherManagement/teacherManagementApi'
import Image from 'next/image'

const TeacherDetailsPage = () => {
    const params = useParams()
    const router = useRouter()
    const teacherId = params.id

    const { data: teacher, isLoading, error } = useGetTeacherManagementByIdQuery(
        {
            userId: teacherId,
            includeDetails: true
        },
        { skip: !teacherId }
    )

    // Helper function to safely parse additional_information
    const getAdditionalInfo = () => {
        if (!teacher?.additional_information) return {}

        if (typeof teacher.additional_information === 'string') {
            try {
                return JSON.parse(teacher.additional_information)
            } catch (e) {
                return {}
            }
        }

        return teacher.additional_information || {}
    }

    // Helper function to check if array has meaningful content
    const hasContent = (arr) => {
        return Array.isArray(arr) && arr.length > 0 && arr.some(item =>
            typeof item === 'string' ? item.trim() :
                typeof item === 'object' ? Object.values(item).some(val => val && val.toString().trim()) :
                    false
        )
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading teacher details...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !teacher) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Teacher not found</h1>
                    <p className="text-gray-600 mb-6">The teacher you're looking for doesn't exist or has been removed.</p>
                    <BlackButton onClick={() => router.push('/teachers')}>
                        Back to Faculty Directory
                    </BlackButton>
                </div>
            </div>
        )
    }

    const additionalInfo = getAdditionalInfo()
    const teacherStatus = additionalInfo.teacherStatus || additionalInfo.managementStatus || 'active'

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-12 sm:py-16 bg-black text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                            <div className="lg:col-span-2">
                                <div className="flex items-center gap-4 mb-4">
                                    <BlackButton
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push('/teachers')}
                                        icon={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        }
                                        className="border-white text-white hover:bg-white hover:text-black"
                                    >
                                        Back to Teachers
                                    </BlackButton>
                                    <BlackTag
                                        className={`${teacherStatus === 'active' ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black'}`}
                                    >
                                        {teacherStatus === 'active' ? 'Current Faculty' : 'Retired'}
                                    </BlackTag>
                                    {teacher.alumni_type && (
                                        <BlackTag className="bg-blue-600 text-white">
                                            {teacher.alumni_type === 'teacher' ? 'Teacher' : 'Management'}
                                        </BlackTag>
                                    )}
                                </div>

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{teacher.name}</h1>

                                {additionalInfo.designation && (
                                    <p className="text-xl sm:text-2xl text-blue-300 mb-4">{additionalInfo.designation}</p>
                                )}
                                {teacher.profession && !additionalInfo.designation && (
                                    <p className="text-xl sm:text-2xl text-blue-300 mb-4">{teacher.profession}</p>
                                )}

                                <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
                                    {additionalInfo.department && (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-3 0h4" />
                                            </svg>
                                            <span>{additionalInfo.department}</span>
                                        </div>
                                    )}
                                    {additionalInfo.period && (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v10m6-10v10m-6 0h6" />
                                            </svg>
                                            <span>{additionalInfo.period}</span>
                                        </div>
                                    )}
                                    {teacher.branch && (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <span>{teacher.branch} Branch</span>
                                        </div>
                                    )}
                                </div>

                                {additionalInfo.quotes && (
                                    <blockquote className="text-lg sm:text-xl italic text-gray-300 border-l-4 border-white pl-4">
                                        &ldquo;{additionalInfo.quotes}&rdquo;
                                    </blockquote>
                                )}
                            </div>

                            <div className="flex justify-center lg:justify-end">
                                <ElegantCard className="overflow-hidden max-w-sm w-full">
                                    <div className="h-64 sm:h-80 bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                                        {teacher.profilePhoto ? (
                                            <Image
                                                src={teacher.profilePhoto}
                                                alt={teacher.name}
                                                width={320}
                                                height={320}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 rounded-full flex items-center justify-center bg-white text-black text-4xl font-bold">
                                                {teacher.name?.charAt(0).toUpperCase() || 'T'}
                                            </div>
                                        )}
                                    </div>
                                </ElegantCard>
                            </div>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Main Content */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Main Info */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Check if there's any content to show */}
                                {(!teacher.bio && !additionalInfo.specialization && !additionalInfo.subject && !hasContent(additionalInfo.education) && !hasContent(additionalInfo.experience) && !hasContent(additionalInfo.achievements) && !hasContent(additionalInfo.publications)) && (
                                    <ElegantCard>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Additional Information Available</h3>
                                        <p className="text-gray-700">This faculty member has not provided additional information.</p>
                                    </ElegantCard>
                                )}

                                {/* Bio */}
                                {teacher.bio && (
                                    <ElegantCard>
                                        <h3 className="text-xl font-bold mb-4">About</h3>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{teacher.bio}</p>
                                    </ElegantCard>
                                )}

                                {/* Specialization & Subjects */}
                                {(additionalInfo.specialization || additionalInfo.subject) && (
                                    <ElegantCard>
                                        <h3 className="text-xl font-bold mb-4">Specialization & Subjects</h3>
                                        {additionalInfo.specialization && (
                                            <div className="mb-4">
                                                <h4 className="font-medium text-gray-700 mb-2">Primary Specialization:</h4>
                                                <BlackTag>{additionalInfo.specialization}</BlackTag>
                                            </div>
                                        )}
                                        {additionalInfo.subject && (
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">Main Subject:</h4>
                                                <BlackTag variant="outline" size="sm">
                                                    {additionalInfo.subject}
                                                </BlackTag>
                                            </div>
                                        )}
                                    </ElegantCard>
                                )}

                                {/* Education */}
                                {hasContent(additionalInfo.education) && (
                                    <ElegantCard>
                                        <h3 className="text-xl font-bold mb-4">Education</h3>
                                        <div className="space-y-3">
                                            {additionalInfo.education.map((edu, index) => (
                                                <div key={index} className="border-l-2 border-gray-200 pl-4">
                                                    {edu.degree && (
                                                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                                                    )}
                                                    {edu.institution && (
                                                        <p className="text-blue-600">{edu.institution}</p>
                                                    )}
                                                    {edu.year && (
                                                        <span className="text-sm text-gray-600">{edu.year}</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </ElegantCard>
                                )}

                                {/* Experience */}
                                {hasContent(additionalInfo.experience) && (
                                    <ElegantCard>
                                        <h3 className="text-xl font-bold mb-4">Professional Experience</h3>
                                        <div className="space-y-6">
                                            {additionalInfo.experience.map((exp, index) => (
                                                <div key={index} className="border-l-2 border-blue-500 pl-4">
                                                    {exp.position && (
                                                        <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                                                    )}
                                                    {(exp.institution || exp.organization) && (
                                                        <p className="text-blue-600 font-medium">{exp.institution || exp.organization}</p>
                                                    )}
                                                    {exp.period && (
                                                        <p className="text-sm text-gray-500 mb-2">{exp.period}</p>
                                                    )}
                                                    {exp.description && (
                                                        <p className="text-gray-700">{exp.description}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </ElegantCard>
                                )}

                                {/* Achievements */}
                                {hasContent(additionalInfo.achievements) && (
                                    <ElegantCard>
                                        <h3 className="text-xl font-bold mb-4">Achievements & Recognition</h3>
                                        <div className="space-y-3">
                                            {additionalInfo.achievements.map((achievement, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <p className="text-gray-700">{achievement}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </ElegantCard>
                                )}

                                {/* Publications */}
                                {hasContent(additionalInfo.publications) && (
                                    <ElegantCard>
                                        <h3 className="text-xl font-bold mb-4">Publications</h3>
                                        <div className="space-y-4">
                                            {additionalInfo.publications.map((publication, index) => (
                                                <div key={index} className="border-l-2 border-green-500 pl-4">
                                                    {publication.title && (
                                                        <h4 className="font-semibold text-gray-900">{publication.title}</h4>
                                                    )}
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        {publication.year && <span>{publication.year}</span>}
                                                        {publication.publisher && <span>• {publication.publisher}</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ElegantCard>
                                )}

                                {/* Student Feedback */}
                                {hasContent(additionalInfo.studentsFeedback) && (
                                    <ElegantCard>
                                        <h3 className="text-xl font-bold mb-4">Student Testimonials</h3>
                                        <div className="space-y-4">
                                            {additionalInfo.studentsFeedback.map((feedback, index) => (
                                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="text-gray-700 mb-2 italic">&ldquo;{feedback.feedback}&rdquo;</p>
                                                    <div className="text-sm">
                                                        <p className="font-medium text-gray-900">{feedback.name}</p>
                                                        <p className="text-gray-500">{feedback.batch}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ElegantCard>
                                )}
                            </div>

                            {/* Right Column - Contact & Info */}
                            <div className="space-y-8">
                                {/* Contact Information */}
                                <ElegantCard>
                                    <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                                    <div className="space-y-3">
                                        {teacher.email && (
                                            <div className="flex items-center gap-3">
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <a href={`mailto:${teacher.email}`} className="text-blue-600 hover:underline text-sm">
                                                    {teacher.email}
                                                </a>
                                            </div>
                                        )}

                                        {teacher.phone && (
                                            <div className="flex items-center gap-3">
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <span className="text-gray-700 text-sm">{teacher.phone}</span>
                                            </div>
                                        )}

                                        {teacher.location && (
                                            <div className="flex items-center gap-3">
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                <span className="text-gray-700 text-sm">{teacher.location}</span>
                                            </div>
                                        )}

                                        {additionalInfo.officeHours && (
                                            <div className="flex items-start gap-3">
                                                <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Office Hours:</p>
                                                    <p className="text-gray-700 text-sm">{additionalInfo.officeHours}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Social Media */}
                                    {additionalInfo.socialMedia && Object.values(additionalInfo.socialMedia).some(link => link) && (
                                        <div className="mt-6">
                                            <h4 className="text-sm font-medium text-gray-900 mb-3">Connect</h4>
                                            <div className="flex space-x-3">
                                                {additionalInfo.socialMedia.linkedin && (
                                                    <a href={additionalInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                        </svg>
                                                    </a>
                                                )}
                                                {additionalInfo.socialMedia.twitter && (
                                                    <a href={additionalInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                                        </svg>
                                                    </a>
                                                )}
                                                {additionalInfo.socialMedia.facebook && (
                                                    <a href={additionalInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                        </svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {teacherStatus === 'active' && (
                                        <div className="mt-4 pt-4 border-t">
                                            <BlackButton
                                                size="sm"
                                                className="w-full"
                                                icon={
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                }
                                            >
                                                Send Message
                                            </BlackButton>
                                        </div>
                                    )}
                                </ElegantCard>

                                {/* Quick Stats */}
                                <ElegantCard>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                                    <div className="space-y-3">
                                        {teacher.joinedYear && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Joined CIHS</span>
                                                <span className="font-medium">{teacher.joinedYear}</span>
                                            </div>
                                        )}
                                        {additionalInfo.period && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Service Period</span>
                                                <span className="font-medium">{additionalInfo.period}</span>
                                            </div>
                                        )}
                                        {teacher.blood_group && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Blood Group</span>
                                                <span className="font-medium">{teacher.blood_group}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status</span>
                                            <BlackTag
                                                size="xs"
                                                className={
                                                    teacher.status === 'active' ? 'bg-green-100 text-green-800' :
                                                        teacher.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }
                                            >
                                                {teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1)}
                                            </BlackTag>
                                        </div>
                                    </div>
                                </ElegantCard>

                                {/* Quick Actions */}
                                <ElegantCard>
                                    <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                                    <div className="space-y-2">
                                        <BlackButton
                                            variant="outline"
                                            size="sm"
                                            className="w-full justify-start"
                                            icon={
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                                </svg>
                                            }
                                        >
                                            Share Profile
                                        </BlackButton>

                                        <BlackButton
                                            variant="outline"
                                            size="sm"
                                            className="w-full justify-start"
                                            icon={
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                </svg>
                                            }
                                        >
                                            Print Profile
                                        </BlackButton>
                                    </div>
                                </ElegantCard>
                            </div>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default TeacherDetailsPage
