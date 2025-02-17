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
import { Index as IndexType } from '@/types'
import { PlusCircleIcon } from 'lucide-react'
import IndexRow from '@/Pages/Admin/Index/components/index-row'
import Paginator from '@/components/paginator'

type LinkType = {
    active: boolean
    label: string
    url: string | null
}

interface IndexProps {
    indexes: {
        data: IndexType[]
        meta: {
            current_page: number
            from: number
            last_page: number
            links: LinkType[]
        }
        links: {
            first: string
            last: string
            prev: string
            next: string
        }
    }
}

const Index = ({ indexes }: IndexProps) => {
    return (
        <AdminAuthenticatedLayout breadcrumbs={[{ title: 'Indexes' }]}>
            <Head title="Indexes" />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="min-h-[100vh] flex-1 md:min-h-min">
                    <Card className="p-6 text-gray-900 dark:text-gray-100">
                        <CardHeader className="w-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-4xl">Indexes</CardTitle>
                            <Link
                                className="btn-primary"
                                href={route('admin.indexes.create')}
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
                                        <TableHead>Icon</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created at</TableHead>
                                        <TableHead className="text-right">
                                            Action
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {indexes.data.length ? (
                                        indexes.data.map((index, key) => (
                                            <IndexRow
                                                key={key}
                                                index={index}
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
                            <Paginator links={indexes.meta.links} />
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    )
}

export default Index
