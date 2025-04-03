import React from 'react'
import { Head, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import {
    Calendar,
    ChevronRight,
    Tag,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
} from 'lucide-react'
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background'
import Navbar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BlogPost, Category, MetaType, LinkType } from '@/types'
import { format } from 'date-fns'
import AppHead from '@/components/shared/AppHead'
import { Button } from '@/components/ui/button'

interface BlogProps {
    blogPosts: {
        data: BlogPost[]
        meta: MetaType
        links?: {
            first: string
            last: string
            prev: string | null
            next: string | null
        }
    }
}

const Blog = ({ blogPosts }: BlogProps) => {
    const appURL = import.meta.env.VITE_APP_URL || 'https://indxs.dev'
    // Ensure we have valid data
    const posts = blogPosts?.data || []
    const meta = blogPosts?.meta || { current_page: 1, last_page: 1 }

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
                damping: 15,
            },
        },
    }

    // Generate pagination array
    const generatePaginationArray = (currentPage: number, lastPage: number) => {
        const delta = 2 // Number of pages to show before and after current page
        const range = []
        const rangeWithDots = []
        let l

        for (let i = 1; i <= lastPage; i++) {
            if (
                i === 1 ||
                i === lastPage ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i)
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1)
                } else if (i - l !== 1) {
                    rangeWithDots.push('...')
                }
            }
            rangeWithDots.push(i)
            l = i
        }

        return rangeWithDots
    }

    const paginationArray = generatePaginationArray(
        meta.current_page,
        meta.last_page,
    )

    return (
        <AnimatedGradientBackground>
            <AppHead title="Latest Articles - Indxs Blog">
                {/* Meta Description */}
                <meta
                    name="description"
                    content="Stay up to date with the latest news, trends, and insights from the Laravel ecosystem, web development, and open-source software."
                />

                {/* Keywords */}
                <meta
                    name="keywords"
                    content="Laravel, PHP, React, InertiaJS, web development, open source, programming, tech blogs, tutorials"
                />

                {/* Open Graph (Facebook, LinkedIn, etc.) */}
                <meta
                    property="og:title"
                    content="Latest Articles - Indxs Blog"
                />
                <meta
                    property="og:description"
                    content="Discover the latest articles and insights on Laravel, PHP, React, and open-source development."
                />
                <meta
                    property="og:image"
                    content={`${appURL}/assets/images/og-image.png`}
                />
                <meta
                    property="og:url"
                    content={`${appURL}/blog`}
                />
                <meta
                    property="og:type"
                    content="website"
                />
                <meta
                    property="og:site_name"
                    content="Indxs Blog"
                />

                {/* Twitter Meta Tags */}
                <meta
                    name="twitter:card"
                    content="summary_large_image"
                />
                <meta
                    name="twitter:title"
                    content="Latest Articles - Indxs Blog"
                />
                <meta
                    name="twitter:description"
                    content="Stay up to date with the latest news, tutorials, and trends from the Laravel ecosystem and web development world."
                />
                <meta
                    name="twitter:image"
                    content={`${appURL}/assets/images/og-image.png`}
                />
                <meta
                    name="twitter:site"
                    content="@IndxsDev"
                />

                {/* Canonical URL */}
                <link
                    rel="canonical"
                    href={`${appURL}/blog`}
                />

                {/* JSON-LD Structured Data for SEO */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Blog',
                        name: 'Indxs Blog',
                        description:
                            'A blog covering Laravel, PHP, React, InertiaJS, and open-source development.',
                        publisher: {
                            '@type': 'Organization',
                            name: 'Indxs',
                            logo: {
                                '@type': 'ImageObject',
                                url: `${appURL}/assets/images/Indxs-logo.png`,
                            },
                        },
                        url: `${appURL}/blog`,
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': `${appURL}/blog`,
                        },
                    })}
                </script>
            </AppHead>

            <div className="min-h-screen">
                <Navbar />

                <main className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <motion.h1
                            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Latest Articles
                        </motion.h1>
                        <motion.p
                            className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Stay up to date with the latest news and updates
                            from the Laravel ecosystem
                        </motion.p>
                    </div>

                    {posts.length > 0 ? (
                        <motion.div
                            className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {posts.map((post) => (
                                <motion.div
                                    key={post.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                >
                                    <Card className="group h-full overflow-hidden">
                                        <Link
                                            href={route('blog.show', {
                                                slug: post.slug,
                                            })}
                                        >
                                            {post.image && (
                                                <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                </div>
                                            )}
                                        </Link>

                                        <div className="p-6">
                                            {post.categories &&
                                                post.categories.length > 0 && (
                                                    <div className="mb-4 flex flex-wrap gap-2">
                                                        {post.categories.map(
                                                            (
                                                                category: Category,
                                                            ) => (
                                                                <Badge
                                                                    key={
                                                                        category.id
                                                                    }
                                                                    variant="secondary"
                                                                    className="bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                                                >
                                                                    <Tag
                                                                        size={
                                                                            12
                                                                        }
                                                                        className="mr-1"
                                                                    />
                                                                    {
                                                                        category.name
                                                                    }
                                                                </Badge>
                                                            ),
                                                        )}
                                                    </div>
                                                )}

                                            <Link
                                                href={route('blog.show', {
                                                    slug: post.slug,
                                                })}
                                                className="group"
                                            >
                                                <h2 className="mb-2 text-xl font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-primary">
                                                    {post.title}
                                                </h2>
                                            </Link>

                                            {post.sub_title && (
                                                <p className="mb-4 text-gray-600">
                                                    {post.sub_title}
                                                </p>
                                            )}

                                            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <Calendar
                                                        size={14}
                                                        className="mr-1"
                                                    />
                                                    {format(
                                                        new Date(
                                                            post.published_at,
                                                        ),
                                                        'MMM d, yyyy',
                                                    )}
                                                </div>
                                                <Link
                                                    href={route('blog.show', {
                                                        slug: post.slug,
                                                    })}
                                                    className="flex items-center font-medium text-primary transition-colors hover:text-primary/80"
                                                >
                                                    Read more
                                                    <ChevronRight
                                                        size={16}
                                                        className="ml-1"
                                                    />
                                                </Link>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            className="flex flex-col items-center justify-center py-16 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <p className="text-xl text-muted-foreground">
                                No blog posts found.
                            </p>
                            <p className="mt-2 text-muted-foreground">
                                Check back later for new articles.
                            </p>
                        </motion.div>
                    )}

                    {meta.last_page > 1 && (
                        <div className="mt-12 flex justify-center">
                            <nav
                                className="flex items-center justify-center space-x-2"
                                aria-label="Pagination"
                            >
                                {/* Previous Page Button */}
                                <Link
                                    href={
                                        meta.current_page > 1
                                            ? route('blog.index', {
                                                  page: meta.current_page - 1,
                                              })
                                            : '#'
                                    }
                                    className={`inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                        meta.current_page === 1
                                            ? 'cursor-not-allowed text-gray-300'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    aria-disabled={meta.current_page === 1}
                                    tabIndex={meta.current_page === 1 ? -1 : 0}
                                >
                                    <ChevronLeft
                                        size={16}
                                        className="mr-1"
                                    />
                                    <span>Previous</span>
                                </Link>

                                {/* Page Numbers */}
                                <div className="hidden sm:flex sm:items-center sm:space-x-2">
                                    {paginationArray.map((page, index) =>
                                        page === '...' ? (
                                            <span
                                                key={`ellipsis-${index}`}
                                                className="px-3 py-2 text-gray-500"
                                            >
                                                ...
                                            </span>
                                        ) : (
                                            <Link
                                                key={`page-${page}`}
                                                href={route('blog.index', {
                                                    page,
                                                })}
                                                className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium ${
                                                    meta.current_page === page
                                                        ? 'bg-primary text-white'
                                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                                aria-current={
                                                    meta.current_page === page
                                                        ? 'page'
                                                        : undefined
                                                }
                                            >
                                                {page}
                                            </Link>
                                        ),
                                    )}
                                </div>

                                {/* Next Page Button */}
                                <Link
                                    href={
                                        meta.current_page < meta.last_page
                                            ? route('blog.index', {
                                                  page: meta.current_page + 1,
                                              })
                                            : '#'
                                    }
                                    className={`inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                        meta.current_page === meta.last_page
                                            ? 'cursor-not-allowed text-gray-300'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    aria-disabled={
                                        meta.current_page === meta.last_page
                                    }
                                    tabIndex={
                                        meta.current_page === meta.last_page
                                            ? -1
                                            : 0
                                    }
                                >
                                    <span>Next</span>
                                    <ChevronRightIcon
                                        size={16}
                                        className="ml-1"
                                    />
                                </Link>
                            </nav>
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </AnimatedGradientBackground>
    )
}

export default Blog
