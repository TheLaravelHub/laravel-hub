import React from 'react'
import { motion } from 'framer-motion'
import { BookmarkPlus, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useClickTracker from '@/hooks/use-click-tracker'

const CTASection = () => {
    const handleStarOnGithubClick = useClickTracker('Star on github', {
        location: 'Homepage',
    })
    const handlePackageSubmissionLinkClick = useClickTracker(
        'Package Submission Clicked',
        { location: 'Homepage' },
    )

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
            },
        },
    }

    return (
        <section className="relative overflow-hidden py-20">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>

            {/* Decorative circles */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"></div>

            <motion.div
                className="container relative z-10 mx-auto px-6 text-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.h2
                    className="text-3xl font-bold md:text-4xl"
                    variants={itemVariants}
                >
                    Join Our Open-Source Community
                </motion.h2>

                <motion.p
                    className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
                    variants={itemVariants}
                >
                    Contribute to the project, submit your packages, or help us
                    improve the platform.
                </motion.p>

                <motion.div
                    className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
                    variants={itemVariants}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            asChild
                            variant="default"
                            size="lg"
                            className="flex items-center gap-2"
                        >
                            <a
                                href="https://github.com/Indxs/indxs/discussions/new?category=package-submission"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handlePackageSubmissionLinkClick}
                            >
                                <BookmarkPlus size={18} />
                                <span>Submit a Package</span>
                            </a>
                        </Button>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="flex items-center gap-2"
                        >
                            <a
                                href="https://github.com/indxs/indxs"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleStarOnGithubClick}
                            >
                                <Github size={18} />
                                <span>Star on GitHub</span>
                            </a>
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    )
}

export default CTASection
