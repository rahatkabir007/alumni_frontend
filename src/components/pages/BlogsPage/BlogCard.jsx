import BlackButton from "@/components/common/BlackButton"
import BlackTag from "@/components/common/BlackTag"
import ElegantCard from "@/components/common/ElegantCard"
import Link from "next/link"

const BlogCard = ({
    blog
}) => {
    return (
        <ElegantCard key={blog.id} className="overflow-hidden group cursor-pointer">
            <div className="relative">
                <div
                    className="h-48 bg-gradient-to-br from-blue-400 to-purple-400"
                    style={{
                        backgroundImage: `url(${blog.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <BlackTag className="absolute top-4 right-4" size="xs">
                    {blog.category}
                </BlackTag>
                <div className="absolute bottom-4 left-4">
                    <BlackTag variant="subtle" size="xs" className="bg-white text-black">
                        {blog.readTime}
                    </BlackTag>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                </h3>

                <div className="flex items-center mb-3">
                    <div
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 mr-3"
                        style={{
                            backgroundImage: `url(${blog.authorImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                    <div>
                        <p className="text-sm font-medium text-gray-900">{blog.author}</p>
                        <p className="text-xs text-gray-500">{blog.date}</p>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                    {blog.tags.slice(0, 2).map((tag, index) => (
                        <BlackTag key={index} variant="outline" size="xs">
                            {tag}
                        </BlackTag>
                    ))}
                    {blog.tags.length > 2 && (
                        <BlackTag variant="subtle" size="xs">
                            +{blog.tags.length - 2}
                        </BlackTag>
                    )}
                </div>

                <Link href={`/blogs/${blog.id}`}>
                    <BlackButton
                        size="sm"
                        variant="outline"
                        className="w-full"
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        }
                    >
                        Read Article
                    </BlackButton>
                </Link>
            </div>
        </ElegantCard>
    )
}

export default BlogCard