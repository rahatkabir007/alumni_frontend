"use client"
import React, { useState } from 'react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'
import Link from 'next/link'

const BlogsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all')

    const blogs = [
        {
            id: 1,
            title: 'My Journey from CIHS to Silicon Valley',
            author: 'Ahmed Rahman',
            authorImage: '/images/alumni/ahmed-rahman.jpg',
            date: 'November 20, 2024',
            category: 'Career',
            excerpt: 'How the foundation laid at CIHS helped me succeed in the tech industry. From learning problem-solving skills to building lasting friendships...',
            image: '/images/blogs/silicon-valley-journey.jpg',
            readTime: '5 min read',
            tags: ['Career', 'Technology', 'Success']
        },
        {
            id: 2,
            title: 'Memories of Golden Days at CIHS',
            author: 'Nasir Uddin',
            authorImage: '/images/alumni/nasir-uddin.jpg',
            date: 'November 15, 2024',
            category: 'Memories',
            excerpt: 'Nostalgic memories of school days and the teachers who shaped our lives. The corridors, the classrooms, and the friendships that lasted a lifetime...',
            image: '/images/blogs/golden-memories.jpg',
            readTime: '4 min read',
            tags: ['Memories', 'School Life', 'Nostalgia']
        },
        {
            id: 3,
            title: 'Building a Startup: Lessons from CIHS',
            author: 'Fatima Sheikh',
            authorImage: '/images/alumni/fatima-sheikh.jpg',
            date: 'November 10, 2024',
            category: 'Business',
            excerpt: 'How the entrepreneurial spirit was nurtured during my time at CIHS. The leadership qualities and teamwork skills I developed...',
            image: '/images/blogs/startup-lessons.jpg',
            readTime: '6 min read',
            tags: ['Business', 'Entrepreneurship', 'Leadership']
        },
        {
            id: 4,
            title: 'From CIHS to Harvard: An Academic Journey',
            author: 'Dr. Salma Khan',
            authorImage: '/images/alumni/salma-khan.jpg',
            date: 'November 5, 2024',
            category: 'Education',
            excerpt: 'The academic excellence culture at CIHS prepared me for the challenges of higher education at world&apos;s top universities...',
            image: '/images/blogs/harvard-journey.jpg',
            readTime: '7 min read',
            tags: ['Education', 'Academic', 'University']
        },
        {
            id: 5,
            title: 'Giving Back to Our Alma Mater',
            author: 'Mohammad Ali',
            authorImage: '/images/alumni/mohammad-ali.jpg',
            date: 'October 30, 2024',
            category: 'Community',
            excerpt: 'Why I decided to establish a scholarship fund for current CIHS students and how other alumni can contribute to our school&apos;s growth...',
            image: '/images/blogs/giving-back.jpg',
            readTime: '5 min read',
            tags: ['Community', 'Giving Back', 'Scholarship']
        },
        {
            id: 6,
            title: 'CIHS Teachers Who Changed My Life',
            author: 'Rashida Begum',
            authorImage: '/images/alumni/rashida-begum.jpg',
            date: 'October 25, 2024',
            category: 'Memories',
            excerpt: 'A tribute to the dedicated teachers at CIHS who went beyond academics to shape our character and values...',
            image: '/images/blogs/inspiring-teachers.jpg',
            readTime: '4 min read',
            tags: ['Teachers', 'Inspiration', 'Gratitude']
        }
    ]

    const categories = ['all', 'Career', 'Memories', 'Business', 'Education', 'Community']

    const filteredBlogs = blogs.filter(blog =>
        selectedCategory === 'all' || blog.category === selectedCategory
    )

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <BlackTag className="mb-4 bg-white text-black">Blog</BlackTag>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Alumni Stories & Insights
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto text-gray-300">
                            Read inspiring stories, career insights, and memories shared by our CIHS alumni community.
                            Every story is a testament to the lasting impact of our alma mater.
                        </p>
                    </div>
                </section>
            </ScrollReveal>

            {/* Category Filter */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-8 bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">Filter by category:</span>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                            ? 'bg-black text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {category === 'all' ? 'All Categories' : category}
                                    </button>
                                ))}
                            </div>
                            <BlackTag size="sm">
                                {filteredBlogs.length} articles
                            </BlackTag>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Blog Grid */}
            <ScrollReveal direction="up" delay={0.4}>
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBlogs.map((blog) => (
                                <ElegantCard key={blog.id} className="overflow-hidden group cursor-pointer">
                                    <div className="relative">
                                        <div
                                            className="h-48 bg-gradient-to-br from-blue-400 to-purple-400"
                                            style={{
                                                backgroundImage: `url(${blog.image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        />
                                        <BlackTag className="absolute top-4 right-4" size="xs">
                                            {blog.category}
                                        </BlackTag>
                                        <div className="absolute bottom-4 left-4">
                                            <BlackTag variant="subtle" size="xs" className="bg-white text-black">
                                                {blog.readTime}
                                            </BlackTag>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                            {blog.title}
                                        </h3>

                                        <div className="flex items-center mb-3">
                                            <div
                                                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 mr-3"
                                                style={{
                                                    backgroundImage: `url(${blog.authorImage})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{blog.author}</p>
                                                <p className="text-xs text-gray-500">{blog.date}</p>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>

                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {blog.tags.slice(0, 2).map((tag, index) => (
                                                <BlackTag key={index} variant="outline" size="xs">
                                                    {tag}
                                                </BlackTag>
                                            ))}
                                            {blog.tags.length > 2 && (
                                                <BlackTag variant="subtle" size="xs">
                                                    +{blog.tags.length - 2}
                                                </BlackTag>
                                            )}
                                        </div>

                                        <Link href={`/blogs/${blog.id}`}>
                                            <BlackButton
                                                size="sm"
                                                variant="outline"
                                                className="w-full"
                                                icon={
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                }
                                            >
                                                Read Article
                                            </BlackButton>
                                        </Link>
                                    </div>
                                </ElegantCard>
                            ))}
                        </StaggerContainer>
                    </div>
                </section>
            </ScrollReveal>

            {/* Write Blog CTA */}
            <ScrollReveal direction="up" delay={0.5}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Share Your Story
                        </h2>
                        <p className="text-lg text-gray-300 mb-8">
                            Have an inspiring story or valuable insights to share with the CIHS alumni community?
                            We&apos;d love to feature your article on our blog.
                        </p>
                        <BlackButton
                            size="lg"
                            className="bg-white text-black hover:bg-gray-200"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            }
                        >
                            Submit Your Article
                        </BlackButton>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default BlogsPage
