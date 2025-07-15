"use client"
import { useState } from 'react'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'

const AnnouncementManagement = ({ userData }) => {
    const [activeTab, setActiveTab] = useState('my-announcements')

    const canPostAnnouncement = checkUserPermission(userData.roles, PERMISSIONS.POST_ANNOUNCEMENT)
    const canManageAnnouncements = checkUserPermission(userData.roles, PERMISSIONS.MANAGE_ANNOUNCEMENTS)

    // Mock announcement data
    const mockAnnouncements = [
        {
            id: 1,
            title: 'Annual Alumni Reunion 2024',
            content: 'Join us for the biggest alumni gathering of the year...',
            status: 'published',
            priority: 'high',
            createdAt: '2024-01-15',
            author: userData.name
        },
        {
            id: 2,
            title: 'New Scholarship Program',
            content: 'We are excited to announce a new merit-based scholarship...',
            status: 'draft',
            priority: 'medium',
            createdAt: '2024-01-10',
            author: userData.name
        }
    ]

    const tabs = [
        { id: 'my-announcements', label: 'My Announcements', count: mockAnnouncements.length },
        ...(canManageAnnouncements ? [{ id: 'all-announcements', label: 'All Announcements', count: 15 }] : [])
    ]

    if (!canPostAnnouncement && !canManageAnnouncements) {
        return (
            <ElegantCard>
                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h4>
                    <p className="text-gray-600">You don't have permission to manage announcements</p>
                </div>
            </ElegantCard>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <ElegantCard>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Announcement Management</h3>
                    {canPostAnnouncement && (
                        <BlackButton size="sm">
                            Create Announcement
                        </BlackButton>
                    )}
                </div>

                {/* Tabs */}
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
                                <BlackTag variant="subtle" size="xs" className="ml-2">
                                    {tab.count}
                                </BlackTag>
                            </button>
                        ))}
                    </nav>
                </div>
            </ElegantCard>

            {/* Announcements List */}
            <ElegantCard>
                {activeTab === 'my-announcements' && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">My Announcements</h4>

                        {mockAnnouncements.length > 0 ? (
                            <div className="space-y-4">
                                {mockAnnouncements.map((announcement) => (
                                    <div key={announcement.id} className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h5 className="text-lg font-semibold text-gray-900">{announcement.title}</h5>
                                            <div className="flex items-center gap-2">
                                                <BlackTag
                                                    variant={announcement.status === 'published' ? 'solid' : 'outline'}
                                                    size="xs"
                                                    className={
                                                        announcement.status === 'published'
                                                            ? 'bg-green-600 text-white'
                                                            : 'border-yellow-500 text-yellow-600'
                                                    }
                                                >
                                                    {announcement.status}
                                                </BlackTag>
                                                <BlackTag
                                                    variant="outline"
                                                    size="xs"
                                                    className={
                                                        announcement.priority === 'high'
                                                            ? 'border-red-500 text-red-600'
                                                            : announcement.priority === 'medium'
                                                                ? 'border-orange-500 text-orange-600'
                                                                : 'border-blue-500 text-blue-600'
                                                    }
                                                >
                                                    {announcement.priority} priority
                                                </BlackTag>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-4 line-clamp-3">{announcement.content}</p>

                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-500">
                                                Created: {new Date(announcement.createdAt).toLocaleDateString()}
                                                {announcement.author && ` by ${announcement.author}`}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <BlackButton size="sm" variant="outline">
                                                    Edit
                                                </BlackButton>
                                                {announcement.status === 'draft' && (
                                                    <BlackButton size="sm">
                                                        Publish
                                                    </BlackButton>
                                                )}
                                                <BlackButton size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                                                    Delete
                                                </BlackButton>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                                <p className="text-gray-600">No announcements created yet</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'all-announcements' && canManageAnnouncements && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">All Announcements</h4>
                        <div className="text-center py-8">
                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="text-gray-600">All announcements management coming soon</p>
                        </div>
                    </div>
                )}

                {/* Permissions Display */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                        {canPostAnnouncement && <BlackTag variant="outline">Can Post Announcements</BlackTag>}
                        {canManageAnnouncements && <BlackTag variant="outline">Can Manage All Announcements</BlackTag>}
                    </div>
                </div>
            </ElegantCard>
        </div>
    )
}

export default AnnouncementManagement
