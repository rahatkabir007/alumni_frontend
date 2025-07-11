"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import AnimatedCard from '@/components/animations/AnimatedCard'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'
import Link from 'next/link'

const TeachersPage = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')

    // Mock data
    const teachers = [
        {
            id: 1,
            name: 'Prof. Nasir Uddin',
            designation: 'Former Principal',
            department: 'Administration',
            period: '1980-2005',
            status: 'retired',
            subjects: ['Leadership', 'Educational Management'],
            achievements: 'Led CIHS for 25 years, Established scholarship programs',
            image: '/images/teachers/nasir-uddin.jpg',
            specialization: 'Educational Leadership'
        },
        {
            id: 2,
            name: 'Mrs. Fatima Khatun',
            designation: 'Senior Mathematics Teacher',
            department: 'Mathematics',
            period: '1975-2010',
            status: 'retired',
            subjects: ['Advanced Mathematics', 'Calculus', 'Statistics'],
            achievements: 'Best Teacher Award 1995, Mentored 500+ students',
            image: '/images/teachers/fatima-khatun.jpg',
            specialization: 'Pure Mathematics'
        },
        {
            id: 3,
            name: 'Dr. Abdul Karim',
            designation: 'Head of Science Department',
            department: 'Science',
            period: '1985-Present',
            status: 'active',
            subjects: ['Physics', 'Chemistry', 'Research Methodology'],
            achievements: 'PhD in Physics, Published 30+ research papers',
            image: '/images/teachers/abdul-karim.jpg',
            specialization: 'Theoretical Physics'
        },
        {
            id: 4,
            name: 'Mrs. Rashida Begum',
            designation: 'English Department Head',
            department: 'Languages',
            period: '1990-Present',
            status: 'active',
            subjects: ['English Literature', 'Creative Writing', 'Public Speaking'],
            achievements: 'Masters in English Literature, Drama Club Coordinator',
            image: '/images/teachers/rashida-begum.jpg',
            specialization: 'English Literature'
        },
        {
            id: 5,
            name: 'Mr. Shahid Hassan',
            designation: 'Physical Education Instructor',
            department: 'Sports',
            period: '1988-2020',
            status: 'retired',
            subjects: ['Physical Education', 'Sports Science', 'Health Education'],
            achievements: 'National Sports Award, Trained Olympic athletes',
            image: '/images/teachers/shahid-hassan.jpg',
            specialization: 'Athletic Training'
        },
        {
            id: 6,
            name: 'Mrs. Salma Khatun',
            designation: 'Computer Science Teacher',
            department: 'Technology',
            period: '2000-Present',
            status: 'active',
            subjects: ['Computer Programming', 'Web Development', 'Database Management'],
            achievements: 'IT Innovation Award, Digitalized school records',
            image: '/images/teachers/salma-khatun.jpg',
            specialization: 'Computer Science'
        }
    ]

    const departments = ['all', 'Administration', 'Mathematics', 'Science', 'Languages', 'Sports', 'Technology']
    const statuses = ['all', 'active', 'retired']

    const filteredTeachers = teachers.filter(teacher => {
        return (selectedDepartment === 'all' || teacher.department === selectedDepartment) &&
            (selectedStatus === 'all' || teacher.status === selectedStatus)
    })

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <BlackTag className="mb-4 bg-white text-black">Faculty</BlackTag>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Our Distinguished Teachers
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto text-gray-300">
                            Meet the dedicated educators who have shaped generations of students at CIHS.
                            From seasoned veterans to current faculty, each teacher has contributed to our legacy of excellence.
                        </p>
                    </div>
                </section>
            </ScrollReveal>

            {/* Filters */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-8 bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">Department:</label>
                                <select
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="border-2 border-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>
                                            {dept === 'all' ? 'All Departments' : dept}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">Status:</label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="border-2 border-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    {statuses.map(status => (
                                        <option key={status} value={status}>
                                            {status === 'all' ? 'All Teachers' : status === 'active' ? 'Current Faculty' : 'Retired Teachers'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <BlackTag size="sm">
                                Showing {filteredTeachers.length} teachers
                            </BlackTag>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Teachers Grid */}
            <ScrollReveal direction="up" delay={0.4}>
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredTeachers.map((teacher) => (
                                <ElegantCard key={teacher.id} className="overflow-hidden">
                                    <div className="relative">
                                        <div
                                            className="h-48 bg-gradient-to-br from-blue-600 to-emerald-600"
                                            style={{
                                                backgroundImage: `url(${teacher.image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        />
                                        <BlackTag
                                            className={`absolute top-4 right-4 ${teacher.status === 'active' ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black'}`}
                                            size="xs"
                                        >
                                            {teacher.status === 'active' ? 'Current Faculty' : 'Retired'}
                                        </BlackTag>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{teacher.name}</h3>
                                        <p className="text-blue-600 font-medium mb-2">{teacher.designation}</p>
                                        <p className="text-gray-600 text-sm mb-3 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-3 0h4" />
                                            </svg>
                                            {teacher.department} • {teacher.period}
                                        </p>

                                        <div className="mb-3">
                                            <h4 className="text-sm font-medium text-gray-700 mb-1">Specialization:</h4>
                                            <BlackTag variant="subtle" size="xs">{teacher.specialization}</BlackTag>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-1">Subjects:</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {teacher.subjects.slice(0, 2).map((subject, index) => (
                                                    <BlackTag key={index} variant="outline" size="xs">
                                                        {subject}
                                                    </BlackTag>
                                                ))}
                                                {teacher.subjects.length > 2 && (
                                                    <BlackTag variant="subtle" size="xs">
                                                        +{teacher.subjects.length - 2} more
                                                    </BlackTag>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{teacher.achievements}</p>

                                        <div className="flex justify-between items-center">
                                            <BlackTag variant="subtle" size="xs">{teacher.department}</BlackTag>
                                            <Link href={`/teachers/${teacher.id}`}>
                                                <BlackButton
                                                    size="sm"
                                                    variant="outline"
                                                    icon={
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    }
                                                >
                                                    View Profile
                                                </BlackButton>
                                            </Link>
                                        </div>
                                    </div>
                                </ElegantCard>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>
            </ScrollReveal>

            {/* Join Faculty CTA */}
            <ScrollReveal direction="up" delay={0.5}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Interested in Teaching at CIHS?
                        </h2>
                        <p className="text-lg text-gray-300 mb-8">
                            Join our dedicated team of educators and help shape the next generation of leaders.
                        </p>
                        <BlackButton
                            onClick={() => router.push('/contact')}
                            size="lg"
                            className="bg-white text-black hover:bg-gray-200"
                        >
                            Contact HR Department
                        </BlackButton>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default TeachersPage
