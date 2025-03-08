import React from 'react'
import { Deferred, Head } from '@inertiajs/react'
import { Package as PackageType } from '@/types'
import Navbar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
    ExternalLink,
    Github,
    Star,
    Calendar,
    Code,
    Globe,
    FileText,
    CheckCircle,
    XCircle,
    User,
    Info,
    BookOpen,
} from 'lucide-react'
import { formatNumber, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Skeleton } from '@/components/ui/skeleton'

interface PackageProps {
    package: PackageType
    readme: string
}

export default function Package({ package: pkg, readme }: PackageProps) {
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
        <AnimatedGradientBackground className="min-h-screen">
            <Head title={pkg.name} />
            <div className="relative flex min-h-screen flex-col">
                <Navbar />

                <main className="flex-1 pb-16 pt-28">
                    <div className="container mx-auto px-4 md:px-6">
                        {/* Package Header - Mobile Only */}
                        <motion.div
                            className="mb-8 md:hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={
                                        pkg.owner_avatar ||
                                        '/assets/images/github-avatar.jpg'
                                    }
                                    alt={pkg.owner}
                                    className="h-16 w-16 rounded-full border-2 border-primary/20"
                                />
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground">
                                        {pkg.name}
                                    </h1>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <User size={14} />
                                        <p className="text-lg">{pkg.owner}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Content Layout */}
                        <div className="relative flex flex-col-reverse md:flex-row md:gap-8">
                            {/* README Content - Left Side */}
                            <motion.div
                                className="w-full md:w-2/3 lg:w-3/4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <div className="rounded-xl bg-card p-4 shadow-md md:p-8">
                                    <Deferred
                                        data={['readme']}
                                        fallback={
                                            <Skeleton className="h-[1000px] w-full rounded-xl" />
                                        }
                                    >
                                        <div className="markdown-content">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[
                                                    rehypeRaw,
                                                    rehypeSanitize,
                                                ]}
                                                components={{
                                                    code({
                                                        node,
                                                        className,
                                                        children,
                                                        ...props
                                                    }: any) {
                                                        const match =
                                                            /language-(\w+)/.exec(
                                                                className || '',
                                                            )
                                                        const inline = !match
                                                        return !inline &&
                                                            match ? (
                                                            <div className="my-4 overflow-hidden rounded-md border border-border/50">
                                                                <div className="border-b border-border/50 bg-slate-800 px-4 py-2 font-mono text-xs text-white">
                                                                    {match[1]}
                                                                </div>
                                                                <SyntaxHighlighter
                                                                    style={{
                                                                        ...vscDarkPlus,
                                                                        'pre[class*="language-"]':
                                                                            {
                                                                                background:
                                                                                    '#1e293b', // slate-800
                                                                                color: '#f8fafc', // slate-50
                                                                                margin: 0,
                                                                                padding:
                                                                                    '1.5rem',
                                                                                borderRadius:
                                                                                    '0',
                                                                                overflow:
                                                                                    'auto',
                                                                            },
                                                                        'code[class*="language-"]':
                                                                            {
                                                                                background:
                                                                                    'transparent',
                                                                                color: '#f8fafc', // slate-50
                                                                                textShadow:
                                                                                    'none',
                                                                            },
                                                                        // Improve token colors for better visibility
                                                                        'token.comment':
                                                                            {
                                                                                color: '#94a3b8',
                                                                            }, // slate-400
                                                                        'token.string':
                                                                            {
                                                                                color: '#86efac',
                                                                            }, // green-300
                                                                        'token.number':
                                                                            {
                                                                                color: '#fda4af',
                                                                            }, // rose-300
                                                                        'token.keyword':
                                                                            {
                                                                                color: '#c4b5fd',
                                                                            }, // violet-300
                                                                        'token.function':
                                                                            {
                                                                                color: '#93c5fd',
                                                                            }, // blue-300
                                                                        'token.operator':
                                                                            {
                                                                                color: '#e2e8f0',
                                                                            }, // slate-200
                                                                        'token.punctuation':
                                                                            {
                                                                                color: '#e2e8f0',
                                                                            }, // slate-200
                                                                    }}
                                                                    language={
                                                                        match[1]
                                                                    }
                                                                    PreTag="div"
                                                                    customStyle={{
                                                                        background:
                                                                            '#1e293b', // slate-800
                                                                        borderRadius:
                                                                            '0',
                                                                        padding:
                                                                            '1rem',
                                                                        margin: 0,
                                                                    }}
                                                                    {...props}
                                                                >
                                                                    {String(
                                                                        children,
                                                                    ).replace(
                                                                        /\n$/,
                                                                        '',
                                                                    )}
                                                                </SyntaxHighlighter>
                                                            </div>
                                                        ) : (
                                                            <code
                                                                className="rounded-md bg-slate-700 px-1.5 py-0.5 text-sm text-slate-50"
                                                                {...props}
                                                            >
                                                                {children}
                                                            </code>
                                                        )
                                                    },
                                                    a: ({ node, ...props }) => (
                                                        <a
                                                            {...props}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline"
                                                        />
                                                    ),
                                                    h1: ({
                                                        node,
                                                        ...props
                                                    }) => (
                                                        <h1
                                                            {...props}
                                                            className="mb-4 mt-8 text-3xl font-bold text-foreground"
                                                        />
                                                    ),
                                                    h2: ({
                                                        node,
                                                        ...props
                                                    }) => (
                                                        <h2
                                                            {...props}
                                                            className="mb-3 mt-6 border-b border-border pb-2 text-2xl font-bold text-foreground"
                                                        />
                                                    ),
                                                    h3: ({
                                                        node,
                                                        ...props
                                                    }) => (
                                                        <h3
                                                            {...props}
                                                            className="mb-2 mt-5 text-xl font-bold text-foreground"
                                                        />
                                                    ),
                                                    p: ({ node, ...props }) => (
                                                        <p
                                                            {...props}
                                                            className="my-4 leading-7 text-foreground"
                                                        />
                                                    ),
                                                    ul: ({
                                                        node,
                                                        ...props
                                                    }) => (
                                                        <ul
                                                            {...props}
                                                            className="my-4 list-disc pl-6 text-foreground"
                                                        />
                                                    ),
                                                    ol: ({
                                                        node,
                                                        ...props
                                                    }) => (
                                                        <ol
                                                            {...props}
                                                            className="my-4 list-decimal pl-6 text-foreground"
                                                        />
                                                    ),
                                                    li: ({
                                                        node,
                                                        ...props
                                                    }) => (
                                                        <li
                                                            {...props}
                                                            className="my-1 text-foreground"
                                                        />
                                                    ),
                                                    blockquote: ({
                                                        node,
                                                        ...props
                                                    }) => (
                                                        <blockquote
                                                            {...props}
                                                            className="my-4 border-l-4 border-primary/30 pl-4 italic text-muted-foreground"
                                                        />
                                                    ),
                                                    img: ({
                                                        node,
                                                        ...props
                                                    }) => (
                                                        <img
                                                            {...props}
                                                            className="my-4 h-auto max-w-full rounded-md"
                                                        />
                                                    ),
                                                    table: ({
                                                        node,
                                                        ...props
                                                    }) => (
                                                        <div className="my-6 overflow-x-auto rounded-md border border-border">
                                                            <table
                                                                {...props}
                                                                className="min-w-full divide-y divide-border"
                                                            />
                                                        </div>
                                                    ),
                                                    th: ({
                                                        node,
                                                        ...props
                                                    }) => (
                                                        <th
                                                            {...props}
                                                            className="bg-muted/50 px-4 py-3 text-left font-medium text-foreground"
                                                        />
                                                    ),
                                                    td: ({
                                                        node,
                                                        ...props
                                                    }) => (
                                                        <td
                                                            {...props}
                                                            className="border-t border-border px-4 py-3 text-foreground"
                                                        />
                                                    ),
                                                    pre: ({
                                                        node,
                                                        children,
                                                        ...props
                                                    }) => <>{children}</>,
                                                }}
                                            >
                                                {readme}
                                            </ReactMarkdown>
                                        </div>
                                    </Deferred>
                                </div>
                            </motion.div>

                            <motion.div
                                className="sticky top-28 mb-8 w-full md:mb-0 md:w-1/3 lg:w-1/4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.div
                                    variants={itemVariants}
                                    className="mb-6 overflow-hidden rounded-xl bg-card shadow-md"
                                >
                                    {/* Package Header */}
                                    <div className="border-b border-border/50 p-6">
                                        <div className="mb-4 hidden items-center gap-4 md:flex">
                                            <img
                                                src={
                                                    pkg.owner_avatar ||
                                                    '/assets/images/github-avatar.jpg'
                                                }
                                                alt={pkg.owner}
                                                className="h-16 w-16 rounded-full border-2 border-primary/20"
                                            />
                                            <div>
                                                <h1 className="text-2xl font-bold text-foreground">
                                                    {pkg.name}
                                                </h1>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <User size={14} />
                                                    <p>{pkg.owner}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4 flex flex-wrap items-center gap-2">
                                            {pkg.index && (
                                                <Badge
                                                    variant="outline"
                                                    className="flex items-center gap-1"
                                                    style={{
                                                        backgroundColor: pkg
                                                            .index.color_code
                                                            ? `${pkg.index.color_code}20`
                                                            : 'rgba(var(--primary), 0.1)',
                                                        color:
                                                            pkg.index
                                                                .color_code ||
                                                            'hsl(var(--primary))',
                                                        borderColor: pkg.index
                                                            .color_code
                                                            ? `${pkg.index.color_code}40`
                                                            : 'rgba(var(--primary), 0.2)',
                                                    }}
                                                >
                                                    <img
                                                        src={pkg.index.icon}
                                                        alt={pkg.index.name}
                                                        className="h-4 w-4"
                                                    />
                                                    {pkg.index.name}
                                                </Badge>
                                            )}

                                            {pkg.language && (
                                                <Badge
                                                    variant="outline"
                                                    className="flex items-center gap-1"
                                                >
                                                    <Code size={14} />
                                                    {pkg.language}
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="mb-4 flex items-center gap-1">
                                            <Star
                                                size={18}
                                                className="fill-current text-amber-500"
                                            />
                                            <span className="text-lg font-medium">
                                                {formatNumber(pkg.stars)}
                                            </span>
                                        </div>

                                        {pkg.created_at && (
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Calendar size={14} />
                                                <span>
                                                    Added:{' '}
                                                    {formatDate(pkg.created_at)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    {pkg.description && (
                                        <div className="border-b border-border/50 p-6">
                                            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                                                Description
                                            </h3>
                                            <p className="text-sm text-foreground">
                                                {pkg.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Categories */}
                                    <div className="border-b border-border/50 p-6">
                                        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                                            Categories
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {pkg.categories.map((category) => (
                                                <Badge
                                                    key={category.id}
                                                    variant="secondary"
                                                    className="bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                                >
                                                    {category.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Links */}
                                    <div className="p-6">
                                        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                                            Resources
                                        </h3>
                                        <div className="space-y-3">
                                            <a
                                                href={pkg.repository_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between text-sm transition-colors hover:text-primary"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Github size={16} />
                                                    <span>Repository</span>
                                                </div>
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <a href={route('homepage')}>
                                            Browse All Packages
                                        </a>
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </AnimatedGradientBackground>
    )
}
