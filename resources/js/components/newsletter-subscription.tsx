import React from 'react'
import { motion } from 'framer-motion'
import { useForm } from '@inertiajs/react'

export default function NewsletterSubscription() {
    // Use Inertia form
    const form = useForm({
        email: '',
    })

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        form.post(route('newsletter.subscribe'), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset('email')
            },
        })
    }

    return (
        <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-8 shadow-xl md:p-12">
                <div className="bg-grid-white/10 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6),transparent)]" />
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-40 w-40 rounded-full bg-white/20 blur-2xl" />

                <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
                    <div className="md:max-w-md">
                        <motion.h2
                            className="mb-4 text-2xl font-bold text-white md:text-3xl"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: 'spring', stiffness: 100 }}
                        >
                            Join Our Newsletter
                        </motion.h2>
                        <motion.p
                            className="mb-6 text-white/90"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: 0.1,
                                type: 'spring',
                                stiffness: 100,
                            }}
                        >
                            Stay updated with the latest Laravel packages,
                            tutorials, and exclusive content. We'll never spam
                            your inbox.
                        </motion.p>
                    </div>

                    <div className="flex w-full flex-col gap-3 md:w-auto">
                        <motion.form
                            onSubmit={handleSubmit}
                            className="flex w-full flex-col gap-3 sm:flex-row md:gap-0"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: 0.2,
                                type: 'spring',
                                stiffness: 100,
                            }}
                        >
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="h-12 min-w-[240px] flex-1 rounded-lg border-0 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/20 md:rounded-r-none"
                                required
                                disabled={form.processing}
                                value={form.data.email}
                                onChange={(e) =>
                                    form.setData('email', e.target.value)
                                }
                            />
                            <button
                                type="submit"
                                className="h-12 rounded-lg bg-white px-6 font-medium text-primary transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70 md:rounded-l-none"
                                disabled={form.processing}
                            >
                                {form.processing
                                    ? 'Subscribing...'
                                    : 'Subscribe'}
                            </button>
                        </motion.form>

                        {form.errors.email && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded bg-red-100 p-2 text-sm text-red-800"
                            >
                                {form.errors.email}
                            </motion.div>
                        )}

                        {form.recentlySuccessful && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded bg-green-100 p-2 text-sm text-green-800"
                            >
                                Thank you for subscribing to our newsletter!
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
