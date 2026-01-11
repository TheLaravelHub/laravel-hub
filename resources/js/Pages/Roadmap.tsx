import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    BookOpen,
    Code,
    Database,
    Rocket,
    CheckCircle2,
    ExternalLink,
    FileText,
    Video,
    Book,
    Globe,
    ChevronDown,
    ChevronUp,
} from 'lucide-react'
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background'
import Navbar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AppHead from '@/components/shared/AppHead'
import { ThemeProvider } from '@/components/theme-provider'

interface Resource {
    title: string
    url: string
    type:
        | 'documentation'
        | 'video'
        | 'guide'
        | 'tutorial'
        | 'article'
        | 'service'
}

interface Topic {
    id: string
    title: string
    description: string
    resources: Resource[]
}

interface Phase {
    id: string
    title: string
    description: string
    order: number
    topics: Topic[]
}

interface RoadmapData {
    title: string
    description: string
    lastUpdated: string
    phases: Phase[]
}

interface SeoSettings {
    title: string
    description: string
    keywords: string
    og_type: string
    og_title: string
    og_description: string
    og_image?: string
    og_url?: string
    og_site_name: string
    og_locale: string
    twitter_card: string
    twitter_site: string
    twitter_title: string
    twitter_description: string
    twitter_image?: string
}

interface RoadmapProps {
    roadmap: RoadmapData
    seoSettings: SeoSettings
}

const getResourceIcon = (type: string) => {
    switch (type) {
        case 'documentation':
            return <FileText size={14} />
        case 'video':
            return <Video size={14} />
        case 'guide':
        case 'tutorial':
            return <Book size={14} />
        case 'article':
            return <BookOpen size={14} />
        case 'service':
            return <Globe size={14} />
        default:
            return <ExternalLink size={14} />
    }
}

const getPhaseIcon = (phaseId: string) => {
    switch (phaseId) {
        case 'prerequisites':
            return <BookOpen className="h-6 w-6" />
        case 'beginner':
            return <Code className="h-6 w-6" />
        case 'intermediate':
            return <Database className="h-6 w-6" />
        case 'advanced':
            return <Rocket className="h-6 w-6" />
        case 'ecosystem':
            return <CheckCircle2 className="h-6 w-6" />
        default:
            return <Code className="h-6 w-6" />
    }
}

const getPhaseColor = (phaseId: string) => {
    switch (phaseId) {
        case 'prerequisites':
            return 'from-blue-500/20 to-cyan-500/20'
        case 'beginner':
            return 'from-green-500/20 to-emerald-500/20'
        case 'intermediate':
            return 'from-yellow-500/20 to-orange-500/20'
        case 'advanced':
            return 'from-red-500/20 to-pink-500/20'
        case 'ecosystem':
            return 'from-purple-500/20 to-violet-500/20'
        default:
            return 'from-gray-500/20 to-slate-500/20'
    }
}

const Roadmap = ({ roadmap, seoSettings }: RoadmapProps) => {
    const appURL = import.meta.env.VITE_APP_URL || 'https://laravel-hub.com'
    const [expandedTopics, setExpandedTopics] = useState<{
        [key: string]: boolean
    }>({})

    const toggleTopic = (topicId: string) => {
        setExpandedTopics((prev) => ({
            ...prev,
            [topicId]: !prev[topicId],
        }))
    }

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
        <ThemeProvider>
            <AnimatedGradientBackground className="min-h-screen">
                <AppHead title={seoSettings.title}>
                    {/* Meta Description */}
                    <meta
                        name="description"
                        content={seoSettings.description}
                    />

                    {/* Keywords */}
                    <meta
                        name="keywords"
                        content={seoSettings.keywords}
                    />

                    {/* Open Graph (Facebook, LinkedIn, etc.) */}
                    <meta
                        property="og:type"
                        content={seoSettings.og_type}
                    />
                    <meta
                        property="og:title"
                        content={seoSettings.og_title}
                    />
                    <meta
                        property="og:description"
                        content={seoSettings.og_description}
                    />
                    {seoSettings.og_image && (
                        <meta
                            property="og:image"
                            content={seoSettings.og_image}
                        />
                    )}
                    <meta
                        property="og:url"
                        content={seoSettings.og_url || `${appURL}/roadmap`}
                    />
                    <meta
                        property="og:site_name"
                        content={seoSettings.og_site_name}
                    />
                    <meta
                        property="og:locale"
                        content={seoSettings.og_locale}
                    />

                    {/* Twitter Meta Tags */}
                    <meta
                        name="twitter:card"
                        content={seoSettings.twitter_card}
                    />
                    <meta
                        name="twitter:site"
                        content={seoSettings.twitter_site}
                    />
                    <meta
                        name="twitter:title"
                        content={seoSettings.twitter_title}
                    />
                    {seoSettings.twitter_image && (
                        <meta
                            property="twitter:image"
                            content={seoSettings.twitter_image}
                        />
                    )}
                    <meta
                        name="twitter:description"
                        content={seoSettings.twitter_description}
                    />

                    {/* Canonical URL */}
                    <link
                        rel="canonical"
                        href={`${appURL}/roadmap`}
                    />
                    <link
                        rel="home"
                        href={`${appURL}/`}
                    />

                    {/* Favicon */}
                    <link
                        rel="icon"
                        type="image/x-icon"
                        href={`${appURL}/assets/images/favicon.ico`}
                    />

                    {/* JSON-LD Structured Data for SEO */}
                    <script type="application/ld+json">
                        {JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Article',
                            headline: roadmap.title,
                            description: roadmap.description,
                            datePublished: roadmap.lastUpdated,
                            dateModified: roadmap.lastUpdated,
                            author: {
                                '@type': 'Organization',
                                name: 'Laravel Hub',
                            },
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
                                '@id': `${appURL}/roadmap`,
                            },
                        })}
                    </script>
                </AppHead>

                <div className="relative min-h-screen bg-background">
                    <Navbar />

                    {/* Hero Section */}
                    <section className="relative overflow-hidden pb-20 pt-36">
                        <div className="container mx-auto px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="mx-auto max-w-4xl text-center"
                            >
                                <Badge
                                    className="mb-4"
                                    variant="secondary"
                                >
                                    Last Updated: {roadmap.lastUpdated}
                                </Badge>
                                <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                                    {roadmap.title}
                                </h1>
                                <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                                    {roadmap.description}
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    {roadmap.phases.map((phase) => (
                                        <a
                                            key={phase.id}
                                            href={`#${phase.id}`}
                                            className="inline-flex items-center gap-2 rounded-lg bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
                                        >
                                            {getPhaseIcon(phase.id)}
                                            {phase.title}
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* Roadmap Phases */}
                    <section className="relative py-12">
                        <div className="container mx-auto px-6">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                                className="mx-auto max-w-5xl space-y-16"
                            >
                                {roadmap.phases.map((phase, phaseIndex) => (
                                    <motion.div
                                        key={phase.id}
                                        id={phase.id}
                                        variants={itemVariants}
                                        className="scroll-mt-24"
                                    >
                                        {/* Phase Header */}
                                        <div className="mb-8">
                                            <div className="mb-4 flex items-center gap-4">
                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${getPhaseColor(phase.id)}`}
                                                >
                                                    {getPhaseIcon(phase.id)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">
                                                        Phase {phase.order}
                                                    </div>
                                                    <h2 className="text-3xl font-bold">
                                                        {phase.title}
                                                    </h2>
                                                </div>
                                            </div>
                                            <p className="text-lg text-muted-foreground">
                                                {phase.description}
                                            </p>
                                        </div>

                                        {/* Topics Grid */}
                                        <div className="grid gap-6 md:grid-cols-2">
                                            {phase.topics.map((topic) => (
                                                <Card
                                                    key={topic.id}
                                                    className="group transition-shadow hover:shadow-lg"
                                                >
                                                    <CardHeader>
                                                        <CardTitle className="flex items-start justify-between gap-2">
                                                            <span className="text-xl">
                                                                {topic.title}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    toggleTopic(
                                                                        topic.id,
                                                                    )
                                                                }
                                                                className="rounded-full p-1 transition-colors hover:bg-accent"
                                                                aria-label={
                                                                    expandedTopics[
                                                                        topic.id
                                                                    ]
                                                                        ? 'Collapse'
                                                                        : 'Expand'
                                                                }
                                                            >
                                                                {expandedTopics[
                                                                    topic.id
                                                                ] ? (
                                                                    <ChevronUp
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <ChevronDown
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                )}
                                                            </button>
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="mb-4 text-sm text-muted-foreground">
                                                            {topic.description}
                                                        </p>

                                                        {/* Resources */}
                                                        {expandedTopics[
                                                            topic.id
                                                        ] && (
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    height: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    height: 'auto',
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    height: 0,
                                                                }}
                                                                transition={{
                                                                    duration: 0.2,
                                                                }}
                                                                className="space-y-2"
                                                            >
                                                                <div className="mb-2 text-sm font-semibold">
                                                                    Learning
                                                                    Resources:
                                                                </div>
                                                                {topic.resources.map(
                                                                    (
                                                                        resource,
                                                                        idx,
                                                                    ) => (
                                                                        <a
                                                                            key={
                                                                                idx
                                                                            }
                                                                            href={
                                                                                resource.url
                                                                            }
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center gap-2 rounded-lg border border-border bg-card/50 p-3 text-sm transition-colors hover:bg-accent"
                                                                        >
                                                                            <div className="flex-shrink-0">
                                                                                {getResourceIcon(
                                                                                    resource.type,
                                                                                )}
                                                                            </div>
                                                                            <span className="flex-1">
                                                                                {
                                                                                    resource.title
                                                                                }
                                                                            </span>
                                                                            <Badge
                                                                                variant="secondary"
                                                                                className="text-xs"
                                                                            >
                                                                                {
                                                                                    resource.type
                                                                                }
                                                                            </Badge>
                                                                            <ExternalLink
                                                                                size={
                                                                                    14
                                                                                }
                                                                                className="flex-shrink-0 text-muted-foreground"
                                                                            />
                                                                        </a>
                                                                    ),
                                                                )}
                                                            </motion.div>
                                                        )}

                                                        {!expandedTopics[
                                                            topic.id
                                                        ] && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {
                                                                    topic
                                                                        .resources
                                                                        .length
                                                                }{' '}
                                                                {topic.resources
                                                                    .length ===
                                                                1
                                                                    ? 'Resource'
                                                                    : 'Resources'}{' '}
                                                                Available
                                                            </Badge>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>

                                        {/* Divider between phases */}
                                        {phaseIndex <
                                            roadmap.phases.length - 1 && (
                                            <div className="mt-16 flex items-center justify-center">
                                                <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-border to-transparent" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="relative py-20">
                        <div className="container mx-auto px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mx-auto max-w-3xl text-center"
                            >
                                <h2 className="mb-4 text-3xl font-bold">
                                    Ready to Start Your Laravel Journey?
                                </h2>
                                <p className="mb-8 text-lg text-muted-foreground">
                                    This roadmap is continuously updated by the
                                    community. Found a great resource?
                                    Contribute to the roadmap on GitHub!
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <a
                                        href="https://github.com/TheLaravelHub/laravel-hub"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                                    >
                                        <Code size={20} />
                                        Contribute on GitHub
                                    </a>
                                    <a
                                        href="/packages"
                                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-semibold transition-colors hover:bg-accent"
                                    >
                                        <Rocket size={20} />
                                        Explore Packages
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    <Footer />
                </div>
            </AnimatedGradientBackground>
        </ThemeProvider>
    )
}

export default Roadmap
