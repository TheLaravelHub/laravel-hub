import { Head, Link } from '@inertiajs/react'
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Category } from '@/types'
import Packages from "@/Pages/Admin/Category/components/packages";

interface ShowCategoryProps {
    baseRoute: string
    category: Category
}

const Show = ({ baseRoute, category }: ShowCategoryProps) => {
    return (
        <AdminAuthenticatedLayout
            breadcrumbs={[
                { title: 'Categories', link: route(`${baseRoute}.index`) },
                {
                    title: `Show: ${category.name}`,
                },
            ]}
        >
            <Head title={`Categories | Show: ${category.name}`} />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="mb-4 flex w-full items-center justify-between px-4 pt-4">
                    <h1 className="text-2xl font-semibold">
                        Show: {category.name}
                    </h1>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route(`${baseRoute}.edit`, category.id)}
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
                                                    {category.name}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span>Slug</span>
                                                <span className="font-bold">
                                                    {category.slug}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="col-span-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">
                                            SEO Data
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col justify-between gap-4">
                                        {category.meta_title && (
                                            <div className="flex flex-col gap-1">
                                                <span>Meta Title</span>
                                                <span className="font-bold">
                                                    {category.meta_title}
                                                </span>
                                            </div>
                                        )}

                                        {category.meta_description && (
                                            <div className="flex flex-col gap-1">
                                                <span>Meta Description</span>
                                                <span className="font-bold">
                                                    {category.meta_description}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-1">
                                            <span>Status</span>
                                            <span className="font-bold">
                                                {category.status.value}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="col-span-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">
                                            Packages ({category.packages_count})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col justify-between gap-4">
                                        <Packages packages={category.packages}/>
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
