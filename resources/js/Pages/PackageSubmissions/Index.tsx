import React, { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import UserLayout from '@/Layouts/UserLayout'
import { PackageSubmission as PackageSubmissionType } from '@/types'
import { Package, PlusCircle } from 'lucide-react'
import { PaginationControl } from '@/components/shared/pagination-control'

interface IndexProps {
    auth: {
        user: {
            id: number
            name: string
            email: string
        }
    }
    submissions: {
        data: PackageSubmission[]
        links: any
        meta: {
            current_page: number
            from: number
            last_page: number
            path: string
            per_page: number
            to: number
            total: number
        }
    }
}

interface PackageSubmission {
    id: number
    repository_url: string
    name: string | null
    description: string | null
    status: string
    created_at: string
    reviewed_at: string | null
    rejection_reason: string | null
}

export default function Index({ auth, submissions }: IndexProps) {
    const [isLoading, setIsLoading] = useState(false)
    const handlePageChange = (page: number) => {
        setIsLoading(true)
        const params: Record<string, any> = { page }

        router.get(route('app.user.packages.index'), params, {
            preserveState: true,
            onSuccess: () => {
                setIsLoading(false)
            },
            onError: () => {
                setIsLoading(false)
            },
        })
    }

    return (
        <UserLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        My Package Submissions
                    </h2>
                    <div className="flex items-center space-x-2">
                        <Link
                            href={route('app.user.packages.create')}
                            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90"
                        >
                            <PlusCircle size={16} />
                            Submit Package
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="My Package Submissions" />

            <div className="grid grid-cols-1 gap-6 p-4">
                <div className="rounded-xl bg-white shadow">
                    <div className="border-b border-border p-6">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                            <Package
                                size={18}
                                className="text-primary"
                            />{' '}
                            My Submissions
                        </h3>
                    </div>
                    <div className="p-6">
                        {submissions.data.length > 0 ? (
                            <div className="overflow-hidden rounded-lg border border-border">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="p-4 text-left text-sm font-medium text-gray-800">
                                                Repository
                                            </th>
                                            <th className="p-4 text-center text-sm font-medium text-gray-800">
                                                Status
                                            </th>
                                            <th className="p-4 text-center text-sm font-medium text-gray-800">
                                                Submitted
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {submissions.data.map(
                                            (submission: PackageSubmission) => (
                                                <tr
                                                    key={submission.id}
                                                    className="transition-colors hover:bg-gray-50"
                                                >
                                                    <td className="p-4">
                                                        <a
                                                            href={`${submission.repository_url}?ref=laravel-hub.com`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-medium text-primary hover:text-primary/80"
                                                        >
                                                            {
                                                                submission.repository_url
                                                            }
                                                        </a>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${
                                                                submission.status ===
                                                                'approved'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : submission.status ===
                                                                        'rejected'
                                                                      ? 'bg-red-100 text-red-800'
                                                                      : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                        >
                                                            {submission.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-center text-sm text-gray-600">
                                                        {new Date(
                                                            submission.created_at,
                                                        ).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="rounded-lg bg-gray-50 p-6 text-center">
                                <p className="text-gray-600">
                                    You haven't submitted any packages yet.
                                </p>
                                <p className="mt-4">
                                    <Link
                                        href={route('app.user.packages.create')}
                                        className="mx-auto flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90"
                                    >
                                        <PlusCircle size={16} />
                                        Submit your first package
                                    </Link>
                                </p>
                            </div>
                        )}

                        {submissions.meta.last_page > 1 && (
                            <div className="mt-12 flex justify-center">
                                <PaginationControl
                                    currentPage={submissions.meta.current_page}
                                    totalPages={submissions.meta.last_page}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}
