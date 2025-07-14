"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'
import Link from 'next/link'
import { statuses, teachers, departments } from '@/datas/teacherspage'
import IntroSection from '@/components/common/IntroSection'
import TeacherCard from './TeacherCard'
const TeachersPage = () => {
    const router = useRouter()
    const [selectedDepartment, setSelectedDepartment] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')

    const filteredTeachers = teachers?.filter(teacher => {
        return (selectedDepartment === 'all' || teacher.department === selectedDepartment) &&
            (selectedStatus === 'all' || teacher.status === selectedStatus)
    })

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <IntroSection
                tag='Faculty'
                title='Our Distinguished Teachers'
                description='Meet the dedicated educators who have shaped generations of students at CIHS. From seasoned veterans to current faculty, each teacher has contributed to our legacy of excellence.'
            />


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
                                    {departments?.map(dept => (
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
                                    {statuses?.map(status => (
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
                                <TeacherCard key={teacher?.id} teacher={teacher} />
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
                        <div className='flex justify-center items-center'>
                            <BlackButton
                                onClick={() => router.push('/contact')}
                                size="lg"
                                className="bg-white text-black hover:bg-gray-200"
                            >
                                Contact HR Department
                            </BlackButton>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default TeachersPage
