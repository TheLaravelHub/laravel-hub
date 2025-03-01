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
import { LinksType, MetaType, Package } from '@/types'
import { PlusCircleIcon } from 'lucide-react'
import PackageRow from '@/Pages/Admin/Package/components/package-row'
import Paginator from '@/components/paginator'

type LinkType = {
    active: boolean
    label: string
    url: string | null
}

interface IndexProps {
    packages: {
        data: Package[]
        meta: MetaType
        links: LinksType
    }
    packagesCount: number
}

const Index = ({ packages, packagesCount }: IndexProps) => {
    return (
        <AdminAuthenticatedLayout breadcrumbs={[{ title: 'Packages' }]}>
            <Head title="Packages" />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="min-h-[100vh] flex-1 md:min-h-min">
                    <Card className="p-6 text-gray-900 dark:text-gray-100">
                        <CardHeader className="w-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-4xl">
                                Packages ({packagesCount})
                            </CardTitle>
                            <Link
                                className="btn-primary"
                                href={route('admin.packages.packages.create')}
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
                                        <TableHead>Index</TableHead>
                                        <TableHead>Categories</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Created at</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {packages.data.length ? (
                                        packages.data.map(
                                            (single_package, key) => (
                                                <PackageRow
                                                    key={key}
                                                    single_package={
                                                        single_package
                                                    }
                                                />
                                            ),
                                        )
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
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
                            <Paginator links={packages.meta.links} />
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    )
}

export default Index
