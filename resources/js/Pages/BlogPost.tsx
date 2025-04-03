import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Tag } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background'
import Navbar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'
import { Badge } from '@/components/ui/badge'
import { BlogPost as BlogPostType, Category } from '@/types'
import { format } from 'date-fns'
import { Head } from '@inertiajs/react'
import AppHead from '@/components/shared/AppHead'
interface BlogPostProps {
    blogPost: BlogPostType
}

const BlogPost = ({ blogPost }: BlogPostProps) => {
    const appURL = import.meta.env.VITE_APP_URL || 'https://indxs.dev'

    return (
        <AnimatedGradientBackground>
            <AppHead
                title={blogPost.title}
            >
                <meta
                    name="description"
                    content={
                        blogPost.meta_description ||
                        blogPost.sub_title ||
                        blogPost.title
                    }
                />

                <meta
                    name="keywords"
                    content={`blog, tech, programming, ${blogPost.categories?.map(cat => cat.name).join(', ')}`}
                />

                {/* Open Graph (Facebook, LinkedIn, etc.) */}
                <meta
                    property="og:title"
                    content={blogPost.title}
                />
                <meta
                    property="og:description"
                    content={
                        blogPost.meta_description ||
                        blogPost.sub_title ||
                        blogPost.title
                    }
                />
                <meta
                    property="og:image"
                    content={
                        blogPost.image ||
                        `${appURL}/assets/images/og-image.png`
                    }
                />
                <meta
                    property="og:url"
                    content={`${appURL}/blog/${blogPost.slug}`}
                />
                <meta
                    property="og:type"
                    content="article"
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
                    content={blogPost.title}
                />
                <meta
                    name="twitter:description"
                    content={
                        blogPost.meta_description ||
                        blogPost.sub_title ||
                        blogPost.title
                    }
                />
                <meta
                    name="twitter:image"
                    content={
                        blogPost.image ||
                        `${appURL}/assets/images/og-image.png`
                    }
                />
                <meta
                    name="twitter:site"
                    content="@IndxsDev"
                />

                {/* Canonical URL */}
                <link
                    rel="canonical"
                    href={`${appURL}/blog/${blogPost.slug}`}
                />

                {/* JSON-LD Structured Data for SEO */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: blogPost.title,
                        description:
                            blogPost.meta_description ||
                            blogPost.sub_title ||
                            blogPost.title,
                        image:
                            blogPost.image ||
                            `${appURL}/assets/images/og-image.png`,
                        author: {
                            '@type': 'Person',
                            name: 'Muhammed Elfeqy',
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'Indxs',
                            logo: {
                                '@type': 'ImageObject',
                                url: `${appURL}/assets/images/Indxs-logo.png`,
                            },
                        },
                        datePublished: blogPost.published_at,
                        dateModified: blogPost.updated_at,
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': `${appURL}/blog/${blogPost.slug}`,
                        },
                    })}
                </script>
            </AppHead>
            <div className="min-h-screen">
                <Navbar />

                <main className="mx-auto max-w-4xl px-4 py-32 sm:px-6 lg:px-8">
                    <article>
                        {/* Header Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8 text-center"
                        >
                            {/* Publication Date */}
                            <div className="mb-4 flex justify-center">
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar
                                        size={16}
                                        className="mr-2"
                                    />
                                    {format(
                                        new Date(blogPost.published_at),
                                        'MMMM d, yyyy',
                                    )}
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                {blogPost.title}
                            </h1>

                            {/* Subtitle */}
                            {blogPost.sub_title && (
                                <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
                                    {blogPost.sub_title}
                                </p>
                            )}

                            {/* Categories */}
                            {blogPost.categories &&
                                blogPost.categories.length > 0 && (
                                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                                        {blogPost.categories.map(
                                            (category: Category) => (
                                                <Badge
                                                    key={category.id}
                                                    variant="secondary"
                                                    className="bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                                >
                                                    <Tag
                                                        size={12}
                                                        className="mr-1"
                                                    />
                                                    {category.name}
                                                </Badge>
                                            ),
                                        )}
                                    </div>
                                )}
                        </motion.div>

                        {/* Featured Image */}
                        {blogPost.image && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="aspect-w-16 aspect-h-9 relative mb-12 overflow-hidden rounded-xl"
                            >
                                <img
                                    src={blogPost.image}
                                    alt={blogPost.title}
                                    className="object-cover"
                                />
                            </motion.div>
                        )}

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="markdown-content"
                        >
                            {blogPost.content && (
                                <ReactMarkdown
                                    components={{
                                        h1: ({ node, ...props }) => (
                                            <h1
                                                className="mb-4 mt-8 text-3xl font-bold text-gray-900"
                                                {...props}
                                            />
                                        ),
                                        h2: ({ node, ...props }) => (
                                            <h2
                                                className="mb-4 mt-8 text-2xl font-bold text-gray-900"
                                                {...props}
                                            />
                                        ),
                                        h3: ({ node, ...props }) => (
                                            <h3
                                                className="mb-3 mt-6 text-xl font-bold text-gray-900"
                                                {...props}
                                            />
                                        ),
                                        h4: ({ node, ...props }) => (
                                            <h4
                                                className="mb-3 mt-6 text-lg font-bold text-gray-900"
                                                {...props}
                                            />
                                        ),
                                        p: ({ node, ...props }) => (
                                            <p
                                                className="mb-4 leading-relaxed text-gray-700"
                                                {...props}
                                            />
                                        ),
                                        a: ({ node, ...props }) => (
                                            <a
                                                className="text-primary underline hover:text-primary/80"
                                                {...props}
                                            />
                                        ),
                                        ul: ({ node, ...props }) => (
                                            <ul
                                                className="mb-4 list-disc pl-6"
                                                {...props}
                                            />
                                        ),
                                        ol: ({ node, ...props }) => (
                                            <ol
                                                className="mb-4 list-decimal pl-6"
                                                {...props}
                                            />
                                        ),
                                        li: ({ node, ...props }) => (
                                            <li
                                                className="mb-1"
                                                {...props}
                                            />
                                        ),
                                        blockquote: ({ node, ...props }) => (
                                            <blockquote
                                                className="my-4 border-l-4 border-primary/30 pl-4 italic text-gray-700"
                                                {...props}
                                            />
                                        ),
                                        img: ({ node, ...props }) => (
                                            <img
                                                className="my-4 h-auto max-w-full rounded-lg"
                                                {...props}
                                            />
                                        ),
                                        code({
                                            node,
                                            inline,
                                            className,
                                            children,
                                            ...props
                                        }) {
                                            const match = /language-(\w+)/.exec(
                                                className || '',
                                            )
                                            return !inline && match ? (
                                                <div className="my-6 overflow-hidden rounded-lg">
                                                    <SyntaxHighlighter
                                                        style={oneDark}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        className="rounded-lg border border-gray-200 bg-gray-800 text-white"
                                                        {...props}
                                                    >
                                                        {String(
                                                            children,
                                                        ).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                </div>
                                            ) : (
                                                <code
                                                    className="rounded bg-gray-200 px-1 py-0.5 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            )
                                        },
                                        table: ({ node, ...props }) => (
                                            <div className="my-6 overflow-x-auto">
                                                <table
                                                    className="min-w-full divide-y divide-gray-200 border"
                                                    {...props}
                                                />
                                            </div>
                                        ),
                                        thead: ({ node, ...props }) => (
                                            <thead
                                                className="bg-gray-50"
                                                {...props}
                                            />
                                        ),
                                        th: ({ node, ...props }) => (
                                            <th
                                                className="px-4 py-2 text-left text-sm font-medium text-gray-900"
                                                {...props}
                                            />
                                        ),
                                        td: ({ node, ...props }) => (
                                            <td
                                                className="px-4 py-2 text-sm text-gray-700"
                                                {...props}
                                            />
                                        ),
                                    }}
                                >
                                    {blogPost.content}
                                </ReactMarkdown>
                            )}
                        </motion.div>
                    </article>
                </main>

                <Footer />
            </div>
        </AnimatedGradientBackground>
    )
}

export default BlogPost
