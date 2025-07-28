import InputError from '@/components/input-error'
import InputLabel from '@/components/input-label'
import PrimaryButton from '@/components/primary-button'
import TextInput from '@/components/text-input'
import GuestLayout from '@/Layouts/GuestLayout'
import { Head, useForm } from '@inertiajs/react'
import React, { FormEventHandler, useEffect, useRef, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'

export default function ResetPassword({
    token,
    email,
}: {
    token: string
    email: string
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
        cf_turnstile_response: '',
    })

    const [captchaToken, setCaptchaToken] = useState('')
    const turnStileRef = useRef()

    useEffect(
        () => setData('cf_turnstile_response', captchaToken),
        [captchaToken],
    )

    const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || null

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('password.store'), {
            onSuccess: () =>
                reset(
                    'password',
                    'password_confirmation',
                    'cf_turnstile_response',
                ),
            // @ts-ignore
            onError: () => turnStileRef.current?.reset(),
        })
    }

    return (
        <GuestLayout>
            <Head title="Reset Password" />

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
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError
                        message={errors.password}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4">
                    <Turnstile
                        ref={turnStileRef}
                        siteKey={turnstileSiteKey}
                        onSuccess={setCaptchaToken}
                    />
                    <InputError
                        message={errors.cf_turnstile_response}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton
                        className="ms-4 disabled:cursor-not-allowed"
                        disabled={
                            processing ||
                            !data.email ||
                            !data.password ||
                            !data.password_confirmation ||
                            !data.cf_turnstile_response
                        }
                    >
                        Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    )
}
