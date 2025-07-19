import Checkbox from '@/components/checkbox'
import InputError from '@/components/input-error'
import InputLabel from '@/components/input-label'
import PrimaryButton from '@/components/primary-button'
import TextInput from '@/components/text-input'
import GuestLayout from '@/Layouts/GuestLayout'
import { Head, Link, useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import { Github } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string
    canResetPassword: boolean
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('login'), {
            onFinish: () => reset('password'),
        })
    }

    return (
        <GuestLayout>
            <Head title="Log in" />
            
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-foreground">
                    Welcome Back
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Sign in to your account
                </p>
            </div>
            
            {/* GitHub Login Button */}
            <div className="mb-6">
                <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={'/auth/social/github'}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    <Github size={18} />
                    <span>Continue with GitHub</span>
                </motion.a>
            </div>
            
            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-card px-2 text-muted-foreground">
                        Or continue with email
                    </span>
                </div>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError
                        message={errors.email}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError
                        message={errors.password}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-muted-foreground">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                Forgot your password?
                            </Link>
                        )}
                        
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <PrimaryButton
                                className="px-6 py-2.5"
                                disabled={processing}
                            >
                                Sign In
                            </PrimaryButton>
                        </motion.div>
                    </div>
                    
                    <div className="text-center">
                        <Link
                            href={route('register')}
                            className="text-sm text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Don't have an account? Register now
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    )
}
