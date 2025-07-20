import InputError from '@/components/input-error'
import { Transition } from '@headlessui/react'
import { useForm } from '@inertiajs/react'
import { FormEventHandler, useRef } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Check, KeyRound, Lock, ShieldCheck } from 'lucide-react'

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string
}) {
    const passwordInput = useRef<HTMLInputElement>(null)
    const currentPasswordInput = useRef<HTMLInputElement>(null)

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault()

        put(route('user.profile.security.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation')
                    passwordInput.current?.focus()
                }

                if (errors.current_password) {
                    reset('current_password')
                    currentPasswordInput.current?.focus()
                }
            },
        })
    }

    return (
        <section className={className}>
            <p className="mb-6 text-sm text-muted-foreground">
                Ensure your account is using a long, random password to stay
                secure.
            </p>

            <form
                onSubmit={updatePassword}
                className="space-y-6"
            >
                <div className="rounded-lg border border-border bg-card/50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                            <KeyRound
                                size={18}
                                className="text-primary"
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="current_password"
                                className="text-base font-medium"
                            >
                                Current Password
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Enter your current password to verify your
                                identity
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 pl-11">
                        <Input
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            type="password"
                            className="block w-full"
                            autoComplete="current-password"
                        />

                        <InputError
                            message={errors.current_password}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="rounded-lg border border-border bg-card/50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                            <Lock
                                size={18}
                                className="text-primary"
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="password"
                                className="text-base font-medium"
                            >
                                New Password
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Choose a strong password with at least 8
                                characters
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 pl-11">
                        <Input
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            type="password"
                            className="block w-full"
                            autoComplete="new-password"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="rounded-lg border border-border bg-card/50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                            <ShieldCheck
                                size={18}
                                className="text-primary"
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="password_confirmation"
                                className="text-base font-medium"
                            >
                                Confirm Password
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Re-enter your new password to confirm
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 pl-11">
                        <Input
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            type="password"
                            className="block w-full"
                            autoComplete="new-password"
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            disabled={processing}
                            type="submit"
                            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                        >
                            <span className="mr-2">Update Password</span>
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
                            <span>Password updated</span>
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    )
}
