"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import AnimatedCard from '@/components/animations/AnimatedCard'
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
        <div className="bg-slate-900 min-h-screen">
            {/* Header */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                            Our Distinguished Teachers
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto text-slate-300">
                            Meet the dedicated educators who have shaped generations of students at CIHS. 
                            From seasoned veterans to current faculty, each teacher has contributed to our legacy of excellence.
                        </p>
                    </div>
                </section>
            </ScrollReveal>

            {/* Filters */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-8 bg-slate-800 border-b border-slate-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-slate-300">Department:</label>
                                <select 
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {departments.map(dept => (
                                        <option key={dept} value={dept} className="bg-slate-700">
                                            {dept === 'all' ? 'All Departments' : dept}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-slate-300">Status:</label>
                                <select 
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {statuses.map(status => (
                                        <option key={status} value={status} className="bg-slate-700">
                                            {status === 'all' ? 'All Teachers' : status === 'active' ? 'Current Faculty' : 'Retired Teachers'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="text-sm text-slate-400">
                                Showing {filteredTeachers.length} teachers
                            </div>
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
                                <AnimatedCard 
                                    key={teacher.id} 
                                    className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
                                    hoverScale={1.03}
                                >
                                    <div className="relative">
                                        <div 
                                            className="h-48 bg-gradient-to-br from-blue-600 to-emerald-600"
                                            style={{
                                                backgroundImage: `url(${teacher.image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        />
                                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                                            teacher.status === 'active' 
                                                ? 'bg-emerald-500 text-white' 
                                                : 'bg-amber-500 text-slate-900'
                                        }`}>
                                            {teacher.status === 'active' ? 'Current Faculty' : 'Retired'}
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2">{teacher.name}</h3>
                                        <p className="text-blue-400 font-medium mb-2">{teacher.designation}</p>
                                        <p className="text-slate-400 text-sm mb-3">
                                            <span className="inline-flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-3 0h4" />
                                                </svg>
                                                {teacher.department} • {teacher.period}
                                            </span>
                                        </p>
                                        
                                        <div className="mb-3">
                                            <h4 className="text-sm font-medium text-slate-300 mb-1">Specialization:</h4>
                                            <p className="text-emerald-400 text-sm">{teacher.specialization}</p>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-slate-300 mb-1">Subjects:</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {teacher.subjects.slice(0, 2).map((subject, index) => (
                                                    <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                                                        {subject}
                                                    </span>
                                                ))}
                                                {teacher.subjects.length > 2 && (
                                                    <span className="bg-slate-700 text-slate-400 px-2 py-1 rounded text-xs">
                                                        +{teacher.subjects.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <p className="text-slate-300 text-sm mb-4 line-clamp-2">{teacher.achievements}</p>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-500">{teacher.department}</span>
                                            <Link 
                                                href={`/teachers/${teacher.id}`}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
                                            >
                                                View Profile 
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>
            </ScrollReveal>

            {/* Join Faculty CTA */}
            <ScrollReveal direction="up" delay={0.5}>
                <section className="py-16 bg-slate-800 border-t border-slate-700">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Interested in Teaching at CIHS?
                        </h2>
                        <p className="text-lg text-slate-400 mb-8">
                            Join our dedicated team of educators and help shape the next generation of leaders.
                        </p>
                        <Link 
                            href="/contact"
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg"
                        >
                            Contact HR Department
                        </Link>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default TeachersPage
