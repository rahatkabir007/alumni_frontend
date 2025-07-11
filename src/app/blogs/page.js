"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'
import Link from 'next/link'

const BlogsPage = () => {
    const router = useRouter()
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    // Mock blog data
    const blogs = [
        {
            id: 1,
            title: 'My Journey from CIHS to Silicon Valley',
            excerpt: 'How the foundation laid at CIHS helped me succeed in the tech industry and build a career at top tech companies.',
            content: 'Full blog content here...',
            author: 'Ahmed Rahman',
            authorImage: '/images/alumni/ahmed-rahman.jpg',
            date: 'November 20, 2024',
            readTime: '5 min read',
            category: 'Career',
            tags: ['Technology', 'Career', 'Success Story'],
            image: '/images/blogs/silicon-valley.jpg',
            featured: true
        },
        {
            id: 2,
            title: 'Memories of Golden Days at CIHS',
            excerpt: 'Nostalgic memories of school days and the teachers who shaped our lives, creating unforgettable moments.',
            content: 'Full blog content here...',
            author: 'Nasir Uddin',
            authorImage: '/images/alumni/nasir-uddin.jpg',
            date: 'November 15, 2024',
            readTime: '3 min read',
            category: 'Memories',
            tags: ['School Life', 'Memories', 'Teachers'],
            image: '/images/blogs/school-memories.jpg',
            featured: false
        },
        {
            id: 3,
            title: 'Building a Startup: Lessons from CIHS',
            excerpt: 'How the entrepreneurial spirit was nurtured during my time at CIHS and helped me build successful startups.',
            content: 'Full blog content here...',
            author: 'Fatima Sheikh',
            authorImage: '/images/alumni/fatima-sheikh.jpg',
            date: 'November 10, 2024',
            readTime: '7 min read',
            category: 'Business',
            tags: ['Entrepreneurship', 'Startup', 'Business'],
            image: '/images/blogs/startup.jpg',
            featured: true
        },
        {
            id: 4,
            title: 'Medical Career Path: From CIHS to Johns Hopkins',
            excerpt: 'The academic rigor at CIHS prepared me for medical school and a successful career in healthcare.',
            content: 'Full blog content here...',
            author: 'Dr. Ayesha Begum',
            authorImage: '/images/alumni/ayesha-begum.jpg',
            date: 'November 5, 2024',
            readTime: '6 min read',
            category: 'Career',
            tags: ['Medicine', 'Healthcare', 'Education'],
            image: '/images/blogs/medical-career.jpg',
            featured: false
        },
        {
            id: 5,
            title: 'Teaching Philosophy: My Years at CIHS',
            excerpt: 'Reflections on teaching methodology and student development during my tenure at CIHS.',
            content: 'Full blog content here...',
            author: 'Prof. Abdul Karim',
            authorImage: '/images/teachers/abdul-karim.jpg',
            date: 'October 28, 2024',
            readTime: '4 min read',
            category: 'Education',
            tags: ['Teaching', 'Education', 'Philosophy'],
            image: '/images/blogs/teaching.jpg',
            featured: false
        },
        {
            id: 6,
            title: 'Global Impact: CIHS Alumni Making a Difference',
            excerpt: 'Stories of CIHS graduates who are creating positive change in communities around the world.',
            content: 'Full blog content here...',
            author: 'Sarah Ahmed',
            authorImage: '/images/alumni/sarah-ahmed.jpg',
            date: 'October 20, 2024',
            readTime: '8 min read',
            category: 'Impact',
            tags: ['Global Impact', 'Social Change', 'Alumni'],
            image: '/images/blogs/global-impact.jpg',
            featured: true
        }
    ]

    const categories = ['all', 'Career', 'Memories', 'Business', 'Education', 'Impact']

    const filteredBlogs = blogs.filter(blog => {
        const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.author.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const featuredBlogs = blogs.filter(blog => blog.featured)

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
                            Discover inspiring stories, career insights, and memories from our CIHS alumni community.
                            Read about journeys, achievements, and the lasting impact of our school.
                        </p>
                    </div>
                </section>
            </ScrollReveal>

            {/* Featured Blogs */}
            {featuredBlogs.length > 0 && (
                <ScrollReveal direction="up" delay={0.3}>
                    <section className="py-12 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center gap-4 mb-8">
                                <BlackTag>Featured</BlackTag>
                                <h2 className="text-2xl font-bold text-gray-900">Featured Stories</h2>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredBlogs.map((blog) => (
                                    <ElegantCard key={blog.id} className="overflow-hidden group">
                                        <div className="relative">
                                            <div
                                                className="h-48 bg-gradient-to-br from-blue-400 to-green-400"
                                                style={{
                                                    backgroundImage: `url(${blog.image})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            />
                                            <BlackTag className="absolute top-4 right-4" size="xs">
                                                {blog.category}
                                            </BlackTag>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                {blog.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>

                                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-8 h-8 rounded-full bg-gray-300 mr-2"
                                                        style={{
                                                            backgroundImage: `url(${blog.authorImage})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center'
                                                        }}
                                                    />
                                                    <span>{blog.author}</span>
                                                </div>
                                                <span>{blog.readTime}</span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">{blog.date}</span>
                                                <Link href={`/blogs/${blog.id}`}>
                                                    <BlackButton size="sm" variant="outline">
                                                        Read More
                                                    </BlackButton>
                                                </Link>
                                            </div>
                                        </div>
                                    </ElegantCard>
                                ))}
                            </div>
                        </div>
                    </section>
                </ScrollReveal>
            )}

            {/* Search and Filter */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-8 bg-white border-t">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            {/* Search */}
                            <div className="flex-1 max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search blogs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* Category Filter */}
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

            {/* All Blogs */}
            <ScrollReveal direction="up" delay={0.4}>
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBlogs.map((blog) => (
                                <ElegantCard key={blog.id} className="overflow-hidden group">
                                    <div className="relative">
                                        <div
                                            className="h-48 bg-gradient-to-br from-blue-400 to-green-400"
                                            style={{
                                                backgroundImage: `url(${blog.image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        />
                                        <BlackTag className="absolute top-4 right-4" size="xs">
                                            {blog.category}
                                        </BlackTag>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {blog.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>

                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {blog.tags.slice(0, 2).map((tag, index) => (
                                                <BlackTag key={index} variant="subtle" size="xs">
                                                    {tag}
                                                </BlackTag>
                                            ))}
                                            {blog.tags.length > 2 && (
                                                <BlackTag variant="subtle" size="xs">
                                                    +{blog.tags.length - 2}
                                                </BlackTag>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <div className="flex items-center">
                                                <div
                                                    className="w-8 h-8 rounded-full bg-gray-300 mr-2"
                                                    style={{
                                                        backgroundImage: `url(${blog.authorImage})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }}
                                                />
                                                <span>{blog.author}</span>
                                            </div>
                                            <span>{blog.readTime}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">{blog.date}</span>
                                            <Link href={`/blogs/${blog.id}`}>
                                                <BlackButton size="sm" variant="outline">
                                                    Read More
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

            {/* Write Blog CTA */}
            <ScrollReveal direction="up" delay={0.5}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Share Your Story
                        </h2>
                        <p className="text-lg text-gray-300 mb-8">
                            Have an inspiring story or valuable insights to share with the CIHS community?
                            We'd love to feature your journey.
                        </p>
                        <BlackButton
                            onClick={() => router.push('/contact')}
                            size="lg"
                            className="bg-white text-black hover:bg-gray-200"
                        >
                            Submit Your Story
                        </BlackButton>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default BlogsPage
