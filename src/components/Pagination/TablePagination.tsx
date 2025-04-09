"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TablePagination = ({
  className,
  totalItems, 
}: {
  className?: string;
  totalItems: number;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const perPageParam = searchParams.get("per_page");
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    Number(perPageParam) || 10
  );

  const [totalPages, setTotalPages] = useState(
    Math.ceil(totalItems / itemsPerPage)
  );

  const currentPageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(
    Number(currentPageParam) || 1
  );

  const params = new URLSearchParams(searchParams.toString());
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    params.set("page", newPage.toString());
    router.push(pathname + "?" + params.toString());
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    params.set("per_page", newItemsPerPage.toString());
    params.set("page", "1"); // Reset to first page whenever items per page changes
    router.push(pathname + "?" + params.toString());
  };

  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`paginate_button page-item ${
            i === currentPage ? "active" : ""
          }`}
        >
          <div
            className="page-link cursor-pointer"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </div>
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="d-flex justify-content-between w-100 p-5">
      <div className="col  d-flex align-items-center justify-content-center justify-content-md-start">
        <div className="dataTables_length" id="kt_datatable_example_1_length">
          <label>
            <select
              name="kt_datatable_example_1_length"
              aria-controls="kt_datatable_example_1"
              className="form-select form-select-sm form-select-solid"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
        {/* <div role="status" aria-live="polite" className="ms-2">
                Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
                {Math.min(
                  (pagination.pageIndex + 1) * pagination.pageSize,
                  bookingData.data.length
                )}{" "}
                of {bookingData.total} records
              </div> */}
        {/* {/* <div
          className="dataTables_info"
          id="kt_datatable_example_1_info"
          role="status"
          aria-live="polite"
        >
          {/* {/ Showing {startRecord} to {endRecord} of {total} records /} */}
          {/* Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
                {Math.min(
                  (pagination.pageIndex + 1) * pagination.pageSize,
                  bookingData.data.length
                )}{" "}
                of {bookingData.total} records */}
        {/* </div> */}  
      </div>
      <div></div>
      <div></div>
      <div></div>
      
      <div></div>
      <div className="col d-flex align-items-center justify-content-center justify-content-md-end">
        <div
          className="dataTables_paginate paging_simple_numbers"
          id="kt_datatable_example_1_paginate"
        >
          <ul className="pagination">
            {totalPages > 0 ? (
              <>
                {/* {/ {totalItems} items /} */}
                <li
                  className={`paginate_button page-item previous ${
                    currentPage === 1 ? "disabled" : ""
                  } border-merchant_text_color_blue !bg-[#FFFFFF] text-merchat_icon2`}
                  id="kt_datatable_example_1_previous"
                >
                  <div
                    aria-controls="kt_datatable_example_1"
                    data-dt-idx={0}
                    tabIndex={0}
                    className="page-link cursor-pointer"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <i className="previous" />
                  </div>
                </li>
                {/* <span className="pl-[5px] pr-[12px]">
              {currentPage} of {totalPages}
            </span> */}
                {renderPageNumbers()}
                <li
                  className={`paginate_button page-item next ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                  //   disabled={currentPage === totalPages}
                  id="kt_datatable_example_1_next"
                >
                  <div
                    aria-controls="kt_datatable_example_1"
                    data-dt-idx={8}
                    tabIndex={0}
                    className="page-link cursor-pointer"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <i className="next" />
                  </div>
                </li>
              </>
            ) : (
              <span>No items to display</span>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
