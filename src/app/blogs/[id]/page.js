"use client"
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import ScrollReveal from '@/components/animations/ScrollReveal'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'
import Link from 'next/link'

const BlogDetailPage = () => {
    const params = useParams()
    const router = useRouter()
    const blogId = params.id

    // Mock blog data - in real app, fetch from API
    const blog = {
        id: 1,
        title: 'My Journey from CIHS to Silicon Valley',
        content: `
            <p>Starting my journey at Chittagong Ideal High School was the foundation that would eventually lead me to Silicon Valley. The rigorous academic environment and the emphasis on critical thinking at CIHS prepared me for the challenges that lay ahead.</p>
            
            <h3>The Early Years at CIHS</h3>
            <p>During my time at CIHS from nursery to class 10, I was exposed to a diverse curriculum that encouraged both analytical and creative thinking. The mathematics and science programs were particularly strong, laying the groundwork for my future in technology.</p>
            
            <p>I remember Mrs. Fatima Khatun's mathematics classes where she would challenge us with complex problems that seemed impossible at first. These problem-solving sessions taught me persistence and logical thinking - skills that would prove invaluable in my programming career.</p>
            
            <h3>The Transition to Higher Education</h3>
            <p>After graduating from CIHS, I pursued computer science at a local university. The foundation I had received at CIHS made the transition smooth. The discipline, time management, and study habits I had developed served me well.</p>
            
            <p>During university, I participated in programming competitions and hackathons. The competitive spirit that was nurtured at CIHS through various inter-house competitions gave me the confidence to participate and excel in these events.</p>
            
            <h3>Breaking into Silicon Valley</h3>
            <p>Landing my first job at a Silicon Valley tech company was a dream come true. The interview process was rigorous, involving multiple rounds of technical assessments and problem-solving sessions. The analytical skills and ability to think under pressure that I had developed at CIHS were crucial during these interviews.</p>
            
            <p>Working at Google, Apple, and eventually starting my own tech company, I often reflect on how my CIHS education shaped my approach to problem-solving and innovation. The school's emphasis on excellence and continuous learning became the pillars of my professional philosophy.</p>
            
            <h3>Giving Back to CIHS</h3>
            <p>Success comes with responsibility. I've established a scholarship fund for CIHS students pursuing STEM education and regularly mentor current students interested in technology careers. It's my way of giving back to the institution that gave me so much.</p>
            
            <p>The network of CIHS alumni in the tech industry has also been instrumental in my journey. We regularly organize meetups and support each other's ventures, maintaining the spirit of community that was instilled in us during our school days.</p>
            
            <h3>Advice for Current Students</h3>
            <p>To current CIHS students, I want to say that your journey is just beginning. Embrace the challenges, seek help when needed, and never stop learning. The foundation you're building now will serve you throughout your life, no matter which path you choose.</p>
            
            <p>The world of technology is constantly evolving, but the fundamental principles of problem-solving, critical thinking, and perseverance that CIHS teaches will always be relevant. Dream big, work hard, and remember that your CIHS family is always here to support you.</p>
        `,
        author: 'Ahmed Rahman',
        authorBio: 'Ahmed Rahman is a CIHS alumnus (Class of 1995) and currently serves as CTO at a leading Silicon Valley tech company. He has over 15 years of experience in the technology industry.',
        authorImage: '/images/alumni/ahmed-rahman.jpg',
        date: 'November 20, 2024',
        readTime: '8 min read',
        category: 'Career',
        tags: ['Technology', 'Career', 'Success Story', 'Silicon Valley'],
        image: '/images/blogs/silicon-valley-detail.jpg',
        views: 1234,
        likes: 89
    }

    // Related blogs
    const relatedBlogs = [
        {
            id: 2,
            title: 'Building a Startup: Lessons from CIHS',
            author: 'Fatima Sheikh',
            image: '/images/blogs/startup.jpg',
            category: 'Business'
        },
        {
            id: 3,
            title: 'Medical Career Path: From CIHS to Johns Hopkins',
            author: 'Dr. Ayesha Begum',
            image: '/images/blogs/medical-career.jpg',
            category: 'Career'
        }
    ]

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h1>
                    <BlackButton onClick={() => router.push('/blogs')}>
                        Back to Blogs
                    </BlackButton>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <ScrollReveal direction="up" delay={0.2}>
                <section className="py-16 bg-black text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4 mb-6">
                            <BlackButton
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/blogs')}
                                className="border-white text-white hover:bg-white hover:text-black"
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                }
                            >
                                Back to Blogs
                            </BlackButton>
                            <BlackTag className="bg-white text-black">{blog.category}</BlackTag>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            {blog.title}
                        </h1>

                        <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-300">
                            <div className="flex items-center">
                                <div
                                    className="w-12 h-12 rounded-full bg-gray-300 mr-3"
                                    style={{
                                        backgroundImage: `url(${blog.authorImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                />
                                <div>
                                    <div className="font-medium text-white">{blog.author}</div>
                                    <div className="text-sm">{blog.date}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                                <span>{blog.readTime}</span>
                                <span>•</span>
                                <span>{blog.views} views</span>
                                <span>•</span>
                                <span>{blog.likes} likes</span>
                            </div>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Featured Image */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div
                            className="h-64 md:h-96 rounded-xl bg-gradient-to-br from-blue-400 to-green-400"
                            style={{
                                backgroundImage: `url(${blog.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />
                    </div>
                </section>
            </ScrollReveal>

            {/* Content */}
            <ScrollReveal direction="up" delay={0.4}>
                <section className="py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8">
                            {/* Main Content */}
                            <div className="md:col-span-3">
                                <ElegantCard className="prose prose-lg max-w-none">
                                    <div
                                        className="text-gray-700 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: blog.content }}
                                    />
                                </ElegantCard>

                                {/* Tags */}
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {blog.tags.map((tag, index) => (
                                            <BlackTag key={index} variant="outline" size="sm">
                                                {tag}
                                            </BlackTag>
                                        ))}
                                    </div>
                                </div>

                                {/* Author Bio */}
                                <ElegantCard className="mt-8">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"
                                            style={{
                                                backgroundImage: `url(${blog.authorImage})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                About {blog.author}
                                            </h3>
                                            <p className="text-gray-600">{blog.authorBio}</p>
                                        </div>
                                    </div>
                                </ElegantCard>
                            </div>

                            {/* Sidebar */}
                            <div className="md:col-span-1">
                                <ElegantCard className="sticky top-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Related Articles
                                    </h3>
                                    <div className="space-y-4">
                                        {relatedBlogs.map((relatedBlog) => (
                                            <Link
                                                key={relatedBlog.id}
                                                href={`/blogs/${relatedBlog.id}`}
                                                className="block group"
                                            >
                                                <div className="flex gap-3">
                                                    <div
                                                        className="w-16 h-16 rounded-lg bg-gray-300 flex-shrink-0"
                                                        style={{
                                                            backgroundImage: `url(${relatedBlog.image})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center'
                                                        }}
                                                    />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                            {relatedBlog.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            By {relatedBlog.author}
                                                        </p>
                                                        <BlackTag variant="subtle" size="xs" className="mt-1">
                                                            {relatedBlog.category}
                                                        </BlackTag>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-6 border-t">
                                        <BlackButton
                                            size="sm"
                                            className="w-full"
                                            onClick={() => router.push('/blogs')}
                                        >
                                            View All Blogs
                                        </BlackButton>
                                    </div>
                                </ElegantCard>
                            </div>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export default BlogDetailPage
