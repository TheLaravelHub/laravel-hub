import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'

export default function Home() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Home
                </h2>
            }
        >
            <Head title="Home" />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {/* TODO: User Cards */}

                <div className="min-h-[100vh] flex-1 rounded-xl bg-gray-50 shadow dark:bg-gray-900 md:min-h-min">
                    <div className="p-6 text-2xl text-gray-900 dark:text-gray-100">
                        Still working on some new features, stay tuned !!
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
