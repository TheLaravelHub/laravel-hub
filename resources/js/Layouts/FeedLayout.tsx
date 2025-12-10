import { PropsWithChildren, ReactNode, useEffect } from 'react'
import { FeedNavbar } from '@/components/shared/feed-navbar'
import { ThemeProvider } from '@/components/theme-provider'
import { CustomToaster, CustomToast } from '@/components/ui/custom-toast'
import { usePage } from '@inertiajs/react'

interface FeedLayoutProps extends PropsWithChildren<{ header?: ReactNode }> {
    searchQuery?: string
    onSearch?: (query: string) => void
    onClearSearch?: () => void
}

export default function FeedLayout({
    header,
    children,
    searchQuery,
    onSearch,
    onClearSearch,
}: FeedLayoutProps) {
    const { flash } = usePage().props as unknown as {
        flash: { success?: string; error?: string; message?: string }
    }

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
                <FeedNavbar
                    searchQuery={searchQuery}
                    onSearch={onSearch}
                    onClearSearch={onClearSearch}
                />

                {header && (
                    <header className="border-b border-border bg-white">
                        <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <main>
                    <div className="mx-auto">{children}</div>
                </main>
            </div>
        </ThemeProvider>
    )
}
