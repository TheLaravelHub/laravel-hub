import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ExternalLink, Star } from 'lucide-react'
import Navbar from '@/components/shared/navbar'
import {Head, Link} from '@inertiajs/react'
import { Category, MetaType, Package as PackageType } from '@/types'
import { Badge } from '@/components/ui/badge'
import HeroSection from '@/components/shared/hero-section'
import Footer from '@/components/shared/footer'
import { formatNumber } from '@/lib/utils'
import { useInView } from 'react-intersection-observer'
import axios from 'axios'
import { motion } from 'framer-motion'
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background'
import StatsSection from '@/components/shared/stats-section'
import CTASection from '@/components/shared/cta-section'

interface IndexProps {
    categories: { data: Category[] }
    packages: {
        data: PackageType[]
        meta: MetaType
    }
    stars: number
}

export default function Index({ categories, packages, stars }: IndexProps) {
    const [packagesData, setPackagesData] = useState(packages.data)
    const packagesRef = useRef<HTMLDivElement>(null)
    const [hasMorePages, setHasMorePages] = useState<boolean>(
        packages.meta.current_page < packages.meta.last_page,
    )
    const [nextPage, setNextPage] = useState<number | null>(
        hasMorePages ? packages.meta.current_page + 1 : null,
    )
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const { ref, inView } = useInView({
        threshold: 0.1,
    })

    useEffect(() => {
        if (inView && nextPage && !isLoadingMore && !isSearching) {
            setIsLoadingMore(true)
            axios
                .get(route('homepage'), { params: { page: nextPage } })
                .then((response) => {
                    const data = response.data
                    setPackagesData((prevPackages) => {
                        return [...prevPackages, ...data.data]
                    })
                    setHasMorePages(
                        data.meta.current_page < data.meta.last_page,
                    )
                    if (data.meta.current_page < data.meta.last_page) {
                        setNextPage(data.meta.current_page + 1)
                    } else {
                        setNextPage(null)
                    }
                    setIsLoadingMore(false)
                })
                .catch((error) => {
                    console.error(error)
                    setIsLoadingMore(false)
                })
        }
    }, [inView, isSearching])

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
        <AnimatedGradientBackground className="min-h-screen">
            <Head title={'Home'} />
            <div className="relative flex min-h-screen flex-col text-gray-900">
                {/*Navbar*/}
                <Navbar />

                {/*Hero Section*/}
                <HeroSection
                    categories={categories.data}
                    packagesData={packagesData}
                    setPackagesData={setPackagesData}
                    packagesRef={packagesRef}
                    setIsSearching={setIsSearching}
                />

                {/* Packages */}
                <section
                    ref={packagesRef}
                    className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-8 pt-16"
                >
                    {!isSearching && (
                        <motion.h2
                            className="mb-6 text-center text-2xl font-bold md:text-3xl"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: 'spring', stiffness: 100 }}
                        >
                            Discover Popular Packages
                        </motion.h2>
                    )}

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
                                                <div className="flex items-center">
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
                                                            delay: index * 0.05,
                                                        }}
                                                    />
                                                    <div className="ml-4">
                                                        <Link
                                                            href={route('packagePage', { slug: pkg.slug })}
                                                            className="group flex items-center gap-2 text-xl font-semibold text-primary transition-colors hover:text-primary/80"
                                                        >
                                                            {pkg.name}
                                                            <ExternalLink
                                                                size={16}
                                                                className="opacity-0 transition-opacity group-hover:opacity-100"
                                                            />
                                                        </Link>
                                                        <p className="text-sm text-muted-foreground">
                                                            {pkg.owner}
                                                        </p>
                                                    </div>
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
                                            </div>
                                            {pkg.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {pkg.description.length >
                                                    120 ? (
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
                                        <CardFooter className="mt-auto flex flex-wrap gap-2 border-t border-border/50 bg-muted/30 p-4">
                                            {pkg.categories.map((category) => (
                                                <Badge
                                                    key={category.id}
                                                    variant={'secondary'}
                                                    className="bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                                >
                                                    {category.name}
                                                </Badge>
                                            ))}
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
                                No packages found matching your search criteria.
                            </p>
                            <p className="mt-2 text-muted-foreground">
                                Try adjusting your search or browse categories.
                            </p>
                        </motion.div>
                    )}
                </section>

                {hasMorePages && !isSearching && (
                    <div className="flex w-full justify-center py-6">
                        <div
                            ref={ref}
                            className="-translate-y-16"
                        ></div>
                        {isLoadingMore && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0.5 }}
                                animate={{
                                    scale: [0.8, 1.2, 0.8],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <span className="loading-xl loading loading-dots text-primary"></span>
                            </motion.div>
                        )}
                    </div>
                )}

                {/* Stats Section - Moved below search results */}
                <StatsSection
                    totalPackages={packages.meta.total}
                    totalStars={stars}
                    totalCategories={categories.data.length}
                    compact={false}
                />

                {/* CTA Section */}
                <CTASection />

                {/* Footer */}
                <Footer />
            </div>
        </AnimatedGradientBackground>
    )
}
