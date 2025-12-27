import UserLayout from '@/Layouts/UserLayout'
import { Head, Link } from '@inertiajs/react'
import {
    Package,
    MessageSquare,
    Users,
    BookOpen,
    Star,
    Activity,
    PlusCircle,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BlogPost, User } from '@/types'

export default function Home({
    user,
    popularBlogPosts,
}: {
    user: User
    popularBlogPosts: BlogPost[]
}) {
    // Sample data for demonstration
    const recentActivity = [
        {
            id: 1,
            type: 'comment',
            content: 'Commented on "Laravel Livewire Best Practices"',
            time: '2 hours ago',
        },
        {
            id: 2,
            type: 'like',
            content: 'Liked "Vue 3 Composition API Tutorial"',
            time: '1 day ago',
        },
        {
            id: 3,
            type: 'post',
            content: 'Posted "How to optimize React performance"',
            time: '3 days ago',
        },
    ]

    const userStats = [
        { label: 'Posts', value: 0, icon: MessageSquare },
        { label: 'Following', value: 0, icon: Users },
        { label: 'Packages', value: app.user.packages_count, icon: Package },
        { label: 'Reputation', value: 0, icon: Star },
    ]

    return (
        <UserLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Community Hub
                    </h2>
                    {/*<div className="flex items-center space-x-2">*/}
                    {/*    <motion.button*/}
                    {/*        whileHover={{ scale: 1.05 }}*/}
                    {/*        className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90"*/}
                    {/*    >*/}
                    {/*        <PlusCircle size={16} />*/}
                    {/*        New Post*/}
                    {/*    </motion.button>*/}
                    {/*</div>*/}
                </div>
            }
        >
            <Head title="Community Hub" />

            <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-12">
                {/* User Profile Card */}
                <div className="md:col-span-4">
                    <div className="rounded-xl bg-white shadow">
                        <div className="relative">
                            <div className="h-32 w-full rounded-t-xl bg-gradient-to-r from-primary to-secondary opacity-90"></div>
                            <div className="absolute -bottom-12 left-0 flex w-full justify-center">
                                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white">
                                    <Avatar className="h-full w-full rounded-lg object-cover">
                                        <AvatarImage
                                            src={user.avatar}
                                            alt={user.name}
                                        />
                                        <AvatarFallback className="rounded-lg">
                                            {user.name
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        </div>

                        <div className="mt-14 p-6 text-center">
                            <h2 className="mt-6 text-xl font-semibold text-gray-800">
                                {user?.name}
                            </h2>
                            <div className="text-xs text-gray-600">
                                @{user?.username}
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                {userStats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="flex flex-col items-center rounded-lg bg-gray-50 p-3 transition-all hover:bg-gray-100"
                                    >
                                        <div className="mb-1 rounded-full bg-primary/10 p-2 text-primary">
                                            <stat.icon size={16} />
                                        </div>
                                        <div className="text-xs font-medium text-gray-800">
                                            {stat.value}
                                        </div>
                                        <span className="text-xs text-gray-600">
                                            {stat.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-6 md:col-span-8">
                    {/* Activity Feed */}
                    <div className="rounded-xl bg-white shadow">
                        <div className="border-b border-border p-6">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                <Activity
                                    size={18}
                                    className="text-primary"
                                />{' '}
                                Recent Activity
                            </h3>
                        </div>
                        <div className="p-6">
                            {recentActivity.length > 0 ? (
                                <div className="space-y-4">
                                    {/*{recentActivity.map((item) => (*/}
                                    {/*    <div key={item.id} className="flex items-start gap-4 rounded-lg bg-muted/20 p-4 transition-all hover:bg-muted/30">*/}
                                    {/*        <div className="rounded-full bg-primary/10 p-2">*/}
                                    {/*            {item.type === 'comment' && <MessageSquare size={16} className="text-primary" />}*/}
                                    {/*            {item.type === 'like' && <Star size={16} className="text-primary" />}*/}
                                    {/*            {item.type === 'post' && <BookOpen size={16} className="text-primary" />}*/}
                                    {/*        </div>*/}
                                    {/*        <div className="flex-1">*/}
                                    {/*            <p className="text-sm text-foreground">{item.content}</p>*/}
                                    {/*            <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*))}*/}
                                    <div className="rounded-lg bg-gray-50 p-6 text-center">
                                        <p className="text-gray-600">
                                            No recent activity
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-lg bg-gray-50 p-6 text-center">
                                    <p className="text-gray-600">
                                        No recent activity
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Popular Topics */}
                    <div className="rounded-xl bg-white shadow">
                        <div className="border-b border-border p-6">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                <BookOpen
                                    size={18}
                                    className="text-primary"
                                />{' '}
                                Popular Topics
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="overflow-hidden rounded-lg border border-border">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="p-4 text-left text-sm font-medium text-gray-800">
                                                Topic
                                            </th>
                                            <th className="p-4 text-center text-sm font-medium text-gray-800">
                                                Replies
                                            </th>
                                            <th className="p-4 text-center text-sm font-medium text-gray-800">
                                                Views
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {popularBlogPosts.map((blogPost) => (
                                            <tr
                                                key={blogPost.id}
                                                className="transition-colors hover:bg-gray-50"
                                            >
                                                <td className="p-4">
                                                    <Link
                                                        href={route(
                                                            'blog.show',
                                                            blogPost.slug,
                                                        )}
                                                    >
                                                        <div className="font-medium text-gray-800">
                                                            {blogPost.title}
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td className="p-4 text-center text-sm text-gray-600">
                                                    0
                                                </td>
                                                <td className="p-4 text-center text-sm text-gray-600">
                                                    {blogPost.views_count}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Future Features Teaser */}
                    <div className="rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 p-6 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Coming Soon
                                </h3>
                                <p className="text-sm text-gray-600">
                                    We're working on exciting new community
                                    features!
                                </p>
                            </div>
                            <div className="rounded-full bg-white p-3 shadow-lg">
                                <Users
                                    size={24}
                                    className="text-primary"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                                Forums
                            </span>
                            <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary">
                                Community Links
                            </span>
                            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                                Package Submission
                            </span>
                            <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary">
                                And more...
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}
