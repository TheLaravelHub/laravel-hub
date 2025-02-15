import { Head, Link } from '@inertiajs/react'
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'

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

type LinkType = {
    active: boolean
    label: string
    url: string | undefined
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
                            {/* Pagination using ShadCN */}
                            {indexes.meta.links.length > 3 && (
                                <Pagination className="mt-6 flex justify-center">
                                    <PaginationContent>
                                        {/* Previous Button */}
                                        <PaginationItem>
                                            {indexes.meta.links[0].url ? (
                                                <PaginationPrevious href={indexes.meta.links[0].url} />
                                            ) : (
                                                <span className="cursor-not-allowed opacity-50 px-4 py-2">← Prev</span>
                                            )}
                                        </PaginationItem>

                                        {/* Page Numbers */}
                                        {indexes.meta.links.map((link, index) => {
                                            if (index === 0 || index === indexes.meta.links.length - 1) return null; // Skip first & last (Prev/Next)

                                            if (link.label === "...") {
                                                return (
                                                    <PaginationItem key={index}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }

                                            return (
                                                <PaginationItem key={index}>
                                                    <PaginationLink
                                                        href={link.url || "#"}
                                                        className={link.active ? "bg-primary text-white font-bold" : ""}
                                                        dangerouslySetInnerHTML={{ __html: link.label }} // Render page numbers
                                                    />
                                                </PaginationItem>
                                            );
                                        })}

                                        {/* Next Button */}
                                        <PaginationItem>
                                            {indexes.meta.links[indexes.meta.links.length - 1].url ? (
                                                <PaginationNext href={indexes.meta.links[indexes.meta.links.length - 1].url} />
                                            ) : (
                                                <span className="cursor-not-allowed opacity-50 px-4 py-2">Next →</span>
                                            )}
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    )
}

export default Index
