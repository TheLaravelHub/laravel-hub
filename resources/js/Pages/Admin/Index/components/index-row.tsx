import { Index as IndexType } from '@/types'
import { Link, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import Image from '@/components/image'
import { Switch } from '@/components/ui/switch'
import moment from 'moment/moment'
import { FilePenLine, Trash2 } from 'lucide-react'
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

const IndexRow = ({ index }: { index: IndexType }) => {
    const [isChecked, setIsChecked] = useState(index.status === 'active')
    const toggleStatusForm = useForm({ status: index.status })
    const deleteIndexForm = useForm({})
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

    const openDeleteDialog = () => {
        setIsDeleteDialogOpen(true)
    }

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false)
    }

    const handleToggleStatus = (checked: boolean) => {
        setIsChecked(checked)
        const modelName = 'Index'
        toggleStatusForm.put(
            route('admin.toggle-status', { model: modelName, id: index.id }),
            {
                preserveScroll: true,
            },
        )
    }

    const handleDomainDeletion = () => {
        deleteIndexForm.delete(route('admin.indexes.destroy', index.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteDialogOpen(false)
            },
        })
    }

    return (
        <>
            <TableRow>
                <TableCell className="font-medium">{index.id}</TableCell>
                <TableCell>{index.name}</TableCell>
                <TableCell>
                    <Image
                        src={index.icon}
                        alt={index.name}
                        className="h-8 w-8 rounded-full"
                    />
                </TableCell>
                <TableCell>{index.slug}</TableCell>
                <TableCell>
                    <Switch
                        checked={isChecked}
                        onCheckedChange={handleToggleStatus}
                    />
                </TableCell>
                <TableCell>{moment(index.created_at).fromNow()}</TableCell>
                <TableCell className="text-right">
                    <div className="jusify-end flex items-center gap-2">
                        <Link
                            className="rounded-full bg-primary px-3 py-2 text-white"
                            href={route('admin.indexes.edit', index.id)}
                            title="Edit index"
                        >
                            <FilePenLine className="w-4" />
                        </Link>
                        <button
                            onClick={openDeleteDialog}
                            className="rounded-full bg-red-500 px-3 py-2 text-white"
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
                            index{' '}
                            <span className="text-primary">({index.name})</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeDeleteDialog}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDomainDeletion}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default IndexRow
