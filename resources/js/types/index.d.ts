import { Config } from 'ziggy-js'

export interface User {
    id: number
    name: string
    email: string
    email_verified_at?: string
}

export type BreadcrumbType = {
    title: string
    link?: string
}
export interface Admin {
    id: number
    name: string
    email: string
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        admin: Admin
        user: User
    }
    ziggy: Config & { location: string }
}
