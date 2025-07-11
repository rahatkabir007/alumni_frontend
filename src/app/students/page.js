"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import AnimatedCard from '@/components/animations/AnimatedCard'
import Link from 'next/link'

const StudentsPage = () => {
    const [selectedBatch, setSelectedBatch] = useState('all')
    const [selectedClass, setSelectedClass] = useState('all')

    // Mock data - replace with actual API data
    const students = [
        {
            id: 1,
            name: 'Dr. Rahman Ahmed',
            batch: '1985',
            class: '10',
            profession: 'Surgeon at Johns Hopkins Hospital',
            location: 'Baltimore, USA',
            image: '/images/alumni/rahman.jpg',
            achievements: 'Renowned cardiac surgeon, Published 50+ research papers'
        },
        {
            id: 2,
            name: 'Eng. Fatima Khan',
            batch: '1990',
            class: '10',
            profession: 'Software Engineer at Google',
            location: 'California, USA',
            image: '/images/alumni/fatima.jpg',
            achievements: 'Lead engineer on Google Search, Multiple patents holder'
        },
        {
            id: 3,
            name: 'Prof. Nasir Uddin',
            batch: '1988',
            class: '10',
            profession: 'Professor at University of Dhaka',
            location: 'Dhaka, Bangladesh',
            image: '/images/alumni/nasir.jpg',
            achievements: 'Head of Physics Department, Research in Quantum Computing'
        },
        {
            id: 4,
            name: 'Dr. Ayesha Begum',
            batch: '1992',
            class: '10',
            profession: 'Pediatrician',
            location: 'Chittagong, Bangladesh',
            image: '/images/alumni/ayesha.jpg',
            achievements: 'Founder of Children\'s Health Foundation'
        },
        {
            id: 5,
            name: 'Mohammad Karim',
            batch: '1987',
            class: '10',
            profession: 'CEO at Tech Startup',
            location: 'Singapore',
            image: '/images/alumni/karim.jpg',
            achievements: 'Founded 3 successful startups, Forbes 30 under 30'
        },
        {
            id: 6,
            name: 'Rashida Sultana',
            batch: '1995',
            class: '10',
            profession: 'Diplomat',
            location: 'London, UK',
            image: '/images/alumni/rashida.jpg',
            achievements: 'Ambassador to UK, Human Rights Advocate'
        }
    ]

    const batches = ['all', '1985', '1987', '1988', '1990', '1992', '1995', '2000', '2005', '2010', '2015', '2020']
    const classes = ['all', 'Nursery', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

    const filteredStudents = students.filter(student => {
        return (selectedBatch === 'all' || student.batch === selectedBatch) &&
            (selectedClass === 'all' || student.class === selectedClass)
    })

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            CIHS Alumni Directory
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto">
                            Connect with fellow graduates from Chittagong Ideal High School.
                            From nursery to class 10, our alumni are making a difference worldwide.
                        </p>
                    </div>
                </section>
            </ScrollReveal>

            {/* Filters */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-8 bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">Batch:</label>
                                <select
                                    value={selectedBatch}
                                    onChange={(e) => setSelectedBatch(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {classes.map(cls => (
                                        <option key={cls} value={cls}>
                                            {cls === 'all' ? 'All Classes' : `Class ${cls}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="text-sm text-gray-600">
                                Showing {filteredStudents.length} alumni
                            </div>
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
                                <AnimatedCard
                                    key={student.id}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                                    hoverScale={1.03}
                                >
                                    <div className="relative">
                                        <div
                                            className="h-48 bg-gradient-to-br from-blue-400 to-green-400"
                                            style={{
                                                backgroundImage: `url(${student.image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        />
                                        <div className="absolute top-4 right-4 bg-yellow-500 text-blue-900 px-2 py-1 rounded text-sm font-semibold">
                                            Batch {student.batch}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{student.name}</h3>
                                        <p className="text-blue-600 font-medium mb-2">{student.profession}</p>
                                        <p className="text-gray-600 text-sm mb-2">
                                            <span className="inline-flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {student.location}
                                            </span>
                                        </p>
                                        <p className="text-gray-700 text-sm mb-4">{student.achievements}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Class {student.class} Graduate</span>
                                            <Link
                                                href={`/students/${student.id}`}
                                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                            >
                                                View Profile →
                                            </Link>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>
            </ScrollReveal>

            {/* Join CTA */}
            <ScrollReveal direction="up" delay={0.5}>
                <section className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Are You a CIHS Graduate?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Join our alumni network and connect with your fellow graduates. Share your story and inspire current students.
                        </p>
                        <Link
                            href="/register"
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                        >
                            Join Alumni Network
                        </Link>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default StudentsPage
