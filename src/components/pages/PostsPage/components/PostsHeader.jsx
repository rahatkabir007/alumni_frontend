"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setActiveSection } from '@/redux/features/profile/profileSlice'
import ScrollReveal from '@/components/animations/ScrollReveal'
import BlackButton from '@/components/common/BlackButton'
import IntroSection from '@/components/common/IntroSection'

const PostsHeader = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    const handleCreatePost = () => {
        router.push('/profile')
        dispatch(setActiveSection("posts"))
    }

    return (
        <>
            {/* Header */}
            <IntroSection
                tag='Community'
                title='Alumni Posts'
                description='Stay connected with the CIHS community. Share updates, memories, achievements, and connect with fellow alumni through our community posts.'
            />

            {/* Create Post CTA */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-8 bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Share Your Story</h2>
                                <p className="text-gray-600">Have something to share with the community? Create a post and connect with fellow alumni!</p>
                            </div>
                            <BlackButton
                                onClick={handleCreatePost}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                }
                            >
                                Create Post
                            </BlackButton>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </>
    )
}

export default PostsHeader
