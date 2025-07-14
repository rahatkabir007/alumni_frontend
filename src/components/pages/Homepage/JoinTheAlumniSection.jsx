import { FloatingElements, ScrollReveal } from "@/components/animations"
import { motion } from 'framer-motion'

const JoinTheAlumniSection = ({
    isAuthenticated
}) => {
    return (
        <ScrollReveal direction="up" delay={0.3}>
            <section className="py-12 sm:py-16 bg-black text-white relative">
                <FloatingElements count={5} />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <ScrollReveal direction="scale" delay={0.1}>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-4">
                            Join the CIHS Alumni Community
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal direction="fade" delay={0.2}>
                        <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-300 px-4">
                            Connect with fellow alumni, share your success stories, and give back to your alma mater.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.3}>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                            {!isAuthenticated ? (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.push('/register')}
                                        className="bg-white text-black px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-100 transition-colors w-full sm:w-auto"
                                    >
                                        Join Alumni Network
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.push('/login')}
                                        className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-white hover:text-black transition-colors w-full sm:w-auto"
                                    >
                                        Sign In
                                    </motion.button>
                                </>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.push('/profile')}
                                    className="bg-white text-black px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-100 transition-colors w-full sm:w-auto max-w-xs"
                                >
                                    Go to Profile
                                </motion.button>
                            )}
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </ScrollReveal>
    )
}

export default JoinTheAlumniSection