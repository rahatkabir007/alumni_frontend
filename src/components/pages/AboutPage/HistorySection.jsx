import { ScrollReveal } from "@/components/animations"
import BlackButton from "@/components/common/BlackButton"
import BlackTag from "@/components/common/BlackTag"
import ElegantCard from "@/components/common/ElegantCard"

const HistorySection = ({

}) => {
    return (
        <ScrollReveal direction="up" delay={0.3}>
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <ScrollReveal direction="left" delay={0.3}>
                            <div>
                                <BlackTag className="mb-4">Our History</BlackTag>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">A Legacy of Excellence</h2>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Founded in 1998, Chittagong Ideal High School began as a vision to provide
                                    quality education to the children of Chittagong. What started as a small
                                    institution has grown into one of the most prestigious schools in the region.
                                </p>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Our school has consistently maintained its reputation for academic excellence,
                                    moral values, and character development. We have produced doctors, engineers,
                                    teachers, business leaders, and public servants who are making their mark
                                    around the world.
                                </p>
                                <BlackButton variant="outline">
                                    Read Full History
                                </BlackButton>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="right" delay={0.4}>
                            <ElegantCard className="relative">
                                <div
                                    className="h-64 rounded-lg bg-gradient-to-br from-blue-400 to-green-400"
                                    style={{
                                        backgroundImage: 'url(/images/cihs-historical.jpg)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                />
                            </ElegantCard>
                        </ScrollReveal>
                    </div>
                </div>
            </section>
        </ScrollReveal>
    )
}

export default HistorySection