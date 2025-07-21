"use client"
import BlackButton from './BlackButton'

const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    isLoading = false,
    showInfo = true
}) => {
    // Fix the calculation to handle edge cases
    const startItem = totalItems === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1
    const endItem = totalItems === 0 ? 0 : Math.min(currentPage * itemsPerPage, totalItems)

    const generatePageNumbers = () => {
        const pages = []
        const maxVisiblePages = 7

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Smart pagination with ellipsis
            if (currentPage <= 4) {
                // Show first 5 pages + ellipsis + last page
                for (let i = 1; i <= 5; i++) {
                    pages.push(i)
                }
                if (totalPages > 6) {
                    pages.push('...')
                    pages.push(totalPages)
                }
            } else if (currentPage >= totalPages - 3) {
                // Show first page + ellipsis + last 5 pages
                pages.push(1)
                if (totalPages > 6) {
                    pages.push('...')
                }
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                // Show first page + ellipsis + current-1, current, current+1 + ellipsis + last page
                pages.push(1)
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            }
        }

        return pages
    }

    const pages = generatePageNumbers()

    // Don't show pagination if there are no results or only 1 page
    if (totalPages <= 1) {
        return null
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
            {showInfo && (
                <div className="text-sm text-gray-700">
                    {totalItems === 0 ? (
                        "No results found"
                    ) : (
                        `Showing ${startItem} to ${endItem} of ${totalItems} result${totalItems === 1 ? '' : 's'}`
                    )}
                </div>
            )}

            <div className="flex items-center gap-1 sm:gap-2">
                <BlackButton
                    size="sm"
                    variant="outline"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                    className="mr-1"
                >
                    Previous
                </BlackButton>

                {/* Page numbers */}
                {pages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
                                ...
                            </span>
                        )
                    }

                    return (
                        <BlackButton
                            key={page}
                            size="sm"
                            variant={page === currentPage ? "solid" : "outline"}
                            onClick={() => onPageChange(page)}
                            disabled={isLoading}
                            className={page === currentPage ? "bg-black text-white hover:bg-gray-800" : ""}
                        >
                            {page}
                        </BlackButton>
                    )
                })}

                <BlackButton
                    size="sm"
                    variant="outline"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    className="ml-1"
                >
                    Next
                </BlackButton>
            </div>
        </div>
    )
}

export default Pagination