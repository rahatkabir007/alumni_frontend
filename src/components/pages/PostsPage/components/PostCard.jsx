"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import BlackTag from "@/components/common/BlackTag";
import LikeButton from "@/components/common/LikeButton/LikeButton";
import ElegantCard from "@/components/common/ElegantCard";

const PostCard = ({ post, onClick, index = 0 }) => {
    const [imageError, setImageError] = useState({});
    const [showFullText, setShowFullText] = useState(false);
    const [isTextTruncated, setIsTextTruncated] = useState(false);
    const textRef = useRef(null);

    useEffect(() => {
        if (textRef.current) {
            const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight);
            const height = textRef.current.scrollHeight;
            const lines = Math.ceil(height / lineHeight);
            setIsTextTruncated(lines > 3);
        }
    }, [post?.body]); // Ensure dependency is stable

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getInitials = (name) => {
        if (!name) return "A";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const getVisibilityColor = (visibility) => {
        switch (visibility) {
            case "public":
                return "bg-green-100 text-green-800";
            case "alumni_only":
                return "bg-blue-100 text-blue-800";
            case "private":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleReadMore = (e) => {
        e.stopPropagation();
        onClick(post);
    };

    const handleCommentsClick = (e) => {
        e.stopPropagation();
        onClick(post);
    };

    const handleImageError = (index) => {
        setImageError((prev) => ({ ...prev, [index]: true }));
    };

    return (
        <ElegantCard
            className="overflow-hidden w-full max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            {/* Post Header */}
            <div className="p-4 pb-0">
                <div className="flex items-center gap-3 mb-3">
                    {post.user?.profilePhoto ? (
                        <Image
                            src={post.user.profilePhoto}
                            alt={`${post.user.name}'s profile photo`}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                            {getInitials(post.user?.name)}
                        </div>
                    )}
                    <div className="flex-1">
                        <p className="font-medium text-gray-900">{post.user?.name || "Anonymous"}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{formatDate(post.published_at || post.createdAt)}</span>
                            <span>•</span>
                            <BlackTag size="xs" className={getVisibilityColor(post.visibility)}>
                                {post.visibility === "alumni_only"
                                    ? "Alumni Only"
                                    : post.visibility === "public"
                                        ? "Public"
                                        : "Private"}
                            </BlackTag>
                        </div>
                    </div>
                </div>

                {/* Post Title */}
                {post.title && (
                    <h3 className="font-semibold text-xl text-gray-900 mb-3">{post.title}</h3>
                )}

                {/* Post Content with Read More */}
                <div className="mb-3">
                    <div
                        ref={textRef}
                        className={`text-gray-700 text-base leading-relaxed whitespace-pre-wrap ${!showFullText && isTextTruncated ? "line-clamp-3" : ""
                            }`}
                    >
                        {post.body}
                    </div>
                    {isTextTruncated && !showFullText && (
                        <button
                            onClick={handleReadMore}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-1 transition-colors"
                            aria-label="Read more about this post"
                        >
                            Read more...
                        </button>
                    )}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 5).map((tag, index) => (
                            <BlackTag key={index} size="xs" variant="subtle">
                                #{tag}
                            </BlackTag>
                        ))}
                        {post.tags.length > 5 && (
                            <BlackTag size="xs" variant="subtle">
                                +{post.tags.length - 5} more
                            </BlackTag>
                        )}
                    </div>
                )}
            </div>

            {/* Post Images */}
            {post.images && post.images.length > 0 && (
                <div className="relative">
                    {post.images.length === 1 ? (
                        <div className="relative w-full h-96">
                            {imageError[0] ? (
                                <div
                                    className="w-full h-96 bg-gray-200 flex items-center justify-center"
                                    aria-label="Image failed to load"
                                >
                                    <svg
                                        className="w-16 h-16 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            ) : (
                                <Image
                                    src={post.images[0]}
                                    alt={post.title || "Post image"}
                                    fill
                                    className="object-cover cursor-pointer"
                                    onError={() => handleImageError(0)}
                                    onClick={() => onClick(post)}
                                    sizes="(max-width: 768px) 100vw, 600px"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-1 max-h-96 overflow-hidden">
                            {post.images.slice(0, 4).map((image, index) => (
                                <div key={index} className="relative h-48">
                                    {imageError[index] ? (
                                        <div
                                            className="w-full h-48 bg-gray-200 flex items-center justify-center"
                                            aria-label={`Image ${index + 1} failed to load`}
                                        >
                                            <svg
                                                className="w-12 h-12 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                    ) : (
                                        <>
                                            <Image
                                                src={image}
                                                alt={`Post image ${index + 1}`}
                                                fill
                                                className="object-cover cursor-pointer"
                                                onError={() => handleImageError(index)}
                                                onClick={() => onClick(post)}
                                                sizes="(max-width: 768px) 50vw, 300px"
                                            />
                                            {index === 3 && post.images.length > 4 && (
                                                <div
                                                    className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold text-lg cursor-pointer"
                                                    onClick={() => onClick(post)}
                                                    aria-label="View more images"
                                                >
                                                    +{post.images.length - 4} more
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Post Interactions */}
            <div className="p-4">
                {/* Like and Comment counts */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-4">
                        {post.like_count > 0 && (
                            <span>
                                {post.like_count} {post.like_count === 1 ? "like" : "likes"}
                            </span>
                        )}
                    </div>
                    {post.comment_count > 0 && (
                        <button
                            onClick={handleCommentsClick}
                            className="hover:text-gray-700 transition-colors"
                            aria-label="View comments"
                        >
                            {post.comment_count} {post.comment_count === 1 ? "comment" : "comments"}
                        </button>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-6">
                        <LikeButton
                            type="post"
                            id={post.id}
                            initialLikeCount={post.like_count}
                            initialIsLiked={post.isLikedByCurrentUser || false}
                            size="md"
                            showCount={false}
                        />
                        <button
                            onClick={handleCommentsClick}
                            className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
                            aria-label="Comment on this post"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.906-1.239L3 21l1.239-4.906A9.863 9.863 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                                />
                            </svg>
                            <span className="font-medium">Comment</span>
                        </button>
                        <button
                            className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors"
                            aria-label="Share this post"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                />
                            </svg>
                            <span className="font-medium">Share</span>
                        </button>
                    </div>
                </div>
            </div>
        </ElegantCard>
    );
};

export default PostCard;