import { Config } from 'ziggy-js'

export interface User {
    id: number
    name: string
    email: string
    username: string
    email_verified_at?: string
    avatar?: string
    packages?: Package[]
    packages_count?: number
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

export type Index = {
    id: number | string
    name: string
    description: string
    slug: string
    icon: string
    color_code: string
    packages_count: number
    status: { value: 'active' } | { value: 'inactive' }
    created_at: string
    updated_at: string
}

export type Category = {
    id: number
    name: string
    slug: string
    meta_title: string
    meta_description: string
    packages_count: number
    packages: {
        data: Package[]
        meta: MetaType
        links: LinksType
    }
    status: { value: 'active' } | { value: 'inactive' }
    created_at: string
    updated_at: string
}

type Package = {
    id: number
    index_id: number
    indexes: Index[]
    categories: Category[]
    category_ids: string[]
    name: string
    slug: string
    description?: string
    meta_title: string
    meta_description: string
    repository_url: string
    language?: string
    stars: number
    owner?: string
    owner_avatar?: string
    og_image?: string
    // status: { value: 'active' } | { value: 'inactive' }
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
}

type BlogPost = {
    id: number
    categories: Category[]
    title: string
    sub_title: string
    slug: string
    content: string
    meta_title?: string
    meta_description?: string
    image?: string
    views_count?: number
    status: 'draft' | 'published' | 'scheduled'
    published_at: string
    created_at: string
    updated_at: string
}

export type LinkType = {
    active: boolean
    label: string
    url: string | null
}

export type MetaType = {
    current_page: number
    from: number
    last_page: number
    links: LinkType[]
    per_page: number
    to: number
    total: number
}

export type LinksType = {
    first: string
    last: string
    prev: string
    next: string
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

export interface SelectOption {
    value: string | number
    label: string
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export type PackageSubmission = {
    id: number
    user_id: number
    repository_url: string
    status: ReviewStatus
    created_at: string
    updated_at: string
}

export type SocialAccountsSettings = {
    github: string
    x: string
    facebook: string
    telegram: string
    bluesky: string
    linkedin: string
}
