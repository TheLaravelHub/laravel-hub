import { PropsWithChildren, ReactNode } from 'react'
import { UserNavbar } from '@/components/shared/user-navbar'
import { ThemeProvider } from '@/components/theme-provider'

export default function UserLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    return (
        <ThemeProvider
            defaultTheme="dark"
            storageKey="vite-ui-theme"
        >
            <div className="min-h-screen bg-background">
                <UserNavbar />

                {header && (
                    <header className="border-b border-border bg-background">
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
