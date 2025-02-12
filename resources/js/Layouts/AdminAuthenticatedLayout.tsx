import ApplicationLogo from '@/components/application-logo';
import Dropdown from '@/components/dropdown';
import NavLink from '@/components/nav-link';
import ResponsiveNavLink from '@/components/responsive-nav-link';
import { Link, usePage } from '@inertiajs/react';
import {Fragment, PropsWithChildren, ReactNode, useState} from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {BreadcrumbType} from "@/types";
import {ThemeProvider} from "@/components/theme-provider";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/shared/app-sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {ModeToggle} from "@/components/mode-toggle";
import {AdminSidebar} from "@/components/shared/admin-sidebar";


export default function Authenticated({
      breadcrumbs,
      children,
    }: PropsWithChildren<{ breadcrumbs?: BreadcrumbType[] }>) {

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider>
                <AdminSidebar />
                <SidebarInset>
                    <div className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-5">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            {breadcrumbs && (
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink href={route('dashboard')}>
                                                Dashboard
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        {breadcrumbs.map((breadcrumb) => (
                                            <Fragment key={breadcrumb.title}>
                                                <BreadcrumbSeparator className="hidden md:block" />
                                                {breadcrumb.link ? (
                                                    <BreadcrumbLink href={breadcrumb.link}>
                                                        {breadcrumb.title}
                                                    </BreadcrumbLink>
                                                ) : (
                                                    <BreadcrumbItem>
                                                        <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                                                    </BreadcrumbItem>
                                                )}
                                            </Fragment>
                                        ))}
                                    </BreadcrumbList>
                                </Breadcrumb>
                            )}
                        </div>
                        <ModeToggle/>
                    </div>

                    {children}
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}
