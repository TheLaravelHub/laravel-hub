import { useRef, useState } from 'react'
import { Category, Package } from '@/types'
import { Input } from '@/components/ui/input'
import { Search, Sparkles, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingElement from '@/components/ui/floating-element'
import Mixpanel from '@/lib/mixpanel'
import { router, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

interface HeroProps {
    categories: Category[]
}

export default function HeroSection({ categories }: HeroProps) {
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const [activeCategory, setActiveCategory] = useState<string | undefined>(
        undefined,
    )

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

        // Track search event
        Mixpanel.track('Search', {
            query: search,
        })

        router.visit('/packages', {
            method: 'get',
            data: {
                search: search.trim(),
            },
        })
    }

    const handleCategoryClick = (categorySlug: string) => {
        setIsLoading(true)

        // Track category click event
        Mixpanel.track('Category Click', {
            category: categorySlug,
        })

        router.visit('/packages', {
            method: 'get',
            data: {
                category: categorySlug,
                search: search.trim() || undefined,
            },
        })
    }

    const clearSearch = () => {
        setSearch('')
        if (searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }

    return (
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
                        Discover Packages
                    </motion.h2>
                </motion.div>

                <motion.p
                    className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground"
                    variants={itemVariants}
                >
                    Your go-to index for Laravel, PHP, and various open-source
                    development tools.
                </motion.p>

                {/* Categories */}
                <motion.div
                    className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-3"
                    variants={containerVariants}
                >
                    {categories.map((category, i) => (
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
                            onClick={() => handleCategoryClick(category.slug)}
                            className={`cursor-pointer rounded-full ${
                                activeCategory === category.slug
                                    ? 'bg-primary text-white'
                                    : 'bg-primary/10 text-primary hover:bg-primary-foreground hover:text-primary'
                            } px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200`}
                        >
                            {category.name} ({category.packages_count})
                        </motion.span>
                    ))}
                </motion.div>

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
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <AnimatePresence>
                                {search && (
                                    <motion.button
                                        type="button"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
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
            </motion.div>
        </section>
    )
}
