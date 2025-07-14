"use client"
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import ScrollReveal from '@/components/animations/ScrollReveal'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'
import { teacher } from '@/datas/teacherspage'

const TeacherDetailsPage = () => {

    const params = useParams()
    const router = useRouter()
    const teacherId = params.id


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
                                        className={`${teacher.status === 'active' ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black'}`}
                                    >
                                        {teacher.status === 'active' ? 'Current Faculty' : 'Retired'}
                                    </BlackTag>
                                </div>

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{teacher.name}</h1>
                                <p className="text-xl sm:text-2xl text-blue-300 mb-4">{teacher.designation}</p>

                                <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-3 0h4" />
                                        </svg>
                                        <span>{teacher.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v10m6-10v10m-6 0h6" />
                                        </svg>
                                        <span>{teacher.period}</span>
                                    </div>
                                </div>

                                <blockquote className="text-lg sm:text-xl italic text-gray-300 border-l-4 border-white pl-4">
                                    &ldquo;{teacher.quote}&rdquo;
                                </blockquote>
                            </div>

                            <div className="flex justify-center lg:justify-end">
                                <ElegantCard className="overflow-hidden max-w-sm w-full">
                                    <div
                                        className="h-64 sm:h-80 bg-gradient-to-br from-blue-600 to-emerald-600"
                                        style={{
                                            backgroundImage: `url(${teacher.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    />
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
                                {/* Specialization & Subjects */}
                                <ElegantCard>
                                    <h3 className="text-xl font-bold mb-4">Specialization & Subjects</h3>
                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-700 mb-2">Primary Specialization:</h4>
                                        <BlackTag>{teacher.specialization}</BlackTag>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Subjects Taught:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {teacher.subjects.map((subject, index) => (
                                                <BlackTag key={index} variant="outline" size="sm">
                                                    {subject}
                                                </BlackTag>
                                            ))}
                                        </div>
                                    </div>
                                </ElegantCard>

                                {/* Education */}
                                <ElegantCard>
                                    <h3 className="text-xl font-bold mb-4">Education</h3>
                                    <div className="space-y-3">
                                        {teacher.education.map((edu, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                                                <p className="text-gray-700">{edu}</p>
                                            </div>
                                        ))}
                                    </div>
                                </ElegantCard>

                                {/* Experience */}
                                <ElegantCard>
                                    <h3 className="text-xl font-bold mb-4">Professional Experience</h3>
                                    <div className="space-y-6">
                                        {teacher.experience.map((exp, index) => (
                                            <div key={index} className="border-l-2 border-gray-200 pl-4">
                                                <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                                                <p className="text-blue-600 font-medium">{exp.institution}</p>
                                                <p className="text-sm text-gray-500 mb-2">{exp.period}</p>
                                                <p className="text-gray-700">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </ElegantCard>

                                {/* Achievements */}
                                <ElegantCard>
                                    <h3 className="text-xl font-bold mb-4">Achievements & Recognition</h3>
                                    <div className="space-y-3">
                                        {teacher.achievements.map((achievement, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <p className="text-gray-700">{achievement}</p>
                                            </div>
                                        ))}
                                    </div>
                                </ElegantCard>

                                {/* Publications */}
                                {teacher.publications && (
                                    <ElegantCard>
                                        <h3 className="text-xl font-bold mb-4">Publications</h3>
                                        <div className="space-y-2">
                                            {teacher.publications.map((publication, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                    <p className="text-gray-700">{publication}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </ElegantCard>
                                )}
                            </div>

                            {/* Right Column - Contact & Student Feedback */}
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
                                                <a href={`mailto:${teacher.email}`} className="text-blue-600 hover:underline">
                                                    {teacher.email}
                                                </a>
                                            </div>
                                        )}

                                        {teacher.phone && (
                                            <div className="flex items-center gap-3">
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <span className="text-gray-700">{teacher.phone}</span>
                                            </div>
                                        )}

                                        {teacher.officeHours && (
                                            <div className="flex items-start gap-3">
                                                <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Office Hours:</p>
                                                    <p className="text-gray-700">{teacher.officeHours}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {teacher.status === 'active' && (
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

                                {/* Student Feedback */}
                                {teacher.studentsFeedback && (
                                    <ElegantCard>
                                        <h3 className="text-xl font-bold mb-4">Student Testimonials</h3>
                                        <div className="space-y-4">
                                            {teacher.studentsFeedback.map((feedback, index) => (
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
