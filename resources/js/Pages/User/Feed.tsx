import { useState, useEffect, useRef } from 'react'
import FeedLayout from '@/Layouts/FeedLayout'
import { Head, router, usePage } from '@inertiajs/react'
import { FeedSidebar, MobileFeedSidebar } from '@/components/feed/feed-sidebar'
import { PostCard, Post } from '@/components/feed/post-card'
import { PostModal } from '@/components/feed/post-modal'
import axios from 'axios'

interface FeedProps {
    posts: {
        data: Post[]
        links: {
            first: string | null
            last: string | null
            prev: string | null
            next: string | null
        }
        meta: {
            path: string
            per_page: number
            next_cursor: string | null
            prev_cursor: string | null
        }
    }
}

export default function Feed({ posts }: FeedProps) {
    const { url } = usePage()
    const urlParams = new URLSearchParams(window.location.search)
    const initialQuery = urlParams.get('query') || ''

    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [allPosts, setAllPosts] = useState<Post[]>(posts.data)
    const [isLoading, setIsLoading] = useState(false)
    const [nextCursor, setNextCursor] = useState<string | null>(
        posts.meta.next_cursor,
    )
    const [searchQuery, setSearchQuery] = useState<string>(initialQuery)
    const observerTarget = useRef<HTMLDivElement>(null)
    const initializedRef = useRef(false)

    // Initialize posts ONLY on first mount
    useEffect(() => {
        if (!initializedRef.current) {
            setAllPosts(posts.data)
            setNextCursor(posts.meta.next_cursor)
            initializedRef.current = true
        }
    }, [])

    const handlePostClick = (post: Post) => {
        setSelectedPost(post)
        setIsModalOpen(true)
    }

    const handlePostUpdate = (updatedPost: Post) => {
        // Update the post in the allPosts array
        setAllPosts((prev) =>
            prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
        )
        // Also update the selected post if it's the same
        if (selectedPost?.id === updatedPost.id) {
            setSelectedPost(updatedPost)
        }
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        // Use Inertia router to update URL with query parameter
        router.get(
            route('app.feed.home'),
            { query },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['posts'],
                onSuccess: (page: any) => {
                    setAllPosts(page.props.posts.data)
                    setNextCursor(page.props.posts.meta.next_cursor)
                },
            },
        )
    }

    const handleClearSearch = () => {
        setSearchQuery('')
        // Use Inertia router to clear query parameter
        router.get(
            route('app.feed.home'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['posts'],
                onSuccess: (page: any) => {
                    setAllPosts(page.props.posts.data)
                    setNextCursor(page.props.posts.meta.next_cursor)
                },
            },
        )
    }

    const loadMore = async () => {
        if (isLoading || !nextCursor) return

        setIsLoading(true)

        try {
            const params: any = { cursor: nextCursor }
            if (searchQuery) {
                params.query = searchQuery
            }

            const response = await axios.get('/api/feed', { params })

            const newPosts = response.data

            // Append new posts
            setAllPosts((prev) => [...prev, ...newPosts.data])
            setNextCursor(newPosts.meta.next_cursor)
        } catch (error) {
            console.error('Failed to load more posts:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && nextCursor && !isLoading) {
                    loadMore()
                }
            },
            { threshold: 0.1, rootMargin: '100px' },
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current)
            }
        }
    }, [nextCursor, isLoading])

    return (
        <FeedLayout
            searchQuery={searchQuery}
            onSearch={handleSearch}
            onClearSearch={handleClearSearch}
        >
            <Head title="Feed" />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto flex gap-4 p-4 sm:gap-6 sm:p-6 lg:gap-6">
                    {/* Desktop Sidebar */}
                    <FeedSidebar />

                    {/* Main Content */}
                    <main className="min-w-0 flex-1">
                        {/* Header with Mobile Menu */}
                        <div className="mb-4 flex items-center gap-3 sm:mb-6">
                            {/* Mobile Sidebar Trigger */}
                            <MobileFeedSidebar />

                            <div className="min-w-0 flex-1">
                                <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
                                    Your Feed
                                </h1>
                                <p className="mt-0.5 truncate text-xs text-gray-600 sm:mt-1 sm:text-sm">
                                    Discover the latest from the Laravel
                                    community
                                </p>
                            </div>
                        </div>

                        {/* Posts Grid - Responsive columns with Infinite Scroll */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {allPosts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onPostClick={handlePostClick}
                                    onPostUpdate={handlePostUpdate}
                                />
                            ))}
                        </div>

                        {/* Empty State */}
                        {allPosts.length === 0 && !isLoading && (
                            <div className="py-12 text-center">
                                <p className="text-lg text-gray-500">
                                    No posts available yet. Check back soon!
                                </p>
                            </div>
                        )}

                        {/* Loading indicator and intersection observer target */}
                        {nextCursor && (
                            <div
                                ref={observerTarget}
                                className="flex justify-center py-8"
                            >
                                {isLoading && (
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <svg
                                            className="h-5 w-5 animate-spin"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        <span className="text-sm">
                                            Loading more posts...
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Post Modal */}
            {selectedPost && (
                <PostModal
                    post={selectedPost}
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    onPostUpdate={handlePostUpdate}
                />
            )}
        </FeedLayout>
    )
}
