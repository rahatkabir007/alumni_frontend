"use client"
import React, { useState } from 'react'
import ScrollReveal from '@/components/animations/ScrollReveal'
import StaggerContainer from '@/components/animations/StaggerContainer'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import { blogs, categories } from '@/datas/blogsPage'
import IntroSection from '@/components/common/IntroSection'
import BlogCard from './BlogCard'

const BlogsPage = ({

}) => {
    const [selectedCategory, setSelectedCategory] = useState('all')

    const filteredBlogs = blogs?.filter(blog =>
        selectedCategory === 'all' || blog.category === selectedCategory
    )

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <IntroSection
                tag='Blog'
                title='Alumni Stories & Insights'
                description='Read inspiring stories, career insights, and memories shared by our CIHS alumni community. Every story is a testament to the lasting impact of our alma mater.'
            />

            {/* Category Filter */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-8 bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">Filter by category:</span>
                            <div className="flex flex-wrap gap-2">
                                {categories?.map(category => (
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
                            {filteredBlogs?.map((blog) => (
                                <BlogCard key={blog?.id} blog={blog} />
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
                        <div className="flex justify-center items-center">
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
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default BlogsPage
