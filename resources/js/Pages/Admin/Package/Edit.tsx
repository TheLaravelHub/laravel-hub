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
import { BeatLoader } from 'react-spinners'
import { Switch } from '@/components/ui/switch'
import Image from '@/components/image'
import { Target } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'
import SingleSelect from '@/components/single-select'
import { Package, SelectOption } from '@/types'
import MultiSelect from '@/components/multi-select'

interface EditProps {
    package: Package
    indexes: SelectOption[]
    categories: SelectOption[]
}

const Edit = ({ package: singlePackage, indexes, categories }: EditProps) => {
    const { slugify } = useSlugify()
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const { post, data, setData, processing, errors, reset, isDirty } =
        useForm<{
            _method: string
            index_id: string | number | null
            category_ids: string[]
            repository_url: string
            name: string
            slug: string
            description: string | undefined
            meta_title: string
            meta_description: string
            language: string | undefined
            stars: number
            owner: string | undefined
            owner_avatar: string | undefined
            active: boolean
        }>('editForm', {
            _method: 'put',
            index_id: singlePackage.index_id,
            category_ids: singlePackage.category_ids,
            repository_url: singlePackage.repository_url,
            name: singlePackage.name,
            slug: singlePackage.slug,
            description: singlePackage.description,
            meta_title: singlePackage.meta_title,
            meta_description: singlePackage.meta_description,
            language: singlePackage.language,
            stars: singlePackage.stars,
            owner: singlePackage.owner,
            owner_avatar: singlePackage.owner_avatar,
            active: singlePackage.status === 'active',
        })

    const getRepositoryData = async () => {
        if (!confirm('Are you sure you want to re-fetch repository data?')) {
            return
        }

        setIsFetching(true)
        await axios
            .get(route('admin.packages.get-repository-data'), {
                params: {
                    repository_url: data.repository_url,
                },
            })
            .then((response) => {
                const data = response.data

                setData('name', data.name)
                setData('meta_title', data.name)
                setData('description', data.description)
                setData('meta_description', data.description)
                setData('language', data.language)
                setData('stars', data.stars)
                setData('owner', data.owner)
                setData('owner_avatar', data.owner_avatar)

                setIsFetching(false)
            })
            .catch((error) => {
                console.error(error)
                setIsFetching(false)
            })
    }

    const handleUpdating = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        post(route('admin.packages.packages.update', singlePackage.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
            },
        })
    }

    return (
        <AdminAuthenticatedLayout
            breadcrumbs={[
                {
                    title: 'Packages',
                    link: route('admin.packages.packages.index'),
                },
                {
                    title: `Edit: ${singlePackage.name}`,
                },
            ]}
        >
            <Head title={`Packages | Edit: ${singlePackage.name}`} />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="min-h-[100vh] flex-1 rounded-xl bg-gray-50 shadow dark:bg-gray-900 md:min-h-min">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <form onSubmit={handleUpdating}>
                            <div className="grid grid-cols-8 gap-4">
                                <div className="col-span-8 space-y-6 lg:col-span-6">
                                    <Card>
                                        <CardContent className="flex flex-col justify-center gap-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="index_id">
                                                    Index{' '}
                                                    <span
                                                        className="text-xl text-red-900"
                                                        title="Required"
                                                    >
                                                        *
                                                    </span>
                                                </Label>
                                                <SingleSelect
                                                    options={indexes}
                                                    value={
                                                        indexes.find(
                                                            (option) =>
                                                                option.value ===
                                                                data.index_id,
                                                        ) || null
                                                    }
                                                    onChange={(
                                                        selectedOption,
                                                    ) =>
                                                        setData(
                                                            'index_id',
                                                            selectedOption?.value ??
                                                                null,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.index_id}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="category_ids">
                                                    Categories{' '}
                                                    <span
                                                        className="text-xl text-red-900"
                                                        title="Required"
                                                    >
                                                        *
                                                    </span>
                                                </Label>

                                                <MultiSelect
                                                    options={categories}
                                                    value={categories.filter(
                                                        (option) =>
                                                            data.category_ids
                                                                ?.map(String)
                                                                .includes(
                                                                    option.value.toString(),
                                                                ),
                                                    )} // Use data.category_ids instead of singlePackage
                                                    onChange={(
                                                        selectedOptions,
                                                    ) => {
                                                        const selectedValues =
                                                            selectedOptions.map(
                                                                (option) =>
                                                                    option.value.toString(),
                                                            ) // Ensure values are strings
                                                        setData(
                                                            'category_ids',
                                                            selectedValues,
                                                        ) // Update Inertia form data correctly
                                                    }}
                                                />

                                                <InputError
                                                    message={errors.index_id}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Basic Data</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex flex-col justify-center gap-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-end justify-between gap-2">
                                                    <div className="flex-1">
                                                        <Label htmlFor="repository_url">
                                                            Repository URL{' '}
                                                            <span
                                                                className="text-xl text-red-900"
                                                                title="Required"
                                                            >
                                                                *
                                                            </span>
                                                        </Label>
                                                        <Input
                                                            id="repository_url"
                                                            type="url"
                                                            placeholder="Repository URL"
                                                            value={
                                                                data.repository_url
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'repository_url',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.repository_url
                                                            }
                                                        />
                                                    </div>
                                                    <Button
                                                        disabled={
                                                            !data.repository_url ||
                                                            isFetching
                                                        }
                                                        type={'button'}
                                                        onClick={
                                                            getRepositoryData
                                                        }
                                                    >
                                                        {isFetching ? (
                                                            <BeatLoader
                                                                color="#fff"
                                                                loading={true}
                                                                size={5}
                                                                aria-label="Loading Spinner"
                                                                data-testid="loader"
                                                            />
                                                        ) : (
                                                            <Target />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
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
                                                    placeholder="Package Name"
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
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="description">
                                                    Description
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    placeholder="Description .."
                                                    value={data.description}
                                                    onChange={(e) =>
                                                        setData(
                                                            'description',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.description}
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
                                <div className="col-span-8 space-y-6 lg:col-span-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Repository Data
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex flex-col justify-center gap-4">
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="language">
                                                    Language{' '}
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="language"
                                                    disabled={true}
                                                    value={data.language}
                                                />
                                                <InputError
                                                    message={errors.language}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="stars">
                                                    Stars{' '}
                                                </Label>
                                                <Input
                                                    type="number"
                                                    id="stars"
                                                    disabled={true}
                                                    value={data.stars}
                                                />
                                                <InputError
                                                    message={errors.stars}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor="owner">
                                                    Owner{' '}
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="owner"
                                                    disabled={true}
                                                    value={data.owner}
                                                />
                                                <InputError
                                                    message={errors.owner}
                                                />
                                            </div>
                                            {data.owner_avatar && (
                                                <div className="flex flex-col gap-1">
                                                    <Image
                                                        src={
                                                            data.owner_avatar as string
                                                        }
                                                        width={50}
                                                        height={50}
                                                    />
                                                </div>
                                            )}

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
                                                    <BeatLoader
                                                        color="#fff"
                                                        loading={true}
                                                        size={5}
                                                        aria-label="Loading Spinner"
                                                        data-testid="loader"
                                                    />
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
