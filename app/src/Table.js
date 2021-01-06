import React from "react";
import { useTable, usePagination } from "react-table";
import "./Table.scss";

const pageSizeVariants = [25, 50, 75, 100];

export default function Table({
  columns,
  data,
  fetchData,
  loading,
  initialPageSize,
  pageCount: controlledPageCount,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: initialPageSize },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    usePagination
  );

  function changeSize(e) {
    setPageSize(Number(e.target.value));
  }

  React.useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  return (
    <>
      <table {...getTableProps()}>
        <thead>{headerGroups.map(renderHeaderGroup)}</thead>
        <tbody {...getTableBodyProps()}>
          {page.map(renderPage(prepareRow))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={previousPage} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={nextPage} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <select value={pageSize} onChange={changeSize}>
          {pageSizeVariants.map(renderOption)}
        </select>
      </div>
    </>
  );
}

function renderHeaderGroup(headerGroup) {
  return (
    <tr {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((column) => (
        <th {...column.getHeaderProps()}>{column.render("Header")}</th>
      ))}
    </tr>
  );
}

function renderPage(prepareRow) {
  return function (row, i) {
    prepareRow(row);
    return (
      <tr {...row.getRowProps()}>
        {row.cells.map((cell) => {
          return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
        })}
      </tr>
    );
  };
}

function renderOption(val) {
  return (
    <option key={val} value={val}>
      Show {val}
    </option>
  );
}
