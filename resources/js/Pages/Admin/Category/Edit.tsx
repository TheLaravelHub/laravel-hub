import { Head, useForm } from '@inertiajs/react'
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import InputError from '@/components/input-error'
import useSlugify from '@/hooks/use-slugify'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Category } from '@/types'

interface EditCategoryProps {
    baseRoute: string
    category: Category
}

const Edit = ({ baseRoute, category }: EditCategoryProps) => {
    const { slugify } = useSlugify()
    const { post, data, setData, processing, errors, isDirty, reset } =
        useForm<{
            name: string
            slug: string
            meta_title: string
            meta_description: string
            active: boolean
            _method: 'PUT'
        }>({
            name: category.name,
            slug: category.slug,
            meta_title: category.meta_title ?? '',
            meta_description: category.meta_description ?? '',
            active: category.status === 'active',
            _method: 'PUT',
        })

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        post(route(`${baseRoute}.update`, category.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
            },
        })
    }

    return (
        <AdminAuthenticatedLayout
            breadcrumbs={[
                { title: 'Categories', link: route(`${baseRoute}.index`) },
                {
                    title: `Edit: ${category.name}`,
                },
            ]}
        >
            <Head title={`Categories | Edit: ${category.name}`} />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="min-h-[100vh] flex-1 rounded-xl bg-gray-50 shadow dark:bg-gray-900 md:min-h-min">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <form onSubmit={handleUpdate}>
                            <div className="grid grid-cols-8 gap-4">
                                <div className="col-span-8 space-y-6 lg:col-span-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Basic Data</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex flex-col justify-center gap-4">
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="name">
                                                    Name{' '}
                                                    <span
                                                        className="text-xl text-red-900"
                                                        title="Required"
                                                    >
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    placeholder="Index Name"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.name}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="slug">
                                                    Slug
                                                </Label>
                                                <Input
                                                    id="slug"
                                                    type="text"
                                                    placeholder="Slug"
                                                    value={slugify(data.name)}
                                                    disabled={true}
                                                />
                                                <InputError
                                                    message={errors.slug}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>SEO Data</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex flex-col justify-center gap-4">
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="name">
                                                    Meta title
                                                </Label>
                                                <Input
                                                    id="meta_title"
                                                    type="text"
                                                    placeholder="Meta title"
                                                    value={data.meta_title}
                                                    onChange={(e) =>
                                                        setData(
                                                            'meta_title',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.meta_title}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="meta_description">
                                                    Meta Description
                                                </Label>
                                                <Textarea
                                                    id="meta_description"
                                                    placeholder="Meta Description .."
                                                    value={
                                                        data.meta_description
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'meta_description',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.meta_description
                                                    }
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="col-span-8 lg:col-span-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Status & Media
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex flex-col justify-center gap-4">
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="active">
                                                    Status{' '}
                                                    <span
                                                        className="text-xl text-red-900"
                                                        title="Required"
                                                    >
                                                        *
                                                    </span>
                                                </Label>
                                                <Switch
                                                    checked={data.active}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) => {
                                                        setData(
                                                            'active',
                                                            checked,
                                                        )
                                                    }}
                                                />
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-start gap-4">
                                            {/*Reset button*/}
                                            <Button
                                                disabled={
                                                    !isDirty || processing
                                                }
                                                type="button"
                                                onClick={() => reset()}
                                                className="my-3 bg-green-600"
                                            >
                                                Reset
                                            </Button>
                                            <Button
                                                disabled={
                                                    !isDirty || processing
                                                }
                                                type="submit"
                                                className="my-3"
                                            >
                                                {processing ? (
                                                    <span className="loading loading-dots loading-xl"></span>
                                                ) : (
                                                    'Update'
                                                )}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    )
}

export default Edit
