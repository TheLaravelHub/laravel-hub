import { BookmarkPlus, Github, LifeBuoy, Menu, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import Image from '@/components/image'
import { Link } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

const Navbar = () => {
    const [showNav, setShowNav] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const navRef = useRef<HTMLDivElement>(null)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setShowNav(false)
                setMobileMenuOpen(false)
            } else {
                setShowNav(true)
            }
            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    const navVariants = {
        hidden: { y: -100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 20,
            },
        },
    }

    const linkVariants = {
        hover: {
            scale: 1.05,
            color: 'var(--primary)',
            transition: { type: 'spring', stiffness: 300, damping: 10 },
        },
    }

    const mobileMenuVariants = {
        closed: {
            opacity: 0,
            y: -20,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
        open: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const menuItemVariants = {
        closed: { opacity: 0, y: -10 },
        open: { opacity: 1, y: 0 },
    }

    return (
        <header
            ref={navRef}
            className={`fixed left-0 right-0 top-0 z-50 w-full transition-transform duration-300 ${
                showNav ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            <motion.div
                className="w-full bg-background/80 shadow-sm backdrop-blur-md"
                initial="hidden"
                animate="visible"
                variants={navVariants}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:p-6">
                    <Link
                        href={route('homepage')}
                        className="flex items-center space-x-2"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 10,
                            }}
                        >
                            <Image
                                src={'/assets/images/Indxs-logo.png'}
                                alt="Indxs"
                                width={150}
                            />
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden space-x-6 md:flex">
                        <motion.a
                            href="https://github.com/indxs/indxs"
                            target={'_blank'}
                            className="flex items-center space-x-2 transition-colors hover:text-primary"
                            variants={linkVariants}
                            whileHover="hover"
                        >
                            <Github size={22} /> <span>GitHub</span>
                        </motion.a>
                        <motion.a
                            href="https://github.com/sponsors/thefeqy"
                            target={'_blank'}
                            className="flex items-center space-x-2 transition-colors hover:text-primary"
                            variants={linkVariants}
                            whileHover="hover"
                        >
                            <LifeBuoy size={22} /> <span>Support</span>
                        </motion.a>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Button
                                asChild
                                variant="default"
                                className="flex items-center gap-2"
                            >
                                <a
                                    href="https://github.com/Indxs/indxs/discussions/new?category=package-submission"
                                    target={'_blank'}
                                    className="flex items-center space-x-2"
                                >
                                    <BookmarkPlus size={18} />{' '}
                                    <span>Submit a package</span>
                                </a>
                            </Button>
                        </motion.div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
                        >
                            {mobileMenuOpen ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={mobileMenuVariants}
                        className="absolute left-0 right-0 z-40 w-full bg-background/95 px-6 py-8 shadow-lg backdrop-blur-md md:hidden"
                    >
                        <div className="flex flex-col space-y-6">
                            <motion.a
                                href="https://github.com/indxs/indxs"
                                target={'_blank'}
                                className="flex items-center space-x-4 rounded-lg p-3 hover:bg-gray-100"
                                variants={menuItemVariants}
                            >
                                <Github size={24} /> <span>GitHub</span>
                            </motion.a>
                            <motion.a
                                href="https://github.com/sponsors/thefeqy"
                                target={'_blank'}
                                className="flex items-center space-x-4 rounded-lg p-3 hover:bg-gray-100"
                                variants={menuItemVariants}
                            >
                                <LifeBuoy size={24} /> <span>Support</span>
                            </motion.a>
                            <motion.div variants={menuItemVariants}>
                                <Button
                                    asChild
                                    variant="default"
                                    className="w-full justify-start"
                                >
                                    <a
                                        href="https://github.com/Indxs/indxs/discussions/new?category=package-submission"
                                        target={'_blank'}
                                        className="flex items-center space-x-2"
                                    >
                                        <BookmarkPlus size={18} />{' '}
                                        <span>Submit a package</span>
                                    </a>
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Navbar
