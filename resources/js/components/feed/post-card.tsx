import { useState } from 'react'
import {
    ArrowUp,
    ArrowDown,
    MessageSquare,
    Bookmark,
    Link as LinkIcon,
    MoreVertical,
    ExternalLink,
    BookmarkCheck,
    EyeOff,
    Flag,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CustomToast } from '@/components/ui/custom-toast'
import axios from 'axios'

export interface Post {
    id: number
    title: string
    slug: string
    subtitle?: string
    image: string
    source: {
        id: number
        name: string
        slug: string
        logo: string
        type: 'article' | 'video'
    }
    url: string
    excerpt?: string
    content?: string
    published_at: string
    upvotes: number
    downvotes: number
    comments: number
    bookmarks: number
    shares: number
    views: number
    tags: string[]
    is_upvoted: boolean
    is_downvoted: boolean
    is_bookmarked: boolean
    comments_data?: Comment[]
}

export interface Comment {
    id: number
    content: string
    upvotes: number
    downvotes: number
    created_at: string
    is_upvoted: boolean
    is_downvoted: boolean
    author: {
        id: number
        name: string
        username: string
        avatar: string
    }
    replies: Comment[]
}

interface PostCardProps {
    post: Post
    onPostClick?: (post: Post) => void
    onPostUpdate?: (updatedPost: Post) => void
}

export function PostCard({ post, onPostClick, onPostUpdate }: PostCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [isUpvoted, setIsUpvoted] = useState(post.is_upvoted || false)
    const [isDownvoted, setIsDownvoted] = useState(post.is_downvoted || false)
    const [isBookmarked, setIsBookmarked] = useState(
        post.is_bookmarked || false,
    )
    const [upvoteCount, setUpvoteCount] = useState(post.upvotes)

    const handleUpvote = async (e: React.MouseEvent) => {
        e.stopPropagation()

        try {
            const response = await axios.post(
                route('app.feed.posts.vote', post.id),
                {
                    vote_type: 'upvote',
                },
            )

            setUpvoteCount(response.data.upvotes)

            const newIsUpvoted = response.data.action !== 'removed'
            const newIsDownvoted = newIsUpvoted ? false : isDownvoted

            setIsUpvoted(newIsUpvoted)
            if (newIsUpvoted && isDownvoted) setIsDownvoted(false)

            // Update parent component
            onPostUpdate?.({
                ...post,
                upvotes: response.data.upvotes,
                is_upvoted: newIsUpvoted,
                is_downvoted: newIsDownvoted,
            })
        } catch (error) {
            CustomToast.error('Failed to update vote')
        }
    }

    const handleDownvote = async (e: React.MouseEvent) => {
        e.stopPropagation()

        try {
            const response = await axios.post(
                route('app.feed.posts.vote', post.id),
                {
                    vote_type: 'downvote',
                },
            )

            setUpvoteCount(response.data.upvotes)

            const newIsDownvoted = response.data.action !== 'removed'
            const newIsUpvoted = newIsDownvoted ? false : isUpvoted

            setIsDownvoted(newIsDownvoted)
            if (newIsDownvoted && isUpvoted) setIsUpvoted(false)

            // Update parent component
            onPostUpdate?.({
                ...post,
                upvotes: response.data.upvotes,
                is_upvoted: newIsUpvoted,
                is_downvoted: newIsDownvoted,
            })
        } catch (error) {
            CustomToast.error('Failed to update vote')
        }
    }

    const handleBookmark = async (e: React.MouseEvent) => {
        e.stopPropagation()

        try {
            const response = await axios.post(
                route('app.feed.posts.bookmark', post.id),
            )

            setIsBookmarked(response.data.is_bookmarked)
            CustomToast.success(
                response.data.is_bookmarked
                    ? 'Added to bookmarks'
                    : 'Removed from bookmarks',
            )

            // Update parent component
            onPostUpdate?.({
                ...post,
                is_bookmarked: response.data.is_bookmarked,
            })
        } catch (error) {
            CustomToast.error('Failed to update bookmark')
        }
    }

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation()

        try {
            if (!post.url) {
                CustomToast.error('No URL available to copy')
                return
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(post.url)
                CustomToast.success('Link copied to clipboard!')
            } else {
                // Fallback for older browsers or non-secure contexts
                const textArea = document.createElement('textarea')
                textArea.value = post.url
                textArea.style.position = 'fixed'
                textArea.style.left = '-999999px'
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()
                try {
                    document.execCommand('copy')
                    CustomToast.success('Link copied to clipboard!')
                } catch (err) {
                    CustomToast.error('Failed to copy link')
                }
                document.body.removeChild(textArea)
            }
        } catch (error) {
            CustomToast.error('Failed to copy link')
        }
    }

    const handleReadPost = () => {
        window.open(post.url, '_blank')
    }

    return (
        <motion.article
            className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg sm:rounded-xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -4 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-1.5 p-3 pb-2 sm:gap-2 sm:p-4 sm:pb-3">
                <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
                    <img
                        src={post.source.logo}
                        alt={post.source.name}
                        className="h-5 w-5 flex-shrink-0 rounded-full object-cover sm:h-6 sm:w-6"
                    />
                    <span className="truncate text-xs font-medium text-gray-700">
                        {post.source.name}
                    </span>
                </div>

                <div className="flex flex-shrink-0 items-center gap-0.5 sm:gap-1">
                    {/* Read Post Button - Hidden until hover on desktop, always hidden on mobile */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: isHovered ? 1 : 0,
                            scale: isHovered ? 1 : 0.8,
                        }}
                        transition={{ duration: 0.2 }}
                        className="hidden md:block"
                    >
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 gap-1 px-2 text-xs sm:h-8"
                            onClick={handleReadPost}
                        >
                            <ExternalLink size={14} />
                            <span className="hidden lg:inline">Read</span>
                        </Button>
                    </motion.div>

                    {/* Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 sm:h-8 sm:w-8"
                            >
                                <MoreVertical
                                    size={14}
                                    className="sm:hidden"
                                />
                                <MoreVertical
                                    size={16}
                                    className="hidden sm:block"
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-48"
                        >
                            <DropdownMenuItem
                                onClick={handleReadPost}
                                className="md:hidden"
                            >
                                <ExternalLink size={16} />
                                <span>Read Post</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleShare}>
                                <LinkIcon size={16} />
                                <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleBookmark}>
                                {isBookmarked ? (
                                    <>
                                        <BookmarkCheck size={16} />
                                        <span>Remove bookmark</span>
                                    </>
                                ) : (
                                    <>
                                        <Bookmark size={16} />
                                        <span>Bookmark</span>
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-gray-600">
                                <EyeOff size={16} />
                                <span>Hide</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-600">
                                <Flag size={16} />
                                <span>Report</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Body - Clickable */}
            <div
                className="flex flex-1 cursor-pointer flex-col"
                onClick={() => onPostClick?.(post)}
            >
                {/* Post Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                {/* Title */}
                <div className="flex flex-1 flex-col p-3 pt-2.5 sm:p-4 sm:pt-3">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-primary">
                        {post.title}
                    </h3>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-1.5 border-t border-gray-100 p-2.5 sm:gap-2 sm:p-3">
                <div className="flex items-center gap-0.5 sm:gap-1">
                    {/* Upvote */}
                    <Button
                        size="sm"
                        variant="ghost"
                        className={cn(
                            'h-7 gap-0.5 px-1.5 sm:h-8 sm:gap-1 sm:px-2',
                            isUpvoted &&
                                'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary',
                        )}
                        onClick={handleUpvote}
                    >
                        <ArrowUp
                            size={14}
                            className={cn(
                                'sm:h-4 sm:w-4',
                                isUpvoted && 'fill-current',
                            )}
                        />
                        <span className="text-xs font-medium">
                            {upvoteCount}
                        </span>
                    </Button>

                    {/* Downvote */}
                    <Button
                        size="sm"
                        variant="ghost"
                        className={cn(
                            'h-7 w-7 p-0 sm:h-8 sm:w-8',
                            isDownvoted &&
                                'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-600',
                        )}
                        onClick={handleDownvote}
                    >
                        <ArrowDown
                            size={14}
                            className={cn(
                                'sm:h-4 sm:w-4',
                                isDownvoted && 'fill-current',
                            )}
                        />
                    </Button>
                </div>

                <div className="flex items-center gap-0.5 sm:gap-1">
                    {/* Comments */}
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 gap-0.5 px-1.5 sm:h-8 sm:gap-1 sm:px-2"
                        onClick={(e) => {
                            e.stopPropagation()
                            onPostClick?.(post)
                        }}
                    >
                        <MessageSquare
                            size={14}
                            className="sm:h-4 sm:w-4"
                        />
                        <span className="text-xs">{post.comments}</span>
                    </Button>

                    {/* Bookmark */}
                    <Button
                        size="sm"
                        variant="ghost"
                        className={cn(
                            'h-7 w-7 p-0 sm:h-8 sm:w-8',
                            isBookmarked &&
                                'bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-600',
                        )}
                        onClick={handleBookmark}
                    >
                        <Bookmark
                            size={14}
                            className={cn(
                                'sm:h-4 sm:w-4',
                                isBookmarked && 'fill-current',
                            )}
                        />
                    </Button>

                    {/* Share - Hidden on smallest mobile screens */}
                    <Button
                        size="sm"
                        variant="ghost"
                        className="xs:flex hidden h-7 w-7 p-0 sm:h-8 sm:w-8"
                        onClick={handleShare}
                    >
                        <LinkIcon
                            size={14}
                            className="sm:h-4 sm:w-4"
                        />
                    </Button>
                </div>
            </div>
        </motion.article>
    )
}
