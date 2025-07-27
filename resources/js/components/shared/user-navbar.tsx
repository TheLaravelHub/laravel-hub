import { Link, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ChevronDown, Cog, LogOut, Package, User } from 'lucide-react'
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
        <header className="sticky top-0 z-50 w-full border-b border-border bg-white backdrop-blur-md">
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
                            src={'/assets/images/logo-icon.png'}
                            alt="Laravel Hub"
                            width={50}
                        />
                    </motion.div>
                </Link>

                {/* Navigation Links */}
                <div className="hidden items-center space-x-6 md:flex">
                    <motion.a
                        href={route('user.dashboard')}
                        className="text-gray-700 transition-colors hover:text-gray-900"
                        whileHover={{ scale: 1.05 }}
                    >
                        <span className="font-medium text-gray-700">Home</span>
                    </motion.a>
                    <motion.a
                        href={route('packages.index')}
                        className="text-gray-700 transition-colors hover:text-gray-900"
                        whileHover={{ scale: 1.05 }}
                    >
                        <span className="font-medium text-gray-700">
                            Packages
                        </span>
                    </motion.a>
                    <motion.a
                        href={route('blog.index')}
                        className="text-gray-700 transition-colors hover:text-gray-900"
                        whileHover={{ scale: 1.05 }}
                    >
                        <span className="font-medium text-gray-700">Blog</span>
                    </motion.a>
                    <motion.a
                        href="#"
                        className="text-gray-400 transition-colors hover:text-gray-600"
                        whileHover={{ scale: 1.05 }}
                    >
                        <span className="font-medium text-gray-400">
                            Forum (Coming soon)
                        </span>
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
                                className="text-gray-700"
                            />
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-border bg-white shadow-lg ring-1 ring-black ring-opacity-5">
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
                                            href={route('user.dashboard')}
                                            className="flex items-center gap-2 rounded-md px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        >
                                            <User
                                                size={16}
                                                className="text-primary"
                                            />
                                            <span>Profile</span>
                                        </Link>
                                        <Link
                                            href={route('user.packages.index')}
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
                                                'user.profile.information.edit',
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
