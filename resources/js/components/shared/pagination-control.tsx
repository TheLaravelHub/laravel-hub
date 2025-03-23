import React from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from '@/components/ui/pagination'

interface PaginationControlProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function PaginationControl({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationControlProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = []
        
        // Always show first page
        pageNumbers.push(1)
        
        // Calculate range around current page
        let rangeStart = Math.max(2, currentPage - 1)
        let rangeEnd = Math.min(totalPages - 1, currentPage + 1)
        
        // Add ellipsis after first page if needed
        if (rangeStart > 2) {
            pageNumbers.push('ellipsis1')
        }
        
        // Add pages in range
        for (let i = rangeStart; i <= rangeEnd; i++) {
            pageNumbers.push(i)
        }
        
        // Add ellipsis before last page if needed
        if (rangeEnd < totalPages - 1) {
            pageNumbers.push('ellipsis2')
        }
        
        // Always show last page if there is more than one page
        if (totalPages > 1) {
            pageNumbers.push(totalPages)
        }
        
        return pageNumbers
    }

    const pageNumbers = getPageNumbers()

    return (
        <Pagination>
            <PaginationContent>
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious 
                            href="#" 
                            onClick={(e) => {
                                e.preventDefault()
                                onPageChange(currentPage - 1)
                            }} 
                        />
                    </PaginationItem>
                )}

                {pageNumbers.map((page, index) => {
                    if (page === 'ellipsis1' || page === 'ellipsis2') {
                        return (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )
                    }

                    return (
                        <PaginationItem key={`page-${page}`}>
                            <PaginationLink
                                href="#"
                                isActive={page === currentPage}
                                onClick={(e) => {
                                    e.preventDefault()
                                    onPageChange(page as number)
                                }}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })}

                {currentPage < totalPages && (
                    <PaginationItem>
                        <PaginationNext 
                            href="#" 
                            onClick={(e) => {
                                e.preventDefault()
                                onPageChange(currentPage + 1)
                            }} 
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    )
}
