import React, { useMemo, useRef, useState } from "react";
import { format, parse, startOfDay, sub } from "date-fns";

interface PageParams {
  pageNumber: number;
  pageSize: number;
}

interface PaginationContextInterface {
  pageParams: PageParams;
  setPageParams: (pageParams: PageParams) => void;
}

export const PaginationContext =
  React.createContext<PaginationContextInterface>({
    pageParams: { pageNumber: 1, pageSize: 10 },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setPageParams: () => {},
  });

export const PaginationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pageParams, setPageParams] = useState<PageParams>({
    pageNumber: 1,
    pageSize: 10,
  });

  return (
    <PaginationContext.Provider value={{ pageParams, setPageParams }}>
      {children}
    </PaginationContext.Provider>
  );
};

export const usePaginationContext = () => {
  const context = React.useContext(PaginationContext);
  if (context === undefined) {
    throw new Error(
      "usePaginationContext must be used within a PaginationProvider"
    );
  }
  return context;
};
