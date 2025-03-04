import { Head, Link } from '@inertiajs/react'
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package } from '@/types'
import Image from '@/components/image'
import { Badge } from '@/components/ui/badge'
import { SquareArrowOutUpRight } from 'lucide-react'

interface ShowPackageProps {
    package: Package
}

const Show = ({ package: singlePackage }: ShowPackageProps) => {
    return (
        <AdminAuthenticatedLayout
            breadcrumbs={[
                {
                    title: 'Package',
                    link: route('admin.packages.packages.index'),
                },
                {
                    title: `Show: ${singlePackage.name}`,
                },
            ]}
        >
            <Head title={`Package | Show: ${singlePackage.name}`} />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="mb-4 flex w-full items-center justify-between px-4 pt-4">
                    <h1 className="text-2xl font-semibold">
                        Show Package: {singlePackage.name}
                    </h1>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route(
                                'admin.packages.packages.edit',
                                singlePackage.id,
                            )}
                            className="btn-primary"
                        >
                            Edit
                        </Link>
                    </div>
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-gray-50 shadow dark:bg-gray-900 md:min-h-min">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-8 space-y-6">
                                <Card>
                                    <CardContent className="flex flex-col justify-between gap-4 p-4">
                                        <div className="flex flex-col gap-1">
                                            <span>Index</span>
                                            <span className="font-bold">
                                                {singlePackage.index.name}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span>Categories</span>
                                            <span className="font-bold">
                                                {singlePackage.categories.map(
                                                    (category) => (
                                                        <Badge
                                                            key={category.id}
                                                            variant={'outline'}
                                                            className={'mr-1'}
                                                        >
                                                            {category.name}
                                                        </Badge>
                                                    ),
                                                )}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">
                                            Basic Data
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col justify-between gap-4">
                                        <div className="flex flex-col gap-1">
                                            <span>Repository URL</span>
                                            <span className="font-bold">
                                                <a
                                                    href={
                                                        singlePackage.repository_url
                                                    }
                                                    target={'_blank'}
                                                    className="flex items-center gap-1 text-blue-500 underline"
                                                >
                                                    {
                                                        singlePackage.repository_url
                                                    }
                                                    <SquareArrowOutUpRight
                                                        className={'h-4 w-4'}
                                                    />
                                                </a>
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <div className="flex flex-col gap-1">
                                                <span>Name</span>
                                                <span className="font-bold">
                                                    {singlePackage.name}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span>Slug</span>
                                                <span className="font-bold">
                                                    {singlePackage.slug}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span>Description</span>
                                            <span className="font-bold">
                                                {singlePackage.description}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">
                                            SEO Data
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col justify-between gap-4">
                                        <div className="flex flex-col gap-1">
                                            <span>Meta Title</span>
                                            <span className="font-bold">
                                                {singlePackage.meta_title}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span>Meta Description</span>
                                            <span className="font-bold">
                                                {singlePackage.meta_description}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="col-span-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">
                                            Repository Data
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col justify-between gap-4">
                                        <div className="flex justify-between gap-4">
                                            <div className="flex flex-col gap-1">
                                                <span>Owner</span>
                                                <Image
                                                    src={
                                                        singlePackage.owner_avatar as string
                                                    }
                                                    alt={singlePackage.owner}
                                                    className="h-12 w-12 rounded-full"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span>Language</span>
                                                <span className="font-bold">
                                                    {singlePackage.language}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <div className="flex flex-col gap-1">
                                                <span>Stars</span>
                                                <span className="font-bold">
                                                    {singlePackage.stars}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span>Status</span>
                                                <span className="font-bold">
                                                    {singlePackage.status.value}
                                                </span>
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
