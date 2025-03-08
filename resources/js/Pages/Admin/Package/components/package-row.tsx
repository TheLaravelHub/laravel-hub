import { Package } from '@/types'
import { Link, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import moment from 'moment/moment'
import { Eye, FilePenLine, Trash2 } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import Image from '@/components/image'

const PackageRow = ({ single_package }: { single_package: Package }) => {
    const [isChecked, setIsChecked] = useState(
        single_package.status === 'active',
    )
    const toggleStatusForm = useForm({ status: single_package.status })
    const deleteForm = useForm({})
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

    const openDeleteDialog = () => {
        setIsDeleteDialogOpen(true)
    }

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false)
    }

    const handleToggleStatus = (checked: boolean) => {
        setIsChecked(checked)
        const modelName = 'Package'
        toggleStatusForm.put(
            route('admin.toggle-status', {
                model: modelName,
                id: single_package.id,
            }),
            {
                preserveScroll: true,
            },
        )
    }

    const handleDeletion = () => {
        deleteForm.delete(
            route('admin.packages.packages.destroy', single_package.id),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false)
                },
            },
        )
    }

    return (
        <>
            <TableRow>
                <TableCell className="font-medium">
                    {single_package.id}
                </TableCell>
                <TableCell>{single_package.name}</TableCell>
                <TableCell>{single_package.index?.name}</TableCell>
                <TableCell>
                    {single_package.categories?.map((category) => (
                        <Badge
                            key={category.id}
                            variant={'outline'}
                            className="mr-1"
                        >
                            {category.name}
                        </Badge>
                    ))}
                </TableCell>
                <TableCell>
                    <Switch
                        checked={isChecked}
                        onCheckedChange={handleToggleStatus}
                    />
                </TableCell>
                <TableCell>
                    <Image
                        src={single_package.owner_avatar as string}
                        title={single_package.owner}
                        alt={single_package.owner}
                        className="h-8 w-8 rounded-full"
                    />
                </TableCell>
                <TableCell>
                    {moment(single_package.created_at).fromNow()}
                </TableCell>
                <TableCell className="text-right">
                    <div className="jusify-end flex items-center gap-2">
                        <Link
                            className="rounded-full bg-green-700 px-3 py-2 text-white"
                            href={route(
                                'admin.packages.packages.show',
                                single_package.id,
                            )}
                            title="Show package"
                        >
                            <Eye className="w-4" />
                        </Link>
                        <Link
                            className="rounded-full bg-primary px-3 py-2 text-white"
                            href={route(
                                'admin.packages.packages.edit',
                                single_package.id,
                            )}
                            title="Edit package"
                        >
                            <FilePenLine className="w-4" />
                        </Link>
                        <button
                            onClick={openDeleteDialog}
                            className="rounded-full bg-red-500 px-3 py-2 text-white"
                            title="Delete package"
                        >
                            <Trash2 className="w-4" />
                        </button>
                    </div>
                </TableCell>
            </TableRow>

            <AlertDialog open={isDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will delete the
                            package{' '}
                            <span className="text-primary">
                                ({single_package.name})
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeDeleteDialog}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletion}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default PackageRow
