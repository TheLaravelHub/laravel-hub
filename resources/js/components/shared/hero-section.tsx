import { useRef } from 'react'
import {
    Sparkles,
    ArrowRight,
    Github,
    MessageSquare,
    Users,
} from 'lucide-react'
import { motion } from 'framer-motion'
import FloatingElement from '@/components/ui/floating-element'
import { Button } from '@/components/ui/button'
import { Link } from '@inertiajs/react'
import Mixpanel from '@/lib/mixpanel'
import Image from '@/components/image'

interface HeroProps {
    users: {
        [id: number]: {
            name: string
            avatar: string
        }
    }
}

interface DashboardImageProps {
    className?: string
}

function DashboardImage({ className = '' }: DashboardImageProps) {
    return (
        <div
            className={`relative rounded-xl bg-card/80 shadow-2xl ${className}`}
        >
            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/30 bg-muted/30 p-2">
                <div className="flex h-full w-full flex-col items-center justify-center rounded bg-gradient-to-br from-background to-muted/20 p-12 text-center">
                    <div className="mb-4 flex h-8 w-full items-center gap-2 rounded-lg bg-muted/30 px-3">
                        <div className="flex gap-1.5">
                            <div className="h-3 w-3 rounded-full bg-red-400"></div>
                            <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                            <div className="h-3 w-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="mx-auto flex h-5 w-64 items-center justify-center rounded-md bg-muted/50 text-xs text-muted-foreground">
                            Laravel Hub Feed
                        </div>
                    </div>
                    <div className="grid w-full grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-24 rounded-lg bg-card/80 p-3 shadow-sm"
                            >
                                <div className="mb-2 h-3 w-16 rounded-full bg-primary/20"></div>
                                <div className="h-4 w-24 rounded-full bg-muted/50"></div>
                                <div className="mt-4 h-3 w-full rounded-full bg-muted/30"></div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 grid w-full grid-cols-2 gap-4">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-32 rounded-lg bg-card/80 p-3 shadow-sm"
                            >
                                <div className="mb-2 h-3 w-24 rounded-full bg-primary/20"></div>
                                <div className="h-4 w-32 rounded-full bg-muted/50"></div>
                                <div className="mt-4 space-y-2">
                                    <div className="h-3 w-full rounded-full bg-muted/30"></div>
                                    <div className="h-3 w-5/6 rounded-full bg-muted/30"></div>
                                    <div className="h-3 w-4/6 rounded-full bg-muted/30"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Browser-like details */}
            <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 transform items-center justify-center rounded-full bg-background px-4 py-1 shadow-lg">
                <div className="h-1.5 w-16 rounded-full bg-muted"></div>
            </div>
        </div>
    )
}

export default function HeroSection({ users }: HeroProps) {
    const heroRef = useRef<HTMLDivElement>(null)

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

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pb-24 pt-32 lg:pb-32 lg:pt-40">
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

            {/* Subtle grid pattern overlay */}
            <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-5"></div>

            <div className="container mx-auto px-6">
                <motion.div
                    className="mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row lg:items-start lg:gap-12"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Left content - Text and buttons */}
                    <motion.div
                        className="relative z-10 flex w-full flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left"
                        variants={itemVariants}
                    >
                        <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                            <Sparkles
                                className="mr-2"
                                size={14}
                            />
                            <span>The Laravel ecosystem in one place</span>
                        </div>

                        <motion.h1
                            className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl"
                            variants={itemVariants}
                        >
                            Welcome to the Laravel Developer Hub
                        </motion.h1>

                        <motion.p
                            className="mt-6 max-w-2xl text-xl text-muted-foreground"
                            variants={itemVariants}
                        >
                            Your central place for discovering the latest
                            Laravel packages, tutorials, podcasts, blog posts,
                            community insights, and more—from across the
                            ecosystem.
                        </motion.p>

                        {/* Action buttons */}
                        <motion.div
                            className="relative z-20 mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
                            variants={itemVariants}
                        >
                            <Link
                                href={route('register')}
                                className="inline-block"
                            >
                                <Button
                                    size="lg"
                                    className="cursor-pointer rounded-full bg-primary px-8 text-white hover:bg-primary/90"
                                >
                                    Get Started
                                    <ArrowRight
                                        className="ml-2"
                                        size={16}
                                    />
                                </Button>
                            </Link>

                            <a
                                href="https://github.com/theLaravelHub/laravel-hub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block"
                                onClick={() => {
                                    // Track GitHub star click using our Mixpanel implementation
                                    Mixpanel.track('GitHub Star Click', {
                                        source: 'hero_section',
                                    })
                                }}
                            >
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="cursor-pointer rounded-full border-primary/20 bg-transparent hover:bg-primary/5"
                                >
                                    <Github
                                        className="mr-2"
                                        size={16}
                                    />
                                    Star on GitHub
                                </Button>
                            </a>
                        </motion.div>

                        {/* Community stats */}
                        <motion.div
                            className="mt-12 flex flex-wrap items-center justify-center gap-8 lg:justify-start"
                            variants={itemVariants}
                        >
                            <div className="flex items-center gap-2">
                                <Users
                                    className="text-primary"
                                    size={20}
                                />
                                <span className="text-sm font-medium">
                                    10k+ Developers
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageSquare
                                    className="text-primary"
                                    size={20}
                                />
                                <span className="text-sm font-medium">
                                    Active Community
                                </span>
                            </div>
                            <div className="flex items-center">
                                <div className="flex -space-x-2 overflow-hidden">
                                    {Object.entries(users).map(([id, user]) => (
                                        <Image
                                            key={id}
                                            src={user.avatar}
                                            title={user.name}
                                            alt={user.name}
                                            className="inline-block h-8 w-8 rounded-full border-2 border-background bg-muted"
                                        />
                                    ))}
                                </div>
                                <span className="ml-2 text-sm font-medium">
                                    Join them today
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right content - Dashboard preview */}
                    <motion.div
                        className="w-full lg:w-1/2"
                        variants={itemVariants}
                    >
                        <DashboardImage className="mx-auto" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
