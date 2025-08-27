"use client"
import { useState } from 'react'
import { useDeletePostMutation } from '@/redux/features/posts/postsApi'
import { ToastMessage } from '@/utils/ToastMessage'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import GlobalModal from '@/components/antd/Modal/GlobalModal'
import PostCard from './components/PostCard'
import PostModal from './components/PostModal'
import PostUploadForm from './PostUploadForm'

const PostsGrid = ({ posts, userData, onRefresh, isOwner = false }) => {
    const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()
    const [selectedPost, setSelectedPost] = useState(null)
    const [editingPost, setEditingPost] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const canManagePost = checkUserPermission(userData.roles, PERMISSIONS.MANAGE_POSTS)
    const canEdit = isOwner || canManagePost

    const handleDelete = async (postId) => {
        try {
            await deletePost(postId).unwrap()
            ToastMessage.notifySuccess('Post deleted successfully!')
            setDeleteConfirm(null)
            if (onRefresh) onRefresh()
        } catch (error) {
            console.error('Failed to delete post:', error)
            ToastMessage.notifyError(error.message || 'Failed to delete post')
        }
    }

    const handleEditSuccess = () => {
        setEditingPost(null)
        if (onRefresh) onRefresh()
    }

    if (!posts || posts.length === 0) {
        return (
            <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Posts Yet</h4>
                    <p className="text-gray-600">
                        {isOwner ? "Start creating posts to share with the community" : "No posts available"}
                    </p>
                </div>
            </ElegantCard>
        )
    }

    return (
        <>
            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onEdit={setEditingPost}
                        onDelete={setDeleteConfirm}
                        onView={setSelectedPost}
                        isDeleting={isDeleting}
                        canEdit={canEdit}
                    />
                ))}
            </div>

            {/* View Post Modal */}
            <PostModal
                selectedPost={selectedPost}
                onClose={() => setSelectedPost(null)}
            />

            {/* Edit Post Modal */}
            {editingPost && (
                <GlobalModal
                    isModalOpen={!!editingPost}
                    setModalHandler={() => setEditingPost(null)}
                    title="Edit Post"
                    width={800}
                    closeIcon={true}
                >
                    <div className="p-6">
                        <PostUploadForm
                            editData={editingPost}
                            isEditMode={true}
                            onSuccess={handleEditSuccess}
                            onCancel={() => setEditingPost(null)}
                        />
                    </div>
                </GlobalModal>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <GlobalModal
                    isModalOpen={!!deleteConfirm}
                    setModalHandler={() => setDeleteConfirm(null)}
                    title="Delete Post"
                    width={500}
                    closeIcon={true}
                >
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">Are you sure?</h3>
                                <p className="text-gray-700">
                                    This will permanently delete "{deleteConfirm.title || 'this post'}". This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <BlackButton
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteConfirm(null)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </BlackButton>
                            <BlackButton
                                size="sm"
                                loading={isDeleting}
                                disabled={isDeleting}
                                onClick={() => handleDelete(deleteConfirm.id)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete Post
                            </BlackButton>
                        </div>
                    </div>
                </GlobalModal>
            )}
        </>
    )
}

export default PostsGrid