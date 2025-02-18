import { Head, Link } from '@inertiajs/react'
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Category, LinksType, MetaType } from '@/types'
import { PlusCircleIcon } from 'lucide-react'
import Paginator from '@/components/paginator'
import CategoryRow from '@/Pages/Admin/Category/components/category-row'

interface IndexProps {
    title: string
    baseRoute: string
    categories: {
        data: Category[]
        meta: MetaType
        links: LinksType
    }
}

const Index = ({ title, baseRoute, categories }: IndexProps) => {
    return (
        <AdminAuthenticatedLayout breadcrumbs={[{ title }]}>
            <Head title={title} />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="min-h-[100vh] flex-1 md:min-h-min">
                    <Card className="p-6 text-gray-900 dark:text-gray-100">
                        <CardHeader className="w-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-4xl">
                                {title}
                            </CardTitle>
                            <Link
                                className="btn-primary"
                                href={route(`${baseRoute}.create`)}
                            >
                                Create <PlusCircleIcon className="w-5" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">
                                            #
                                        </TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created at</TableHead>
                                        <TableHead>
                                            Action
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.data.length ? (
                                        categories.data.map((category, key) => (
                                            <CategoryRow
                                                key={key}
                                                baseRoute={baseRoute}
                                                category={category}
                                            />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-4 text-center"
                                            >
                                                No data found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>

                        <CardFooter>
                            {/* Reusable Paginator Component */}
                            <Paginator links={categories.meta.links} />
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    )
}

export default Index
