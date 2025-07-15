import React, { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ExternalLink, Star, Search, X, Sparkles } from 'lucide-react'
import Navbar from '@/components/shared/navbar'
import { Head, Link, router } from '@inertiajs/react'
import { Category, MetaType, Package as PackageType } from '@/types'
import { Badge } from '@/components/ui/badge'
import Footer from '@/components/shared/footer'
import { formatNumber } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import AppHead from '@/components/shared/AppHead'
import { PaginationControl } from '@/components/shared/pagination-control'
import FloatingElement from '@/components/ui/floating-element'

interface PackagesProps {
    categories: { data: Category[] }
    packages: {
        data: PackageType[]
        meta: MetaType
    }
    filters: {
        search: string
        category?: string
    }
}

export default function Packages({
    categories,
    packages,
    filters,
}: PackagesProps) {
    const appURL = import.meta.env.VITE_APP_URL || 'https://indxs.dev'
    const [searchQuery, setSearchQuery] = useState(filters.search)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const [activeCategory, setActiveCategory] = useState(filters.category)
    const [isLoading, setIsLoading] = useState(false)

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const cardVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15,
            },
        },
        hover: {
            y: -10,
            boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 10,
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

    const categoryVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: (i: number) => ({
            scale: 1,
            opacity: 1,
            transition: {
                delay: i * 0.05,
                type: 'spring',
                stiffness: 100,
            },
        }),
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const params: Record<string, any> = {}
        if (searchQuery) params.search = searchQuery
        if (activeCategory) params.category = activeCategory

        router.get(route('packages.index'), params, {
            preserveState: true,
            onSuccess: () => {
                setIsLoading(false)
            },
            onError: () => {
                setIsLoading(false)
            },
        })
    }

    const handlePageChange = (page: number) => {
        setIsLoading(true)
        const params: Record<string, any> = { page }
        if (searchQuery) params.search = searchQuery
        if (activeCategory) params.category = activeCategory

        router.get(route('packages.index'), params, {
            preserveState: true,
            onSuccess: () => {
                setIsLoading(false)
            },
            onError: () => {
                setIsLoading(false)
            },
        })
    }

    const handleCategoryClick = (categorySlug: string) => {
        // If the category is already active, remove the filter
        const newCategory =
            categorySlug === activeCategory ? undefined : categorySlug

        setIsLoading(true)
        const params: Record<string, any> = {}
        if (searchQuery) params.search = searchQuery
        if (newCategory) params.category = newCategory

        router.get(route('packages.index'), params, {
            onSuccess: () => {
                setActiveCategory(newCategory)
                setIsLoading(false)
            },
            onError: () => {
                setIsLoading(false)
            },
        })
    }

    const clearFilters = () => {
        setSearchQuery('')
        setActiveCategory(undefined)
        setIsLoading(true)
        router.get(
            route('packages.index'),
            {},
            {
                preserveState: true,
                onSuccess: () => {
                    setIsLoading(false)
                },
                onError: () => {
                    setIsLoading(false)
                },
            },
        )
    }

    const clearSearch = () => {
        setSearchQuery('')
        if (searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }

    return (
        <AnimatedGradientBackground className="min-h-screen">
            <AppHead title="Packages">
                <meta
                    name="description"
                    content="Browse and search through our collection of packages and libraries for developers."
                />
                <meta
                    property="og:title"
                    content="Packages - Indxs"
                />
                <meta
                    property="og:description"
                    content="Browse and search through our collection of packages and libraries for developers."
                />
                <meta
                    property="og:image"
                    content={`${appURL}/assets/images/og-image.png`}
                />
                <meta
                    property="og:url"
                    content={`${appURL}/packages`}
                />
            </AppHead>

            <div className="relative flex min-h-screen flex-col text-gray-900">
                {/* Navbar */}
                <Navbar />

                {/* Header Section - Styled like hero-section */}
                <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pb-16 pt-32 lg:pb-20 lg:pt-40">
                    {/* Decorative elements */}
                    <motion.div
                        className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
                        animate={{
                            x: [0, 30, 0],
                            y: [0, 40, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                    />
                    <motion.div
                        className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-secondary/5 blur-3xl"
                        animate={{
                            x: [0, -40, 0],
                            y: [0, 30, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                    />

                    <motion.div
                        className="container mx-auto px-6 text-center"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="relative inline-block"
                        >
                            <FloatingElement
                                className="absolute -top-8 right-3 text-primary md:-right-8"
                                duration={3}
                                distance={10}
                            >
                                <Sparkles size={24} />
                            </FloatingElement>
                            <motion.h2 className="bg-gradient-to-r from-primary to-secondary bg-clip-text p-2 text-4xl font-extrabold text-transparent sm:text-5xl lg:text-6xl">
                                Explore All Packages
                            </motion.h2>
                        </motion.div>

                        <motion.p
                            className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground"
                            variants={itemVariants}
                        >
                            Browse and search through our collection of packages
                            and libraries
                        </motion.p>

                        {/* Categories */}
                        {categories.data.length > 0 && (
                            <motion.div
                                className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-3"
                                variants={containerVariants}
                            >
                                {categories.data.map((category, i) => (
                                    <motion.span
                                        key={category.id}
                                        custom={i}
                                        variants={categoryVariants}
                                        whileHover={{
                                            scale: 1.05,
                                            backgroundColor: 'var(--primary)',
                                            color: 'var(--secondary)',
                                            transition: {
                                                type: 'spring',
                                                stiffness: 300,
                                                damping: 10,
                                            },
                                        }}
                                        onClick={() =>
                                            handleCategoryClick(category.slug)
                                        }
                                        className={`cursor-pointer rounded-full ${
                                            activeCategory === category.slug
                                                ? 'bg-primary text-white'
                                                : 'bg-primary/10 text-primary hover:bg-primary-foreground hover:text-primary'
                                        } px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200`}
                                    >
                                        {category.name} (
                                        {category.packages_count})
                                    </motion.span>
                                ))}
                            </motion.div>
                        )}

                        {/* Search Bar */}
                        <motion.div
                            className="mx-auto mt-10 w-full max-w-3xl"
                            variants={itemVariants}
                        >
                            <form onSubmit={handleSearch}>
                                <motion.div
                                    className="group relative flex h-16 w-full items-center overflow-hidden rounded-full bg-card px-6 shadow-lg transition-all focus-within:shadow-xl"
                                    whileHover={{
                                        boxShadow:
                                            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Search
                                        className="text-muted-foreground transition-colors group-focus-within:text-primary"
                                        size={24}
                                    />
                                    <Input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search packages..."
                                        className="h-full w-full !border-none bg-transparent pl-4 text-lg !outline-none !ring-0 hover:!border-none hover:!outline-none hover:!ring-0 focus:!border-none focus:!outline-none focus:!ring-0 active:!ring-0"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                    <AnimatePresence>
                                        {searchQuery && (
                                            <motion.button
                                                type="button"
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.8,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.8,
                                                }}
                                                className="mr-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                onClick={clearSearch}
                                            >
                                                <X size={18} />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                    {isLoading ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="mr-2"
                                        >
                                            <span className="loading loading-spinner text-primary"></span>
                                        </motion.div>
                                    ) : (
                                        <Button
                                            type="submit"
                                            className="ml-2 rounded-full bg-primary px-4 py-2 text-white hover:bg-primary/90"
                                            size="sm"
                                        >
                                            Search
                                        </Button>
                                    )}
                                </motion.div>
                            </form>
                        </motion.div>

                        {/* Active Filters */}
                        {(activeCategory || filters.search) && (
                            <motion.div
                                className="mt-6 flex items-center justify-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.35, duration: 0.5 }}
                            >
                                <div className="text-sm text-muted-foreground">
                                    Active filters:
                                </div>
                                {activeCategory && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-primary/10 text-primary hover:bg-primary-foreground hover:text-primary"
                                    >
                                        Category:{' '}
                                        {
                                            categories.data.find(
                                                (c) =>
                                                    c.slug === activeCategory,
                                            )?.name
                                        }
                                        <button
                                            className="ml-2 text-xs opacity-70 hover:opacity-100"
                                            onClick={() =>
                                                handleCategoryClick(
                                                    activeCategory,
                                                )
                                            }
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                )}
                                {filters.search && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-primary/10 text-primary hover:bg-primary-foreground hover:text-primary"
                                    >
                                        Search: {filters.search}
                                        <button
                                            className="ml-2 text-xs opacity-70 hover:opacity-100"
                                            onClick={() => {
                                                setSearchQuery('')
                                                router.get(
                                                    route('packages.index'),
                                                    {
                                                        category:
                                                            activeCategory,
                                                    },
                                                    { preserveState: true },
                                                )
                                            }}
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                    Clear all
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Wave divider */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                        <svg
                            className="relative block w-full"
                            height="40"
                            preserveAspectRatio="none"
                            viewBox="0 0 1200 120"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                                fill="#ffffff"
                                opacity=".25"
                            />
                            <path
                                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                                fill="#ffffff"
                                opacity=".5"
                            />
                            <path
                                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                                fill="#ffffff"
                            />
                        </svg>
                    </div>
                </section>

                {/* Packages Grid */}
                <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-8">
                    {packages.data.length > 0 ? (
                        <>
                            <motion.div
                                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {packages.data.map((pkg, index) => (
                                    <motion.div
                                        key={pkg.id}
                                        variants={cardVariants}
                                        whileHover="hover"
                                        layout
                                    >
                                        <Card className="flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm transition-all">
                                            <CardContent className="flex flex-1 flex-col items-start space-y-4 p-6">
                                                <div className="flex w-full items-center justify-between">
                                                    <div className="flex flex-shrink-0 items-center">
                                                        <Link
                                                            href={route(
                                                                'packages.show',
                                                                {
                                                                    slug: pkg.slug,
                                                                },
                                                            )}
                                                        >
                                                            <motion.img
                                                                src={
                                                                    pkg.owner_avatar as string
                                                                }
                                                                alt={pkg.owner}
                                                                className="h-14 w-14 rounded-full border-2 border-primary/20"
                                                                initial={{
                                                                    scale: 0.8,
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    scale: 1,
                                                                    opacity: 1,
                                                                }}
                                                                transition={{
                                                                    delay:
                                                                        index *
                                                                        0.05,
                                                                }}
                                                            />
                                                        </Link>
                                                        <div className="ml-4">
                                                            <Link
                                                                href={route(
                                                                    'packages.show',
                                                                    {
                                                                        slug: pkg.slug,
                                                                    },
                                                                )}
                                                            >
                                                                <div className="group flex items-center gap-2 text-xl font-semibold text-primary transition-colors hover:text-primary/80">
                                                                    {pkg.name}
                                                                    <ExternalLink
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="opacity-0 transition-opacity group-hover:opacity-100"
                                                                    />
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {pkg.owner}
                                                                </p>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                                {pkg.description && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {pkg.description
                                                            .length > 120 ? (
                                                            <>
                                                                {pkg.description.substring(
                                                                    0,
                                                                    120,
                                                                )}
                                                                ...
                                                            </>
                                                        ) : (
                                                            pkg.description
                                                        )}
                                                    </p>
                                                )}
                                                <div className="flex-1"></div>
                                            </CardContent>
                                            <CardFooter className="mt-auto flex flex-wrap justify-between gap-2 border-t border-border/50 bg-muted/30 p-4">
                                                <div className="flex gap-2">
                                                    {pkg.categories.map(
                                                        (category) => (
                                                            <Badge
                                                                key={
                                                                    category.id
                                                                }
                                                                variant={
                                                                    activeCategory ===
                                                                    category.slug
                                                                        ? 'default'
                                                                        : 'secondary'
                                                                }
                                                                className={`${
                                                                    activeCategory ===
                                                                    category.slug
                                                                        ? 'bg-primary text-white'
                                                                        : 'bg-primary/10 text-primary hover:bg-primary-foreground hover:text-primary'
                                                                } cursor-pointer`}
                                                                onClick={() =>
                                                                    handleCategoryClick(
                                                                        category.slug,
                                                                    )
                                                                }
                                                            >
                                                                {category.name}
                                                            </Badge>
                                                        ),
                                                    )}
                                                </div>
                                                <motion.div
                                                    className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    <Star
                                                        size={16}
                                                        className="fill-current"
                                                    />
                                                    <span className="text-sm font-medium">
                                                        {formatNumber(
                                                            pkg.stars,
                                                        )}
                                                    </span>
                                                </motion.div>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Pagination */}
                            {packages.meta.last_page > 1 && (
                                <div className="mt-12 flex justify-center">
                                    <PaginationControl
                                        currentPage={packages.meta.current_page}
                                        totalPages={packages.meta.last_page}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-lg text-muted-foreground">
                                No packages found. Try a different search term
                                or category.
                            </p>
                            {(activeCategory || filters.search) && (
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={clearFilters}
                                >
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    )}
                </section>

                {/* Footer */}
                <Footer />
            </div>
        </AnimatedGradientBackground>
    )
}
