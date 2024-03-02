import React from "react";
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/solid";
import { Button, PageButton } from "../../utils/button-table";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useFilters,
  useSortBy,
  usePagination,
} from "react-table"; // new
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
    <span>
      Search:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
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

    //new
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
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

  // Render the UI for your table
  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      {headerGroups.map((headerGroup) =>
        headerGroup.headers.map((column) =>
          column.Filter ? (
            <div key={column.id}>
              <label for={column.id}>{column.render("Header")}: </label>
              {column.render("Filter")}
            </div>
          ) : null
        )
      )}
      <div className="mt-2 flex flex-col">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200"
              >
                <thead className="bg-gray-50">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
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
                  {page.map((row, i) => {
                    // new
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="px-6 py-4 whitespace-nowrap"
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
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
          <div className="d-flex gap-2">
            <span className="text-sm text-secondary">
              Page <span className="fw-bold">{state.pageIndex + 1}</span> of{" "}
              <span className="fw-bold">{pageOptions.length}</span>
            </span>
            <select
              className="form-select"
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
            <nav aria-label="Pagination">
              <ul className="pagination">
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                  >
                    <span className="visually-hidden">First</span>
                    {/* Replace ChevronDoubleLeftIcon with appropriate icon */}
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                  >
                    <span className="visually-hidden">Previous</span>
                    {/* Replace ChevronLeftIcon with appropriate icon */}
                  </button>
                </li>
                {/* Implement current page button if necessary */}
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                  >
                    <span className="visually-hidden">Next</span>
                    {/* Replace ChevronRightIcon with appropriate icon */}
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                  >
                    <span className="visually-hidden">Last</span>
                    {/* Replace ChevronDoubleRightIcon with appropriate icon */}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div>
        {/* new */}
        <pre>
          <code>{JSON.stringify(state, null, 2)}</code>
        </pre>
      </div>
    </>
  );
}

export default Table;
