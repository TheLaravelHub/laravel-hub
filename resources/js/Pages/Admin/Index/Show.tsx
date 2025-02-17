import { Head, Link, useForm } from '@inertiajs/react'
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Index } from '@/types'
import Image from '@/components/image'

interface ShowIndexProps {
    index: Index
}

const Show = ({ index }: ShowIndexProps) => {
    return (
        <AdminAuthenticatedLayout
            breadcrumbs={[
                { title: 'Indexes', link: route('admin.indexes.index') },
                {
                    title: `Show: ${index.name}`,
                },
            ]}
        >
            <Head title={`Indexes | Show: ${index.name}`} />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="mb-4 flex w-full items-center justify-between px-4 pt-4">
                    <h1 className="text-2xl font-semibold">
                        Show: {index.name}
                    </h1>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.indexes.edit', index.id)}
                            className="btn-primary"
                        >
                            Edit
                        </Link>
                    </div>
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-gray-50 shadow dark:bg-gray-900 md:min-h-min">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="grid grid-cols-8 gap-4">
                            <div className="col-span-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">
                                            Basic Data
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col justify-between gap-4">
                                        <div className="flex justify-between gap-4">
                                            <div className="flex flex-col gap-1">
                                                <span>Name</span>
                                                <span className="font-bold">
                                                    {index.name}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span>Slug</span>
                                                <span className="font-bold">
                                                    {index.slug}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span>Description</span>
                                            <span className="font-bold">
                                                {index.description}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="col-span-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">
                                            Icon
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col justify-between gap-4">
                                        <div className="flex justify-between gap-4">
                                            <div className="flex flex-col gap-1">
                                                <span>Icon</span>
                                                <Image
                                                    src={index.icon}
                                                    alt={index.name}
                                                    className="h-12 w-12 rounded-full"
                                                />
                                            </div>
                                            {/*Status*/}
                                            <div className="flex flex-col gap-1">
                                                <span>Status</span>
                                                <span className="font-bold">
                                                    {index.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span>Icon Color</span>
                                                <span
                                                    title={index.color_code}
                                                    style={{
                                                        backgroundColor:
                                                            index.color_code,
                                                    }}
                                                    className={`h-12 w-12 rounded`}
                                                ></span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    )
}

export default Show
