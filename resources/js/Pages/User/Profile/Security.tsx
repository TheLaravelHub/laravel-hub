import UserLayout from '@/Layouts/UserLayout'
import { PageProps } from '@/types'
import { Head } from '@inertiajs/react'
import { Shield } from 'lucide-react'
import UpdatePasswordForm from './Partials/UpdatePasswordForm'
import ProfileSidebar from './Partials/ProfileSidebar'

export default function Security({
    activeTab,
}: PageProps<{ activeTab: string }>) {
    return (
        <UserLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Profile Settings
                    </h2>
                </div>
            }
        >
            <Head title="Security Settings" />

            <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-12">
                {/* Sidebar with profile sections */}
                <div className="md:col-span-3">
                    <ProfileSidebar activeTab={activeTab} />
                </div>

                {/* Main content */}
                <div className="space-y-6 md:col-span-9">
                    <div className="rounded-xl bg-white shadow">
                        <div className="border-b border-border p-6">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                <Shield
                                    size={18}
                                    className="text-primary"
                                />{' '}
                                Password Settings
                            </h3>
                        </div>
                        <div className="p-6">
                            <UpdatePasswordForm className="w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}
