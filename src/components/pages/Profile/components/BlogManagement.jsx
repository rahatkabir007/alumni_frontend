"use client"
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import BlackTag from '@/components/common/BlackTag'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'

const BlogManagement = ({ userData }) => {
    const canPostBlog = checkUserPermission(userData.roles, PERMISSIONS.POST_BLOG)
    const canApproveBlog = checkUserPermission(userData.roles, PERMISSIONS.APPROVE_BLOG)

    return (
        <div className="space-y-6">
            <ElegantCard>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Blog Management</h3>
                    {canPostBlog && (
                        <BlackButton size="sm">
                            Create New Blog
                        </BlackButton>
                    )}
                </div>

                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Blog Management</h4>
                    <p className="text-gray-600 mb-4">Manage your blog posts and create new content</p>

                    <div className="flex flex-wrap gap-2 justify-center">
                        {canPostBlog && <BlackTag variant="outline">Can Post Blogs</BlackTag>}
                        {canApproveBlog && <BlackTag variant="outline">Can Approve Blogs</BlackTag>}
                    </div>

                    <p className="text-sm text-gray-500 mt-4">This feature is coming soon!</p>
                </div>
            </ElegantCard>
        </div>
    )
}

export default BlogManagement
