import { Link, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ChevronDown, Cog, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import Image from '@/components/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function UserNavbar() {
    const { auth } = usePage().props as any
    const user = auth.user
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link
                    href={route('homepage')}
                    className="flex items-center space-x-2"
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
                            src={'/assets/images/Indxs-logo.png'}
                            alt="Indxs"
                            width={100}
                        />
                    </motion.div>
                </Link>

                {/* Navigation Links */}
                <div className="hidden items-center space-x-6 md:flex">
                    <motion.a
                        href={route('user.dashboard')}
                        className="text-foreground/80 transition-colors hover:text-foreground"
                        whileHover={{ scale: 1.05 }}
                    >
                        <span className="font-medium">Home</span>
                    </motion.a>
                    <motion.a
                        href={route('packages.index')}
                        className="text-foreground/80 transition-colors hover:text-foreground"
                        whileHover={{ scale: 1.05 }}
                    >
                        <span className="font-medium">Packages</span>
                    </motion.a>
                    <motion.a
                        href={route('blog.index')}
                        className="text-foreground/80 transition-colors hover:text-foreground"
                        whileHover={{ scale: 1.05 }}
                    >
                        <span className="font-medium">Blog</span>
                    </motion.a>
                    <motion.a
                        href="#"
                        className="text-opacity-0"
                        whileHover={{ scale: 1.05 }}
                    >
                        <span className="font-medium">Forum (Coming soon)</span>
                    </motion.a>
                </div>

                {/* Right Side - User Menu */}
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div
                            onClick={toggleDropdown}
                            className="flex cursor-pointer items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <div className="relative">
                                <Avatar className="rounded-lg">
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {user.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
                                </span>
                            </div>
                            <ChevronDown
                                size={16}
                                className="text-foreground/70"
                            />
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-border bg-card shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="p-2 text-sm text-foreground">
                                    <div className="max-w-full border-b border-border px-4 py-2">
                                        <p
                                            className="truncate font-medium"
                                            title={user?.name}
                                        >
                                            {user?.name}
                                        </p>
                                        <p
                                            className="truncate text-xs text-muted-foreground"
                                            title={user?.email}
                                        >
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        <Link
                                            href={route('user.dashboard')}
                                            className="flex items-center gap-2 rounded-md px-4 py-2 hover:bg-muted/50"
                                        >
                                            <User
                                                size={16}
                                                className="text-primary"
                                            />
                                            <span>Profile</span>
                                        </Link>
                                        <Link
                                            href={route(
                                                'user.profile.information.edit',
                                            )}
                                            className="flex items-center gap-2 rounded-md px-4 py-2 hover:bg-muted/50"
                                        >
                                            <Cog
                                                size={16}
                                                className="text-primary"
                                            />
                                            <span>Settings</span>
                                        </Link>
                                        <Link
                                            href={route('logout')}
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
