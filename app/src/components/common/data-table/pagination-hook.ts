import { useState } from "react";

interface PageParams {
  pageNumber: number;
  pageSize: number;
  sortInfo?: string;
}

export const usePagination = (defaultPageSize = 10) => {
  const [pageParams, setPageParams] = useState<PageParams>({
    pageNumber: 1,
    pageSize: defaultPageSize,
    sortInfo: "",
  });

  return { pageParams, setPageParams };
};
