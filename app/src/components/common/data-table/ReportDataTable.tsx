import {
  deserializeSorting,
  serializeSorting,
} from "@/components/common/data-table/sorting";
import { cn } from "@/lib/utils";
import type { PageInfo } from "@/server/api/routers/affiliates/reports/reports-utils";
import type {
  ColumnDef,
  ColumnSort,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { usePagination } from "./pagination-hook";

export type ReportDataTableProps<Data extends object> = {
  report:
    | { data: Data[] | null | undefined; pageInfo: PageInfo; totals?: any }
    | null
    | undefined;
  columns: ColumnDef<Data, any>[];
  footerData?: any;
  pagination: ReturnType<typeof usePagination>;
};

export function ReportDataTable<Data extends object>({
  report,
  columns,
  footerData = [],
  pagination: {
    pageParams: { sortInfo, pageNumber, pageSize },
    setPageParams,
  },
}: ReportDataTableProps<Data>) {
  const contextSorting = deserializeSorting(sortInfo);
  const onSortingChange = (sort_id: string) => {
    // console.log(`muly:onSortingChange cur_sorting`, { sort_id });
    let existing_sorting = [...contextSorting];
    let new_sorting: SortingState = [];

    const matched_sort_index = existing_sorting.findIndex(
      (x) => x.id === sort_id
    );
    if (matched_sort_index >= 0) {
      const matched_sort = { ...existing_sorting[matched_sort_index] };
      // console.log("xian: matched_sort_index", matched_sort);
      existing_sorting = existing_sorting.filter(
        (x, index) => index !== matched_sort_index
      );

      if (matched_sort.desc === false) {
        matched_sort.desc = true;
        new_sorting = [{ ...matched_sort } as ColumnSort, ...existing_sorting];
      } else {
        new_sorting = existing_sorting;
      }
    } else {
      new_sorting = [{ id: sort_id, desc: false }, ...existing_sorting];
    }

    // console.log("**********NEW SORTING", JSON.stringify(new_sorting));
    setPageParams({
      pageNumber,
      pageSize,
      sortInfo: serializeSorting(new_sorting),
    });
  };

  // will not use sort feature.
  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data: report?.data ?? [],
    getCoreRowModel: getCoreRowModel(),
    // onSortingChange,
    // getSortedRowModel: getSortedRowModel(),
    // state: {
    //   sorting: contextSorting,
    // },
    // manualSorting: true,
    // enableSorting: true,
    // enableSortingRemoval: true,
    // maxMultiSortColCount: 3,
    // enableMultiSort: true,
    // manualPagination: true,
    // initialState: { pagination: { pageSize: 50, pageIndex: 0 } },
  });
  const headers = [];
  return (
    <div className="scrollbar-thin relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          {getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border border-[#F0F0F0] bg-[#F2F5F7] text-left"
            >
              {headerGroup.headers.map((header) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta = header.column.columnDef.meta;
                headers.push(header.column.columnDef.header);
                const matched_sort = contextSorting.find(
                  (x) => x.id === header.column.id
                );
                let sorted = "";
                if (matched_sort) {
                  sorted = matched_sort.desc === true ? "desc" : "asc";
                } else {
                  sorted = "";
                }
                return (
                  <th
                    key={header.id}
                    // onClick={header.column.getToggleSortingHandler()}
                    onClick={() =>
                      // TODO: Clean this up
                      // @ts-ignore
                      onSortingChange(header.column.columnDef?.accessorKey)
                    }
                    className="border"
                  >
                    <div className="text=[#323232] flex p-2 text-sm">
                      {flexRender(
                        // TODO: Clean this up
                        // @ts-ignore
                        header.column.columnDef?.title,
                        header.getContext()
                      )}

                      <span className="flex items-center pl-2">
                        {sorted !== "" ? (
                          sorted === "desc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        ) : null}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              className={cn([{ "bg-[#F9FAFF]": index % 2 === 0 }])}
            >
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta;
                return (
                  <td
                    key={cell.id}
                    className={cn("border px-2 py-1 text-sm text-[#404040]", {
                      // @ts-ignore
                      "text-right": meta?.isNumeric,
                    })}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>

        {/*{footerData && (*/}
        {/*  <tfoot className="px-3 py-3">*/}
        {/*    <tr className="py-5">*/}
        {/*      <td>Total</td>*/}
        {/*      {footerData.length > 0 &&*/}
        {/*        Object.values(footerData[0]).map((item: any, key) => {*/}
        {/*          return <td key={key}>{item}</td>;*/}
        {/*        })}*/}
        {/*    </tr>*/}
        {/*  </tfoot>*/}
        {/*)}*/}
      </table>
    </div>
  );
}
