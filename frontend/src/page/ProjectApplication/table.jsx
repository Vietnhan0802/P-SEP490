import React from "react";
import { CiSearch } from "react-icons/ci";
import { MdFirstPage } from "react-icons/md";
import { MdLastPage } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useFilters,
  useSortBy,
  usePagination,
} from "react-table"; // new
import "./projectApplication.scss";
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      name={id}
      id={id}
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span className="global-search">
      <div className="post-form p-2 d-flex flex-grid align-items-center justify-content-between row m-0">
        <div className="d-flex post-search align-items-center position-relative col me-2">
          <CiSearch className="" />
          <input
            type="text"
            onChange={(e) => {
              setValue(e.target.value);
              onChange(e.target.value);
            }}
            placeholder={`${count} records...`}
            className="search-box size-20"
          />
        </div>
      </div>
    </span>
  );
}

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,

    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination // new
  );
  const noDataAvailable = data.length === 0;
  // Render the UI for your table
  return (
    <>
      <div className="d-flex size-20 justify-content-between align-items-center">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) =>
            column.Filter ? (
              <div key={column.id} id="select-custom">
                <label for={column.id}>{column.render("Header")}: </label>
                {column.render("Filter")}
              </div>
            ) : null
          )
        )}
      </div>

      <div className="flex flex-col">
        <div className="over-x-auto">
          <table
            {...getTableProps()}
            className="min-w-full"
            style={{
              borderCollapse: "separate",
              borderSpacing: "0 1px",
              minWidth: "100%",
            }}
          >
            <thead className="bg-gray-50">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    // Add the sorting props to control sorting. For this example
                    // we can add them into the header props
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      {/* Add a sort direction indicator */}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " ▼"
                            : " ▲"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody
              {...getTableBodyProps()}
              className="bg-white divide-y divide-gray-200"
            >
              {noDataAvailable ? (
                // Render this row if there's no data
                <tr>
                  <td colSpan="100%" className="text-center py-3">
                    No data available
                  </td>
                </tr>
              ) : (
                // Render page rows if data is available
                page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td
                          className="px-2 py-3 whitespace-nowrap"
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="py-3 d-flex align-items-center justify-content-between">
        <div className="flex-grow-1 d-flex justify-content-between d-block d-sm-none">
          <button
            className="btn btn-primary"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            Next
          </button>
        </div>
        <div className="d-none d-sm-flex flex-grow-1 align-items-center justify-content-between">
          <div className="d-flex gap-2 w-100 align-items-center">
            <span className=" ">
              Page <span className="fw-bold">{state.pageIndex + 1}</span> of{" "}
              <span className="fw-bold">{pageOptions.length}</span>
            </span>
            <select
              className="form-select w-auto"
              value={state.pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div>
            <nav aria-label="Pagination ">
              <ul className="pagination mb-0">
                <li className="page-item">
                  <button
                    className="page-link d-flex"
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                  >
                    <MdFirstPage />
                    {/* <span>First</span> */}
                    {/* Replace ChevronDoubleLeftIcon with appropriate icon */}
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className="page-link d-flex"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                  >
                    <MdNavigateBefore />
                    {/* Replace ChevronLeftIcon with appropriate icon */}
                  </button>
                </li>
                {/* Implement current page button if necessary */}
                <li className="page-item">
                  <button
                    className="page-link d-flex"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                  >
                    <MdNavigateNext />
                    {/* Replace ChevronRightIcon with appropriate icon */}
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className="page-link d-flex"
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                  >
                    <MdLastPage />

                    {/* Replace ChevronDoubleRightIcon with appropriate icon */}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default Table;
