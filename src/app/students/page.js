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

const StudentsPage = () => {
    const [selectedBatch, setSelectedBatch] = useState('all')
    const [selectedClass, setSelectedClass] = useState('all')

    // Mock data - replace with actual API data
    const students = [
        {
            id: 1,
            name: 'Dr. Rahman Ahmed',
            batch: '2005',
            class: '10',
            profession: 'Surgeon at Johns Hopkins Hospital',
            location: 'Baltimore, USA',
            image: '/images/alumni/rahman.jpg',
            achievements: 'Renowned cardiac surgeon, Published 50+ research papers'
        },
        {
            id: 2,
            name: 'Eng. Fatima Khan',
            batch: '2010',
            class: '10',
            profession: 'Software Engineer at Google',
            location: 'California, USA',
            image: '/images/alumni/fatima.jpg',
            achievements: 'Lead engineer on Google Search, Multiple patents holder'
        },
        {
            id: 3,
            name: 'Prof. Nasir Uddin',
            batch: '2008',
            class: '10',
            profession: 'Professor at University of Dhaka',
            location: 'Dhaka, Bangladesh',
            image: '/images/alumni/nasir.jpg',
            achievements: 'Head of Physics Department, Research in Quantum Computing'
        },
        {
            id: 4,
            name: 'Dr. Ayesha Begum',
            batch: '2012',
            class: '10',
            profession: 'Pediatrician',
            location: 'Chittagong, Bangladesh',
            image: '/images/alumni/ayesha.jpg',
            achievements: 'Founder of Children&apos;s Health Foundation'
        },
        {
            id: 5,
            name: 'Mohammad Karim',
            batch: '2007',
            class: '10',
            profession: 'CEO at Tech Startup',
            location: 'Singapore',
            image: '/images/alumni/karim.jpg',
            achievements: 'Founded 3 successful startups, Forbes 30 under 30'
        },
        {
            id: 6,
            name: 'Rashida Sultana',
            batch: '2015',
            class: '10',
            profession: 'Diplomat',
            location: 'London, UK',
            image: '/images/alumni/rashida.jpg',
            achievements: 'Ambassador to UK, Human Rights Advocate'
        }
    ]

    const batches = ['all', '2005', '2007', '2008', '2010', '2012', '2015', '2018', '2020', '2022', '2024']
    const classes = ['all', 'Nursery', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

    const filteredStudents = students.filter(student => {
        return (selectedBatch === 'all' || student.batch === selectedBatch) &&
            (selectedClass === 'all' || student.class === selectedClass)
    })

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-16 bg-black text-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <BlackTag className="mb-4 bg-white text-black">Alumni Directory</BlackTag>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            CIHS Alumni Directory
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto text-gray-300">
                            Connect with fellow graduates from Chittagong Ideal High School.
                            From nursery to class 10, our alumni are making a difference worldwide.
                        </p>
                    </div>
                </section>
            </ScrollReveal>

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
                            {filteredStudents.map((student) => (
                                <ElegantCard key={student.id} className="overflow-hidden group">
                                    <div className="relative">
                                        <div
                                            className="h-48 bg-gradient-to-br from-blue-400 to-green-400"
                                            style={{
                                                backgroundImage: `url(${student.image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        />
                                        <BlackTag
                                            className="absolute top-4 right-4"
                                            size="xs"
                                        >
                                            Batch {student.batch}
                                        </BlackTag>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{student.name}</h3>
                                        <p className="text-blue-600 font-medium mb-2">{student.profession}</p>
                                        <p className="text-gray-600 text-sm mb-2 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {student.location}
                                        </p>
                                        <p className="text-gray-700 text-sm mb-4">{student.achievements}</p>
                                        <div className="flex justify-between items-center">
                                            <BlackTag variant="subtle" size="xs">
                                                Class {student.class} Graduate
                                            </BlackTag>
                                            <Link href={`/students/${student.id}`}>
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
