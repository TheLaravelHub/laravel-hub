import InputError from '@/components/input-error'
import { Transition } from '@headlessui/react'
import { Link, useForm, usePage } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Check, Mail, User, AtSign } from 'lucide-react'

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean
    status?: string
    className?: string
}) {
    const user = usePage().props.auth.user
    console.log(user)

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            username: user.username,
        })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        patch(route('user.profile.information.update'))
    }

    return (
        <section className={className}>
            <p className="mb-6 text-sm text-gray-600">
                Update your account's profile information and email address.
            </p>

            <form
                onSubmit={submit}
                className="space-y-6"
            >
                <div className="rounded-lg border border-border bg-white p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                            <User
                                size={18}
                                className="text-primary"
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="name"
                                className="text-base font-medium text-gray-800"
                            >
                                Name
                            </Label>
                            <p className="text-xs text-gray-600">
                                Your full name as displayed on your profile
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 pl-11">
                        <Input
                            id="name"
                            className="block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                        <InputError
                            className="mt-2"
                            message={errors.name}
                        />
                    </div>
                </div>

                <div className="rounded-lg border border-border bg-white p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                            <AtSign
                                size={18}
                                className="text-primary"
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="username"
                                className="text-base font-medium text-gray-800"
                            >
                                Username
                            </Label>
                            <p className="text-xs text-gray-600">
                                Your username as displayed on your profile
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 pl-11">
                        <Input
                            id="username"
                            className="block w-full"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <InputError
                            className="mt-2"
                            message={errors.username}
                        />
                    </div>
                </div>

                <div className="rounded-lg border border-border bg-white p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                            <Mail
                                size={18}
                                className="text-primary"
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="email"
                                className="text-base font-medium text-gray-800"
                            >
                                Email
                            </Label>
                            <p className="text-xs text-gray-600">
                                Your email address for notifications and account
                                recovery
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 pl-11">
                        <Input
                            id="email"
                            type="email"
                            className="block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="email"
                        />
                        <InputError
                            className="mt-2"
                            message={errors.email}
                        />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/30 dark:bg-yellow-900/10">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1 font-medium text-yellow-600 underline hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                        >
                            <span className="mr-2">Update Profile</span>
                            {processing ? (
                                <svg
                                    className="h-4 w-4 animate-spin"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            ) : null}
                        </Button>
                    </motion.div>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                            <Check size={16} />
                            <span>Saved successfully</span>
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    )
}
