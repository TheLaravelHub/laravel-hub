import React, { useRef, useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ExternalLink, Star, ArrowRight, Calendar } from 'lucide-react'
import Navbar from '@/components/shared/navbar'
import { Link } from '@inertiajs/react'
import { Package as PackageType, BlogPost as BlogPostType } from '@/types'
import { Badge } from '@/components/ui/badge'
import HeroSection from '@/components/shared/hero-section'
import Footer from '@/components/shared/footer'
import { formatNumber } from '@/lib/utils'
import { motion } from 'framer-motion'
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background'
import CTASection from '@/components/shared/cta-section'
import NewsletterSubscription from '@/components/newsletter-subscription'
import AppHead from '@/components/shared/AppHead'
import { ThemeProvider } from '@/components/theme-provider'

interface IndexProps {
    users: {
        [id: number]: {
            name: string
            avatar: string
        }
    }
    packages: PackageType[]
    latestPosts?: BlogPostType[]
    mostReadPosts?: BlogPostType[]
}

export default function Index({
    users,
    packages,
    latestPosts,
    mostReadPosts,
}: IndexProps) {
    const appURL = import.meta.env.VITE_APP_URL || 'https://laravel-hub.com'

    const [packagesData] = useState(packages)
    const packagesRef = useRef<HTMLDivElement>(null)

    // Format date for blog posts
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

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

    return (
        <ThemeProvider
            defaultTheme="light"
            storageKey="vite-ui-theme"
        >
            <AnimatedGradientBackground className="min-h-screen">
                <AppHead title="Laravel Hub – The Central Community for Laravel Developers">
                    {/* Meta Description */}
                    <meta
                        name="description"
                        content="Laravel Hub is an all-in-one platform and community for Laravel developers to discover packages, stay updated with curated content, and connect with other professionals in the ecosystem."
                    />

                    {/* Keywords */}
                    <meta
                        name="keywords"
                        content="Laravel Hub, Laravel community, Laravel packages, PHP libraries, Laravel tutorials, Laravel news, Laravel ecosystem, Laravel developers, Laravel blog posts, Laravel podcasts, Laravel videos"
                    />

                    {/* Open Graph (Facebook, LinkedIn, etc.) */}
                    <meta
                        property="og:title"
                        content="Laravel Hub – The Central Community for Laravel Developers"
                    />
                    <meta
                        property="og:description"
                        content="An all-in-one platform where Laravel developers can discover packages, stay updated with curated content, and connect with other professionals in the ecosystem."
                    />
                    <meta
                        property="og:image"
                        content={`${appURL}/assets/images/og-image.png`}
                    />
                    <meta
                        property="og:url"
                        content={`${appURL}`}
                    />
                    <meta
                        property="og:type"
                        content="website"
                    />
                    <meta
                        property="og:site_name"
                        content="Laravel Hub"
                    />

                    {/* Twitter Meta Tags */}
                    <meta
                        name="twitter:card"
                        content="summary_large_image"
                    />
                    <meta
                        name="twitter:title"
                        content="Laravel Hub – The Central Community for Laravel Developers"
                    />
                    <meta
                        name="twitter:description"
                        content="Discover and explore the best Laravel packages, stay updated with curated content, and connect with other professionals in the ecosystem."
                    />
                    <meta
                        name="twitter:image"
                        content={`${appURL}/assets/images/og-image.png`}
                    />
                    <meta
                        name="twitter:site"
                        content="@thelaravelhub"
                    />

                    {/* Canonical URL */}
                    <link
                        rel="canonical"
                        href={`${appURL}`}
                    />

                    {/* JSON-LD Structured Data for SEO */}
                    <script type="application/ld+json">
                        {JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebSite',
                            name: 'Laravel Hub',
                            description:
                                'A directory of the best Laravel, PHP, and ReactJS packages, along with insightful tech blog articles.',
                            url: `${appURL}`,
                            publisher: {
                                '@type': 'Organization',
                                name: 'Laravel Hub',
                                logo: {
                                    '@type': 'ImageObject',
                                    url: `${appURL}/assets/images/logo.png`,
                                },
                            },
                            mainEntityOfPage: {
                                '@type': 'WebPage',
                                '@id': `${appURL}`,
                            },
                        })}
                    </script>
                </AppHead>

                <div className="relative flex min-h-screen flex-col text-gray-900">
                    {/*Navbar*/}
                    <Navbar />

                    {/*Hero Section*/}
                    <HeroSection users={users} />

                    {/* Latest Blog Posts Section */}
                    {latestPosts && latestPosts.length > 0 && (
                        <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16">
                            <div className="mb-12 flex items-center justify-between">
                                <div>
                                    <motion.h2
                                        className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 100,
                                        }}
                                    >
                                        Latest from our Blog
                                    </motion.h2>
                                    <motion.p
                                        className="mt-4 text-lg text-gray-600"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: 0.1,
                                            type: 'spring',
                                            stiffness: 100,
                                        }}
                                    >
                                        Stay updated with our latest articles
                                        and insights
                                    </motion.p>
                                </div>
                                <Link
                                    href={route('blog.index')}
                                    className="group hidden items-center gap-2 font-semibold text-primary transition-colors hover:text-primary/80 sm:flex"
                                >
                                    View all posts
                                    <ArrowRight
                                        className="transition-transform group-hover:translate-x-1"
                                        size={20}
                                    />
                                </Link>
                            </div>

                            <motion.div
                                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {latestPosts.map((post) => (
                                    <motion.div
                                        key={post.id}
                                        variants={cardVariants}
                                        whileHover="hover"
                                        layout
                                    >
                                        <Card className="group h-full overflow-hidden rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm transition-all">
                                            <Link
                                                href={route('blog.show', {
                                                    slug: post.slug,
                                                })}
                                            >
                                                <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                </div>
                                                <CardContent className="p-6">
                                                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar size={14} />
                                                        <span>
                                                            {formatDate(
                                                                post.published_at,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <h3 className="mb-2 line-clamp-2 text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
                                                        {post.title}
                                                    </h3>
                                                    <p className="line-clamp-3 text-muted-foreground">
                                                        {post.sub_title ||
                                                            post.meta_description}
                                                    </p>
                                                </CardContent>
                                            </Link>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>

                            <div className="mt-8 flex justify-center sm:hidden">
                                <Link
                                    href={route('blog.index')}
                                    className="group flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary/80"
                                >
                                    View all posts
                                    <ArrowRight
                                        className="transition-transform group-hover:translate-x-1"
                                        size={20}
                                    />
                                </Link>
                            </div>
                        </section>
                    )}

                    {/* Packages */}
                    <section
                        ref={packagesRef}
                        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-8 pt-16"
                    >
                        <div className="mb-12 flex items-center justify-between">
                            <div>
                                <motion.h2
                                    className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 100,
                                    }}
                                >
                                    Discover Popular Packages
                                </motion.h2>
                                <motion.p
                                    className="mt-4 text-lg text-gray-600"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: 0.1,
                                        type: 'spring',
                                        stiffness: 100,
                                    }}
                                >
                                    Explore the most starred packages in our
                                    collection
                                </motion.p>
                            </div>
                            <Link
                                href={route('packages.index')}
                                className="group hidden items-center gap-2 font-semibold text-primary transition-colors hover:text-primary/80 sm:flex"
                            >
                                View all packages
                                <ArrowRight
                                    className="transition-transform group-hover:translate-x-1"
                                    size={20}
                                />
                            </Link>
                        </div>

                        {packagesData.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {packagesData.map((pkg, index) => (
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
                                                                    'secondary'
                                                                }
                                                                className="bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                                            >
                                                                {category.name}
                                                            </Badge>
                                                        ),
                                                    )}
                                                </div>
                                                <motion.div
                                                    className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-600"
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
                        ) : (
                            <motion.div
                                className="flex flex-col items-center justify-center py-16 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <p className="text-xl text-muted-foreground">
                                    No packages found matching your search
                                    criteria.
                                </p>
                                <p className="mt-2 text-muted-foreground">
                                    Try adjusting your search or browse
                                    categories.
                                </p>
                            </motion.div>
                        )}

                        <div className="mt-8 flex justify-center sm:hidden">
                            <Link
                                href={route('packages.index')}
                                className="group flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary/80"
                            >
                                View all packages
                                <ArrowRight
                                    className="transition-transform group-hover:translate-x-1"
                                    size={20}
                                />
                            </Link>
                        </div>
                    </section>

                    {/* Newsletter Section */}
                    <NewsletterSubscription />

                    {/* Latest Blog Posts Section */}
                    {mostReadPosts && mostReadPosts.length >= 3 && (
                        <section className="mx-auto max-w-7xl px-6 py-24">
                            <div className="mb-12 flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                        Most Read
                                    </h2>
                                </div>
                                <Link
                                    href={route('blog.index')}
                                    className="group hidden items-center gap-2 font-semibold text-primary transition-colors hover:text-primary/80 sm:flex"
                                >
                                    View all posts
                                    <ArrowRight
                                        className="transition-transform group-hover:translate-x-1"
                                        size={20}
                                    />
                                </Link>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {mostReadPosts.map((post) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 100,
                                            damping: 15,
                                        }}
                                    >
                                        <Card className="group h-full overflow-hidden">
                                            <Link
                                                href={route('blog.show', {
                                                    slug: post.slug,
                                                })}
                                            >
                                                <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                </div>
                                            </Link>

                                            <div className="p-6">
                                                <div className="mb-4 flex flex-wrap gap-2">
                                                    {post.categories
                                                        .slice(0, 2)
                                                        .map((category) => (
                                                            <Badge
                                                                key={
                                                                    category.id
                                                                }
                                                                variant="secondary"
                                                                className="bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                                            >
                                                                {category.name}
                                                            </Badge>
                                                        ))}
                                                </div>

                                                <Link
                                                    href={route('blog.show', {
                                                        slug: post.slug,
                                                    })}
                                                    className="group"
                                                >
                                                    <h3 className="mb-2 text-xl font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-primary">
                                                        {post.title}
                                                    </h3>
                                                </Link>

                                                {post.sub_title && (
                                                    <p className="mb-4 line-clamp-2 text-gray-600">
                                                        {post.sub_title}
                                                    </p>
                                                )}

                                                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {formatDate(
                                                            post.published_at,
                                                        )}
                                                    </div>
                                                    <Link
                                                        href={route(
                                                            'blog.show',
                                                            {
                                                                slug: post.slug,
                                                            },
                                                        )}
                                                        className="flex items-center font-medium text-primary transition-colors hover:text-primary/80"
                                                    >
                                                        Read more
                                                        <ArrowRight
                                                            size={16}
                                                            className="ml-1"
                                                        />
                                                    </Link>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-8 text-center sm:hidden">
                                <Link
                                    href={route('blog.index')}
                                    className="inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary/80"
                                >
                                    View all posts
                                    <ArrowRight
                                        className="transition-transform group-hover:translate-x-1"
                                        size={20}
                                    />
                                </Link>
                            </div>
                        </section>
                    )}

                    {/* CTA Section */}
                    <CTASection />

                    {/* Footer */}
                    <Footer />
                </div>
            </AnimatedGradientBackground>
        </ThemeProvider>
    )
}
