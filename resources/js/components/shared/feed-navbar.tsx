import { Link, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import {
    ChevronDown,
    Cog,
    LogOut,
    Package,
    Search,
    User,
    X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Image from '@/components/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'

interface FeedNavbarProps {
    searchQuery?: string
    onSearch?: (query: string) => void
    onClearSearch?: () => void
}

export function FeedNavbar({
    searchQuery = '',
    onSearch,
    onClearSearch,
}: FeedNavbarProps) {
    const { auth } = usePage().props as any
    const user = auth.user
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
    const searchInputRef = useRef<HTMLInputElement>(null)

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    useEffect(() => {
        setLocalSearchQuery(searchQuery)
    }, [searchQuery])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault()
                searchInputRef.current?.focus()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (localSearchQuery.trim()) {
            onSearch?.(localSearchQuery.trim())
        }
    }

    const handleClearSearch = () => {
        setLocalSearchQuery('')
        onClearSearch?.()
        searchInputRef.current?.focus()
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-white backdrop-blur-md">
            <div className="mx-auto flex h-14 items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4 md:px-6">
                {/* Logo */}
                <Link
                    href={route('app.feed.home')}
                    className="flex flex-shrink-0 items-center"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 10,
                        }}
                    >
                        <Image
                            src={'/assets/images/logo.png'}
                            alt="Laravel Hub"
                            width={140}
                            className="sm:w-[50px]"
                        />
                    </motion.div>
                </Link>

                {/* Search Input */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="relative max-w-xl flex-1"
                >
                    <div className="relative">
                        <Search
                            className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 sm:left-3"
                            size={16}
                        />
                        <Input
                            ref={searchInputRef}
                            type="text"
                            value={localSearchQuery}
                            onChange={(e) =>
                                setLocalSearchQuery(e.target.value)
                            }
                            placeholder="Search posts..."
                            className="h-9 w-full rounded-lg border border-border pl-8 pr-16 text-sm focus:ring-2 focus:ring-primary/20 sm:h-10 sm:pl-10 sm:pr-20"
                        />
                        {localSearchQuery ? (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 sm:right-3"
                                title="Clear search"
                            >
                                <X size={16} />
                            </button>
                        ) : (
                            <div className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5 sm:right-3">
                                <kbd className="hidden rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 sm:inline-block">
                                    Ctrl
                                </kbd>
                                <span className="hidden text-xs text-gray-400 sm:inline-block">
                                    +
                                </span>
                                <kbd className="hidden rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 sm:inline-block">
                                    K
                                </kbd>
                            </div>
                        )}
                    </div>
                </form>

                {/* Right Side - User Menu */}
                <div className="flex flex-shrink-0 items-center">
                    <div className="relative">
                        <div
                            onClick={toggleDropdown}
                            className="flex cursor-pointer items-center space-x-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 sm:space-x-2"
                        >
                            <div className="relative">
                                <Avatar className="h-8 w-8 rounded-lg sm:h-10 sm:w-10">
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="rounded-lg text-xs sm:text-sm">
                                        {user.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5 sm:-right-1 sm:-top-1 sm:h-3 sm:w-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary sm:h-3 sm:w-3"></span>
                                </span>
                            </div>
                            <ChevronDown
                                size={14}
                                className="hidden text-gray-700 sm:block"
                            />
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md border border-border bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="p-2 text-sm text-gray-800">
                                    <div className="max-w-full border-b border-border px-4 py-2">
                                        <p
                                            className="truncate font-medium text-gray-800"
                                            title={user?.name}
                                        >
                                            {user?.name}
                                        </p>
                                        <p
                                            className="truncate text-xs text-gray-600"
                                            title={user?.email}
                                        >
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        <Link
                                            href={route(
                                                'app.user.packages.index',
                                            )}
                                            className="flex items-center gap-2 rounded-md px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        >
                                            <Package
                                                size={16}
                                                className="text-primary"
                                            />
                                            <span>My Packages</span>
                                        </Link>
                                        <Link
                                            href={route(
                                                'app.user.profile.information.edit',
                                            )}
                                            className="flex items-center gap-2 rounded-md px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        >
                                            <Cog
                                                size={16}
                                                className="text-primary"
                                            />
                                            <span>Settings</span>
                                        </Link>
                                        <Link
                                            href={route('app.logout')}
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-left hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
