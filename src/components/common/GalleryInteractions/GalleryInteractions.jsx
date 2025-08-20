"use client"
import { useState } from 'react'
import LikeButton from '../LikeButton/LikeButton'
import CommentsList from '../Comments/CommentsList'
import GlobalModal from '@/components/antd/Modal/GlobalModal'

const GalleryInteractions = ({ gallery, showInline = false }) => {
    const [showComments, setShowComments] = useState(false)

    // if (showInline) {
    //     return (
    //         <div className="space-y-4">
    //             {/* Quick Actions */}
    //             <div className="flex items-center justify-between">
    //                 <div className="flex items-center gap-4">
    //                     <LikeButton
    //                         type="gallery"
    //                         id={gallery.id}
    //                         initialLikeCount={gallery.like_count}
    //                         initialIsLiked={gallery.isLikedByCurrentUser || false}
    //                         showCount={true}
    //                     />
    //                     <button
    //                         // onClick={() => setShowComments(!showComments)}
    //                         className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
    //                     >
    //                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.906-1.239L3 21l1.239-4.906A9.863 9.863 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
    //                         </svg>
    //                         <span className="text-sm font-medium">{gallery.comment_count || 0}</span>
    //                     </button>
    //                 </div>
    //             </div>

    //             {/* Comments Section */}
    //             {showComments && (
    //                 <CommentsList
    //                     type="gallery"
    //                     id={gallery.id}
    //                     title="Comments"
    //                 />
    //             )}
    //         </div>
    //     )
    // }

    return (
        <>
            {/* Action Buttons */}
            <div className="flex items-center gap-4">
                <LikeButton
                    type="gallery"
                    id={gallery.id}
                    initialLikeCount={gallery.like_count}
                    initialIsLiked={gallery.isLikedByCurrentUser || false}
                    showCount={true}
                />
                <button
                    onClick={() => setShowComments(true)}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.906-1.239L3 21l1.239-4.906A9.863 9.863 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                    </svg>
                    <span className="text-sm font-medium">
                        {gallery.comment_count || 0}
                    </span>
                </button>
            </div>

            {/* Comments Modal */}
            {/* {showComments && (
                <GlobalModal
                    isModalOpen={showComments}
                    setModalHandler={() => setShowComments(false)}
                    title={`${gallery.title || 'Gallery Image'}`}
                    width={700}
                    closeIcon={true}
                >
                    <div className="p-6">
                        <CommentsList
                            type="gallery"
                            id={gallery.id}
                            title="Comments"
                        />
                    </div>
                </GlobalModal>
            )} */}
        </>
    )
}

export default GalleryInteractions
