import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { LibraryBig } from 'lucide-react'

interface DashboardProps {
    packagesCount: number
    activePackagesCount: number
    inActivePackagesCount: number
}

export default function Dashboard({
    packagesCount,
    activePackagesCount,
    inActivePackagesCount,
}: DashboardProps) {
    const activePercentage = (
        (activePackagesCount / packagesCount) *
        100
    ).toFixed(2)
    const inActivePercentage = (
        (inActivePackagesCount / packagesCount) *
        100
    ).toFixed(2)
    return (
        <AdminAuthenticatedLayout breadcrumbs={[{ title: 'Dashboard' }]}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {/* TODO: Dashboard Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                            <div className="text-md font-medium tracking-tight">
                                Packages
                            </div>
                            <LibraryBig />
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">
                                {packagesCount}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Active packages:{' '}
                                <span className="text-green-500">
                                    {activePackagesCount}
                                </span>{' '}
                                ({`${activePercentage} %`})
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Deactivated packages:{' '}
                                <span className="text-red-500">
                                    {inActivePackagesCount}
                                </span>{' '}
                                ({`${inActivePercentage} %`})
                            </p>
                        </div>
                    </div>
                </div>

                <div className="min-h-[100vh] flex-1 rounded-xl bg-gray-50 shadow dark:bg-gray-900 md:min-h-min">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        You're logged in!
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    )
}
