import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
    PaginationLink,
} from '@/components/ui/pagination'
import { router } from '@inertiajs/react'

interface PaginatorProps {
    links: {
        url: string | null
        label: string
        active: boolean
    }[]
}

export default function Paginator({ links }: PaginatorProps) {
    if (links.length <= 3) return null // Hide pagination if there's only one page

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.visit(url, { preserveScroll: true, preserveState: true })
        }
    }

    return (
        <Pagination className="mt-6 flex justify-center">
            <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                    {links[0].url ? (
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(links[0].url)
                            }}
                        />
                    ) : (
                        <span className="cursor-not-allowed px-4 py-2 opacity-50">
                            ← Prev
                        </span>
                    )}
                </PaginationItem>

                {/* Page Numbers */}
                {links.map((link, index) => {
                    if (index === 0 || index === links.length - 1) return null // Skip first & last (Prev/Next)

                    if (link.label === '...') {
                        return (
                            <PaginationItem key={index}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )
                    }

                    return (
                        <PaginationItem key={index}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handlePageChange(link.url)
                                }}
                                className={
                                    link.active
                                        ? 'bg-primary font-bold text-white'
                                        : ''
                                }
                                dangerouslySetInnerHTML={{ __html: link.label }} // Render page numbers correctly
                            />
                        </PaginationItem>
                    )
                })}

                {/* Next Button */}
                <PaginationItem>
                    {links[links.length - 1].url ? (
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(links[links.length - 1].url)
                            }}
                        />
                    ) : (
                        <span className="cursor-not-allowed px-4 py-2 opacity-50">
                            Next →
                        </span>
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
