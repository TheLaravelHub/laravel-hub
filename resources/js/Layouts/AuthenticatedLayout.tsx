import { usePage } from '@inertiajs/react'
import { Fragment, PropsWithChildren, ReactNode } from 'react'
import { AppSidebar } from '@/components/shared/app-sidebar'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { BreadcrumbType } from '@/types'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/mode-toggle'

export default function Authenticated({
    header,
    breadcrumbs,
    children,
}: PropsWithChildren<{ header?: ReactNode; breadcrumbs?: BreadcrumbType[] }>) {
    return (
        <ThemeProvider
            defaultTheme="dark"
            storageKey="vite-ui-theme"
        >
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex h-16 shrink-0 items-center justify-between gap-2 px-5 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 h-4"
                            />
                            {breadcrumbs && (
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink
                                                href={route('app.feed.home')}
                                            >
                                                Dashboard
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        {breadcrumbs.map((breadcrumb) => (
                                            <Fragment key={breadcrumb.title}>
                                                <BreadcrumbSeparator className="hidden md:block" />
                                                {breadcrumb.link ? (
                                                    <BreadcrumbLink
                                                        href={breadcrumb.link}
                                                    >
                                                        {breadcrumb.title}
                                                    </BreadcrumbLink>
                                                ) : (
                                                    <BreadcrumbItem>
                                                        <BreadcrumbPage>
                                                            {breadcrumb.title}
                                                        </BreadcrumbPage>
                                                    </BreadcrumbItem>
                                                )}
                                            </Fragment>
                                        ))}
                                    </BreadcrumbList>
                                </Breadcrumb>
                            )}
                        </div>
                        <ModeToggle />
                    </div>

                    {children}
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    )
}
