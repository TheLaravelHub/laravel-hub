import { PropsWithChildren, ReactNode, useEffect } from 'react'
import { UserNavbar } from '@/components/shared/user-navbar'
import { ThemeProvider } from '@/components/theme-provider'
import { CustomToaster, CustomToast } from '@/components/ui/custom-toast'
import { usePage } from '@inertiajs/react'
import { FeedNavbar } from '@/components/shared/feed-navbar'

export default function UserLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { flash } = usePage().props as unknown as {
        flash: { success?: string; error?: string; message?: string }
    }

    // Using custom toast component

    useEffect(() => {
        if (flash?.success) {
            CustomToast.success(flash.success)
        }
        if (flash?.error) {
            CustomToast.error(flash.error)
        }
        if (flash?.message) {
            CustomToast.info(flash.message)
        }
    }, [flash])
    return (
        <ThemeProvider
            defaultTheme="light"
            storageKey="vite-ui-theme"
        >
            <div className="min-h-screen bg-white">
                <CustomToaster />
                <FeedNavbar />

                {header && (
                    <header className="border-b border-border bg-white">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <main>
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </ThemeProvider>
    )
}
