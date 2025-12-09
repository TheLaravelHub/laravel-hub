import React, { useEffect, useRef, useState } from 'react'
import { Head, useForm } from '@inertiajs/react'
import UserLayout from '@/Layouts/UserLayout'
import InputError from '@/components/input-error'
import InputLabel from '@/components/input-label'
import PrimaryButton from '@/components/primary-button'
import TextInput from '@/components/text-input'
import { PageProps } from '@/types'
import { Package } from 'lucide-react'
import { toast } from 'sonner'
import { Turnstile } from '@marsidev/react-turnstile'

interface CreateProps extends PageProps {}

export default function Create({
    auth,
    flash,
}: CreateProps & { flash: { success?: string } }) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        repository_url: '',
        cf_turnstile_response: '',
    })

    const [token, setToken] = useState('')
    const turnStileRef = useRef()

    useEffect(() => setData('cf_turnstile_response', token), [token])

    const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || null

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success)
        }
    }, [flash])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post(route('app.user.packages.store'), {
            onSuccess: () => {
                // Direct toast call that should work regardless of flash messages
                toast.success('Your package has been submitted for review!')
                reset()
            },
            // @ts-ignore
            onError: () => turnStileRef.current?.reset(),
        })
    }

    return (
        <UserLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Submit a Package
                    </h2>
                </div>
            }
        >
            <Head title="Submit a Package" />

            <div className="grid grid-cols-1 gap-6 p-4">
                <div className="rounded-xl bg-white shadow">
                    <div className="border-b border-border p-6">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                            <Package
                                size={18}
                                className="text-primary"
                            />{' '}
                            Submit Your Package
                        </h3>
                    </div>
                    <div className="p-6">
                        <form
                            onSubmit={handleSubmit}
                            className="mx-auto max-w-2xl space-y-6"
                        >
                            <div>
                                <InputLabel
                                    htmlFor="repository_url"
                                    value="GitHub Repository URL"
                                />
                                <TextInput
                                    id="repository_url"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.repository_url}
                                    onChange={(e) =>
                                        setData(
                                            'repository_url',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    placeholder="https://github.com/username/repository"
                                />
                                <InputError
                                    message={errors.repository_url}
                                    className="mt-2"
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    Enter the full URL to your GitHub repository
                                </p>
                            </div>

                            <div className="mt-4">
                                <Turnstile
                                    ref={turnStileRef}
                                    siteKey={turnstileSiteKey}
                                    onSuccess={setToken}
                                />
                                <InputError
                                    message={errors.cf_turnstile_response}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton
                                    disabled={
                                        processing ||
                                        !data.repository_url ||
                                        !data.cf_turnstile_response
                                    }
                                    className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed"
                                >
                                    Submit Package
                                </PrimaryButton>

                                {recentlySuccessful && (
                                    <p className="text-sm text-gray-600">
                                        Submitted successfully.
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}
