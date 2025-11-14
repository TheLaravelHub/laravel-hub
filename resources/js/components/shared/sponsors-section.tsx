import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface Sponsor {
    name: string
    logo: string
    url: string
    width?: string
}

const SponsorsSection = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    // Sponsors data - easily add more sponsors here
    const sponsors: Sponsor[] = [
        {
            name: 'Sentry',
            logo: '/assets/images/sentry-wordmark-dark-400x119.png',
            url: 'https://sentry.io/for/laravel?utm_source=laravel-hub&utm_medium=referral&utm_campaign=sponsors',
            width: 'w-48',
        },
        {
            name: 'DigitalOcean',
            logo: 'https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%202.svg',
            url: 'https://www.digitalocean.com/?refcode=1e75445fb83c&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge',
            width: 'w-48',
        },
        {
            name: 'Re-Share',
            logo: 'https://re-share.com/assets/images/logo-light.png',
            url: 'https://re-share.com?utm_source=laravel-hub&utm_medium=referral&utm_campaign=sponsors',
            width: 'w-48',
        },
        // Add more sponsors here in the future
        // {
        //     name: 'Sponsor Name',
        //     logo: '/path/to/logo.png',
        //     url: 'https://sponsor-url.com',
        //     width: 'w-40',
        // },
    ]

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.15,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 200,
                damping: 20,
            },
        },
    }

    return (
        <section className="relative overflow-hidden py-24">
            {/* Animated background orbs */}
            <div className="absolute inset-0">
                <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-primary/5 blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-secondary/5 blur-3xl [animation-delay:2s]"></div>
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }}
            ></div>

            <motion.div
                className="container relative z-10 mx-auto px-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                {/* Header with animated underline */}
                <motion.div
                    className="mb-16 text-center"
                    variants={itemVariants}
                >
                    <div className="relative inline-block">
                        <h2 className="relative text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            Sponsors & Partners
                        </h2>
                        <motion.div
                            className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        ></motion.div>
                    </div>
                </motion.div>

                {/* Sponsors grid */}
                <motion.div
                    className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8"
                    variants={containerVariants}
                >
                    {sponsors.map((sponsor, index) => (
                        <motion.div
                            key={sponsor.name}
                            variants={itemVariants}
                            className="relative w-full sm:w-80"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <a
                                href={sponsor.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative block"
                            >
                                {/* Animated border gradient */}
                                <motion.div
                                    className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary opacity-0 blur transition-opacity duration-500 group-hover:opacity-30"
                                    animate={{
                                        backgroundPosition:
                                            hoveredIndex === index
                                                ? ['0% 0%', '100% 100%']
                                                : '0% 0%',
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatType: 'reverse',
                                    }}
                                ></motion.div>

                                {/* Card content */}
                                <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-2xl border border-border/50 bg-white/80 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-2xl">
                                    {/* Spotlight effect */}
                                    <motion.div
                                        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                        style={{
                                            background:
                                                'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(var(--primary-rgb), 0.1) 0%, transparent 50%)',
                                        }}
                                    ></motion.div>

                                    {/* Shimmer effect */}
                                    <motion.div
                                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full"
                                        transition={{ duration: 1.5 }}
                                    ></motion.div>

                                    {/* Logo */}
                                    <motion.div
                                        className="relative z-10 flex items-center justify-center p-8"
                                        whileHover={{
                                            scale: 1.1,
                                            rotate: [0, -2, 2, -2, 0],
                                        }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 400,
                                            damping: 10,
                                        }}
                                    >
                                        <img
                                            src={sponsor.logo}
                                            alt={sponsor.name}
                                            className={`h-auto ${sponsor.width || 'w-40'} max-w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0`}
                                        />
                                    </motion.div>

                                    {/* Floating particles effect */}
                                    {hoveredIndex === index && (
                                        <>
                                            {[...Array(6)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute h-1 w-1 rounded-full bg-primary/30"
                                                    initial={{
                                                        x: '50%',
                                                        y: '50%',
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        x: `${Math.random() * 100}%`,
                                                        y: `${Math.random() * 100}%`,
                                                        opacity: [0, 1, 0],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: i * 0.2,
                                                    }}
                                                ></motion.div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </a>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Decorative line at bottom */}
                <motion.div
                    className="mx-auto mt-16 h-px w-3/4 bg-gradient-to-r from-transparent via-border to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                ></motion.div>
            </motion.div>
        </section>
    )
}

export default SponsorsSection
