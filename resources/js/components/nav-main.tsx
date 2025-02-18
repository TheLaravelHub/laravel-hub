'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Link, router } from '@inertiajs/react'

type ItemProps = {
    title: string
    url: string
    mainRoute?: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
        title: string
        url: string
    }[]
}

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        mainRoute?: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
}) {
    const isCurrent = (item: ItemProps) => {
        return (
            route().current()?.toString().includes(item.mainRoute as string) ||
            route().current(item.mainRoute as string) ||
            route().current(`${item.mainRoute}.index` as string) ||
            route().current(`${item.mainRoute}.create` as string) ||
            route().current(`${item.mainRoute}.show` as string) ||
            route().current(`${item.mainRoute}.edit` as string) ||
            false
        )
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) =>
                    item.items ? (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger
                                    asChild
                                    onClick={() =>
                                        item.url !== '#' &&
                                        router.push({ url: item.url })
                                    }
                                >
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        isActive={isCurrent(item)}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items.map((subItem) => (
                                            <SidebarMenuSubItem
                                                key={subItem.title}
                                            >
                                                <Link href={subItem.url}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                    >
                                                        <span>
                                                            {subItem.title}
                                                        </span>
                                                    </SidebarMenuSubButton>
                                                </Link>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : (
                        <SidebarMenuItem key={item.url}>
                            <Link href={item.url}>
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    isActive={isCurrent(item)}
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    )
}
