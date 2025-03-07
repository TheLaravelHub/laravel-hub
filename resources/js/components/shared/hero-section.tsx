import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { Category, Package } from '@/types'
import { Input } from '@/components/ui/input'
import { Search, Sparkles, X } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingElement from '@/components/ui/floating-element'

interface HeroProps {
    categories: Category[]
    packagesData: Package[]
    setPackagesData: Dispatch<SetStateAction<Package[]>>
    packagesRef: React.RefObject<HTMLDivElement>
    setIsSearching?: Dispatch<SetStateAction<boolean>>
}

export default function HeroSection({
    categories,
    packagesData,
    setPackagesData,
    packagesRef,
    setIsSearching,
}: HeroProps) {
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
    const [initialPackages, setInitialPackages] =
        useState<Package[]>(packagesData)
    const searchInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (search === '') {
            setPackagesData(initialPackages)
            setIsLoading(false)
            if (setIsSearching) setIsSearching(false)
            return
        }

        // Don't search if less than 3 characters
        if (search.length < 3) {
            return
        }

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current)
        }

        setIsLoading(true)
        if (setIsSearching) setIsSearching(true)

        debounceTimeout.current = setTimeout(async () => {
            try {
                const response = await axios.get(route('search'), {
                    params: { term: search },
                })

                setPackagesData(response.data)
                setIsLoading(false)

                // Smooth scroll to show both search and results
                if (packagesRef?.current) {
                    const offset = window.innerWidth < 768 ? 100 : 150 // Less scroll on mobile
                    const targetPosition =
                        packagesRef.current.offsetTop - offset

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth',
                    })
                }
            } catch (error) {
                setIsLoading(false)
                console.error(error)
            }
        }, 300) // 300ms debounce delay

        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
        }
    }, [search])

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
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

    const handleCategoryClick = (categoryId: number) => {
        // Filter packages by category
        if (setIsSearching) setIsSearching(true)
        setIsLoading(true)

        axios
            .get(route('search'), {
                params: { category: categoryId },
            })
            .then((response) => {
                setPackagesData(response.data)
                setIsLoading(false)

                // Always scroll to results when filtering by category
                if (packagesRef?.current) {
                    packagesRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    })
                }
            })
            .catch((error) => {
                console.error(error)
                setIsLoading(false)
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
                        className="absolute right-3 md:-right-8 -top-8 text-primary"
                        duration={3}
                        distance={10}
                    >
                        <Sparkles size={24} />
                    </FloatingElement>
                    <motion.h2 className="bg-gradient-to-r from-primary p-2 to-secondary bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl lg:text-6xl">
                        Explore & Discover Open-Source Packages
                    </motion.h2>
                </motion.div>

                <motion.p
                    className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground"
                    variants={itemVariants}
                >
                    Your go-to index for Laravel, PHP, and various open-source
                    development tools.
                </motion.p>

                {/* Categories - Moved back above search */}
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
                                // color: "white",
                                transition: {
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 10,
                                },
                            }}
                            className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm transition-all duration-200"
                        >
                            {category.name}
                        </motion.span>
                    ))}
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    className="mx-auto mt-10 w-full max-w-3xl"
                    variants={itemVariants}
                >
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
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="mr-2"
                            >
                                <span className="loading loading-spinner text-primary"></span>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
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
    )
}
