"use client"
import { useState } from 'react'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'

const ReviewsTestimonials = ({ userData }) => {
    const [activeTab, setActiveTab] = useState('my-reviews')
    const canGiveReview = checkUserPermission(userData.roles, PERMISSIONS.GIVE_REVIEW)
    const canApproveReview = checkUserPermission(userData.roles, PERMISSIONS.APPROVE_REVIEW)

    const mockReviews = [
        {
            id: 1,
            type: 'testimonial',
            title: 'Amazing School Experience',
            content: 'CIHS provided me with an excellent foundation for my career...',
            status: 'approved',
            createdAt: '2024-01-15'
        },
        {
            id: 2,
            type: 'review',
            title: 'Great Teachers',
            content: 'The faculty at CIHS was exceptional...',
            status: 'pending',
            createdAt: '2024-01-10'
        }
    ]

    const tabs = [
        { id: 'my-reviews', label: 'My Reviews', count: mockReviews.length },
        ...(canApproveReview ? [{ id: 'pending-approval', label: 'Pending Approval', count: 3 }] : [])
    ]

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <ElegantCard hover={false}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Reviews & Testimonials</h3>
                    {canGiveReview && (
                        <BlackButton size="sm">
                            Write Review
                        </BlackButton>
                    )}
                </div>

                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <BlackTag variant="subtle" size="xs" className="ml-2">
                                        {tab.count}
                                    </BlackTag>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </ElegantCard>

            {/* Tab Content */}
            <ElegantCard hover={false}>
                {activeTab === 'my-reviews' && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">My Reviews</h4>

                        {mockReviews.length > 0 ? (
                            <div className="space-y-4">
                                {mockReviews.map((review) => (
                                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-semibold text-gray-900">{review.title}</h5>
                                            <div className="flex items-center gap-2">
                                                <BlackTag
                                                    variant={review.status === 'approved' ? 'solid' : 'outline'}
                                                    size="xs"
                                                    className={
                                                        review.status === 'approved'
                                                            ? 'bg-green-600 text-white'
                                                            : 'border-yellow-500 text-yellow-600'
                                                    }
                                                >
                                                    {review.status}
                                                </BlackTag>
                                                <BlackTag variant="subtle" size="xs">
                                                    {review.type}
                                                </BlackTag>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-2">{review.content}</p>
                                        <p className="text-sm text-gray-500">
                                            Created: {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <p className="text-gray-600">No reviews written yet</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'pending-approval' && canApproveReview && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Pending Approval</h4>
                        <div className="text-center py-8">
                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-600">No reviews pending approval</p>
                        </div>
                    </div>
                )}

                {/* Permissions Display */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                        {canGiveReview && <BlackTag variant="outline">Can Write Reviews</BlackTag>}
                        {canApproveReview && <BlackTag variant="outline">Can Approve Reviews</BlackTag>}
                    </div>
                </div>
            </ElegantCard>
        </div>
    )
}

export default ReviewsTestimonials
