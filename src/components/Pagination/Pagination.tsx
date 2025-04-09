import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';


const Pagination = ({
    className,
    totalItems,
    itemsPerPage,
    onPageChange,
}: {
    className: string;
    totalItems: number | any;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
 
}) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [totalPages, setTotalPages] = useState(
        Math.ceil(totalItems / itemsPerPage),
    );

    const currentPageParam = searchParams.get("page");
    const [currentPage, setCurrentPage] = useState<number>(
        Number(currentPageParam) || 1, // Start from page 1
    )

    const params = new URLSearchParams(searchParams.toString());
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
            params.set("page", newPage.toString());
            router.push(`${pathname}?${params.toString()}`);
        }
    };

    useEffect(() => {
        setTotalPages(Math.ceil(totalItems / itemsPerPage));
    }, [totalItems, itemsPerPage]);

    return (
        <div className={`${className}`}>
            {totalPages > 0 ? (
            <div className="dataTables_paginate paging_simple_numbers">
                <ul className="pagination">
                    <li className={`paginate_button page-item previous text-blue ${currentPage === 1 ? 'disabled' : ''}`}>
                        <Link
                            href="#"
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="page-link "
                        >
                            <i className="previous "></i>
                        </Link>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                        <li
                            key={index}
                            className={`paginate_button page-item text-blue ${currentPage === index + 1 ? 'active bg-blue rounded-3 text-white' : ''}`}
                        >
                            <button
                                onClick={() => handlePageChange(index + 1)}
                                className="page-link cursor-pointer"
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`paginate_button page-item next ${currentPage === totalPages ? 'disabled' : ''}`} >
                        <Link
                            href="#"
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="page-link"
                        >
                            <i className="next"></i>
                        </Link>
                    </li>
                </ul>
            </div>
            ) : (
                <span>No items to display</span> 
            )}
        </div>
    );
};

export default Pagination;
