import React, { useContext } from "react";
import { useQuery } from "react-query";
import { GraphqlClientContext } from "./App";

export default function useData(key, fetcher, variables = {}) {
  const [page, setPage] = React.useState({ index: 0, cursor: null, size: 25 });
  const graphqlClient = useContext(GraphqlClientContext);

  const { data, query } = useQuery(
    [key, page.size, page.cursor, ...Object.entries(variables)],
    fetcher(graphqlClient)(page.size, page.cursor, variables)
  );

  const nextPageCursor = data?.after;
  function nextPage() {
    if (!nextPageCursor) return;
    setPage((page) => ({
      ...page,
      index: page.index + 1,
      cursor: nextPageCursor,
    }));
  }

  const prevPageCursor = data?.before;
  function prevPage() {
    if (!prevPageCursor) return;
    setPage((page) => ({
      ...page,
      index: page.index - 1,
      cursor: prevPageCursor,
    }));
  }

  function changeSize(size) {
    if (size === page.size) return;
    setPage((page) => ({ index: page.index, cursor: null, size }));
  }

  function updateData({ pageIndex, pageSize }) {
    if (pageSize !== page.size) changeSize(pageSize);
    else if (pageIndex === page.index) return;
    else if (pageIndex > page.index) nextPage();
    else prevPage();
  }

  const canNextPage = !!nextPageCursor;

  return {
    ...query,
    data: data?.data || [],
    size: page.size,
    // page + 1 gives actual number of pages (page is an index started from 0)
    // Number(canNextPage) increase the pageCount by 1 if true
    pageCount: page.index + 1 + Number(canNextPage),
    updateData,
  };
}
