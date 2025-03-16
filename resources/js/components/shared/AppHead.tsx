import { Head } from '@inertiajs/react'

export default function AppHead({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) {
    return (
        <Head>
            <title>{title ? `${title} - My App` : 'My App'}</title>
            {children}
        </Head>
    )
}
