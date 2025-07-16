"use client"
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'

const EventManagement = ({ userData }) => {
    const canJoinEvent = checkUserPermission(userData.roles, PERMISSIONS.JOIN_EVENT)
    const canCreateEvent = checkUserPermission(userData.roles, PERMISSIONS.CREATE_EVENT)
    const canManageEvent = checkUserPermission(userData.roles, PERMISSIONS.MANAGE_EVENT)

    return (
        <div className="space-y-6">
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Event Management</h3>
                    {canCreateEvent && (
                        <BlackButton size="sm">
                            Create New Event
                        </BlackButton>
                    )}
                </div>

                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Event Management</h4>
                    <p className="text-gray-600 mb-4">Manage events, view your registrations, and create new events</p>

                    <div className="flex flex-wrap gap-2 justify-center">
                        {canJoinEvent && <BlackTag variant="outline">Can Join Events</BlackTag>}
                        {canCreateEvent && <BlackTag variant="outline">Can Create Events</BlackTag>}
                        {canManageEvent && <BlackTag variant="outline">Can Manage Events</BlackTag>}
                    </div>

                    <p className="text-sm text-gray-500 mt-4">This feature is coming soon!</p>
                </div>
            </ElegantCard>
        </div>
    )
}

export default EventManagement
