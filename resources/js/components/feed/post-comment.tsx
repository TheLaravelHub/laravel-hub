import { useState } from 'react'
import { ArrowUp, ArrowDown, Reply } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Comment } from './post-card'
import { CustomToast } from '@/components/ui/custom-toast'
import axios from 'axios'

interface PostCommentProps {
    comment: Comment
    isReply?: boolean
    postId: number
    onReplyAdded?: (reply: Comment) => void
}

export function PostComment({
    comment,
    isReply = false,
    postId,
    onReplyAdded,
}: PostCommentProps) {
    const [isUpvoted, setIsUpvoted] = useState(comment.is_upvoted || false)
    const [isDownvoted, setIsDownvoted] = useState(
        comment.is_downvoted || false,
    )
    const [upvoteCount, setUpvoteCount] = useState(comment.upvotes)
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [replies, setReplies] = useState<Comment[]>(comment.replies || [])

    const handleUpvote = async () => {
        try {
            const response = await axios.post(
                route('app.feed.comments.vote', comment.id),
                {
                    vote_type: 'upvote',
                },
            )

            setUpvoteCount(response.data.upvotes)

            if (response.data.action === 'removed') {
                setIsUpvoted(false)
            } else {
                setIsUpvoted(true)
                if (isDownvoted) setIsDownvoted(false)
            }
        } catch (error) {
            CustomToast.error('Failed to update vote')
        }
    }

    const handleDownvote = async () => {
        try {
            const response = await axios.post(
                route('app.feed.comments.vote', comment.id),
                {
                    vote_type: 'downvote',
                },
            )

            setUpvoteCount(response.data.upvotes)

            if (response.data.action === 'removed') {
                setIsDownvoted(false)
            } else {
                setIsDownvoted(true)
                if (isUpvoted) setIsUpvoted(false)
            }
        } catch (error) {
            CustomToast.error('Failed to update vote')
        }
    }

    const handleReplySubmit = async () => {
        if (!replyText.trim() || isSubmitting) return

        setIsSubmitting(true)

        try {
            const response = await axios.post(
                route('app.feed.posts.comments.store', postId),
                {
                    content: replyText.trim(),
                    parent_id: comment.id,
                },
            )

            setReplies([response.data, ...replies])
            setReplyText('')
            setShowReplyForm(false)
            CustomToast.success('Reply posted!')
        } catch (error: any) {
            const message =
                error.response?.data?.message || 'Failed to post reply'
            CustomToast.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={cn('space-y-3', isReply && 'ml-8 sm:ml-12')}>
            <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0 rounded-full sm:h-10 sm:w-10">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback>
                        {comment.author.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1 space-y-2">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                                {comment.author.name}
                            </span>
                            <span className="text-xs text-gray-500">
                                @{comment.author.username}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                                {comment.created_at}
                            </span>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-gray-700">
                            {comment.content}
                        </p>
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Upvote */}
                        <Button
                            size="sm"
                            variant="ghost"
                            className={cn(
                                'h-7 gap-1 px-2',
                                isUpvoted &&
                                    'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary',
                            )}
                            onClick={handleUpvote}
                        >
                            <ArrowUp
                                size={14}
                                className={cn(isUpvoted && 'fill-current')}
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
                                'h-7 w-7 p-0',
                                isDownvoted &&
                                    'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-600',
                            )}
                            onClick={handleDownvote}
                        >
                            <ArrowDown
                                size={14}
                                className={cn(isDownvoted && 'fill-current')}
                            />
                        </Button>

                        {/* Reply Button - Only show if not a reply */}
                        {!isReply && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 gap-1 px-2"
                                onClick={() => setShowReplyForm(!showReplyForm)}
                            >
                                <Reply size={14} />
                                <span className="text-xs">Reply</span>
                            </Button>
                        )}
                    </div>

                    {showReplyForm && !isReply && (
                        <div className="pt-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) =>
                                        setReplyText(e.target.value)
                                    }
                                    placeholder="Write a reply..."
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            handleReplySubmit()
                                        }
                                    }}
                                />
                                <Button
                                    size="sm"
                                    className="h-9"
                                    onClick={handleReplySubmit}
                                    disabled={!replyText.trim() || isSubmitting}
                                >
                                    {isSubmitting ? 'Posting...' : 'Reply'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Replies */}
            {replies && replies.length > 0 && (
                <div className="space-y-3">
                    {replies.map((reply) => (
                        <PostComment
                            key={reply.id}
                            comment={reply}
                            isReply={true}
                            postId={postId}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
