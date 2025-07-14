import { ScrollReveal } from "@/components/animations"
import BlackButton from "@/components/common/BlackButton"
import BlackTag from "@/components/common/BlackTag"
import ElegantCard from "@/components/common/ElegantCard"
import { announcements, blogs } from "@/datas/homepage"
import { useRouter } from "next/navigation"

const AnnouncementsAndBlogsSection = ({

}) => {
    const router = useRouter()

    return (
        <ScrollReveal direction="up" delay={0.2}>
            <section className="py-12 sm:py-16 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Announcements */}
                        <ScrollReveal direction="left" delay={0.3}>
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
                                    <BlackTag>Latest</BlackTag>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Announcements</h3>
                                </div>
                                <div className="space-y-3 sm:space-y-4">
                                    {announcements?.map((announcement, index) => (
                                        <ElegantCard key={index} padding="md" className="hover:shadow-lg">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                                                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{announcement.title}</h4>
                                                <BlackTag size="xs" className="self-start">{announcement.type}</BlackTag>
                                            </div>
                                            <p className="text-xs sm:text-sm text-blue-600 mb-2">{announcement.date}</p>
                                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{announcement.description}</p>
                                        </ElegantCard>
                                    ))}
                                </div>
                                <div className="mt-4 sm:mt-6">
                                    <BlackButton
                                        variant="outline"
                                        onClick={() => router.push('/events')}
                                        className="w-full sm:w-auto"
                                        icon={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        }
                                    >
                                        View All Events
                                    </BlackButton>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Latest Blogs */}
                        <ScrollReveal direction="right" delay={0.3}>
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
                                    <BlackTag>Featured</BlackTag>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Blog Posts</h3>
                                </div>
                                <div className="space-y-3 sm:space-y-4">
                                    {blogs.map((blog, index) => (
                                        <ElegantCard key={index} padding="md" className="hover:shadow-lg">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                                                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{blog.title}</h4>
                                                <BlackTag size="xs" className="self-start">{blog.category}</BlackTag>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm text-gray-500 mb-2 gap-1">
                                                <span>By {blog.author}</span>
                                                <span>{blog.date}</span>
                                            </div>
                                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{blog.excerpt}</p>
                                        </ElegantCard>
                                    ))}
                                </div>
                                <div className="mt-4 sm:mt-6">
                                    <BlackButton
                                        variant="outline"
                                        onClick={() => router.push('/blogs')}
                                        className="w-full sm:w-auto"
                                        icon={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        }
                                    >
                                        Read All Blogs
                                    </BlackButton>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>
        </ScrollReveal>
    )
}

export default AnnouncementsAndBlogsSection