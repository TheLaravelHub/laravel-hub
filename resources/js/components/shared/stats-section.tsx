import React from 'react'
import { motion } from 'framer-motion'
import { LibraryBig, Package, Star } from 'lucide-react'

interface StatsProps {
    totalPackages?: number
    totalStars?: number
    totalCategories?: number
    compact?: boolean
}

const StatsSection = ({
    totalPackages,
    totalStars,
    totalCategories,
    compact = false,
}: StatsProps) => {
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

    const stats = [
        {
            icon: <Package className={compact ? 'h-6 w-6' : 'h-8 w-8'} />,
            value: totalPackages,
            label: 'Packages',
            color: 'from-blue-500 to-cyan-400',
        },
        {
            icon: <Star className={compact ? 'h-6 w-6' : 'h-8 w-8'} />,
            value: totalStars,
            label: 'GitHub Stars',
            color: 'from-amber-500 to-yellow-400',
        },
        {
            icon: <LibraryBig className={compact ? 'h-6 w-6' : 'h-8 w-8'} />,
            value: totalCategories,
            label: 'Categories',
            color: 'from-green-500 to-emerald-400',
        },
    ]

    return (
        <section className={`${compact ? 'py-6' : 'py-16'} bg-muted/10`}>
            <motion.div
                className="container mx-auto px-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                {!compact && (
                    <motion.h2
                        className="mb-12 text-center text-3xl font-bold"
                        variants={itemVariants}
                    >
                        Trusted by Developers Worldwide
                    </motion.h2>
                )}

                <div className="grid grid-cols-3 gap-3 md:gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className={`flex flex-col items-center rounded-xl ${compact ? 'p-3 md:p-4' : 'p-6 md:p-8'} bg-card text-center shadow-md`}
                        >
                            <div
                                className={`mb-2 rounded-full bg-gradient-to-r ${stat.color} ${compact ? 'p-2' : 'p-4'} text-white`}
                            >
                                {stat.icon}
                            </div>
                            <motion.span
                                className={
                                    compact
                                        ? 'text-xl font-bold md:text-2xl'
                                        : 'text-3xl font-bold md:text-4xl'
                                }
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{
                                    opacity: 1,
                                    scale: 1,
                                    transition: {
                                        duration: 0.5,
                                        delay: 0.2 + index * 0.1,
                                    },
                                }}
                                viewport={{ once: true }}
                            >
                                {stat.value.toLocaleString()}
                            </motion.span>
                            <span
                                className={`mt-1 text-muted-foreground ${compact ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`}
                            >
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}

export default StatsSection
