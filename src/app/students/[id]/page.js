"use client"
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import ScrollReveal from '@/components/animations/ScrollReveal'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'

const StudentDetailPage = () => {
    const params = useParams()
    const router = useRouter()
    const studentId = params.id

    // Mock student data - in real app, fetch from API
    const student = {
        id: 1,
        name: 'Dr. Rahman Ahmed',
        batch: '1985',
        class: '10',
        profession: 'Cardiac Surgeon',
        currentPosition: 'Chief of Cardiothoracic Surgery',
        organization: 'Johns Hopkins Hospital',
        location: 'Baltimore, Maryland, USA',
        email: 'rahman.ahmed@jhmi.edu',
        phone: '+1-410-555-0123',
        image: '/images/alumni/rahman-profile.jpg',
        joinedYear: '1975',
        graduatedYear: '1985',
        achievements: [
            'Renowned cardiac surgeon with 30+ years of experience',
            'Published 50+ research papers in cardiovascular medicine',
            'Performed over 2,000 successful heart surgeries',
            'Recipient of Outstanding Alumni Award 2020',
            'Board member of American Heart Association'
        ],
        education: [
            {
                degree: 'Secondary School Certificate (SSC)',
                institution: 'Chittagong Ideal High School',
                year: '1985',
                grade: 'A+'
            },
            {
                degree: 'Higher Secondary Certificate (HSC)',
                institution: 'Chittagong College',
                year: '1987',
                grade: 'A+'
            },
            {
                degree: 'MBBS',
                institution: 'Chittagong Medical College',
                year: '1993',
                grade: 'First Class'
            },
            {
                degree: 'MD in Cardiothoracic Surgery',
                institution: 'Johns Hopkins University',
                year: '1998',
                grade: 'Summa Cum Laude'
            }
        ],
        experience: [
            {
                position: 'Chief of Cardiothoracic Surgery',
                organization: 'Johns Hopkins Hospital',
                period: '2010 - Present',
                description: 'Leading the cardiothoracic surgery department, overseeing complex cardiac procedures and research initiatives.'
            },
            {
                position: 'Senior Cardiac Surgeon',
                organization: 'Mayo Clinic',
                period: '2005 - 2010',
                description: 'Performed advanced cardiac surgeries and contributed to medical research and education.'
            },
            {
                position: 'Cardiac Surgery Fellow',
                organization: 'Cleveland Clinic',
                period: '2000 - 2005',
                description: 'Specialized training in complex cardiac procedures and minimally invasive techniques.'
            }
        ],
        socialContributions: [
            'Established free cardiac surgery program for underprivileged patients',
            'Founded "Hearts for Bangladesh" charity organization',
            'Regular medical missions to rural areas of Bangladesh',
            'Mentored 20+ medical students and residents',
            'Guest lecturer at various medical institutions'
        ],
        quotes: '"The foundation I received at CIHS taught me discipline, perseverance, and the importance of serving others. These values have guided my entire medical career since my graduation from this 27-year-old institution."',
        socialMedia: {
            linkedin: 'https://linkedin.com/in/rahmanahmed',
            twitter: 'https://twitter.com/drahmed',
            facebook: 'https://facebook.com/rahman.ahmed'
        }
    }

    if (!student) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Student not found</h1>
                    <BlackButton onClick={() => router.push('/students')}>
                        Back to Alumni Directory
                    </BlackButton>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <BlackButton
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/students')}
                            className="mb-6 border-white text-white hover:bg-white hover:text-black"
                            icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            }
                        >
                            Back to Alumni Directory
                        </BlackButton>

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div
                                className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex-shrink-0"
                                style={{
                                    backgroundImage: `url(${student.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            />

                            <div className="text-center md:text-left">
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                                    <BlackTag className="bg-white text-black">Batch {student.batch}</BlackTag>
                                    <BlackTag className="bg-white text-black">Class {student.class}</BlackTag>
                                </div>
                                <h1 className="text-4xl font-bold mb-2">{student.name}</h1>
                                <p className="text-xl text-gray-300 mb-2">{student.profession}</p>
                                <p className="text-lg text-gray-400 mb-4">{student.currentPosition}</p>
                                <p className="text-gray-300">{student.organization}</p>
                                <p className="text-gray-400">{student.location}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Main Content */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-12">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Quote */}
                                <ElegantCard>
                                    <blockquote className="text-lg italic text-gray-700 border-l-4 border-black pl-6">
                                        "The foundation I received at CIHS taught me discipline, perseverance, and the importance of serving others. These values have guided my entire medical career since my graduation from this 27-year-old institution."
                                    </blockquote>
                                </ElegantCard>

                                {/* Education */}
                                <ElegantCard>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Education</h3>
                                    <div className="space-y-4">
                                        {student.education.map((edu, index) => (
                                            <div key={index} className="border-l-2 border-gray-200 pl-4">
                                                <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                                                <p className="text-blue-600">{edu.institution}</p>
                                                <div className="flex justify-between items-center text-sm text-gray-600">
                                                    <span>{edu.year}</span>
                                                    <BlackTag variant="subtle" size="xs">{edu.grade}</BlackTag>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ElegantCard>

                                {/* Professional Experience */}
                                <ElegantCard>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Professional Experience</h3>
                                    <div className="space-y-6">
                                        {student.experience.map((exp, index) => (
                                            <div key={index} className="border-l-2 border-blue-500 pl-4">
                                                <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                                                <p className="text-blue-600 font-medium">{exp.organization}</p>
                                                <p className="text-sm text-gray-600 mb-2">{exp.period}</p>
                                                <p className="text-gray-700">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </ElegantCard>

                                {/* Achievements */}
                                <ElegantCard>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Achievements</h3>
                                    <ul className="space-y-3">
                                        {student.achievements.map((achievement, index) => (
                                            <li key={index} className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">{achievement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </ElegantCard>

                                {/* Social Contributions */}
                                <ElegantCard>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Social Contributions</h3>
                                    <ul className="space-y-3">
                                        {student.socialContributions.map((contribution, index) => (
                                            <li key={index} className="flex items-start">
                                                <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                <span className="text-gray-700">{contribution}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </ElegantCard>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Contact Information */}
                                <ElegantCard className="sticky top-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm">
                                            <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-gray-700">{student.email}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-gray-700">{student.phone}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            <span className="text-gray-700">{student.location}</span>
                                        </div>
                                    </div>

                                    {/* Social Media */}
                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium text-gray-900 mb-3">Connect</h4>
                                        <div className="flex space-x-3">
                                            {student.socialMedia.linkedin && (
                                                <a href={student.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                    </svg>
                                                </a>
                                            )}
                                            {student.socialMedia.twitter && (
                                                <a href={student.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                                    </svg>
                                                </a>
                                            )}
                                            {student.socialMedia.facebook && (
                                                <a href={student.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <BlackButton size="sm" className="w-full">
                                            Send Message
                                        </BlackButton>
                                    </div>
                                </ElegantCard>

                                {/* Quick Stats */}
                                <ElegantCard>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Joined CIHS</span>
                                            <span className="font-medium">{student.joinedYear}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Graduated</span>
                                            <span className="font-medium">{student.graduatedYear}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Years at CIHS</span>
                                            <span className="font-medium">{student.graduatedYear - student.joinedYear} years</span>
                                        </div>
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

export default StudentDetailPage
