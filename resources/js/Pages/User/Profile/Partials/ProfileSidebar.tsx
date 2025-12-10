import { Link } from '@inertiajs/react'
import { User, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProfileSidebarProps {
    activeTab: string
}

export default function ProfileSidebar({ activeTab }: ProfileSidebarProps) {
    return (
        <div className="rounded-xl bg-white shadow">
            <div className="border-b border-border p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <User
                        size={18}
                        className="text-primary"
                    />{' '}
                    Profile Settings
                </h3>
            </div>
            <div className="p-4">
                <nav className="space-y-1">
                    <Link
                        href={route('app.user.profile.information.edit')}
                        className={cn(
                            'flex items-center gap-2 rounded-md p-2 transition-colors',
                            activeTab === 'information'
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-800 hover:bg-gray-100',
                        )}
                    >
                        <User size={16} />
                        <span>Personal Information</span>
                    </Link>
                    <Link
                        href={route('app.user.profile.security.edit')}
                        className={cn(
                            'flex items-center gap-2 rounded-md p-2 transition-colors',
                            activeTab === 'security'
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-800 hover:bg-gray-100',
                        )}
                    >
                        <Shield size={16} />
                        <span>Security</span>
                    </Link>
                </nav>
            </div>
        </div>
    )
}
