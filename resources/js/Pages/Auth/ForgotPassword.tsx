import InputError from '@/components/input-error'
import PrimaryButton from '@/components/primary-button'
import TextInput from '@/components/text-input'
import GuestLayout from '@/Layouts/GuestLayout'
import { Head, useForm } from '@inertiajs/react'
import React, { FormEventHandler, useEffect, useRef, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        cf_turnstile_response: '',
    })

    const [token, setToken] = useState('')
    const turnStileRef = useRef()

    useEffect(() => setData('cf_turnstile_response', token), [token])

    const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || null

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('password.email'), {
            onSuccess: function () {
                // @ts-ignore
                turnStileRef.current?.reset()
                reset('email', 'cf_turnstile_response')
            },
            // @ts-ignore
            onError: () => turnStileRef.current?.reset(),
        })
    }

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4 text-sm text-gray-600">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will
                allow you to choose a new one.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError
                    message={errors.email}
                    className="mt-2"
                />

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

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton
                        className="ms-4 disabled:cursor-not-allowed"
                        disabled={
                            processing ||
                            !data.email ||
                            !data.cf_turnstile_response
                        }
                    >
                        Email Password Reset Link
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    )
}
