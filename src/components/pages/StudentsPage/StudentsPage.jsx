"use client"
import React, { useEffect, useState } from 'react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import { batches, classes, students } from '@/datas/studentsPage'
import IntroSection from '@/components/common/IntroSection'
import StudentCard from './StudentCard'
import { useGetAlumniListQuery } from '@/redux/features/alumni/alumniApi'
import Pagination from '@/components/common/Pagination'

const StudentsPage = () => {

    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [sortBy, setSortBy] = useState('created_at')
    const [sortOrder, setSortOrder] = useState('desc')
    const [selectedBatch, setSelectedBatch] = useState('all')
    const [selectedClass, setSelectedClass] = useState('all')


    const getQueryParams = () => {
        const baseParams = {
            page: currentPage,
            limit: 10,
            search: debouncedSearch,
            sortBy,
            sortOrder,
            excludeAdmins: true,
            status: "all",
        }
        return { ...baseParams }
    }

    const { data, isLoading, isFetching, error, refetch } = useGetAlumniListQuery(
        getQueryParams(),
    )


    // const filteredStudents = students?.filter(student => {
    //     return (selectedBatch === 'all' || student.batch === selectedBatch) &&
    //         (selectedClass === 'all' || student.class === selectedClass)
    // })

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])


    const users = data?.users || []
    const pagination = {
        current: currentPage,
        pageSize: data?.itemsPerPage || 10,
        total: data?.totalItems || 0,
        showSizeChanger: false,
        showQuickJumper: false,
        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} results`,
    }

    const handleSearchChange = (e) => setSearchTerm(e.target.value)

    const handlePageChange = (page) => setCurrentPage(page)




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
                                Showing {users.length} alumni
                            </BlackTag>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Alumni Grid */}
            <ScrollReveal direction="up" delay={0.4}>
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[60vh]">
                        {
                            (isLoading || isFetching) ? <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading...</p>
                            </div> :
                                <>
                                    {
                                        users.length > 0 ? <div className='flex flex-col gap-8'>
                                            <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                                {users?.map((student) => (
                                                    <StudentCard key={student?.id} student={student} />
                                                ))}
                                            </StaggerContainer>

                                            <Pagination
                                                currentPage={currentPage}
                                                itemsPerPage={pagination.pageSize}
                                                totalItems={pagination.total}
                                                onPageChange={handlePageChange}
                                                isLoading={isLoading || isFetching}
                                                totalPages={Math.ceil(pagination.total / pagination.pageSize)}
                                            />
                                        </div>
                                            : <div className="text-center text-gray-500">
                                                No alumni found matching your criteria.
                                            </div>
                                    }
                                </>
                        }
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
