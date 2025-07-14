"use client"
import React, { useState } from 'react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import { batches, classes, students } from '@/datas/studentsPage'
import IntroSection from '@/components/common/IntroSection'
import StudentCard from './StudentCard'

const StudentsPage = () => {
    const [selectedBatch, setSelectedBatch] = useState('all')
    const [selectedClass, setSelectedClass] = useState('all')


    const filteredStudents = students?.filter(student => {
        return (selectedBatch === 'all' || student.batch === selectedBatch) &&
            (selectedClass === 'all' || student.class === selectedClass)
    })

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <IntroSection
                tag='Alumni Directory'
                title='CIHS Alumni Directory'
                description='Connect with fellow graduates from Chittagong Ideal High School. From nursery to class 10, our alumni are making a difference worldwide.'
            />

            {/* Filters */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-8 bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">Batch:</label>
                                <select
                                    value={selectedBatch}
                                    onChange={(e) => setSelectedBatch(e.target.value)}
                                    className="border-2 border-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    {batches.map(batch => (
                                        <option key={batch} value={batch}>
                                            {batch === 'all' ? 'All Batches' : batch}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">Class:</label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="border-2 border-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    {classes.map(cls => (
                                        <option key={cls} value={cls}>
                                            {cls === 'all' ? 'All Classes' : `Class ${cls}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <BlackTag size="sm">
                                Showing {filteredStudents.length} alumni
                            </BlackTag>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Alumni Grid */}
            <ScrollReveal direction="up" delay={0.4}>
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredStudents?.map((student) => (
                                <StudentCard key={student?.id} student={student} />
                            ))}
                        </StaggerContainer>
                    </div>
                </section>
            </ScrollReveal>

            {/* Join CTA */}
            <ScrollReveal direction="up" delay={0.5}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Are You a CIHS Graduate?
                        </h2>
                        <p className="text-lg text-gray-300 mb-8">
                            Join our alumni network and connect with your fellow graduates. Share your story and inspire current students.
                        </p>
                        <div className='flex justify-center items-center'>
                            <BlackButton
                                onClick={() => router.push('/register')}
                                size="lg"
                                className="bg-white text-black hover:bg-gray-200"
                            >
                                Join Alumni Network
                            </BlackButton>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default StudentsPage
