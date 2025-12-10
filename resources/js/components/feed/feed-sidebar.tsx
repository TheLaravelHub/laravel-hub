import { Link, usePage } from '@inertiajs/react'
import {
    Home,
    Heart,
    Bookmark,
    TrendingUp,
    Clock,
    Menu,
    X,
    User,
    User2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'

interface NavItem {
    name: string
    icon: React.ComponentType<{ size?: number; className?: string }>
    href: string
    active?: boolean
    badge?: number
}

const useNavItems = () => {
    const { url } = usePage()

    return [
        {
            name: 'Home',
            icon: Home,
            href: route('app.feed.home'),
            active: url === route('app.feed.home'),
        },
        {
            name: 'Bookmarks',
            icon: Bookmark,
            href: route('app.feed.bookmarks'),
            active: url === route('app.feed.bookmarks'),
        },
        {
            name: 'Trending',
            icon: TrendingUp,
            href: '#',
            active: false,
        },
        {
            name: 'For You',
            icon: User2,
            href: '#',
            active: false,
        },
        {
            name: 'Recent',
            icon: Clock,
            href: '#',
            active: false,
        },
    ]
}

function SidebarContent() {
    const navItems = useNavItems()

    return (
        <>
            <nav className="space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isExternal = item.href.startsWith('#')

                    if (isExternal) {
                        return (
                            <button
                                key={item.name}
                                disabled
                                className={cn(
                                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                    'cursor-not-allowed text-gray-400 opacity-60',
                                )}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                                {item.badge && (
                                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                        {item.badge}
                                    </span>
                                )}
                                <span className="ml-auto text-xs text-gray-400">
                                    (Soon)
                                </span>
                            </button>
                        )
                    }

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                item.active
                                    ? 'bg-primary/10 text-primary shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                            )}
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                            {item.badge && (
                                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-6 border-t border-gray-100 pt-4">
                <div className="rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
                    <h3 className="text-sm font-semibold text-gray-800">
                        Coming Soon
                    </h3>
                    <p className="mt-1 text-xs text-gray-600">
                        More features are on the way to enhance your feed
                        experience.
                    </p>
                </div>
            </div>
        </>
    )
}

export function FeedSidebar() {
    return (
        <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-64 flex-shrink-0 lg:block">
            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                <SidebarContent />
            </div>
        </aside>
    )
}

export function MobileFeedSidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="w-[280px] sm:w-[320px]"
            >
                <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                    <SidebarContent />
                </div>
            </SheetContent>
        </Sheet>
    )
}
