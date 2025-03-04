import { Category } from '@/types'
import { Link, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import Image from '@/components/image'
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

interface CategoryRowProps {
    baseRoute: string
    category: Category
}

const CategoryRow = ({ baseRoute, category }: CategoryRowProps) => {
    const [isChecked, setIsChecked] = useState(category.status.value === 'active')
    const toggleStatusForm = useForm({ status: category.status })
    const deleteForm = useForm({})
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

    const openDeleteDialog = () => {
        setIsDeleteDialogOpen(true)
    }

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false)
    }

    const handleToggleStatus = (checked: boolean) => {
        if(! checked && ! confirm('Are you sure? this will deactivate the category and all it\'s related models')) return;
        setIsChecked(checked)
        const modelName = 'Category'
        toggleStatusForm.put(
            route('admin.toggle-status', { model: modelName, id: category.id }),
            {
                preserveScroll: true,
            },
        )
    }

    const handleCategoryDeletion = () => {
        deleteForm.delete(route(`${baseRoute}.destroy`, category.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteDialogOpen(false)
            },
        })
    }

    return (
        <>
            <TableRow>
                <TableCell className="font-medium">{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>{category.packages_count}</TableCell>
                <TableCell>
                    <Switch
                        checked={isChecked}
                        onCheckedChange={handleToggleStatus}
                    />
                </TableCell>
                <TableCell>{moment(category.created_at).fromNow()}</TableCell>
                <TableCell className="text-right">
                    <div className="flex items-center gap-2">
                        <Link
                            className="rounded-full bg-green-700 px-3 py-2 text-white"
                            href={route(`${baseRoute}.show`, category.id)}
                            title="Edit category"
                        >
                            <Eye className="w-4" />
                        </Link>
                        <Link
                            className="rounded-full bg-primary px-3 py-2 text-white"
                            href={route(`${baseRoute}.edit`, category.id)}
                            title="Edit category"
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
                            category{' '}
                            <span className="text-primary">
                                ({category.name})
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeDeleteDialog}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleCategoryDeletion}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default CategoryRow
