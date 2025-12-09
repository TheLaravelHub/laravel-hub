import { useState, useEffect, useRef } from 'react'
import {
    ArrowUp,
    ArrowDown,
    MessageSquare,
    Bookmark,
    Link as LinkIcon,
    ExternalLink,
    Play,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { CustomToast } from '@/components/ui/custom-toast'
import { Post, Comment } from './post-card'
import { PostComment } from './post-comment'
import axios from 'axios'
import { Link } from '@inertiajs/react'

interface PostModalProps {
    post: Post
    open: boolean
    onOpenChange: (open: boolean) => void
    onPostUpdate?: (updatedPost: Post) => void
}

export function PostModal({
    post,
    open,
    onOpenChange,
    onPostUpdate,
}: PostModalProps) {
    const [isUpvoted, setIsUpvoted] = useState(post.is_upvoted || false)
    const [isDownvoted, setIsDownvoted] = useState(post.is_downvoted || false)
    const [isBookmarked, setIsBookmarked] = useState(
        post.is_bookmarked || false,
    )
    const [upvoteCount, setUpvoteCount] = useState(post.upvotes)
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState<Comment[]>(
        post.comments_data || [],
    )
    const [isSubmitting, setIsSubmitting] = useState(false)
    const commentTextareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (open && commentTextareaRef.current) {
            // Small delay to ensure modal is fully rendered
            setTimeout(() => {
                commentTextareaRef.current?.focus()
            }, 100)
        }
    }, [open])

    const handleUpvote = async () => {
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

    const handleDownvote = async () => {
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

    const handleBookmark = async () => {
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

    const handleShare = async () => {
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

    const handleCommentSubmit = async () => {
        if (!commentText.trim() || isSubmitting) return

        setIsSubmitting(true)

        try {
            const response = await axios.post(
                route('app.feed.posts.comments.store', post.id),
                {
                    content: commentText.trim(),
                },
            )
            // Add the new comment to the list
            setComments([response.data, ...comments])
            setCommentText('')
            CustomToast.success('Comment posted!')
        } catch (error: any) {
            const message =
                error.response?.data?.message || 'Failed to post comment'
            CustomToast.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col gap-0 overflow-hidden p-0">
                {/* Header - Fixed */}
                <div className="flex-shrink-0 border-b border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center justify-between gap-4 pr-8">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                            <img
                                src={post.source.logo}
                                alt={post.source.name}
                                className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                            />
                            <div className="min-w-0 flex-1">
                                <h3 className="truncate font-semibold text-gray-900">
                                    {post.source.name}
                                </h3>
                                <p className="truncate text-sm text-gray-600">
                                    {post.title}
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={handleReadPost}
                            className="flex-shrink-0 gap-2"
                        >
                            {post.source.type === 'video' ? (
                                <>
                                    <Play size={16} />
                                    <span className="hidden sm:inline">
                                        Watch Video
                                    </span>
                                </>
                            ) : (
                                <>
                                    <ExternalLink size={16} />
                                    <span className="hidden sm:inline">
                                        Read Post
                                    </span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Body - Scrollable */}
                <div className="custom-scrollbar flex-1 overflow-y-auto">
                    <div className="space-y-6 p-4 sm:p-6">
                        {/* Post Content */}
                        <div className="space-y-4">
                            {/* Title */}
                            <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                                {post.title}
                            </h1>

                            {/* Subtitle */}
                            {post.subtitle && (
                                <h2 className="text-lg leading-relaxed text-gray-700 sm:text-xl">
                                    {post.subtitle}
                                </h2>
                            )}

                            {/* Image */}
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Excerpt */}
                            {post.excerpt && (
                                <div className="prose prose-gray max-w-none">
                                    <p className="leading-relaxed text-gray-700">
                                        {post.excerpt}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="border-y border-gray-200 py-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-1">
                                    {/* Upvote */}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className={cn(
                                            'h-9 gap-1.5 px-3',
                                            isUpvoted &&
                                                'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary',
                                        )}
                                        onClick={handleUpvote}
                                    >
                                        <ArrowUp
                                            size={18}
                                            className={cn(
                                                isUpvoted && 'fill-current',
                                            )}
                                        />
                                        <span className="text-sm font-medium">
                                            {upvoteCount}
                                        </span>
                                    </Button>

                                    {/* Downvote */}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className={cn(
                                            'h-9 w-9 p-0',
                                            isDownvoted &&
                                                'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-600',
                                        )}
                                        onClick={handleDownvote}
                                    >
                                        <ArrowDown
                                            size={18}
                                            className={cn(
                                                isDownvoted && 'fill-current',
                                            )}
                                        />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-1">
                                    {/* Comments */}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-9 gap-1.5 px-3"
                                        onClick={() =>
                                            commentTextareaRef.current?.focus()
                                        }
                                    >
                                        <MessageSquare size={18} />
                                        <span className="text-sm">
                                            {comments.length}
                                        </span>
                                    </Button>

                                    {/* Bookmark */}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className={cn(
                                            'h-9 w-9 p-0',
                                            isBookmarked &&
                                                'bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-600',
                                        )}
                                        onClick={handleBookmark}
                                    >
                                        <Bookmark
                                            size={18}
                                            className={cn(
                                                isBookmarked && 'fill-current',
                                            )}
                                        />
                                    </Button>

                                    {/* Share */}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-9 w-9 p-0"
                                        onClick={handleShare}
                                    >
                                        <LinkIcon size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Add Comment */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Comments ({comments.length})
                            </h3>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <textarea
                                        ref={commentTextareaRef}
                                        value={commentText}
                                        onChange={(e) =>
                                            setCommentText(e.target.value)
                                        }
                                        placeholder="Write a comment..."
                                        rows={3}
                                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    <div className="mt-2 flex justify-end">
                                        <Button
                                            size="sm"
                                            onClick={handleCommentSubmit}
                                            disabled={
                                                !commentText.trim() ||
                                                isSubmitting
                                            }
                                        >
                                            {isSubmitting
                                                ? 'Posting...'
                                                : 'Post Comment'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-4 pb-6">
                            {comments.length === 0 ? (
                                <p className="py-8 text-center text-gray-500">
                                    No comments yet. Be the first to comment!
                                </p>
                            ) : (
                                comments.map((comment) => (
                                    <PostComment
                                        key={comment.id}
                                        comment={comment}
                                        postId={post.id}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
