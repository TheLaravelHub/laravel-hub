import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import PackageRow from "@/Pages/Admin/Package/components/package-row";
import Paginator from "@/components/paginator";
import {LinksType, MetaType, Package} from "@/types";

interface PackagesProps {
    packages: {
        data: Package[]
        meta: MetaType
        links: LinksType
    }
}

const Packages = ({packages}: PackagesProps) => {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="min-h-[100vh] flex-1 md:min-h-min">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">#</TableHead>
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
                            packages.data.map((single_package, key) => (
                                <PackageRow
                                    key={key}
                                    single_package={single_package}
                                />
                            ))
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
                <Paginator links={packages.meta.links} />
            </div>
        </div>
    )
};

export default Packages;
