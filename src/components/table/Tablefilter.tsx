"use client";
import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";

export default function Tablefilter({ data, columns, Button }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // State for current page index
  const t = useTranslations("IndexPage");

  // Filter data based on search query and status
  const filteredData = useMemo(() => {
    return data.filter((row: any) => {
      const matchesSearch = Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      );

      const matchesStatus = filterStatus === "" || row.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, filterStatus]);

  // Create table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: currentPageIndex,
        pageSize: 10,
      },
    },
  });

  const pageCount = table.getPageCount();

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    // Do not reset current page index here
  };

  // Render pagination controls
  const renderPagination = () => {
    return (
      <div className="pagination d-flex align-items-center">
        <button
          className="btn btn-outline-dark mx-1 btn-sm"
          onClick={() => setCurrentPageIndex(0)} // Go to first page
          disabled={currentPageIndex === 0}
        >
          {`<<`}
        </button>
        <button
          className="btn btn-outline-dark mx-1 btn-sm"
          onClick={() => setCurrentPageIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentPageIndex === 0}
        >
          {`<`}
        </button>
        <span className="btn btn-primary mx-1 btn-sm">
          {currentPageIndex + 1}
        </span>
        <button
          className="btn btn-outline-dark mx-1 btn-sm"
          onClick={() =>
            setCurrentPageIndex((prev) => Math.min(prev + 1, pageCount - 1))
          } // Go to next page
          disabled={currentPageIndex >= pageCount - 1 || pageCount === 0}
        >
          {`>`}
        </button>
        <button
          className="btn btn-outline-dark mx-1 btn-sm"
          onClick={() => setCurrentPageIndex(pageCount - 1)} // Go to last page
          disabled={currentPageIndex >= pageCount - 1 || pageCount === 0}
        >
          {`>>`}
        </button>
      </div>
    );
  };

  return (
    <div className="container mt-5 card card-body p-5">
      {/* <div className="row mb-3 align-items-center" style={{ display: "flex" }}>
        <div className="col-auto">
          <input
            type="text"
            className="form-control"
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <select
            className="form-select"
            value={filterStatus}
            onChange={handleFilterChange} // Use new handler
          >
            <option value="">{t("AllStatus")}</option>
            <option value="Active">{t("Active")}</option>
            <option value="Deactive">{t("Deactive")}</option>
       
          </select>
        </div>
        <div className="col-auto ms-auto">{Button}</div>
      </div> */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="thead-dark">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-start">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="text-start p-2">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="text-start p-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  {t("noData")}{" "}
                  {/* Display a message if no data is available */}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span>
          {t("page")} {currentPageIndex + 1} of {pageCount}
        </span>
        {renderPagination()}
      </div>
    </div>
  );
}
