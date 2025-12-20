import {
    Github,
    Heart,
    LifeBuoy,
    Twitter,
    Linkedin,
    MessageSquare,
    Facebook,
} from 'lucide-react'
import { SocialAccountsSettings as SocialAccountsSettingsType } from '@/types'
import { motion } from 'framer-motion'
import useClickTracker from '@/hooks/use-analytics'
import { Link, usePage } from '@inertiajs/react'

const Footer = () => {
    const socialAccountsSettings = usePage().props
        .socialAccountsSettings as SocialAccountsSettingsType

    const handleGithubProfileLinkClick = useClickTracker(
        'Github profile link clicked',
        { location: 'Footer' },
    )

    const handleXProfileLinkClick = useClickTracker('X profile link clicked', {
        location: 'Footer',
    })
    const handleSponsorLinkClick = useClickTracker('Github Sponsor Clicked', {
        location: 'Footer',
    })
    const handleLinkedinLinkClick = useClickTracker(
        'Linkedin Profile Clicked',
        {
            location: 'Footer',
        },
    )
    const handleTelegramLinkClick = useClickTracker(
        'Telegram Contact Clicked',
        {
            location: 'Footer',
        },
    )
    const handleReportBugClick = useClickTracker('Report Bug Clicked', {
        location: 'Footer',
    })

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
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

    const socialLinkVariants = {
        hover: {
            y: -5,
            scale: 1.1,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 10,
            },
        },
    }

    const footerLinks = [
        {
            title: 'Community',
            links: [
                { name: 'Home', href: '/' },
                { name: 'Login', href: '/login' },
                { name: 'Register', href: '/register' },
            ],
        },
        {
            title: 'Resources',
            links: [
                { name: 'Blog', href: '/blog' },
                { name: 'Packages', href: '/packages' },
                {
                    name: 'Report Bug',
                    href: 'https://github.com/TheLaravelHub/laravel-hub/issues/new',
                    external: true,
                },
            ],
        },
    ]

    return (
        <footer className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 pt-16">
            {/* Wave divider at top */}
            <div className="absolute -top-1 left-0 w-full rotate-180 overflow-hidden">
                <svg
                    className="relative block w-full"
                    height="40"
                    preserveAspectRatio="none"
                    viewBox="0 0 1200 120"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                        fill="currentColor"
                        className="text-background"
                        opacity=".25"
                    />
                    <path
                        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                        fill="currentColor"
                        className="text-background"
                        opacity=".5"
                    />
                    <path
                        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                        fill="currentColor"
                        className="text-background"
                    />
                </svg>
            </div>

            <motion.div
                className="container mx-auto px-6 pb-12"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                {/* Footer links grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Logo and description */}
                    <motion.div
                        variants={itemVariants}
                        className="col-span-2 mb-12 flex flex-col items-center md:items-start"
                    >
                        <div className="flex items-center">
                            <img
                                src="/assets/images/logo.png"
                                alt="Laravel Hub Logo"
                                className="w-96"
                            />
                        </div>
                        <p className="mt-4 max-w-md text-muted-foreground">
                            Laravel Hub is a platform for Laravel developers to
                            share knowledge, find resources, and connect with
                            the community.
                        </p>
                    </motion.div>
                    {footerLinks.map((column, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                        >
                            <h3 className="mb-4 text-lg font-semibold">
                                {column.title}
                            </h3>
                            <ul className="space-y-2">
                                {column.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        {link.external ? (
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-muted-foreground transition-colors hover:text-primary"
                                                onClick={
                                                    link.name === 'Report Bug'
                                                        ? handleReportBugClick
                                                        : undefined
                                                }
                                            >
                                                {link.name}
                                            </a>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                className="text-muted-foreground transition-colors hover:text-primary"
                                            >
                                                {link.name}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Divider */}
                <motion.div
                    variants={itemVariants}
                    className="my-8 h-px w-full bg-border"
                />

                <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
                    {/* Copyright */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-6 text-center md:text-left"
                    >
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Laravel Hub. All
                            rights reserved.
                        </p>
                    </motion.div>
                    <motion.div
                        variants={itemVariants}
                        className="flex items-center space-x-2"
                    >
                        <span className="text-sm text-muted-foreground">
                            Built with
                        </span>
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: 'loop',
                            }}
                        >
                            <Heart
                                size={16}
                                className="fill-red-500 text-red-500"
                            />
                        </motion.div>
                        <span className="text-sm text-muted-foreground">
                            by
                        </span>
                        <div className="flex items-center space-x-2">
                            <img
                                src="/assets/images/github-avatar.jpg"
                                alt="Muhammed Elfeqy"
                                className="h-6 w-6 rounded-full"
                            />
                            <a
                                href="https://github.com/thefeqy"
                                target="_blank"
                                className="text-sm font-medium"
                            >
                                Muhammed Elfeqy
                            </a>
                        </div>
                    </motion.div>

                    {/* Social links */}
                    <motion.div
                        variants={itemVariants}
                        className="flex space-x-4"
                    >
                        {socialAccountsSettings.github && (
                            <motion.a
                                href={socialAccountsSettings.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm transition-colors hover:text-primary"
                                variants={socialLinkVariants}
                                whileHover="hover"
                                onClick={handleGithubProfileLinkClick}
                            >
                                <Github size={16} />
                            </motion.a>
                        )}
                        {socialAccountsSettings.x && (
                            <motion.a
                                href={socialAccountsSettings.x}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm transition-colors hover:text-primary"
                                variants={socialLinkVariants}
                                whileHover="hover"
                                onClick={handleXProfileLinkClick}
                            >
                                <Twitter size={16} />
                            </motion.a>
                        )}
                        {socialAccountsSettings.facebook && (
                            <motion.a
                                href={socialAccountsSettings.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm transition-colors hover:text-primary"
                                variants={socialLinkVariants}
                                whileHover="hover"
                            >
                                <Facebook size={16} />
                            </motion.a>
                        )}
                        {socialAccountsSettings.telegram && (
                            <motion.a
                                href={socialAccountsSettings.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm transition-colors hover:text-primary"
                                variants={socialLinkVariants}
                                whileHover="hover"
                                onClick={handleTelegramLinkClick}
                            >
                                <MessageSquare size={16} />
                            </motion.a>
                        )}
                        {/*TODO: Add BlueSky link*/}
                        {socialAccountsSettings.linkedin && (
                            <motion.a
                                href={socialAccountsSettings.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm transition-colors hover:text-primary"
                                variants={socialLinkVariants}
                                whileHover="hover"
                                onClick={handleLinkedinLinkClick}
                            >
                                <Linkedin size={16} />
                            </motion.a>
                        )}
                        <motion.a
                            href="https://github.com/sponsors/thefeqy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm transition-colors hover:text-primary"
                            variants={socialLinkVariants}
                            whileHover="hover"
                            onClick={handleSponsorLinkClick}
                        >
                            <LifeBuoy size={16} />
                        </motion.a>
                    </motion.div>
                </div>
            </motion.div>
        </footer>
    )
}

export default Footer
